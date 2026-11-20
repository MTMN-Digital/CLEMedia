import { useState, useMemo } from "react";
import { useParams, Routes, Route, Link } from "react-router-dom";
import { useLoad, formatDate, formatDateTime } from "@/lib/admin";
import { ROUTE_LABEL, replyHref, money, KIND_LABEL, setHandled, listInbox, type InboxItem } from "@/lib/inbox";
import { type GlanceTone, Ring, EmptyState, Stat, Avatar, useToast, GlanceCard, DotStrip, AdminLinkButton, Segmented, AdminButton, Tag, Notice, PageHeader } from "@/components/admin/kit";
import "./inbox.css";

/* Inbox: every enquiry, sign-up and order in one list. Desk shows the list
   and the open item side by side; a phone shows one or the other. */

type Kind = "enquiry" | "all" | "signup" | "order";
type View = "new" | "all";

const KIND_TONE: Record<InboxItem["kind"], GlanceTone> = { enquiry: "brand", signup: "info", order: "ok" };

export function InboxPanel() {
  return (
    <Routes>
      <Route index element={<InboxView />} />
      <Route path=":key" element={<InboxView />} />
    </Routes>
  );
}

function whoOf(i: InboxItem): string {
  return i.name || i.email || "No name";
}

function preview(i: InboxItem): string {
  if (i.order) return `${i.order.productTitle}, ${money(i.order.amountCents, i.order.currency)}`;
  if (i.message) return i.message.replace(/\s+/g, " ");
  return i.kind === "signup" ? "Joined the list" : "No message";
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });
  return formatDate(iso);
}

