import { useState } from "react";
import { useNavigate, Routes, Route, useSearchParams, useParams, Link } from "react-router-dom";
import { DataTable, Notice, AdminLinkButton, StatusPill, EmptyState, useToast, Select, PageHeader, Segmented, AdminButton } from "@/components/admin/kit";
import { useLoad, type Enquiry, updateRow, formatDateTime, listRows, getRow } from "@/lib/admin";

type EnquiryRoute = Enquiry["route"];

/* Enquiries: the inbox for the contact page. Read only apart from the
   handled flag, which is the one thing the schema lets an admin change.
   Replies go out through the admin's own mail app via a mailto link. */

const ROUTE_LABELS: Record<EnquiryRoute, string> = {
  general: "General",
  partnership: "Partnership",
  educator: "Educator or case study",
  press: "Press",
  notify: "App launch list",
};

const ROUTE_OPTIONS = [{ value: "all", label: "All routes" }, ...(Object.keys(ROUTE_LABELS) as EnquiryRoute[]).map((r) => ({ value: r, label: ROUTE_LABELS[r] }))];

type StatusFilter = "all" | "new" | "handled";
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "new", label: "New" },
  { value: "handled", label: "Handled" },
  { value: "all", label: "All" },
];

function routeLabel(route: string): string {
  return ROUTE_LABELS[route as EnquiryRoute] ?? route;
}

function replyHref(e: Enquiry): string | null {
  if (!e.email) return null;
  const subject = `Your message to CLÉ Family Media (${routeLabel(e.route)})`;
  return `mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent(subject)}`;
}

/** Marks one enquiry handled or not, says so, and hands back the saved row. */
function useMarkHandled() {
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const mark = async (e: Enquiry, handled: boolean): Promise<Enquiry | null> => {
    setBusyId(e.id);
    const r = await updateRow("enquiries", e.id, { handled });
    setBusyId(null);
    if (r.error !== null) {
      toast(r.error, "error");
      return null;
    }
    toast(handled ? "Marked as handled" : "Marked as not handled");
    return r.data;
  };
  return { mark, busyId };
}

function MarkButton({ enquiry, busy, onMark, size = "sm" }: { onMark: (handled: boolean) => void; enquiry: Enquiry; busy: boolean; size?: "md" | "sm" }) {
  return (
    <AdminButton variant="quiet" size={size} busy={busy} busyLabel="Saving" className="whitespace-nowrap" onClick={() => onMark(!enquiry.handled)}>
      {enquiry.handled ? "Mark as not handled" : "Mark as handled"}
    </AdminButton>
  );
}

function excerpt(text: string | null, max = 110): string {
  if (!text) return "No message, just the details";
  const one = text.replace(/\s+/g, " ").trim();
  return one.length > max ? `${one.slice(0, max).trimEnd()}...` : one;
}

/* ─── Inbox ──────────────────────────────────────────────────────────────── */

