# Admin console and CMS: foundation contract (run 2026-10-27-admin)

Repo: `/home/david/Documents/GitHub/clients/cle-media` (Vite + React 18 + TS + Tailwind v4, Supabase, Stripe, Vercel).
Read this whole file before you write a line. You are building ONE shard, blind to the others. Everything you
may import is listed here; everything not listed as yours is frozen.

## 0. The job in one paragraph

Conor (non-technical, often on his phone) must run the whole site from `/admin`. The foundation has built the
console frame, the shared kit, the data helpers, the CMS read layer, the block registry and the schema. Each
shard builds one panel (or wires one set of public pages) on top of it. The public site must look exactly as it
does today when the database is empty: every editable string's default is the page's current source copy.

## 1. Local stack (never the live project)

| Thing | Value |
|---|---|
| Supabase API | `http://127.0.0.1:54431` |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54432/postgres` (no host psql: use `.parallel/admin/db.sh`) |
| Studio | `http://127.0.0.1:54433` |
| Mailpit | `http://127.0.0.1:54434` |
| Env file | `.parallel/admin/local.env` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `LOCAL_DB_URL`, `LOCAL_SERVICE_ROLE_KEY` (scripts only, never in src/), `ADMIN_EMAIL`, `ADMIN_PASSWORD` |
| Admin login | the `ADMIN_EMAIL` / `ADMIN_PASSWORD` in local.env; the account is on `public.admins` |
| Dev server | one is running on `http://127.0.0.1:5500` with the local env. If it is down, start your own on your port (table below) |
| Containers | `supabase_*_cle-media` (docker). Leave them RUNNING. Never `supabase stop`. |

Start a dev server (only if 5500 is down, or you need your own):

```bash
cd /home/david/Documents/GitHub/clients/cle-media
set -a && . .parallel/admin/local.env && set +a
npx vite --port <YOUR_PORT> --strictPort --host 127.0.0.1
```

Ports: shop 5501, enquiries 5502, journal 5503, people 5504, media-app-links 5505, pages-cms 5506, cms-wiring 5507.
Process env beats `.env.local`, so the exported VITE_* values win.

Database helper (moves migration 0007 aside automatically, restores it byte for byte):

```bash
.parallel/admin/db.sh status          # containers, applied migrations (0001-0006, 0008; NEVER 0007), admins
.parallel/admin/db.sh sql "select ..." # one statement as postgres (bypasses RLS: use for checks and test data only)
.parallel/admin/db.sh psql            # interactive
.parallel/admin/db.sh up              # apply pending migrations (foundation only)
.parallel/admin/db.sh reset           # wipe and rebuild + recreate the admin. DO NOT RUN during the fan-out: it wipes every shard's test data.
node .parallel/admin/verify-foundation.mjs   # 24 security checks, exit 0 = all pass
```

Migration `0007_study_responses.sql` must never be applied anywhere (HANDOVER.md). Never run `supabase db reset`
or `supabase migration up` directly; use db.sh. `git status supabase/migrations` must never show 0007 modified.

Playwright (borrowed, see scripts/qa/audit.mjs) with a signed-in helper:

```js
import { launch, adminPage, signIn, env } from "/home/david/Documents/GitHub/clients/cle-media/.parallel/admin/pw.mjs";
const browser = await launch();
const page = await adminPage(browser, { width: 390, base: "http://127.0.0.1:5500" }); // signed in, page.errors collects console errors
await page.goto("http://127.0.0.1:5500/admin/shop");
await page.screenshot({ path: "<your scratchpad>/shop-390.png" }); // NEVER into the repo
await browser.close();
```

Baseline captures of every public page, taken by the foundation on the local stack with empty tables (compare
yours against these; the home hero film differs by about 3,000 pixels between any two runs, which is noise):
`/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/admin/audit-1440/<page>.png` and `.../admin/audit-390/<page>.png`.

Public-site audit (contrast + overflow): `node scripts/qa/audit.mjs --port <port> --out <scratchpad dir> [--only <page>] [--width 390 --height 844]`.

## 2. Schema you build on (0001-0006 + 0008)

All tables have RLS. `public.is_admin()` = the caller's `auth.uid()` is in `public.admins`. Policies:
"admin all" on content_blocks, categories, posts, people, media_items, products, settings; admin read on orders,
admins; admin read + update on enquiries. Public read: content_blocks, categories, media_items, settings (all
rows), posts (status published AND published_at <= now()), people (visible), products (active).

