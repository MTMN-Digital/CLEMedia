import { useState, useMemo } from "react";
import {
  listRows,
  useLoad,
  formatEuro,
  downloadPath,
  type Order,
  reissueDownload,
  formatDateTime,
} from "@/lib/admin";
import {
  TextInput,
  useToast,
  StatusPill,
  Avatar,
  AdminButton,
  AdminLinkButton,
  useConfirm,
  DataTable,
  PageHeader,
} from "@/components/admin/kit";
import { Tiles } from "./Tiles";
import "./shop.css";

/* ============================================================================
   Orders, as Stripe's webhook wrote them. Newest first, read only.

   The one thing the console can do to an order is give the buyer a fresh
   link: the same token, another 24 hours, the count back to nought, through
   the admin_reissue_download function the database checks itself. The job
   this screen exists for is a buyer who lost their link, so the search is
   by the email Stripe collected, and the full link is shown so it can be
   pasted into a reply.
   ========================================================================== */

/** The whole address, origin included, so it can be sent as it is. */
function fullLink(token: string): string {
  return `${window.location.origin}${downloadPath(token)}`;
}

export function Orders() {
  const toast = useToast();
  const confirm = useConfirm();
  const [typed, setTyped] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const orders = useLoad(
    () =>
      listRows("orders", {
        order: [{ column: "created_at", ascending: false }],
        ilike: { column: "payer_email", value: query },
        limit: 200,
      }),
    [query],
  );
  const products = useLoad(() => listRows("products", { columns: "id, title" }), []);
  const titles = useMemo(() => new Map((products.data ?? []).map((p) => [p.id, p.title])), [products.data]);
  const titleOf = (o: Order) => titles.get(o.product_id) ?? "A product no longer on the shelf";

  async function renew(o: Order) {
    const ok = await confirm({
      title: "Give this buyer a fresh link?",
      body: `The link for ${titleOf(o)} will work for another 24 hours and five downloads. Send it to ${o.payer_email ?? "the buyer"} yourself: nothing is emailed from here.`,
      confirmLabel: "Give a fresh link",
      destructive: false,
    });
    if (!ok) return;
    setBusy(o.id);
    const r = await reissueDownload(o.id);
    setBusy(null);
    if (r.error !== null) {
      toast(r.error, "error");
      return;
    }
    setShown((s) => ({ ...s, [o.id]: fullLink(r.data.token) }));
    toast("Link renewed");
    orders.reload();
  }

  async function copy(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      toast("Link copied");
    } catch {
      toast("Could not copy on this device. Select the link and copy it yourself.", "error");
    }
  }

  const expired = (o: Order) => new Date(o.expires_at).getTime() < Date.now();

  const list = orders.data ?? [];
  const paid = list.reduce((n, o) => n + (o.amount_cents ?? 0), 0);
  const lapsed = list.filter(expired).length;
  const buyers = new Set(list.map((o) => o.payer_email).filter(Boolean)).size;

  return (
    <div className="shop">
      <PageHeader
        back={{ to: "/admin/shop", label: "Back to the shop" }}
        title="Orders"
        actions={<AdminLinkButton to="/admin/shop">Products</AdminLinkButton>}
      />

      {orders.data && (
        <Tiles
          label="Order figures"
          items={[
            { label: "Orders", value: list.length, meta: query ? "matching" : "newest 200", tone: "blue" },
            { label: "Paid", value: formatEuro(paid) || "\u20ac0.00", tone: "green" },
            { label: "Buyers", value: buyers },
            { label: "Links expired", value: lapsed, meta: lapsed ? "can be renewed" : "all live", tone: lapsed ? "amber" : "plain" },
          ]}
        />
      )}

      <form
        role="search"
        className="adm-card mb-6 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(typed.trim());
        }}
      >
        <TextInput
          label="Find an order by email"
          type="search"
          value={typed}
          onChange={setTyped}
          className="min-w-0 flex-1 basis-64"
          hint="Any part of the address the buyer paid with."
          autoComplete="off"
        />
        <div className="flex gap-2 pb-7">
          <AdminButton type="submit" variant="quiet">
            Search
          </AdminButton>
          {query && (
            <AdminButton
              variant="quiet"
              onClick={() => {
                setTyped("");
                setQuery("");
              }}
            >
              Show all
            </AdminButton>
          )}
        </div>
      </form>

      {query && !orders.loading && orders.data && (
        <p className="adm-muted mb-4" role="status">
          {orders.data.length === 0
            ? `No orders match "${query}".`
            : `${orders.data.length} ${orders.data.length === 1 ? "order matches" : "orders match"} "${query}".`}
        </p>
      )}

      <DataTable
        rows={orders.data}
        loading={orders.loading}
        error={orders.error}
        rowKey={(o) => o.id}
        caption="Orders, newest first"
        empty={
          query
            ? { title: "No orders with that email", body: "Check the spelling, or try a shorter part of the address." }
            : { title: "No orders yet", body: "Each purchase appears here as soon as Stripe confirms the payment." }
        }
        columns={[
          {
            key: "product",
            label: "Product",
            primary: true,
            render: (o) => (
              <span className="shop-buyer">
                <Avatar name={null} email={o.payer_email} size={36} />
                <span className="shop-buyer__t">
                  <b>{titleOf(o)}</b>
                  <span>{formatDateTime(o.created_at)}</span>
                </span>
              </span>
            ),
          },
          { key: "amount", label: "Paid", numeric: true, render: (o) => formatEuro(o.amount_cents) || "Not recorded" },
          { key: "email", label: "Buyer's email", render: (o) => o.payer_email ?? "Not recorded" },
          {
            key: "consent",
            label: "Agreed to download straight away",
            hideOnPhone: true,
            render: (o) => (o.withdrawal_consent_at ? formatDateTime(o.withdrawal_consent_at) : "Not recorded"),
          },
          {
            key: "downloads",
            label: "Downloads used",
            numeric: true,
            render: (o) => (
              <span className="shop-dl">
                {o.download_count} of {o.max_downloads}
                <span className="shop-dl__bar" aria-hidden="true">
                  <i style={{ width: `${Math.min(100, (o.download_count / Math.max(1, o.max_downloads)) * 100)}%` }} />
                </span>
              </span>
            ),
          },
          {
            key: "expires",
            label: "Link works until",
            render: (o) =>
              expired(o) ? (
                <>
                  <StatusPill tone="warn">Expired</StatusPill>{" "}
                  <span className="adm-muted">{formatDateTime(o.expires_at)}</span>
                </>
              ) : (
                formatDateTime(o.expires_at)
              ),
          },
          {
            key: "link",
            label: "Download link",
            render: (o) => {
              const link = shown[o.id];
              return (
                <div className="flex flex-col items-start gap-2">
                  {link && (
                    <p className="max-w-[36ch] break-all font-mono text-[13px] leading-[1.5]">{link}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {link ? (
                      <AdminButton variant="quiet" size="sm" onClick={() => void copy(link)}>
                        Copy link
                      </AdminButton>
                    ) : (
                      <AdminButton
                        variant="quiet"
                        size="sm"
                        onClick={() => setShown((s) => ({ ...s, [o.id]: fullLink(o.download_token) }))}
                      >
                        Show link
                      </AdminButton>
                    )}
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => void renew(o)}
                      busy={busy === o.id}
                      busyLabel="Renewing"
                    >
                      Give a fresh link
                    </AdminButton>
                  </div>
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}
