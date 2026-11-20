import { Link } from "react-router-dom";
import { useLoad } from "@/lib/admin";
import { listInbox, KIND_LABEL, type InboxItem, ROUTE_LABEL, money } from "@/lib/inbox";
import { Notice, Ring, Avatar, type GlanceTone, Tag } from "@/components/admin/kit";
import "./dashboard.css";

/* ============================================================================
   The admin home, laid out like the Iacchus home: a greeting with today's
   chips, one lead object (this month, as a ring), three tinted figure tiles,
   the last fortnight as stacked day bars, then recent activity, quick actions
   and the website's sections. Everything comes from listInbox(): the same
   enquiries, sign-ups and orders the Inbox shows.
   ========================================================================== */

const TZ = "Europe/Dublin";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });
const monthKey = (iso: string) => dayKey(new Date(iso)).slice(0, 7);

function greeting(now: Date) {
  const h = Number(now.toLocaleString("en-IE", { hour: "numeric", hour12: false, timeZone: TZ }));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function ago(iso: string, now: Date) {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 864e5);
  return days <= 0 ? "today" : days === 1 ? "1 day" : `${days} days`;
}

const KIND_TONE: Record<InboxItem["kind"], GlanceTone> = { enquiry: "brand", signup: "info", order: "ok" };

const QUICK = [
  { to: "/admin/journal/new", label: "Write a journal post" },
  { to: "/admin/episodes/new", label: "Add an episode" },
  { to: "/admin/shop/new", label: "Add a product" },
  { to: "/admin/people/new", label: "Add a person" },
];

const SITE = [
  { to: "/admin/pages", label: "Pages and photos" },
  { to: "/admin/journal", label: "Journal" },
  { to: "/admin/people", label: "Team and experts" },
  { to: "/admin/episodes", label: "Episodes" },
  { to: "/admin/quotes", label: "Quotes" },
  { to: "/admin/media", label: "Media and podcast" },
  { to: "/admin/app", label: "App" },
  { to: "/admin/shop", label: "Shop" },
  { to: "/admin/links", label: "Links and settings" },
];

