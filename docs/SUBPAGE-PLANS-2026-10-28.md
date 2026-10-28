# CLE Family Media: subpage plans

Planned by Fable (claude-fable-5-1). Nothing built yet.

## Site-level system

# CLÉ Family Media: subpage system

Plan only. Sources read: `CLAUDE.md`, `HANDOVER.md`, `QUESTIONS.md`, `CONTENT-NEEDED.md`, `COPY-REVIEW-2026-10-24.md`, `src/components/PageHero.tsx`, `src/lib/site.ts`, `src/lib/brand.ts`, `src/lib/episodes.ts`, `src/components/team/people.ts`, `src/styles/index.css`. Captures looked at in full at 1440 and 390 (`scratchpad/fanout/after-1440`, `after-390`, `before-1440`), plus the Drive material at `scratchpad/drive` and the rendered covers at `scratchpad/packs`.

## 0. The one structural fault

Eleven of twelve subpages now open on `PageHero`: the home film frame's four-corner grid (mono identifier top left, aside top right, Fraunces headline with a pink `<em>` bottom left, two pills under it), on a scrimmed show frame or on a black or tan rounded panel. The home hero works because the film is the content and "Watch. Play. Learn." is three words. Copied, it becomes: a frame from the series darkened to about 50% so the picture is neither seen nor absent, a two-line claim in the hero face, and then every page runs the same four to seven bands (paper, bench, grove, navy) each headed by another claim and two columns of text. Every page is the same kind of page: a manifesto. That is what "not hit the mark even slightly" means.

The fix is not a different hero. It is that each subpage becomes a different kind of object (a letter, a register, a document, a product sheet, a catalogue, a kit, a contents page, a form, a notice) and its opening is whatever that kind of object opens with.

## 1. Verdict on the current subpages

| Page | What fails |
|---|---|
| `/story` (7,953px) | Opens on `story-garden` scrimmed black with "I did not set out to start a media company" in pink; the founder's face, which the pre-fan-out version led with (`before-1440/story.png`), is gone from the first screen. Below, the letter is correct in kind but the page then stacks a pull quote, a gallery, a ledger, a four-face strip, a film and a navy band: six closings. |
| `/team` (6,092px) | Not converted, so it still opens on the grove band with the seven faces, which is nearly right. Then the five-phase "review board" (a lit bench of slips: five sentences dressed as a render) and a 2,000px roster with no faces and the same five phases drawn a third time as dots. Three lists of one group. |
| `/ethical-ai` (6,435px) | Black panel, pink `<em>` claim, two pills. The production-line drawing is the best thing on the page and sits under the fold. After it: five more claim headings ("Calling this work handmade would be untrue", "People decide what a story teaches...", "Which tools, who approves...") each restating the position. An investor wants a document with clauses, not a speech given six times. |
| `/case-study` (9,088px) | Longest page on the site; opens on a scrimmed `slate-ep3` with "A case study across two curricula". Then four numbered steps, a route picker, three "not supplied yet" holes, and a 2,500px draft questionnaire that cannot be submitted and has not been approved by Paula. A page that is mostly holes and a closed form is now in the About menu an investor opens first. |
| `/app` (5,948px) | Scrimmed `home-characters`, pink `<em>`. Then the drawn PupsPlayer (good), then a second copy of the team page's slip bench for Watch/Play/Learn, a 180px claim ("A young child can find their way around it...") and the reviewer portraits a third time. The real content of the product (the activity books, the games) is absent while three borrowed components stand in for it. |
| `/journal` (3,768px) | Tan panel "Notes from the studio", then a claim heading, a bench band of four strands all "In preparation", a navy band of four rules. 3,768px of a journal with zero posts. Honest, but the honesty should take one screen. |
| `/journal/:slug` | Reading layout is the right kind. Fails by opening on another panel and closing on the same navy band every page has; the piece's title should be the first thing on the page. |
| `/media` (6,088px) | Scrimmed `show-meadow` with the headline "A UK podcast appearance is booked for December": the page's only fact, which has no show, host, date or link, set at 100px. Then the six title slates on the bench (a show-site object, 1,900px), an index reading "could not be loaded", four subjects that are links to other pages, and a press sheet. One fact does not earn a page. |
| `/shop` (4,437px) | Black panel, pink `<em>`. Then a drawing of a crossed-out "usual checkout" (policy as spectacle, 900px), a list that says nothing is on sale, a bench band repeating the purchase terms, a navy band. Meanwhile 18 real covers and about 200 pages of real product sit in the Drive, none on the page. `before-1440/shop.png` had a drawn blank-book shelf; both versions sell the absence of a product. |
| `/shop/:slug` | Fine as a fixture. The "What a purchase is" sheet is the same object as on `/shop`; the drawn blank book is a placeholder where a real cover now exists. |
| `/contact` (3,034px) | The form, the chips and the "who reads what you send" column are right and should not move. The black panel above them with "Write to *the people* who make it" is the formula; the first screen at 390 is a black box and two pills before the first field. |
| Utility | `/privacy` etc. are already the right kind: a document with a contents rail and numbered clauses, closed by "The documents" index. Only the tan panel header is wrong. `/404` is good (the film strip with a missing frame is the one place a joke belongs). `/download` is a receipt and should stay type-only. |

Site-wide, counted: the navy "closing band" with a heading and three links sits on nine pages above the footer; the five-phase sequence is drawn on three pages (home strip, team board, ethical-ai line) and listed on a fourth; the five faces appear on five pages; "What a purchase is" twice. The pink `<em>` headline is on eleven pages. Each repeat is a page saying "I am the same template".

## 2. One kind of page each

| Page | Who lands, why | Must leave believing or able to do | Kind | Structure in one line |
|---|---|---|---|---|
| `/story` | Investor or broadcaster after the home page; a parent checking who is behind it | A real person with a real reason built this, and he is not a YouTube channel | **A letter**, signed | Portrait, dateline, the letter in one measure with its two drawings, the real dogs as the letter's one enclosure, the signature, the mission film as a postscript |
| `/team` | Investor, adviser, broadcaster: "who actually does this" | Seven named people with verifiable careers, and who does what | **A register** (a masthead or credits page) | The seven faces at page-opening scale on the bench, the register below them, phases as a one-line key per person, no board |
| `/ethical-ai` | Investor, educator, journalist; the trust page | The position is written down, dated, specific about tools, and could be held to | **A document** (a published policy) | Title block with version and date, contents, numbered clauses 1 to 6, the production line as Figure 1, tools table, the questions as an appendix. Same shell as `/privacy` |
| `/case-study` | Educator who was invited; an investor curious about evidence | A study exists, has a protocol, and is not open yet | **A protocol sheet** | One screen: status rows, who it is for, the four steps, both routes, what will be published; the questionnaire mounts only when `STUDY_OPEN` |
| `/app` | Parent, broadcaster, investor: "what is the product" | What PupsPlayer is, what is in it, what it refuses to do, and when to expect it | **A product sheet** | The product mark and the drawn device first, the contents (episodes plus the real activity material), the four refusals as a spec list, status and notify |
| `/journal` | Returning parent or journalist; investor checking the company talks | Writing by named people will appear here, on these four subjects | **A contents page** | Masthead, four strands, the colophon (the four rules), sign-up. One screen until posts exist; grows into a list |
| `/journal/:slug` | A reader with a link | The piece | **A reading page** | Title, byline, date, strand, body at 38rem, corrections inline, "more in this strand" |
| `/media` | A journalist or producer with a deadline | Facts checked, spellings, art and a contact, in two minutes | **A press kit** | Facts sheet, spellings, downloadable art (slates, logos, portraits), appearances list when there are any, press route. One screen |
| `/shop` | Parent or educator with a printer | What exists, what it costs, how buying works | **A catalogue** | A shelf of real covers by episode, each a product; price and format on the item; terms as a footnote strip |
| `/contact` | Anyone with a question | Send it and know who reads it | **A form** | The form is the first screen; "who reads it" beside; the page-answers list below |
| `/privacy` `/terms` `/cookies` | Someone checking | The clause | **A document** | As now, minus the panel |
| `/download/:token` | A buyer | The file | **A receipt** | As now |
| `/404` | Anyone lost | Where to go | **A notice** | As now, minus the panel |

Twelve routes, eight kinds, no two consecutive pages the same kind. The three documents (`/ethical-ai`, `/privacy`, `/terms`) share one shell on purpose: the responsible-AI position becomes the first entry in "The documents" index at the foot of the legal pages, which is the right company it should keep.

### Page notes, where the kind changes something specific

**`/story`.** Open on `public/brand/people/conor` at a size that fills a third of the first screen at 1440, cropped square, on paper, with "Conor Sexton, founder" and the place and year in mono beside it (place and year needed from client). The headline is the letter's first sentence set in `.t-h1`, not a claim set in the hero face. The letter runs as it does now (38rem, the two drawings it wraps). Cut the pull-quote band (the quote is already in the letter three paragraphs up), the ledger ("The short version") and the four-face strip (`/team` owns faces). Keep the real-dog gallery as the one enclosure, headed as now. End on the signature and then the mission film in the player frame, captioned as his own words. One closing, no navy band. Needed from client: one photograph of Conor that is not the headshot (at his desk, with the dogs, in the garden), and the year the company was registered (QUESTIONS #36 has the number, not the date).

**`/team`.** The grove band stays and grows: seven portraits two rows deep at 1440 (four and three), each the same crop ratio and mount on the dark ground, which is the only treatment that makes six sittings read as one group. Name and role under each; the opening paragraph beside. Below: the register, as now but with each person's phase key reduced to five small numerals of which the ones they are in are filled (the data is `phases` in `people.ts`). The slip board (`StageSequence.tsx`) comes off this page; it was a second drawing of a sequence `/ethical-ai` owns. The roster has no second set of portraits (declined 2026-10-24, respected). Close on one line and a link to Responsible AI.

**`/ethical-ai`.** Reuse the `Legal.tsx` shell: contents rail on the left, numbered clauses, "last updated" and a version. Clauses: 1 Position, 2 The five phases (Figure 1 is `ProductionFlat.tsx`, the drawing that already exists), 3 The tools and the one point they are used, 4 What a tool is never used for, 5 The six commitments (`TheLineTable.tsx` content), 6 What the reviews are for the child, parent and educator. Appendix: the questions. The two-refusal statement ("handmade would be untrue / AI-generated would erase") becomes clause 1's second paragraph, not a band. Type only, one drawing. Needed from client: the date the position was adopted and who approved it (a document has both, a speech has neither), and the AI-imagery truth from CONTENT-NEEDED (the site's own frames are produced in the pipeline this page names).

**`/case-study`.** Collapse to one screen above the footer: status rows (`Not yet open`), for whom, the four steps as a numbered list, `TwoRoutes.tsx` as the one drawing, the Aistear and EYFS notes as two rows marked awaiting Paula, and "what happens to your answers". The draft questionnaire does not render publicly until Paula approves it and `STUDY_OPEN` flips: an un-approved research instrument on a public page is a liability, not transparency. The Banteer workshop keeps its two rows. Leaves the About menu until it opens (see section 5).