function InboxView() {
  const { key: rawKey } = useParams();
  const selectedKey = rawKey ?? null;
  const list = useLoad(listInbox, []);
  const [kind, setKind] = useState<Kind>("all");
  const [pick, setPick] = useState<View | null>(null);

  const items = list.data;
  const open = useMemo(() => (items ?? []).filter((i) => !i.handled), [items]);
  const view: View = pick ?? (open.length > 0 ? "new" : "all");

  const base = useMemo(() => (view === "new" ? open : (items ?? [])), [view, open, items]);
  const count = (k: Kind) => (k === "all" ? base.length : base.filter((i) => i.kind === k).length);
  const shown = kind === "all" ? base : base.filter((i) => i.kind === kind);
  const selected = selectedKey && items ? (items.find((i) => i.key === selectedKey) ?? null) : null;

  const dots = (items ?? []).slice(0, 40).map((i) => ({
    key: i.key,
    tone: (i.kind === "order" ? "ok" : i.handled ? "brand" : "alert") as GlanceTone,
    title: `${whoOf(i)}, ${KIND_LABEL[i.kind]}`,
  }));

  if (list.error) {
    return (
      <>
        <PageHeader title="Inbox" />
        <Notice tone="error">{list.error}</Notice>
      </>
    );
  }
  if (list.loading && !items) {
    return (
      <>
        <PageHeader title="Inbox" />
        <p className="adm-muted" role="status">Loading...</p>
      </>
    );
  }
  if (!items || items.length === 0) {
    return (
      <>
        <PageHeader title="Inbox" />
        <EmptyState title="Nothing yet" body="Enquiries, sign-ups and orders land here." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Inbox" />

      <div className="inbox-top">
        <GlanceCard>
          <div className="inbox-top__open">
            <Stat label="Open" value={open.length} tone={open.length > 0 ? "alert" : "ok"} />
            <div className="inbox-top__dots">
              <span className="inbox-top__cap">Latest {dots.length}</span>
              <DotStrip dots={dots} label={`Latest ${dots.length} items, ${open.length} open`} />
            </div>
          </div>
        </GlanceCard>
      </div>

      <div className="inbox-filters">
        <Segmented<Kind>
          label="Type"
          hideLabel
          value={kind}
          onChange={setKind}
          options={[
            { value: "all", label: `All ${count("all")}` },
            { value: "enquiry", label: `Enquiries ${count("enquiry")}` },
            { value: "signup", label: `Sign-ups ${count("signup")}` },
            { value: "order", label: `Orders ${count("order")}` },
          ]}
        />
        <Segmented<View>
          label="Show"
          hideLabel
          value={view}
          onChange={setPick}
          options={[
            { value: "new", label: `New ${open.length}` },
            { value: "all", label: `All ${items.length}` },
          ]}
        />
      </div>

      <div className="inbox-desk" data-open={selectedKey ? "true" : "false"}>
        <div className="inbox-listpane">
          {shown.length === 0 ? (
            <EmptyState title={view === "new" ? "All caught up" : "Nothing here"} />
          ) : (
            <ul className="inbox-list" aria-label="Inbox items">
              {shown.map((i) => (
                <li key={i.key}>
                  <Row item={i} current={i.key === selectedKey} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="inbox-detailpane">
          {selectedKey && !selected ? (
            <>
              <Link to="/admin/inbox" className="inbox-back adm-head__back">Back to inbox</Link>
              <Notice tone="error">That item could not be found.</Notice>
            </>
          ) : selected ? (
            <Detail item={selected} onChanged={list.reload} />
          ) : (
            <GlanceCard>
              <div className="inbox-blank">
                <span className="adm-muted">Pick an item</span>
              </div>
            </GlanceCard>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ item: i, current }: { current: boolean; item: InboxItem }) {
  return (
    <Link to={`/admin/inbox/${encodeURIComponent(i.key)}`} className="inbox-row" aria-current={current ? "true" : undefined}>
      <Avatar name={i.name} email={i.email} />
      <span className="inbox-row__main">
        <span className="inbox-row__top">
          <span className="inbox-row__name">{whoOf(i)}</span>
          <Tag tone={KIND_TONE[i.kind]}>{i.kind === "enquiry" && i.route ? ROUTE_LABEL[i.route] : KIND_LABEL[i.kind]}</Tag>
        </span>
        <span className="inbox-row__prev">{preview(i)}</span>
      </span>
      <span className="inbox-row__side">
        <span className="inbox-row__when">{shortDate(i.at)}</span>
        {i.handled ? (
          <span className="inbox-dot inbox-dot--none" aria-hidden="true" />
        ) : (
          <>
            <span className="inbox-dot" aria-hidden="true" />
            <span className="adm-sr">Not handled</span>
          </>
        )}
      </span>
    </Link>
  );
}

function Detail({ item: i, onChanged }: { item: InboxItem; onChanged: () => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const reply = replyHref(i);

  async function toggle() {
    setBusy(true);
    const r = await setHandled(i, !i.handled);
    setBusy(false);
    if (r.error !== null) return toast(r.error, "error");
    toast(i.handled ? "Marked as new" : "Marked as handled");
    onChanged();
  }

  return (
    <GlanceCard>
      <Link to="/admin/inbox" className="inbox-back adm-head__back">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to inbox
      </Link>
      <div className="inbox-item">
        <div className="inbox-who">
          <Avatar name={i.name} email={i.email} size={52} />
          <div className="inbox-who__text">
            <span className="inbox-who__name">{whoOf(i)}</span>
            {i.name && i.email && <span className="inbox-who__sub">{i.email}</span>}
            {i.organisation && <span className="inbox-who__sub">{i.organisation}</span>}
          </div>
        </div>

        <div className="inbox-tags">
          <Tag tone={KIND_TONE[i.kind]}>{KIND_LABEL[i.kind]}</Tag>
          {i.kind === "enquiry" && i.route && <Tag>{ROUTE_LABEL[i.route]}</Tag>}
          {i.kind !== "order" && <Tag tone={i.handled ? "off" : "alert"}>{i.handled ? "Handled" : "New"}</Tag>}
          <span className="inbox-when">{formatDateTime(i.at)}</span>
        </div>

        {i.order ? (
          <div className="inbox-order">
            <span className="inbox-order__product">{i.order.productTitle}</span>
            <Stat label="Paid" value={money(i.order.amountCents, i.order.currency) || "Free"} tone="ok" />
            <Ring value={i.order.downloads} max={i.order.maxDownloads} size={72} label={`${i.order.downloads} of ${i.order.maxDownloads} downloads used`}>
              {i.order.downloads}/{i.order.maxDownloads}
            </Ring>
            <Stat label="Link expires" value={<span style={{ fontSize: 18 }}>{formatDateTime(i.order.expiresAt)}</span>} />
            <AdminLinkButton to="/admin/shop/orders">See orders</AdminLinkButton>
          </div>
        ) : i.message ? (
          <p className="inbox-msg">{i.message}</p>
        ) : (
          <p className="adm-muted">{i.kind === "signup" ? "Joined the list" : "No message"}</p>
        )}

        <div className="inbox-actions">
          {reply && (
            <a href={reply} className="btn btn-primary">
              Reply
            </a>
          )}
          {i.kind !== "order" && (
            <AdminButton variant="quiet" busy={busy} busyLabel="Saving" onClick={toggle}>
              {i.handled ? "Mark as new" : "Mark handled"}
            </AdminButton>
          )}
        </div>

        {i.email && (
          <Link to={`/admin/contacts/${encodeURIComponent(i.email)}`} className="inbox-more">
            See everything from this person
          </Link>
        )}
      </div>
    </GlanceCard>
  );
}
