# CONTRACT: carry the home page to every other page (run 2026-10-27-fanout)

Read this whole file, then `CLAUDE.md`, then your BRIEF. Nothing is committed
in this run: never `git add`, never `git commit`.

## 0. What this run is

The home page (`src/pages/Home.tsx`) was signed off by the client today. Its
hero is, in the client's words, "by far and away the best thing" on the site.
Every other route now has to read as if it belongs to that hero. You are not
inventing a new direction: you are carrying a settled one to your pages,
section by section, and the reference for every judgement is
`/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/fanout/home-1440.png`
(the home page at 1440, full length). The BEFORE capture of your own pages is
in `.../scratchpad/fanout/before-1440/<key>.png` and `before-390/<key>.png`.

The failure mode this client has named three times is **timid moves**: small
polite changes inside the existing boxes that leave a page reading the same.
Clear is the floor, not the goal. Do what your brief says at full strength.

## 1. File ownership

You edit ONLY the paths your shard owns. Everything else is read only.

| shard | owns |
|---|---|
| story | `src/pages/Story.tsx`, `src/components/story/*` |
| team-casestudy | `src/pages/Team.tsx`, `src/pages/CaseStudy.tsx`, `src/components/casestudy/*`, `src/components/teampage/*` |
| ethical-ai | `src/pages/EthicalAi.tsx`, `src/components/ethical-ai/*` |
| app | `src/pages/AppPage.tsx`, `src/components/app/*` |
| journal | `src/pages/Journal.tsx`, `src/pages/JournalPost.tsx`, `src/components/journal/*` |
| media | `src/pages/Media.tsx`, `src/components/media/*` |
| shop | `src/pages/Shop.tsx`, `src/pages/ShopProduct.tsx`, `src/pages/Download.tsx`, `src/components/shop/*` |
| contact | `src/pages/Contact.tsx`, `src/components/contact/*` |
| utility | `src/pages/Legal.tsx`, `src/pages/NotFound.tsx`, `src/components/legal/*` |

### FROZEN (never edit, not even one character)

`src/styles/index.css` · `src/lib/*` · `src/App.tsx` · `src/components/Layout.tsx` ·
`src/components/ui.tsx` · `src/components/Figure.tsx` · `src/components/ShowFrame.tsx` ·
`src/components/Settle.tsx` · `src/components/Wipe.tsx` · `src/components/MissionVideo.tsx` ·
`src/components/icons.tsx` · `src/components/draw/*` · `src/components/render/*` ·
`src/components/home/*` · `src/components/team/*` (shared with Home) · `src/pages/Home.tsx` ·
`src/components/PageHero.tsx` (added by this foundation) · `src/components/Seo.tsx` ·
`src/components/NotifyForm.tsx` · `src/components/AssetPlaceholder.tsx` · `api/*` ·
`scripts/*` · `.parallel/*` · every other shard's files.

If you believe a frozen file must change, that is a contract gap: say so in
your report and build around it. Do not edit it.

### Per-page CSS

Page-specific CSS goes in a NEW `.css` file inside a folder you own (for
example `src/components/story/opening.css`), imported from the component or
page that uses it. Existing per-folder CSS files you own (`dogs.css`,
`routes.css`, `pline.css`, `corr.css`, `nostrip.css`, `noway.css`, ...) may be
edited. You may never restate or override a frozen class (`.film-*`,
`.show-frame*`, `.hero-head*`, `.page-hero*`, `.t-*`, `.btn*`, `.wall`,
`.bench`, `.grove`, `.deep`, `.hairline`, `.card*`, `.eyebrow*`) in your CSS;
the lint fails any rule whose selector starts with `.film-`, `.show-frame`,
`.hero-head` or `.page-hero`. Prefer Tailwind utilities in the JSX and
tokens (`var(--color-*)`, `var(--radius-*)`, `var(--ease-out)`) over new hex.

## 2. The direction, as rules

### 2.1 Every page opens in the hero's language

Every route opens with **`PageHero`** (`import { PageHero } from "@/components/PageHero";`),
except where your brief says otherwise (the `/team` bench, the journal post
and shop product reading layouts). It is the page's `<h1>`; remove the old
`<h1>` so the page has exactly one.