Columns (new in 0008 marked +):

- `products`: id, title, slug (unique), description, price_cents (int > 0), currency ('eur'), thumbnail (full public URL), file_path (path INSIDE product-files, no bucket prefix), active (bool, default false), created_at, +sort_order int, +thumbnail_alt text, +updated_at.
- `orders` (read only): id, stripe_session_id, product_id, download_token, expires_at, download_count, max_downloads, amount_cents, currency, created_at, payer_email, withdrawal_consent_at. No admin update policy, on purpose.
- `enquiries`: id, route ('general','partnership','educator','press','notify'), name, email, organisation, message, created_at, handled (bool). Admin may update `handled` only (that is the status the schema supports: handled / not handled; "new" = handled false).
- `posts`: id, title, slug (unique), category_id, excerpt, body (plain text, Markdown subset rendered by src/components/journal/PostBody.tsx), hero_image (full public URL), hero_alt, status ('draft','scheduled','published'), published_at, author, created_at, updated_at.
- `categories`: id, name, slug (unique), description, sort_order. Written default strands with slugs research / process / parents / company live in src/components/journal/data.ts and are matched on slug.
- `people`: id, name, role, bio (paragraphs separated by a blank line), photo (full public URL), type ('team','advisor'), sort_order, visible, unconfirmed, +phases smallint[] (1..5), +photo_alt, +asset_key (an AssetKey from src/lib/brand.ts, the bundled portrait used while photo is empty). 0008 deleted the five stale 0003 seed rows, so the table starts EMPTY.
- `media_items`: id, title, outlet, published_on (date), description, thumbnail, link, embed_url, sort_order, +kind ('press','podcast','interview','video', default 'press'), +thumbnail_alt.
- `content_blocks`: id, page, section_key, type ('text','richtext','image','link'), value jsonb, updated_at; unique (page, section_key). Text value `{ "text": "..." }`, image value `{ "url": "...", "alt": "..." }`.
- `settings` (key, value jsonb): `app` = `{ launched: boolean, target_window: string|null, app_store_url: string|null, play_store_url: string|null }`; `links` = `{ show_site: string, social: { instagram?, facebook?, tiktok?, youtube?, linkedin? } }`; `integrations` (not for panels).

Storage (0008 adds bucket rules, enforced by Storage itself):
- `public-media`: public read; admin write/update/delete; JPEG/PNG/WebP/AVIF only, 10 MB. SVG is refused.
- `product-files`: PRIVATE. Admin insert/update/delete/select only; nobody else can read; ZIP/PDF only, 50 MB. Buyers reach a file only through `api/download.ts` (signed URL, 15 min).

RPC (0008): `admin_reissue_download(p_order uuid)` gives an order a fresh 24 hours and resets download_count to 0 on the SAME token. Checks is_admin() itself. Use `reissueDownload()` from @/lib/admin.

Shards add NO migrations. If you genuinely cannot do your task without a schema change, stop and report it.

Deploy note (for the human, not you): the live project needs 0008 applied before any panel ships.

## 3. Import surface (FROZEN: import, never edit)

### 3a. `@/lib/admin` (admin chunk ONLY; never import from a public page)

