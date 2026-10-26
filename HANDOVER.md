# HANDOVER: read this before touching the design

Written 2026-10-09 at the client's request, at the end of a session that did
not deliver what he asked for, and updated later the same day by the instance
it was written for. Sections 1 and 2 are the original brief and stay as
written, because the pattern they name is the thing most likely to come back.
Sections 3, 7 and 8 record what was actually done and what is next.

---

## 1. What David actually said, in order

He said the same thing four times across one session and it was not acted on
properly any of those times.

> "i am not pleased with teh lack of design improvements, still a lot of boring
> text with no nice renders, animations added life etc"

> "the pages are still so flat though"

> "why arent you creating nay renders or animations, or interesting elements.
> also teh six stages with teh boxes is very difficult to understand, not very
> accessible."

> "you are getting this all so very wrong, it is very frustrating. the contact
> page is borderline unusable, its so odd and weirdly designed, and unintuitive.
> teh six stages are now a boring vertical list. are you not taking int account
> what it is i am asking."

When asked to choose a direction he picked **motion-led**, and added in his own
words: **"this plus mtmn.ie style renders where we can and more varied
layouts."** All three parts of that were under-delivered.

Earlier in the same project he also said, about the hero: *"you have done this
very poorly. look at consulting.ie, do it right."* That instruction (go and
measure the reference rather than invent from the brief) is the single most
useful thing he has said about how he wants this work done, and it applies to
everything below.

---

## 2. The pattern that went wrong

Name it so it is not repeated.

1. **Timid moves dressed up as decisions.** Asked for renders and life, I added
   small polite objects inside the existing layout boxes: a lit mark here, a
   card there. Each was defensible on its own and none of them changed how a
   page reads. The client's word for the result, twice, was "flat".
2. **Measuring instead of designing.** A large part of the session went on
   fixing the contrast/QA tooling. The tooling genuinely was broken and the
   fixes were real, but that was my problem to solve quietly. It is not the
   work he asked for and it consumed the session.
3. **Over-correcting on the second attempt.** The six-stage matrix was
   genuinely hard to read. I replaced it with something clear and completely
   dull, and his verdict was "a boring vertical list". Clear was the floor, not
   the goal. It had to be clear **and** interesting.
4. **Judging my own work from crops.** I repeatedly screenshotted the component
   I had just changed rather than the whole page, so I kept concluding things
   had improved when the page as a whole had not. **Always capture the full
   page and look at it.**
5. **Asking him to arbitrate taste too often.** He has said what he wants. The
   next instance should go and build a strong proposal, not run another
   multiple-choice question.

---

## 3. The two defects he named, and what was done, 2026-10-09

Both are fixed. Captured full page at 1440 and at 390 before and after, not
cropped to the component.

### 3.1 `/contact` was borderline unusable

Rebuilt as a conventional contact page, which is the right answer on the one
page of this site where being inventive costs more than it earns.

- **Fields are boxes.** `.field-input` / `.field-textarea` / `.field-label` in
  `src/styles/index.css`: raised fill, a real 1px edge, 12px radius, 17px type
  so no mobile browser zooms on focus, and a focus state that is the red edge
  plus a soft ring. The message box is eight rows and 11rem tall minimum.
- **The enquiry type is four pills**, `.chip`, inside the form, with the
  selected one filled red and the chosen route's sentence under the row. It
  was four full-width columns of body copy three hundred pixels above the
  first field it governed.
- **The live receipt is demoted, not dropped.** It no longer competes with the
  form; it appears after the message is sent, as a confirmation of what went,
  with the subject line the team sees.
- **The four bullets of implementation detail are one line.** The honeypot is
  not explained on the page where an investor writes to the company.
- **The band is two columns**: what this page is on the left, holding as the
  form scrolls past it, with the five faces under it. The faces section that
  used to sit at the foot of the page is gone; it was a second copy of a strip
  `/team` owns, and "who reads this" belongs before writing, not after.

Page height at 1440 went from 4234px to 3173px.

### 3.2 The six stages were boring

`src/components/team/StageSequence.tsx` plus `.rk-board` / `.rk-slip` in
`src/components/render/render.css`. The component keeps its name; what it
draws is a third thing, not a correction of either earlier attempt.

**Six sign-off slips standing on a lit bench.** A review stage ends in
somebody putting their name to it, so each stage is the slip they sign: the
number printed large in Fraunces the way a filed docket carries one, the
stage, the portraits of the people answerable, what they check, and on the one
stage the company's account says can stop a release, a red band across the
foot saying so. Three across and two down on a desktop, two across on a
tablet, one column on a phone, feet aligned to the shelf so the slips stand at
their own heights.

