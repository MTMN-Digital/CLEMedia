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

---

# Run 2: `cle-portal-pages-2026-11-20` (extends run 1, which is done and integrated)

The shell is now a CLÉ-navy icon rail plus a pill bar of section tabs (`src/pages/admin/Admin.tsx`,
frozen). The theme block at the end of `src/components/admin/kit/admin.css` is frozen and defines
Iacchus tokens on `.adm`: `--bg --card --sunk --track --line --line-2 --ink --body --dim --mid
--accent --accent-soft --nav-on-ink --frame --frame-bar`, status `--green-solid/-tint/-tint-ink/-bar`,
`--amber-*`, `--red-*`, `--blue-*`, `--grey-tint/-tint-ink`, ramp `--ramp-1..4`, `--shadow-card`,
`--ease`, radii `--radius-sm 10 / -md 14 / -lg 16`. Fonts: `--font-display` (Onest) for headings and
figures, `--font-sans` (Hanken Grotesk) for text. Reference for the look: the admin home,
`src/components/admin/dashboard/Dashboard.tsx` + `dashboard.css` (tinted tiles, figure sizes,
`.dash-card` cards with `--shadow-card`, container queries). Mirror it.

## Goal
Several admin pages are thin: bare lists or near-empty screens with little utility. Each shard upgrades
its pages in the Glance direction: a figures row or lead object at the top (big tabular numbers,
1 to 4 word labels, tinted tiles where status matters), real pictures where the data has them, and the
actions people actually use, one click away. Keep EVERY existing behaviour working (create, edit,
delete, reorder, publish/hide, import, filters, saves, toasts, confirms, routes and URLs). This is a
presentation and utility upgrade, not a rewrite of the data layer.

## Shards (each owns only its folder, may edit any file inside it, may add files and ONE css file)

| Shard | Owns | Model |
|---|---|---|
| shop | `src/components/admin/shop/**` | claude-sonnet-5-5 |
| episodes | `src/components/admin/episodes/**` | claude-sonnet-5-5 |
| pages | `src/components/admin/pages/**` | claude-sonnet-5-5 |
| journal | `src/components/admin/journal/**` and `src/components/admin/media/**` | claude-sonnet-5-5 |
| team | `src/components/admin/people/**` | claude-sonnet-5-5 |
| quotes | `src/components/admin/quotes/**` | claude-sonnet-5-5 |

Exports and routes do not change: `ShopPanel`, `EpisodesPanel`, `PagesPanel`, `JournalPanel`,
`MediaPanel`, `PeoplePanel`, `QuotesPanel` stay named exports in their current files, with the same
nested routes. Integration needs nothing from you except that.

Must not touch: anything outside your folder(s). In particular `src/pages/admin/**`,
`src/components/admin/kit/**`, `src/components/admin/registry.ts`, `src/lib/**`, `src/components/team/**`,
`src/components/Figure.tsx`, `src/styles/**`, `api/**`, `supabase/**`. CSS selectors in your css file
are prefixed with your shard name (`.shop-`, `.ep-`, `.pg-`, `.jr-`/`.md-`, `.team-`, `.qt-`).

## Data you may read (read-only imports)
- `@/lib/admin`: `listRows`, `getRow`, `insertRow`, `updateRow`, `deleteRow`, `reorderRows`, `countRows`,
  `useLoad`, `formatDate`, `formatDateTime`, `formatEuro`, row types (`ProductRow`, `PostRow`,
  `PersonRow`, `MediaRow`, `EpisodeRow`, `Order`, `ContentBlock`), `getSetting`/`saveSetting`.
- `@/lib/blocks`: `PAGES`, `BLOCKS`, `blocksFor(page)`, `sectionsFor(page)` (which text and photo slots
  each page has; `kind: "image"` are photo slots).
- `@/lib/brand`: `ASSETS` (bundled images: `ASSETS[key].base` + `.webp` / `.jpg`, width, height, alt).
  `@/components/Figure` renders a bundled asset with an optional `override={{url, alt}}`.