```ts
type Result<T> = { data: T; error: null } | { data: null; error: string };   // error is a plain English sentence
// Narrow with `if (r.error !== null) ...`  (NOT `if (r.error)`, which TypeScript cannot narrow)

type ProductRow, PostRow, PersonRow, MediaRow, Category, ContentBlock, Enquiry, Order, AppSetting, LinksSetting
interface Tables { products; posts; categories; people; media_items; orders; enquiries; content_blocks }

explainError(err: unknown): string
listRows<K>(table: K, opts?: { columns?; order?: {column, ascending?}[]; eq?: Partial<Record<col, string|number|boolean>>; ilike?: {column, value}; limit? }): Promise<Result<Tables[K][]>>
getRow<K>(table, id): Promise<Result<Tables[K] | null>>
insertRow<K>(table, values: Partial<Tables[K]>): Promise<Result<Tables[K]>>
updateRow<K>(table, id, values: Partial<Tables[K]>): Promise<Result<Tables[K]>>
deleteRow(table, id): Promise<Result<null>>
countRows<K>(table, eq?): Promise<number | null>
reorderRows(table: "products"|"people"|"media_items"|"categories", ids: string[]): Promise<Result<null>>  // writes sort_order 1..n in the order given

listBlocks(page): Promise<Result<ContentBlock[]>>
saveBlock(page, key, type: "text"|"image", value: {text} | {url, alt}): Promise<Result<ContentBlock>>  // upsert, sets updated_at, invalidates the public cache
resetBlock(page, key): Promise<Result<null>>   // deletes the row = original wording again

getSetting<K extends "app"|"links">(key): Promise<Result<Partial<SettingsMap[K]> | null>>
saveSetting<K>(key, value: SettingsMap[K]): Promise<Result<null>>   // replaces the whole value: read, change, save

downloadPath(token): string                    // "/download/<token>"
reissueDownload(orderId): Promise<Result<{ token, expiresAt, path }>>

IMAGE_BUCKET = "public-media"; FILE_BUCKET = "product-files"; IMAGE_RULES; FILE_RULES
validateImage(file): string | null; validateProductFile(file): string | null; formatBytes(n): string
uploadImage(file, folder): Promise<Result<{ path, url }>>                       // folder: "products" | "people" | "posts" | "media" | "pages/<page>"
uploadProductFile(file, stem, onProgress?: (0..1) => void): Promise<Result<{ path }>>   // PRIVATE bucket, XHR with progress
removeFile(bucket, path): Promise<Result<unknown>>
publicUrl(path): string; pathFromPublicUrl(url): string | null

slugify(text): string; SLUG_PATTERN
formatEuro(cents): string        // 499 -> "€4.99"
parseEuro(text): number | null   // "4.99" / "4,99" / "€5" -> cents
formatDateTime(iso): string      // Irish time; formatDate(iso): string
useLoad<T>(loader: () => Promise<Result<T>>, deps): { data, error, loading, reload }
// re-exported from content: useSetting, invalidateBlocks, invalidateSettings
```

### 3b. `@/lib/content` (public read layer; the ONLY CMS import a public page may use)

```ts
useBlock(page: string, key: string, fallback: string): string        // fallback renders first; a non-empty row overrides; no loading state
useImageBlock(page, key): ImageOverride | null                        // { url, alt } or null; null = keep the bundled asset
emphasis(text: string, wrap?: (clause: string, i: number) => ReactNode): ReactNode   // "*words*" -> <em>words</em> (or wrap(...)); React elements only, never HTML
splitParagraphs(text): string[]                                       // multi-paragraph blocks: split on blank lines
useSetting<K extends "app"|"links">(key, fallback: SettingsMap[K]): SettingsMap[K]   // fallback first, row fields (non-null) override
invalidateBlocks(page?); invalidateSettings()
usePageBlocks / block: legacy, do not use in new code
type ImageOverride = { url: string; alt: string }
```

It imports supabase-js DYNAMICALLY so the public entry chunk stays free of it. Public pages never import
`@/lib/supabase` statically and never import `@/lib/admin`.

### 3c. `@/lib/blocks` (the CMS registry)

```ts
type PageId = "home"|"story"|"team"|"ethical-ai"|"case-study"|"journal"|"app"|"media"|"shop"|"contact"|"privacy"|"terms"|"cookies"|"404"
interface BlockDef { page; key; label; kind: "line"|"paragraph"|"image"; required; section; emphasis?; multi?; asset?: AssetKey; source }
PAGES: { id, label, path, wiredBy }[]
BLOCKS: BlockDef[]
blocksFor(page); findBlock(page, key); sectionsFor(page): { section, blocks }[]
blockValueError(def, value): string | null     // empty required text, odd number of stars, image without alt
loadDefaults(page): Promise<Record<string, string>>   // the page's COPY object, imported lazily
COPY_MODULES: Record<PageId, string>                  // where each page's COPY lives
```

Every text block is required. Image blocks are optional (absent = bundled asset). `emphasis` blocks write the
accent clause between single stars. `multi` blocks hold paragraphs separated by a blank line.

### 3d. Defaults: the COPY rule (all wiring work)