It is built out of the render kit that was already here: `.rk-studio`'s wall,
rake, picture rail, bench grid, per-item ledge and entry settle, with `Stage`
standing each slip under one lamp whose azimuth is computed per column, so the
shadows fan from one point instead of running parallel. No image generation,
which is the rule, and it is the mtmn.ie method the client asked for by name.

**Why not another chain.** `/ethical-ai` already owns a vertical chain of the
same six stages with a drawn return path. Version 2 on `/team` was a weaker
second copy of it. Two drawings of one sequence is what made the page read as
a template.

**The numerals are content, not decoration.** The first pass set them as a 26%
tint and the contrast sweep measured them at 1.80:1. They carry the order,
which is the one thing a reader has to get off the board, so they are now at
70% and over 3:1, and they are read out rather than `aria-hidden`.

### 3.3 `/contact` again, and the footer logo, later the same day

The client's verdict on the first `/contact` pass: it works, but it "isn't
unique in any way and it doesn't relate to CLÉ". Fair. It was a cream card on
clay and the same card would have suited an accountancy firm. Separately: the
footer "is so awful, why isn't it just their actual logo, why have you spaced
everything out".

**The footer logo was not their logo.** `Wordmark` was a typographic
stand-in, the name in Calistoga beside "FAMILY MEDIA" tracked out to 0.3em,
written because the brand audit found no vector mark in the kit. The audit was
right about the vector and wrong about the consequence: the company has a logo
and everyone knows what it looks like, and the art for it was in
`public/brand/` the whole time in four cut-out pieces. `mark-c`, `mark-l`,
`mark-e` and `mark-word` all sit on one shared 591px canvas, so they composite
straight back into the original lockup. `public/brand/mark-lockup.png` and its
height map are that composite, built once; `Relief` lights it off the 16 bit
map. It hangs from the top edge of the navy band on its own ropes, which is
what the art was drawn to do.

Still a stand-in for one thing: a favicon and any use under about 110px, where
three animals on ropes stop being legible. That needs the vector, QUESTIONS.md
#21.

**The footer was the default four-column shape**, nine links and two sentences
spread across 1560px. It is two poles now: the lockup and the one sentence
that says what the company is at one end, everything clickable at the other.

**`/contact` is CLÉ's own room.** One lit scene, built from the render kit the
rest of the site already stands its objects in: the five people named on every
episode's review are mounted on the wall on their own ledges, and the sheet you
write on stands in front of them under the same lamp. Same room as `/team`'s
review board and `/media`'s studio wall, which is the point. The headline
"write to the people who make it" now has the people in it.

**The sheet does not lean.** Every other object in the kit sits on a few
degrees of 3D rotation. A form cannot: a rotated ancestor blurs the text in
every field and moves the caret and the native autofill panel off the control
they belong to. The room supplies the light and the shadow; the thing you type
into stays square and flat.

**The closing navy band is gone.** It carried the hanging CLÉ mark and the
company's formal identity. The mark is the footer's now, on every page, so the
page was showing it twice and stacking two navy bands. The company details
moved onto the sheet under the form, where a letter puts the address.

Three contrast failures were found and fixed on the way, all the same trap the
file had already documented twice: `opacity` on a text colour. Ink at 0.78 on
the wall measured 3.66 to 4.31:1. A fourth came from the room being twice as
tall as the bench `.rk-studio`'s gradient was tuned for, so its floor is
raised for a tall room only (`.rk-room`); `/media` and `/team` keep the
gradient they were measured on.

### 3.4 `src/lib/animations.ts` is deleted

It had zero importers for the life of the project, and it could not get any:
framer-motion writes opacity inline, the contrast sweep cannot force an inline
style to its final frame, and every page using it would photograph mid-fade
and report failures that do not exist. The site's motion is CSS driven through
`Settle`, `Wipe`, `.words-in` and the render kit's entry, all of which the
sweep can settle deterministically. framer-motion stays as a dependency
because `Relief` uses its scroll values to move the lamp, which is a real use.

## 4. What is already in the repo and worth using

Several things were built earlier in the project, never mounted, and only found
by grepping. Check what exists before building anything new.