- `@/components/team/people`: `TEAM`, `ADVISORS` (the bundled team, for the team page before import).
- `@/lib/inbox`: `money(cents)`.
- Orders: `listRows("orders")` gives `product_id`, `amount_cents`, `created_at`, `download_count`.

## Page acceptance

### shop (ShopPanel: products list, product page, orders)
- Top figures: revenue this month and all time (from orders), orders this month, products on sale
  vs hidden.
- Products as a responsive grid of cards: cover image (`thumbnail`, or a tinted placeholder block
  with the title if none), title, price, a status pill (On sale / Hidden), sales count and revenue for
  that product, Edit, and Up/Down order controls (keep `reorderRows`). Hidden products look dimmed.
- Orders screen keeps search and "Give a fresh link"; add a figures row and make rows scannable.

### episodes (EpisodesPanel)
- Top figures: released, coming soon, hidden.
- Episodes as cards in a grid: the thumbnail (uploaded `thumbnail`, else the bundled slate
  `ASSETS[asset_key]` via `Figure`), `EP 00N` and title, Watch on YouTube (link out, new tab) or a
  Coming soon tag, Edit, Up/Down order. Hidden ones dimmed with a Hidden tag.

### pages (PagesPanel list view only; the per-page editor stays as it is)
- Each page as a card: page name, how many of its words and photos have been changed from the
  original (count `content_blocks` rows for that page, split text vs image), last edited date
  (max `updated_at`), how many photo slots it has (`blocksFor(page)` kind image), Edit and View page
  (`PAGES[].path`, new tab). Group: Main pages (home, story, team, ethical-ai, case-study, journal, app,
  media, shop, contact) and Legal (privacy, terms, cookies, 404).
- Top figures: pages edited, total changes, last edit.

### journal (JournalPanel list) and media (MediaPanel list)
- Journal top figures: published, scheduled, drafts, days since the last published post, next scheduled
  date. Posts as cards with the cover (`hero_image`) or a tinted block, title, status pill, strand,
  date. Keep the All / Drafts / Scheduled / Published filter, New post and Strands buttons.
- Media: count by type as figures, entries as cards with picture or outlet initials, title, outlet,
  date, type tag, link out. Keep Add an entry and the reorder controls.

### team (PeopleList)
- When the table has people: a face grid per group (Team, Advisers, Experts): photo (`photo`, else the
  bundled portrait via `ASSETS[asset_key]`, else initials), name, role, Shown/Hidden, expert website
  link; click opens the existing edit form; keep reorder.
- When the table is empty (today on production): show the bundled `TEAM` and `ADVISORS` as the same
  face grid, slightly muted, with one clear primary "Import the current team" (keep the existing
  import action and its confirm) and a line saying they show on the site from the built-in list until
  imported. Experts section and Add an expert stay.
- Top figures: people shown, hidden, experts.

### quotes (QuotesPanel)
- Each quote edited in a card whose top shows a live preview styled like the home page quote
  (quotation in large text, attribution under it), updating as you type. Keep add, remove, reorder,
  validation and the single Save bar.
- Top line figures: quotes shown on the site.

## DONE-WHEN checklist (the gate may fail a shard ONLY on these or a lint FAIL)
1. Exports, file paths and nested routes are unchanged; every existing action still works (create,
   edit, delete, reorder, publish/hide, import, filters, save bars, toasts, confirms).
2. Only files inside the shard's own folder(s) were created or changed.
3. `npx tsc --noEmit -p tsconfig.app.json` passes.
4. `bash -O globstar .parallel/portal/shard-lint.sh <Export> <file> '<folder>/**'` exits 0 for each
   folder owned.
5. Loading, error (`Notice tone="error"`) and empty states handled; never a blank screen.
6. No new tables, columns, migrations or npm dependencies; data only through `@/lib/admin` helpers.
7. Tokens only (no hard-coded hex where a token exists; no Tailwind palette colour classes).
8. Fluid: works at 390px (no horizontal page scroll, 44px tap targets) and fills the width at 1440px;
   grids reflow (prefer container queries on the page root).
9. Accessible: real buttons and links with names, alt text on images, labels on drawn figures,
   visible focus, works without hover.
