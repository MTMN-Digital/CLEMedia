# CONTRACT: CLÉ admin portal, run `cle-portal-2026-11-20`

Frozen. Workers import from here by name and never edit a foundation file. A gap is
reported, not patched.

## What this run builds
The CLÉ admin (`/admin`) is now a console in the Iacchus "Glance" style, branded for CLÉ.
The foundation (done) restyled every existing panel and built the shell. Three new screens:

| Shard | Export | File | Mounted at (by integration) | Model |
|---|---|---|---|---|
| inbox | `InboxPanel` | `src/components/admin/inbox/InboxPanel.tsx` | `/admin/inbox/*` (panel key `inbox`, label "Inbox") | claude-sonnet-5-5 |
| contacts | `ContactsPanel` | `src/components/admin/contacts/ContactsPanel.tsx` | `/admin/contacts/*` (panel key `contacts`, label "People") | claude-sonnet-5-5 |
| dashboard | `Dashboard` | `src/components/admin/dashboard/Dashboard.tsx` | `/admin` index (replaces `Home` in Admin.tsx) | claude-sonnet-5-5 |

Each shard OWNS only its own folder (`src/components/admin/<shard>/**`) and creates new files there.
Panels use nested `<Routes>` with RELATIVE paths (`""`, `":key"`) and ABSOLUTE links
(`/admin/inbox/...`), exactly like `src/components/admin/media/MediaPanel.tsx`.

## Must not touch (foundation and convergence points)
`src/pages/admin/Admin.tsx`, `src/components/admin/registry.ts`, `src/components/admin/kit/**`
(including `admin.css`), `src/lib/**` (including `inbox.ts`, `admin.ts`), `src/styles/**`,
every other panel folder, `api/**`, `supabase/**`, `package.json`. Do not register routes or nav
items: integration does that. Do not add npm dependencies. Do not git commit.

Page-local styling: a shard may add ONE css file inside its own folder (e.g.
`src/components/admin/inbox/inbox.css`, imported by its own component), every selector
prefixed with the shard name (`.inbox-`, `.contacts-`, `.dash-`). Use the tokens below; never
hard-code a colour that has a token.

## The data layer: `src/lib/inbox.ts` (read it in full before building)
- `listInbox(): Promise<Result<InboxItem[]>>`: every enquiry, sign-up and order, newest first.
- `InboxItem`: `{ key, id, kind: "enquiry"|"signup"|"order", route, name, email, organisation,
  message, at, handled, order: { productTitle, amountCents, currency, downloads, maxDownloads,
  expiresAt } | null }`. `key` is unique across kinds (`enquiry:<id>`, `order:<id>`); use it in URLs.
- `setHandled(item, handled): Promise<Result<null>>`: ticks an enquiry or sign-up off (orders: no-op).
- `replyHref(item)`: `mailto:` link with a subject, or null.
- `toContacts(items): Contact[]`: one row per email, most recent first. `Contact = { email, name,
  organisation, firstAt, lastAt, items, enquiries, signups, orders, spentCents, open }`.
- `inboxStats(items, now?, days?)`: `{ openEnquiries, enquiriesThisWeek, signupsTotal,
  signupsThisMonth, ordersThisMonth, revenueThisMonthCents, daily: [{day, enquiries, signups, orders}] }`.
- `ROUTE_LABEL`, `KIND_LABEL`, `money(cents, currency)`.
- From `@/lib/admin`: `useLoad(loader, deps)` returns `{ data, error, loading, reload }`;
  `formatDateTime(iso)`, `formatDate(iso)`.
- From `@/components/admin/registry`: nothing. Do not import it.