| Thing | Where | State |
|---|---|---|
| `Stage` | `src/components/render/Stage.tsx` | lighting, tilt, turn, depth, cast shadow, contact shadow. Good. Used in a few places |
| `StudioWall` | `src/components/render/` | episode plates as boards on a lit bench. Now mounted on `/media` |
| `Relief` | `src/components/render/Relief.tsx` | relights the felted marks using the height maps through an SVG lighting filter. Real, and the best thing here |
| `HangingMarks` | `src/components/render/` | the three felted characters on ropes, lit, with a settle and drift. On `/contact`'s deep band |
| Height + normal maps | `public/brand/depth/` | 16-bit, per mark. `make-depth-maps.py` says they exist "to make the normal map react more strongly to a moving light" |
| `framer-motion` + `src/lib/animations.ts` | installed | `charReveal`, `drawPath`, `cardCascade`, stagger helpers. **Still zero importers.** Motion on the site is hand-rolled CSS |
| `.bench` surface | `src/styles/index.css` | the mid-tone the palette lacked. See below |

**The palette had no middle, and this is worth keeping.** Measured: every
section ground sat between 0.94 and 0.57 relative luminance, then jumped to
navy at 0.033. Nothing in between. That is why adding objects never fixed the
flatness: cream cards on tan, with shadows falling on a ground the same value
as the thing casting them. `.bench` (warm umber, luminance 0.11) fills the gap
and is on home, `/journal` and `/shop`. Cream on it is 5.3:1 with a thin
margin, so do not dim text with `opacity` on it and do not brighten its lamp.

**`.grove` is the same band in the show's green**, added 2026-10-13 from the
creative director's revision and spread on the same day. It is written
`className="bench grove"` and all it does is re-point `--color-bench`, so every
bench rule (cream headings, the 0.88 eyebrow, the inverted ink hand, a card
keeping its own ink) follows it across without a second copy of any of it. It
measures equal to the umber, cream at 6.44:1 flat against 6.41 and 5.39:1 under
the lamp against 5.38. It is on home ("An online and offline balance"), `/team`
(the opening band, where the faces are) and `/media` (the statement band). The
two hues run three bands each on purpose: olive is a second room, not a
replacement for the umber.

**mtmn.ie's render style, for reference**, since David asked for it by name:
`internal/mtmn-digital` builds layered coded renders, a base plus "part" layers
that parallax on `--dx`/`--dy`, a sweep highlight, and a lit pass over a masked
light position. Pure HTML/CSS/SVG, no image generation, which is exactly what
this project's no-AI-imagery rule requires. `Stage` here already uses the same
`--lx` light variable and `--rk-` prefix: somebody started porting that kit and
stopped.

---

## 5. Hard constraints, non-negotiable

- **No AI-generated imagery anywhere.** No stock photography of families or
  children. Never fabricate a photo of a real person.
- **Never an em dash or an en dash**, anywhere, including code comments and
  commit messages.
- **No invented claims, statistics, testimonials, logos or awards.** A missing
  fact goes in `CONTENT-NEEDED.md`.
- **WCAG 2.1 AA measured, not assumed.** Mobile first, 390px must work.
- Spelling: The Pawsitive Pugs & Pals(R), PupsPlayer(TM), CLÉ Family Media,
  Conor Sexton.
- Price comes from the database, never the client. No secrets in the repo.
- Commit as DavidW1107, single short imperative subject, no bullet bodies.

---

## 6. QA tooling: it works now, do not rebuild it

`scripts/qa/` holds `audit.mjs` (overflow + pixel contrast, stitched full-page
captures), `hero.mjs` (hero copy over 8 frames of the film), `hero-resume.mjs`,
`shot.mjs` (capture one element) and `contrast.py`.

Four defects were fixed in it this session, each masking the next. It is now
deterministic: repeated full sweeps return identical results, and
`--calibrate` still catches a planted 3.0:1 line. The traps, so nobody
reintroduces them:

1. Reveals were measured mid-fade. Durations are now zeroed and an interval
   re-marks anything that arms during the capture scroll.
2. Do **not** force `opacity: 1` on everything to settle reveals. `/app`
   switches three device screens with `opacity-0`; forcing them visible stacks
   all three and reports contrast failures for text nobody can see.
3. Lenis smooths `window.scrollTo`, so slices were photographed mid-flight and
   the stitched image was offset from the measured coordinates. The capture now
   waits for the scroll to land.
4. Failures print **after** their page's `h=` line. I misread this and spent a
   long time debugging `/shop`, which was never failing.
