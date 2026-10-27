# DONE WHEN: run 2026-10-27-fanout

The shared DONE list. The builder works to it; the review gate may fail a
shard ONLY on an item below or on a shard-lint FAIL. Every item is checkable
from the shard's own files or its captures in
`/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/fanout/<shard>/after-1440` and `after-390`.

## Contract

- C1. `bash .parallel/shard-lint.sh` prints `shard-lint: clean` for every command of the shard:
  - story: `Story src/pages/Story.tsx src/pages/Story.tsx 'src/components/story/*'`
  - team-casestudy: `Team src/pages/Team.tsx src/pages/Team.tsx 'src/components/teampage/*'` and `CaseStudy src/pages/CaseStudy.tsx src/pages/CaseStudy.tsx 'src/components/casestudy/*'`
  - ethical-ai: `EthicalAi src/pages/EthicalAi.tsx src/pages/EthicalAi.tsx 'src/components/ethical-ai/*'`
  - app: `AppPage src/pages/AppPage.tsx src/pages/AppPage.tsx 'src/components/app/*'`
  - journal: `Journal src/pages/Journal.tsx src/pages/Journal.tsx src/pages/JournalPost.tsx 'src/components/journal/*'` and `JournalPost src/pages/JournalPost.tsx src/pages/JournalPost.tsx`
  - media: `Media src/pages/Media.tsx src/pages/Media.tsx 'src/components/media/*'`
  - shop: `Shop src/pages/Shop.tsx src/pages/Shop.tsx src/pages/ShopProduct.tsx src/pages/Download.tsx 'src/components/shop/*'`, `ShopProduct src/pages/ShopProduct.tsx src/pages/ShopProduct.tsx` and `Download src/pages/Download.tsx src/pages/Download.tsx`
  - contact: `Contact src/pages/Contact.tsx src/pages/Contact.tsx 'src/components/contact/*'`
  - utility: `Legal src/pages/Legal.tsx src/pages/Legal.tsx src/pages/NotFound.tsx 'src/components/legal/*'` and `NotFound src/pages/NotFound.tsx src/pages/NotFound.tsx`
- C2. Only owned paths changed or added (`git status --short` entries outside the shard's owns list are not the shard's; any frozen file showing as modified by this shard fails it).
- C3. Every route the shard owns opens with `<PageHero` from `@/components/PageHero`, except the exemptions its BRIEF names (`/team` bench opening, the journal post and shop product found-state layouts). The page renders exactly one `<h1>`.
- C4. Every `PageHero` with `asset` set passes a `credit` that says the picture is a frame from the series (or, for a `dog.*` key, a photograph). No two of the shard's routes open on the same asset, and no page shows the same asset twice.
- C5. No new framed-picture treatment: a mid-page frame from the series is a `ShowFrame`, at most one per page, never the same asset as that page's PageHero.
- C6. Page-specific CSS lives only in `.css` files inside owned folders, and no rule in them targets `.film-*`, `.show-frame*`, `.hero-head*`, `.page-hero*`, `.t-*`, `.btn*`, `.wall`, `.bench`, `.grove`, `.deep`, `.hairline`, `.card*` or `.eyebrow*`.
- C7. No `!py-*`, `!pt-*`, `!pb-*` spacing escapes; section rhythm only through `Section pad` and `Container width`.

## Correctness

- K1. `npx tsc -p tsconfig.app.json --noEmit` reports zero errors in the shard's files.
- K2. The audit prints `overflow: 0   contrast failures: 0   pages that never loaded: 0` for every key the shard owns at 1440 AND at 390 (keys and flags in CONTRACT section 4, including `journal-post` and `shop-product` with `--stub`).
- K3. No real text under 13px: no `text-xs`, no `text-[<13px]`, no CSS `font-size` under 13px, except a line marked `print-mark` (lint SMALL-TYPE).
- K4. Rules and hairlines 1.5px, no bare Tailwind `border`/`border-l`/`border-b`, `h-px`, `w-px` or `1px solid` (lint THIN-RULE); controls the shard builds have 2px edges; SVG strokes the shard draws are `strokeWidth` 2 or more.
- K5. Any `@keyframes`, `transition` on transform/opacity, or `animation` the shard adds has a `prefers-reduced-motion: reduce` collapse in the same file and uses `var(--ease-out)`; nothing loops (`infinite`), bounces or auto-advances.
- K6. Accessibility: every `<img>` has `alt` (decorative ones `alt=""` plus `aria-hidden` on the wrapper); every `<section>` that has a heading is labelled by it (`labelledBy`); heading levels do not skip (h1, then h2, then h3); every control the shard builds is a real `button` or `a` with an accessible name; any disclosure toggles `aria-expanded`.
- K7. At 390 no section is narrower than the column it sits in, nothing is clipped, and no control the shard builds is under 44px tall (visible in `after-390/<key>.png`).
- K8. Every existing link (`to=` / `href=`), form, form field, price, status line, legal sentence and download message from the BEFORE version of the shard's files is still present (moved is fine). Diff check: every `to="` / `href=` value in `git show HEAD:<file>` appears in the shard's current files.

## Copy

- W1. Zero em dashes and en dashes in owned files (lint DASH).
- W2. Spellings exact: `The Pawsitive Pugs &amp; Pals` with `&reg;`/`®` on first use per page, `PupsPlayer` with `&trade;`/`™` on first use per page, `CLÉ` / `CL&Eacute;` always with the accent, `Conor Sexton`.
- W3. No new fact: every heading or line the shard wrote is either a sentence already in the BEFORE file or a restatement that adds no new number, date, name, partner, outcome or claim. The shard report lists every rewritten heading with its source sentence.
- W4. No heading is a disclaimer or a negation of something the company does not do (no "None of", "No logo", "not ours", "does not ask"); headings state what is (lint RETIRED-COPY covers the named ones).
- W5. Irish/UK spelling throughout new copy (colour, programme, organise, centre).

## Direction

- D1. The opening reads as the hero's: picture or plain panel in the hero's frame, eyebrow top left, aside (if any) top right, headline bottom left at PageHero scale, actions under it, visible in `after-1440/<key>.png` against `home-1440.png`.
- D2. No section on the page opens with a filing-label heading (a noun phrase that names the section: "The index", "Where it started", "What a purchase is") followed by a grey lead; each section heading is the claim. Exemptions only where the BRIEF names one.
- D3. No two consecutive sections open in the same text shape (same heading class, same left edge, followed by a `Lead`/`t-lead`), checked by reading the page's sections in order.
- D4. Each section the BRIEF tells the shard to change has changed shape as the BRIEF describes, and each section it tells the shard to cut or merge is gone or merged.
- D5. Credits and provenance notes are small right aligned mono lines (`text-right font-mono text-[13px]`), never centred and never full width.
- D6. Drawn kit use on the page is at most one drawn object; no `Watermark`; the line sketches the BRIEF names are removed, not restyled.
- D7. One `bench` (or `bench grove`) section at most and one `deep` section at most per page; no new surface colours or gradients.
- D8. At 390 the page's primary task comes before secondary material where the BRIEF says so (the form on `/contact`, the download button on `/download`).