export function Dashboard() {
  const now = new Date();
  const inbox = useLoad(() => listInbox(), []);
  const items = inbox.data ?? [];

  const month = dayKey(now).slice(0, 7);
  const inMonth = items.filter((i) => monthKey(i.at) === month);
  const enq = inMonth.filter((i) => i.kind === "enquiry");
  const answered = enq.filter((i) => i.handled).length;
  const signups = inMonth.filter((i) => i.kind === "signup").length;
  const orders = inMonth.filter((i) => i.kind === "order");
  const revenue = orders.reduce((n, o) => n + (o.order?.amountCents ?? 0), 0);
  const open = items.filter((i) => !i.handled);
  const oldest = open.length ? open[open.length - 1] : null;
  const signupsAll = items.filter((i) => i.kind === "signup").length;

  const days = Array.from({ length: 14 }, (_, n) => {
    const d = new Date(now.getTime() - (13 - n) * 864e5);
    const key = dayKey(d);
    const on = items.filter((i) => dayKey(new Date(i.at)) === key);
    return {
      key,
      label: d.toLocaleDateString("en-IE", { weekday: "short", day: "numeric", timeZone: TZ }),
      short: d.toLocaleDateString("en-IE", { weekday: "narrow", timeZone: TZ }),
      today: n === 13,
      enquiries: on.filter((i) => i.kind === "enquiry").length,
      signups: on.filter((i) => i.kind === "signup").length,
      orders: on.filter((i) => i.kind === "order").length,
    };
  });
  const top = Math.max(1, ...days.map((d) => d.enquiries + d.signups + d.orders));
  const fortnight = days.reduce((n, d) => n + d.enquiries + d.signups + d.orders, 0);
  const monthName = now.toLocaleDateString("en-IE", { month: "long", timeZone: TZ });
  const dateChip = now.toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });

  return (
    <div className="dash">
      <header className="dash-hello">
        <h1>{greeting(now)}</h1>
        <span className="dash-chip">
          <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 5h12v11H4zM4 8.5h12M7.5 3v3M12.5 3v3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
          {dateChip}
        </span>
        {open.length > 0 && (
          <Link to="/admin/inbox" className="dash-chip dash-chip--wait">
            {open.length} waiting on you
          </Link>
        )}
      </header>

      {inbox.error !== null && <Notice tone="error">We couldn't read the inbox just now. Nothing is lost. {inbox.error}</Notice>}

      <div className="dash-grid">
        {/* The lead object: this month, drawn as a ring of enquiries answered. */}
        <section className="dash-card dash-lead" aria-labelledby="dash-month">
          <div className="dash-ch">
            <h2 id="dash-month">{monthName}</h2>
            <span className="dash-m">{inMonth.length} in so far</span>
          </div>
          <div className="dash-lead__ring">
            {inbox.loading ? (
              <span className="dash-sk dash-sk--ring" aria-label="Loading" />
            ) : (
              <Ring value={answered} max={Math.max(1, enq.length)} size={200} tone={enq.length && answered === enq.length ? "ok" : "brand"} label={`${answered} of ${enq.length} enquiries answered this month`}>
                <span className="dash-ring__in">
                  <small>Answered</small>
                  <b>{answered} of {enq.length}</b>
                  <small>enquiries</small>
                </span>
              </Ring>
            )}
          </div>
          <div className="dash-kp">
            <div><b>{enq.length}</b><span>enquiries</span></div>
            <div><b>{signups}</b><span>sign-ups</span></div>
            <div><b>{money(revenue)}</b><span>sales</span></div>
          </div>
        </section>

        <div className="dash-right">
          <div className="dash-tiles">
            <Link to="/admin/inbox" className="dash-tile" data-tone={open.length ? "red" : "green"}>
              <span className="dash-tile__label">Waiting on you</span>
              <b className="dash-tile__fig">{open.length}</b>
              <span className="dash-tile__meta">{oldest ? `oldest ${ago(oldest.at, now)}` : "all answered"}</span>
            </Link>
            <Link to="/admin/contacts" className="dash-tile" data-tone="blue">
              <span className="dash-tile__label">Sign-ups</span>
              <b className="dash-tile__fig">{signups}</b>
              <span className="dash-tile__meta">this month · {signupsAll} in all</span>
            </Link>
            <Link to="/admin/shop/orders" className="dash-tile" data-tone="green">
              <span className="dash-tile__label">Sales</span>
              <b className="dash-tile__fig">{money(revenue)}</b>
              <span className="dash-tile__meta">{orders.length} {orders.length === 1 ? "order" : "orders"} this month</span>
            </Link>
          </div>

          <section className="dash-card" aria-labelledby="dash-days">
            <div className="dash-ch">
              <h2 id="dash-days">Last two weeks</h2>
              <span className="dash-legend">
                <i data-k="enquiries" /> Enquiries <i data-k="signups" /> Sign-ups <i data-k="orders" /> Orders
              </span>
            </div>
            <div className="dash-days" role="img" aria-label={`${fortnight} enquiries, sign-ups and orders in the last 14 days`}>
              {days.map((d) => {
                const total = d.enquiries + d.signups + d.orders;
                return (
                  <div key={d.key} className="dash-day" data-today={d.today || undefined} title={`${d.label}: ${total}`}>
                    <div className="dash-day__col">
                      {total === 0 ? (
                        <span className="dash-day__none" />
                      ) : (
                        <span className="dash-day__stack" style={{ height: `${Math.max(10, (total / top) * 100)}%` }}>
                          {d.orders > 0 && <span data-k="orders" style={{ flex: d.orders }} />}
                          {d.signups > 0 && <span data-k="signups" style={{ flex: d.signups }} />}
                          {d.enquiries > 0 && <span data-k="enquiries" style={{ flex: d.enquiries }} />}
                        </span>
                      )}
                    </div>
                    <span className="dash-day__lbl">{d.today ? "Today" : d.short}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="dash-card dash-recent" aria-labelledby="dash-recent">
          <div className="dash-ch">
            <h2 id="dash-recent">Recent</h2>
            <Link to="/admin/inbox" className="dash-link">Open inbox</Link>
          </div>
          {inbox.loading ? (
            <div className="dash-sk-rows" aria-label="Loading">{[0, 1, 2, 3].map((n) => <span key={n} className="dash-sk" />)}</div>
          ) : items.length === 0 ? (
            <p className="dash-empty">Enquiries, sign-ups and orders from the website appear here.</p>
          ) : (
            <ul className="dash-rows">
              {items.slice(0, 7).map((i) => (
                <li key={i.key}>
                  <Link to={`/admin/inbox/${encodeURIComponent(i.key)}`} className="dash-row">
                    <Avatar name={i.name} email={i.email} size={34} />
                    <span className="dash-row__who">
                      <b>{i.name || i.email || "No name given"}</b>
                      <span>{i.kind === "order" ? `${i.order?.productTitle ?? ""} · ${money(i.order?.amountCents, i.order?.currency)}` : i.message || (i.kind === "signup" ? "Joined the list" : "")}</span>
                    </span>
                    <Tag tone={KIND_TONE[i.kind]}>{i.kind === "enquiry" && i.route ? ROUTE_LABEL[i.route] : KIND_LABEL[i.kind]}</Tag>
                    {!i.handled && <span className="dash-dot" aria-label="Not answered yet" />}
                    <span className="dash-row__when">{new Date(i.at).toLocaleDateString("en-IE", { day: "numeric", month: "short", timeZone: TZ })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="dash-side">
          <section className="dash-card" aria-labelledby="dash-start">
            <div className="dash-ch"><h2 id="dash-start">Start something</h2></div>
            <div className="dash-quick">
              {QUICK.map((q) => (
                <Link key={q.to} to={q.to} className="dash-quick__btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  {q.label}
                </Link>
              ))}
            </div>
          </section>
          <section className="dash-card" aria-labelledby="dash-site">
            <div className="dash-ch"><h2 id="dash-site">Website</h2></div>
            <ul className="dash-site">
              {SITE.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="dash-site__link">
                    {s.label}
                    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