## The kit: `@/components/admin/kit` (import by name, never restyle)
Existing: `PageHeader({title, intro, actions, back})`, `AdminButton`, `AdminLinkButton({to, variant})`,
`StatusPill({tone})`, `Notice({tone})`, `EmptyState({title, body, action})`, `Segmented({label,
value, onChange, options, hideLabel})`, `TextInput`, `DataTable`, `useToast()`, `useConfirm()`.
New Glance primitives (`kit/glance.tsx`):
- `Stat({label, value, sub?, tone?})`: big tabular figure + short label.
- `Ring({value, max, size?, tone?, label, children?})`: progress ring, figure in the middle.
- `Bars({values, labels?, height?, tone?, label})`: one bar per value, oldest left.
- `DotStrip({dots: [{key, tone, title?}], label, max?})`: one dot per item.
- `Avatar({name, email, size?})`: initials circle, stable tint per person.
- `Tag({tone?, children})`: small tinted tag.
- `GlanceCard({title?, action?, children, className?})`: white surface, short title, corner action.
- `GlanceTone = "brand" | "ok" | "warn" | "alert" | "info" | "off"`.

## Tokens (CSS variables, all defined on `.adm`)
Surfaces `--color-paper-2` (ground #F3F4F9), `--color-raised` (#FFF), `--color-paper-3`.
Text `--color-ink`, `--color-body`, `--color-muted`. Lines `--color-rule`, `--color-rule-soft`,
`--color-edge`. Action/brand `--cp-navy`, `--cp-navy-tint`. Alert `--color-red`.
Status pairs `--st-ok/--st-ok-bg`, `--st-warn/-bg`, `--st-alert/-bg`, `--st-info/-bg`,
`--st-off/-bg`. Radii `--radius-sm` 8, `--radius-md` 12, `--radius-lg` 16. Fonts
`--font-sans` (Onest), `--font-mono` (DM Mono). Tailwind utilities `text-ink`, `text-body`,
`text-muted` resolve to these inside the admin.

## Reference to mirror
- Panel structure, routes, loading/error/empty handling: `src/components/admin/media/MediaPanel.tsx`
  and `src/components/admin/episodes/EpisodesPanel.tsx`.
- The current enquiries screen being replaced (behaviour to keep, look to beat):
  `src/components/admin/enquiries/EnquiriesPanel.tsx`.
- Orders behaviour (download link reissue lives there, link to it, do not reimplement):
  `src/components/admin/shop/Orders.tsx`, reachable at `/admin/shop/orders`.

## Design direction: Glance (binding)
Every item is a drawn object read at a glance. Big tabular figures, 1 to 4 word labels, colour on
status only, at most 4 objects above the fold, one lead object per screen. NO rows of sentences
with a button each, NO heading + subheading + paragraph stacks, NO explainer subtitles. Calm and
approachable. Wide screens fill the width; reading panes cap around 68ch.

## DONE-WHEN checklist (the gate may fail a shard ONLY on these or a lint FAIL)
1. The export named in the registry exists at the stated path, is a named export, and renders
   without props.
2. Only files inside the shard's own folder were created or changed.
3. `npx tsc --noEmit -p tsconfig.app.json` passes with the shard's files present.
4. `bash -O globstar .parallel/portal/shard-lint.sh <Export> <path> 'src/components/admin/<shard>/**'` exits 0.
5. Loading, error (`Notice tone="error"`) and empty states are all handled; an empty table never
   renders a blank screen.
6. Uses `listInbox` / `toContacts` / `inboxStats` from `@/lib/inbox` for data; no direct Supabase
   calls, no new tables, no writes other than `setHandled`.
7. Uses kit components and tokens; no hard-coded hex colour where a token exists; no Tailwind
   palette colour classes (`bg-blue-500` etc.).
8. Phone first: usable at 390px wide (no horizontal page scroll, 44px tap targets), and fills
   the width at 1440px.
9. Accessible: every interactive element is a real button or link with a name; images and drawn
   figures have labels; focus visible; works without hover.
10. No em dashes or en dashes anywhere (copy, comments). Plain short labels, contractions fine,
    no marketing words.
11. `prefers-reduced-motion` respected for any motion added.
12. Shard-specific acceptance below is met.

## Shard acceptance

### inbox: `InboxPanel`
- List of every item (enquiries, sign-ups, orders), newest first, each row: Avatar, name or email,
  a `Tag` for kind (and route for enquiries), one-line preview of the message (or product and
  amount for orders), relative or short date, a dot when not handled.
- Filters: `Segmented` for All / Enquiries / Sign-ups / Orders, and a second toggle New / All
  (New = not handled; orders count as handled). Default view: All + New, falling back to All if
  New is empty. Counts in the filter labels.
- Desk (>= 1100px): two panes, list left, the selected item right. Phone: list, then the item at
  `/admin/inbox/:key` with a back link.
- Item view: who (Avatar, name, email, organisation), what (full message, or the order block:
  product, amount, downloads used of max, link expiry, a link to `/admin/shop/orders`), when
  (full date and time), actions: Reply (the `replyHref` mailto, primary), Mark handled /
  Mark as new (`setHandled`, toast on success, list updates), and "See everything from this
  person" linking to `/admin/contacts/<encodeURIComponent(email)>`.
- A small Glance header above the list: `DotStrip` of the newest 40 items (alert tone = not
  handled, brand = handled enquiry or sign-up, ok = order) and the open count as a `Stat`.

### contacts: `ContactsPanel` (label "People")
- Everyone from `toContacts(listInbox())`. Search box filters by name, email or organisation.
- Each person is a card or row: Avatar, name (or email), organisation, tags for what they did
  (Enquiry x N, Sign-up, Order x N, total spent via `money`), last contact date, an alert dot when
  they have anything unhandled.
- Glance header: `Stat`s for people total, new this month (firstAt this month), buyers.
- Person view at `/admin/contacts/:email` (email URL-encoded): header with Avatar, name, email,
  organisation, first and last contact; a timeline of their items newest first (each with kind
  tag, date, message or order line, handled state); actions: Email them (`mailto:`), and per item
  "Open in inbox" linking to `/admin/inbox/<item.key>`.
- Unknown email in the URL shows a `Notice` and a back link.

### dashboard: `Dashboard` (the admin home)
- A greeting band (Good morning / afternoon / evening, and the date) on CLÉ navy (`--cp-navy`,
  white text), compact.
- Four Glance objects above the fold, in one row on desk, stacked on phone:
  1. New enquiries: `Ring` (open vs enquiries this week, alert tone when open > 0) linking to the inbox.
  2. Sign-ups: `Stat` total with this month as `sub`, and `Bars` of daily sign-ups for 14 days.
  3. Orders this month: `Stat` count and revenue via `money`, linking to `/admin/shop/orders`.
  4. Activity: `Bars` of all items per day for 14 days.
- Recent activity: the newest 6 inbox items as compact rows (Avatar, who, Tag, short date),
  each linking to `/admin/inbox/<key>`, with "Open inbox" in the card corner.
- Quick actions: four compact buttons or tiles: Write a journal post `/admin/journal/new`,
  Add an episode `/admin/episodes/new`, Add a product `/admin/shop/new`, Add a person
  `/admin/people/new`.
- Website shortcuts: a compact grid of links to Pages and photos `/admin/pages`, Journal
  `/admin/journal`, Team and experts `/admin/people`, Episodes `/admin/episodes`, Quotes
  `/admin/quotes`, Media and podcast `/admin/media`, App `/admin/app`, Shop `/admin/shop`,
  Links and settings `/admin/links`. Short labels, no paragraphs.
- Error loading the inbox data shows a `Notice` in place of the four objects; the quick actions
  and shortcuts still render.

## Local test environment
Dev server: `http://127.0.0.1:5504` (already running; do not start another). Signed-in page for
screenshots: `import { launch, adminPage } from "/home/david/Documents/GitHub/clients/cle-media/.parallel/admin/pw.mjs"`,
then `const b = await launch(); const p = await adminPage(b, { width: 390, base: "http://127.0.0.1:5504" });`.
Local data: 3 enquiries (partnership, educator, press), 3 sign-ups and 3 orders. Screenshots go
to `/tmp/cle-qa/`. The panels are not routed until integration, so verify with the typecheck, the
lint and a careful read of your own code; the gate and integration take the screenshots.

## Commit policy
No stage commits except integration's single final commit.