5. **One sweep at a time, and never rebuild under a running one.** Added
   2026-10-16. Two sweeps against one preview server, or a `vite build` while
   a sweep is walking the pages it is about to photograph, produces nonsense
   that looks exactly like real findings: one run that afternoon reported 23
   contrast failures and 12 pages that never loaded, and the identical run on
   its own a minute later returned 0 and 0. "Pages that never loaded" above
   zero is the tell. Re-run before believing anything.
6. **A loaded machine brings trap 1 back, and it has its own tell.** Added
   2026-10-24. Zeroing the durations settles reveals on an idle box; with the
   load average over 20, because other sessions are running `tsc`, `vitest`
   and a game, the sweep intermittently samples text that is still fading.
   `/team` returned 0, 11, 0, 19, 0, 0 and 1 across seven identical runs that
   evening. **The tell is the reported foreground colour.** A real failure
   names a token: muted is `#6b4e3a`, red-deep is `#8e2428`. A phantom names a
   lightened near-miss of one, `#755945` or `#9a3f3d`, which is the token
   composited at partial opacity, and a different element flakes each run.
   When in doubt, read the hex out of `index.css` and do the arithmetic by
   hand rather than re-running the sweep for a third opinion. **Do not try to
   fix this by exempting the header from the sticky flattening.** That was
   tried the same evening on a hunch about the home page's nav, and it added
   two new phantom failures of its own.

Run it from a built preview:
`npx vite preview --port 4318 --strictPort`, then
`node scripts/qa/audit.mjs --port 4318 --out /tmp/x` and
`node scripts/qa/audit.mjs --port 4318 --out /tmp/x390 --width 390 --height 844`.

---

## 7. Current state

Last full verification, 2026-10-24, from a built preview on port 4700: 1440
and 390 sweeps, all fourteen routes, typecheck and build clean including
`api/`.

**THE CLIENT'S REVIEW DOCUMENT OF 22 OCTOBER IS APPLIED**, 2026-10-24. Read
`COPY-REVIEW-2026-10-24.md` first: it is the consolidated copy document the
review asks for and it lists every change, page by page, with the eight things
CLE still has to send. The three that change the code rather than the words:

- **The six review stages are gone.** They were the spine of four pages and
  came from the company's own written account; the review withdraws that
  account for one of repeated whole-group reviews. Five phases now, from
  `PHASES` in `src/components/team/people.ts`. Nothing carries a per-stage
  owner, a "signed off by" line, or the red band saying a release can be held,
  and `QUESTIONS.md` #37 explains what replaced each.
- **`/case-study` is new**, and its questionnaire is shut by two independent
  gates: `STUDY_OPEN` in `src/components/casestudy/config.ts` for the browser,
  and `STUDY_OPEN` in the environment for `api/study-response.ts`, which
  refuses a POST outright. **Migration `0007` must not be applied** until CLE
  agrees the participant information and the handling of responses. The
  privacy policy now promises that information will be published on the page
  before it opens.
- **The statistics panel is gone**, replaced by quotations from parents and
  educators which have not been supplied. The four empty testing figures the
  creative director's deck asked for no longer have a home on the site.

Two traps found on the way, both now fixed and both worth knowing:

1. **Playwright moved.** `scripts/qa/*.mjs` borrowed it from
   `internal/M.ind/node_modules`, which is gone. They now borrow from
   `internal/iacchus`. If a sweep dies with MODULE_NOT_FOUND, point them at
   any repo on this machine that has Playwright.
2. **`AssetPlaceholder` was failing AA and nobody had seen it.** Its source
   line was `text-ink/55`, which measures 3.45:1 on the clay fill. It had
   never been measured because no page had ever actually rendered a
   placeholder: every null asset was a slot the page skipped. The Story page's
   two real dogs are the first, and the sweep caught it the same hour.

**A layout pass ran on 2026-10-24**, after the review document went in, and
four of its decisions are load bearing:

- **Section eyebrows are gone.** Twenty-two of them: the mono uppercase label
  parked above a heading ("What we believe", "The evidence", "Press"). David's
  words were "the shit AI snarky eyebrows", and the global brief retired the
  pattern by name on 2026-09-03. `Kicker` survives for four transactional
  labels on `/download` and one on `/app`, which are status messages rather
  than section furniture. Do not put them back.
- **The header is a menu now.** Five items, with `About` holding Our story,
  Our team, Responsible AI and Case study. It is a click menu, not a hover
  one, with Escape, outside-click and route-change all closing it. The
  alternative David asked about was merging `/story` and `/team`: measured at
  about twenty-five phone screens, nearly double the longest page on the site,
  so the pages stayed and the menu does the joining.