**`/app`.** Open on `public/brand/pupsplayer.svg` with the name, status ("In development") and the drawn device (`PupsPlayerWalkthrough.tsx`) in the first screen, no frame behind it. Then "What is in it": the four released episodes as slate thumbnails (`slate-ep1` to `slate-ep4`) and, for the first time, the real Play and Learn material: a row of the six activity-book covers (`scratchpad/packs/episode-0N-cover.png`) and three or four activity pages from `drive/Episode 01/01-png/Activities-png-01/` shown as pages, credited "Designed and illustrated by Victoria Buchkova" as the covers themselves say. Then the four refusals (autoplay, purchases, advertising, grown-ups) as a spec list, which is what they are. Cut the slip bench and the reviewer portraits; one sentence links to `/team`. Keep the notify form. Needed from client: screenshots or a build, which features are tested (QUESTIONS #37.4), and whether the activity books are inside the app, on the show site, in the shop, or all three; the site must not imply a thing is in the app that is not.

**`/journal`.** One screen: the masthead line, the four strands as a contents list with their status, the four rules as a colophon in small type, the sign-up. When posts exist the list of posts is the page and the rules drop to the foot. No bench band, no navy band.

**`/media`.** Rename in the footer to "Press kit". One screen: a facts sheet (the existing `PRESS SHEET` object, promoted to the opening), approved spellings, and a download list: the six slates at print resolution, `show-logo`, `cle-logo`, the seven portraits, two or three show frames, each with a one-line caption saying what it is (which closes the AI-provenance question honestly for the frames). Appearances as a list when there are two or more; the December podcast is one row with its missing fields, not a headline. The bench of slates comes off this page. Needed from client: the podcast's show, date and link; a press address; a named spokesperson.

**`/shop`.** The catalogue is the Drive. Per episode: Activity Book, Colouring Book, Offline Games (covers in `drive/Episode 0N/covers-0N/Cover-1_*.pdf`, rendered at `scratchpad/packs/episode-0N-cover.png`), 18 items. Shelf by episode, cover upright at real aspect, title, format (A4 PDF, page count from `pdfinfo`: 20 pages activity, 20 colouring, 10 offline), price. The "A card payment, and nothing else" section becomes a one-line strip under the shelf ("No account, no mailing list, one payment, a 24-hour link"); the crossed-out checkout drawing goes. `/shop/:slug` shows the real cover, three sample pages, and the purchase sheet once. Needed from client: prices per item, whether the colouring books are free (the show site already gives colouring away) and QUESTIONS #26 answered (shop kept, hidden, or removed).

**`/contact`.** Remove the panel; the form's first field is in the first screen at 390. Everything else as built on 2026-10-09 and after.

## 3. Shared and page-specific

**Shared across every subpage.** The header and footer (the hanging felted lockup stays the one piece of company theatre on every page). The 1560 shell with the left-aligned measure fixed on 2026-10-24. The type scale in `index.css` as it stands (`.t-h1` is the subpage headline size; `.t-display` and the Fraunces hero face at 101px are home's). Body never under 17px, captions and mono never under 13px, rules never under 1px at 3:1 (the client's "too small" and "too thin" verdicts; `lines.mjs` measures the second). The small component set: `TextLink`, the disclosure, the status row (`dt`/`dd` with a dotted leader), `Figure` with its provenance caption, `.chip`, the dashed "not supplied" sheet, `Kicker` only for a status. One drawing per page at most, from `components/draw`. One entrance per page: the opening object settles, then the type, which `Settle` already does.

**Page-specific.** The opening object (see the table), the surface rhythm (a document is one surface end to end; a catalogue has a shelf; a register has the bench; a letter is paper), the closing (one line and one link, never a navy band; the footer is the closing on every page).

**Reserved for home only.** The film frame with corner copy (`.film-hero`, `.film-frame`, `.film-copy`), the Fraunces display face with a pink `<em>`, the pill pair under a headline, show frames as full-bleed section grounds (the research band), the bench and grove as alternating scenery. `PageHero` is deleted, not retuned: its two variants are the frame formula and the panel formula, and both are the thing the client rejected.

**What a subpage opens with instead**, by kind:

| Kind | Opening |
|---|---|
| Letter | A portrait, a dateline, the first sentence |
| Register | The faces themselves, at scale |
| Document | A title block: title, version, date, contents |
| Protocol / product sheet | Status rows and the object (device, drawing) |
| Catalogue | The shelf; the title is a shelf label |
| Press kit | The facts sheet |
| Contents page | The masthead line and the list |
| Form | The form |
| Notice / receipt | The notice |

All of them put the page's first real content above the fold at 390, which no `PageHero` page does today.

## 4. The five vocabularies

**Cinematic show frames** (`public/brand/home-hero`, `show-meadow`, `show-snail`, `story-garden`, `home-characters`, the slates, the mission film). The show's world. Home owns them as grounds. On subpages they appear only as content with a caption that says what they are: `story-garden` inside the letter where it is now, the slates as thumbnails on `/app` and as downloads on `/media`, two frames in the press kit. Never scrimmed under a headline again: at 50% scrim the picture carries nothing and the ink on it fails the lines sweep. Note the provenance: `brand.ts` records these as pipeline output; a captioned frame is defensible, a frame used as wallpaper is not.

**The felted objects** (`mark-lockup`, `mark-c`/`l`/`e`/`word`, the depth maps, the six slates, and the "CLE Family Media, Made in Ireland" felted badge on page 1 of every `Paula_s activities-0N.pdf`). The company's craft signature and the one vocabulary that is CLÉ's rather than the show's. Footer and splash on every page; the slates where episodes are listed; the Made in Ireland badge is the single best unused asset for this site (it says the company's name, not the show's) and belongs on `/story` beside the signature, on the press kit, and on `/app`'s status block. Needed from client: that badge as a transparent PNG at 1200px or more (it exists only inside the PDFs at print size). Felted things are photographed objects; they sit on a surface, they are never backgrounds or watermarks.

**Flat illustration** (Victoria Buchkova's covers, `drive/Episode 0N/covers-0N/*.pdf`; the activity and colouring pages, `0N-png/*`; the line-art pugs on every page). The product vocabulary, and it has a credit line printed on it. Belongs on `/shop` (as the catalogue, at full size), `/app` (as what Play and Learn contain), `/case-study` (as the materials, when supplied) and a future "How it's made" journal piece. It does not belong on `/story`, `/team`, `/ethical-ai` or `/contact`, and it is never decoration: no corner pug, no watermark, no spot illustration beside a paragraph. The rejected drawn pug watermark was this vocabulary used as decoration; used as product it is the opposite of cheap, because it is the thing for sale.

**The `characters-0N/*.png` files are not flat.** They are rendered creatures in the show's cinematic style (the ladybird, the hen, the snail: same look as `home-characters`), so they belong to the first vocabulary and carry its provenance caveat. Do not introduce them on this site; log them for the show site. One possible later use: a per-episode motif beside a slate in the press kit, captioned.

**Real portraits and the real dogs** (`public/brand/people/*`, `public/brand/dogs/*`). `/team` at scale, `/story` for Conor, `/contact`'s "who reads" list at thumbnail. Never a third place on one page, never under 80px, and one crop ratio and mount across all seven so six sittings read as one roster. The dogs are `/story` only.

**Type only.** `/ethical-ai`, the legal documents, `/journal` and its posts, `/download`, `/404`. These pages prove the company can be read closely. The serious-research register the brief asks for (how a university or Sesame Workshop publishes a position) is type, numbering, dates and a contents rail, not a frame.

## 5. Navigation and cross-linking

**Header.** About (Our story, Our team, Responsible AI), Journal, App, Shop, Get in touch, plus the show-site button. Case study leaves the menu until `STUDY_OPEN` is true, then returns; the footer keeps it. "Press" in the footer becomes "Press kit" pointing at `/media` (route unchanged, title changed).

**Footer.** As built: two poles, the lockup and the groups. Add Responsible AI to the legal row's "The documents" index as its first entry.

**Closings.** Delete the navy closing band from every subpage. Each page ends on one line and one link, following the reading order an assessor takes: story to team, team to Responsible AI, Responsible AI to contact (partnerships), app to shop and the show site, shop to app, press kit to contact, journal to nothing. Contact ends on the page-answers list it already has.

**Merge, split, demote, cut.**
- Demote `/case-study` to a one-screen protocol out of the menu; it is its own page again the day it opens.
- Demote `/media` to a one-screen press kit; it earns a long page at three appearances.
- Merge the two "What a purchase is" sheets into one, on the product page.
- Cut the five-phase sequence to two renderings: the home strip and the `/ethical-ai` drawing. `/team` gets the per-person key, `/app` gets a sentence.
- Cut the five faces to three pages: `/team` (large), `/story` (Conor), `/contact` (small). Off `/app` and off the home "Five people read every draft" block, which becomes the strip without portraits.
- Cut `PageHero.tsx` and `.page-hero` in `index.css` once no page mounts them.
- Keep `/journal/:slug`, `/download`, `/404`, the legal shell and the contact form as they are, minus panels.

**Consolidated "needed from client" for this plan:** one working photograph of Conor; the company's founding date; the Made in Ireland badge as a PNG; the Responsible AI position's adoption date and approver; the AI-imagery statement for the press kit captions; PupsPlayer screenshots and the tested-feature list; where the activity books live (app, show site, shop); prices and free/paid status per book and QUESTIONS #26; the December podcast's details; a press address and spokesperson; Paula's approval of the questionnaire before it is ever rendered.

**For the builder, the rejected list restated:** no pug watermark, no Watch/Play/Learn line sketches (the three on home are still there and were called weak), no "None of this is ours", no type under 17px body or 13px caption, no rule under 3:1, no scrimmed frame under a headline, no claim as a page heading, no pink `<em>` outside home, no navy band above the footer, no `PageHero`.



---

## story

# /story: a letter, signed

Plan only. Verdict: PASS. Plan returned unchanged except where the two "before build" notes and the cross-site rules touch this page; those edits are marked **[revised]** and listed first.

**Revisions applied**
- Critique item 1: the mission film measured with ffprobe (`public/video/mission-1080.mp4`, 63.85 s). The P.S. line reads "P.S. The mission film, a little over a minute." (section 4.9).
- Critique item 2: nothing rendered on the page says "in his own words" until the client confirms who narrates. The player's `aria-label` is "The mission film"; the `film.heading` block is not read by the page at all (sections 4.9, 4 admin blocks, 8).
- Cross-site rule 7: `.t-h1` and `.t-h2` are Calistoga (`--font-display`); nothing on this page uses `--font-hero`. The show title in paragraph 10 is currently `<em>` (`Story.tsx` 462), which the rule-7 grep would fail; the builder renders it as `<cite>` with the same italic, because it is a titled work, not emphasis (section 4.5).
- Cross-site rules 1, 2, 3, 4, 5: already met (no status rows, opens on the portrait, no margin numerals, Conor is the only face, the dateline's year is client-set). Stated where relevant so the builder does not add any of them.

Read: `src/pages/Story.tsx`, `src/components/story/copy.ts`, `src/components/story/RealDogs.tsx`, `src/components/team/people.ts`, `src/lib/site.ts`, `src/lib/brand.ts`, `src/components/Settle.tsx`, `src/components/MissionVideo.tsx`, `src/styles/index.css` (type scale, `.well`, `.wall`, `.hairline`), `CONTENT-NEEDED.md` (portraits, founder photography), `QUESTIONS.md` #36 (registered office, company number). Captures read in full: `fanout/after-1440/story.png` (7,953px), `fanout/before-1440/story.png` (8,602px), `fanout/after-390/story.png` (11,041px). Also looked at `public/brand/people/conor@2x.jpg` (880x880, warm backdrop, shoulders up) and page 1 of `drive/Episode 01/Paula_s activities-01.pdf` for the felted "CLE Family Media, Made in Ireland" badge.

## 1. Job

An investor or broadcaster has just left the home page and wants to know whether there is a person behind the name; a parent wants to know who is responsible for what their child watches. Both are checking the same thing: that CLÉ is a company with a founder who had a reason, and not a YouTube channel with a logo. They must leave knowing his name and face, the one incident that started it (minding a friend's four-year-old), the route he took (thirteen years in food retail, the accident in 2020, back to education at MTU), that he did not build it alone and who he brought in, and that he is reachable. Everything on the page is already his own account; the page's job is to let it read as a letter from him, once, in order, and stop.

## 2. Page kind and the idea

A letter, signed. The page opens the way a letter opens (the writer, where he is writing from, the first sentence) and closes the way one closes (a name, then a postscript), and everything between is one continuous measure of his prose that only breaks for things he is showing you: the garden the show is set in, the characters that came out of it, the two dogs they were named after.

It is not a copy of the home hero because there is no frame, no ground, no scrim and no claim. The first screen is a photograph of a man on paper and the first sentence of his own letter set in the subpage headline size; the picture is not behind the type, it is beside it, and the headline is not a line written to sound like a position ("I did not set out to start a media company") but the sentence his letter actually begins with. No pills, no pink `<em>`, no corner captions. The home page is a film with three words on it; this page is a person with a thousand words under him.

## 3. Opening

**At 1440.** Paper from the header down, one surface. `Container width="wide"` (1376px). A grid: `xl:grid-cols-[30rem_minmax(0,38rem)_minmax(0,1fr)] xl:gap-x-12`, `lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-12`, under 1024 one column. Top padding the section's normal 112px.

- Column 1: the portrait, `person.conor` (`/brand/people/conor`, override `conor?.photo` from `useTeam()` exactly as the current sign-off does). 480px square at xl (`aspect-square`, `rounded-[var(--radius-md)]`), 288px at lg. No card, no tilt, no shadow, no mount: a photograph laid on the paper. `sizes="(min-width:1280px) 480px, 288px"`, `loading="eager"`, `fetchpriority="high"`. The 880px source is only 1.83x at this size; see section 8.
- Columns 2 and 3 (the name block spans both, `xl:col-span-2`): a mono block at the top, aligned to the top edge of the portrait, 14px, `tracking-[0.02em]`, `leading-[1.7]`, uppercase, `text-body`:
  `CONOR SEXTON` on line one, `FOUNDER AND CEO` on line two, `CO. CORK` on line three (the county is on the legal pages already; the year joins this line only when the client gives it, cross-site rule 5; no date of any kind is set by the builder). Three lines, not an eyebrow: the mono block is a dateline, which a letter has. It is plain mono lines, not a `dl` and not status rows (cross-site rule 1).
- Under it, `mt-10`, the headline in `.t-h1` (66px at 1440, line-height 1.02, Calistoga via `--font-display`, ink; never `--font-hero`), `max-w-[24ch]`, which sets in four lines:
  **The idea for CLÉ Family Media began while I was minding a friend's four-year-old son.**
  This is sentence one of the letter, verbatim (`Story.tsx` 261), lifted out of paragraph one so it is not read twice. It is a fact, not a claim.
- The letter begins directly under the headline, `mt-12`, in column 2 only (38rem, `t-prose` 18px/1.7, `text-body`, `space-y-5`), so the first paragraph is on the first screen at 1440: "He was watching YouTube when something came up that was not appropriate for his age. My fiancée, Lydia, was pregnant with our little girl at the time."

Column 1 below the portrait stays empty for the length of the letter. That is the left margin of a letter, and it is what the pre-fan-out version (`before-1440/story.png`) did with its 16rem margin without being told it was wrong.

**At 390.** Header, then `pt-12`. The portrait at 152px square top left with the dateline block beside it (two-column flex, `gap-5`, the mono block vertically centred on the portrait). Then the headline in `.t-h1` (36px), six lines. Then the first paragraph. Measured: 72px header + 48 + 152 + 40 + 222 + 48 brings the first line of prose in at about 580px, so it is above the fold on an 844px screen. Nothing on this page is a black box before the first field of content. The page opens on its object (the portrait) at both widths, cross-site rule 2.

**What moves.** The opening grid is one `Settle`: the portrait is child one, the dateline child two, the headline child three, the first paragraph child four, so they settle in at 60ms steps with the existing 8px travel. That is the page's one entrance; nothing else on the first screen moves.

## 4. Section by section

The whole page is one `Section` on paper apart from the dogs, which keep their own `Section pad="tight"`. No `.well`, no `.wall`, no `deep`. The ground does not change because the voice does not change.

### 4.1 The opening (above)

Cut: `PageHero` and everything it carried (the scrimmed `story.garden`, "Our story" eyebrow, the aside, the "I did not set out to start a media company" headline, the "Meet the team" and "Get in touch" pills). The two links survive elsewhere on the page (4.7 and 4.8). The aside sentence ("On what he saw, what he could not find, and what it took to build the alternative.") is cut: it was a blurb about a letter sitting on top of the letter.

### 4.2 Movement one: what he saw

Column 2, continuous prose, no headings, no margin rule. The `Spread` component's margin column and its 1.5px left rule come off this page: with no heading in the margin the rule separates nothing. Paragraphs, in order, as written today:

1. "He was watching YouTube when something came up that was not appropriate for his age. My fiancée, Lydia, was pregnant with our little girl at the time."
2. "I spent a year researching children's media and developing an approach for a low-stimulation educational cartoon. I knew I could not build it alone, so I began bringing together people with the creative and educational experience the project needed."
3. "Paula was involved from the beginning. We had never met in person, but I spoke to her online and shared my vision and ambition. She wanted to be involved while the early work on production tools, pacing and voices was still taking shape."
4. "There was less of it than I expected. Plenty of shows were gentle. Plenty were educational. Very few were both, and fewer still would tell you anything about who had made them or who had checked them before they reached a child."

Cut: the two margin headings ("It started while I was minding a friend's four-year-old.", "Education was part of the project from the outset."). The first is now the headline's fact; the second is a sentence that was lifted out of paragraph 3 to make a heading and goes back where it was, as the paragraph's last sentence: "...still taking shape. Education was part of the project from the outset." Cut: the full-width pull quote between two rules. It repeats paragraph 2 word for word, 300px below it, in 66px type. A letter does not quote itself.

Craft detail: the first paragraph's first line sits on the same baseline grid as the headline's last line plus one `t-prose` line-height, so the drop from 66px to 18px reads as a letter's drop from salutation to body, not as two components.

### 4.3 The garden, inside the letter

After paragraph 4 the measure breaks for the first time. `Figure asset="story.garden"` (`/brand/story-garden`), spanning columns 2 and 3 (`xl:col-start-2 xl:col-span-2`, about 896px at 1440, 504px tall at 16:9), `rounded-[var(--radius-md)]`, no card, no tilt, `object-position: center 45%` so both pugs on the grass stay in frame. Caption under it, mono 13px, `text-body`, right-aligned at lg and up: "The garden the series is set in, with its rope swing. A frame from The Pawsitive Pugs & Pals®." This is the existing credit, unchanged. The frame is content with a caption that says what it is; it is never behind type.

Craft detail: the frame's left edge is the letter's left edge, not the container's. The letter widens to show you something and then narrows again; the margin stays empty.

### 4.4 Movement two: how he got here

Column 2, the four paragraphs from the current "How I got here" well, verbatim, as the letter continuing:

5. "I spent thirteen years in food retail, starting as an apprentice and finishing as head butcher. It is not the background anyone expects behind a children's media company, and I would not trade it."
6. "You learn quickly what people actually want when they are standing in front of you, and you learn to run a counter that does not fall apart on a Saturday."
7. "A life-changing accident in 2020 ended that direction. I went back to education as a mature student instead, took a QQI Level 6 in Marketing with distinction, and I am studying for a Bachelor of Business in Marketing at Munster Technological University, where I also went through the Student Inc. programme."
8. "Returning to education gave me the opportunity to build something new."

Cut: the heading "From head butcher to children's media." (a claim written to be a heading; paragraph 5 says it better). Cut: the sunken well and the tilted "The short version" ledger card. Every one of its eight rows restates a sentence in paragraphs 5 to 8 and 2 ("Food retail: thirteen years", "2020: a life-changing accident", "QQI Level 6", "MTU", "Student Inc.", "A year of research", "Founder and CEO"), so the ledger was the letter read twice, once as prose and once as a CV, with a render change to make the repeat feel like an object. No fact is lost: all eight facts are in the paragraphs above, and the ninth (Founder and CEO) is in the dateline and the signature. Nothing replaces the ledger: no status rows, no leaders (cross-site rule 1).

### 4.5 Movement three: the people, and the characters

Column 2, three paragraphs, with the one object of this movement in column 3 beside paragraph 10:

9. "The company came together around people who knew far more than I did: Alan on the creative side, who writes the scripts, directs and sets the pace of an episode; Paula on the educational side, who brings the learning expertise and reads every draft; Lydia, Kirstie and David bringing the parent, early years and industry perspectives that catch details which may be missed during production."
10. "That work became *The Pawsitive Pugs & Pals*, our first original series. Finn, the fawn pug, and Fia, the black pug, came out of it. The learning was built in from the start rather than added once the scripts were finished, which is a slower way to make a show and, as far as we can tell, the only way to make this one."
11. "Being a small studio is not something we are apologising for. The people who set the story are the same people who read every draft of it, and the work goes round between us until we are all happy with it. That is worth more to me than volume."

**[revised]** The show title in paragraph 10 is `<em>` today (`Story.tsx` 462). It is a titled work, so the builder renders it as `<cite>` styled italic in the body face (`font-style: italic; color: inherit`), never `<em>`, never the pink accent. Cross-site rule 7 greps the shard for `<em` and fails on a hit; after this change the page has none.

Under paragraph 11, one `TextLink to="/ethical-ai"`: "How an episode is made and reviewed →" (the current margin link, moved into the measure, where a letter would put "see enclosed").

Column 3, top-aligned with paragraph 10: `Figure asset="home.characters"` (`/brand/home-characters`) in a `Card card-still p-2`, no tilt, `max-w-[22rem]` at lg, full track at xl; caption mono 13px `text-body`: "Finn and Fia, with a hen. A frame from the series." At lg (two-column step) it falls under paragraph 11 at 22rem wide, as the current `aside` does.

Cut: the heading "I could not have made this on my own, and I did not try." (a claim; paragraph 9 is the sentence it was written from). Cut: the four-face strip (Alan, Paula, Lydia, Kirstie at 52px). `/team` owns faces at scale and cross-site rule 4 caps faces at team, story (Conor) and contact; the four are named in paragraph 9 and the closing line hands the reader to their page. Cut: the `tilt-a` on the characters card; a frame laid straight beside prose reads as an enclosure, tilted it reads as a prop.

Craft detail: paragraph 10 names Finn and Fia; the characters frame sits beside the sentence that names them, and the real dogs follow it. The reader meets the drawn pair and the real pair fifty lines apart, in that order.

### 4.6 The enclosure: the real Finn and Fia

`RealDogs` as built, full container width (1376px), the four drawn corners, the computed crops, the heading "The eight below are photographs of the real Finn and Fia." in `.t-h2`, the credit under the grid. Unchanged; the client asked for it and it is the one place on the site where real photography stands at scale. It is the letter's one enclosure and the only time the page leaves the letter's own columns.

Keep the heading: it is a statement about the photographs, not a claim about the company, and it is the one `h2` the page needs for the grid's accessible name.

### 4.7 Movement four: how it reaches you

Back to column 2, two paragraphs, as written today:

12. "The model is Watch, Play, Learn, and it is more literal than it sounds. Our Watch, Play, Learn approach connects calm stories with interactive games, creative tasks and practical activities children can explore beyond the screen. Each episode introduces ideas children can then explore through games and practical activities."
13. "In practice, families find us free on YouTube, which is simply where discovery happens for a series like ours. The show's own site is where the episodes and the family activities properly live, and we are building a product experience to support ad-free viewing and the offline activities together. That is in development rather than available, and we will say so plainly until the day it is not."

Then the two existing links as an inline list, `mt-6`, in the measure: `TextLink href={SITE.showUrl}` "The show's own site ↗" and `TextLink to="/app"` "PupsPlayer™, in development →". Both survive exactly; only the two-column layout and the heading "Free on YouTube for now, with an app on the way." are cut (the heading is paragraph 13 compressed into a slogan).

14. Last paragraph, the current `next.lead`, kept: "I would rather answer your questions directly than have you guess at them from a website." Followed on its own line by `TextLink to="/contact"` "Get in touch →". That is where the hero's second pill and the navy band's "Send an enquiry" button went: into the letter, in his voice, once.

### 4.8 The signature

`mt-14`, column 2. A 1.5px `hairline` rule 6rem wide (not full measure), then `mt-6`:
- "Conor Sexton" in `.t-h2` (Calistoga, 54px at 1440), ink.
- Under it, mono 14px uppercase `text-body`: "FOUNDER AND CEO, CLÉ FAMILY MEDIA".

Column 3, bottom-aligned with the name: the felted "Made in Ireland" badge at 160px wide, once the client supplies it as a transparent PNG (section 8). Until then column 3 is empty here; no placeholder, no drawn stand-in. Not a script font, not a drawn signature: a typeset name is how a company letter is signed and a cursive face is a tell.

Cut: the navy `deep` band ("Interested in working with us?", the 56px portrait, the three-row NEXT list). The portrait is now at the top at 480px; the heading was a sales line; the three rows (team, ethical-ai, show site) are all already linked inside the letter (4.5, 4.7) and the closing (4.10). Nine pages carried this band; this one ends on a name.

### 4.9 Postscript: the film

`mt-16`, spanning columns 2 and 3 (896px at 1440, 504px tall), `MissionVideo` as built (muted start, poster `/video/mission-poster.webp`, captions `/video/mission.en.vtt`, the Sound on control), `eager` off since it is now below the fold.

**[revised]** Above it one mono line, 14px, `text-body`: "P.S. The mission film, a little over a minute." Measured: `ffprobe` on `public/video/mission-1080.mp4` gives 63.85 s; the builder re-reads it at build and keeps the wording true to the file (under 60 s would be "under a minute", 60 to 75 s "a little over a minute"). Under the player the existing credit, kept word for word, right-aligned at lg: "The film starts muted. Turn the sound on when you are ready to, and the captions are there whether you do or not. Nothing on this site starts talking at you."

**[revised]** The player's `aria-label` is "The mission film". The current heading "The mission, in his own words" (`film.heading`) is not rendered anywhere on the page, not as an h2, not as the aria-label, not in the P.S., until the client confirms the narration is Conor's voice or his words (section 8). A postscript has no heading, and the page asserts nothing about who is speaking. The `.wall` ground comes off; the film sits on paper like everything else.

### 4.10 The closing line

`mt-16`, column 2, one sentence in `t-lead` (21px) and one link: "The people he brought in have a page of their own." then `TextLink to="/team"` "Our team →". Then the footer. The reading order the site plan sets (story to team) is the only route offered.

### Admin blocks (`content_blocks`, keys in `copy.ts`)

Keep and re-default: `hero.eyebrow_sub` (now the dateline's name line, default "Conor Sexton, founder and CEO" stays), `hero.title` (default becomes "The idea for CLÉ Family Media began while I was minding a friend's four-year-old son." with no stars; the builder must not pass it through `emphasis()`, since no `<em>` leaves home), `hero.image` (now the portrait override), `next.lead` (paragraph 14). **[revised]** `film.heading` stays in `copy.ts` for the admin but the page does not read it until the narration is confirmed; when it is, it becomes the player's `aria-label` only. Retire from the page: `hero.eyebrow`, `hero.aside`, `saw.heading`, `parent.heading`, `here.heading`, `build.heading`, `reach.heading`, `next.heading`. Rows already saved under retired keys are harmless; nothing reads them.

## 5. Signature moment

A real face at a third of the screen beside the sentence "The idea for CLÉ Family Media began while I was minding a friend's four-year-old son." No other page on the site, and few company sites in this sector, open on the founder at that scale with his own first sentence and nothing else. The second thing they remember is lower down and already built: the drawn garden, then the two real pugs it was drawn for.

## 6. Mobile (390)

- The portrait drops to 152px and shares a row with the dateline instead of stacking above it, so the headline is reached in one screen. Stacking a 390px square portrait over three mono lines over a six-line headline would push the first paragraph to 1,100px.
- The letter is one column at the 56ch cap, which is wider than the screen, so it runs edge to edge inside the 20px gutters at 18px/1.7. Never smaller.
- The garden frame and the film run the full content width (350px, 197px tall). Their captions switch to left-aligned (`text-left`): a right-aligned mono caption on a phone hangs off the picture it belongs to.
- The characters frame comes after paragraph 10 in flow, full width, caption left-aligned.
- `RealDogs` already falls back to two-across cells under 760px with `object-position`; unchanged.
- The signature block: name at `.t-h2` (30px), mono line under it, the badge (when it exists) 120px wide on the next line, left-aligned, not floated right.
- Closing line and link, then footer. The page at 390 should land near 8,500px, down from 11,041px, with nothing removed from the letter itself.

## 7. Motion

Two moments, both on `Settle` (0.7s, `cubic-bezier(0.16,1,0.3,1)`, 8px travel, 60ms stagger), no new animation code:

1. **The opening.** Portrait, dateline, headline, first paragraph settle in that order on load. One entrance for the page.
2. **The enclosure.** The eight dog cells settle on viewport entry with the stagger they already have.

Everything else (the garden frame, the characters card, the film, the signature) settles as a single unit on entry, as every `Settle` group does, which is a reveal and not a moment. No `Wipe` on this page any more (it belonged to the pull quote). Under `prefers-reduced-motion` `Settle` renders finished content with no `.is-armed` state, so the page is static from the first paint; the film still starts muted and never autoplays with sound.

## 8. Needed from the client

- A higher-resolution portrait of Conor, 1,200px square or more (the supplied file is 880px and is displayed at 480px on a 2x screen).
- One working photograph of Conor that is not the headshot (at his desk, with Finn and Fia, in the garden). Optional for this plan; if it arrives it replaces the headshot in the opening and the headshot moves to `/team` only.
- The founding date: the year the company was registered (QUESTIONS #36 gives the company number and office, not the date). It joins the dateline as "CO. CORK, 2025" or whatever the year is. Until it arrives the dateline carries no year; the builder sets no date (cross-site rule 5).
- The felted "CLE Family Media, Made in Ireland" badge as a transparent PNG, 1,200px wide or more. It exists only inside the activity PDFs at print size.
- Confirmation of who narrates the mission film, and whether the script is Conor's own words. Until answered, "in his own words" appears nowhere on the page (4.9).
- Optional: a scanned handwritten signature. Not required; the typeset sign-off ships without it.

## 9. Risks

- **The opening grows a ground.** Someone puts the portrait on a tan panel, or the garden behind the headline, "to give it weight". Guard: the opening is paper, the portrait is the only image, and the headline is a sentence with a full stop that no one would set on a frame. If the builder reaches for `PageHero`, it no longer exists.
- **The headline becomes a claim again.** "A media company that started in a sitting room" is one edit away. Guard: the headline is defined as sentence one of the letter, verbatim, and paragraph one begins at sentence two. If the client rewrites the letter's first sentence in the admin, the headline follows it; that is the rule, not a default.
- **The headline is set in the hero face.** Guard: `.t-h1` and `.t-h2` resolve to `--font-display` (Calistoga); the shard is grepped for `font-hero`, `<em`, `PageHero` and `.deep` and fails on any hit (cross-site rule 7). The show title is `<cite>`.
- **Fourteen paragraphs read as a wall.** Guard: the measure breaks at three fixed points (the garden after paragraph 4, the characters beside paragraph 10, the dogs after paragraph 11) and the left margin is empty by design, so the page is never prose from edge to edge at 1440. No sub-headings are added to fix pace; the objects are the pace.
- **The empty margin at xl reads as a layout bug.** Guard: the portrait sits at the top of it at 480px and the headline and letter share one left edge, so the margin reads as belonging to the letter. The margin never carries labels, notes or links; that was the earlier "filing label over a grey note" the client called the real problem.
- **The sign-off drifts back into a CTA band.** Guard: it is type only (a short rule, a name, a mono line), one link in the paragraph above it, one link in the closing line, and no surface change anywhere on the page. If a reviewer asks for a button, the answer is paragraph 14 already has the link in his words.
- **Portraits creep back.** The four faces beside paragraph 9 are the most tempting restore. Guard: cross-site rule 4 caps faces at `/team` (large), `/story` (Conor only) and `/contact` (small); the closing line exists so the reader goes to the faces rather than the faces coming to the reader.
- **A dateline or P.S. asserts something unmeasured or unconfirmed.** Guard: the year is rendered only from a client-supplied value, the film's length is read from the file at build, and the narrator is named nowhere until the client answers.
- **Type and rules.** Body 18px, captions and mono 13 to 14px, every rule 1.5px in `--color-rule` on paper. Nothing on this page is under 13px or under 1.5px; `lines.mjs` should pass it clean.


---

## team

# /team: plan (revised after verdict: PASS)

Verdict: PASS. Plan unchanged in substance. Changes below are the two before-build items and the cross-site rules that bind this page, each marked **[verdict]**.

Sources read: `src/pages/Team.tsx`, `src/components/team/{people.ts,PeopleStrip.tsx,Roster.tsx,StandsAt.tsx,StageMark.tsx,useTeam.ts}`, `src/components/teampage/{copy.ts,bench.css}`, `src/components/{Settle.tsx,Figure.tsx,render/Stage.tsx}`, `src/styles/index.css` (tokens and type scale), `src/lib/brand.ts` (person.* slots), `CONTENT-NEEDED.md` (portraits sections), `QUESTIONS.md` (#5, #21, #33, #35 to #37). Captures read in full: `scratchpad/fanout/after-1440/team.png` (6,092px), `after-390/team.png` (9,168px), `before-1440/team.png`. All eight portraits laid out on the grove colour and compared.

One fact the brief does not have: `people.ts` gained **Stitha Raj** (UI/UX Designer, `person.stitha`, bio in her own words) on 2026-10-27, after the captures were taken. There are now **eight portraits**, not seven, plus Mansi with none. The plan below is for eight. Four and four is a better register than four and three.

## 1. Job

An investor, adviser or broadcaster opens this page straight after the home page or `/story` with one question: who actually does this, and are they real. A parent or educator arrives with a softer version of the same question. They must leave able to say: there are nine named people, one of them writes and animates, five of them read every draft and watch every cut, one illustrates the activity material, one designs the app's interface, and each has a verifiable career the company did not embellish; the whole account is written in the company's own words with nothing added. They should be able to do that in under a minute from the faces and the phase column alone, and go deeper into any one biography without leaving the page.

**[verdict]** The earlier wording "two design the games and the app" overstated Victoria's role (`people.ts`: Graphic Designer and Illustrator). Corrected above. Page copy never said it and must not: each person's role on the page is the `role` string in `people.ts`, verbatim, and nothing on the page groups people by a role the data does not give them.

## 2. Page kind and the idea

**A register: a credits page.** The faces are the first screen, at the scale of a magazine masthead, and under them one ruled register in which every person has a name, a role, what they do here in one paragraph, and a roll call of the five phases showing which ones they are in. Reading down the phase column tells the whole production story (one person animates, five read everything, three sit outside the reviews) without a diagram.

It is not the home hero because nothing on it is a picture with words in its corners: there is no frame, no scrim, no claim headline, no pink `<em>`, no pill pair. The opening object is the people themselves, set out evenly like a credits roll, and the title is a label ("Team and advisers"), not a sentence making a case. The home page argues; this page lists.

**[verdict, cross-site rule 2]** The page opens on its object, the faces, at both widths. No status rows, no `dl`, no leaders anywhere on this page (cross-site rule 1: leaders belong to the two documents, the shop docket and the journal). The roll call in the register is a different thing: numerals and words, no leader, no rule between label and value.

## 3. Opening

### At 1440 (viewport 1440 x 900)

Band: `<Section className="bench grove" pad="open">` with `<Container width="wide">`, as now. The `team-open` corner grid and every `page-hero__*` class come off. `bench.css` is deleted.

Row 1, the masthead line, two columns on a `grid-cols-[minmax(0,1fr)_minmax(0,46ch)]`, gap 64px, items aligned to the baseline end:

- Left: `<h1 className="t-h1">Team and advisers</h1>` in Calistoga (`--font-display`; `.t-h1` is Calistoga, never `--font-hero`), cream `#fdf8ed` (the `.bench h1` rule already does this), about 66px at 1440, two words on one line. No eyebrow above it, no sub-line under it.
- Right: the opening paragraph in `.t-lead` (about 21px, line-height 1.58), colour `--color-raised`, max 46ch, flush with the h1's baseline:

  > A small core team. Between them they decide what gets made, how it gets made and what it is supposed to do for the child watching. Alan writes and animates, and the rest of them read every draft and watch every episode before it is released.

  (This is `hero.aside` + `hero.lead` from `copy.ts`, unchanged; still served through `useBlock("team", "hero.lead", ...)` so the admin's override keeps working. `hero.title` likewise feeds the h1.)

Row 2, 56px below: **the register's faces**. A `<ul>` on `grid-cols-4`, column gap 24px, row gap 40px. Eight `<li>`, in the order of `people.ts` (`TEAM` then `ADVISORS`, portraits only, Mansi excluded because she has none, as the existing `shown` filter already does): Conor, Alan, Paula, Lydia, Kirstie, Victoria, Stitha, David Toth. At 1440 the container is 1,336px wide so each portrait is about 316px square, which asks the 880px `@2x` source for a real 2x image. `sizes="(min-width: 1024px) 330px, 45vw"`.

Each portrait: `Figure` with `asset={p.asset ?? PORTRAIT_FRAME}` and `override={p.photo ?? null}` as now, `className="aspect-square"`, `rounded="rounded-[var(--radius-md)]"` (16px, the same on all eight). Mounted on `Stage` with `lift`, `tilt={0}`, `roll={0}`, `depth` 0.44 on row one and 0.52 on row two, `light={azimuthFor(column, 4)}` so the one lamp up-left of the bench casts all eight shadows in the same direction, a little longer on the lower row. **No per-print lean.** The current hand-written `MOUNT` rolls were written for a single row of mismatched photographs; eight prints each at a different angle read as a pinboard. A register is flat. The one lamp and the shadow are what keep the eight sittings together on the dark ground; the identical crop ratio, radius and size do the rest.

Under each portrait, 16px below: name in Hanken 17px, weight 700, cream (`.t-body` size, inherits colour); role under it in `.eyebrow .eyebrow-sm` (mono, 14px, uppercase, 0.14em, cream via `.bench .eyebrow`). Nothing else: no hover state, no link, no social row, no card edge.

What is on the first screen at 1440 x 900: header (88px), the band's open padding, the masthead line, and the whole first row of four faces with their names, with the top of row two visible under them. The first real content, four people, is above the fold.

Band bottom padding 96px; the band ends on the second row's roles. No rule anywhere in the opening. The division between masthead line and faces is the 56px gap.

### At 390

Same band. The masthead stacks: h1 `.t-h1` (36px at 390), the paragraph `.t-lead` (18px) under it with 20px gap. Then the faces on **two columns**, column gap 16px, row gap 28px, four rows: each portrait about 171px square. Names 17px, roles 13px (`eyebrow-xs`, the 13px floor). The sideways scroll and the "Scroll sideways for the rest" cue are gone: a register that hides five of its eight people off the edge of the screen is not a register. At 390 x 844 the first screen is the header, the title, the paragraph and the top two faces with their names; the second row begins under them.

### What moves

The eight portraits `Settle` as direct children of one `Settle` group, so they arrive with the existing 60ms stagger (about 420ms across the eight), 8px of travel, `--ease-out`. The masthead line settles first as its own group. Nothing else in the opening moves.

## 4. Section by section

### 4.1 The opening band (above)

Purpose: the faces at scale, once, in the order the register uses. Imagery: `public/brand/people/{conor,alan,paula,lydia,kirstie,victoria,stitha,david}` via `person.*` keys. The craft detail: **the grid's order is the register's order**, so the faces are the index of the page; a reader who finds Paula third in the faces finds her third in the register.

Cut from the current page: `page-hero__eyebrow` ("OUR TEAM / CORE TEAM AND ADVISERS"), `page-hero__aside` ("A small core team." moves into the paragraph), the corner grid, the hero-size headline "The people who make every episode" (a claim; replaced by the label), the horizontal scroll strip at phone widths, the per-print lean.

### 4.2 The sequence board: cut

`StageSequence.tsx` (the lit "REVIEW BOARD" with five slips on two shelves, 1,900px at 1440 including its heading and the mono note), its `.rk-board`/`.rk-slip` rules, the `t-h2` claim "A script goes round three or four times. The cut goes round until everyone is happy." and the right-aligned mono note above it all come off this page. Why: the site system gives the five-phase sequence two renderings, the home strip and the `/ethical-ai` drawing (`ProductionFlat.tsx`), and `/team` gets the per-person key instead. The board was the same five sentences the Responsible AI page owns, dressed as a render, between the faces and the register they belong to.

Where the facts go: the five phase **names** stay on this page, in the register's key line (4.3). The five phase **sentences** (`PHASES[n].who`, `.what`, `.rounds`) are owned by `/ethical-ai` clause 2 under the site system; `PHASES` stays in `people.ts` as the one source. The builder checks that `/ethical-ai` renders `what` and `rounds` for all five before deleting the board; if it does not, that is a defect in the `/ethical-ai` plan, not a reason to keep the board here. The sentence "A script goes round three or four times. The cut goes round until everyone is happy." is a good fact in the company's words and is kept in the key line, in body type, not as a heading.

### 4.3 The register

Purpose: the full account of each person, in the company's words, with what they do here always visible and the career behind it one control away. Paper surface (`paper-2`), full `wide` container, directly under the grove band.

Head of the register, 72px top padding:

- `<h2 className="t-h3">In their own words</h2>` (Calistoga, about 30px). Not `.t-h1`: this is a label on a list, not a second headline.
- Under it, `.t-body`, max 62ch:

  > Each entry is the company's own account of the person, cut down and never added to. Where that account does not place someone in a phase, nothing is claimed for them there.

  (This carries the current `people.heading` sentence and the right-aligned provenance note, in one place, in body type.)
- The key, one line in `.t-body` with the five names in mono 14px uppercase inside it, 20px below:

  > **Phases** 1 First draft · 2 Revised drafts · 3 Animation · 4 Episode review · 5 Final sign-off. A script goes round three or four times; the cut goes round until everyone is happy. The full account is on the Responsible AI page.

  Use a middle dot or a comma between phase names, never a dash. "Responsible AI page" is a `TextLink` to `/ethical-ai`.

Rows, one `<li>` per person in `TEAM` order, each opened by a `hairline` rule (1.5px, `--color-rule`), 40px vertical rhythm as now. At 1440 the existing three tracks stay: `[minmax(0,14rem)_minmax(0,38rem)_minmax(0,1fr)]`, gap 56px:

- Track 1: name in `.t-h3` Calistoga (30px), role in `.eyebrow .eyebrow-sm` (14px) under it. The role is `people.ts` `role`, verbatim.
- Track 2: the first bio paragraph in `.t-prose` (18px, 1.7), always open; the remaining paragraphs inside `DisclosurePanel` behind the existing "More about Conor" control. Raise the control's label from 13.5px to **14px** mono and keep the 28px hit box. The arrow quarter-turn stays. Every paragraph in `people.ts` survives: nothing in a biography is cut.
- Track 3: the roll call. Mono label "Takes part in" (14.5px, as now), then **five numerals** on one line, 32px pitch: each a 28px disc with the numeral 1 to 5 in `--font-mono` 15px, tabular. A phase the person is in: numeral in cream on a `--color-red-deep` fill. A phase they are not in: numeral in `--color-body` inside a 1.5px `--color-rule` ring, no fill. Under the numerals, the words the existing `comesInto()` already produces ("Every phase", "Every phase but the animation", "first draft, revised drafts") in `.t-body`. The numerals row is `aria-hidden`; the words are the accessible text, so a screen reader gets exactly what it gets today. For a person in no phase (Mansi, Victoria, Stitha) the label reads "Not in the script and episode reviews" and no numerals are drawn, as now: a row of five hollow rings beside a person reads as missing data.

  **[verdict, contrast]** Measured, not deferred: cream `#fdf8ed` (`--color-raised`) on `--color-red-deep` `#74191d` is **10.44:1** (relative-luminance formula, from the token values in `index.css` lines 101 and 151). Clears 4.5:1 with room; the 15px mono numeral needs no size exception. The hollow ring's numeral in `--color-body` on `paper-2` is the same pairing `index.css` already documents at 8.0:1. Builder does not swap to `--color-red` (`#a32e32`, 6.62:1) or `--color-red-fill` for the disc; `--color-red-deep` is the one that carries text, as the token comment says.

  `StandsAt.tsx` (the five dots on a hairline track) is replaced by this and deleted. The numerals are read from `member.phases`, the one source, exactly as `StandsAt` was.

Adviser block: after Stitha's row, a `hairline` rule at 1.5px, then `<h3 className="t-h3">Adviser</h3>` and the existing sentence "Advisers are not employees. Each is described only as they have approved it." in `.t-body`, then David Toth's row in the same shape. Unchanged in substance from the current page.

The craft detail: **the roll call column**. With eight rows stacked, the third track becomes a column of ten-row notation in which the eye reads the whole process in two seconds: Alan is the only full row of five red discs; Conor, Paula, Lydia and Kirstie are the same four with the third hollow; David is two discs and three rings; three rows carry no discs at all. The slip board, the dots and the home strip all said this in more pixels. Here it is data, repeated honestly because the work repeats.

Cut from the current page: the `t-h1` claim "In their own words, cut down and never added to." as a display heading (its fact is kept in body type), the right-aligned mono provenance note (merged into the head), the `StandsAt` track.

### 4.4 Closing

One line and one link, 72px under David's row, then the footer:

> How an episode is written, reviewed and made, and where AI is and is not used, is set out in full on the Responsible AI page.

`.t-lead`, max 52ch, with "Responsible AI page" as a `TextLink` to `/ethical-ai`. That is the existing `cta.lead` sentence; it survives, the navy band does not.

Cut: the `deep` band with the `t-h2` claim "Every episode passes through these people before a child sees it", the two buttons. "Partnership enquiries" is in the footer on every page; a second button for it here was a template saying "I close the same way everywhere". The reading order the system sets is team to Responsible AI, and this closing follows it.

### 4.5 Page metadata and admin

`Seo` description becomes: "The people behind CLÉ Family Media: the core team and advisers, what each of them does on an episode, and the five phases every episode passes through, in the company's own words." Path unchanged.

`copy.ts` keeps `hero.title` ("Team and advisers") and `hero.lead` (the paragraph, with "A small core team." prefixed). `hero.eyebrow`, `hero.eyebrow_sub`, `hero.aside`, `dossier.heading`, `people.heading`, `cta.heading` and `cta.lead` are removed, and the matching entries in the admin's block list (`src/lib/blocks.ts`) go with them so the admin panel does not offer fields the page no longer reads. The closing line and the register's head are page wording, not admin blocks; the people themselves still arrive through `useTeam()` and the admin's Team panel, unchanged.

Files that leave once nothing mounts them: `StageSequence.tsx`, `StandsAt.tsx`, `teampage/bench.css`. `StageMark.tsx` stays if `/ethical-ai` still mounts it; delete only if the builder confirms no host remains.

**[verdict, cross-site rule 7]** Before the shard is accepted: `grep -nE "font-hero|<em|PageHero|\.deep|page-hero" src/pages/Team.tsx src/components/team src/components/teampage` returns nothing. Any hit fails the shard.

Height at 1440 after the change: about 1,050px of band, 2,000px of register, the closing line, the footer: roughly 3,700px against 6,092px today, with every fact kept.

## 5. Signature moment

The second screen: the register's roll call column. Eight rows of five numerals, red where a person is in a phase, hollow where they are not, and the pattern itself is the company's process: one full row (the animator), four matching rows (the readers), one two-disc row (the industry adviser), three rows with none (the illustrator, the rhymes, the app's interface). An investor who reads only this column knows how the company works and who does what, and could check any one claim against the sentence beside it. It is the thing on the page that is not a design choice but a fact laid out, and it is what someone will remember. It is pure data and no other page draws it.

## 6. Mobile (390)

- The faces: two columns, four rows, no sideways scroll, no scroll cue. Portraits about 171px. Names 17px, roles 13px. The object is the first screen (cross-site rule 2).
- The masthead line stacks title over paragraph; the paragraph stays `.t-lead` at 18px, never body size.
- Register rows become one column with a changed reading order: name and role, then the roll call (numerals on a 36px pitch so each disc is a 28px target with 8px between, the words under), then the lead paragraph, then "More about". The phase fact is the scannable answer on a phone and sits under the role; the prose follows. At `lg` the CSS grid puts the prose in track 2 and the roll call in track 3 without changing the DOM.
- The key line wraps naturally; the five phase names stay on their own line each if needed, never truncated.
- The adviser rule and sub-head stay; the closing line stays one paragraph.
- Nothing is under 17px except mono roles and labels at 13 to 14.5px, and no rule is under 1.5px.

## 7. Motion

Two moments, both through `Settle` (`--ease-out`, `cubic-bezier(0.16,1,0.3,1)`, 8px travel, 0.7s):

1. On load, the masthead line settles, then the eight portraits settle as one staggered group (60ms per face, so the register's faces arrive left to right, top to bottom, in register order). The `Stage` shadows are part of each face, so they arrive with it.
2. On scroll, each register row settles as it enters, as `Roster` already does through `Settle as="li"`. The numerals do not draw and do not animate; a fact in a register is already there when you look at it. The disclosure open and close keep the existing `grid-rows 0fr to 1fr` transition and the arrow quarter-turn.

Reduced motion: `Settle` never arms, so every face and every row is in its final state with no travel; the disclosure still opens, without the transition. No hover motion anywhere on the page.

## 8. Needed from the client

- **A photograph and a biography for Mansi** (she is in the register with one line and no face; the grid excludes her because there is nothing to show).
- **Kirstie's and David Toth's displayed titles**, still open from the 22 October document (QUESTIONS.md); both read "Adviser" until agreed.
- **Stitha's title** confirmed as "UI/UX Designer", and whether the phrase "uses Figma and AI tools" in her own bio should stand on the company's site beside the Responsible AI position. It is her wording and is printed as such; the question is whether Conor wants it there.
- **One portrait re-sit for Kirstie**: the current file is a tilted outdoor phone selfie with sunglasses on her head, and at 316px it is the one face that reads as a different kind of photograph from the other seven. A square, eye-level, indoor photograph on a plain wall would be enough. The warm grade already applied to the set carries the rest.
- Optional, not blocking: a consistent session for all eight (CONTENT-NEEDED "Portraits, consistency"), and the `team.group` photograph, which would belong on `/story` or the journal, not on this page's opening.
- Confirmation that Victoria and Stitha are outside the script and episode reviews (`phases: []`), since the register now says so in words for each of them.
- **[cross-site rule 4]** Consent for editorial reuse of the portraits is a `/media` question, not this page's; `/team` shows the portraits as it does today and `/media` lists names only until consent arrives. No change here.

## 9. Risks and guards

- **The faces become a generic team grid.** The tells are cards, hover lifts, social icons, 120px thumbnails and a "Meet the team" headline. Guard: no card, no hover, no link, no icon, portraits at 316px on the grove ground under one lamp with a real shadow, label title, and the grid's order fixed to the register's. If a builder adds a border or a hover, it has failed.
- **It slides back into the home formula.** The route would be a headline that argues ("The people who make every episode"), a mono eyebrow pair, an aside in the far corner, a pill pair. Guard: the h1 is a noun label and the lead is the only sentence in the band; `PageHero` and `bench.css` are deleted so there is no grid to fall into; the band ends on faces, not on copy; the grep in 4.5 fails the shard on `font-hero`, `<em`, `PageHero`, `.deep`.
- **It slides into the other plans' formula.** Six plans opened on status rows with dotted leaders. Guard: this page has no `dl`, no status row and no leader anywhere; the roll call is numerals and words under a mono label, with no rule or leader between them.
- **The register reads as a wall.** Eight rows of prose at 38rem is 2,000px. Guard: only the first paragraph is open; the roll call gives the eye a column to run down; rules at 1.5px every row; names at 30px Calistoga as the row's anchor.
- **The roll call becomes a dashboard.** The route would be coloured states, a legend box, percentages or a progress look. Guard: two states only (red disc, hollow ring), one key line in prose, no legend box, no animation, and the words beside it remain the accessible truth.
- **The disc fails contrast.** Guard: measured at 10.44:1 for cream on `--color-red-deep`; the builder keeps that token and does not substitute `--color-red` or `--color-red-fill` for the fill.
- **A role is claimed the data does not give.** Guard: every role string on the page is `people.ts` `role` verbatim; no sentence on the page groups people by a job the data does not assign (the job statement's earlier "two design the games and the app" is the kind of line that must never reach the page).
- **A rotation or lean creeps back onto the portraits** to make them "feel mounted". Guard: tilt and roll are zero on every face; the lamp direction and shadow depth are the only variation, and they vary by position, not by taste.
- **The build captures seven faces, not eight.** The fan-out captures predate Stitha. Guard: the builder checks the live grid holds eight at 1440 (four and four) and that Mansi is in the register and not in the grid.
- **Copy slips in a dash.** Guard: every drafted line above uses commas, colons, semicolons or a middle dot; the key line uses middle dots between phase names.


---

## ethical-ai

# `/ethical-ai` Responsible AI: plan (revised after the creative director's verdict)

Sources read: `src/pages/EthicalAi.tsx`, `src/components/ethical-ai/{ProductionFlat,TheLineTable,ForTheChild}.tsx`, `stations.ts`, `copy.ts`, `pline.css`, `src/components/draw/draw.css`, `src/pages/Legal.tsx` (the document shell; `DRAFTED` at line 78, the `Draft` word at line 457), `src/components/Settle.tsx`, `src/components/team/people.ts`, `src/lib/site.ts`, `src/lib/blocks.ts`, `src/styles/index.css` (`--font-display` is Calistoga at line 202, `--font-hero` is Fraunces at 203, `.t-h1` at 337, `.t-body` 17px at 341, `.deep` is the navy band at 526), `QUESTIONS.md` #22, `CONTENT-NEEDED.md` (line 259 "Where in the sequence the AI tools run", line 567 the pulled AI-imagery claim), `HANDOVER.md`. Captures: `after-1440/ethical-ai.png`, `after-390/ethical-ai.png`, `before-1440/ethical-ai.png`, `1440-privacy` for the shell being reused.

**What changed in this revision.** Three corrections from the verdict and the cross-site rules: (1) the tools table loses its "Where on the line" column until the client confirms the placement; the clause says only what Figure 1 draws; (2) the date row is labelled "Wording last revised", never "Last revised", on the title block and in the foot line; (3) "Applies to" drops "and the activities that follow it" because `stations.ts` covers the episodes and nothing covers Victoria's books. Cross-site: this page is one of the two documents that keep dotted-leader status rows and mono margin numerals; `.t-h1` is Calistoga; no `font-hero`, `<em`, `PageHero` or `.deep` anywhere in the shard, and the builder greps for all four and fails on a hit (`text-red-deep` is a colour token, not the `.deep` band class, and is the only string that could be mistaken for one).

## 1. Job

An investor or broadcaster opens this page from the About menu to find out whether "human-led" is a slogan or a procedure; an educator or a journalist opens it to find out which tools touch a children's programme and who can stop a release. All of them arrive sceptical, because the company's own brand kit is produced with the tools this page names. They must leave able to quote the position back (which tools, who decides, what a tool is never used for, what the reviews are for), able to see that the wording is dated so the company could be held to it, and able to find the person to ask when it does not satisfy them. Nothing on the page may be a claim they cannot check against the clauses under it, and nothing on it may be a fact the company has not supplied: an unconfirmed placement or an unlabelled date on a trust document is worse than a gap.

## 2. Page kind and the idea

The page is a published position statement: one sheet of card, a title block with the document's facts, a contents rail, six numbered clauses and an appendix, with the production line as Figure 1 set into the document the way a figure sits in a research paper. It is the same shell as `/privacy`, `/terms` and `/cookies`, so the Responsible AI position joins "The documents" at the foot of the legal pages and keeps the company it should keep.

It is not the home hero because nothing on it is a frame, a panel or a claim set in the display face: the first thing on the page is the document's name ("Responsible AI"), then its facts, then what it covers, then its contents. The home hero says three words over a film; this page says 1,400 words with numbers down the margin. A reader can hold the company to a clause; nobody can hold a company to a headline.

What sets it apart from the other sheets in the set (case-study, app, journal) is the document shell itself: the tab, the sheet of card, the contents rail, the mono clause numerals in the gutter and the dotted-leader status rows. By the cross-site rule those four things belong to the two documents (this page and the legal pages) and to nothing else, so a thumbnail of this page is a thumbnail of a policy and of no other subpage.

## 3. Opening

**At 1440.** Header as built. Then, 40px under it, the sheet: `.card-stock` at `max-w-[86rem]` (1376px, the width `ProductionFlat` was tuned for), centred, `px-14 py-16`, with one tab above its top left edge in the legal pages' tab style (`rounded-t-[7px]`, mono 14.5px uppercase), reading `POSITION STATEMENT`. No sibling tabs: this is not one of the three legal policies, and the shelf at the foot does the cross-referencing.

Inside the sheet, the title block runs the full sheet width as a two-column grid `lg:grid-cols-[minmax(0,1fr)_22rem] gap-x-20`:

- Left: a mono line, 14px, uppercase, `tracking-[0.14em]`, `text-muted`: `CLÉ FAMILY MEDIA`. Under it, `mt-5`, the h1 `Responsible AI` in `.t-h1` (Calistoga via `--font-display`, 66px at 1440, `text-ink`, no `<em>`, no accent, never `--font-hero`). Under that, `mt-7`, the document's summary line in `.t-lead` `text-ink` `max-w-[56ch]`: **"AI is a production tool. People remain responsible for the work."** This is the client's own line (`COPY["hero.title"]`), set as one sentence in the body colour with the asterisk emphasis stripped, not as a headline with a pink clause.
- Right, aligned to the baseline of the h1: a `dl` of status rows, the document `dt`/`dd` dotted-leader row, 15px, `tnum`. The leader is permitted here because this is a document (cross-site rule 1).
  - `Wording last revised` ... `24 October 2026` (a `REVISED` constant like `Legal.tsx`'s `DRAFTED`; the wording was rewritten from the client's review document of 22 October on 2026-10-24, per `stations.ts`. The label says "wording" so the date cannot read as adoption. Never a live date.)
  - `Applies to` ... `Every episode of The Pawsitive Pugs & Pals®` (the position text in `stations.ts` covers production of the episodes and nothing else; the books are not covered until the client extends the position).
  - `Tools named` ... `Runway, ElevenLabs`
  - `Adopted` ... NEEDED FROM CLIENT. Row does not render until supplied.
  - `Approved by` ... NEEDED FROM CLIENT. Row does not render until supplied.
  - No `Version` row. A version is invented until the client asks for one; if he does, it is added then.

Under the title block, a `border-t-[1.5px] border-rule` rule, then Figure 1 across the full sheet width (1264px drawn, about 263px tall, 2.1 CSS px per user unit, which is what the graphite tooth needs), then its caption and key, then a second rule, then the contents rail and clause 1 begin. At 1440 the title block, the summary line and the top of the drawing (the return rail and the first three gates) are inside the first 900px. The contents list is at about 1,020px, one short scroll.

**At 390.** Header. The tab and the sheet start at about 110px, `px-5 pt-9`. Mono line, `Responsible AI` at 36px (`.t-h1` floor), the summary line at 18px, then the status rows stacked (dt over dd, no leader). Then the contents as the legal pages' `MobileContents` disclosure, label `CONTENTS`, `6 clauses, 1 appendix`, closed. Then the first rule and `1 Position`. Figure 1 does not sit above the contents on a phone: at 358px wide it is 75px tall and reads as a scratch, so on a phone it mounts inside clause 2 where the text introduces it, edge to edge of the sheet body, and the caption carries the argument in words. First real content (the summary line) is at about 330px; the first clause heading is inside the first screen.

**What moves.** The sheet settles (one `Settle` on the sheet: 8px, 0.7s, house ease), its children staggered 60ms: tab, title block, rule, figure. Then Figure 1 draws itself when seen (as now: track draws, gates fade in order, the return's head draws last). Nothing else.

**Wording on the first screen, drafted from the page's own facts:**

```
CLÉ FAMILY MEDIA
Responsible AI
AI is a production tool. People remain responsible for the work.

Wording last revised ... 24 October 2026
Applies to ............ Every episode of The Pawsitive Pugs & Pals®
Tools named ........... Runway, ElevenLabs
```

## 4. Section by section

The whole page is one surface: the sheet on the paper ground, end to end, then "The documents" shelf, then the footer. No bands. The body grid inside the sheet is the legal shell's `lg:grid-cols-[14rem_minmax(0,1fr)] gap-x-20`, rail sticky at `top-28`, clauses in a `max-w-[68ch]` column. Clause headings as the legal shell sets them (`.t-h3 font-sans font-bold`, about 30px at 1440, with the clause number in mono 14px in the gutter; mono margin numerals are a document-only device by cross-site rule 3, and this page is a document). Body at `.t-body` (17px / 1.64): the legal shell currently sets clause bodies at 16px, which fails the client's "too small" floor; raise the shared shell to 17px in the same change so all four documents match.

### Title block
As described in section 3. Purpose: say what the document is, when its wording was last set, and what it covers, before it says anything else. Craft detail: the dotted leaders in the status rows are the only ornament; the Adopted and Approved rows are hidden rather than shown empty, because an empty "Approved by" on a trust document is worse than none.

### Figure 1 (desktop position; on a phone it sits in clause 2)
Purpose: the shape of the argument in one look, before any clause. Layout: full sheet width, the existing `ProductionFlat` SVG only (the drawing and its in-loop label `The episode goes back until everyone is happy`), on the sheet's raised ground. Under it, left: the caption in 15px `text-body`, prefixed by `Figure 1` in mono 14px `text-red-deep`:

> **Figure 1** People decide at every phase and the tools sit in one place in the middle. The sequence an episode goes through before it reaches a child; when the final sign-off asks for changes, the work goes back round until everyone is happy.

Under it, right: the key as it exists (three symbols, mono 14px: `Person decides`, `Tool assists`, `Everyone signs off`), now the figure's legend rather than a band's furniture. This keeps `COPY["line.heading"]` (it is the caption's first sentence) and the "Below is the sequence" note (it is the second). Craft detail: the drawing is on card, not on the wall ground, so the graphite stroke and the red return read at full contrast against `--color-raised`; the `pline__return` label stays at `min-width: 900px`.

### Contents rail
`CONTENTS` in mono over an `ol`, 15px, active clause marked with the red left border on scroll (the legal shell's read-on-scroll code, reused as is). Entries: `1 Position` · `2 How an episode is made` · `3 The tools` · `4 What a tool is never used for` · `5 Six commitments` · `6 Review of this position` · `A Questions`. The old "See the five phases" button is this list's entry 2; the old "Who is in the sequence" button becomes the link at the end of clause 2.

### 1 Position
Three paragraphs, every sentence already on the page:

> Our creative and educational decisions are made by people. Our team directs, reviews and approves the work before publication.
>
> Calling this work handmade would be untrue. Calling it AI-generated would erase the people who actually make the decisions. Runway and ElevenLabs sit inside final production, and this document says so by name. The story, the script, the direction, every review and the final approval are theirs.
>
> This document sets out where the tools sit, what they are never used for, the commitments the company holds itself to, and what the reviews are for.

The first paragraph is `COPY["line.lead"]`. The second is the "Neither word is true" pair plus its two sub-sentences, now a paragraph in the body face instead of a 38px display pair with a rule between them. The third is new connective text (a contents sentence, not a claim) and is the only drafted sentence on the page. Cut: the pair as a band, because a document states its position once at reading size.

### 2 How an episode is made
Opening sentence, which says exactly what Figure 1 draws and nothing more: "An episode passes through five phases, shown in Figure 1. People decide at every one of them; the tools are used at one point, between the locked script and the animation." The drawing already places the tools box there and `CONTENT-NEEDED.md` (line 259) asks Conor to confirm it in one sentence. The clause may restate the drawing; it does not add a phase number to it. No "phase 03" appears in this clause or anywhere on the page until the client confirms the placement; the company's own phase numbers appear only as the `index` strings on the sub-clauses below.

Then the five phases as sub-clauses `2.1` to `2.5`, in the text column, from `STATIONS` (every string verbatim): sub-clause number in mono in the gutter, the phase title in `.t-h3` reduced one step (`text-[1.25rem]` sans bold), the `who` line in 15px semibold ink, the body in `.t-body`. The company's phase number is printed after the title where `stations.ts` gives one (`2.1 First draft (phase 01)`); the tool station has no `index` in `stations.ts` and gets none here. `2.5 Final sign-off` carries the red top rule the `pline__gate--hold` style already gives it. This replaces the three-column `pline__gates` grid: a document numbers its steps down the page. Drop the bracketed phase number if it reads as fuss at build.

The tool station's sub-clause body is `STATIONS[2].body` verbatim: "Runway for visual production and ElevenLabs for voice production, inside the animation and directed by Alan. Nothing here is published on its own." That sentence is the company's own and is the only placement statement on the page.

`2.6 The return`: the "dashed return" paragraph as it stands, with its dashed swatch, now a sub-clause.

`2.7 What the reviews are for`: `ForTheChild`'s three rows (`For the child`, `For the parent`, `For the educator`) as a `dl`, verbatim, without the rounded box; the mono `dt` and 17px `dd` as rows under a hairline. Then one line: "The people in the sequence are listed on the team page." with a `TextLink` to `/team`.

On a phone, Figure 1 mounts between the opening sentence and 2.1, full sheet-body width, with its caption and key under it.

Cut: the `WHAT THE REVIEWS ARE FOR` box as a boxed object beside the line (a sheet on a sheet).

### 3 The tools
A table, the only table on the page, full text-column width, `border-t-[1.5px]`, rows separated by hairlines, mono column heads 14px. **Three columns until the client confirms the placement:**

| Tool | Used for | Before release |
|---|---|---|
| Runway | Elements of visual production and animation, to the script and direction set by the team. | Directed, reviewed and approved by the team. |
| ElevenLabs | Elements of audio and voice production. | Reviewed for quality and suitability before release. |

Every cell is from `PLATFORMS` and the first appendix answer. A fourth column, `Where on the line`, is coded behind a `TOOL_PLACEMENT` constant in `stations.ts` that is `null` until Conor's one-sentence confirmation arrives; while it is `null` the column does not render and nothing on the page names a phase for the tools. When he confirms, the constant holds his sentence and both rows print it (the verdict's rule: a dated document cannot assert a placement the company has not stated).

Then one paragraph from the first appendix answer: "Both sit inside a human-led workflow rather than operating as autonomous content creators. As the technology changes we will keep reviewing the platforms we use, their commercial terms, and how they align with our standards on intellectual property, consent and responsible production."

Then, NEEDED FROM CLIENT, a short paragraph on the company's own imagery: whether the frames and stills used on this site and in the press kit are produced in the pipeline above and at which point (QUESTIONS #22, `CONTENT-NEEDED.md` line 567). Until supplied, nothing renders here and the gap stays logged; this page carries no images, so nothing on it contradicts the clause meanwhile.

### 4 What a tool is never used for
Opens on `TheLineTable` as it exists (the `People decide` row with its four items, the 3px red rule, the `Tools assist` row), re-labelled by the clause heading rather than under the old claim heading. Then `4.1` to `4.3`, the three `DO_NOT` sentences, verbatim, numbered. Cut: the heading "People decide what a story teaches. Tools assist with how it looks and sounds." (a claim as a heading; its content is the table under it).

### 5 Six commitments
`5.1` to `5.6`, the `LINES` array verbatim: title in sans bold 20px, body in `.t-body`, one column, hairline between. The two-up grid goes: a document reads down. "Transparency matters" keeps its last sentence ("We prefer the clearer description at the top of this page"), which is now literally true of clause 1.

### 6 Review of this position
Two paragraphs and one link. First: "The technology will keep changing. The responsibility will not." followed by `COPY["commit.lead"]` ("As the company grows we will keep reviewing our practice around human creative authorship..."). Second: "If something here does not satisfy you, whether you are a parent, an educator or a distribution partner, we would genuinely rather have the conversation than have you assume." Then the page's one closing link, a `TextLink`: `Write to us` to `/contact`. Then the document's foot line in mono 14.5px `text-muted`, as the legal shell does it but with the same label as the title block: `Wording last revised 24 October 2026`. The foot line never prints `Draft` (the legal shell's `Draft` at `Legal.tsx` 457 comes out in the same change, per the legal plan).

Cut: the navy band (`.deep`: heading, lead, paragraph, red button, text link). Every word in it is in this clause; the button is a text link because a document ends in a sentence.

### Appendix A: Questions
Inside the same sheet, under a hairline, heading `Appendix A  Questions people ask` in the clause style. The four `QUESTIONS` as the existing disclosure list (`DisclosurePanel`, one open at a time, first open by default), verbatim. Cut: the `ASKED AND ANSWERED` card tab and the card-within-a-card, and the claim heading "Which tools, who approves, and what happens when a review finds a problem."

### The documents
After the sheet, the legal pages' shelf, extracted into a shared component and given a fourth entry at the top: `Responsible AI` (marked "here", not linked) with the description "How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production process." Then Privacy policy, Terms, Cookie policy as they stand. The same component on the three legal pages gains the Responsible AI row as its first link. The shelf's closing sentence stays. Then the footer.

Cut from the current page, in total: `PageHero` (panel, mono eyebrow pair, aside, pink `<em>`, two pills); the "Neither word is true" display pair; the claim headings on sections 2, 4 and 5; the three-column phase grid; the two-column tools/never detail block; the boxed "What the reviews are for"; the FAQ card tab; the navy band. Nothing in `stations.ts`, `LINES`, `QUESTIONS`, `PLATFORMS`, `DO_NOT`, `ForTheChild` or `copy.ts` is dropped; every `useBlock` key keeps a home (`hero.title` is the summary line, `hero.aside` becomes the `Tools named` row's value, `line.heading` and `line.lead` as stated, `lines.heading` is retired because clause 4's heading replaces it, `faq.heading` is retired because the appendix heading replaces it, `commit.heading` and `commit.lead` open clause 6). Log the two retired keys in `src/lib/blocks.ts` (lines 189 and 190 today) so the admin does not offer them.

## 5. Signature moment

A policy document with a pencil drawing in it. Figure 1 drawing itself across the top of a numbered, dated position statement, red return and all, is the one picture a reader meets on a page that is otherwise type, numbers and a contents rail; the contrast between the drawn line and the clause numbers is the memory. The second thing they remember is the status block: a children's media company that puts "Wording last revised" and "Tools named" on its AI position, in the same shell as its privacy policy, and leaves "Adopted" off the page rather than fake it.

## 6. Mobile

At 390: the sheet is `px-5`; the tab shrinks to the legal shell's phone size; the status rows lose the leader and stack dt over dd; the contents collapse to the disclosure; Figure 1 moves out of the title block into clause 2 (see section 4) and is allowed its full 358px width, with the in-loop label hidden and the caption first; the tools table (clause 3) becomes three stacked rows per tool (`Tool`, `Used for`, `Before release` as mono labels over 17px values; a fourth row only when `TOOL_PLACEMENT` is set) instead of a table scrolling sideways; `TheLineTable` already stacks; the disclosure list is unchanged. Clause numbers move from the gutter to inline before the heading, as the legal shell does under `sm`. Body stays 17px, mono stays 14px, the red boundary rule stays 3px. No scroll-spy on a phone (the rail is closed).

## 7. Motion

1. **Entrance.** One `Settle` on the sheet, children staggered: tab, title block, rule, Figure 1's frame. 8px, 0.7s, `cubic-bezier(0.22,1,0.36,1)`. The clauses below do not settle one by one; the contents rail's active mark changes on scroll, which is a state, not a motion.
2. **Figure 1 draws.** Exactly as `ProductionFlat` does it, gated by the kit's hold-until-seen: track draws (1.2s), gates in order, tools box, dashed return, chevron, head (0.5s). About 2.5s total, once.

`prefers-reduced-motion`: `Settle` never arms (built in), `.ink-draw` and `.ink-in` are already forced to final state in `draw.css`. No `Wipe` on this page.

## 8. Needed from client

- The date the Responsible AI position was adopted and who approved it (the two hidden status rows).
- Whether he wants a version number on it (none is shown until he does).
- One sentence confirming where the tools are used in the sequence (`CONTENT-NEEDED.md` line 259). Until it arrives the tools table has no "Where on the line" column and no phase number is attached to the tools anywhere on the page.
- Whether the position extends to the activity, colouring and offline books (Victoria Buchkova's material). Until it does, "Applies to" names the episodes only.
- The imagery statement for clause 3: whether the site's and press kit's frames are produced in this pipeline, at which point, and who approves them (QUESTIONS #22; the pulled press-kit line at `CONTENT-NEEDED.md` 567).
- Kirstie's surname is already in `people.ts` (Harding); nothing on this page is blocked by it.
- The real sent-back episode (which episode, what was caught, by whom, what changed) for 2.6, still the single most persuasive thing this page could carry. Not required to build.

## 9. Risks

- **Slides into the home formula** if the builder gives the title block a ground (a panel, a frame, a show still) or sets the summary line in Fraunces with a coloured clause. Guard: the h1 is `Responsible AI`, two words, in `.t-h1` (Calistoga) on the sheet; the position line is `.t-lead` in `text-ink`; the shard is grepped for `font-hero`, `<em`, `PageHero` and `.deep` and fails on any hit; no `btn` anywhere on the page.
- **Slides into generic** if the status rows become a "meta card", the tools table becomes icon tiles, or the commitments go back to a two-column card grid. Guard: one surface, hairlines and dotted leaders only, no borders around groups except the single tab and `TheLineTable`'s red rule; the legal shell's existing classes and nothing invented.
- **Asserts what the company has not said** if the builder restores "Phase 03" to the tools table, prints "Last revised" without "Wording", adds a "Version 1", or shows "Adopted" empty. Guard: `TOOL_PLACEMENT` is `null` until the client's sentence exists and the column is conditional on it; the date label is a literal string containing "Wording"; there is no version constant to print; Adopted and Approved rows render only when their value exists; the gaps live in `CONTENT-NEEDED.md`, not on the page.
- **Becomes a manifesto again** if clause headings are rewritten as sentences. Guard: every heading is a noun phrase naming what the clause contains (`The tools`, `Six commitments`), never what it argues.
- **Figure 1 on a phone** reads as a scratch at 358px. Guard: it moves into clause 2 on a phone, the caption leads, and the sub-clauses 2.1 to 2.5 carry the sequence in words; never scale the SVG beyond its box or add a second drawing.
- **Looks like the other sheets** (case-study, app, journal) in a thumbnail row. Guard: by the cross-site rules only this page and the legal pages carry the tab, the card sheet, the contents rail, mono margin numerals and leadered status rows; if any of those appear on a non-document page the fault is in that page's shard, not this one, and the gate should fail it there.
- **Shell drift** between this page and the three legal pages. Guard: extract the sheet, tab row, contents rail, scroll-spy, foot line and shelf from `Legal.tsx` into one `Document` shell with `width`, `tabs`, `meta`, `figure` and `revisedLabel` props, raise its body size to 17px once for all four documents, and remove the `Draft` word in the same change.


---

## case-study

# `/case-study`: the protocol sheet (revised after the creative director's verdict)

Plan only. Read: `src/pages/CaseStudy.tsx`, `src/components/casestudy/{config,copy,questions}.ts`, `{TwoRoutes,RoutePicker,Slot,Questionnaire}.tsx`, `routes.css`, `src/components/draw/draw.css`, `src/components/shop/Docket.tsx`, `src/pages/Legal.tsx`, `src/lib/{episodes,site}.ts`, `src/styles/index.css` (lines 202 to 203 and 337 to 340), `CONTENT-NEEDED.md` "The case study section", `QUESTIONS.md` #37.5, `HANDOVER.md` lines 340 to 465. Captures: `fanout/after-1440/case-study.png` (9,088px), `after-390/case-study.png` (12,113px), `before-1440/case-study.png` (8,029px). Drive: `scratchpad/drive/Episode 03/` including `Paula_s activities-03.pdf` and `scratchpad/packs/episode-03-cover.png`.

Verified in the repo before revising: `--font-display` is Calistoga and `--font-hero` is Fraunces (`index.css` 202 to 203), so every `.t-h1`/`.t-h2`/`.t-h3` on this page is Calistoga and the word Fraunces appears nowhere below. `draw.css` sets `.ink-line` at `stroke-width: 2`, `.ink-thin` at 1.4 and `.ink-accent-fill` to `--color-red`; `TwoRoutes` draws four nodes at `(150,130)`, `(300,58)`, `(300,202)`, `(450,130)` and five paths. `RoutePicker` holds `ROUTES` with both summaries and theme lists, a `fieldset` with legend "Where are you teaching?", and an `aria-live` panel. `site.ts` lists `/case-study` in the About group at line 61 and in the footer at line 90.

**What changed from the last plan, in one paragraph.** The page opens on the route drawing with the chips driving it, not on a table; the status facts sit beside the drawing as a plain ruled list with no dotted leaders (leaders belong to journal, the docket and the two documents); the margin carries mono labels only, no numerals (numbered margins belong to `/privacy` and `/ethical-ai`); the Materials row states the truth (notes with the adviser, games and colouring not supplied); the drafted "Taking part is by arrangement" sentence is held until the client names the contact; and the build fails on `font-hero`, `<em`, `PageHero` or `.deep` in the shard.

## 1. Job

Two people land here. An early years educator in Ireland or England who has been told about the study (by Paula, by Conor, or by a search) and wants to know what she would be asked to do, whether it is open, and what happens to anything she sends. And an investor or broadcaster who clicked "Case study" to see whether "research underpinning the model" means anything. Both must leave with the same four facts in under two minutes: a study exists and is specified (one episode, two curriculum routes, four steps, one questionnaire); it is not open yet and the page says exactly why (participant information not yet published, notes with the adviser, games and colouring not yet supplied); the questionnaire asks nothing about any child; and nothing has been published as a result. Neither should feel they read a brochure for a study: they should feel they read the study's filing, and the one thing they operate on it (the route switch) is the study's structure.

## 2. Page kind and the idea

**A protocol sheet, opened on its object.** The page is the study's one-page registration: a name, the structure drawn, the facts beside it, then who it is for, the procedure in four steps, what will be published, the questionnaire's status, and what happens to the data. One surface, paper, end to end. Every unknown is a row that says so in words rather than a hole drawn as a dashed box.

What makes it this page and not the fourth numbered document: the first screen is a drawing being operated, not a title block and a table. The route fork (`TwoRoutes`) is the only interactive object on the site that is not a form, and it carries the one idea the educator must hold (same episode in, same questionnaire out, only the notes differ). The facts stand beside it as a short ruled list, the way a figure has a key. There are no mono numerals in the margin, no dotted leaders, no `Docket`, no `Slot`, no pills, no `<em>`, no scrimmed frame, no navy band.

It is not a copy of the home hero because there is no picture under the title, no claim as a heading and no bands. The current page opens on `slate-ep3` scrimmed to about 50% under "A case study across *two curricula*" in the pink `<em>` and runs six bands, 9,088px of which roughly 2,500px is a draft questionnaire that cannot be sent and has not been approved. The sheet replaces that with one surface, one drawing and about a quarter of the height.

## 3. Opening

**Surface.** `--color-paper` as the page ground, no `.well`, no `.bench`, no `.deep`; the 1560 shell, left-aligned measure; the whole page one `<article>`. Sections are separated by a `1.5px` `border-rule` hairline running the full content width. No cards, no panels, no rounded frames.

**At 1440, first screen (about 900px tall):**

- y 0 to 90: the global header, unchanged.
- y 150: one mono line, 14px, uppercase, `tracking-[0.16em]`, `text-body`: `STUDY PROTOCOL` on the left; on the right end of the same flex row, `Kicker` carrying the status, `Not yet open` (`Open` when `STUDY_OPEN`). The only `Kicker` on the page, and it is a status.
- y 200: the title in `.t-h1` (Calistoga, about 66px at 1440, `text-ink`, no `<em>`, no colour): **Cross-border case study**. One line.
- y 290: the subtitle in `.t-lead` (21px, `text-body`, `max-w-[58ch]`): *Early years educators in Ireland and in England use one episode of The Pawsitive Pugs & Pals®, and a set of activities made to go with it, with a group of children, and then tell us what they saw.* (The existing intro paragraph with "CLÉ Family Media is running a case study with" cut, because the title says it.)
- y 400 to about 860: **the opening object**, a two-column block, `lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16`, hairline above it.
  - **Left column: the drawing and its control.** `TwoRoutes` at full column width (viewBox `520 x 260`, so about 800 by 400px here), labels in the existing `ink-label` (Calistoga/Hanken HTML, not `<text>`). Directly under the first node ("One episode", `cx 150`), left-aligned to it, the `RoutePicker` chips: the `fieldset`, legend `Where are you teaching?` as `field-label`, the two native radios `Ireland` and `England` rendered as `.chip` with `min-h-[44px]`, `aria-live` unchanged. **The chips drive the drawing** (section 5).
  - **Right column: the facts, as a plain ruled list.** A `<dl>` of `dt`/`dd` pairs, each row `border-b-[1.5px] border-rule`, `py-3`, `grid-cols-[9rem_minmax(0,1fr)]`; `dt` in mono 14px uppercase `text-body`; `dd` in `.t-body` Hanken 17px `text-ink`, `tabular-nums`. **No dotted leaders** (cross-site rule 1). Seven rows:

    | Term | Value |
    |---|---|
    | Status | **Not yet open** (strong; `Open` when `STUDY_OPEN`) |
    | Opens | Date to be confirmed |
    | Routes | Ireland (Aistear) and England (EYFS) |
    | Episode | 003, Chicken Vision, 10:41 |
    | Materials | Notes with the adviser; games and colouring not yet supplied |
    | Questionnaire | Draft, awaiting approval |
    | Results | None yet |

    Under the rows, one `.t-body` `text-body` line, `max-w-[44ch]`: *The participant information is agreed and published here first. The questionnaire opens after it.*

    The right column's top aligns with the drawing's top; at 1440 the seven rows (about 330px) and the closing line end near the drawing's chips, so the block reads as figure and key.

- About y 880: the next hairline, so the fold lands on a rule.

**At 390, first screen (about 760px tall):** header 70px; the mono status line at y 100 (`STUDY PROTOCOL` left, `Not yet open` right); `.t-h1` at 36px, two lines; `.t-lead` at 18px, five lines; hairline at about y 440; then **the drawing's phone form**: the legend and the two chips first (y 470, full width, each `min-h-[44px]`), then `routes__list` as already built (the four labels down a rule), with the chosen branch's `li` marked (section 6). The chips are inside the first screen; the status list follows the list, below the fold, as seven stacked rows (`dt` over `dd`). The object before the facts at both widths (cross-site rule 2).

**What moves on open:** the title and subtitle are one `Settle` group; the drawing draws itself (`ink-draw`, existing stagger 0.05s to 1.6s); the right-column rows are a second `Settle` whose direct children settle in sequence (8px, 0.7s, 60ms stagger, `cubic-bezier(0.16,1,0.3,1)`), timed to begin as the drawing's last node lands (`--d: 1.6s`). Nothing else on the first screen moves.

**Image:** none in the opening. The one show frame on the page is the episode 003 slate as a 220px captioned thumbnail inside "The four steps".

## 4. Section by section

Every section below the opening is one row of the sheet: a margin column (`14rem` at `lg`) carrying **one mono label only**, 14px uppercase `tracking-[0.16em]` `text-body` (no numeral, no display face; cross-site rule 3), `lg:sticky lg:top-28 lg:self-start`; and a content column `minmax(0,1fr)` capped at `72rem`. Hairline above each. Section headings inside the content column are nouns or facts, never claims.

### The route you chose
Margin label: `THE ROUTE`. Content column opens with one `.t-body` `text-ink` line, `max-w-[62ch]`: *Ireland follows Aistear and England follows the EYFS. The episode and the questionnaire are the same on both routes; only the supporting notes differ, so choose the one you work to.* (The current `route.heading` and lead merged into prose.)

Then the chosen framework's panel from `RoutePicker`, driven by the chips in the opening and tightened: framework name in `.t-h3` (not `.t-h2`), summary `.t-body` `text-body` `max-w-[56ch]`, the themes label as `field-label`, the themes as ruled `li` rows at 17px in two columns at `lg` (`columns-2`, `break-inside: avoid`), so the seven EYFS areas sit at the same height as the four Aistear themes. Both summaries and both lists verbatim from `ROUTES`. The panel keeps `aria-live="polite"`. The `Slot` card ("Aistear supporting notes, not supplied yet") leaves this section; its content is a row in "What will be published here".

### Who it is for
Margin label: `WHO IT IS FOR`. Content: `.t-h3` first: **Educators working with young children in Ireland or England.** Under it in `.t-body` `text-body`: *The age range and the kinds of setting we are looking for are being confirmed with the education adviser, and will be stated here before the study opens, along with how long it takes.* (Verbatim from the current page.)

The sentence "Taking part is by arrangement with CLÉ Family Media until the study opens" from the last plan is **held**, not drafted: nothing on the page says who the contact is until the client names one. When they do, one `.t-body` line and a `TextLink` to `/contact` go here. Until then the section states only what the current page states. NEEDED FROM CLIENT: who an educator writes to before the study opens (Paula, Conor, or the contact form).

### The four steps
Margin label: `THE FOUR STEPS`. Content: an `<ol>` of four ruled rows, `border-b-[1.5px] border-rule`, `grid-cols-[4.25rem_minmax(0,1fr)]` at 390 and `[6rem_minmax(0,20rem)_minmax(0,1fr)]` at `lg`. The numeral in `.t-h2` (Calistoga, `text-ink`); this is the numbering of a procedure, inside the content, not a document margin, and it is kept because the four steps are the procedure. Step title `.t-h3`, body `.t-body` `text-body`. Verbatim from `STEPS`:
1. Choose a route. *Ireland or England, so the notes you use cite the framework you work to.*
2. Watch episode 003 with your group. *Chicken Vision, from the series, free to watch.*
3. Use the materials. *A game, colouring pages and Paula's offline activity, with instructions for each.*
4. Answer the questionnaire. *A short set of questions about what you saw and how the materials worked.*

Step 2's row carries the page's one image: `slate.ep3` through `Figure`, 220px wide at `lg` (`sm:` 180px; full measure at 390 under the text), `rounded-[var(--radius-md)]`, in the third grid column, provenance caption in mono 13px: *Episode 003 title slate. A frame from the series.* Beside the caption the `TextLink` `Watch on YouTube` with `IconArrow` to `EPISODE.href`, and the runtime line from `episodes.ts` (`Episode 003, 10:41`). `EPISODE.line` and *Watch it through with the children before you use any of the materials below.* stay as the row's second and third `.t-body` lines. The episode appears once, at a size that reads as a thumbnail.

Cut: the "Choose a route, watch one episode, use the materials, answer the questionnaire." `.t-h2` heading, and the "Pick your route" / "Privacy policy" pill pair.

### What will be published here
Margin label: `TO BE PUBLISHED`. Content: a `<dl>` of plain ruled rows (same treatment as the opening list: `dt` mono 14px uppercase, `dd` `.t-body` 17px, `border-rule` under each, no leaders), in two groups, each introduced by a `field-label` line.

*For the study*
| Term | Value |
|---|---|
| Aistear supporting notes | With Paula for final approval; a download and a short note on how to use them alongside the episode |
| EYFS supporting notes | With Paula for final approval; the same |
| Selected games | Not supplied yet; instructions on how to play them with a group |
| Colouring materials | Not supplied yet; printable pages from the episode, with a note on how to use them |
| Paula's offline activity | Not supplied yet; designed by Paula Walshe PhD to follow the episode away from a screen, with step by step instructions |
| Participant information | Being agreed; published here before the study opens |
| The questionnaire | A draft is with the education adviser; published here when the study opens |
| Reviewed study findings | None yet; added once the study has run and the responses have been reviewed |

*Kept apart from the study*
| Term | Value |
|---|---|
| Banteer workshop feedback | The workshop in Banteer is complete and is not part of this study; its feedback will be added here once the feedback letter is supplied |

Every value is the current page's wording for that item, trimmed to one row. "These are two separate things." becomes the second group's label. The "Paula's offline activity" row keeps "designed by Paula Walshe PhD" because that is the current page's own wording for the study's activity, not a caption on the Drive PDF (which is uncredited and not linked from this page).

Cut: the three `MATERIALS` rows as a separate section, the two `APART` rows as a separate section, every `Slot`, and every `Owed()` mono label.

### The questionnaire
Margin label: `THE QUESTIONNAIRE`. Content, `.t-body`: *It asks about what you saw and how the materials worked. It does not ask for the name of any child. Complete it after you have used the episode and the activity with your group.* Then one ruled row: `Status` / `Draft, awaiting the education adviser`.

**`<Questionnaire route={route} />` mounts only when `STUDY_OPEN` is true.** While false, nothing of the form renders. The reason, in a comment above the mount: `questions.ts` is a draft nobody has approved (its first line says so), and an unapproved research instrument on a public page of a company that sells "research underpinning the model" is a liability to Paula and to the company. The gate in `Questionnaire.tsx`, `config.ts` and `api/study-response.ts` is untouched; the day the flag flips, the form appears here with the chosen route and the opening list reads `Open`. The `route` state lives in the page so the form receives it. The form's own "not opened" notice stays for the window between the flag and the API.

Cut: 2,500px of disabled fields, the `q.heading` headline, the sticky two-column form layout.

### Your answers
Margin label: `YOUR ANSWERS`. Content: the existing `<dl>` of five rows verbatim (*What the form asks*, *What it does not ask*, *Who reads the answers*, *How long they are kept*, *Having yours removed*), on paper, `border-rule` not `border-edge-dark`, `dt` 17px semibold, `dd` `.t-body`, no leaders. Above it one `.t-body` `text-ink` line: *The study will not open until the participant information is agreed and published on this page.* Under it the `TextLink` `Privacy policy` to `/privacy`. The navy `deep` band is gone; the words are not.

### Closing
After the last hairline, one `.t-body` line: *How the company uses AI in making the episodes is written down on its own page.* `TextLink` to `/ethical-ai` reading `Responsible AI`. No navy band; the footer closes the page.

### Admin blocks
Keep `useBlock("case-study", ...)` and update `copy.ts`: keep `hero.title` (default `Cross-border case study`, no stars), add `lead` (the subtitle), remap `ask.heading` to the "Who it is for" `.t-h3` line, keep `route.heading` as "The route you chose" opening sentence, keep `out.heading` as the "Kept apart from the study" group label if wanted, keep `data.heading` as the "Your answers" margin label; retire `hero.eyebrow`, `hero.eyebrow_sub`, `hero.image`, `mat.heading`, `q.heading`. Note the change in `HANDOVER.md`.

### Navigation
Remove `{ to: "/case-study" }` from the About group in `src/lib/site.ts` line 61 until `STUDY_OPEN` (conditional on the flag, which the comment near line 89 anticipates); the footer entry at line 90 stays. `Seo` description: *The cross-border case study for early years educators in Ireland and England: one episode of The Pawsitive Pugs & Pals®, two curriculum routes, the materials and the questionnaire. Not yet open.*

### Dates
No date is printed on this page (cross-site rule 5). "Opens: Date to be confirmed" is the only date-shaped row and it states an absence.

### Height budget
At 1440: about 2,700px including footer (from 9,088). At 390: about 4,500px (from 12,113). Over 3,300 at 1440 means something grew back.

## 5. Signature moment

The route switch, and now it is the first screen. The two chips, `Ireland` and `England`, sit under the drawing's first node; choosing one inks that branch of the drawn fork and the framework panel below changes to Aistear or the EYFS.

Mechanics: `TwoRoutes` takes a `route` prop (`"ie" | "en"`, matching `RoutePicker`'s ids). The chosen branch's mid node (`cx 300`, `cy 58` for Ireland, `cy 202` for England) swaps `ink-fill` for `ink-accent-fill` (`--color-red`, the fill the end node already uses) and the unchosen stays `ink-fill` with the `ink-thin` ring; the chosen branch's two paths (split and rejoin) get `stroke-width: 2.6` via a `.routes__path--on` class against the default `2`, and the unchosen branch's two paths get `.ink-thin` (1.4, opacity 0.55). Transition 240ms `--ease-out` on `fill`, `stroke-width` and `opacity`. The drawing stays `aria-hidden`; the chip radios and the `aria-live` panel are the accessible state. Nothing is added to the SVG (no new paths, no text); the drawing is the one already built, operated.

It is the only interactive thing on the page while the study is shut, it is above the fold at both widths, and it is the one thing anyone would describe afterwards.

## 6. Mobile (390)

- The margin column becomes a single mono line above each section's content (`THE FOUR STEPS`), not a gutter; full-width hairlines keep the page reading as one ruled sheet.
- Opening order: status line, title, subtitle, legend and chips, `routes__list` (the drawing's phone form, as built in `routes.css`), then the seven facts stacked `dt` over `dd` with the rule under each pair.
- `routes__list`: the chosen branch's `li` gets the filled red marker (`.routes__list-branch::before` background `--color-red`) and `text-ink`; the other keeps the hollow marker and `text-body`. Same 240ms transition.
- The framework panel's themes drop to one column.
- The four steps: numeral column `4.25rem`, title and body stacked in the second column; the slate thumbnail sits full measure under step 2's text with caption and link beneath.
- "Your answers" rows stack `dt` over `dd`.
- Sticky margin labels off below `lg`.
- Tap targets: chips `min-h-[44px]`.

## 7. Motion

1. **Entry.** Title and subtitle settle as one `Settle` group; the drawing draws (`ink-draw`, 0.05s to 1.6s as built); the seven facts settle in sequence from 1.6s (8px, 0.7s, 60ms stagger, `cubic-bezier(0.16,1,0.3,1)`). Later sections use `Settle` once each on scroll, no per-row stagger.
2. **The route switch.** 240ms `--ease-out` on the node fill, the branch stroke width and the unchosen branch's opacity; the framework panel swaps with no transition (it is `aria-live`, and a fade on live content is noise).

`prefers-reduced-motion`: `Settle` renders finished content; `ink-draw` collapses under the existing media query in `draw.css`; the route switch swaps state instantly. Nothing loops, nothing is ambient.

## 8. Needed from the client

- Who an educator contacts to take part before the study opens (the "Who it is for" section says nothing about this until answered).
- Confirmation that `Paula_s activities-03.pdf` in the Drive (headed "Educational Materials, Episode 3: Chicken Vision", mapped to Well-being, Communicating and STEAM) is, or is not, the study's offline activity and the Aistear notes. Not rendered until confirmed; if it is, the Materials row and the published-here table change, and the hen photograph on its page 1 needs its provenance stated before the PDF is linked.
- The date the study opens.
- The age range, kinds of setting, and how long the study takes an educator.
- Paula's approval of the questionnaire before `STUDY_OPEN` is ever flipped, and the participant information sheet (who reads the answers, retention, how removal is requested).
- The Aistear and EYFS supporting notes as files.
- The selected games and colouring materials with instructions.
- The Banteer feedback letter.
- Clearance to describe episode 003 with its existing synopsis and runtime (`CONTENT-NEEDED` lists this as open).
- Participant numbers, if any are to be stated.

## 9. Risks

- **The first screen slides back to a table.** If the facts list grows past seven rows or gains a heading, it outweighs the drawing and the page opens on a document again. Guard: seven rows, no heading, `dt` 14px mono; the drawing column is the wider one (`1.45fr`); at 390 the chips precede the facts.
- **Leaders creep in** because the docket and journal have them. Guard: the shard greps for the leader class (`leader`, `dotted`) and fails on a hit; every `dl` on this page is a plain ruled row.
- **Numerals return to the margin** because the legal shell has them. Guard: the margin component takes a `label` string only; the numbered variant is `Legal.tsx`'s and is not imported here.
- **A claim creeps back as a heading.** Guard: the only `.t-h1` is the study's name; section headings are nouns in the margin; the one `.t-h3` in "Who it is for" is a description of a group, not a claim.
- **The slate grows.** Guard: fixed 220px grid column, caption required.
- **The questionnaire is mounted "so people can see it".** Guard: mount behind `STUDY_OPEN`, reason in a comment above it.
- **Drafted contact copy.** Guard: no sentence about how to take part until the client names the contact; the section's body is the current page's wording only.
- **Home vocabulary leaks.** Guard: the shard fails on `font-hero`, `<em`, `PageHero`, `.deep`, `.bench`, `.well` in `CaseStudy.tsx` and the casestudy components (cross-site rule 7).
- **Navy closing band returns.** It does not; the footer closes the page.
- **Dash sweep.** No em or en dash in any drafted line above; the builder runs the Python sweep on the shard before the gate.


---

## app

# /app (PupsPlayer): a product sheet (revised after the creative director's verdict)

Verdict was REVISE on five points, plus the cross-site rules. Changes in this revision, in short: the page opens on the device at both widths (rules 2 and verdict item 2); the status rows lose their leaders and move under the opening object as plain ruled `dt`/`dd` (rule 1, item 5); one shared book statement with the shop plan, measured from the Drive (rule 6, item 1); the away-from-the-screen page is captioned without an author (item 3); the sample pages are set at 440 wide, matching the covers' column (item 4). Everything else that was not questioned stands as before.

Sources read: `src/pages/AppPage.tsx`, `src/components/app/PupsPlayerWalkthrough.tsx`, `StageBoard.tsx`, `ReviewerRoom.tsx`, `NotifyForm.tsx`, `Figure.tsx`, `src/lib/episodes.ts`, `src/lib/site.ts`, `src/lib/brand.ts`, `src/styles/index.css`, QUESTIONS #26 and #37, CONTENT-NEEDED (app rows), COPY-REVIEW-2026-10-24 section 8. Captures: `scratchpad/fanout/after-1440/app.png`, `after-390/app.png`, `before-1440/app.png`. Drive: `scratchpad/drive/Episode 01` to `06`, `scratchpad/packs/episode-0N-cover.png`.

**Measured in the Drive for this revision (`pdfinfo`, every PDF, all six episodes).** Episodes 1 to 4 hold four PDFs each: `Activity pages-0N-colour.pdf` (20 pages), `Activity pages-0N.pdf` (20, black and white), `colouring page(s)-0N.pdf` (20) and `Paula_s activities-0N.pdf` (10, 13, 17, 13). Episodes 5 and 6 hold three: activity (21, 20), colouring (20, 20), away-from-the-screen (13, 11). Twenty-two files; eighteen books counting the two activity editions as one book; 318 pages across the eighteen books. The one statement both pages print, word for word, derived from the shop plan's Drive table:

> **Three books for every episode: an activity book, a colouring book and a set of activities away from the screen. For episodes one to four the activity book comes in colour and in black and white. Eighteen books, all A4.**

No other count ("318", "22 files") appears in page copy; it lives in this plan and the shop plan only, so the two pages cannot drift.

## 1. Job

A parent, a broadcaster and an investor land here with the same question in different registers: what is this product, actually. The parent wants to know what a three-year-old will hold and what it will not do to them; the broadcaster wants to know what the series becomes once it is off YouTube; the investor wants to see that "Watch, Play, Learn" is a thing with contents, not a slogan. The current page answers with a scrimmed show frame, a Fraunces claim and three borrowed components (a slip bench, a display-size sentence, the reviewer faces for the third time) while the one thing that already exists, the real activity material, is nowhere on it. They must leave knowing four things: what PupsPlayer is (the app that holds the series and the material built from it), what is in it today (four episodes released, two in production, the planned games list, the printable books), what it refuses to do (autoplay, purchases, advertising, a way out for a child), and where it stands (in development, no stores, one email when it lands). Nothing is promised that the current page does not already promise.

## 2. Page kind and the idea

A product sheet: the page is laid out the way a maker publishes a specification for a thing that is not shipping yet. The object comes first (the drawn device, which admits it is drawn), then the facts about it as a plain ruled table, then the contents by stage with the real Learn material shown at page size, then a "will not" list, then the notify slot. The idea is that the sheet is honest about tense: the device is a drawing and says so, but the books inside Learn are real and are shown large enough to read, so the reader watches the gap between the plan and the product close on the page itself.

It is not the home hero because nothing on it is a ground. No frame, no scrim, no corner copy, no Fraunces display face, no pink `<em>`, no pill pair under a headline, no wall or navy band. The page opens on the device standing on paper with its name beside it; the only pictures are content with captions: six felted slates, three book covers, four A4 pages. The headline is the product's name, not a claim.

It is not the other sheets either (the cross-site note): no dotted leaders anywhere on this page, no mono numerals in a margin, no status table as the first screen. The opening object is a drawn tablet, which no other page has.

## 3. Opening (first screen)

**At 1440.** Header as now (88px). Then one `Container width="wide"` on paper-2 with 56px top padding, a two-column grid `lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] gap-16 items-center`. The device column is the wider one and sits at the right; the name column at the left is vertically centred on it, so the eye lands on the object and reads the name beside it.

Right column, the object: the drawn device (`PupsPlayerWalkthrough`'s tablet, landscape 16:10 at `@md`), `max-w-[880px]`, no band, no wall, standing on paper with its existing soft shadow. Beneath it, right-aligned, the existing mono 13px credit: "Drawn from the plan, not a screenshot." At 1440 the device is 880 × 550 plus bezel.

Left column, in order:

- The product mark: `public/brand/pupsplayer.svg` masked in `--color-navy` at 56px square (the walkthrough's `PupsMark`, lifted into `components/app/PupsMark.tsx` so both use it). The brand blue `#B5E2F6` is 1.3:1 on paper and is never used as a fill for the mark on this site; navy is the agreed stand-in and matches the device's top bar.
- `h1` in `.t-h1` (Calistoga, 66px at 1440, ink): **PupsPlayer™**, one line, the ™ as a superscript at 40%. 20px gap after the mark.
- Descriptor, `.t-lead` (21px), ink, max 40ch, 24px below the name: "The app for *The Pawsitive Pugs & Pals*®: the episodes, the songs, puzzles and games built from each one, and the printable and offline activities underneath." (The show name in italic as the site sets it; this is the page's existing first fact, reworded from a claim into a definition.)
- The three stage tabs (`role="tablist"` from `PupsPlayerWalkthrough`, unchanged in behaviour and keyboard handling), 40px below the descriptor, each a `.t-h3` title with the red dot and the stage line in `.t-sm` under the active one. They drive the device beside them, so the first screen is interactive before it is read.

With the 56px top padding, the first screen at 1440 (mark, name, descriptor, three tabs, device, credit) fits in 780px. The status rows are not in it.

**Status rows, directly under the opening** (still above the fold on a 900px viewport's second scroll, but not the opening object). A `dl` across the full wide container, 48px under the device, plain ruled rows: a 1.5px `--color-rule` above every row and below the last, each row `grid-cols-[9rem_minmax(0,1fr)]`, `dt` mono 14px uppercase tracking 0.16em in `text-body`, `dd` `.t-body` (17px) in ink. **No dotted leader, no numerals** (cross-site rule 1; the leader belongs to the documents, the shop docket and the journal). Rows:

- STATUS: In development
- HOLDS: Series one of *The Pawsitive Pugs & Pals*. Four episodes released, two in production.
- FOR: Children aged three to five, with an adult beside them.
- STORES: Not yet listed. Links will appear here once they are confirmed. (When `app.app_store_url` or `play_store_url` is set, this row becomes the two `Button`s with `IconExternal`, exactly the current behaviour.)
- UNTIL THEN: The four released episodes are on YouTube, listed below. (`TextLink` to `#released`.) The same `dd` carries, after a middle dot, `TextLink` "Hear when it lands" to `#notify`, in `.t-body`.

No image behind anything. No `PageHero`. No button pair under the headline: the two actions it carried are the links in the UNTIL THEN row.

**At 390.** Order, top to bottom: mark 44px, name in `.t-h1` at its floor (36px), descriptor 18px, then the device in portrait 7:10 at full width (358 × 511 plus bezel), the three tabs as a row of three under it as today, the active stage line as the device's caption, then the credit, then the status rows. The first screen (844px) holds the mark, the name, the descriptor and the top two thirds of the device. The object comes before the facts at both widths (verdict item 2, cross-site rule 2). The rows go single column (`dt` on its own line, `dd` under it, 1.5px rule between rows).

**What moves.** `Settle` on the opening: the device settles into place first (translateY 12px to 0, opacity 0 to 1, 700ms, `--ease-out`), then the name column 120ms later in one group, then the status rows 120ms after that. Tab changes crossfade the screen as they do now.

## 4. Section by section

### 4.1 Opening: the device and the sheet's title block
As in section 3. Carries every fact of the current hero and "What it is" band (the model line; "No purchases inside a game and nothing recommending the next thing to watch" moves to the WILL NOT list in 4.3; the status line is split into the STATUS row and the note in 4.5). **Cut:** the `home.characters` frame and its credit (the frame is the show's; `/media` offers it as a download with its caption), the hero aside "Ad-free. No purchases inside a game." (its two facts are in 4.3), the Fraunces claim "Watch, play and learn in one place" (the descriptor says it as a definition), and the `.wall` band that housed the device. Craft detail: the status rows and the device's top bar use the same mono, so the sheet and the product read as one document.

### 4.2 What is in it
Purpose: the contents list, by stage, with the real material shown at a size it can be read. Heading `h2` `.t-h2`: **What is in it**. No lead. Three rows, each opened by a 1.5px rule, label column left (`grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)]` at `lg`), content right.

**Row 1: Watch.** Left: `.t-h3` "Watch", then the stage line in `.t-body`: "An episode, chosen by the child or the adult beside them. Ad free, and nothing autoplays after it." Then the two Watch items as a plain list, `.t-body`, titles in semibold: "Every episode, ad free" with its body as now; "Built for small hands: large targets, simple navigation and no dark patterns." Right, `id="released"`: the six slates (`slate.ep1` to `slate.ep6`, `Figure` at 16:9) in a grid of three across, two rows, each tile 440 × 248 at 1440, each a link to `ep.href` with `target="_blank" rel="noopener noreferrer"` for the four released, no link for 005 and 006. Under each tile one line: mono 14.5px episode number in `red-deep`, title semibold 15px, runtime mono right (`9:16`, `11:10`, `10:41`, `9:58`) or the `COMING_SOON` chip for 005 and 006, exactly the walkthrough's tile caption. (These are episode numbers in a caption, not margin numerals; rule 3 is about margins.) Footnote `.t-sm` under the grid: "Four episodes, on the show's YouTube channel now. Nine to eleven minutes each." Data from `EPISODES`; nothing hard-coded. The title of episode four prints whatever `episodes.ts` holds; the slate alt in `brand.ts` 339 disagrees with it and is logged for the press kit's spellings row, not resolved here. Craft: the slates are felted objects photographed on a surface, so they sit on a 1.5px rule, not in a card.

**Row 2: Play.** Left: "Play", stage line as now ("Songs, puzzles, matching, recall and jigsaw games built from the episode, plus a short movement or breathing prompt, so the episode becomes something a child does rather than only sees."), then the two Play items: "Play that follows the story" and "Games, songs and a drawing canvas" with their bodies unchanged, including "The interactive games are being built for families at home and for classroom boards." Right: no picture. The games are software that does not exist yet and the page shows nothing it cannot show; a drawn game would be a second drawing (the limit is one). Instead the right column holds the games list as a two-column mono 14px list in ink with 1.5px rules, titled "Planned for the first release" in `.t-sm`: SONGS · PUZZLES · TASKS · MATCHING · RECALL · JIGSAWS · COLOURING SHEETS · A BLANK CANVAS · A MOVEMENT OR BREATHING PROMPT. This is the list the page already carries from the 22 October document, and it reads as a spec rather than a promise.

**Row 3: Learn.** Left: "Learn", stage line ("A printable or educator-designed activity afterwards, taking the learning off the screen entirely."), the three Learn items: "Printables for the table", "A mindfulness guide, and the offline activities", "Grounded in the learning", bodies unchanged. Right: the real material, which is the page's signature (section 5). Three book covers in a row, then four pages in two rows.

Covers, 1440: three across in a 440px column grid, each cover at its own ratio: `Cover-1_activity-01.pdf` and `Cover-1_colouring-01.pdf` at 1287:910, 440 × 311; `Cover-1_offline-01.pdf` is portrait, 910:1287, set at the same 311 height and 220 wide, so the row reads as three books of two formats standing on one rule. Export each at 2x to `public/brand/books/ep1-activity.webp`, `ep1-colouring.webp`, `ep1-offline.webp` with the AVIF/WebP/JPG pipeline; add keys `book.ep1.activity`, `book.ep1.colouring`, `book.ep1.offline` to `brand.ts` with `label: "Book cover"` and alt text naming the book by the title printed on its cover. The covers carry no radius larger than `--radius-sm` and a 1.5px `--color-rule` edge, since they are printed objects, not cards. Only `Cover-1_*` files are exported (section 9).

Caption under the covers, `.t-sm` in `text-body`, the shared statement verbatim and then the credit: "The three books for episode one. Three books for every episode: an activity book, a colouring book and a set of activities away from the screen. For episodes one to four the activity book comes in colour and in black and white. Eighteen books, all A4. Designed and illustrated by Victoria Buchkova." The credit is printed as the covers print it; if the away-from-the-screen booklet's cover does not carry that credit, the credit line is scoped to "The activity and colouring books designed and illustrated by Victoria Buchkova" (builder checks the three covers at export).

Pages, 1440, 32px under the covers, in the same 440px three-column grid (verdict item 4). Row one: three landscape pages at 440 × 311 from `drive/Episode 01/01-png/Activities colour-png-01/`: `01-colour-I spy.png`, `01-colour-maze.png`, `01-colour-breathing.png`. Row two: one portrait page at 311 wide × 440 tall in the first column, page 1 of `drive/Episode 01/Paula_s activities-01.pdf` rendered at 300dpi (the "Educational Materials, Episode 1: The Feather" page with the key vocabulary and the felted "CLÉ Family Media, Made in Ireland" badge), its caption standing in the second column beside it in `.t-body`, ink, max 36ch. Export to `public/brand/pages/ep1-ispy.webp`, `ep1-maze.webp`, `ep1-breathing.webp`, `ep1-offline-1.webp` at 2x, 1.5px rule edge, `--radius-sm`. Each landscape page has a one-line mono 13px caption in the "I Spy, activity book p.3" form, with the true page number read from the PDF at export. The portrait page's caption (verdict item 3, matching the shop plan): **"Activities away from the screen, page one: the key vocabulary for The Feather."** No author is named: the PDF does not name one, and the Drive filename is not a byline. At 440 wide the pages' set type ("count the pictures and write the numbers in the boxes", the feather-breathing arrows, the vocabulary list) is legible, which is the bar for pictures of type.

One line under the pages, `.t-body` in `text-body`: "Made for each episode alongside the series. Which of the books ship inside the app, and which are sold on their own in the shop, will be marked here once it is confirmed." NEEDED FROM CLIENT; see section 8. Until that answer, nothing on the page says the books are in the app, and the Learn screen inside the drawn device keeps its three generic sheets rather than these pages.

**Cut from the current page:** `StageBoard` (the lit slip bench; a second render of a sequence the site drew on `/team` as well, and five sentences dressed as furniture), and the "Each episode has activities built from what just happened in it." claim heading (the sentence is the Play row's first item, where it was always from). Nothing from `ITEMS` or `STAGES` is lost: all eight items and all three stage lines are in these rows, word for word.

### 4.3 What it will not do
Purpose: the four refusals as the specification they are. Heading `h2` `.t-h2`: **What it will not do**. Under it one `.t-lead` sentence, ink, max 40ch: "A young child can find their way around it, and cannot accidentally find their way out of it." (Kept, moved from display size to lead size: it is the page's best sentence and it is an introduction, not a headline.) Then the `WALLS` list as a `dl`, full width at 1440 in two columns of two (`lg:grid-cols-2 gap-x-16`), each row a 1.5px rule, `dt` mono 14px uppercase (AUTOPLAY, PURCHASES, ADVERTISING, GROWN-UPS), `dd` `.t-body` in ink, lines unchanged, no leaders. A fifth row, HANDS, is not added here: "Large targets, simple navigation and no dark patterns" stays in the Watch row, since it is a design choice, not a refusal. Craft detail: the `dt` labels use the same mono, tracking and 9rem column as the status rows in 4.1, so the sheet's two tables look like one document's two tables. Cut: the 1.5px bordered frame around the display sentence and the `t-display` setting.

### 4.4 Who checks it, in one sentence
Not a section: a single `.t-body` paragraph under the WILL NOT list, 48px below, max 60ch, the page's existing sentence verbatim (`AppPage.tsx` 387 to 389): "Every activity in the app maps back to the early years objective behind its episode, and it is read by the same people who read the scripts before Paula gives it her final word." followed by `TextLink` to `/ethical-ai`: "The full review sequence". **Cut:** `ReviewerRoom` and the three portraits (faces on `/team`, `/story` and `/contact` only, cross-site rule 4) and the "Checked by the people who check the episodes" heading. The reviewers' names, roles and lines stay in `people.ts` and on `/team`; this page loses nothing it owned.

### 4.5 Hear when it lands
Purpose: the notify slot and the plain status note. On paper, no deep band. A 1.5px rule, then a two-column grid at `lg` (`grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-20`), `id="notify"`, `scroll-mt-24`. Left: `h2` `.t-h2` **Hear when it lands** (the admin block `next.heading`, default renamed from "Where it stands"; the rows that heading introduced are now in 4.1). Under it `.t-body`: "One email when it is available. No list, no marketing, and we do not share it with anyone." Then `NotifyForm` with `cta="Notify me"`, `IconBell`, and the existing `done` string. Right: the status note, `.t-body` in `text-body`, max 44ch, word for word from `AppPage.tsx` 260 to 262: "In development and not yet available. Everything on this page is the first release as it is planned, not as it has been tested, and we will say which is which once testing is done." Builder note: `NotifyForm` styles its field against white for deep bands; on paper it needs the `.field-input` paper variant, so check the input's border and placeholder contrast on paper-2 before shipping.

### 4.6 Closing
One line and the page's two outward links, `.t-body`, 1.5px rule above, 64px above the footer: "The printable books are sold on their own in the **shop**, and the episodes are on **the show site**." (`TextLink` to `/shop`; external link to `SITE.showUrl` with `IconExternal`.) The word "shop" in this line is conditional on QUESTIONS #26 (shop kept); if the shop is hidden the line becomes "The episodes are on the show site." No navy band; the footer is the closing.

### Admin blocks (`src/lib/blocks.ts`)
`hero.title`, `hero.aside`, `stages.heading` and `check.heading` are retired with their sections; remove them from the registry so the panel offers nothing orphaned. `walk.heading` ("Nothing plays until someone picks it.") no longer heads a section; the `WatchScreen` inside the device already prints that line, so the block is retired too. `next.heading` stays, default "Hear when it lands". `hero.image` (`useImageBlock`) stays and is renamed `device.capture`: the day a real screenshot exists the admin sets it and the device frame shows the capture in place of the drawn screens, and the "Drawn from the plan" credit comes off in the same render (`if (capture) credit = null`). That turns CONTENT-NEEDED's open "PupsPlayer capture" row into a switch rather than a rebuild.

### Kept, unchanged in behaviour
`Seo` title and description; `APP_LAUNCHED` and the `app` settings row via `useSetting`; store links rendering only when set; `#released` and `#notify` anchors; the walkthrough's tablist, keyboard handling and the 13px text floor; `EPISODES` as the one source; the `COMING_SOON` constant; the notify endpoint and its copy; every sentence in `ITEMS`, `STAGES`, `WALLS`, the check sentence and the status note.

## 5. Signature moment

The Learn row: three real book covers on a rule and four real pages beneath them at 440 wide, where "I Spy, count the pictures and write the numbers in the boxes" and the feather-breathing arrows are legible, with the away-from-the-screen vocabulary page standing portrait beside its caption. It is the first time the site shows the thing a child will actually hold, and it sits a screen below a device that admits it is drawn. No other page has it (the shop shows covers as a catalogue, not pages at reading size). A reader remembers that the company showed its homework, not a mock-up.

## 6. Mobile (390)

- Opening order: mark, name, descriptor, the device in portrait at full width, the three tabs as a row, the credit, then the status rows single column (`dt` above `dd`, 1.5px rule between rows, no leaders).
- The slates grid goes to two across (each 171 × 96); captions stack title over number and runtime as the walkthrough tile already does under 384px.
- The three covers become a horizontal `scroll-snap` row, each cover 78% of the viewport width (304 wide, 215 tall; the offline cover 152 × 215), with 16px gutter and `overscroll-behavior-x: contain`, so the cover titles stay readable instead of shrinking to a three-up at 110px. The shared caption sits under the row, full width.
- The four pages stack at full width (358 wide; the landscape pages 253 tall; the portrait page 506 tall), each with its caption under it, in the same order. Not a scroller: a page is read, not browsed.
- The games list goes to one mono column. The WILL NOT list goes to one column of four rows.
- Notify stacks: heading, line, field, button, then the status note. The closing line wraps to two lines with both links on the second.
- Estimated height: about 5,400px against 8,843 today, and the first screen is the product.

## 7. Motion

1. **Opening settle.** `Settle`: the device first (opacity 0 to 1, translateY 12px to 0, 700ms, `--ease-out` `cubic-bezier(0.16,1,0.3,1)`), the name column 120ms behind it, the status rows 120ms behind that. Once.
2. **The pages arrive.** The four pages in the Learn row, on viewport entry at threshold 0.25, each rises 10px and fades in with a 70ms stagger in reading order (`Wipe`'s existing IntersectionObserver), 600ms, same easing. Once.

The tab crossfade in the device is interaction, not entrance, and stays as built. No leader draws in on this page (that is the journal's). `prefers-reduced-motion: reduce` renders both moments in their final state with no transform or opacity transition, which `Settle` and `Wipe` already do through the `index.css` media queries. Nothing loops, nothing is on hover except the slate tiles' existing link state.

## 8. Needed from client

- Where the eighteen books live: inside the app, on the show site, in the shop, or all three. Until answered the page says it will be marked, and the device's Learn screen keeps its generic sheets.
- Whether the activity pages may be reproduced on this site at page size (the activity and colouring books are Victoria Buchkova's credited work; the credit line is printed as the covers print it).
- Who wrote the away-from-the-screen booklets, and whether that name may be printed. The PDFs carry no byline; the Drive filename is not one. Until answered the page captions them as "activities away from the screen" (same as the shop).
- PupsPlayer screenshots or a build, and which features are tested versus planned (QUESTIONS #37.4). The `device.capture` slot waits for them.
- Whether the launch month may be published (QUESTIONS #37.3). The STATUS row is the line it goes into.
- Store links when they exist.
- Confirmation that the eight commitments in `ITEMS` are still the plan (CONTENT-NEEDED, open).
- The Made in Ireland badge as a transparent PNG at 1200px or more, for the status block later; until then it appears only inside the away-from-the-screen page one.
- QUESTIONS #26 (shop kept, hidden, removed), which decides the closing line's wording.

## 9. Risks

- **Sliding back into the home formula.** The device is a big object and a builder will want a band behind it. Guard: the opening is a two-column grid on paper-2 with no `Section` class other than default; grep the page for `.wall`, `.deep`, `.bench`, `.grove`, `PageHero`, `t-display`, `font-hero` and `<em` and fail the shard on any hit (cross-site rule 7).
- **Sliding into the other sheets.** A status table as the first screen, or a dotted leader on the rows, makes this page a thumbnail twin of case-study and the documents. Guard: at both widths the device precedes the rows in DOM order; grep the page for `leader` and fail on a hit; no mono numeral in any margin.
- **Sliding into the generic product page.** A row of three "Watch / Play / Learn" cards with icons is one refactor away. Guard: the three stages are rows of one table with rules, never cards; no icon anywhere on the page except `IconExternal` and `IconBell`; no chip other than `COMING_SOON`.
- **The covers as decoration.** Six identical covers at thumbnail size, or a cover beside a paragraph, is the rejected watermark in a new coat. Guard: one episode's three covers, at 440px, once, on a rule, captioned with the shared statement and the credit; nothing from the flat vocabulary appears elsewhere on the page.
- **Two truths about the books.** Guard: the shared statement in the preamble is the only sentence of counts on this page and on `/shop`; the builder copies it, never rewords it.
- **Mixed provenance.** `Cover-2_activity-*` carries a rendered garden behind the illustration. Guard: only `Cover-1_*` files are exported, and the show frames (`home.characters`, `show-*`) do not appear on this page at all.
- **Claiming the books are in the app.** The row is captioned as material made for each episode, not as app contents, and the sentence about where they ship stays until the client answers. Guard: the builder may not write "in the app" in the Learn row's captions.
- **Asserted authorship.** Guard: the string "Paula" appears on this page only in the verbatim check sentence (4.4); never in a caption, filename-derived label or alt text.
- **Small type.** Covers and pages are pictures of type, and at the wrong size they fail the client's bar. Guard: no cover under 304px wide at any breakpoint, no page under 440px wide at 1440 or 358px wide at 390, and captions never under 13px.


---

## journal

# /journal and /journal/:slug: plan (revised after the creative director's verdict)

Sources read: `src/pages/Journal.tsx`, `src/pages/JournalPost.tsx`, `src/components/journal/{data.ts,Contents.tsx,Correction.tsx,corr.css,PostBody.tsx}`, `src/components/{Settle,NotifyForm,ui}.tsx`, `src/lib/{site,blocks,brand}.ts`, `src/styles/index.css` (fonts lines 202 to 203, type scale lines 336 to 352), `api/contact.ts`, `CONTENT-NEEDED.md` Journal table, `QUESTIONS.md` #8. Captures: `fanout/after-1440/journal.png` (3,768px), `after-390/journal.png` (5,451px), `before-1440/journal.png` (3,526px), sliced at `/tmp/claude-1000/-home-david-Documents-GitHub/dc2a40e8-4359-4bc5-b088-0e04ff88e12e/scratchpad/journal-slices/`.

**What changed in this revision.** Three verdict items and the cross-site rules applied:
1. Journal owns the dotted leader. `.leader` ships in `index.css` for this page and the shop docket only; case-study, app, ethical-ai and legal use plain ruled rows. The build note in section 4A says so explicitly so no other shard imports it as a general status-row style.
2. "Issue one" is struck. The row reads "First piece ········ In preparation". No periodical structure is invented anywhere on the page (no "issue", no "volume", no "edition").
3. The post page's running head keeps its right-hand line as "CLÉ Family Media", exactly as `BackRail` prints it today (`JournalPost.tsx` 85). The left link changes to "Notes from the studio".
4. Cross-site rule 7: `.t-h1` is Calistoga (`--font-display`), never Fraunces. Every "display face" in this plan means Calistoga. The shard lint greps for `font-hero`, `<em`, `PageHero` and `.deep` and fails on any hit.
5. Cross-site rule 2 (lists open on the list): unchanged in substance, restated in section 3 so the first screen's test is "the first strand row is visible", not "the status rows are visible".

## 1. Job

Three people land here. A returning parent who followed "Journal" in the header to see whether there is anything to read; a journalist checking whether the company publishes under named people; an investor or broadcaster checking that the company talks, and how. All three want one answer in the first screen: what is here now (nothing yet, said plainly), what will be here (four named subjects with a sentence each), and under what rules (people write it, nothing is sponsored, corrections stay visible). They must leave able to name the four strands, knowing the journal is free and human-written, and able to ask for a subject or be told when the first piece goes up. The page must do that in one screen at 1440 and about two at 390, because 3,768px of a journal with zero posts is the current fault.

## 2. Page kind and the idea

**A contents page.** The front matter of a periodical: a masthead (title, publisher, status), a contents list (the four strands, each with a dotted leader running to the honest answer of what is in it), and a colophon (the four rules, small, at the foot). When posts exist the contents list fills with pieces and the page grows into a list; nothing about its shape changes.

It is not the home hero because there is no frame, no panel, no picture, no scrim, no pink `<em>`, no pill pair, and no claim set as a heading. The title is the journal's name in `.t-h1` (Calistoga) on bare paper, and every other line on the page is a fact or a rule, set in reading type with a rule or a leader under it. One surface (paper) end to end; no bench, no navy. The home hero is a film; this is a printed page.

It is not the other subpages because the dotted leader, which the cross-site rule now reserves for journal (and the shop docket), is the thing that makes the page a contents page rather than a document: ethical-ai and legal open on a title block with plain ruled rows, case-study on the route drawing, app on the device. Journal is the one page whose first screen is a list with leaders running across it.

## 3. Opening

### 1440 (first screen, 900px tall)

Container: the site shell (`Container width="wide"`, 1560 cap, 32px gutters). Top padding 56px under the header.

**Masthead, two columns**, grid `minmax(0,1fr) minmax(0,34rem)`, column gap 96px.

Left column:
- `h1` "Notes from the studio" in `.t-h1` (66px at 1440, `--font-display` Calistoga, ink). One line. No `<em>`, no accent colour, no `--font-hero`.
- 20px under it, mono 14px uppercase tracking 0.14em, colour `body`: "The journal of CLÉ Family Media".
- 36px under that, the **status rows**: a `dl`, max-width 30rem, four rows, each a flex line of `dt` (mono 14px uppercase, `muted`), a dotted leader filling the gap, `dd` (Hanken 17px, ink, `tnum`). Rows 44px tall, no borders between them.
  - First piece ········ In preparation
  - Cadence ········ One piece a week, once we start
  - Cost ········ Free to read
  - Pieces published ········ None yet
  The last `dd` has three states, as the current mono paragraph does: "Loading" while `settled` is false, "None yet" when settled and empty, the count ("3") when there are posts. `aria-live="polite"` stays on that `dd`. When posts exist the first row drops (the first piece is then on the page).

Right column, top aligned to the `h1` cap height (padding-top 12px):
- `.t-lead` (21px), max 36ch, colour `body`: "Written by the people who make *The Pawsitive Pugs & Pals*®, about the research behind it, how an episode is made, and what building a children's media company in Ireland is really like." (Current opening paragraph, word for word, minus "A journal", which the title already says.)
- 28px under it, `.t-body` 17px, max 44ch: "Four strands. Each one is listed below with the honest answer to what is in it."

**A 1.5px rule** across the full container width 72px under the masthead (at roughly y=520), then the contents list begins; the first strand row ("The Research") sits fully inside the first screen. That is the opening test, per cross-site rule 2 (a list opens on the list): the first entry of the contents is above the fold at 1440 and at 390. The masthead is the list's heading, not a hero.

Nothing else in the first screen. No eyebrow pair, no aside, no buttons.

### 390

Same order, one column, 20px gutters, top padding 32px:
- `h1` at 36px, wraps to two lines ("Notes from the / studio").
- Mono line 14px.
- Status rows at full width: `dt` mono 14px left, leader, `dd` 17px right. "One piece a week, once we start" is the longest `dd`; at 390 the row allows the `dd` to wrap to a second line right-aligned rather than squeezing the leader out. Row height 44px, or 64px for that one.
- `.t-lead` at 18px, then the 17px line.
- The rule, then "The Research" row begins at about y=720. The fold at 844 shows the masthead complete and the first strand name. That is the test: the first real entry of the contents is on the first screen at 390.

### What moves

One `Settle` on the masthead (title, mono line, status rows, right column settle with the 60ms stagger that already exists). The leaders draw in left to right as the rows settle (see section 7). Nothing else.

## 4. Section by section

### A. Masthead (described above)

Purpose: name the publication, state where it stands, in facts. Craft detail: the dotted leaders. There is no leader in `index.css` today, so the builder adds one class, `.leader`: a flex-1 span, `min-width: 2rem`, `margin: 0 0.75rem`, `background-image: radial-gradient(circle, var(--color-rule) 1.1px, transparent 1.6px)`, `background-size: 7px 7px`, `background-repeat: repeat-x`, `background-position: 0 calc(100% - 0.35em)`, `height: 1em`, `align-self: flex-end`. Dot colour must pass 3:1 on paper (`lines.mjs` measures it; `--color-rule` is the site's rule token and already passes at 1.5px, so the dots are drawn at 2.2px diameter, not thinner).

**Ownership (cross-site rule 1).** `.leader` lives in `index.css` because the post page's missing state and the shop docket reuse it, but it is journal's signature. The class gets a one-line comment in `index.css` naming its two owners (journal, shop docket) and the shard lint for ethical-ai, case-study, app, media and legal greps `className=".*\bleader\b"` in their page files and fails on a hit. Those pages set their status rows as plain `dt`/`dd` with 1.5px rules between, no dots.

Cut from here: `PageHero` (the tan panel, the eyebrow pair, the aside), the claim heading "A company that asks parents, educators and broadcasters to trust it should be willing to show its working." as a heading (its sentence survives as the colophon's opening line, see D), the mono "Where it stands" paragraph (now the status rows), the `TextLink` to `/ethical-ai` (moves to the colophon's first rule, where the sentence it supports is), and the "Issue one, in preparation" aside (`Journal.tsx` 108), whose "issue" wording is struck from the site.

### B. Contents: the four strands

Purpose: the main content of the page. The four subjects, their descriptions word for word from `data.ts` (or the admin's override), and the honest status of each.

Layout: `Contents.tsx` stays, restyled onto paper. One `ol` with a 1.5px top rule, each row a 1.5px bottom rule, padding 36px 0 at 1440 and 28px 0 at 390. Row = flex column; line one = `h3` (`.t-h3`, 30px at 1440, Calistoga, ink) + `.leader` + status (mono 14px uppercase, `muted`, `tnum`); line two = the blurb, 12px under, max-width 54ch, `.t-body` 17px, `body`. Status reads "In preparation" at zero and "3 pieces" otherwise, exactly as `Contents.tsx` computes it now.

Delete the current "The status beside each one is the honest answer to what is in it." right-aligned note above the list; that line now lives in the masthead's right column where it introduces the list. Delete the bench ground and the heading "The research, how it is made, parents helping parents, and building CLÉ." (it was the list read out before the list). Drop the `strands.heading` block key from `src/lib/blocks.ts` line 207 and from `COPY`; say so in the admin's block list.

Imagery: none. A journal with no posts has no pictures; four strand icons would be the AI tell.

Craft detail: the `h3` and the status sit on one baseline across the leader at every width, so the four rows read as a printed contents with the page number replaced by a status. When posts exist, each strand's status becomes a count and a link to the strand's list below.

### C. Published pieces (renders only when `posts.length > 0`)

Purpose: the list of pieces, newest first, which is the page once there is something to read. Position: **above** the strands once it exists (the strands become the index at the foot of the list), per the site plan: "When posts exist the list of posts is the page and the rules drop to the foot."

Layout: the existing row design in `Journal.tsx` is right in kind and stays: 1.5px rules, `lg:grid-cols-[10rem_minmax(0,1fr)_2rem]`, date and strand in mono 14.5px left, title in Calistoga `clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)`, excerpt `.t-body`, arrow right. Change the heading above it from the `.t-h2` "{n} pieces published, newest first." to a single mono 14px line "Newest first", because the count is already in the masthead's status rows and a 54px heading repeating a number is the stutter the client named.

### D. Colophon: the four standing rules

Purpose: the rules a reader can hold the company to, kept exactly (they are commitments listed in CONTENT-NEEDED for Conor to confirm), set small and at the foot, where a colophon goes.

Layout: 96px below the strands at 1440 (64px at 390), a 1.5px top rule. Two columns at 1440, `minmax(0,0.85fr) minmax(0,1.15fr)`, gap 80px.

Left column:
- `h2` in `.t-h3` (30px, not `.t-h2`; this is a foot matter heading, not a section claim): "How this journal is run".
- Under it, `.t-body` 17px, max 40ch: "A company that asks parents, educators and broadcasters to trust it should be willing to show its working. That is the whole of the reason this exists. It is not a content strategy and it is not written for a search engine. We would rather start late than start with filler." (Every sentence is from the current page; the heading becomes a paragraph, which is what it is.)
- Under it, "Four standing rules, written down before there is anything to apply them to. That is the only time it is worth writing them down." at `.t-body`, `muted`. These two sentences are the `rules.heading` block, so the admin key keeps working; rename its label in `blocks.ts` from "Headline" to "Paragraph".

Right column: a `dl` with 1.5px rules, four rows, padding 20px 0, **no leaders** (the colophon is ruled, not leadered; leaders are for the two contents objects only). `dt` in Hanken 17px semibold ink, max 16ch; `dd` `.t-body` 17px `body`, max 48ch. Rows side by side at 1440 (`grid-cols-[14rem_minmax(0,1fr)]`), stacked at 390. The four rules verbatim from `RULES` in `Journal.tsx`:
1. Written by people here. "Every piece carries the name of whoever wrote it. Nothing on this journal is generated and published automatically, which is the same rule the episodes are made under." followed on the same `dd` by the `TextLink` "How the work is made and reviewed" to `/ethical-ai`.
2. Corrections stay on the page. "If we get something wrong, the correction goes on the piece itself and says what changed. Nothing is quietly edited away."
3. Nothing here is sponsored. "No piece is paid for, and there is no advertising anywhere on this site."
4. Ask for a subject. "If something would be useful to you and it is not on the list, send it to us and it goes on the list." followed by `TextLink` "Tell us what to write about" to `/contact`.

Cut from here: the navy `deep` band (`Section deep`, `Journal.tsx` 224); the `.t-h2` claim heading; the two `Button`s (both become text links inside the rule they belong to; "The founder's story" goes, `/story` is not where a journal reader is sent); and **the `Correction` drawing**, with `Correction.tsx` and `corr.css` deleted. Reason: at 300px on a page whose rules are now set in 17px type it would be the largest object on the page, illustrating a correction that has never happened to a piece that does not exist. The rule it drew is sentence 2 above. The site plan allows one drawing per page; this page spends none.

### E. The notice (sign-up)

Purpose: "be told when the first piece goes up", the one action a reader with nothing to read can take.

Layout: under the colophon, 64px gap, a 1.5px top rule, one line `.t-body` 17px: "When the first piece goes up, we can send one email to say so. Nothing else, and no list you have to leave later." then `NotifyForm` (the existing component, 17px field, red button) with `cta` "Tell me when it goes up", `done` "Thanks. One email, when the first piece is published." Max-width 36rem, left aligned.

Build note: `NotifyForm` posts `route: "notify"`, which is PupsPlayer's launch list (`api/contact.ts`, migration `0004_enquiry_routes.sql` check constraint). A journal sign-up is a different promise, so give `NotifyForm` a `route` prop defaulting to `"notify"`, pass `"journal"` here, add `'journal'` to the check constraint in a new migration and to the API's accepted routes. The form ships only if Conor confirms he will send that one email (see section 8); until then this block is the single line "Ask for a subject" already in rule 4, and the page ends on the colophon.

This is the last thing on the page before the footer. No closing band, no closing line beyond it: the site plan says journal closes on nothing, and the footer closes every page.

### F. `/journal/:slug`, the reading page

Keep: `Seo` and the Article JSON-LD, the loading state, `Spread`, `MarginItem`, the sticky margin, `PostBody`, the 67ch measure (that is 38rem of Hanken at 18px), the edge-to-edge hero image with `hero_alt` as caption, the "More in {strand}" rows, the back link under the body.

Change:
- **Title size.** `h1` from `.t-display` to `.t-h1` (66px at 1440, 36px at 390, Calistoga). `.t-display` is home's; a piece's title at 88px with the standfirst at 21px was two scales apart.
- **Running head.** `BackRail` stays as the one thing above the title: left, `TextLink` "Notes from the studio" to `/journal` (arrow before it, as now, replacing "The journal"); right, the mono 14px "CLÉ Family Media" exactly as it is today (`JournalPost.tsx` 84 to 86), unchanged. The 1.5px rule under it stays, 48px gap, then the title. The title is the first thing at reading scale on the page.
- **Delete `Close()`** (`JournalPost.tsx` 275 onward): the navy band with the four-strands sentence and two buttons. The page ends on "More in {strand}" when there are siblings, otherwise on the existing "Back to the journal" link under the body. One line, one link.
- **Corrections inline.** No schema change: a correction is a paragraph in `body` that begins "Correction, {date}." and `PostBody` renders it like any paragraph. The rule in the colophon promises the correction stays on the piece and says what changed; a paragraph the author writes meets it. Do not build a corrections column or a drawn strike-through.
- **Missing state**: no `PageHero`. The running head, then `h1` "We couldn't find that piece" in `.t-h1`, `.t-body` "It may have been unpublished, or the link may be wrong.", two `TextLink`s ("Back to the journal", "Home"), then a 1.5px rule and the `Contents` component (the same four rows with leaders as the index, so the dead end shows the live contents). The hand-rolled `STRANDS` list in `Missing` is replaced by `Contents` with counts from `useJournal`, so it is one object in two places rather than two drawings of one list. This is the one place outside `/journal` and the shop docket where `.leader` renders, and it is the same component, not a second use.

## 5. Signature moment

The dotted leaders. "The Research ········ In preparation", four times, in Calistoga across the full measure, with each leader drawing itself from the name to the status as the row settles. It is the one physical trait a contents page has, it carries the page's honesty (the leader runs to a status, not a page number, and will one day run to a count), and it is type, which is what this page proves the company can be read in. Nobody else's children's media site has a printed contents page; a Sesame Workshop annual report does.

It is a signature now because no other subpage draws one: ethical-ai, legal, case-study and app open on ruled rows or on their object, and the only other leader on the site is the shop docket, which is a receipt, not a contents. A thumbnail row of the subpages shows one page with dots running across it, and it is this one.

## 6. Mobile (390)

- Masthead: title 36px two lines; status rows keep the leader on one line (the leader is the thing that survives; stacking `dt` over `dd` would lose it). "One piece a week, once we start" wraps right-aligned under its leader; row height grows to fit.
- Right column drops under the status rows: `.t-lead` 18px, then the 17px line. The rule and the first strand row sit at about 720px, inside the fold.
- Contents rows: `h3` 21px and status 13px mono on one line with the leader; "Parents Helping Parents" wraps to two lines, so the leader sits on the last line of the name (set the row as `display: grid; grid-template-columns: auto 1fr auto` with the name allowed to wrap and the leader aligned to `end`). Blurb under at 17px, full width.
- Colophon: one column; the heading, two paragraphs, then the four rules stacked (`dt` over `dd`, 20px padding, rules between).
- Sign-up: field and button stack (the component already does this below `sm`).
- Target page height at 390: about 2,600px, against 5,451px now. Nothing is hidden on mobile; it is the same content in the same order.

## 7. Motion

1. **Masthead settle.** One `Settle` wrapping the two masthead columns: 8px travel, 0.7s, `cubic-bezier(0.16,1,0.3,1)`, 60ms stagger over its direct children (title block, status `dl`, right column). Already how `Settle` works.
2. **Leaders draw.** `.leader` carries `transform: scaleX(0); transform-origin: left` inside an armed `Settle` and goes to `scaleX(1)` over 0.6s on the house ease, delayed `calc(var(--i) * 60ms + 200ms)` so the dots run after the row has landed. Applies to the status rows and the contents rows; the `Contents` list is its own `Settle` so the draw happens when the list enters, not on page load.

Reduced motion: `Settle` never arms, so `.is-armed` is absent and the leaders render at `scaleX(1)` with no transition. No JS, no IntersectionObserver, same result. No hover motion beyond the existing `link-draw` underline and the arrow colour on list rows.

## 8. Needed from client

- The four strand names confirmed (QUESTIONS #8); the working names ship and the admin can rename them.
- The four standing rules signed off, rules 2 to 4 especially (CONTENT-NEEDED Journal table).
- The cadence "One piece a week, once we start" confirmed (it is existing copy, `Journal.tsx` 20), or struck from the status rows.
- Whether Conor will send one email when the first piece goes up. Yes: the sign-up block ships with the `journal` route. No: the block is cut and rule 4's contact link is the page's only action.
- The first piece: title, strand, excerpt, body, date, author's name as they want it printed.
- `journal.default` 1200x675 for Open Graph on pieces without a hero (listed already; not used on the index).

## 9. Risks and guards

- **It slides back into a hero.** Someone puts the masthead on a panel, or sets the title in `--font-hero` with an accent word. Guard: the masthead is `h1` plus `dl` on bare paper inside the ordinary container; `PageHero` is not imported; `emphasis()` is removed from the title and `hero.title` in `COPY` loses its stars. Lint (cross-site rule 7): `grep -cE "PageHero|font-hero|<em|\bdeep\b" src/pages/Journal.tsx src/pages/JournalPost.tsx` must be 0 for both files.
- **The leader spreads.** The cross-site fault was five plans sharing one opening. Guard: `.leader` renders in exactly three objects on the site (journal status rows, `Contents` rows wherever `Contents` mounts, the shop docket). The other shards' lints grep their page files for `leader` and fail on a hit; this shard's lint asserts `.leader` is defined once in `index.css` with the owner comment.
- **The leaders read as a menu or a price list.** Guard: `dt` in mono uppercase, `dd` never a number with a currency, dots at `--color-rule` not accent, and leaders in exactly two objects on this page (status rows, contents rows). No leader on the colophon.
- **A periodical is invented.** "Issue", "volume", "edition" appear nowhere; the status row is "First piece". Guard: grep the two page files for `Issue` and fail on a hit.
- **"Coming soon" page.** A page that says "in preparation" five times is the fault the client named on the bench band. Guard: "In preparation" appears once in the masthead and once per strand row, and the rest of the page is specific: four descriptions, four rules, one link each. No "stay tuned", no countdown, no empty-state illustration.
- **The colophon grows back into a section.** Guard: its heading is `.t-h3`, its type is 17px, it has no ground colour, no buttons, no drawing. If anyone proposes a second drawing for the page, the answer is the one-drawing rule and this page spends it on nothing.
- **Type too small** (client verdict). Guard: nothing on either page under 17px except mono labels at 14px and the mono status at 13px to 14px; the leaders' dots at 2.2px. No `.t-sm` on this page.
- **Wrong face.** `.t-h1` and `.t-h3` resolve to Calistoga via `--font-display`; nothing on either page references `--font-hero` or Fraunces. Covered by the rule 7 grep.
- **The post page reintroduces a closing band.** Guard: `Close()` is deleted, not emptied; the page's last element is the siblings list or the back link.
- **The missing state becomes a second contents design.** Guard: it mounts `Contents`, the same component as the index.

---

## media

# /media: the press kit (revised after the creative director's verdict)

Sources read: `src/pages/Media.tsx` (every fact, link and load state), `src/lib/site.ts`, `src/lib/brand.ts` (slate alt at line 339), `src/lib/episodes.ts` (lines 9 to 18 and 66, the Cuckoo note), `src/components/team/people.ts`, `src/pages/Legal.tsx` (COMPANY), `src/pages/Contact.tsx` (readers list, line 179), `src/components/shop/Docket.tsx`, `src/components/render/StudioWall.tsx`, `src/components/Settle.tsx`, `src/components/icons.tsx` (no copy glyph; `IconCheck` and `IconDownload` exist), `src/styles/index.css`, CONTENT-NEEDED.md (press rows, the pulled imagery claim), QUESTIONS.md #17 and #21. Captures: `after-1440/media.png` (6,088px), `after-390/media.png` (7,621px), `before-1440/media.png`. Asset sizes measured with PIL. Page 1 of `drive/Episode 01/Paula_s activities-01.pdf` rendered to confirm the Made in Ireland badge.

Changes from the first plan, in response to the verdict: (1) the People row lists names and roles only, no portraits for download, until the client confirms consent; (2) the film caption is "The mission film." and names no speaker; (3) "FACTS CHECKED · VERSION 1" becomes "Sheet updated 27 October 2026", no version; (4) the group numerals go, groups are mono labels alone; (5) the Cuckoo title discrepancy is logged as needed from client and the sheet carries one title with a note until then. Cross-site rules applied: unleadered `dl` rows; the list opens the page; no `font-hero`, no `<em>`, no pill pair, no scrimmed frame, no navy band, no `PageHero`.

## 1. Job

A journalist or a producer with a deadline, occasionally an investor's analyst doing a background check. They are not here to be persuaded; the home page did that or it did not. They need, in under two minutes: the company's correct name and registration, the founder's name and title, the series name with its marks, what has been released, a file they can print or embed, and a route to a person who will answer. They must leave with the facts copied, the art downloaded and the contact found, and with no doubt about what each image is.

## 2. Page kind and the idea

The page is the press sheet itself: one typeset listing on paper, in five labelled groups (Facts, Spellings, Art, Appearances, Press route), that a journalist reads top to bottom and copies from, with the art listed as a contact sheet inside it rather than displayed as a gallery. Nothing on the page is a claim; every line is a fact already published elsewhere on the site, with the pixel size printed on every file so nobody has to open one to find out.

It is a list, not a document: no numbered margin, no contents rail, no version. The two documents (`/ethical-ai`, `/privacy`) own numbering; this page owns the contact sheet and the one control a web page can give a press sheet that paper cannot, "Copy the facts".

It is not the home hero because it has no picture behind its title, no headline sentence, no pills and no scrim. The first thing on the page is the company's name set as a title, and the first screen is already the facts a reader came for. Show frames appear only inside the download list, small, with a caption saying what they are.

## 3. Opening

**At 1440.** The 1560 shell, left-aligned measure. Two columns, `lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]`, gap 96px, starting 72px under the header. No image.

Left column (sticky at `top-28`):
- Eyebrow, `.eyebrow .eyebrow-sm` (mono 14px, uppercase, 0.14em, red-deep): **PRESS KIT**
- Title, `.t-h1` (Calistoga, 66px at 1440, line-height 1.02): **CLÉ Family Media**. The company name is the title. Not a sentence, not a claim, no `<em>`, never `--font-hero`.
- Under it, mono 13px uppercase, muted: **SHEET UPDATED 27 OCTOBER 2026**. The date is a constant `UPDATED` in the source, like `DRAFTED` in `Legal.tsx`; it changes when a line on the sheet does, never `new Date()`. No version. It is labelled as what it is, the day the sheet's wording last changed, not a company attestation.
- One paragraph, 17px, line-height 1.65, max 44ch, body colour: *For anyone writing about the company or the series. Everything on this sheet is already published on this site, so a quote can be checked against the page it points to. Larger files and anything not here come through the press route.*
- Two `TextLink`s on one row, 15px semibold red-deep with the growing underline: **Press enquiries →** (`/contact`) and **The show's own site ↗** (`SITE.showUrl`). Links, not buttons. No pill pair.

Right column: the sheet begins immediately with the **FACTS** group (section 4.1). At 1440 the first screen shows the title block and the first seven fact rows. The list is the opening.

**At 390.** One column, 16px gutter. Eyebrow, title at 36px (the clamp floor), the updated line, the paragraph, the two links stacked on two lines. Then **FACTS** with its first three rows (Company, Registered, Founder) inside the first 844px. No sticky column. No panel, no frame, no image above the first row of fact.

**What moves.** `Settle` once: the left block settles, then the sheet rows stagger at 60ms. That is all.

## 4. Section by section

The whole page is one surface, `--color-paper-2` with the existing paper gradient, from the header to the footer. No bench, no grove, no navy, no wall. Groups are separated by a 1.5px `border-rule` and a group heading row: a mono 14px uppercase label at the left (**FACTS**, **SPELLINGS AND MARKS**, **ART FOR DOWNLOAD**, **APPEARANCES**, **PRESS ROUTE**), muted, 0.14em, with 28px above and 20px below. No numerals. Inside a group, each row is a `dt`/`dd` pair: `dt` mono 14px uppercase 0.1em muted in a `11rem` column, `dd` 17px line-height 1.6 ink, 1.5px `border-rule-soft` between rows, 16px padding. Plain ruled rows, no dotted leaders (the leader belongs to `/journal` and the shop docket). This is the existing press-sheet `dl` in `Media.tsx`, taken off the card and set at the page's own size.

### 4.1 Facts

Purpose: the lines a journalist copies. Every value is already on the site.

| dt | dd |
|---|---|
| Company | CLÉ Family Media, an Irish children's media company. Watch, Play, Learn. |
| Registered | CLE Family Media 25 Limited, registered in Ireland, company number 820427. Registered office: Curraghs, Liscarroll, Mallow, Co. Cork, P51 K2T9. |
| Founder | Conor Sexton, Founder and CEO. |
| Series | The Pawsitive Pugs & Pals®, an animated series for children aged three to five. |
| Characters | Finn, the fawn pug. Fia, the black pug. |
| Episodes | Series one. Four released and free to watch: The Feather (9:16), The Strawberry (11:10), Chicken Vision (10:41), The Cuckoo (9:58). Two further titles, Colour Quest and Fluffy Clouds, not yet released. |
| Where to watch | The show's own site, pawsitivepugs.com. |
| Player | PupsPlayer™, in development, not released. (reads `useSetting("app")`; becomes "Released." when `launched`) |
| Imagery | The series is animated. How imagery and voice are produced, and which tools are used where, is set out on the Responsible AI page. |

The Episodes row uses the titles in `episodes.ts`, which the client set ("The Cuckoo"); the video it links to is still titled "The Cuckoo's Incredible Journey" (see 4.2 and section 8).

The Imagery row is the honest form of the row that was pulled on 2026-10-08: it makes no claim either way and points at the page that names the tools. The client's own wording for provenance (CONTENT-NEEDED, "The AI imagery claim") replaces it when it arrives.

Each value with a page behind it carries a trailing `TextLink` at 15px: Founder → `/story`, Series and Episodes → the show site, Player → `/app`, Imagery → `/ethical-ai`, Registered → `/privacy`. This absorbs the former "Four subjects" band: the links to the positions sit on the facts they belong to, not in a second list.

**Copy the facts.** A control at the foot of the group in `TextLink` style, text only (there is no copy glyph in `icons.tsx`; none is drawn for it), that writes the group to the clipboard as plain `Key: value` lines, one per row, with the trade marks and the É as real characters. Label swaps to **Copied** with `IconCheck` for 1.5 seconds, `aria-live="polite"`. If `navigator.clipboard` is unavailable the control is not rendered. It is the one thing on the page a journalist does with a press sheet that a web page can do better than paper.

### 4.2 Spellings and marks

Purpose: the mistakes the company does not want in print.

| dt | dd |
|---|---|
| The company | CLÉ Family Media, with the É, is the trading name. The registered company is CLE Family Media 25 Limited, without it. |
| The series | The Pawsitive Pugs & Pals®, with the ampersand and the registered mark on first use. |
| The player | PupsPlayer™, one word, capital P twice, with the trade mark on first use. |
| The founder | Conor Sexton. Founder and CEO. |
| The dogs | Finn and Fia. Finn is the fawn pug, Fia the black pug. |
| Episode four | The Cuckoo. The video carries the longer title The Cuckoo's Incredible Journey. (set as a row only once the client confirms which the press should print; until then the row reads **TO BE CONFIRMED** in mono after "The Cuckoo", the same treatment as the podcast row) |

The glyphs ®, ™ and É are set as real characters in the `dd` and described in words beside them, so a reader on a system that drops the mark still gets it right. The `slate.ep4` alt in `brand.ts` is not changed by this page; the discrepancy is logged in section 8.

### 4.3 Art for download

Purpose: the thing a press page exists to hand over, and the only place on this page a show frame appears.

Intro line, 17px body, max 62ch: *Every file is at the resolution this site uses, which is web resolution, and its size is printed so nobody has to open it to find out. Each caption says what the file is. Larger files on request through the press route.*

Layout: a contact sheet. Rows by sub-group; each row has a mono 14px label in the `11rem` dt column (**Marks**, **Title slates**, **Frames**, **The film**) and a flush grid of thumbnails in the dd column, six per row at 1440 (about 136px each), 12px gap, no cards, no radius, no shadow. Each item is an `<a download>` to the file, wrapping: the thumbnail at its real aspect on a 1.5px `border-rule` box; under it two mono 13px lines, the first the file title, the second `1280 × 720 · JPG · 160 KB`. Sizes and byte counts come from a static manifest `src/lib/press.ts` written at build time, never guessed in JSX. The caption text is the asset's `alt` from `brand.ts` shortened to one line, except where noted.

Contents and paths (all under `public/brand/`):
- **Marks**: `cle-mark@2x.png` (1182 × 1183, transparent PNG, *The CLÉ Family Media mark, felted lettering*); `show-wordmark.svg` (*The Pawsitive Pugs & Pals wordmark, single colour SVG*); `pupsplayer.svg` (*The PupsPlayer mark*); `show-logo@2x.jpg` (1600 × 900, *The show logo, felted lettering on its ground*).
- **Title slates**: `slate-ep1@2x.jpg` to `slate-ep6@2x.jpg` (1280 × 720 each), captioned from `EPISODES` (`title`, not the `brand.ts` alt): *Episode 001, The Feather* and so on, so slate four reads *Episode 004, The Cuckoo*; 005 and 006 carry the `COMING_SOON` words after the title in the same mono.
- **Frames**: `show-meadow@2x.jpg` (3200 × 1600), `show-snail@2x.jpg` (3200 × 1600), `story-garden@2x.jpg` (2400 × 1600). Caption on each: *A frame from The Pawsitive Pugs & Pals, series one.* These are content with a caption, not grounds.
- **The film**: `public/video/mission-1440.mp4` with `mission-poster.jpg` as its thumbnail, captioned *The mission film.* Nothing more: the repo does not record who speaks in it. Dimensions and duration read with ffprobe into the manifest.

**People** is a row in this group but not a thumbnail row. It is a plain `dt`/`dd` row: dt **People**, dd the eight names and roles from `people.ts` with Conor first, one per line, 17px name and mono 13px role, followed by one line in body: *Portraits are available through the press route.* No portraits are offered for download and none are shown, because the site has not been told the sitters consent to editorial reuse. When the client confirms consent (section 8), the row becomes a thumbnail row like the others: `people/<name>@2x.jpg` (880 × 880), captioned name, role, then the word *Photograph*, 136px at 1440 and 110px at 390. Mansi has no portrait and is not listed in either form. Faces stay on three pages (`/team`, `/story`, `/contact`) until then.

Cut: `StudioWall` (1,900px bench of posed slates) and its heading *Every title is made in wool and photographed, not set in a typeface.* The bench is the show site's object, and the heading is a provenance claim the repository cannot stand behind (`brand.ts` records the slates as rendered artwork from the kit). Also cut: *Ask and we will send them at print resolution.* No print-resolution file exists on this machine; the largest is 3200px. The sizes printed on each file replace the promise.

### 4.4 Appearances

Purpose: the index, with its load state kept exactly as built, since a failed load must never read as "nothing has run".

Layout: rows in the same `dl` form; dt is the date, dd is the entry: outlet, title in 17px semibold ink, one line of description in body, and a status word in mono 14px uppercase at the right (`Booked`, `Expected`, `Published`). The links list under the rows (`Open <title> ↗`) stays as built. The status line (`2 entries`, `Nothing published yet`, `The index could not be loaded`, `Loading the index`) sits as the group's first line in mono 13px, `role="status"`, not at the page top.

Standing rows while `media_items` is empty, taken from `standingFor(launched)`:
- **December** · A UK podcast appearance · *Booked. Show, episode and link to follow.* · BOOKED. The three missing fields are set as a second mono line, muted: `SHOW · DATE · LINK: TO BE CONFIRMED`. The missing fields are visibly missing; they are not a headline.
- **To be confirmed** · More around the PupsPlayer™ launch · *Further appearances are expected as PupsPlayer™ launches.* (or the launched variant) · EXPECTED.

The `failed` and `empty` explanatory paragraphs stay, word for word, under the rows.

Cut: the hero headline *A UK podcast appearance is booked for December* and the `hero.title_listing` variant. One booking with no show, date or link is a row, not the page's first sentence.

### 4.5 Press route

Purpose: a person.

Two rows: **Enquiries** · *Interview requests, artwork and anything you need checked before you file go through the press route on the contact page. It reaches the team directly.* with `TextLink` **Press enquiries →** (`/contact?route=press`, matching the preselect wiring in the contact plan); **Who reads it** · the five names and roles from `/contact`'s readers list (`Contact.tsx` 179, the first five with a portrait), as one line each in 17px name and mono 13px role, no portraits.

Closing: the word **ENDS** in mono 14.5px uppercase 0.2em muted, as the sheet already has, on a 1.5px rule, 40px above the footer. One line, one link, no navy band. The footer is the closing.

Cut: the deep navy band *Writing about children's media?* with its primary button, and `PageHero`.

### Admin blocks

`COPY` keys kept so saved rows survive: `notes.heading` (now unused as a heading but harmless), `index.heading`, `press.lead`. Keys removed with the sections they named: `hero.eyebrow`, `hero.eyebrow_sub`, `hero.aside`, `hero.title_booked`, `hero.title_listing`, `stills.heading`, `subjects.heading`, `press.heading`. New editable keys: `kit.intro` (the title-block paragraph), `art.intro`, `people.note` (*Portraits are available through the press route.*). Update the registry in `src/lib/blocks.ts` and the `hero.image` image block comes off. `useBlock` calls stay in one fixed order. `Seo` title becomes **Press kit**, description *Facts, spellings, art for download and the press route for anyone writing about CLÉ Family Media or The Pawsitive Pugs & Pals.* `FOOTER_GROUPS` label changes from "Press" to "Press kit"; route unchanged.

## 5. Signature moment

The contact sheet. Sixteen files (four marks, six slates, three frames, the film, and the people row as names until consent arrives) in a flush grid under mono labels, each with its pixel size, format and weight printed under it and a caption that says plainly what it is, closed by ENDS. Nobody puts the file sizes on a press page; a journalist notices, and it is the one honest listing of the show's art anywhere, which is the trust argument made as a file index rather than a speech. "Copy the facts" is its companion: the sheet is built to be taken away.

## 6. Mobile (390)

- The sticky left column becomes the top of the page; the sheet follows directly, no gap band.
- `dt` stacks above `dd` (the existing `sm:` breakpoint), dt 13px, dd 17px, 14px row padding.
- Contact sheet: three thumbnails per row (about 110px), 10px gap; the sub-group label moves from the left column to a full-width row above its grid.
- Captions keep both lines; the size line truncates to `1280 × 720 · JPG` and drops the weight at 390.
- **Copy the facts** sits full width under the facts group, 48px tall tap target.
- Appearances: date, entry and status stack in that order; the status word stays mono at the start of its own line, not floated right.
- The People row and the press-route readers list wrap name and role onto two lines where a role is long.
- Target length at 390: about 3,400px including the footer, down from 7,621.

## 7. Motion

1. `Settle` on entry: the title block, then the sheet rows at 60ms stagger, 8px travel, 0.7s, `--ease-out` (0.16, 1, 0.3, 1). The existing component; nothing added.
2. Contact-sheet thumbnails: on hover or focus the border goes from `rule-soft` to `rule` and the item lifts 2px with a 0.35s transition on the same easing. No scale, no shadow.

`prefers-reduced-motion`: Settle renders finished content (as it already does); the lift is removed and only the border change remains. Copy-the-facts label swap is instant in both modes.

## 8. Needed from the client

- The December podcast: show name, episode title, air date, link.
- A press email address and a named spokesperson (the route falls back to `/contact` until then).
- The imagery provenance wording for the Imagery row (CONTENT-NEEDED, "The AI imagery claim").
- Which title the press should print for episode four: "The Cuckoo" (`episodes.ts`, on the client's instruction) or "The Cuckoo's Incredible Journey" (the video and the `slate.ep4` alt in `brand.ts`). The sheet carries one with a TO BE CONFIRMED mark until answered; the alt is then corrected to match.
- Written consent from each of the eight sitters that their portrait may be offered for editorial download; until then the People row is names only.
- Who speaks in the mission film, if the caption is to name them.
- Print-resolution originals of the six slates, the show logo and the CLÉ mark from the kit on Alan's Mac, if larger files are to be offered as downloads rather than on request.
- The Made in Ireland felted badge as a transparent PNG at 1200px or more, to sit in the Marks row (it exists only on page 1 of each `Paula_s activities-0N.pdf`).
- A vector CLÉ Family Media wordmark (QUESTIONS #21).
- Answer to QUESTIONS #17 (does a press kit exist elsewhere).

## 9. Risks and guards

- **The title block becomes a hero.** The moment a sentence replaces the company name, or the two links become pills, or an image sits behind it, it is the formula. Guard: `h1` is `SITE.name` in `.t-h1` (Calistoga), actions are `TextLink` only, the grid has no background and no image slot. The shard grep for `font-hero`, `<em`, `PageHero` and `.deep` must return nothing.
- **The list becomes a document.** Numbered margins, a contents rail or a version line make this the fourth numbered document on the site. Guard: group headings are mono labels with no numeral; the only date is `UPDATED`, labelled "Sheet updated"; no "Version", no "Facts checked".
- **Status rows grow leaders.** Guard: the `dl` uses `border-rule-soft` between rows and nothing between `dt` and `dd`; the leader class is not imported on this page.
- **Faces creep back.** Guard: the People row renders from `people.ts` as text until a `PRESS_PORTRAITS` constant in `press.ts` is set true by hand after consent; no `people/*` path appears in the manifest before then.
- **A caption asserts what the repo does not know.** Guard: every caption is either the `brand.ts` alt shortened, the `EPISODES` title, or a plain noun ("The mission film."); no caption names a speaker, an author or a production method.
- **The contact sheet becomes a media-kit tile grid.** Rounded cards with drop shadows and a hover zoom are the generic version. Guard: zero radius, 1.5px rule borders, flush grid, mono captions, 2px lift at most, no `rounded-*` or `shadow-*` classes anywhere in the group.
- **The sheet reads as a card on a bench again.** Guard: no `rk-corr__sheet`, no `.bench`; the `dl` sits on the page paper at full column width.
- **The page grows back.** Each new appearance is one row; a logo strip or "as featured in" is never added until three pieces have run, and even then it is rows.
- **Type creeps small.** Floors: 17px body in `dd`, 13px mono captions, 1.5px rules in `--color-rule`. The lines sweep (`lines.mjs`) runs before the page ships.
- **A claim slips into a fact row.** Every `dd` must be traceable to a page on this site or a client-supplied fact; anything else is marked TO BE CONFIRMED in mono, as the podcast and Cuckoo rows are.


---

## shop

# /shop, /shop/:slug, /download/:token: the catalogue (revised)

Plan only. Verdict was REVISE; the four items and the cross-site rules are applied below and listed first so the builder can check them off.

**Revisions applied**
1. Every price string on these pages comes from `formatPrice(p.price_cents, p.currency)` (which already prints `€4.99`-style on the Buy button, `ShopProduct.tsx` 327). "EUR" appears nowhere. No drafted sentence in this plan contains a price figure; the builder has nothing to hard-code.
2. The catalogue facts are one shared table (below, "The shared numbers"), and `/app` prints the same sentence: "three books per episode; for episodes one to four the activity book comes in colour and in black and white". Shelf tags count books, the product page lists files.
3. The away-from-the-screen sample page is captioned "Activities away from the screen, page two", no author, until the client names one.
4. Cross-site rules: the shelf is the opening object at both widths (rule 2), so the `.t-lead` moves under the shelf as the catalogue's credit line; the only dotted leaders on these pages are the docket's (rule 1), which the receipt and product page keep; no numerals in margins (rule 3); no faces (rule 4); no dates or versions anywhere on the three pages (rule 5); `.t-h1` is Calistoga (`--font-display`, `index.css` 202) and nothing on the shard references `font-hero`, `<em`, `PageHero` or `.deep` (rule 7); no em or en dash in any drafted line (rule 8).

Read: `src/pages/Shop.tsx`, `ShopProduct.tsx`, `Download.tsx`, `src/components/shop/*` (Docket, NotAsked, PrintedSheet, Shelf, catalogue.ts, copy.ts, buy.css), `src/components/admin/shop/ProductEdit.tsx`, `src/lib/episodes.ts`, `site.ts`, `brand.ts`, `types.ts`, `index.css` tokens; CLAUDE.md, HANDOVER.md s7-8, CONTENT-NEEDED "Shop", QUESTIONS #26. Looked at `fanout/after-1440/shop.png` (4,437px), `after-390/shop.png` (6,634px), `before-1440/shop.png`, `after-1440/shop-product.png`, the six pack zips and covers in `scratchpad/packs`, the Drive PDFs (`pdfinfo` counts below), the rendered covers and sample pages.

**The shared numbers (the one truth; `/app` prints the same):**

| Episode | Pack zip (`scratchpad/packs`) | Books | Files in the folder | Pages |
|---|---|---|---|---|
| 1 The Feather | `episode-01-the-feather-pack.zip` | 3 | Activity book (colour), Activity book (black and white), Colouring book, Activities away from the screen | 20 / 20 / 20 / 10 |
| 2 The Strawberry | `episode-02-the-strawberry-pack.zip` | 3 | same four | 20 / 20 / 20 / 13 |
| 3 Chicken Vision | `episode-03-chicken-vision-pack.zip` | 3 | same four | 20 / 20 / 20 / 17 |
| 4 The Cuckoo | `episode-04-the-cuckoo-pack.zip` | 3 | same four | 20 / 20 / 20 / 13 |
| 5 Colour Quest | `episode-05-colour-quest-pack.zip` | 3 | Activity book (black and white), Colouring book, Activities away from the screen | 21 / 20 / 13 |
| 6 Fluffy Clouds | `episode-06-fluffy-clouds-pack.zip` | 3 | as 5 | 20 / 20 / 11 |

Three books per episode, eighteen books, 318 pages counting each activity book once, 22 PDFs. All A4; activity and colouring books landscape (841 x 595 pt), the away-from-the-screen booklet portrait. Every cover is printed "Designed & Illustrated by Victoria Buchkova". Page 1 of every away-from-the-screen booklet carries the felted "CLÉ Family Media, Made in Ireland" badge, the key vocabulary list and an adult-supervision note; no author is named in it. Format: zip of PDFs (`fileFormat` already reads it). Price: `products.price_cents` per row. No seed exists in the repo, so the repo knows no price; the admin sets it (s8) and every page reads it.

---

## 1. Job

A parent or a teacher with a printer, sent here from the show site, from `/app`, or from a search for the show's name plus "activities". A broadcaster or investor passing through on the way round the About pages, checking that "Play" and "Learn" are real things and not a slide. They must leave able to see the six packs, know what is in one (three books, which episode, how many pages), see the price on the item and know that buying costs nothing else (no account, no list, a card and a 24-hour link), and be able to buy one in two taps from this page. The second audience leaves with one fact: the product exists, is drawn by a named illustrator, and is on sale.

## 2. Page kind and the idea

**A catalogue.** The page is a shelf of six real covers at their true A4 landscape proportion, one pack per episode in episode order, each with its title and price under it, and nothing on the page is bigger than the covers. The product is the page; the words are labels.

It is not the home hero because nothing is framed, scrimmed, cornered or claimed: there is no panel, no Fraunces line, no pink `<em>`, no pill pair, no picture behind type. The title is a shelf label ("Episode packs", `.t-h1`, Calistoga, a noun), the first content is the shelf itself above the fold at both widths, and the one dark surface on the page is the shelf the covers stand on, not scenery between paragraphs.

## 3. Opening

The page opens on the shelf (cross-site rule 2). The title block is three short lines and the first row of covers sits inside the first screen at both widths.

### 1440

Paper (`paper-2`, the body ground). `Container width="wide"`, left-aligned measure as fixed 2026-10-24.

- Row 1, mono 14px uppercase tracked 0.12em, `text-body`: `Shop` on the left. On the right of the same row, when the client supplies it, the felted "Made in Ireland" badge at 96px tall, no caption (s8; until supplied, nothing sits there, no placeholder block in an opening).
- Row 2, 24px below: `<h1 class="t-h1">Episode packs</h1>` (Calistoga, 66px at 1440). Not a claim. A shelf label.
- Row 3, 14px below, mono 14px `tnum`, `text-body`: the catalogue status from `useProducts`: `{n} packs · {price} each · zip of PDFs` when ready, where `n` is `data.length` and `price` is `formatPrice` of the rows' shared `price_cents`; when rows differ, the segment reads `from {formatPrice(min)}`; `Loading the shelf` while loading; `Could not load the shelf` on failure. Never a literal count or figure.
- The shelf band begins at about 300px from the top of the viewport, so the first row of three covers (each about 430 x 304px) and their tags are fully in the first screen at 1440 x 900.

No lead paragraph above the shelf: the sentence that was the lead becomes the catalogue's credit line under the shelf (s4.2), which is where a catalogue prints its illustrator. No image above the shelf. No buttons in the opening: the two links the old panel carried ("Interactive activities in PupsPlayer", "Free activities on the show's site") move to the closing line (s4.5), because a buyer's first action here is a cover, not a link away.

### 390

Same order, `px-5`. `Shop` mono 13px; h1 at `.t-h1` floor (36px), one line; status line wraps to two (`{n} packs` / `{price} each · zip of PDFs`). The shelf band starts at about 260px and the first cover, full column width (350 x 247px), is entirely inside the first 844px with its two-line tag and most of the second cover. First real content above the fold, which the current page (black panel, two pills, first product never) does not do.

### What moves

The shelf band is one `Settle`: the six covers settle 8px upward with the existing 60ms stagger as the band enters, tags with them. The title block above does not animate (it is in view at load; animating it delays the content).

## 4. Section by section

### 4.1 The shelf (the page)

**Purpose.** Show the six packs as objects and take the reader to one.

**Surface.** One band, `Section className="bench"`, `pad="normal"`. The bench is the house dark warm surface (`#64523c`); it is used once on this page, as the shelf, so the covers (cream and tan) read as printed things on a surface rather than tan rectangles on tan paper. No `rk-studio` room chrome: drop `rk-head` ("Downloads / One file each" is now false), `rk-rake`, the lamp azimuth poses. Keep `Stage seated` for the contact shadow only, with `tilt 0`, `turn 0`, `roll 0`, `depth 0.35`, `radius "2px"`: a flat print lying on a shelf, not six slabs leaning at six angles.

**Layout.** `ul` grid, three columns at ≥1100, gap 40px horizontal, 56px vertical; two columns 900-1100; one column below 900. Each `li` is a `Link to=/shop/:slug` wrapping the cover and the tag. Covers are `aspect-[1.414/1]` (A4 landscape), `object-cover`, width 100% of the column: at 1440 wide-container that is about 430px wide, so every cover is identical in size and proportion, which is what makes six separate covers read as one series. Episode order from `sort_order` (admin sets 1 to 6).

**Tag** under each cover, 14px gap, cream on bench (already set by `.bench`): line 1 Hanken 17px semibold, the product title from the row (`p.title`; the admin hint already suggests "The Feather: episode pack"); line 2 mono 14px `tnum`, `{formatPrice(p.price_cents, p.currency)} · 3 books`, where the book count is the line count of the description's first paragraph (s4.3 convention: one line per book), falling back to `zip of PDFs` when it cannot be counted. Nothing else on the tag. No "Buy" button on the shelf: the item is the link.

**Imagery.** `products.thumbnail` from the database, exactly as `Shelf.tsx` reads it now. For the six rows the admin uploads these, rendered by the builder from the Drive and committed nowhere else:
- `drive/Episode 0N/covers-0N/Cover-1_activity-0N.pdf` → `pdftoppm -r 200` → WebP and AVIF at 1200 and 2400 wide, uploaded as the row's cover via the admin "Cover picture" field (bucket `public-media/products`). `scratchpad/packs/episode-0N-cover.png` is the same artwork at 1287 x 910 and is acceptable for 1x only.
- Cover-1 (flat tan ground), never Cover-2: Cover-2 puts the illustration on a photographic garden render, which is pipeline output and falls under the site's no-AI-imagery rule and the provenance caveat in the site system. Cover-1 is flat illustration with the credit printed on it.
- `thumbnail_alt` per row: "The cover of the Episode 1 activity book, The Feather: Finn and Fia looking over the title, drawn by Victoria Buchkova."

**Empty, loading, failed.** Loading: the band renders with six empty `aspect-[1.414/1]` slots in `paper-3` at 40% and no text, for at most the request. Failed: no band; under the status line, `.t-lead` "That is a fault at our end, not a statement about what is on sale." and the existing reload sentence (kept word for word). Empty (every row inactive): no band; one `.t-lead` line "Nothing is on sale at the moment." and the closing line. The `KINDS` ruled set (colouring books / puzzle packs / activity sheets) is cut: products now exist and two of its three kinds are not what is sold.

**Craft detail.** The six covers are the only things on the page at one fixed size and one fixed proportion, and that proportion is the real A4 of the file the buyer prints. Nothing is cropped to a card ratio; the episode number, title and motif Victoria drew into each cover (feather, strawberry, hen, nest, rainbow, clouds) do the differentiating, so the tag needs no thumbnail icon, no badge and no chip.

### 4.2 Under the shelf: the credit line and the footnote strip

**Purpose.** Print the catalogue's one descriptive sentence and its illustrator where a catalogue prints them, under the shelf; then carry every fact the five `REFUSALS` rows and the `/shop` docket carried, in the space of a footnote, because terms belong under a shelf and not in a 1,900px argument.

**Credit line.** Paper, `pad={["normal","tight"]}`, `Container width="wide"`. `.t-lead` (21px at 1440, 18px at 390), `max-w-[58ch]`, `text-ink`:

"One pack for each episode of *The Pawsitive Pugs &amp; Pals®*: three books, an activity book, a colouring book and a booklet of activities away from the screen, as PDFs to print at home or in a classroom. For episodes one to four the activity book comes in colour and in black and white. Designed and illustrated by Victoria Buchkova."

(The italic on the show title is the house title style, not a pink `<em>`; it is `<i>` or `.title`, never the hero `em` rule. The episode count and the price are not written; the shelf and the status line show them.)

**Footnote strip.** Paper, `pad={["tight","normal"]}`, `Container width="wide"`. One ruled line (1.5px `border-rule` top and bottom, 28px padding) in `.t-body` 17px `text-ink`:

"No account, no email gate, no mailing list. One card payment, through Stripe, and a download link that works for 24 hours and five downloads. Save the file when it arrives."

Under it, the house disclosure (`DisclosurePanel`, `grid-rows 0fr→1fr`), trigger a `TextLink`-styled button: "Every line here is a thing the code does or does not do" with the chevron. Open, it renders the five `REFUSALS` rows exactly as they are now (title, body, the file path as the right-aligned mono 13px credit), as a `dl` with plain 1.5px rules and no leaders (the leader belongs to the docket). Nothing in the array changes; the line about keeping the Stripe address to find an order survives in full. `aria-expanded` toggled; closed by default; without JS the panel renders open, which is the existing component behaviour.

**Cut and why.** `NotAsked` (the crossed-out checkout) is cut: 900px drawing a policy, the one component on the page that is about the shop instead of being the shop. The `refuse.heading` claim ("A card payment, and nothing else.") is cut as a heading and survives as the strip's first sentence. The `/shop` docket ("What a purchase is") is cut from this page and appears once, on the product page, where the purchase is; "Right to cancel ends on download" moves there with it and is still met before the button (the product page states it above the tickbox).

### 4.3 /shop/:slug, the product page

**Purpose.** Decide and buy. Everything about one pack on one screen; the proof that it is real (sample pages) under it; the terms once.

**Opening, 1440.** Breadcrumb as now (`Shop / The Feather: episode pack`, mono 14.5px). Then a grid `lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`, gap 80px; the cover is the opening object:

- Left, sticky: the cover, `aspect-[1.414/1]`, on `Stage seated` with the flat pose above, over a `paper-3` ledge; no `PrintedSheet` specimen, no staple, no punch holes, no callouts (`SheetBench` and the drawn blank book are retired from this page: there is a real cover for every row; where a future row has no thumbnail, render the `paper-3` slot with the existing "No artwork has been uploaded for this file yet." credit line). Caption under it, mono 13px right-aligned: "Cover of the activity book. Designed and illustrated by Victoria Buchkova."
- Right: `h1.t-h1` the title (Calistoga); the price in `font-display` as now (`clamp(1.75rem…2.25rem)`, `tnum`, from `formatPrice`); then **"In the folder"** as a ruled list: the first paragraph of `description` is split on single newlines and, when it has two or more lines, rendered as a `ul` with plain 1.5px rules, 17px, each line as written. Remaining paragraphs render as `.t-prose` as now. The builder writes the six descriptions in the admin, from the shared table, one line per book (episode 1):

    ```
    Activity book, 20 pages, in colour and in black and white
    Colouring book, 20 pages
    Activities away from the screen, 10 pages

    Four A4 PDFs in one folder, for Episode 1, The Feather. Print as many copies as you need at home or in a classroom.
    ```
    Episodes 2 to 4 follow the same form with their own page counts. Episodes 5 and 6 read "Activity book, 21 pages, black and white" (5) and "Activity book, 20 pages, black and white" (6), and their second paragraph says "Three A4 PDFs". The `3 books` on the shelf tag is the line count of this first paragraph; the PDF count lives in the second paragraph only, so the two pages never disagree.
- Then the acknowledgement tickbox (`buy.css`, unchanged), the Buy button (`Buy for {formatPrice(...)}`, the existing string), the Stripe/no-account sentence, the error line, the cancelled-checkout notice: all kept word for word.

**Sample pages band.** Paper, `pad="normal"`. Heading `.t-h2` "Three pages from the pack" (a description, not a claim). A row of three real pages at the file's own ratio, 1.5px `border-rule`, on `paper-1`, each with a mono 13px caption:
1. `drive/Episode 01/01-png/Activities-png-01/01-Connect the dots-2.png` → "Activity book, page: Connect the dots"
2. `drive/Episode 01/01-png/colouring-png-01/01- 1.png` → "Colouring book, page 1"
3. `Paula_s activities-01.pdf` page 2, rendered → "Activities away from the screen, page two" (portrait, so it sits at the same height as the other two, narrower; no author, and no activity name lifted from the page until the client confirms the booklet's author and that its titles may be quoted)

Rendered to `public/shop/<slug>/page-1.webp` etc at 1200 wide, mapped in a small `src/components/shop/samples.ts` keyed by product slug; a slug with no entry renders no band. For episodes 2 to 6: the first activity page, the first colouring page, page 2 of the away-from-the-screen booklet, same caption forms. Credit line under the row, 13px mono: "Activity and colouring pages designed and illustrated by Victoria Buchkova." The booklet is credited to nobody until the client names its author (s8). `/app` uses the same caption form for the same page.

**The terms, once.** `Section className="wall" pad="tight"` as now, but the `.t-h2` claim ("A zip of PDFs, delivered straight away.") becomes the docket's own label row: left column holds only the kept sentence about free activities on the show site and PupsPlayer, 17px, and the `TextLink` "Everything else on the shelf". Right: `Docket label="What a purchase is"` with `terms(format)` unchanged and its dotted leaders kept (the docket is one of the three objects that own the leader), plus the two rows the `/shop` docket had that this one lacked, `Choose a file: its own page` dropped (meaningless here) and `Pay by card: Stripe` added, so the receipt on `/download` and this promise still match. Foot unchanged, plus the one sentence rehomed from the old navy band: "Something wrong with a download: send us the receipt Stripe emailed you and we will put it right." with `/contact` linked.

**Not found and failed states.** `PageHero` removed. Each opens on a `Kicker` status (`Not on sale` / `Could not load`), `h1.t-h1` with the existing sentence set plain ("That one is not on the shelf", "We could not load this one", no `<em>`), the existing `Lead` paragraph, and the same two buttons. Type only.

### 4.4 /download/:token, the receipt

**Purpose.** Hand over the file. Type only, as the system reserves.

Every state loses `PageHero` and opens on: `Kicker` (`Payment received` / `Download`), `h1.t-h1` the state's sentence set plain (`The Feather: episode pack is ready.`; `Thank you. Your payment went through.`; the four `MESSAGES` headings unchanged), and in the ready state the large download button directly under the h1, before anything else, as the hero's action was. Then the existing two-column body with the docket on the right (leaders kept, it is the docket), every row and foot kept, `expiryLabel` kept, the zip sentence kept. The `role="status"` live region and the six-try poll are untouched. No date is printed on the page beyond `expiryLabel`, which is the link's own expiry and comes from the server.

**Closing.** The deep band "While it prints" is cut (navy band above the footer, site rule; the shard grep for `.deep` must come back empty). Its one fact survives as the closing line on every state: "The episodes behind these pages are free to watch on the show's site." with the `IconExternal` link to `SITE.showUrl`.

### 4.5 Closing line, /shop

Paper, `pad={["tight","open"]}`. One `.t-body` line and two `TextLink`s, left aligned, 1.5px rule above:

"The episodes are free to watch, and the show's own site carries free colouring pages. The interactive activities are in PupsPlayer™."
Links: `Free activities on the show's site ↗` (`SITE.showUrl`), `PupsPlayer →` (`/app`, label reads "PupsPlayer, available now" when `launched`, as the current ternary does). The third row of the old navy band ("Something wrong with a download: send us the receipt") now lives in the product page docket foot (s4.3).

**Cut from the current page, in total, and why:** `PageHero` (the rejected formula); `NotAsked` (policy as spectacle); `KINDS` (describes a shop that no longer exists); the second docket (one object, one place); the "Most of it costs nothing" navy band (site-wide cut, its three facts rehomed above); `rk-head` labels and lamp poses on the shelf (false label, theatre). Page length target at 1440: about 2,600px against 4,437 now, with six products on it instead of none.

## 5. Signature moment

Six real covers, one per episode, all the same size at the true proportion of the A4 sheet they become, standing in a row of three on the dark shelf with the episode's own motif in each cover and a two-line tag under it, and the shelf is the first thing on the page at both widths. It is the first time the company's product is visible anywhere on this site, and it is the only page where the show's flat illustration vocabulary appears at full size, as the thing for sale rather than as decoration. It pairs loosely with the faces on the grove on `/team` (objects mounted on a dark ground), which the verdict accepted: different objects, different kinds of page.

## 6. Mobile (390)

- Opening: `Shop` label, h1 one line at 36px, status on two lines, shelf at about 260px. Badge (when supplied) drops to 64px tall under the `Shop` label rather than beside it.
- Shelf: one column, each cover 350 x 247px, tags under, vertical gap 40px: two packs per screen, six in three screens, in episode order. `Settle` stagger still runs on entry per cover.
- Credit line at 18px, wraps to six lines, under the shelf.
- Footnote strip: the one sentence wraps to four lines at 17px; the disclosure opens the five rows stacked (`dt` over `dd`, as the current `sm:` breakpoint already does), the file-path credit left-aligned under its row rather than right-aligned, because a right-aligned mono line on a 350px column orphans.
- Product page: cover first at full width (350 x 247), caption under; then title, price, the "In the folder" list, tickbox (44px hit area kept), button full width, Stripe sentence. Sample pages become a horizontal `scroll-snap-type: x mandatory` row, each page 78% of the column, 16px gap, a 13px mono "3 pages, swipe" line above it; no arrows, no auto-advance, so it is a row, not a carousel. Docket full width after it.
- Download: button full width directly under the h1, docket after the sentence.

## 7. Motion

Two moments, both `--ease-out` (`cubic-bezier(0.16,1,0.3,1)`), both once:

1. `/shop` shelf: the six covers and their tags settle 8px up over 0.7s, 60ms stagger, via `Settle` on the `ul`. Nothing else on the page animates (the opening block is in view at load, the credit line, footnote and closing are text).
2. `/shop/:slug`: on load the cover settles alone (one child, one unit); when the sample-pages band enters, its three pages settle with the same stagger. The tickbox border transition in `buy.css` stays as it is.

`prefers-reduced-motion`: `Settle` already arms nothing, so both moments render in their final state; the scroll-snap row has no motion of its own; no hover transforms on shelf items, only the existing `link-draw` underline on text links. No loops, no parallax, no hover lift on covers.

## 8. Needed from the client

- The price per pack, set in the admin for all six rows (the repo holds no seed and no price; until it is set the shelf prints whatever the rows hold, so the rows must be filled before the page goes live).
- QUESTIONS #26: shop kept, hidden, or removed; this plan assumes kept.
- Confirmation that packs 5 and 6 go on sale before episodes 5 and 6 air (both are "Coming soon" in `episodes.ts`); if not, those two rows stay inactive and the shelf shows four.
- VAT treatment and whether the price is VAT inclusive (one sentence on the product page and in `/terms`).
- Whether the colouring book stays inside the paid pack while the show site gives colouring away free; the page currently says both are true, which is accurate but should be his call.
- The "Made in Ireland" felted badge as a transparent PNG at 1200px or more (it exists only on page 1 of each away-from-the-screen PDF).
- Who wrote the "Activities away from the screen" booklets (the files are named "Paula's activities"; nothing in the PDF names an author), so the sample caption and the `/app` Learn row can carry a credit, and whether the activity titles inside them may be quoted in captions.
- The cover `thumbnail_alt` and the six descriptions in s4.3 to be approved as written, since they are CMS fields he can edit.
- Episode 5's activity book runs to 21 pages, every other to 20: confirm that is intended before the description prints it.
- Whether the activity books also live inside PupsPlayer or on the show site (shared with the `/app` plan): the product page must not imply a thing is elsewhere that is not.

## 9. Risks

- **A price gets typed into the page.** The verdict found the price is not in the repo. Guard: no price figure appears in any string literal in `Shop.tsx`, `ShopProduct.tsx`, `Download.tsx`, `copy.ts` or `samples.ts`; the builder greps the shard for `4.99` and `EUR` and fails it on a hit; `formatPrice` is the only source.
- **The two pages disagree on what is in a pack.** Guard: the shared table above is the single source; the shelf tag counts description lines (books), the second paragraph names the PDF count, and `/app` prints the same sentence as the credit line.
- **The shelf becomes a card grid.** The moment a cover gets a white box, a radius over 2px, a shadow and a "Buy" button under it, this is every print-on-demand shop. Guard: the cover is the whole item, `Stage seated` with a flat pose for the contact shadow only, tag as two lines of type, no chrome, no icon, no chip, no button.
- **The home formula creeps back through the bench.** One dark band is the shelf; if a second dark or navy band appears anywhere on the page, or a show frame goes behind the title, it is the formula again. Guard: paper above and below the shelf; the h1 is a noun in Calistoga; no `<em>`; no pills; the closing is a line and two links; the shard grep for `font-hero`, `<em`, `PageHero` and `.deep` returns nothing.
- **The flat illustration leaks as decoration.** Six covers at full size are product; one pug beside a paragraph is the rejected watermark. Guard: Victoria's artwork appears only inside the shelf items and the sample pages, each captioned and credited.
- **A hard-coded catalogue.** The temptation is to import six covers and six titles into the page because they are known. Guard: the shelf reads `products` as it does now; covers and descriptions go in through the admin; only the sample-page map is static and it is keyed by slug and renders nothing for an unknown one.
- **Cover-2 by mistake.** The photographic-ground covers are nicer at a glance and are the wrong vocabulary and the wrong provenance. Guard: the builder renders only `Cover-1_activity-0N.pdf`.
- **Leaders spread.** The docket keeps its dotted leaders because it is a receipt; the refusals `dl` and the "In the folder" list are plain ruled rows. Guard: the leader markup exists only inside `Docket.tsx` on this shard.
- **Small type.** Tags, captions and the status line sit on a dark ground and in mono; nothing under 13px mono or 17px body, rules at 1.5px, cream on bench already 5.3:1 and must be re-measured with `lines.mjs` after the build.


---

## contact

# /contact: plan (revised after verdict: PASS)

Sources read: `src/pages/Contact.tsx`, `src/components/contact/{copy.ts,sheet.css,Receipt.tsx}`, `src/components/team/people.ts`, `src/lib/site.ts`, `src/lib/brand.ts` (person.* entries), `src/components/Settle.tsx`, `src/styles/index.css` (type scale, `.eyebrow`, `.card`, `.chip`, `.field-*`, `.hairline`), `api/contact.ts` (subject rule, lines 102 to 103), CONTENT-NEEDED.md and QUESTIONS.md contact rows. Captures looked at in full: `after-1440/contact.png` (3,034px), `after-390/contact.png` (4,691px), `before-1440/contact.png`.

Changes from the previous draft, all from the verdict and the cross-site note:
- The subject-line example now prints the API's literal string. `api/contact.ts` sends `Partnership enquiry from ...` for the partnership route and `` `${route} enquiry from ...` `` for the rest, so the on-page line reads `educator enquiry from`, `press enquiry from`, `general enquiry from` in lower case, exactly as `subjectFor()` in `Receipt.tsx` (line 32) already returns it. The page never re-cases it. (Verdict item 1.)
- Cross-site rules 1 and 3: this page has no status rows with leaders and no margin numerals; the "To" and "Registered details" rows are plain `dl` rows in the field-label style with no dotted leader.
- Cross-site rule 2: the page opens on the form, as planned.
- Cross-site rule 4: faces on contact stay at thumbnail size, the third and last faces page.
- Cross-site rule 7: `.t-h1` is Calistoga (the `--font-display` face), not Fraunces. The previous draft said "Calistoga display" and that stands. Shard grep for `font-hero`, `<em`, `PageHero`, `.deep` must return nothing in `Contact.tsx` and `contact/*`.
- Cross-site rule 5: no dates on this page.

## 1. Job

Four audiences arrive here at once and most of them should not have to write anything: a broadcaster, distributor or investor who has read the home page and wants to open a line to a named person; an educator who wants to join the study or ask about the activities; a journalist with a deadline; a parent who has wandered in from the show and belongs on pawsitivepugs.com. The page must do one thing fast, which is take a message and say plainly who opens it, and one thing quietly, which is send the readers who came to read rather than write to the page that already answers them. They leave having sent a message that is marked by what it is about, addressed to a real Irish company with a registration number, read by five named people whose faces they have just seen, and with the exact subject line the team receives shown back to them. Nothing on the page may promise a reply time, a phone, an address or a person per route, because none of those has been supplied.

## 2. Page kind and the idea

A form. The sheet is the page: it is addressed before the reader types a word (the registered company on the sheet, the five readers beside it with their faces), and the subject line the team will receive composes itself on the sheet as the reader chooses a route and types their name, so the page shows where the words go while they are still being written. It is CLÉ's because the addressees are CLÉ's real people and the subject line is the real one `api/contact.ts` sends, not a device borrowed from any other contact page.

Why it is not the home hero: there is no frame, no picture, no corner copy, no display face with a pink `<em>`, no pill pair, no dark panel. The first object on the page is a field a stranger can type into, under a one-line functional title. The home hero is a film with three words on it; this page is a sheet of paper with boxes on it, and it opens as one.

## 3. Opening

**At 1440.** Header as built (88px). Then a title row on the 1560 shell, two columns on the same grid the whole page uses: `minmax(0,40rem)` left, the rest right, 64px gutter (96px at xl), identical to the sheet grid below so the title and the sheet share a left edge and the lead and the readers column share a right-column edge.

- Left: `<h1 class="t-h1">Get in touch</h1>` (66px at 1440, Calistoga, `--font-display`, ink, one line; never `--font-hero`). Top padding 56px above it. This is the `hero.eyebrow` block's text promoted to the heading; it is the nav label, so the page is called what the link that brought you here is called.
- Right, baseline-aligned to the h1's last line: one sentence in `.t-lead` (21px, Hanken, `text-body`), max 44ch: "Studios, distributors, investors, educators and press. Choose what this is about, and it arrives marked as that, with the company that makes the series." (This is `hero.aside` plus the sheet's own first paragraph, merged into one sentence pair; the sheet loses its paragraph.)
- 32px below the title row, the grid starts: the sheet (`.contact-sheet`, 40rem, as built: raised cream, 1.5px rule border, 22px radius, flat, no hover) and the readers column beside it (sticky, `top-28`, max 36rem). Sheet top edge at roughly y=250. The first thing inside the sheet is the addressee line, then the route chips at roughly y=400, the Name and Email boxes at roughly y=560, the Message box opening at roughly y=780. The readers column shows the heading and all five faces inside the first screen.
- No image in the opening other than the five 88px portraits in the readers column (`/brand/people/{conor,alan,paula,lydia,kirstie}` via `Figure` with keys `person.conor` to `person.kirstie`, `override={m.photo ?? null}` from `useTeam()` as the rest of the site does).
- Movement: one `Settle` wraps the title row and the grid as direct children, so the title settles first and the sheet and readers column settle 60ms later, 8px of travel, 0.7s, house ease. Nothing else moves on entry.

**At 390.** Header (72px). Title block with 32px top padding: h1 at 36px on one line, the lead under it at 18px (three lines, about 85px), 24px gap, then the sheet with 20px padding. Inside the sheet in order: addressee line (about 50px), "What is this about?" legend and the four chips as a 2 by 2 grid (two rows of 44px), the route blurb, the subject line, then the Name box, whose top lands at about y=520 and bottom at about y=600 on an 844px viewport. The first field a thumb can tap is inside the first screen; the form is first in the markup, so it is first on the page. The readers column follows the sheet, not precedes it.

## 4. Section by section

### 4.1 Title row (new, replaces `PageHero`)

Purpose: name the page and say who it is for in one breath, then get out of the way. Layout and type as in section 3. Content: h1 "Get in touch"; lead as drafted above. No eyebrow, no mono identifier, no aside block, no pills. Craft detail: the lead sits in the right column at the sheet grid's gutter, so the page has one grid from its first pixel; the h1 and the lead share a baseline at lg and up (`items-end`), and the lead simply follows the h1 below lg.

Cut: `PageHero` (`id="contact-h"`, tone ink, size short) with `hero.eyebrow` + `hero.eyebrow_sub` top left, `hero.aside` top right, and `emphasis(hero.title)` "Write to *the people who make it*" bottom left. Why: it is the home formula on a black panel, the title is a claim set in the hero face with a pink `<em>`, and at 390 it put a black box and two mono lines before the first field. The block keys `hero.eyebrow_sub`, `hero.aside` and `hero.title` come out of `COPY` and out of the admin's block list for this page, so Conor is not offered a field that renders nowhere; `hero.eyebrow` is renamed `title` and defaults to "Get in touch"; a new `lead` key carries the lead sentence.

### 4.2 The sheet

Purpose: take the message. Layout: `.contact-sheet` as built, 40rem, flat, first in the markup. Order inside, top to bottom:

1. **Addressee line.** A `dl` row at the top of the sheet, under a hairline: `dt` "To" in the field-label style (Hanken 15px semibold, ink), `dd` "CLÉ Family Media, an Irish company" in `.t-body` ink. Plain ruled row, no dotted leader (cross-site rule 1: leaders belong to the documents, the docket and the journal). This is the current "Writing to:" row moved from the foot of the sheet to its head, where a letter puts it. The registered details stay at the foot (see 6 below).
2. **"What is this about?"** fieldset as built: four `.chip` radios (Partnerships, Educators, Press, General), the blurb for the chosen route in `.t-sm` under them. Unchanged wording.
3. **The subject line (new, the page's one device).** Directly under the blurb, one line in mono 14px, `text-body`: `Arrives as  Partnership enquiry from ______`, where the lead and the filled part come from `subjectFor(route, draft)` in `Receipt.tsx`, so it is the same rule `api/contact.ts` applies (lines 102 to 103), not a second copy. The literal strings, printed exactly as the API sends them: `Partnership enquiry from`, `educator enquiry from`, `press enquiry from`, `general enquiry from`. The page does not capitalise the route word; if the casing is ever to change, it changes in `api/contact.ts` and `subjectFor()` together, never on the page. The blank is a 10ch underscore run in `text-muted` until the Name field has a value, then the name in ink; if Name is empty but Email has a value, the email (the API's own fallback). Route change swaps the lead. This is the receipt's first line brought forward; the full receipt still appears only after sending. It must not become a box, a card or a second column: one line, no border, no background.
4. **Name, Email** two-up at sm and up; **Organisation (optional)**; **Message** (8 rows). `.field-label`, `.field-input`, `.field-textarea` as built, 17px inputs. Unchanged.
5. **Send row**: `Button` "Send message" with `IconMail`, "Name, email and message are required." in `.t-sm`. Error line as built (`role="alert"`, red-deep). Busy state "Sending". Unchanged.
6. **Foot of the sheet**, two hairline-topped blocks as built, 15px: the reply-to and storage sentence ("Your address is set as the reply-to, so a reply comes straight back to you. We store what you send so we can answer it, and use it for nothing else."), then the `dl` reduced to one row, "Registered details:" with "CLE Family Media 25 Limited, registered in Ireland, company number 820427. The registered office is at the head of the privacy policy." (link to `/privacy`). Plain row, no leader. The "Writing to:" row has moved to the head of the sheet; nothing is lost.
7. **Honeypot** as built, off-screen, `company_website`. Functional contract unchanged: `POST /api/contact` with `{ route, company_website, name, email, organisation, message }`; route radios stay inside the form.

**Sent state** replaces the form inside the same sheet as built: "Sent" eyebrow, "Thank you. It has reached us." in `.t-h2`, the `Receipt` with `sent`, the two buttons (home, team). Unchanged.

Craft detail: a `?route=` query preselects the chip on mount (`partnership | educator | press | general`, anything else ignored). The footer's "Broadcasters" link becomes `/contact?route=partnership`, "Schools" becomes `/contact?route=educator`, and the press route link on `/media` becomes `/contact?route=press`, so a reader who clicked a word in the footer lands with that word already chosen and the subject line already saying it.

Cut from the sheet: the opening paragraph "Choose what this is about, and the message arrives marked as that..." (now the page lead, 4.1). Why: it was the only text above the first control inside the sheet, and it is said once now, at the top of the page.

### 4.3 Who reads what you send (readers column)

Purpose: the sentence "the people who make it" made into a list a sender can verify. Layout: the right column, sticky at lg (`top-28`), max 36rem, settles as the sheet's sibling. Heading `.t-h3` "Who reads what you send" (`readers.heading`, unchanged). Then five rows, each `hairline-soft` topped, `py-4`: an 88px square portrait (`Figure`, `rounded-[var(--radius-sm)]`, `sizes="88px"`), name 17px semibold ink, role in mono 13px uppercase `tracking-[0.12em]` under the name (not at the far edge: the far-edge role already wraps onto its own line at 390, see the current capture, so it stacks under the name at every width). The five come from `useTeam()` exactly as now: the first five members with a portrait, in `people.ts` order, so a title changed in the admin changes here. Under the list, the line as built: "Not a shared inbox with a logo over it. These five are named on the review stages of every episode." with the `TextLink` "Read who each of them is" to `/team`.

Imagery: `/brand/people/conor`, `alan`, `paula`, `lydia`, `kirstie` at 1x/2x, the same square crop and mount the roster uses, 88px at 1440, 80px at 390, never smaller (the site rule). These are the only pictures on the page.

Craft detail: the portraits use the same radius and 1.5px rule as the form fields beside them, so the faces and the boxes read as parts of one sheet of stationery rather than a card next to a form.

Nothing cut here. Contact is the third of the three faces pages (team, story, contact; cross-site rule 4); the home strip, `/app` and `/media` carry no portraits.

### 4.4 Answered elsewhere (the index)

Purpose: send the readers who came to read, not write, to the page that already answers them. Layout: full-width hairline rows as built, `grid-cols-[0.45fr_0.55fr_1fr_auto]` at sm and up, who in `.eyebrow eyebrow-sm`, title 17px semibold, line `.t-body`, arrow at the row's end (`IconArrow` for internal, `IconExternal` for the show site), red-deep on hover. No numerals in any margin (cross-site rule 3). Content: the four `ELSEWHERE` rows unchanged (Investors and partners: Our story; Broadcasters and distributors: The team and the advisors; Educators and schools: Responsible AI; Parents: The show's own site, `SITE.showUrl`, new tab). No closing rule under the last row (the footer opens with its own).

Heading changes: the `.t-h2` sentence "Some of this is answered better by a page than by us." (54px, two lines) becomes `<h2 class="t-h3">Answered elsewhere</h2>` with the existing small line "Who is asking, and where it is written down." beside it on the same baseline at sm and up. Why: a two-line sentence in display type over a list is the manifesto pattern the client rejected across the site; a list wants a label. `else.heading` keeps its block key with the new default.

The page ends on this list. No closing line, no closing band: the footer's "Work with us" column is the page's closing, as the site plan says for contact.

Cut, page-wide: nothing else. The navy band was already gone from this page; `HangingMarks` and the render-kit room were removed on 2026-10-27 and stay removed.

## 5. Signature moment

The subject line writing itself. The reader taps "Educators", the line under the chips reads "Arrives as  educator enquiry from ______" (the API's string, lower case); they type "Mairead" in the Name box and the blank fills with "Mairead" in ink. It is the only moving text on the page, it is true (the rule is the API's, read through `subjectFor()`), and it answers the question every contact form leaves open, which is where the words go, before the reader has decided to send them. Five real faces beside the box say who opens that subject line.

## 6. Mobile (390)

- Title block: h1 36px, lead 18px under it, 32px top padding; no two-column row.
- The sheet first, 20px padding; the readers column after it, not sticky.
- Chips: a 2 by 2 grid at under 480px (today they wrap 2 + 2 by accident with a ragged right edge; make it a grid so the four align), each `min-h-11`, full cell width.
- The subject line wraps to two lines if the name is long: the label "Arrives as" on its own line, the subject on the next, both mono 14px.
- Name and Email stack (as now).
- Readers rows: 80px portrait left, name and role stacked right, `py-3`, five rows about 500px in all, after the sheet.
- Index rows: who, then title with the arrow riding beside it, then the line; one column, `py-6`, as built.
- Nothing is hidden at 390 that shows at 1440.

## 7. Motion

1. **Entry**: one `Settle` around the title row and the grid (two direct children, so the title lands first and the sheet plus readers column 60ms after), 8px, 0.7s, `--ease-out` (0.16, 1, 0.3, 1). The index below keeps its own `Settle` as built. Reduced motion: `Settle` never arms, everything renders in its final state.
2. **Subject line fill**: the blank's colour goes muted to ink over 200ms on the house ease when the name arrives; the route lead swaps with no transition. Reduced motion: no transition, the text simply changes. No other motion. The sheet does not lift on hover (a transformed ancestor blurs field text and misplaces the caret); chips and buttons keep their built transitions.

## 8. Needed from client

- Who opens which route, if anyone is to be named against Partnerships, Educators or Press (until then the page names nobody per route, as now).
- Whether a reply time may be stated ("within N working days"), the one line that would strengthen the page most and the easiest to break.
- A public email address (the privacy policy and this page route everything through the form because none exists).
- Whether a postal address, other than the registered office, or a phone number may be shown.
- A press address or named spokesperson, if the press route should say more than it does.

## 9. Risks and guards

- **A title band creeps back.** Guard: the h1 is one line, no background, no eyebrow, no pills, and the sheet's top edge is within 170px of the h1 at 1440 and within 100px at 390. If a builder adds a panel, a frame or an image behind the title, it is the rejected formula.
- **The hero face leaks in.** Guard: `.t-h1` resolves to Calistoga via `--font-display`; grep the shard for `font-hero`, `<em`, `PageHero`, `.deep` and fail on any hit (cross-site rule 7).
- **The subject line drifts from the API.** Guard: the on-page string is `subjectFor()`'s output verbatim, never a page-side template; the test for the line is that it equals the `subject` the API would build from the same draft. Casing changes happen in `api/contact.ts` and `Receipt.tsx` together, never on the page.
- **The letter idea becomes letter cosplay.** Guard: no stamp, no postmark, no script face, no torn edge, no paper texture beyond `.contact-sheet` as built. The "To" row is a `dl` in the field-label style, plain ruled, no dotted leader, nothing more.
- **The subject line grows into a second form.** Guard: one line, mono 14px, no border, no background, no heading; the full `Receipt` appears only in the sent state. This is the exact mistake the 2026-10-09 rebuild removed, so the line is kept to one.
- **The readers column turns into cards.** Guard: hairline rows, portraits at one radius matching the fields, no card, no shadow, no hover lift; roles stacked under names.
- **Generic contact-page reflexes.** No map, no office-hours block, no "we usually reply in" without a client commitment, no three icon tiles for the four audiences (the index stays rows), no social icons.
- **Claims.** The page states only what the code does (reply-to, storage, subject rule) and what the company has supplied (entity, number, five names on every episode's review). Nothing about speed, phone, address or a person per route until section 8 is answered. No dates on the page (cross-site rule 5).


---

## utility

# Utility pages: /privacy, /terms, /cookies and the 404 (revised after the verdict)

Plan only. Read: `src/pages/Legal.tsx`, `src/pages/NotFound.tsx`, `src/lib/blocks.ts` (the editable keys for `privacy`, `terms`, `cookies`, `404`), `src/components/Settle.tsx`, `src/components/PageHero.tsx`, `src/styles/index.css` (tokens, `.t-h1`, `.card-stock`, `.wall`, the filmstrip classes), `CONTENT-NEEDED.md` and `QUESTIONS.md` where they touch these pages. Captures looked at: `after-1440` and `after-390` for `privacy`, `terms`, `cookies`, `404`; `before-1440/privacy.png` and `before-1440/404.png`.

**What changed from the previous plan, against the verdict:**

1. Every "Fraunces" became Calistoga. `.t-h1` is `--font-display` (`index.css` 202, 263); `--font-hero` (Fraunces, 203) is home's and appears nowhere in this shard.
2. The `Version 1` row, the `VERSION` constant and the `Version 1` in the colophon are cut. The status rows are the wording's revision date and the governing law, both true in the repo (`DRAFTED`, `Legal.tsx` 78; the clause at 188).
3. The dotted leaders are gone from this page. Status rows here are plain ruled `dt`/`dd` rows; the leader is the journal's signature and the shop docket's. The claim that the leader was "a thing nothing else on this site does" was false in the same set of plans and is withdrawn. (The cross-site note's rule 1 names the two documents among the leader's owners; the journal verdict and this page's verdict both say legal uses plain rules. Two of three readings say plain; plain is also the one that answers the thumbnail-row test, so plain it is. If the site owner wants leaders on the documents after all, it is one class on one `dl`.)
4. Removing the `Draft` word (`Legal.tsx` 457) stands.
5. Cross-site rule 5: the date row is labelled as the wording's revision, not "Last updated", so it cannot read as an adoption or review date. Rule 7: the shard greps clean for `font-hero`, `<em`, `PageHero`, `.deep`; the 404 title no longer passes through `emphasis()`, so no `<em>` can be rendered on the page even by an admin.

Two kinds of page here. The three legal routes are one **document** shell rendered three times; the 404 is a **notice**. They are planned separately below where they differ and together where they share.

## 1. Job

**The documents.** Three readers, in this order: an investor's or broadcaster's diligence (does this company have its paperwork, is it specific, is it dated); a parent who has opened the privacy policy of a children's media company, which is exactly the parent the site exists to reassure; and a buyer from the shop checking what a purchase is and whether they can get a refund. All three must be able to find the one clause they came for inside ten seconds, see who the trader is (name, CRO number, registered office), and see when the wording was last changed. They should leave believing the company writes its own terms in plain Irish English and would stand over them. Not one word of clause text changes in this plan; the setting changes.

**The 404.** Someone who followed an old link or mistyped. They must get a route back in one glance, and in the same glance understand that the company is a studio that makes a series, which is what the missing frame on the reel says without a paragraph.

## 2. Page kind and the idea

**Legal: a document.** The concept is that the page *is* the folder: three tabbed sheets of card, and the document's own title block is printed on the sheet, not hung above it on the wall. The reader opens the page and is already holding the document; the header is the only thing above the tabs. Legal and `/ethical-ai` share this shell on purpose (the verdict accepts the pair); what sets the two apart from every other subpage is the tab and the sheet, not the rows of facts.

**404: a notice.** A notice is type and a list of ways out, and the one picture on it is the reel with a frame missing, which is the company's own joke about a page that is not there.

**Why neither is the home hero.** The home hero is a film in a rounded frame with copy in its corners. The legal page opens on an object that has nothing in common with a frame: a raised tab, a sheet of card, a title block set in the document's own grid, two ruled status rows. There is no panel, no rounded field, no scrim, no corner copy, no pill, no pink `<em>`, no Fraunces. The 404 opens on an ink headline and a ruled list on bare paper, at `.t-h1` (Calistoga) not the hero face, and its picture (the reel) is below the type, full bleed, in the house's own perforated stock, which the home page also carries but as a strip, never as a hero. `PageHero` is removed from both files; `size`, `tone`, `eyebrow`, `aside` and `actions` all go with it.

## 3. Opening

### Legal, 1440

Header as built. Then 40px of paper. Then, flush with the left gutter of the 1560 shell (the sheet is 70rem wide and flush left, as now, `max-w-[70rem]`, not centred):

1. **The tab row**, exactly as built: `PRIVACY`, `TERMS`, `COOKIES`, mono 14.5px uppercase, 44px tall, the one in hand raised (`bg-raised`, `border-raised`) and the other two set back (`bg-sunken`, `mt-1`). Nothing changes here except that nothing sits above it.
2. **The sheet** (`.card-stock`, padding 64px at `lg`), opening with a **title block** laid on the same two-column grid the rail and clauses already use (`lg:grid-cols-[14rem_minmax(0,1fr)]`, gap 64px), so the title block and the document underneath it share one set of column lines:
   - **Left column, top to bottom.** Mono 14px uppercase `text-muted`: `CLÉ Family Media`. Under it, 20px gap, two status rows as a `dl`, each row a plain ruled row: `dt` sans 15px `text-body` on the left, `dd` mono 15px `tnum` `text-ink` on the right, a 1.5px solid `border-rule` under each row, no leader, no dots:
     - `Wording last revised` · `24 October 2026` (from `DRAFTED`, through `longDate`, exactly as now; the label says what the constant is, per the comment at `Legal.tsx` 29)
     - `Governing law` · `Ireland` (true by the clause at `Legal.tsx` 188; the fact the hero aside carried at 470 as `Jurisdiction`, kept under its clause's own word)
   - **Right column.** The `h1`: the document's name in `.t-h1` (Calistoga, `--font-display`), ink, `max-w-[14ch]` (`Privacy policy`, `Terms`, `Cookie policy`, through `useBlock(doc, "title", ...)` as now; a name is the one heading on the site allowed to be a label and this stays the exemption). 24px under it, the intro at `.t-lead`, ink, `max-w-[56ch]`, verbatim: "We collect as little as we can get away with, we tell you what we have, and we do not sell any of it. This policy explains the detail." (Terms and Cookies use their own `intro`, unchanged.) 36px under it, the **Who you are dealing with** block exactly as built: mono 14px label, then the sentence "CLE Family Media 25 Limited, registered in Ireland, company number 820427. Registered office: Curraghs, Liscarroll, Mallow, Co. Cork, P51 K2T9. Trading as CLÉ Family Media." at 17px (up from 15px), between its two 1.5px rules.
3. A 1.5px `border-rule` across the full inner width of the sheet, 48px below the title block, then the **rail and clauses** as now (contents on the left, sticky at `lg:top-28`; numbered clauses on the right at `.t-h3` 30px with the mono numeral in the margin, which the cross-site note reserves for the two documents and this is one of them). Body text of the clauses goes from 16px to 17px (`.t-body`), line-height 1.64. Rail entries from 15px to 16px. The defined-term `dfn` treatment stays.

The first clause heading, `1 Who we are`, lands at about 800px from the top of the viewport at 1440 (one row fewer than before), so the reader sees the tabs, the title block and the first numbered clause on one screen.

**What moves.** The sheet settles once on mount: `translateY(14px)` and `opacity 0` to rest over 640ms on `cubic-bezier(0.22,1,0.36,1)`; the title block's type follows 120ms behind with the same curve over 480ms. The tabs do not move. Nothing else on the page animates, ever.

**The word "Draft" comes off.** The current hero eyebrow still prints `CLÉ FAMILY MEDIA / DRAFT` (`Legal.tsx` 457), which contradicts the note in the same file (David, 2026-10-13: these are published terms now, the draft notice came out). The title block carries the revision date and no status word. No version number is added anywhere: the company has not numbered its documents and the site must not number them for it.

### Legal, 390

Header, 24px, the three tabs (they fit at 390 today, keep them), then the sheet at 20px padding. Title block in one column, in this order: mono publisher line; `h1` at 36px (`.t-h1` at its floor, Calistoga); the lead at 18px; the two status rows (full width, `dt` left and `dd` right on one line, rule under each); the Who you are dealing with block at 17px; a rule; the `Contents` disclosure as built (`MobileContents`, 44px tall, `8 sections`, arrow); then `1 Who we are`. The first clause heading arrives at about 1,100px, a screen and a quarter down, which is right for a document whose first screen is its cover.

### 404, 1440

Header, then 96px of paper, then a two-column grid in the 1560 shell (`lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]`, gap 80px):

- **Left.** One mono 14px uppercase status line, `text-muted`: `404 · Page not found` (the `hero.eyebrow_sub` block, prefixed by the literal `404`). This is the one `Kicker` the page is allowed, because it is a status. 20px under it the `h1` in `.t-h1` Calistoga ink, `max-w-[12ch]`: **That page has wandered off** (the `hero.title` block; the default string in `COPY` loses its `*stars*`, and the title is rendered as plain text, not through `emphasis()`, so the page can never carry an `<em>` and the shard greps clean; an admin who types stars sees them as stars). 24px under it the lead at `.t-lead`, `text-body`, `max-w-[40ch]`: "The link may be old, or we may have moved something. Everything below is still where it should be." (the `routes.heading` block then the `hero.aside` block, both verbatim, rendered as one paragraph; both keys kept).
- **Right.** The four routes as the ruled list exactly as built (`ROUTES_BACK`, 17px semibold title, 15px line, arrow or external icon, 1.5px rules, 44px rows, `Settle`). No buttons: the panel's two buttons were rows 1 and 3 of this list said twice.
- **Below both, 64px down,** the reel full bleed: `.filmstrip-band` with sprockets, edge print `CLÉ FAMILY MEDIA` left and `404` right, four frames: `slate.ep1`, the `MissingFrame`, `slate.ep2`, `slate.ep3`. Unchanged in content. At 1440 the top of the frames sits at about 640px, so the missing frame is in the first screen.

**What moves.** The type and the list settle as now. Then the trail: the nine paws in the missing frame appear one after another, left to right, 70ms apart, each over 400ms on the house curve, each to its own opacity (0.46 falling to 0.12), so the reader watches the animal leave the frame. That is the page's entrance. Under `prefers-reduced-motion` the trail is simply there.

### 404, 390

Header, 40px, status line, `h1` at 36px on two lines (`That page has / wandered off`), lead at 18px. Then the reel, not the routes: at 390 a title and a ruled list is a notice and nothing else, and the strip at 70vw a frame puts the missing frame (already `order-first` on a phone) on the first screen with the headline. Then the four routes. DOM order is title block, reel, routes; at `lg` the routes move up beside the title (`lg:order` on a flex column whose text children carry the container padding and whose strip child carries none, since `.filmstrip-root` computes its own gutter from 100%).

## 4. Section by section

### Legal

1. **Tabs.** Purpose: say the three documents are one set, and which one is open. Layout and content as built. Craft detail: the raised tab's border is the sheet's own colour so it reads as part of the card, which is already how it is drawn. Cut: nothing.
2. **Title block on the sheet.** Purpose: the cover of the document. Layout, type and copy as in section 3. Imagery: none. Craft detail: the title block sits on the document's own column lines, so the cover and the clauses are visibly one grid; the two status rows are ruled the same 1.5px as the rules around the trader block, so the cover is one weight of line end to end. Cut: `PageHero` (`id="legal-h"`, `tone="wall"`), the `Draft` word, the eyebrow and aside slots, the `Version` row from the previous plan. The facts the hero carried (publisher, date, jurisdiction) all survive: publisher line, revision row, governing-law row.
3. **Rail and clauses.** Purpose: find the clause. As built (the scroll-driven active mark stays, the explanation in the code is correct and the IntersectionObserver version was wrong twice). Changes: clause body 17px; rail 16px; the colophon line at the foot of the clauses becomes `Privacy policy. Wording last revised 24 October 2026.` (same label as the status row, no version). Cut: nothing.
4. **The documents shelf.** Purpose: the three plus one. As built, with one addition at the top of the list: `Responsible AI` · "How CLÉ Family Media uses AI inside a human-led production process." linking to `/ethical-ai`, so the position keeps the company of the legal documents (site-level decision). The `You are reading this` mark stays. The closing line stays: "Anything in these documents you want put differently, or a question about what we hold: write to us." That line, and the footer, are the closing; there is no navy band and none is added.
5. **Nothing else.** Three objects on the page: tabs and sheet, shelf, footer.

### 404

1. **The notice.** Status line, headline, lead, as in section 3. Cut: `PageHero` (`tone="ink"`), the pink `<em>`, the `emphasis()` call and import, the two buttons. Why: the panel is the formula; the buttons duplicate the list.
2. **The routes back.** As built. Cut: the `h2` wrapper around `routes.heading`; the sentence is now the lead, so the list is labelled by the `h1`.
3. **The reel.** As built. Craft detail: the paw trail draws in (section 7). The `404` edge print and the `FRAME MISSING` label at 13px mono (held to 6.4:1, as the code already measures) stay.
4. **Nothing after the reel.** An interruption, not a destination, which is the right call already made.

## 5. Signature moment

**Legal.** The document's name printed on a sheet of card you are already holding, with a raised tab at its top edge and two tabs behind it. The reader remembers that the terms came in a folder, and that the folder was tidy. The tab and sheet are the signature; the status rows are furniture and are drawn as plainly as furniture.

**404.** The paw prints walking out of the empty frame on the reel while the three real episode slates sit either side. It is the one joke on the site and it says what the company makes.

## 6. Mobile

- Legal: the title block becomes the first screen in one column (publisher, name, lead, two status rows, trader block), and the contents disclosure is the hinge between the cover and the clauses. Status rows go full width, label left and value right on one line, rule under each; nothing wraps under 13px. The rail is never sticky at 390. The clause numeral moves inline before the heading, as now.
- 404: the reel moves between the lead and the routes so the missing frame is on screen one. The list stays 44px rows. The headline breaks to two lines by its own width, not a forced break.
- Both: body 17px, mono 13px floor, rules 1.5px, exactly the floors the client's "too small" and "too thin" verdicts set.

## 7. Motion

Two moments on the site's utility pages, house curve `cubic-bezier(0.22,1,0.36,1)` throughout, nothing loops, everything collapses to its final state under `prefers-reduced-motion`:

1. **Legal, on mount:** the sheet settles (14px rise, fade, 640ms), the title block's type 120ms behind (480ms). Switching tabs remounts the `Document` (keyed by `doc`, as now) and plays the same settle, which is the folder handing you the next sheet; no second animation is added for the tabs. No leader draws in here; that motion is the journal's.
2. **404, on mount:** the type and list `Settle` as built; the nine paws then appear left to right, 70ms stagger, 400ms each, to their fixed opacities. CSS only (`animation-delay` per paw) so the QA sweep can zero the durations.

The legal rail's active mark is state, not motion, and stays as the code explains.

## 8. Needed from the client

- A public email address for data requests and purchase problems (every clause currently routes through `/contact`; CONTENT-NEEDED lists it).
- Solicitor review of all three documents, or confirmation that they ship unreviewed as decided on 2026-10-13.
- CLÉ's VAT position (affects Terms clause 2 wording and the shop).
- The analytics decision (QUESTIONS #16): the cookie policy's `Analytics` clause stays true as written until a tool is chosen.
- If the company ever wants a version number or an adoption date on its documents, the number and the date come from the client; until then neither appears.
- Nothing for the 404.

## 9. Risks

- **Sliding back to the pre-fan-out shape** (title and grey lead on the wall, facts hard right): guard is the rule that the title lives on the sheet, inside the card, in the document's own grid, and the only thing above the tabs is the header.
- **Sliding back to the panel:** no rounded field of any tone on either page; if a builder wants a surface for the 404 headline, the answer is paper.
- **Setting the title in the hero face:** `.t-h1` already resolves to Calistoga; a builder must not add `font-hero` or Fraunces to either file. The shard grep for `font-hero`, `<em`, `PageHero` and `.deep` fails the build on a hit (cross-site rule 7).
- **Leaders creeping in:** the status rows are solid-ruled rows; no `border-dotted`, no leader class. The leader lives in the journal and the shop docket only.
- **The documents shelf turning into a closing band:** it stays a ruled list on paper with one line and one link under it, never navy.
- **Inventing document facts:** the only facts on the cover are the publisher, the wording's revision date (from `DRAFTED`) and the governing law (from clause 188); no "Version", no "reviewed by", no approver, no adoption date unless the client supplies them.
- **Decorating the 404:** no pug, no character, no illustration; the only pictures are the three slates and the empty frame. The trail is already there and is the limit.
- **Type creeping back down:** body 17px, rail 16px, mono 13px floor; `lines.mjs` should pass with every rule at 1.5px.


---

## Critic's verdict (before revision)

# Subpage plans: creative director's verdict

Checked against the repo before judging: `--font-display` is Calistoga and `--font-hero` is Fraunces (`index.css` 202 to 203); `people.ts` holds eight portraits plus Mansi; `api/contact.ts` builds the subject as `` `${route} enquiry from` `` in lower case; the Drive paths the app and shop plans cite all exist; Episode 01 has four PDFs (activity b/w, activity colour, colouring, Paula's), not three; the mission film's narrator is not recorded anywhere in the repo; `Legal.tsx` still prints `Draft`.

## /story: PASS

(a) Unique opening (portrait beside the letter's first sentence). No pair. (b) Letter fits both audiences. (c) Specific to the pixel; the three fixed measure breaks are the right pacing device. (d) Clean; the first sentence is verbatim in `Story.tsx` 261. (e) Clean.

Before build, not blocking:
1. "P.S. The mission film, one minute" states a duration nobody has measured. Read it with ffprobe at build or drop "one minute".
2. The `film.heading` block "in his own words" is already flagged as unconfirmed; keep the P.S. caption free of it until the client answers.

## /team: PASS

(a) Opens on objects mounted on the dark ground; shop does the same with covers on the bench. Different objects, different page kinds, acceptable. (b) Register is exactly what an adviser wants. (c) Roll-call column is the best-specified signature in the set and is pure data. (d) Clean. (e) Clean, middle dots not dashes.

Before build:
1. Measure cream numeral on `--color-red-deep` at 15px mono for 4.5:1 before shipping the discs.
2. The job statement's "two design the games and the app" overstates Victoria's role (`Graphic Designer and Illustrator`); page copy does not say it, keep it that way.

## /ethical-ai: REVISE

(a) The opening (mono publisher line, `.t-h1` noun, `.t-lead`, dotted-leader status rows, one Settle) is also the opening of case-study, app, journal and legal. The sheet-and-tab shell is what sets this one apart; it keeps the status rows, the others lose them (cross-site rule below). (b) Document is right for the trust page. (c) Buildable. (d) Two unconfirmed facts are set as document fields.

1. Tools table, "Where on the line: Phase 03, inside the animation, directed by Alan Compton": the plan itself lists the phase-03 placement as unconfirmed (`CONTENT-NEEDED`). A dated document cannot assert it. Render that column only when the client confirms; until then the clause says what the drawing says and nothing more.
2. "Last revised 24 October 2026" is the date a developer rewrote the wording. Label it "Wording last revised" so it does not read as adoption. Adopted and Approved stay hidden as planned.
3. "Applies to: every episode ... and the activities that follow it": the position text covers production of the episodes; nothing in `stations.ts` covers Victoria's books. Cut "and the activities that follow it" unless the client extends the position.

## /case-study: REVISE

(a) Three patterns shared: the dl status-row opening (ethical-ai, app, journal, legal), the numbered margin sheet with full-width hairlines (legal shell, media's numbered groups), and the `.t-h2` display numerals. Read cold, this is the fourth numbered document. (b) Protocol sheet is the right kind; the questionnaire gate is the right call. (c) Specific. (d) One wrong row, one drafted claim.

1. Open on the signature, not the table. First screen at 1440: title, subtitle, then `TwoRoutes` with the chips driving it at the left, the status facts as a plain ruled list (no leaders) beside it. The route switch is the one thing on the page that is not a document and it is below the fold.
2. "Materials: three, with the education adviser" is false. Only the two sets of notes are with Paula; games and colouring are not supplied. Row reads "Notes with the adviser; games and colouring not yet supplied".
3. "Taking part is by arrangement with CLÉ Family Media until the study opens" is drafted, not supplied. Hold the line until the client answers who the contact is; the page's credibility is that it claims nothing.
4. Drop the mono numerals in the margin; use the mono labels alone. Numbered margins belong to the two documents.

## /app: REVISE

(a) Same dl status opening as four other plans; at 390 the device drops under five rows of facts, so the product sheet opens on a table. The Learn row (real pages) is a true signature and pairs with nothing. (b) Right kind. (c) Specific; export paths and sizes are stated. (d) Counts disagree with the shop plan and one caption asserts authorship.

1. Book count. App says three books per episode, eighteen books, 318 pages; shop says four PDFs for episodes 1 to 4 and three for 5 and 6 (the activity book ships in black and white and in colour). One truth, printed identically on both pages: "three books; for episodes one to four the activity book comes in colour and black and white".
2. At 390, order is mark, name, descriptor, device, then the rows. The object before the facts.
3. Caption "Paula's offline activities, page one" asserts an author the PDF does not name (shop plan has this right). Caption as "Activities away from the screen, page one" until the client confirms.
4. Four pages at 330 x 233 is below the plan's own legibility bar for pictures of type. Three pages at 440 wide, matching the covers' column, or two rows of two.
5. Status rows: plain ruled `dt`/`dd`, no leaders (cross-site rule).

## /journal and /journal/:slug: REVISE

(a) The signature moment (dotted leaders drawing in) is the opening object of four other plans. A signature four pages share is a template. (b) Contents page is exactly right for a journal with no posts. (c) The leader CSS is specified to the pixel; good. (d) "One piece a week, once we start" is existing copy (`Journal.tsx` 20), fine. (e) Clean.

1. Journal owns the leader. The leader component ships in `index.css` for this page and the shop docket only; case-study, app, ethical-ai and legal use plain ruled rows. Then the leaders drawing in is a genuine signature.
2. "Issue one: In preparation" invents a periodical structure the client has not chosen. Row reads "First piece: In preparation".
3. Post page: keep the running head's right-hand line to "CLÉ Family Media"; "The journal of" is already said on the left link.

## /media: REVISE

(a) Numbered groups 1 to 5 with mono numerals is the document shape again (legal, ethical-ai, case-study). The contact sheet with file sizes is a real signature. (b) Press kit is right. (c) Specific, and "Copy the facts" is the one craft idea in the set a journalist would notice. (d) Three asserted facts the company has not supplied.

1. Faces. Eight portraits for editorial download is a fourth faces page and offers people's photographs for reuse without their consent (the plan lists the consent as needed, then builds it anyway). People row renders names and roles only until the client confirms; then the thumbnails.
2. "The mission film. Conor Sexton, founder, speaking." Nothing in the repo says who narrates (story plan flags the same). Caption: "The mission film."
3. "FACTS CHECKED 27 OCTOBER 2026 · VERSION 1" reads as a company attestation and the date is the developer's. "Sheet updated 27 October 2026", no version.
4. Drop the group numerals; mono labels alone.
5. Add to Spellings, needed from client: the fourth episode is "The Cuckoo" in `episodes.ts` and "The Cuckoo's Incredible Journey" in the slate alt (`brand.ts` 339). A press sheet cannot carry both.

## /shop, /shop/:slug, /download: REVISE

(a) Covers on the bench pairs loosely with faces on the grove (team); different objects, acceptable. Nothing else shared. (b) Catalogue is right and it is the first time the product is on the site. (c) Fully buildable, down to `pdftoppm -r 200`. (d) Price is not in the repo; the plan derives it from `products.price_cents` but no seed exists, so "EUR 4.99" in drafted copy is assumed. (e) "EUR 4.99" is not Irish copy.

1. Every price string is "€4.99", matching the existing Buy button. "EUR" appears nowhere.
2. The status line and tags print the price only from live rows (the plan says so); strike the literal 4.99 from every drafted sentence so the builder cannot hard-code it.
3. Agree the per-episode file list with the app plan (item 1 under /app).
4. Caption the away-from-the-screen sample page without an author, as planned, and make the app plan match.

## /contact: PASS

(a) Unique opening (the form) and unique signature (the subject line composing itself). (b) Right. (c) Specific, including the `?route=` preselect wiring. (d) States only what the code does. (e) Clean.

Before build:
1. The drafted example "Educator enquiry from" does not match the API, which sends "educator enquiry from" (`api/contact.ts` 103). The line is only true if it is the literal string; print the API's string, or change the API's casing, never the page's.

## /privacy, /terms, /cookies, /404: REVISE

(a) Legal shares the document shell with ethical-ai on purpose; fine. The dotted-leader status rows pair with four other plans (resolved by the cross-site rule). 404 is unique. (b) Both kinds right. (c) Specific. (d) "Version 1" is invented, the plan admits it. (e) Clean.

1. `.t-h1` is Calistoga, not Fraunces, in both places the plan says "Fraunces". Fraunces is `--font-hero` and is reserved for home; a builder following the plan as written would set the document title in the hero face.
2. Cut the "Version 1" row and the "Version 1" in the colophon. "Last updated" and "Governing law: Ireland" (true, clause at `Legal.tsx` 188) are the status rows.
3. "a thing printed documents do and nothing else on this site does" is false in the same set of plans; status rows here are plain ruled rows, the leader belongs to journal and the docket.
4. Removing the `Draft` word (`Legal.tsx` 457) is correct and overdue.

## Cross-site note

The ten plans have replaced one formula with another. Six of ten open on the same object: a mono publisher line, a `.t-h1` noun, a `.t-lead` sentence, a `dl` of status rows with dotted leaders, one Settle, then rules. The kinds are distinct on paper (letter, register, document, protocol, product sheet, contents page) but the first screens of ethical-ai, case-study, app, journal and legal would be indistinguishable in a thumbnail row, which is the test the client applied last time.

Rules for the build, binding on every plan above:

1. Status rows with leaders live on three objects only: the two documents (legal, ethical-ai) and the shop docket, plus journal, which owns the leader as its signature. Case-study and app use plain ruled `dt`/`dd` rows; media uses its unleadered `dl` as planned.
2. Sheets open on their object, not their facts: case-study on the route drawing, app on the device (at both widths), shop on the shelf, team on the faces, story on the portrait, contact on the form. Documents open on a title block. Lists (journal, media) open on the list.
3. Mono numerals in margins belong to the two documents. Case-study and media use labels.
4. Faces on three pages only: team, story (Conor), contact. Media lists names until consent arrives.
5. Dates on a page are client-set or labelled as the wording's revision; no "Version", no "Facts checked", no "Adopted" without the client.
6. One set of numbers for the books, shared by app and shop, derived from the Drive table in the shop plan.
7. `.t-h1` is Calistoga. Fraunces, the pink `<em>`, the pill pair, the scrimmed frame and the navy band appear on no subpage; grep the shard for `font-hero`, `<em`, `PageHero`, `.deep` and fail it on a hit.
8. No em or en dash was found in any drafted line; the only Irish-English fault is "EUR" on the shop.
