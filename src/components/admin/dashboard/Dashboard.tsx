import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLoad } from "@/lib/admin";
import { money, KIND_LABEL, type InboxItem, listInbox, inboxStats } from "@/lib/inbox";
import { Ring, Avatar, GlanceCard, Stat, Bars, Notice, type GlanceTone, Tag } from "@/components/admin/kit";
import "./dashboard.css";

/* The admin home: four drawn objects, the newest activity, then shortcuts. */

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

function greeting(now: Date) {
  const h = now.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", timeZone: "Europe/Dublin" });

const kindTone = (it: InboxItem): GlanceTone => (it.kind === "order" ? "ok" : it.kind === "signup" ? "info" : "brand");

export function Dashboard() {
  const now = useMemo(() => new Date(), []);
  const inbox = useLoad(listInbox, []);
  const items = inbox.data;
  const stats = useMemo(() => (items ? inboxStats(items, now, 14) : null), [items, now]);
  const dayLabels = stats?.daily.map((d) => d.day) ?? [];

  return (
    <>
      <header className="dash-band">
        <h1>{greeting(now)}</h1>
        <p>{now.toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Dublin" })}</p>
      </header>

      {inbox.error !== null ? (
        <div className="mb-4">
          <Notice tone="error">{inbox.error}</Notice>
        </div>
      ) : inbox.loading || !stats || !items ? (
        <div className="mb-4">
          <Notice tone="info">Loading</Notice>
        </div>
      ) : (
        <>
          <div className="dash-objects">
            <GlanceCard title="New enquiries">
              <Link to="/admin/inbox" className="dash-card-link" aria-label={`New enquiries: ${stats.openEnquiries} open, ${stats.enquiriesThisWeek} this week. Open inbox`}>
                <div className="dash-ringrow">
                  <Ring value={stats.openEnquiries} max={Math.max(stats.enquiriesThisWeek, stats.openEnquiries)} tone={stats.openEnquiries > 0 ? "alert" : "ok"} size={88} label={`${stats.openEnquiries} open of ${stats.enquiriesThisWeek} this week`}>
                    <span className="gl-stat__value">{stats.openEnquiries}</span>
                  </Ring>
                  <Stat label="In this week" value={stats.enquiriesThisWeek} />
                </div>
              </Link>
            </GlanceCard>

            <GlanceCard title="Sign-ups">
              <div className="dash-card-link">
                <Stat label="Total" value={stats.signupsTotal} sub={`${stats.signupsThisMonth} this month`} />
                <Bars values={stats.daily.map((d) => d.signups)} labels={dayLabels} label="Sign-ups per day, last 14 days" tone="info" />
              </div>
            </GlanceCard>

            <GlanceCard title="Orders this month">
              <Link to="/admin/shop/orders" className="dash-card-link" aria-label={`Orders this month: ${stats.ordersThisMonth}, ${money(stats.revenueThisMonthCents) || "no revenue"}. Open orders`}>
                <Stat label="Orders" value={stats.ordersThisMonth} sub={money(stats.revenueThisMonthCents) || "No revenue yet"} tone={stats.ordersThisMonth > 0 ? "ok" : "off"} />
              </Link>
            </GlanceCard>

            <GlanceCard title="Activity">
              <div className="dash-card-link">
                <Stat label="Last 14 days" value={stats.daily.reduce((n, d) => n + d.enquiries + d.signups + d.orders, 0)} />
                <Bars values={stats.daily.map((d) => d.enquiries + d.signups + d.orders)} labels={dayLabels} label="All activity per day, last 14 days" />
              </div>
            </GlanceCard>
          </div>

          <div className="dash-cols">
            <GlanceCard
              title="Recent"
              action={
                <Link to="/admin/inbox" className="dash-corner">
                  Open inbox
                </Link>
              }
            >
              {items.length === 0 ? (
                <p className="adm-muted">Nothing yet</p>
              ) : (
                <ul className="dash-rows">
                  {items.slice(0, 6).map((it) => (
                    <li key={it.key}>
                      <Link to={`/admin/inbox/${encodeURIComponent(it.key)}`} className="dash-row">
                        <Avatar name={it.name} email={it.email} />
                        <span className="dash-row__who">{it.name || it.email || "Unknown"}</span>
                        <Tag tone={kindTone(it)}>{KIND_LABEL[it.kind]}</Tag>
                        {!it.handled && <span className="dash-row__dot" role="img" aria-label="Not handled" />}
                        <span className="dash-row__when">{shortDate(it.at)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </GlanceCard>

            <GlanceCard title="Start something">
              <ul className="dash-quick">
                {QUICK.map((q) => (
                  <li key={q.to}>
                    <Link to={q.to}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {q.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlanceCard>
          </div>
        </>
      )}

      {inbox.error !== null && (
        <GlanceCard title="Start something" className="mb-4">
          <ul className="dash-quick">
            {QUICK.map((q) => (
              <li key={q.to}>
                <Link to={q.to}>{q.label}</Link>
              </li>
            ))}
          </ul>
        </GlanceCard>
      )}

      <GlanceCard title="Website">
        <ul className="dash-site">
          {SITE.map((s) => (
            <li key={s.to}>
              <Link to={s.to}>{s.label}</Link>
            </li>
          ))}
        </ul>
      </GlanceCard>
    </>
  );
}