- **The slip board centres its last row.** Five slips into three columns left
  a hole at the right. The fix doubles the columns and spans two, which is
  geometrically identical, and the selectors are written for any count so a
  later edit to `PHASES` cannot silently break it. Watch the specificity: an
  unbounded two-across rule also matched the fifth slip at the three-across
  step and stacked the board down the left edge.
- **The home page's contact band is no longer three equal columns.** Three
  matched cards with three identical calls to action is the most recognisable
  shape in generated web design, and the page was solving five sections as an
  evenly divided grid. Broadcasters now takes the wide column because the
  brief puts them first.

**A second layout pass ran on 2026-10-24**, on David's words "some screens,
most prominently the our story page, are weirdly confined to a central column"
and "we still have issues with too much text and just blocks of text". Both
turned out to be one measurable fault each, and the measurements are the point:

- **`Container` had four independently centred widths, so a narrow section was
  centred in the VIEWPORT rather than aligned to anything.** At 1440 the header
  and footer run at the 1560 cap and start their content at x=32, while every
  `default` section started at x=240. Two hundred and eight pixels of mismatch,
  on nine sections across six pages, and `/story` alternated between the two
  five times down its length. The shell is now always the wide one with the
  same gutter, and the width names only cap the content inside it, left
  aligned. `className` moved to the inner box, which is what every call site
  was already styling. **If a section needs a narrower measure, it still asks
  for one; it just no longer floats free of the page while it does.**
- **`/story`'s letter has a third track.** Aligning it freed about 450px down
  the right, and the page already had three objects with nowhere good to be:
  the four faces and the gap drawing were squeezed into a 224px margin that was
  also carrying a heading and a note, and the characters frame was pushed to
  the right edge of a 560px measure. The prose track is 38rem flat, which is
  35rem of measured 56ch plus the 3rem its rule and padding cost; a fractional
  track would let the measure drift, which is what the cap exists to stop. The
  two drawings the text WRAPS around stayed in the prose on purpose.
- **The `/team` biographies were the blocks of text, and it was measurable:
  103 to 140 characters to the line, in a 1,056px column with nothing in it but
  prose.** Nothing else on the site is over 80. They now run at the same 38rem
  as the letter, the phase list moved out of the top of that column into a
  third track, and the career history behind each opening paragraph is a
  disclosure. **Nothing was cut**: every word the team supplied is still on the
  page. `/team` went from 6,295px to 5,307px at 1440.
- **The roster still has no portraits**, and that was re-confirmed rather than
  overlooked: it was offered on 2026-10-24 and declined. The face strip in the
  opening band is the page's one face list.

**The eight photographs of Finn and Fia landed on 2026-10-26** and are wired as
a gallery on `/story`, replacing the two labelled holes. Worth knowing:

- They are the **only real photography on this site.** Everything else is a
  frame from the animated series. `components/story/RealDogs.tsx` carries the
  reasoning for the labelling, which changed: the claim is made once, in the
  standing line, rather than under all eight plates.