10. No em or en dashes anywhere. Short plain labels, no explainer paragraphs under every element.
11. `prefers-reduced-motion` respected for any motion added.
12. The page acceptance above is met.

## Local test environment
Dev server `http://127.0.0.1:5504` (running; do not start another). Signed-in screenshots:
`import { launch, adminPage } from "/home/david/Documents/GitHub/clients/cle-media/.parallel/admin/pw.mjs"`,
`const b = await launch(); const p = await adminPage(b, { width: 1440, base: "http://127.0.0.1:5504" });`
then `p.goto("http://127.0.0.1:5504/admin/<section>")`. Your page IS routed this time, so look at it at
1440 and 390 before finishing. Screenshots to `/tmp/cle-qa/run2/`. Local data: 6 products with orders,
6 episodes, 1 journal post, empty people and media tables, no quotes. Do not change local data except
through the UI you are testing, and undo any test change you make.

---

# Run 3: everything on the main pages editable, lists included (2026-11-22)

Goal: Conor can change every visible word on the main public pages from Website > Pages, by clicking
it in the live preview. Two kinds of addition per page:
1. **Single lines and paragraphs** still fixed in code: headings, eyebrow labels, captions, button and
   link labels, small notes, empty-state lines. Become `line` / `para` blocks.
2. **Repeated items** still fixed in code: FAQs, research figures and their captions, app features,
   Responsible AI commitments, steps, red lines and tools, contact routes, press facts, the 404 page's
   route list, case-study questions, and similar. Become `list` blocks (add, remove, reorder).

## Foundation (frozen, built before fan-out; do not edit)
- `src/lib/blockdefs.ts`: types (`PageId`, `BlockDef`, `ListField`, `ListItem`) and builders
  `line(page, section, key, label, source, extra?)`, `para(...)`, `image(page, section, key, label, assetKey, source)`,
  `list(page, section, key, label, source, itemLabel, fields, items, extra?)`.
  `fields` = `{ name, label, kind: "line" | "paragraph", optional? }[]`; `items` = the page's own items as
  `Record<string, string>[]`; `extra` may set `min` (default 1) and `max` (default 30), `emphasis`, `multi`,
  `required: false`.