Each page keeps its editable copy in ONE exported object `COPY: Record<string, string>` keyed by block key,
holding the text exactly as rendered today (JSX entities decoded: `&amp;` is `&`, `&Eacute;` is `É`, `&reg;`
is `®`; JSX line wraps collapse to single spaces; emphasis clauses wrapped in `*stars*` around exactly the words
the page puts in `<em>` / `<Underline>`). The page renders `useBlock(page, key, COPY[key])`. Image blocks have
no COPY entry; render `<Figure asset=... override={useImageBlock(page, key)} />` or
`<PageHero asset=... override={useImageBlock(page, key)} />`.

| Page | COPY lives in | Wired by |
|---|---|---|
| home | `src/components/home/copy.ts` | cms-wiring |
| story | `src/components/story/copy.ts` | cms-wiring |
| team | `src/components/teampage/copy.ts` | cms-wiring |
| ethical-ai | `src/components/ethical-ai/copy.ts` | cms-wiring |
| case-study | `src/components/casestudy/copy.ts` | cms-wiring |
| contact | `src/components/contact/copy.ts` | cms-wiring |
| journal | `src/pages/Journal.tsx` (`export const COPY`) | cms-wiring |
| 404 | `src/pages/NotFound.tsx` (`export const COPY`) | cms-wiring |
| privacy, terms, cookies | `src/pages/Legal.tsx` (`export const LEGAL_COPY = { privacy: {...}, terms: {...}, cookies: {...} }`, keys `title`, `intro`, `section.N.heading`, `section.N.body` with N from 1; derive it from DOCS so it is exact; body = paragraphs joined with "\n\n") | cms-wiring |
| app | `src/pages/AppPage.tsx` (`export const COPY`) | media-app-links |
| media | `src/pages/Media.tsx` (`export const COPY`) | media-app-links |
| shop | `src/components/shop/copy.ts` | shop |

The `copy.ts` files exist as empty placeholders (`export const COPY: Record<string, string> = {};`); the owning
shard fills them. Every text key in `blocksFor(page)` must be present in that page's COPY, and nothing else.

### 3e. Kit: `@/components/admin/kit` (styles in kit/admin.css, loaded by the shell)

```tsx
<AdminButton variant="primary"|"quiet"|"danger"|"danger-solid" size="md"|"sm" busy busyLabel="Saving" onClick>  // type="button" by default
<AdminLinkButton to="/admin/shop/new" variant size>
<PageHeader title intro? actions? back?={{ to, label }} />          // every panel view starts with one; h1 inside
<StatusPill tone="ok"|"warn"|"off"|"alert">Published</StatusPill>
<Notice tone="ok"|"error"|"info">...</Notice>
<EmptyState title body? action? />
<MoveButtons label first last onUp onDown disabled? />  + moveId(ids, id, -1|1): string[]   // reorder; then reorderRows()
<DataTable rows columns={[{ key, label, render, primary?, hideOnPhone?, numeric? }]} rowKey onRowClick? loading error empty={{ title, body?, action? }} caption? />
    // table on a desk, cards under 720px; handles loading / error / empty itself
<TextInput label value onChange={(v) => ...} hint? error? optional? ...inputProps />
<TextArea label value onChange rows? hint? error? optional? />
<Select label value onChange options={[{ value, label }]} />
<Checkbox label checked onChange hint? />
<Segmented label value onChange options={[{ value, label }]} hideLabel? />   // 2 to 4 choices, e.g. Published / Hidden
<DateTimeInput label value={iso|null} onChange={(iso|null) => ...} />   // + toLocalInput / fromLocalInput
<SlugField value onChange source={title} prefix="/shop/" />   + slugError(slug): string | null
<PriceField cents={number|null} onChange={(cents|null) => ...} />    // types "4.99", stores cents
<ImageUpload label value={{url, alt}|null} onChange folder="products" required? defaultPreview?={{ src, alt }} />
    + imageError(value, required?): string | null      // uploads on pick to public-media; alt text required
<FileUpload path={file_path} onChange={({ path, name, size }) => ...} stem={slug} />   // PRIVATE product-files, progress bar
const toast = useToast(); toast("Published"); toast("Could not delete. Try again.", "error");
const save = useSaveState(); await save.run(async () => r.error !== null ? { error: r.error } : "Saved"); save.fail("A title is required.");
<SaveBar status={save.status} dirty onSave saveLabel="Save" savingLabel="Saving">{extra buttons}</SaveBar>   // sticky bottom
const confirm = useConfirm(); if (!(await confirm({ title, body, confirmLabel: "Delete product", destructive: true }))) return;
```