```tsx
<PageHero
  id="story-h"                         // the h1 id; the section is labelled by it
  asset="story.garden"                 // a still from src/lib/brand.ts; OMIT for the plain panel
  position="center 40%"                // optional object-position to keep the subject in frame
  credit={<>The garden the series is set in. A frame from the series.</>} // REQUIRED with any frame from the series
  eyebrow={<>Our story<span>Conor Sexton, founder and CEO</span></>}      // top left, mono uppercase; 2nd line in <span>
  aside={<>On what he saw, and what it took to build the alternative.</>}  // top right, ONE short line (two at most)
  title={<>I did not set out to start a <em>media company.</em></>}       // bottom left; <em> = accent colour, not italic
  actions={<><Button to="/team">Meet the team<IconArrow size={16} /></Button>
             <Button to="/contact" variant="quiet">Get in touch</Button></>} // optional, at most two buttons
  size="tall"                          // "full" | "tall" (default) | "short"
  tone="ink"                           // plain panel only: "ink" (default, the hero's dark) | "wall" (deeper paper)
/>
```

What it gives you, so do not rebuild any of it:

- **Picture variant** (`asset` set): the hero's own frame (`.film-hero` /
  `.film-frame`: gutter `clamp(10px,1.1vw,16px)`, radius `clamp(20px,2.2vw,32px)`,
  dark gaps), the header floating over it in cream (Layout does this for any
  `.film-hero`), a scrim measured for a two to three line headline over every
  still in `public/brand` (headline 5.28:1 or better, corners 4.99:1 or
  better), the four corners, and the credit as a small right aligned mono line
  in the bottom right corner. Under 820px it collapses exactly like the home
  hero: picture first (4:3, rounded), credit right aligned under it, then the
  copy on paper in ink.
- **Plain variant** (no `asset`): the same corner grid on a rounded panel,
  `tone="ink"` (cream type on the hero's dark) or `tone="wall"` (ink type on
  the deeper paper, edged with a 1.5px rule). For pages with no picture.
- **The page's one orchestrated entrance.** The picture settles, then
  eyebrow, aside, headline and actions arrive in order on the house easing,
  CSS only, collapsed under `prefers-reduced-motion`. **Do not add a second
  entrance** to the opening, and do not wrap PageHero in `Settle` or `Wipe`.
- Headline face: Fraunces 700 at `clamp(2.6rem, 1.4rem + 5vw, 6rem)` (94px at
  1440), max 17ch, balanced. Keep titles to about 12 words so they set in two
  or three lines.

Real stills you may use (keys in `src/lib/brand.ts`, all wired):
`story.garden` (swing tree, 3:2), `home.characters` (hen and the pugs, 16:10),
`show.meadow` and `show.snail` (2:1), `home.hero` (bluebell garden, 4:3, also
the film poster), `slate.ep1` to `slate.ep6` (felted title slates, 16:9), the
eight `dog.*` photographs (the only real photography). Every rendered frame
from the series carries a credit saying it is a frame from the series. The
dogs are photographs and say so. Never caption anything with a claim about how
that specific image was made beyond what `brand.ts` records.

### 2.2 Type scale and the claim as heading

Classes (frozen in `index.css`): `.t-display` 88px at 1440, `.t-h1` 66px,
`.t-h2` 54px, `.t-h3` 30px, `.t-lead`, `.t-body`, `.t-prose`, `.t-sm`
(15px), `.eyebrow` / `.eyebrow-sm` (14px) / `.eyebrow-xs` (13px). Leads and
body are untouched by this run; the RATIO between a heading and the text
under it is what carries a page.

- **No filing-label heading over a grey lead.** "Where it started",
  "The index", "What a purchase is" over a two or three line grey paragraph
  is the shape the client is reading as the site's real problem. The sentence
  worth stopping for IS the heading. The rest of the paragraph moves to where
  it is actually talking (a small line above the list it introduces, a
  caption beside the object it explains) or is cut if it only restates the
  heading. Facts are never cut: they move.
- **Each section opens in its own text shape.** Down one page, no two
  consecutive sections may open with the same heading class at the same left
  edge followed by a `t-lead`/`Lead`. Vary it: a display claim on its own, a
  heading in a left track beside the object, a heading over a ruled set with
  no lead, a pull line, a section that opens on its object and puts the
  heading in the margin.