- **The layout justifies on the files' own aspect ratios**, read through
  `brand.ts` rather than written down. Each row is a flex line with
  `flex-basis: 18px` (8px of mount each side plus the card's 1px border) and
  `flex-grow` set to the ratio, so the remaining width is shared in proportion
  to shape alone and every plate in a row lands at the same height.
- **Export every photograph at even pixel dimensions.** AVIF here is written
  through ffmpeg at `yuv420p`, which cannot hold an odd edge and silently pads
  to the next even number. A file at 800x495 becomes an AVIF at 800x496, the
  served ratio stops matching the one the layout was given, and a row comes out
  two pixels uneven with its captions off the line. The export script
  (`scratchpad/export-dogs.py`, not in the repo) rounds both edges to even.
- `finn-4` is cropped 15% off the top, where a handler's hand was in frame.
  Nothing else is cropped.
- **No EXIF ships.** The originals carry camera, timestamp and Camera Raw
  history.
- It costs about 925px of scroll at 1440 and about 2,500px at 390, where the
  plates stack one per line. Two-up on a phone was tried and rejected: at 390 a
  portrait comes out 118px wide, and a plate pinned to a minimum width stops
  growing in proportion to its ratio, which breaks the justification.

**The three narrow sections on `/ethical-ai` were widened on 2026-10-26**, which
is the one thing the 24 October pass left open and flagged. Fixing `Container`
gave every section the header's left edge, but it did not give those three
anything to do with the right of the page: the statement, the six commitments
and the questions all still capped at 1024 inside a 1560 shell, one after the
other, so the right third sat empty for about 2,200px of scroll on the page an
investor is most likely to read closely. All three now run full width, and each
keeps its measure a different way, because three sections solving it the same
way is its own kind of sameness:

- The statement puts its heading in a left track and the two refusals beside
  it, rule between them unchanged.
- The six commitments run **two-up**, titles over bodies. That is what spends
  the width honestly rather than stretching a column, and it took about 900px
  of scroll out of the page. The title cap opens from 16ch to 26ch at that
  breakpoint, because a cap sized for a side track broke four of the six titles
  onto three lines once they sat above the body instead of beside it. The rows
  carry `content-start`, or the grid stretches each row's title box and the two
  bodies in a row start at different heights.
- The questions put the heading in the margin and let the sheet take the width.
  The answers keep their 62ch cap, so the width becomes paper, not a longer
  line. Air inside an object reads as an object; air beside a column reads as a
  mistake, which is what the section was.

**The break is `xl` (1280), not `lg`, on all three.** Below 1280 the shell is
already narrower than the 1024 those sections used to cap at, so there is no
spare width to spend and the stacked reading is the better one. **No reading
column got wider**: the widest measure on the page is still 558px, the same
62ch cap as before, verified at 1440 and 1600. `/ethical-ai` went from 6,366px
to 5,802px at 1440; the phone layout is byte-for-byte what it was.

**A mobile pass ran on 2026-10-16** and found four things the contrast and
overflow sweeps cannot see, all now fixed. Worth knowing because the first is
a trap anyone reusing the render kit will hit again:

- `.rk-item::after` is the bench's shelf, absolutely positioned at the item's
  bottom with `z-index: 1`. `.rk-corr` reuses `.rk-item` as a plain layout
  column, so the shelf was being painted across the bottom of that column and
  cutting the last line of text in it in half: on `/contact` at 390 the words
  "Read who each of them is" were sliced through the middle. Killed on the
  two rooms that are not benches.
- The wall of faces was three across at every width, which on a phone is a
  110px column. The portraits became thumbnails and, on `/app`, the sentence
  under each reviewer set two or three words to the line. Two across below
  30rem.
- Three places set type below 11px: the mount captions at 9.5px, the journal
  masthead rail at 10.5px, and the evidence citations in a 19px high box,
  which is the only thing on the site that was under the 24px WCAG 2.2 target
  size. All raised.
- The team strip scrolls sideways on a phone and said so nowhere, so the face
  cut by the band's edge read as a broken grid. It carries the filmstrip's
  own cue now.

Still open and waiting on Conor, both logged in `CONTENT-NEEDED.md`:

- **The AI-imagery claim.** `/media`'s press kit used to state "No AI-generated
  imagery is used on this site". `src/lib/brand.ts` records that the stage 1
  audit found the brand kit "almost entirely AI-generated" and calls the live
  hero "the strongest generated image on this site". The sentence was pulled on
  David's instruction. Conor needs to say what is true before anything replaces
  it, especially as the Responsible AI page already names Runway for visual
  production.
- **The six portraits** are six photographs taken in six different places and
  do not sit together. The dark bench on `/team` mitigates it. Only one sitting
  actually fixes it.

Separately, these are product gaps rather than design, found by a cold review
and not addressed: the admin panel's controls do nothing and `content_blocks`
has no consumers, so the CMS Conor is meant to run from his phone is not wired
up; the app launch toggle is a compile-time constant; order recovery by payment
email is impossible because the webhook stores no email; the legal pages carry
a draft disclaimer and no registered company details; and the shop takes
payment for digital content without the Article 16(m) consent step.

## 8. What is next on the design

Read section 2 first. The failure mode is timid moves, not wrong ones.

1. **The product gaps in section 7 are now the biggest risk, not the design.**
   An admin panel whose controls do nothing is a worse thing to show Conor than
   a flat section.
2. `/media` and `/shop` are the thinnest pages left. Both are lists of objects
   and both would carry the bench and the render kit the way `/team` now does.
3. The home page's "A named person at every stage" block is the third list of
   the same six faces on the site. It is a candidate for the same treatment as
   the review board, or for cutting.
4. Whatever is next, capture the whole page at 1440 and at 390 and look at it.
   Judging a change from a crop of the component is how three of these sessions
   went wrong.