ToastProvider and ConfirmProvider are mounted by the shell: never mount them in a panel.
Use Tailwind utilities for layout inside a panel (`grid`, `gap-4`, `mt-6`, `flex-wrap`) and the kit classes
`adm-card`, `adm-stack`, `adm-grid2`, `adm-h2`, `adm-label`, `adm-muted`, `adm-linkbtn`. Do not add CSS files
for the admin; if something truly needs a style, use a small Tailwind utility on the element.

### 3f. Shell and panel registry (`src/pages/admin/Admin.tsx`, `src/components/admin/registry.ts`)

The shell signs in (Supabase email + password), calls `is_admin()` and shows "This account cannot edit the site"
to a non-admin, renders the top bar (brand, View site, email, Sign out), the section nav and the home tiles with
counts, and mounts each panel lazily at `/admin/<key>/*` inside `<main>` with a Suspense fallback.

| key | Label | Export | File | Route | Shard |
|---|---|---|---|---|---|
| pages | Pages and photos | `PagesPanel` | `src/components/admin/pages/PagesPanel.tsx` | `/admin/pages/*` | pages-cms |
| journal | Journal | `JournalPanel` | `src/components/admin/journal/JournalPanel.tsx` | `/admin/journal/*` | journal |
| people | Team and advisers | `PeoplePanel` | `src/components/admin/people/PeoplePanel.tsx` | `/admin/people/*` | people |
| media | Media and podcast | `MediaPanel` | `src/components/admin/media/MediaPanel.tsx` | `/admin/media/*` | media-app-links |
| shop | Shop | `ShopPanel` | `src/components/admin/shop/ShopPanel.tsx` | `/admin/shop/*` | shop |
| app | App | `AppPanel` | `src/components/admin/app/AppPanel.tsx` | `/admin/app/*` | media-app-links |
| links | Links and settings | `LinksPanel` | `src/components/admin/links/LinksPanel.tsx` | `/admin/links/*` | media-app-links |
| enquiries | Enquiries | `EnquiriesPanel` | `src/components/admin/enquiries/EnquiriesPanel.tsx` | `/admin/enquiries/*` | enquiries |

Each file exists as a placeholder; replace it. The export is a NAMED function component taking no props.
Inside, use nested `<Routes>` with RELATIVE paths (`<Route index>`, `<Route path="new">`, `<Route path=":id">`,
`<Route path="orders">`) and ABSOLUTE links (`/admin/shop/new`). Split a panel into more files inside your
folder as you like. The home tile counts are already in the registry (unread enquiries, published/draft posts,
products on sale, changed blocks).

### 3g. Shared components a shard may change (additions only, foundation-made)

- `src/components/PageHero.tsx`: new optional `override?: ImageOverride | null` replaces the still (needs `asset` too). FROZEN.
- `src/components/Figure.tsx`: new optional `override?: ImageOverride | null`, keeps the asset's width and height. FROZEN.
- `src/components/team/people.ts`: `Member.photo?: ImageOverride | null` added (people shard owns the file; keep the field).
- `src/components/team/useTeam.ts`: `useTeam(): { team: Member[]; advisors: Member[] }`, a stub returning the bundled lists. The people shard replaces the body (bundled first, DB rows override, no loading state); the signature is frozen. cms-wiring makes every TEAM/ADVISORS consumer it owns (Team.tsx, Story.tsx `PEOPLE`, Contact.tsx `READERS`) call `useTeam()` inside the component, and passes `override={m.photo ?? null}` wherever it renders a person's Figure.

## 4. Frozen list (no shard edits these)

`src/lib/admin.ts`, `src/lib/content.ts`, `src/lib/blocks.ts`, `src/lib/types.ts`, `src/lib/supabase.ts`,
`src/lib/site.ts`, `src/lib/brand.ts`, `src/components/admin/kit/*`, `src/components/admin/registry.ts`,
`src/pages/admin/Admin.tsx`, `src/App.tsx`, `src/components/Layout.tsx`, `src/components/PageHero.tsx`,
`src/components/Figure.tsx`, `src/components/ui.tsx`, `src/styles/index.css`, `src/components/journal/*`
(import PostBody and data.ts helpers read only), `api/*`, `supabase/*` (all migrations, config.toml),
`.parallel/admin/*` except your own scratch outside the repo, `package.json`, lockfile. Touch only your owns list.
Never `git add`, `git commit`, `git stash` or `git checkout` anything: other shards are writing in the same tree.