- A section heading is at least `.t-h2` unless it is a sub-head inside a set
  (`.t-h3`). Do not set section headings with arbitrary `text-[NNpx]`.
- Mono eyebrows over section headings stay RETIRED (removed site-wide on
  2026-10-24). The only mono labels are: PageHero's eyebrow, labels inside an
  object (a docket, a dl, a card tab), and status messages.

### 2.3 Small type, rules and strokes

- **13px floor for real text.** No `text-xs`, no `text-[12px]`, no
  `text-[12.5px]`, no CSS `font-size` under 13px. A purely decorative print
  mark (edge print on film stock) may sit at 12px and its line must contain
  the word `print-mark` (a comment or a class name) so the lint passes it.
- **Rules and hairlines 1.5px.** Use `.hairline` (frozen) or
  `border-t-[1.5px] border-rule` / `border-l-[1.5px] border-rule-soft`. No bare
  `border`, `border-l`, `border-b`, `h-px`, `w-px` or `1px solid` as a rule.
- **Control edges 2px** (buttons, fields, chips, toggles). `Button` already
  is; a hand-built chip or field is `border-2`.
- **Icon and drawn strokes 2** (`strokeWidth={2}`); `icons.tsx` already is.

### 2.4 Plates and credits

- A frame from the series shown mid-page is a **`ShowFrame`**
  (`import { ShowFrame } from "@/components/ShowFrame";`
  `<ShowFrame asset="show.snail" caption="A frame from the series." />`). It
  hangs at the hero's gutter and radius, caption bottom left over a scrim,
  slow scroll-driven drift, caption under the picture on phones. Do not build
  another framed picture treatment. At most ONE ShowFrame per page, and never
  the same asset as that page's PageHero.
- Smaller inline pictures use `Figure` (`@/components/Figure`, props `asset`,
  `rounded`, `className`, `sizes`, `fill`, `position`, `priority`).
- **Credits and provenance notes are small right aligned mono lines**:
  `ml-auto max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em]`
  in the body colour on paper (or `text-[#eee9df]` on a dark ground, as Home
  does). Never a centred full-width line, never a paragraph.

### 2.5 Drawings, sparingly

The drawn kit (`components/draw`: `Underline`, `DrawnRule`, `DrawnBracket`,
`Watermark`, ...) is used sparingly. The drawn pug-face watermark was judged
poor and removed; the Watch/Play/Learn line sketches are judged weak.
**Prefer a real show frame, a felted slate or a real photograph over a
drawing.** At most ONE drawn object per page (a `Underline` on one key phrase,
or one diagram that genuinely explains a process, such as the production line
on `/ethical-ai`). No `Watermark` on any inner page. Decorative line sketches
that illustrate a sentence (a person at a screen, a stack of screens, a
squiggle, a bluebell) are cut, not restyled.

### 2.6 Surfaces, colour, motion

- Warm committed paper surfaces. Rooms available (frozen classes): `.wall`
  (deeper paper), `className="bench"` (warm umber, cream type), `bench grove`
  (green), `<Section deep>` (navy, one per page, the close). One `bench` and
  one `deep` per page at most. No new surface colours, no gradients beyond
  what those classes already carry.
- The red is rationed: buttons, one `<em>` accent in the PageHero title,
  active states. Never a red heading, never a red section ground.
- Motion: `PageHero` is the page's orchestrated entrance. Below it, section
  reveals use `Settle` (staggered children) or `Wipe` (one block wiping in),
  both frozen, both already collapse under reduced motion. Any NEW motion you
  write (CSS keyframes in your own css file) must carry a
  `@media (prefers-reduced-motion: reduce)` collapse in the same file, use
  `var(--ease-out)`, run once and settle. Nothing loops, bounces, drifts or
  auto-rotates.
- Section rhythm only through `<Section pad>` (`"open" | "normal" | "tight" | "close" | "none"`
  or a `[top, bottom]` pair) and `<Container width>` (`"wide" | "default" | "text" | "measure"`).
  No `!py-*` escapes.

### 2.7 Layout on phones

390px must work: no horizontal overflow, nothing cramped, tap targets at
least 44px for controls you build. On phones the thing a visitor came for
comes first (the form on `/contact`, the download button on `/download`).

## 3. Copy rules

