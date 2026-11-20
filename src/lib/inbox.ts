import { type EnquiryRoute, type Order, listRows, type Result, updateRow } from "@/lib/admin";

/* ============================================================================
   The inbox: everything that reaches CLÉ by email, read back from the tables
   it is stored in, so the admin shows the same thing the notification did.

   Two sources today:
   - `enquiries` (api/contact.ts): contact-page messages by route, and the
     sign-up forms, which post route "notify" with an email and nothing else.
   - `orders` (api/stripe-webhook.ts): one row per paid checkout.

   Read only, apart from `handled` on enquiries. Orders have no update policy
   and never get one (0008); an order is "done" when it is paid.
   ponytail: everything is loaded and merged in the browser (limit 500 per
   table). Fine for a small company's volume; move to a database view with
   paging if either table passes a few thousand rows.
   ========================================================================== */

export type InboxKind = "signup" | "enquiry" | "order";

export interface InboxItem {
  /** `enquiry:<uuid>` or `order:<uuid>`, unique across both tables. */
  key: string;
  /** The row id in its own table. */
  id: string;
  kind: InboxKind;
  /** Enquiries and sign-ups only. */
  route: EnquiryRoute | null;
  name: string | null;
  /** Lower-cased and trimmed, or null when none was given. */
  email: string | null;
  organisation: string | null;
  message: string | null;
  /** ISO timestamp. */
  at: string;
  /** Enquiries and sign-ups: the admin ticked it off. Orders: always true. */
  handled: boolean;
  /** Orders only. */
  order: {
    amountCents: number | null;
    maxDownloads: number;
    productTitle: string;
    downloads: number;
    currency: string;
    expiresAt: string;
  } | null;
}

export const ROUTE_LABEL: Record<EnquiryRoute, string> = {
  general: "General",
  partnership: "Partnership",
  educator: "Educator",
  press: "Press",
  notify: "Sign-up",
};

export const KIND_LABEL: Record<InboxKind, string> = {
  enquiry: "Enquiry",
  signup: "Sign-up",
  order: "Order",
};

const norm = (e: string | null | undefined) => (e && e.trim() ? e.trim().toLowerCase() : null);

/** Every enquiry, sign-up and order, newest first. */
export async function listInbox(): Promise<Result<InboxItem[]>> {
  const [enq, ord, prod] = await Promise.all([
    listRows("enquiries", { order: [{ column: "created_at", ascending: false }], limit: 500 }),
    listRows("orders", { order: [{ column: "created_at", ascending: false }], limit: 500 }),
    listRows("products", { columns: "id, title" }),
  ]);
  if (enq.error !== null) return enq;
  if (ord.error !== null) return ord;
  const titles = new Map((prod.data ?? []).map((p) => [p.id, p.title]));

  const items: InboxItem[] = [
    ...enq.data.map(
      (e): InboxItem => ({
        key: `enquiry:${e.id}`,
        id: e.id,
        kind: e.route === "notify" ? "signup" : "enquiry",
        route: e.route,
        name: e.name?.trim() || null,
        email: norm(e.email),
        organisation: e.organisation?.trim() || null,
        message: e.message?.trim() || null,
        at: e.created_at,
        handled: e.handled,
        order: null,
      }),
    ),
    ...ord.data.map(
      (o: Order): InboxItem => ({
        key: `order:${o.id}`,
        id: o.id,
        kind: "order",
        route: null,
        name: null,
        email: norm(o.payer_email),
        organisation: null,
        message: null,
        at: o.created_at,
        handled: true,
        order: {
          productTitle: titles.get(o.product_id) ?? "A product no longer on the shelf",
          amountCents: o.amount_cents,
          currency: (o.currency ?? "eur").toUpperCase(),
          downloads: o.download_count,
          maxDownloads: o.max_downloads,
          expiresAt: o.expires_at,
        },
      }),
    ),
  ];
  items.sort((a, b) => b.at.localeCompare(a.at));
  return { data: items, error: null };
}

/** Tick an enquiry or sign-up off, or put it back. Orders are not changed. */
export async function setHandled(item: InboxItem, handled: boolean): Promise<Result<null>> {
  if (item.kind === "order") return { data: null, error: null };
  const r = await updateRow("enquiries", item.id, { handled });
  return r.error !== null ? { data: null, error: r.error } : { data: null, error: null };
}

