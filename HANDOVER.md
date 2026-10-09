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

### 3.3 `src/lib/animations.ts` is deleted

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
and is on `/journal`, `/team` and home. Cream on it is 5.3:1 with a thin
margin, so do not dim text with `opacity` on it and do not brighten its lamp.

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

Run it from a built preview:
`npx vite preview --port 4318 --strictPort`, then
`node scripts/qa/audit.mjs --port 4318 --out /tmp/x` and
`node scripts/qa/audit.mjs --port 4318 --out /tmp/x390 --width 390 --height 844`.

---

## 7. Current state

Last full verification, 2026-10-09, from a built preview on port 4318: desktop
and 390 sweeps both 0 overflow and 0 contrast failures across all thirteen
pages, `hero.mjs` 0 failures over 8 frames, `hero-resume.mjs` PASS, typecheck
and build clean including `api/`.

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
