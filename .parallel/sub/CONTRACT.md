# CLE subpages rebuild: frozen contract

Run `2026-10-28-subpages`. Repo `/home/david/Documents/GitHub/clients/cle-media`, branch `admin-console`. Do not switch branches. Do not commit. Do not `git add`.

The plan is law: `docs/SUBPAGE-PLANS-2026-10-28.md`. Read "## Site-level system" and the "## Critic's verdict" cross-site note at the very end (rules 1 to 8), then your own page section in full (it runs to the next `## <page>` heading). Where your page section says **[revised]** or **[verdict]**, that line wins over anything earlier in the same section. This contract turns the shared rules into code; where it is silent, the plan section decides.

## 1. What every subpage is now

Each subpage is a different KIND of object (letter, register, document, protocol sheet, product sheet, contents page, press kit, catalogue, form, notice). It opens on its own object, not on a hero. The home formula is rejected and is gone from every subpage.

### Do

- Open on the object your plan names (portrait, faces, title block, route drawing, device, list, facts sheet, shelf, form, notice). The first real content is above the fold at 390 x 844 and at 1440 x 900.
- Headline: `<h1 className="t-h1">` (Calistoga via `--font-display`; 66px at 1440, 36px at 390). The h1 is a noun label or a verbatim fact sentence, never a claim.
- Type classes from `src/styles/index.css`: `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead` (21/18px), `.t-body` (17px, 1.64), `.t-prose` (18px, 1.7, running text), `.t-sm`, `.eyebrow` + `.eyebrow-sm` (14px) / `.eyebrow-xs` (13px), `.hairline` (1.5px top rule), `.tnum`.
- Floors: body never under 17px; captions, mono labels and roles never under 13px; every rule 1.5px (`border-*-[1.5px] border-rule`, `.hairline`) and at least 3:1. `lines.mjs` measures it.
- Tokens only (Tailwind theme names): `paper-1/2/3`, `raised`, `sunken`, `bench`, `grove`, `ink`, `body`, `muted`, `red`, `red-fill`, `red-deep`, `rule`, `rule-soft`, `edge`, `edge-dark`. No new hex in a page.
- Shell: `import { Container, Section, TextLink, Lead, Kicker, Button, DisclosurePanel } from "@/components/ui"`. `<Container width="wide">` (1560 cap, left-aligned). `Section pad` steps: `open | normal | tight | close | none` or a `[top, bottom]` pair.
- One entrance per page through `Settle` (`@/components/Settle`): the opening object first, then the type, 8px, 0.7s, 60ms stagger over direct children. One drawing per page at most, from `components/draw` or your own existing drawing.
- End on ONE line and ONE link, then the footer. Use `ClosingLine` (below) or the plan's exact equivalent. The reading order: story to team, team to Responsible AI, Responsible AI to contact, app to shop and show site, shop to app, press kit to contact, journal to nothing, contact ends on its page-answers list.
- Real assets only. Captioned frames say what they are. Flat illustration (Victoria Buchkova's covers and pages) only on `/shop`, `/app` (and `/case-study` when supplied), always as product with the credit, never decoration.
- Irish English, the brand spellings from `CLAUDE.md` (CLÉ Family Media, The Pawsitive Pugs & Pals®, PupsPlayer™, Conor Sexton), registered marks on first use per page. A show title in running text is `<cite>` or `<i>`, never `<em>`.
- Prices only from `formatPrice(p.price_cents, p.currency)` ("€4.99" style). The string "EUR" never appears.

### Do not

- No `PageHero` (import, JSX or comment). It is deleted at integration.
- No `font-hero`, no Fraunces, no `<em>`, no `emphasis()` call (strip the `*stars*` from your COPY defaults), no `.t-display`.
- No navy band: no `<Section deep>`, no `.deep` class. No `.wall`/`.bench`/`.grove` band unless your plan names it (team keeps the grove band for the faces; shop keeps the bench shelf).
- No `film-hero`, `film-frame`, `film-copy`, `hero-head`, `page-hero*` class. No scrimmed frame under a headline, no frame as wallpaper, no pill pair under a headline.
- No dotted leader outside journal and the shop docket (`.leader`, `border-dotted`). Status/fact rows elsewhere are plain ruled rows.
- No mono numerals in a margin outside `/ethical-ai` and the legal pages. Case-study and media use mono labels alone.
- Faces only on `/team` (large), `/story` (Conor only) and `/contact` (thumbnail). No `person.*` asset, `PeopleStrip`, `ReviewerRoom` or `PORTRAIT_FRAME` anywhere else. `/media` lists names and roles only.
- No `StageSequence`, `rk-board`, `rk-slip` (the slip board is cut).
- No `characters-0N` renders anywhere on this site.
- No invented fact, figure, quote, date, partner, version, "Facts checked", "Last updated", "Adopted", "Approved by", "Issue one". Where the plan says NEEDED FROM CLIENT, render the honest state the plan describes (usually: the row or block does not render) and do not fill it.
- No em dash, no en dash, anywhere (copy, code, comments, alt text). Use a comma, colon, semicolon, middle dot or two sentences.
- No pug watermark, no Watch/Play/Learn sketches, no "None of this is ours", no corner pug, no spot illustration beside a paragraph.
- Do not edit any frozen file (section 4). If you need a change in one, stop and report it.

## 2. The shared kit (built by the foundation, frozen)

### 2.1 Document kit: `@/components/doc` (ethical-ai and utility ONLY)

The legal shell extracted from `Legal.tsx` into one kit so the four documents (`/ethical-ai`, `/privacy`, `/terms`, `/cookies`) cannot drift. Any other shard importing `@/components/doc` fails lint.

```tsx
import {
  DocSheet, DocPublisher, DOC_GRID,       // sheet of card + tab row; body grid; "CLÉ FAMILY MEDIA" mono line
  DocStatus, type StatusRow,              // plain ruled dt/dd status rows; null value = row hidden
  DocContents, ContentsList, type ContentsItem, // sticky rail at lg + "Contents" disclosure on a phone
  DocClause, DocSubClause, DocFoot,       // numbered clause <section id>, sub-clause 2.1, foot line
  DocumentsShelf, DOCUMENTS, type DocumentId, // "The documents" shelf, Responsible AI first
  useActiveSection,                       // scroll-spy over section[id] inside a ref
  longDate, REVISED_LABEL,                // "24 October 2026"; "Wording last revised"
} from "@/components/doc";
```

- `DocSheet({ tabs, navLabel?, width?: "legal" | "wide" })`. Legal: `tabs={ORDER.map(id => ({ label: DOCS[id].tab, to: `/${id}`, current: id === doc }))}`, `width="legal"` (70rem, flush left). Ethical-ai: `tabs={[{ label: "Position statement", current: true }]}` (no `to`, renders a label tab), `width="wide"` (86rem, centred). Children render inside `.card-stock` with the legal padding.
- `DOC_GRID` = `grid gap-9 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20`. Contents column first, then `<div ref={body} className="max-w-[68ch]">` with the clauses.
- `const active = useActiveSection(body, doc);` then `<DocContents items={[{ id: "s1", n: "1", label: "Who we are" }, ...]} active={active} summary="8 sections" id="legal-contents" />`. Ethical-ai: `summary="6 clauses, 1 appendix"`, last item `{ id: "appendix-a", n: "A", label: "Questions" }`.
- `<DocClause id="s1" n="1" title={heading}>{paragraphs}</DocClause>`: h2 `.t-h3` sans bold, mono numeral in the gutter at `sm+`, inline under `sm`, body `.t-body` 17px (the shell's old 16px is retired for all four documents).
- `<DocSubClause n="2.1" title="First draft (phase 01)">...</DocSubClause>`: h3 20px sans bold, 1.5px rule above.
- `<DocStatus rows={[{ label: REVISED_LABEL, value: longDate(REVISED) }, { label: "Adopted", value: null }]} />`: NO leaders (settled by the journal and legal verdicts; the ethical-ai section's "dotted-leader status rows" is superseded). Null rows vanish.
- `<DocFoot title={title} revised={longDate(DRAFTED)} />` prints "Privacy policy. Wording last revised 24 October 2026." Never "Draft", never a version.
- `<DocumentsShelf current="privacy" />` after the sheet on all four routes. Its four rows and its closing sentence are fixed here.
- `LEGAL_COPY` stays exported from `src/pages/Legal.tsx` with the same keys; `DOCS`, `DRAFTED`, `COMPANY`, `markTerms` stay in `Legal.tsx` (utility owns them). Ethical-ai keeps its wording constant (`REVISED = "2026-10-24"`) in its own files.

### 2.2 `FactRows`: `@/components/FactRows` (case-study, app, media; anyone who needs plain fact rows)

```tsx
import { FactRows } from "@/components/FactRows";
<FactRows rows={[{ label: "Status", value: "Not yet open" }, { label: "Opens", value: "Date to be confirmed" }, { label: "Adopted", value: null }]} />
```

`dl`, 1.5px rule above each row and below the last, `dt` mono 14px uppercase 0.16em, `dd` `.t-body` ink `tnum`, `9rem` label column from `sm` (`labelWidth="12rem"` for long labels), label over value on a phone, `tone="dark"` on bench/grove. No leaders, no numerals. Null or empty values do not render.

### 2.3 `ClosingLine`: `@/components/ClosingLine` (every subpage that closes on a line and a link)

```tsx
import { ClosingLine } from "@/components/ClosingLine";
<ClosingLine link={{ to: "/team", label: closeLink }}>{closeLine}</ClosingLine>
<ClosingLine rule link={{ href: SITE.showUrl, label: "The show's own site" }}>{line}</ClosingLine>
```

`.t-lead` ink sentence, then one `TextLink` with an arrow (internal) or external mark (`href`). `rule` adds a 1.5px hairline above. Both strings come from COPY via `useBlock`. A plan that writes its closing inside the prose (story's letter, ethical-ai's clause 6, legal's shelf sentence) does it inline and does not need this.

### 2.4 The books: `@/lib/books` (app and shop; rule 6)

```ts
import { BOOKS_STATEMENT, BOOKS_CREDIT, AWAY_LABEL, PACKS, fileLine } from "@/lib/books";
```

- `BOOKS_STATEMENT`: "Three books for every episode: an activity book, a colouring book and a set of activities away from the screen. For episodes one to four the activity book comes in colour and in black and white. Eighteen books, all A4." Printed word for word where the plans print it; never reworded; no other count ("318", "22") in page copy.
- `BOOKS_CREDIT`: "Designed and illustrated by Victoria Buchkova."
- `AWAY_LABEL`: "Activities away from the screen". The booklet is captioned with no author ("Activities away from the screen, page two").
- `PACKS`: per episode `{ episode, title, books: 3, pdfs, files: [{ kind, label, pages, editions? }] }`, measured by pdfinfo. `fileLine(f)` gives "Activity book, 20 pages, in colour and in black and white". Prices are never here.

### 2.5 The dotted leader: `.leader` in `src/styles/index.css` (journal, shop docket ONLY)

`<span className="leader" aria-hidden="true" />` between `dt` and `dd` in a flex row. 2.2px dots in `--color-rule`, 7px pitch. Inside an armed `Settle` it draws left to right (`scaleX`, 0.6s, house ease, delayed by the row's `--i`); reduced motion shows it finished. Journal uses it for its masthead status rows, its contents rows and the missing-post contents; the shop docket may keep its existing dotted border or switch to `.leader`. Nobody else.

### 2.6 Navigation (done in `src/lib/site.ts`)

- About menu: Our story, Our team, Responsible AI. Case study returns only when `STUDY_OPEN` (`src/components/casestudy/config.ts`) is true; the footer keeps it.
- Footer "Press" is now "Press kit" (route `/media` unchanged). The media page's `<title>`/`Seo` title should read "Press kit" to match.

### 2.7 Existing shared pieces you use read-only

- `Figure` (`@/components/Figure`): `<Figure asset="story.garden" sizes="..." priority? override={useImageBlock(page, "hero.image")} rounded="rounded-[var(--radius-md)]" position="center 45%" />`. Asset keys live in `src/lib/brand.ts` (`ASSETS`): `story.garden`, `home.characters`, `show.meadow`, `show.snail`, `slate.ep1` to `slate.ep6`, `brand.cle`, `brand.show`, `object.cle-mark`, `person.*` (faces pages only), `dog.finn-1..4`, `dog.fia-1..4`, `app.screen1..3`, and so on. Do NOT add keys to `brand.ts` (frozen): for new images in your owned public folder use a plain `<picture>` with `<source type="image/webp">` + `<img src=".jpg" width height alt loading="lazy" decoding="async">`, real `alt`, intrinsic `width`/`height`.
- `Settle`, `MissionVideo`, `NotifyForm`, `Stage` (`@/components/render`), `components/draw/*`, `components/team/people.ts` + `useTeam`, `src/lib/episodes.ts`, `src/lib/site.ts` (`SITE`, `APP_LAUNCHED`), icons (`IconArrow`, `IconExternal`, `IconDownload`, ...).

## 3. The CMS pattern (keep it on every rebuilt page)

Every heading, lead, CTA, closing line and key paragraph comes from your page's `COPY` through `useBlock`, so Conor can edit it in `/admin`. COPY stays in the module `COPY_MODULES` in `src/lib/blocks.ts` names for your page (e.g. `src/components/story/copy.ts`, `src/pages/AppPage.tsx`, `src/pages/Legal.tsx` `LEGAL_COPY`). Defaults are the current text character for character; no `*stars*` any more.

```tsx
// src/components/story/copy.ts
export const COPY = {
  "hero.title": "The idea for CLÉ Family Media began while I was minding a friend's four-year-old son.",
  "next.lead": "I would rather answer your questions directly than have you guess at them from a website.",
} as const;

// src/pages/Story.tsx
import { useBlock, useImageBlock, splitParagraphs } from "@/lib/content";
import { COPY } from "@/components/story/copy";
const title = useBlock("story", "hero.title", COPY["hero.title"]);
const portrait = useImageBlock("story", "hero.image");
<h1 className="t-h1 max-w-[24ch]">{title}</h1>   // plain text: never emphasis(title)
```

- Hooks are called unconditionally, the same number of times on every render.
- Multi-paragraph blocks: `splitParagraphs(useBlock(...))`.
- Do NOT edit `src/lib/blocks.ts`. In your result, report the final block list: `key | label (plain words a non-technical editor understands) | kind line|paragraph|image | required yes|no | section`, plus keys retired. Integration updates the registry.

## 4. Frozen files (nobody edits; report a needed change instead)

`src/pages/Home.tsx`, `src/components/home/*`, `src/components/Layout.tsx`, `src/components/ui.tsx`, `src/components/Figure.tsx`, `src/components/Settle.tsx`, `src/components/Seo.tsx`, `src/components/MissionVideo.tsx`, `src/components/NotifyForm.tsx`, `src/components/PageHero.tsx` (deleted at integration, do not edit), `src/components/doc/*`, `src/components/FactRows.tsx`, `src/components/ClosingLine.tsx`, `src/components/render/*`, `src/components/draw/*`, `src/components/team/*` (home mounts `PeopleStrip`; team builds its register in `teampage/*` instead of editing `Roster`/`StandsAt`), `src/components/admin/*`, `src/lib/*` (incl. `blocks.ts`, `brand.ts`, `books.ts`, `site.ts`, `content.ts`, `episodes.ts`), `src/styles/index.css`, `api/*`, `supabase/*`, `public/brand/*` except your owned subfolder, `public/video/*`, `docs/*`, `.parallel/*` except your report.

Page-local CSS goes in a `.css` file inside your owned component folder, imported by your page, with class names prefixed by your shard (`story-`, `reg-`, `pos-`, `proto-`, `sheet-`, `jr-`, `kit-`, `cat-`, `form-`, `doc404-`).

## 5. Per-shard owns (claimed with pbuild)

| Shard | Owns |
|---|---|
| story | `src/pages/Story.tsx`, `src/components/story/*` |
| team | `src/pages/Team.tsx`, `src/components/teampage/*` |
| ethical-ai | `src/pages/EthicalAi.tsx`, `src/components/ethical-ai/*` |
| case-study | `src/pages/CaseStudy.tsx`, `src/components/casestudy/*` |
| app | `src/pages/AppPage.tsx`, `src/components/app/*`, `public/brand/activity/*` |
| journal | `src/pages/Journal.tsx`, `src/pages/JournalPost.tsx`, `src/components/journal/*` |
| media | `src/pages/Media.tsx`, `src/components/media/*`, `public/press/*` |
| shop | `src/pages/Shop.tsx`, `src/pages/ShopProduct.tsx`, `src/pages/Download.tsx`, `src/components/shop/*`, `public/brand/shop/*` |
| contact | `src/pages/Contact.tsx`, `src/components/contact/*` |
| utility | `src/pages/Legal.tsx`, `src/pages/NotFound.tsx`, `src/components/legal/*` |

Write only inside your owns. Deleting a file you own that nothing else imports is fine (e.g. `teampage/bench.css`, `journal/Correction.tsx`, `shop/NotAsked.tsx`); a file outside your owns that becomes unused is listed in your result for integration to delete (`StageSequence.tsx`, `StandsAt.tsx`, `ReviewerRoom.tsx` users, `PageHero.tsx`).

### Assets

Drive: `/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/drive/Episode 0N/` (`covers-0N/*.pdf`, `0N-png/*`, PDFs). Rendered covers: `.../scratchpad/packs/episode-0N-cover.png`. Copy only what your page shows into your owned public folder, web-optimised: webp plus jpg fallback, 1x and 2x at the displayed size (covers about 440px and 880px wide, pages about 440/880), quality about 80, metadata stripped, nothing over about 400KB. Never a 5MB original. `pdftoppm -r 200 -png` for a page render, then Pillow (`python3 -I`, WebP supported; there is no cwebp, ImageMagick or sharp on this box): `im.thumbnail((w, h)); im.save(out.webp, quality=80, method=6); im.convert('RGB').save(out.jpg, quality=82, optimize=True, progressive=True)`. Keep the Drive untouched.

## 6. Copy rules

- Every sentence on the page is either the client's existing wording (from the current page, COPY, `people.ts`, `stations.ts`, `episodes.ts`, `data.ts`, `catalogue.ts`), or a sentence the plan drafts in quotes. Nothing else.
- NEEDED FROM CLIENT items render nothing (or the honest absence the plan specifies, e.g. "Opens: Date to be confirmed"). They are listed in your result so integration adds them to `CONTENT-NEEDED.md`.
- Headings are nouns or verbatim facts, never claims. No tagline guff, no "seamless", no invented stats.
- No em or en dash. Middle dot `·` or comma between list items.

## 7. Verification (run all before reporting)

1. Lint, from the repo root:
   `bash .parallel/sub/shard-lint.sh <ExportName> <export path> <every owned path or glob>`
   e.g. `bash .parallel/sub/shard-lint.sh Story src/pages/Story.tsx src/pages/Story.tsx 'src/components/story/*'`. The export path decides the shard's exemptions (journal/shop may use `.leader`; ethical-ai/utility may import `@/components/doc`; team/contact/story may mount faces). Exit 0 required.
2. `npx tsc -p tsconfig.app.json --noEmit` clean. (If it fails only in another shard's file, say so; do not touch it.)
3. Dev server on your own port with Supabase unset, wrapped for memory:
   `pbuild run --weight 2G -- env VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= timeout 1200 npx vite --port <PORT> --strictPort` (background). Ports: story 5611, team 5612, ethical-ai 5613, case-study 5614, app 5615, journal 5616, media 5617, shop 5618, contact 5619, utility 5620.
4. `node scripts/qa/audit.mjs --port <PORT> --only <page> --out <scratchpad>/sub/<shard>-1440` and again with `--width 390 --height 844 --out .../<shard>-390`. Pages: `story team ethical-ai case-study journal app media shop contact privacy terms cookies 404`. Overflow 0 and contrast failures 0 at both widths. Re-run once before believing a contrast failure on a very tall page.
5. `node scripts/qa/lines.mjs --port <PORT> --only <page>`: no rule under 3:1 or 1.5px.
6. Look at both screenshots yourself (Read the png in slices) against your plan: opening object, section order, signature moment, mobile order. Screenshots go to the scratchpad, never the repo.
7. Routes with no audit slot (`/journal/:slug`, `/shop/:slug`, `/download/:token`): load them in the dev server and screenshot the first screen at 1440 and 390.
8. Kill your dev server.

Result: files changed, final block list, retired keys, unused files for integration, NEEDED FROM CLIENT items, and any frozen-file change you needed but did not make.