/** A mailto: link that replies to the sender, or null when there is no address. */
export function replyHref(item: InboxItem): string | null {
  if (!item.email) return null;
  const subject =
    item.kind === "order"
      ? `Your order: ${item.order?.productTitle ?? ""}`
      : item.kind === "signup"
        ? "CLÉ Family Media"
        : `Re: your ${ROUTE_LABEL[item.route ?? "general"].toLowerCase()} enquiry`;
  return `mailto:${item.email}?subject=${encodeURIComponent(subject)}`;
}

/** "€4.99". */
export function money(cents: number | null | undefined, currency = "EUR"): string {
  if (cents == null) return "";
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(cents / 100);
}

/* ─── People: one row per email address ──────────────────────────────────── */

export interface Contact {
  email: string;
  /** The most recent name given, if any. */
  name: string | null;
  organisation: string | null;
  firstAt: string;
  lastAt: string;
  /** Newest first. */
  items: InboxItem[];
  enquiries: number;
  signups: number;
  orders: number;
  spentCents: number;
  /** Any unhandled enquiry or sign-up. */
  open: boolean;
}

/** Everyone who left an email address, most recent contact first. */
export function toContacts(items: InboxItem[]): Contact[] {
  const by = new Map<string, Contact>();
  for (const it of items) {
    if (!it.email) continue;
    let c = by.get(it.email);
    if (!c) {
      c = { email: it.email, name: null, organisation: null, firstAt: it.at, lastAt: it.at, items: [], enquiries: 0, signups: 0, orders: 0, spentCents: 0, open: false };
      by.set(it.email, c);
    }
    c.items.push(it);
    if (!c.name && it.name) c.name = it.name;
    if (!c.organisation && it.organisation) c.organisation = it.organisation;
    if (it.at < c.firstAt) c.firstAt = it.at;
    if (it.at > c.lastAt) c.lastAt = it.at;
    if (it.kind === "enquiry") c.enquiries++;
    if (it.kind === "signup") c.signups++;
    if (it.kind === "order") {
      c.orders++;
      c.spentCents += it.order?.amountCents ?? 0;
    }
    if (!it.handled) c.open = true;
  }
  return [...by.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

/* ─── Dashboard figures ──────────────────────────────────────────────────── */

export interface InboxStats {
  /** Unhandled enquiries (not sign-ups). */
  openEnquiries: number;
  enquiriesThisWeek: number;
  signupsTotal: number;
  signupsThisMonth: number;
  ordersThisMonth: number;
  revenueThisMonthCents: number;
  /** One entry per day, oldest first, `days` long, counting every item. */
  daily: { orders: number; enquiries: number; day: string; signups: number }[];
}

const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Europe/Dublin" });

/** Figures for the dashboard, from the same items the inbox shows. */
export function inboxStats(items: InboxItem[], now = new Date(), days = 14): InboxStats {
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString();
  const month = dayKey(now).slice(0, 7);
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getTime() - (days - 1 - i) * 864e5);
    return { day: dayKey(d), enquiries: 0, signups: 0, orders: 0 };
  });
  const slot = new Map(daily.map((d) => [d.day, d]));
  const s: InboxStats = { openEnquiries: 0, enquiriesThisWeek: 0, signupsTotal: 0, signupsThisMonth: 0, ordersThisMonth: 0, revenueThisMonthCents: 0, daily };
  for (const it of items) {
    const inMonth = dayKey(new Date(it.at)).slice(0, 7) === month;
    const d = slot.get(dayKey(new Date(it.at)));
    if (it.kind === "enquiry") {
      if (!it.handled) s.openEnquiries++;
      if (it.at >= weekAgo) s.enquiriesThisWeek++;
      if (d) d.enquiries++;
    } else if (it.kind === "signup") {
      s.signupsTotal++;
      if (inMonth) s.signupsThisMonth++;
      if (d) d.signups++;
    } else {
      if (inMonth) {
        s.ordersThisMonth++;
        s.revenueThisMonthCents += it.order?.amountCents ?? 0;
      }
      if (d) d.orders++;
    }
  }
  return s;
}