## 5. Shards (owns lists fixed and disjoint)

### shop: `ShopPanel` in `src/components/admin/shop/ShopPanel.tsx`
Owns `src/components/admin/shop/*`, `src/pages/ShopProduct.tsx`, `src/pages/Shop.tsx`, `src/pages/Download.tsx`, `src/components/shop/*` (incl. `copy.ts`).
- Products list (sort_order then created_at; Published / Hidden pill; price; reorder with MoveButtons + reorderRows).
- Create / edit: title, SlugField (prefix `/shop/`), description (TextArea), PriceField (stored as price_cents, currency 'eur'), ImageUpload folder "products" into `thumbnail` + `thumbnail_alt` (alt required), FileUpload into `file_path` (required before publishing; stem = slug), active as a Segmented "Published" / "Hidden". Delete confirms; refuse to delete a product that has orders (FK 23503 comes back as a sentence; say so before trying if you can). Replacing a file may remove the old object with removeFile.
- Orders view (`/admin/shop/orders`): newest first; product title, amount (formatEuro), payer_email, consent time (formatDateTime), downloads used of max, expiry; search by email (listRows ilike payer_email); per order "Give a fresh link" (confirm, then reissueDownload) and show/copy the full link `${location.origin}${path}`. No editing of orders otherwise.
- Prove it: create all six episode packs on the LOCAL stack through the panel (Playwright upload from `/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/packs`): titles "The Feather: episode pack", "The Strawberry: episode pack", "Chicken Vision: episode pack", "The Cuckoo: episode pack", "Colour Quest: episode pack", "Fluffy Clouds: episode pack"; EUR 4.99; cover `episode-0N-cover.png` as thumbnail with real alt text; the zip as the file; descriptions listing EXACTLY what is in each zip (episodes 1 to 4: the activity book in colour and in black and white, the colouring book, and the activities away from the screen, four PDFs; episodes 5 and 6: the activity book in black and white, the colouring book and the activities away from the screen, three PDFs; check with `unzip -l`). Then check `/shop` and `/shop/<slug>` render them.
- Public copy: a pack is a ZIP of PDFs, not a PDF. Change only product-facing words that are now false (e.g. "What arrives is a PDF", the "Printable PDFs" eyebrow line, download wording) in the site's voice. Wire the shop page's registry blocks (`blocksFor("shop")`) through `src/components/shop/copy.ts` + useBlock, pixel-identical apart from the corrected words.

### enquiries: `EnquiriesPanel` in `src/components/admin/enquiries/EnquiriesPanel.tsx`
Owns `src/components/admin/enquiries/*`.
Inbox newest first: route (as words: General, Partnership, Educator or case study, Press, App launch list), name, email, organisation, message, received (formatDateTime). Filter by route (Select) and status (Segmented: New / Handled / All). Mark handled / not handled (updateRow handled; toast "Marked as handled"). Reply = `mailto:` link with a subject. Open one enquiry to read it in full on a phone. Read-only otherwise. Messages are plain text: render as text (whitespace-pre-wrap), never HTML.

### journal: `JournalPanel` in `src/components/admin/journal/JournalPanel.tsx`
Owns `src/components/admin/journal/*`.
Posts list with StatusPill (Draft / Scheduled for <date> / Published). Create / edit: title, SlugField (prefix `/journal/`), strand (Select of categories, plus "No strand"), excerpt, body (TextArea, rows 16, with a short visible guide to the Markdown subset PostBody renders: `## `, `### `, `> `, `- `, `1. `, `---`, `**bold**`, `*italic*`, `[text](link)`, `![caption](image-url)`), author, cover image (ImageUpload folder "posts" into hero_image / hero_alt), publish date (DateTimeInput). Scheduling: the public RLS shows a post only when status is 'published' AND published_at has passed, and nothing runs on a timer. So: "Save draft" stores status 'draft'. "Publish" stores status 'published' with published_at = the chosen date, or now when none is chosen. A post that is 'published' with a future published_at is shown in the panel as "Scheduled for <date>" and goes live by itself at that time. Do not write status 'scheduled' (it would never go live). "Unpublish" (confirm) sets status 'draft'. Preview: an in-panel preview rendering the body with `<PostBody body={text} />` from `@/components/journal/PostBody`; plus "View on the site" link for live posts. Categories manager at `/admin/journal/strands`: list, add, rename, describe, reorder, delete (confirm). Verify a post created here appears on `/journal` and `/journal/<slug>`.