- Spellings (`CLAUDE.md`): **The Pawsitive Pugs & Pals®** with the registered
  mark on first use per page (`&reg;` or `<sup>&reg;</sup>`), **PupsPlayer™**
  with the mark on first use, **CLÉ Family Media** with the accent (`CL&Eacute;`
  or `CLÉ`), **Conor Sexton**.
- **Zero em dashes (U+2014) and zero en dashes (U+2013)** anywhere: copy,
  comments, class names, alt text. Use a comma, colon, full stop or "to".
- Irish audience, Irish/UK spelling (colour, programme, organise), € prices.
- **No invented facts, figures, quotes, dates, testimonials, partners or
  awards.** Every heading you write must be a sentence the page already
  contains or a plain restatement of a fact already on the page. If you
  reword, the meaning must not grow.
- **Keep every existing factual claim, link, legal text, price, status and
  form behaviour intact.** Moving a sentence is fine; deleting a fact is not.
  Purely restating sentences (a lead that repeats its heading) may be cut.
  Legal page bodies, the privacy wording on `/case-study`, the purchase terms
  and the download messages are reproduced word for word.
- Headings read confident and plain. Never a disclaimer, never a cute
  negation ("None of this is ours." was rejected today as "horrible";
  "No logo strip of publications that have not written about us" is the same
  register). A heading says what IS.
- Characters are supporting cast: Finn and Fia may appear in frames and
  credits; they never lead a heading.

## 4. Verification procedure (do all of it, in order)

1. Lint: `bash .parallel/shard-lint.sh <ExportName> <exportPath> <owned paths...>`
   from the repo root, until it prints `shard-lint: clean`. The export and
   paths for each shard are listed in `.parallel/CHECKLIST.md` item C1.
2. Typecheck: `npx tsc -p tsconfig.app.json --noEmit`. Zero errors in your
   files. An error in a file another shard owns is not yours; note it, do not
   touch it.
3. Your own dev server, on your own port, never the shared one (two sweeps
   against one server produce phantom failures):
   ```
   /home/david/.local/bin/pbuild run --weight 2G -- bash -c '(setsid timeout 2400 npx vite --port <PORT> --strictPort >/dev/null 2>&1 &); sleep 5'
   ```
   Ports: story 5411, team-casestudy 5412, ethical-ai 5413, app 5414,
   journal 5415, media 5416, shop 5417, contact 5418, utility 5419. The
   journal and shop shards start theirs with
   `VITE_SUPABASE_URL=http://stub.invalid VITE_SUPABASE_ANON_KEY=stub` in
   front of `npx vite` so `--stub` can serve the post and product.
4. Capture and measure at 1440 and 390, one key at a time, one sweep at a time:
   ```
   OUT=/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/fanout/<shard>
   node scripts/qa/audit.mjs --port <PORT> --only <key> --out $OUT/after-1440
   node scripts/qa/audit.mjs --port <PORT> --only <key> --out $OUT/after-390 --width 390 --height 844
   ```
   Keys: story, team, case-study, ethical-ai, app, journal, media, shop,
   contact, privacy, terms, cookies, 404. For the post and product add
   `--stub --also "/journal/qa-fixture|journal-post"` with `--only journal-post`
   (and `"/shop/qa-fixture|shop-product"` with `--only shop-product`).
   Required result on every key: `overflow: 0   contrast failures: 0   pages that never loaded: 0`.
   "Pages that never loaded" above zero means the run is void: re-run it alone.
   A contrast failure naming a lightened near-miss of a token (`#755945`,
   `#9a3f3d`) on a loaded machine is a phantom (HANDOVER section 6, trap 6):
   re-run once before believing it.
5. LOOK at the whole page, not a crop: slice the full-length png with
   python3 PIL (`Image.MAX_IMAGE_PIXELS=None`, crop 2400px bands, scale 0.4)
   and read every slice at 1440 and at 390, beside `home-1440.png`. Fix what
   reads weaker than home, then repeat 1 to 5.
6. Kill your dev server when done (`pkill -f "vite --port <PORT>"`).

## 5. Reporting

Report: files changed, the PageHero props you used per route, every heading
you rewrote (old to new, with the sentence on the page it comes from), every
fact you moved and where to, anything you cut, the audit result lines for each
key at 1440 and 390, lint and typecheck output, and any contract gap.
