import { useState, useMemo } from "react";
import { useParams, Routes, Route, Link } from "react-router-dom";
import { useLoad, formatDate, formatDateTime } from "@/lib/admin";
import { listInbox, KIND_LABEL, money, type Contact, type InboxItem, ROUTE_LABEL, toContacts } from "@/lib/inbox";
import { TextInput, Notice, AdminLinkButton, Stat, Tag, EmptyState, Avatar, PageHeader, GlanceCard, type GlanceTone } from "@/components/admin/kit";
import "./contacts.css";

/* People: one card per email address, built from the inbox. A person view
   shows their items newest first. Read only. */

export function ContactsPanel() {
  return (
    <Routes>
      <Route index element={<ContactsList />} />
      <Route path=":email" element={<ContactView />} />
    </Routes>
  );
}

const KIND_TONE: Record<InboxItem["kind"], GlanceTone> = { enquiry: "info", signup: "brand", order: "ok" };

function useContacts() {
  const load = useLoad(async () => {
    const r = await listInbox();
    return r.error !== null ? r : { data: toContacts(r.data), error: null };
  }, []);
  return load;
}

function Loading() {
  return (
    <p className="adm-muted" role="status">
      Loading
    </p>
  );
}

function ContactsList() {
  const { data, error, loading } = useContacts();
  const [q, setQ] = useState("");

  const stats = useMemo(() => {
    const list = data ?? [];
    const now = new Date();
    const month = (iso: string) => {
      const d = new Date(iso);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    };
    return { total: list.length, fresh: list.filter((c) => month(c.firstAt)).length, buyers: list.filter((c) => c.orders > 0).length };
  }, [data]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!data) return [];
    if (!term) return data;
    return data.filter((c) => [c.name, c.email, c.organisation].some((v) => v?.toLowerCase().includes(term)));
  }, [data, q]);

  return (
    <>
      <PageHeader title="People" />
      {error && <Notice tone="error">{error}</Notice>}
      {loading && !data && <Loading />}
      {data && (
        <>
          <div className="contacts-stats">
            <GlanceCard>
              <Stat label="People" value={stats.total} tone="brand" />
            </GlanceCard>
            <GlanceCard>
              <Stat label="New this month" value={stats.fresh} tone="info" />
            </GlanceCard>
            <GlanceCard>
              <Stat label="Buyers" value={stats.buyers} tone="ok" />
            </GlanceCard>
          </div>
          {data.length === 0 ? (
            <EmptyState title="No one yet" body="People appear here after a sign-up, enquiry or order." />
          ) : (
            <>
              <div className="contacts-search">
                <TextInput label="Search" type="search" value={q} onChange={setQ} placeholder="Name, email or organisation" />
              </div>
              {shown.length === 0 ? (
                <EmptyState title="No match" action={<button type="button" className="btn btn-quiet" onClick={() => setQ("")}>Clear search</button>} />
              ) : (
                <ul className="contacts-list">
                  {shown.map((c) => (
                    <li key={c.email}>
                      <PersonCard c={c} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

function PersonCard({ c }: { c: Contact }) {
  const label = c.name || c.email;
  return (
    <Link to={`/admin/contacts/${encodeURIComponent(c.email)}`} className="contacts-card" aria-label={c.open ? `${label}, has something new` : label}>
      <Avatar name={c.name} email={c.email} size={44} />
      <span className="contacts-card__main">
        <span className="contacts-card__name">
          {label}
          {c.organisation && <span className="contacts-card__org">{c.organisation}</span>}
        </span>
        <span className="contacts-tags">
          {c.enquiries > 0 && <Tag tone="info">Enquiry x {c.enquiries}</Tag>}
          {c.signups > 0 && <Tag tone="brand">{c.signups > 1 ? `Sign-up x ${c.signups}` : "Sign-up"}</Tag>}
          {c.orders > 0 && <Tag tone="ok">Order x {c.orders}</Tag>}
          {c.spentCents > 0 && <Tag tone="ok">{money(c.spentCents)}</Tag>}
        </span>
      </span>
      <span className="contacts-card__side">
        {c.open && <span className="contacts-dot" aria-hidden="true" />}
        <span>{formatDate(c.lastAt)}</span>
      </span>
    </Link>
  );
}

function ContactView() {
  const { email = "" } = useParams();
  const { data, error, loading } = useContacts();
  const back = (
    <Link to="/admin/contacts" className="contacts-back">
      Back to people
    </Link>
  );

  if (error) {
    return (
      <>
        {back}
        <Notice tone="error">{error}</Notice>
      </>
    );
  }
  if (loading && !data) return <Loading />;
  const target = email.trim().toLowerCase();
  const c = data?.find((x) => x.email === target);
  if (!c) {
    return (
      <>
        {back}
        <Notice tone="info">No one with that email.</Notice>
      </>
    );
  }
  const label = c.name || c.email;

  return (
    <>
      {back}
      <GlanceCard>
        <div className="contacts-hero">
          <Avatar name={c.name} email={c.email} size={64} />
          <div className="contacts-hero__who">
            <h1 className="contacts-hero__name">{label}</h1>
            {c.name && <span className="contacts-hero__sub">{c.email}</span>}
            {c.organisation && <span className="contacts-hero__sub">{c.organisation}</span>}
          </div>
          <a className="btn btn-primary" href={`mailto:${c.email}`}>
            Email them
          </a>
        </div>
        <div className="contacts-dates">
          <Stat label="First contact" value={formatDate(c.firstAt)} />
          <Stat label="Last contact" value={formatDate(c.lastAt)} />
          {c.spentCents > 0 && <Stat label="Spent" value={money(c.spentCents)} tone="ok" />}
        </div>
      </GlanceCard>
      <div style={{ marginTop: 16 }}>
        <GlanceCard title={`Activity (${c.items.length})`}>
          <ul className="contacts-timeline">
            {c.items.map((it) => (
              <li key={it.key} className="contacts-item">
                <div className="contacts-item__top">
                  <Tag tone={KIND_TONE[it.kind]}>{KIND_LABEL[it.kind]}</Tag>
                  {it.kind === "enquiry" && it.route && <Tag>{ROUTE_LABEL[it.route]}</Tag>}
                  {it.kind !== "order" && <Tag tone={it.handled ? "off" : "alert"}>{it.handled ? "Handled" : "New"}</Tag>}
                  <span className="contacts-item__when">{formatDateTime(it.at)}</span>
                </div>
                {it.order ? (
                  <p className="contacts-item__text">
                    {it.order.productTitle}, {money(it.order.amountCents, it.order.currency)}
                  </p>
                ) : (
                  it.message && <p className="contacts-item__text">{it.message}</p>
                )}
                <div>
                  <AdminLinkButton to={`/admin/inbox/${encodeURIComponent(it.key)}`}>
                    Open in inbox
                  </AdminLinkButton>
                </div>
              </li>
            ))}
          </ul>
        </GlanceCard>
      </div>
    </>
  );
}