### people: `PeoplePanel` in `src/components/admin/people/PeoplePanel.tsx`
Owns `src/components/admin/people/*`, `src/components/team/*`.
List core team and advisers in running order; add, edit (name, role, bio paragraphs in a TextArea separated by blank lines, photo via ImageUpload folder "people" with alt, Segmented "Core team" / "Adviser", phases 1 to 5 as Checkboxes labelled with `PHASES` names, Visible checkbox), reorder (MoveButtons), delete (confirm). When the table is empty, an EmptyState offers "Import the current team": inserts every TEAM member as type 'team' and every ADVISORS member as 'advisor', in order, with bio = paragraphs joined "\n\n", phases, asset_key = member.asset, photo null, visible true, unconfirmed false. Then make `useTeam()` read `people` (visible, order by type then sort_order) through a DYNAMIC `import("@/lib/supabase")` (pattern: src/components/journal/data.ts), mapping rows to `Member` (bio = splitParagraphs, asset = asset_key, photo = photo ? { url: photo, alt: photo_alt } : null). Bundled lists render first; rows replace them once they arrive; an empty table or a failed request keeps the bundled lists. Update `PeopleStrip` / `Roster` (yours) to pass `override={m.photo ?? null}` to Figure. With an empty table every page must render pixel-identical.