- `src/lib/content.ts`: `useBlock(page, key, fallback)`, `useImageBlock`, `emphasis`, `splitParagraphs`,
  and NEW `useList(page, key, fallbackItems)`: returns the saved list (each item filled out with the
  fallback's field names) or the fallback. Same no-loading, prerender-safe rules as `useBlock`.
- `src/lib/blocks.ts` (convergence, do not edit) appends every page's `CMS` array from its own `cms.ts`.
  A key already in the base table is ignored, so never reuse an existing key.
- The admin page editor (`src/components/admin/pages/**`, do not edit) already renders `list` blocks
  with add, remove, up/down, validation, save and "Put the original list back". Lists are stored as
  `content_blocks` type `text`, value `{ items: [...] }`. No migration.

## The pattern, per page
- New single blocks: add the key and its current text, character for character, to the page's
  existing COPY object (see `COPY_MODULES` in `src/lib/blocks.ts` for where it lives), read it with
  `useBlock(page, key, COPY[key])`, and register it in that page's `cms.ts` with `line` or `para`.
  Headings whose accent clause is in `<em>`/Underline: `{ emphasis: true }`, stars in the default.
- New lists: export the items as a plain-string array (e.g. `export const FAQ_ITEMS = [{ q: "...", a: "..." }]`)
  from a module in your folder, pass that SAME array as `items` to `list(...)` in `cms.ts`, and read
  it in the page with `useList(page, key, FAQ_ITEMS)`. Anything that is not text (an icon, a colour, an
  image, a link target) stays in code, matched by index and cycled when the list is longer
  (`ICONS[i % ICONS.length]`). Render every field in its own element so the preview can find it.
  Numbered lists number from the index, never from a stored number.
- The default render must be byte-identical to today: same words, same markup, same classes.
  Visible change at the defaults = failure.
- Keys: dotted, lower case, by place on the page (`faq.items`, `figures.heading`). Labels: plain words
  for Conor saying where it is and what it is ("Questions and answers near the foot of the page").
  `section`: the place on the page, matching the existing section names where it sits in one.
- `source`: `"<file>: <what>"` as in the base table.

## Not in scope (leave in code)
- Anything another admin section already edits: people, episodes, products, journal posts, media
  entries, quotes, settings (email, social links, company details, app store links and launch). The
  preview already points Conor there.
- Header, footer, cookie banner, `Layout`, `Seo` titles and descriptions, shared components outside
  your folder (`src/components/*.tsx`: pass text through a prop if one exists; if a shared component
  hardcodes text you need, list it as a contract gap, do not edit it).
- Form control labels, placeholders, validation and error messages, aria-only text, alt text of
  bundled images (image blocks cover pictures), legal pages (already whole sections).
- Text that is computed (dates, prices, counts) or that is a proper noun in a logo or graphic.
- A whole drawn diagram whose labels are positioned by hand (an SVG with fixed coordinates): make its
  labels editable only if longer text cannot break the layout; otherwise leave it and say so.

## Shards (Owns: create/edit only these; Must not touch: everything else)
| Shard | Owns | Page ids |
|---|---|---|
| home | `src/pages/Home.tsx`, `src/components/home/**` | home |
| story-team | `src/pages/Story.tsx`, `src/pages/Team.tsx`, `src/components/story/**`, `src/components/teampage/**` | story, team |
| ethical-ai | `src/pages/EthicalAi.tsx`, `src/components/ethical-ai/**` | ethical-ai |
| case-study | `src/pages/CaseStudy.tsx`, `src/components/casestudy/**` | case-study |
| app-media | `src/pages/AppPage.tsx`, `src/pages/Media.tsx`, `src/components/app/**`, `src/components/media/**` | app, media |
| rest | `src/pages/Shop.tsx`, `src/pages/ShopProduct.tsx`, `src/pages/Download.tsx`, `src/pages/Contact.tsx`, `src/pages/Journal.tsx`, `src/pages/NotFound.tsx`, `src/components/{shop,contact,journal,notfound}/**` | shop, contact, journal, 404 |

Export each shard must keep: `CMS` (array of `BlockDef`) from each owned `cms.ts`, and every existing
export of every owned file, with the same signature (new props optional only).

## DONE-WHEN checklist, Run 3 (the gate may fail a shard ONLY on these or a lint FAIL)
1. Only owned files created or changed (no edits to `src/lib/**`, `src/components/admin/**`, shared
   components, styles, other shards' folders).
2. Every existing export, prop signature and existing block key still works; no base key reused.
3. `npx tsc --noEmit -p tsconfig.app.json` passes.
4. `bash -O globstar .parallel/portal/shard-lint.sh CMS <folder>/cms.ts '<owned glob>'...` exits 0 for each `cms.ts` owned.
5. Defaults render the page exactly as before (same visible words and layout at 1440 and 390;
   compare against `git stash`-free evidence: the screenshots in step 8 vs the live site
   https://cle-media.vercel.app<path>).
6. Coverage: every visible hard-coded heading, line, label, caption, button or link label and every
   repeated item set on the owned pages is either a block now or named in the final report with the
   reason it stays in code (an exclusion above). No silent omissions.
7. Lists: real fields, defaults equal to today's items, index-matched non-text extras, sensible `min`/`max`
   (a 3-up grid gets max that keeps the layout sound), longer or shorter lists still lay out (no overflow
   at 390px with one extra item and with one fewer).
8. Seen working: screenshot the public page at 1440 and 390, and the admin editor at
   `/admin/pages/<page>` showing your new blocks outlined in the preview (click one, screenshot the
   side panel). Files to `/tmp/cle-qa/run3/<shard>-*.png`. Do not save anything in the admin.
9. Labels and sections in plain words, no em or en dashes anywhere, no invented copy (defaults are
   the current text only).
10. `prefers-reduced-motion`, a11y and markup of the page unchanged or improved, never regressed.

## Local test environment
Same as Run 2: dev server `http://127.0.0.1:5504` (running, do not start another), pw.mjs helper
(`launch`, `adminPage`). Local `content_blocks` may hold a few saved rows from earlier tests; your
defaults show wherever a key has no row.