function Inbox() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const route = params.get("route") ?? "all";
  const status = (params.get("status") as StatusFilter | null) ?? "new";
  const setFilter = (key: "status" | "route", value: string) => {
    const next = new URLSearchParams(params);
    if ((key === "route" && value === "all") || (key === "status" && value === "new")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useLoad(
    () =>
      listRows("enquiries", {
        order: [{ column: "created_at", ascending: false }],
        eq: {
          ...(route !== "all" ? { route } : {}),
          ...(status !== "all" ? { handled: status === "handled" } : {}),
        },
      }),
    [route, status],
  );
  const { mark, busyId } = useMarkHandled();

  const onMark = async (e: Enquiry, handled: boolean) => {
    const saved = await mark(e, handled);
    if (saved) list.reload();
  };

  const empty =
    status === "new"
      ? { title: "No new enquiries", body: route === "all" ? "Every message has been handled." : `Every ${routeLabel(route).toLowerCase()} message has been handled.` }
      : status === "handled"
        ? { title: "Nothing handled yet", body: "Enquiries you mark as handled will be listed here." }
        : { title: "No enquiries yet", body: "Messages sent from the contact page will appear here." };

  return (
    <>
      <PageHeader title="Enquiries" intro="Messages from the contact page, newest first. Reply from your own email, then mark each one as handled." />

      <div className="adm-card">
        <div className="adm-grid2">
          <Select label="Route" value={route} onChange={(v) => setFilter("route", v)} options={ROUTE_OPTIONS} />
          <Segmented label="Show" value={status} onChange={(v) => setFilter("status", v)} options={STATUS_OPTIONS} />
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          rows={list.data}
          loading={list.loading}
          error={list.error}
          caption="Enquiries from the contact page"
          rowKey={(e) => e.id}
          onRowClick={(e) => navigate(`/admin/enquiries/${e.id}`)}
          empty={empty}
          columns={[
            {
              key: "from",
              label: "From",
              primary: true,
              render: (e) => (
                <>
                  <Link to={`/admin/enquiries/${e.id}`} className="font-semibold underline underline-offset-4">
                    {e.name?.trim() || "No name given"}
                  </Link>
                  {e.organisation && <span className="adm-muted block">{e.organisation}</span>}
                </>
              ),
            },
            { key: "route", label: "Route", render: (e) => routeLabel(e.route) },
            { key: "message", label: "Message", render: (e) => <span className="adm-muted">{excerpt(e.message)}</span> },
            { key: "received", label: "Received", numeric: true, render: (e) => formatDateTime(e.created_at) },
            {
              key: "status",
              label: "Status",
              render: (e) => (e.handled ? <StatusPill tone="off">Handled</StatusPill> : <StatusPill tone="alert">New</StatusPill>),
            },
            {
              key: "actions",
              label: "Actions",
              render: (e) => <MarkButton enquiry={e} busy={busyId === e.id} onMark={(h) => onMark(e, h)} />,
            },
          ]}
        />
      </div>
    </>
  );
}

/* ─── One enquiry, in full ───────────────────────────────────────────────── */

function EnquiryView() {
  const { id = "" } = useParams();
  const loaded = useLoad(() => getRow("enquiries", id), [id]);
  const [local, setLocal] = useState<Enquiry | null>(null);
  const { mark, busyId } = useMarkHandled();
  const back = { to: "/admin/enquiries", label: "Back to enquiries" };

  const e = local ?? loaded.data;

  if (loaded.error) {
    return (
      <>
        <PageHeader title="Enquiry" back={back} />
        <Notice tone="error">{loaded.error}</Notice>
      </>
    );
  }
  if (loaded.loading && !e) {
    return (
      <>
        <PageHeader title="Enquiry" back={back} />
        <p className="adm-muted" role="status">Loading...</p>
      </>
    );
  }
  if (!e) {
    return (
      <>
        <PageHeader title="Enquiry" back={back} />
        <EmptyState title="This enquiry could not be found" body="It may have been removed." action={<AdminLinkButton to="/admin/enquiries">Back to enquiries</AdminLinkButton>} />
      </>
    );
  }

  const reply = replyHref(e);
  const onMark = async (handled: boolean) => {
    const saved = await mark(e, handled);
    if (saved) setLocal(saved);
  };

  return (
    <>
      <PageHeader
        title={e.name?.trim() || "No name given"}
        intro={`${routeLabel(e.route)}, received ${formatDateTime(e.created_at)}`}
        back={back}
        actions={e.handled ? <StatusPill tone="off">Handled</StatusPill> : <StatusPill tone="alert">New</StatusPill>}
      />

      <div className="adm-card adm-stack">
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
          <dt className="adm-label">Email</dt>
          <dd className="m-0 break-words">
            {e.email ? (
              <a href={`mailto:${encodeURIComponent(e.email)}`} className="underline underline-offset-4">
                {e.email}
              </a>
            ) : (
              <span className="adm-muted">Not given</span>
            )}
          </dd>
          <dt className="adm-label">Organisation</dt>
          <dd className="m-0 break-words">{e.organisation || <span className="adm-muted">Not given</span>}</dd>
          <dt className="adm-label">Route</dt>
          <dd className="m-0">{routeLabel(e.route)}</dd>
          <dt className="adm-label">Received</dt>
          <dd className="m-0">{formatDateTime(e.created_at)}</dd>
        </dl>

        <div>
          <h2 className="adm-h2">Message</h2>
          {e.message ? (
            <p className="m-0 whitespace-pre-wrap break-words">{e.message}</p>
          ) : (
            <p className="adm-muted m-0">No message was written, just the details above.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {reply ? (
            <a href={reply} className="btn btn-primary">
              Reply by email
            </a>
          ) : (
            <p className="adm-muted m-0">No email address was given, so there is nothing to reply to.</p>
          )}
          <MarkButton enquiry={e} busy={busyId === e.id} onMark={onMark} size="md" />
        </div>
      </div>
    </>
  );
}

/* ─── Routes ─────────────────────────────────────────────────────────────── */

export function EnquiriesPanel() {
  return (
    <Routes>
      <Route index element={<Inbox />} />
      <Route path=":id" element={<EnquiryView />} />
    </Routes>
  );
}