### media-app-links: `MediaPanel`, `AppPanel`, `LinksPanel`
Owns `src/components/admin/media/*`, `src/components/admin/app/*`, `src/components/admin/links/*`, `src/pages/Media.tsx`, `src/pages/AppPage.tsx`.
- Media: media_items CRUD (title, outlet, kind Select, published_on date, description, link, embed_url optional, thumbnail via ImageUpload folder "media"), reorder, delete with confirm. Verify on `/media`.
- App: `settings.app`: launched as a Segmented "In development" / "Launched" with a confirm before launching, target_window, app_store_url, play_store_url (https:// only; validate). Wire `/app` and `/media` to `useSetting("app", { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null })` inside the components (module-level constants that read APP_LAUNCHED must move into the component or a function). Store links come from the setting when present.
- Links: `settings.links`: social accounts (instagram, facebook, tiktok, youtube, linkedin; https:// only) and show the show-site URL read only (it is fixed in src/lib/site.ts on purpose). The footer (Layout.tsx) is frozen and has no social links today: say so in the panel ("Shown on the site once the footer carries social links") rather than pretending.
- Wire `blocksFor("app")` and `blocksFor("media")` through `export const COPY` in each page + useBlock / useImageBlock.

### pages-cms: `PagesPanel` in `src/components/admin/pages/PagesPanel.tsx`
Owns `src/components/admin/pages/*`.
`/admin/pages`: list of PAGES with how many blocks are changed (listBlocks per page, or one listRows("content_blocks") grouped). `/admin/pages/:page`: sectionsFor(page) grouped under the section names; for each block its label, a "Changed" pill when a row exists, the live value, and the original (from `loadDefaults(page)`; image originals from `ASSETS[def.asset]` in `@/lib/brand`: `${base}.${fallback ?? "jpg"}` or a labelled placeholder when base is empty). Edit: TextInput for line, TextArea for paragraph (rows by length; multi blocks say "Leave a blank line between paragraphs"), emphasis blocks say "Put *stars* around the words to highlight"; ImageUpload folder `pages/<page>` for image. Save one block or "Save all changes"; blockValueError gates every save (no empty required block can be saved; the save button says why). "Reset to the original wording" (confirm, resetBlock). "View the page" opens PAGES[].path in a new tab. Phone first.

### cms-wiring: exports `Story` from `src/pages/Story.tsx` (default export stays for App.tsx)
Owns `src/pages/{Home,Story,Team,EthicalAi,CaseStudy,Journal,Contact,Legal,NotFound}.tsx`, `src/components/{home,story,ethical-ai,casestudy,contact,teampage}/*`.
Wire every registry block for home, story, team, ethical-ai, case-study, journal, contact, privacy, terms, cookies, 404 through COPY + useBlock / emphasis / splitParagraphs / useImageBlock, so the default IS the current copy character for character and every page is pixel-identical with an empty content_blocks table (compare audit captures before and after at 1440 and 390). Switch TEAM/ADVISORS consumers to `useTeam()` (see 3g). Then prove overrides: insert one content_blocks row per page on the LOCAL stack (`db.sh sql "insert into content_blocks (page, section_key, type, value) values ('story','hero.aside','text','{\"text\":\"Override test\"}')"`), see it render, then delete every test row you made.

## 6. Copy rules

- Irish English (organise, colour, programme, enquiry). ZERO em dashes and en dashes anywhere, code comments included. Use a comma, colon or full stop.
- Every action is confirmed in words: "Saved", "Published", "Moved to drafts", "Deleted", "Marked as handled", "Link renewed".
- Destructive actions (delete, unpublish, reset to original, launch the app) confirm first with a verb on the button ("Delete product", never "OK").
- Errors are one plain sentence saying what happened and what to do. Never a code, never "Error:".
- Labels a non-technical person understands: "Web address" not "slug", "Published / Hidden" not "active", "Describe the image" not "alt".
- No lorem, no invented numbers, no dashboards of fake figures, no sample rows left in the database.
- Spellings: CLÉ Family Media, The Pawsitive Pugs & Pals®, PupsPlayer™, Conor Sexton.

## 7. Security rules (non-negotiable)

- RLS is the gate. Never rely on hiding a button. Never put the service-role key, or anything from local.env other than VITE_* values, in src/.
- Product files go ONLY to product-files via FileUpload/uploadProductFile; images ONLY to public-media via ImageUpload/uploadImage. Never create a public URL or a signed URL for a product file in the browser.
- Validate type and size before upload (the kit does; do not bypass it).
- Never render user-controlled HTML: no `dangerouslySetInnerHTML`, no innerHTML. Journal bodies render only through PostBody.
- Links typed by the admin (store, social, media) must be `https://` (or `http://`) before saving; render with `rel="noreferrer"` when opening a new tab.
- Public pages never import `@/lib/admin` or import `@/lib/supabase` statically.

## 8. Design rules for the admin

Same house as the site: warm paper, Calistoga headings, Hanken body, Spline Sans Mono labels, the site's `.btn` and
`.field-*`, 2px control edges. Dense, calm, obvious. Nothing under 13px. Phone first: test at 390px; 44px targets;
one column under 720px; the SaveBar at the bottom. No shadows, no gradients, no motion beyond colour changes, no
icon chips, no emoji, no charts. Public pages must not change visually except where your task says so.

## 9. Verification (every shard, before you finish)

1. `npx tsc -p tsconfig.app.json --noEmit` exits 0.
2. `.parallel/admin/shard-lint.sh <ExportName> <export path> <each owned glob>` exits 0, e.g.
   `.parallel/admin/shard-lint.sh ShopPanel src/components/admin/shop/ShopPanel.tsx 'src/components/admin/shop/*' src/pages/ShopProduct.tsx src/pages/Shop.tsx src/pages/Download.tsx 'src/components/shop/*'`
   (media-app-links: run it three times, once per panel export; cms-wiring: export `Story` from `src/pages/Story.tsx`).
3. Playwright through `.parallel/admin/pw.mjs` at 390 and 1440: do the task end to end on the local stack, screenshot to your scratchpad, READ the screenshots, and confirm `page.errors` is empty.
4. Public pages you own or wire: `node scripts/qa/audit.mjs --port <port> --out <scratchpad>/<name> --only <page>` shows overflow 0 and contrast failures 0, at 1440 and at 390 (`--width 390 --height 844`); with an empty content_blocks table the capture matches the one taken before your change.
5. `git status --short` shows changes only inside your owns list (plus nothing else you created outside the repo). `git status supabase/migrations` shows 0007 untouched.
6. Leave the local stack running, leave no test rows behind except what your task says to create (the six packs, the proof post if your task says to verify one).
