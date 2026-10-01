# QUESTIONS, CLÉ Family Media corporate site

Running list of things to confirm rather than guess. Add, never delete, mark answered inline with the date and the answer.

Status key: **BLOCKING** stops work now · **OPEN** needed before a named stage · **PARKED** nice to have

---

## Blocking now

### 1. BRAND TOOL KIT, where is it, and how do I get it into the build environment?
**BLOCKING, stage 1 (asset audit and design tokens) cannot start.**

The folder is not present. Searched, and found nothing:
- the whole container filesystem, for `BRAND TOOL KIT` and close variants
- the repo (`Alanb-21/CLEMedia` is empty, zero commits)
- Google Drive on `brosnanalan48@gmail.com`: folders named `*BRAND*`, titles
  containing `CLE` / `Pawsitive` / `Pugs` / `Tool Kit` / `Toolkit` / `Sexton`,
  all folders shared with the account, and a full-text search for
  `Pawsitive` / `CLÉ Family` / `PupsPlayer`
- any font, image or design source file (`.otf .ttf .woff .ai .psd .svg .png .jpg .sketch .fig`)
  anywhere in the user areas of the container

Two separate things are needed:
1. **The path or location** of the kit.
2. **A delivery route.** This build runs in an ephemeral cloud container, so a
   folder on a local Mac or PC is not reachable from here. Workable options:
   share the Drive folder with the build account, commit the kit to a branch of
   the repo, or upload it into the session.

Note: the original client handoff doc lists the brand kit under *"Content/assets
expected from Connor"*, alongside the image folder, team details and garden
imagery, so it may simply not have been delivered yet. Worth confirming with
Conor before hunting further.

**ANSWERED 2026-09-19.** Delivered. Kit is on Alan's Mac at
`/Users/alanbrosnan/Downloads/BRAND TOOL KIT` and reachable from the build
session as an additional working directory. 741MB, 355 files, 13 top-level
folders. Audited in full. The earlier "not present" note was written from a
cloud container that could not see it. **Resolved.**

### 2. Live show site review, blocked by network policy
**BLOCKING for design fidelity, not for scaffolding.**

`pawsitivepugs.com` and the reference site `m.ind.coach` are both refused by
this environment's egress proxy (`CONNECT tunnel failed, 403`). I cannot read
either directly to extract tone, palette, typography or the current people list.

Need either: the domains allowlisted on the environment, or a set of full-page
screenshots plus the current team/advisor copy pasted in.

---

## Open, needed before the stage named

**ANSWERED 2026-09-19.** Egress works from this machine. `pawsitivepugs.com`
fetched (200, Wix-hosted). Brand fonts and palette pulled from its live CSS and
folded into `DESIGN-TOKENS.md`. `m.ind.coach` still worth a look for feel, but
no longer blocking. **Resolved.**

### 3. Exact hex values and font files, confirmed from the kit
Blocks stage 1. Also: **are the typefaces licensed for web embedding?** If the
show site uses a desktop-only licence, a webfont licence has to be bought or a
substitute agreed. Do not assume the show site's usage is compliant.

**ANSWERED 2026-09-19.** Both halves resolved, see `DESIGN-TOKENS.md`.

Hex: `--cle-clay #BC9E86`, `--cle-cream #E6D4BC`, `--cle-red #A32E32`,
`--pups-blue #B5E2F6`. Agreed across the live site CSS and the flat swatches in
`OTHER IMAGES/wall 000.jpg`.

Fonts: **Calistoga** (display, one weight) + **Montserrat** (body, variable).
Both **SIL OFL 1.1** via Google Fonts, so web embedding is free and permitted.
No webfont licence to buy, no substitute needed. Self-host as WOFF2 rather than
using the Google CDN, to keep visitor IPs out of Google's hands.

One consequence that needs a decision, carried as **#20** below: the brand
palette contains no colour that passes WCAG AA as text.

### 4. The UX designer's proposed colour direction, replacing or extending?
Blocks stage 1. The brief says retain the existing palette; a separate designer
colour direction is also referenced. These conflict unless one extends the
other. Which governs?

### 5. Final team and advisor list, with bios and photographs
Blocks stage 6 (`/team`).
Starting point taken from the live show site, **all to be confirmed and
expanded, none treated as final copy**: Conor and Lydia Sexton (Executive
Producers, founders), Paula Walshe (Education Director), Kirstie Harding (Early
Learning Advisor), Al Compton (Creative Director).
Need: correct spellings and role titles, who is core team vs advisory board,
substantive bios, cleared photographs, and any advisor not on the show site.
The creative director's track record needs its own supplied copy.

**PARTIALLY ANSWERED 2026-09-19, and the starting list above is wrong.** The
show's own end-credit cards (`CREDITS/01-07.png`) give names and roles that
contradict what was inferred from the show site:

| Name | Credited role |
|---|---|
| Conor Sexton | Created by · Executive Producer |
| **Lydia Harding** | Co-Producer |
| Kirstie Harding | Early Learning Advisor |
| Paula Walshe | Educational Content Advisor |
| Al Compton | Written & Directed By |

Three corrections: **Lydia is credited as Lydia Harding, not Lydia Sexton**, and
as Co-Producer, not Executive Producer. Paula Walshe is **Educational Content
Advisor**, not Education Director. Al Compton is credited **Written & Directed
By**, not Creative Director. Lydia Harding and Kirstie Harding share a surname;
whether they are related is not stated and is not being guessed at.

Credits are a stronger source than the site, but they are show credits, not
company roles. **Still needed:** confirmation of each person's CLÉ title, who is
core team vs advisory board, written bios, and cleared photographs. See #21, no usable photograph of any of these people exists in the kit.

### 6. Founder story source material
Blocks stage 6 (`/story`). Does interview material or a written piece exist, or
does this need to be written? If written, by whom?

### 7. Who is writing the site copy, and by when?
Blocks stages 5-10. Every page needs real copy. Nothing will be invented, so
unwritten sections ship as marked placeholders.

### 8. The four journal categories, named, and the first four posts
Blocks stage 7.

### 9. Garden imagery, does usable photography exist, and who owns the rights?
Blocks stages 3 and 5. This is a candidate hero and full-bleed section break, so
resolution and orientation matter. Commercial use must be cleared.

### 10. Real-dog photography, available, and cleared for commercial use?
Blocks stage 5. The handoff doc mentions "the real pugs that inspired the
characters" as a content theme.

### 11. Stripe account details, and VAT treatment on digital goods
Blocks stage 9. Test keys to build against; live keys at launch.
**VAT is a question for the client and their accountant, not for me**, EU
digital-goods VAT on B2C sales has place-of-supply rules I will not guess at.
Confirm whether Stripe Tax should be switched on.

### 12. The first set of shop products, priced, with final PDFs
Blocks stage 9. Roughly €3-4 each per the brief.

### 13. mSocial: exact workflow with David
Blocks the integration flag. Automatic publish or approval-gated? Is there an
actual API and docs? Are Instagram and Facebook in scope, or LinkedIn only?
Until answered, this ships as a documented outbound webhook, flagged off.

### 14. App: store links, screenshots, confirmed launch date, and who flips the switch
Blocks stage 8. Target is mid-October 2026, launching with the site.

### 15. Domain for this site, and where is DNS managed?
Blocks stage 13. Also decides the canonical strategy that keeps this site from
competing with `pawsitivepugs.com` in search.

### 16. Analytics: Plausible or GA4?
Blocks stage 12. The answer determines whether a cookie consent banner is
required: Plausible is cookieless and generally needs none, GA4 does. This is a
GDPR question for an Irish company, so the client should decide deliberately.

---

## Parked

### 17. Press kit, do downloadable assets exist for `/contact`?

### 18. Email notifications, Resend, or Supabase functions?
Resend needs an account and a verified sending domain. Whose?

### 19. Is there a second admin user at launch, or Conor only?
Schema supports more; the question is what to seed.

---

## Raised by the stage 1 asset audit, 2026-09-19

### 20. The brand palette has no accessible *neutral*. Approve the added ink ramp?
**BLOCKING, stage 1 token gate.**

**Corrected 2026-09-19**, the first version of this entry said the palette had
no accessible colour at all. That was wrong. Brand red `#A32E32` is **7.01:1 on
white**, which passes AAA, and white on red is also 7.01:1, so red works as text
and as a button fill.

The real gap is narrower and still real: there is no accessible **neutral**.
Clay `#BC9E86` on white is **2.51:1**, cream `#E6D4BC` on white is **1.45:1**;
WCAG 2.1 AA needs 4.5:1. Red is the rationed accent, so it cannot carry body
copy either, a page set in red is unreadable whatever the ratio says.

The show site sidesteps this by setting text in black or white. A type-led
corporate site cannot, so `DESIGN-TOKENS.md` proposes a dark ink plus a clay
ramp derived from the brand hue (`--ink #1A1614`, `--body #4A352A`,
`--muted #6B4E3A`). These are additions to the palette, not replacements, and
the brief says retain the existing palette, so Conor should approve them
explicitly rather than have them slipped in.

### 21. There is no usable CLÉ Family Media logo, and no real photography of anyone
**BLOCKING, stages 1, 4, 5, 6.**

Two separate gaps, both serious for a credibility site.

**The company logo.** The kit holds no vector anywhere: 212 PNG, 141 JPG, 2 PSD,
zero SVG/AI/EPS. The only CLÉ company marks are `LOGOS + ICONS/CLE logo.jpg`, a
3D felted render where the letters are a caterpillar, a lion and an elephant,
and a 3D script monogram whose filename is a Nano Banana prompt. Neither
survives a 32px favicon, a mono footer lockup or an OG card, and neither reads
as a corporate mark. Needed: a flat CLÉ Family Media wordmark in vector, or
approval to draw one and set it in Calistoga.

Usable as-is, by contrast: the **show** logo `logo-black.png` / `logo white.png`
is flat, clean mono and vectorises fine, and `PP-logo.png` (the PupsPlayer paw
and play button, flat `#B5E2F6`) does too.

**The people.** `PEOPLE/` contains five **AI-generated 3D cartoon avatars**, not
photographs. There is no photograph of Conor, Lydia or any advisor anywhere in
the kit. The brief requires real photography of founders and team, forbids
AI-generated imagery, and forbids fabricating a photo of a real person, so these
five files cannot be used in any form. A photo shoot or supplied headshots are
the only route to `/team` and `/story`.

### 22. Almost the entire kit is AI-generated. Where is the line on this site?
**BLOCKING for `/ethical-ai`, and a live reputational risk.**

This is not an inference from style. Filenames and XMP carry the prompts:
`Nano Banana 2 - create a close up of the wool butterfly.png`,
`ChatGPT Image Jun 10, 2026...`, and dozens more across `GENERAL EPISODE
STILLS`, `MOCK-UPS`, `FRAMES`, `TITLE SLATES`, `OLDIES INTRO STILLS` and
`LOGOS + ICONS`. The garden that the brief floats as the hero candidate is
AI-generated too, not photography of a real garden.

The site's most important trust page tells investors and educators that AI is a
production tool inside a human-led process and never the author. If a journalist
drops the site's own hero image into a detector, or simply reads the filenames in
the kit, the position has to hold up. It probably does for *show frames*, those
are the animated output of the production pipeline, and a cartoon is not passed
off as a photograph. It does not hold for a **founder's face**, a **company
logo**, or a **photograph of the real garden**.

Proposed line, needs Conor's sign-off before any of it is built:

- **Fine:** show frames and character art used as show frames, clearly the
  animated product, in the show cross-link module and as small accents.
- **Not fine:** anything AI-generated presented as a photograph of a real
  person, a real place or a real product. That means `PEOPLE/`, the felted CLÉ
  logo, the "garden" stills used as if they were the actual garden, and every
  `MOCK-UPS` packshot if the shop sells a physical product.
- **Needs a decision:** whether the show's own AI production pipeline is stated
  plainly on `/ethical-ai`. Hiding it is the bigger risk.

### 23. Do real photographs of the garden, the pugs or the team exist at all?
**BLOCKING, stages 3 and 5.** Follows from #22.

Nothing in the kit is a photograph. If real photography of the garden, the real
pugs behind Finn and Fia, or the team exists on Conor's phone, a camera roll or
a hard drive: it is the single highest-value thing he can send. If it does not
exist, a shoot needs scheduling now, because it gates the home hero, `/story`
and `/team`, and four weeks is not long.

### 24. Is `wall 000.jpg` / `wall 001.jpg` the official palette sheet?
**OPEN, confirms stage 1.** Both are flat two-tone clay-over-cream swatches and
match the live site CSS to within JPEG drift, which is why they were treated as
the palette source. Worth one line of confirmation that they are the intended
brand swatches and not a set dressing texture that happens to match.

---

## Raised by the 22 September handoff and AI policy documents

### 25. Is the company CLÉ Family Media or CLE Family Media?
**BLOCKING for launch, trivial to change.**

The 22 September handoff writes **CLE** throughout, with no accent anywhere in
roughly fifteen occurrences. The supplied corporate logo also reads **CLE**,
though its letters are felted animals, so an acute may simply not be
representable in that form.

The original brief to MTMN was emphatic the other way: *"the company is CLÉ
Family Media (note the É)"* and *"get these right everywhere"*.

The site currently uses **CLÉ**, because that was an explicit instruction and a
Word document losing diacritics is common. This needs one confirmation, then it
is a single find and replace either way. It should not reach launch unresolved:
getting a company's own name wrong on its corporate site is the sort of detail
that costs credibility with exactly the audience this site is for.

### 26. Does the corporate site host a shop, or not?
**BLOCKING for scope. Built and working today.**

The handoff states plainly: *"The corporate site does not duplicate episode
pages, host a shop, or manage product logins under this proposal."*

The original brief specified the opposite in detail: a digital shop selling
downloadable PDFs at €3 to €4 via Stripe Checkout, with a webhook, single-use
download tokens and a private storage bucket.

All of that is built, tested and on the branch: `/shop`, `/shop/:slug`,
`/download/:token`, `/api/create-checkout-session`, `/api/stripe-webhook`,
`/api/download`, the `products` and `orders` tables and the `product-files`
bucket.

**Nothing has been removed**, because deleting working commercial functionality
on a document's say-so is not a call to make unilaterally. Three options:

1. **Keep it.** The newer document is describing proposal CFM 02's scope, and
   the shop was scoped separately. Nothing changes.
2. **Hide it.** Pull `/shop` from navigation, leave the routes and API in place
   behind the scenes. Reversible in minutes.
3. **Remove it.** Strip the routes, the API handlers, the two tables and the
   private bucket.

Needs an answer before launch, and the answer also decides whether the VAT
question (item 11) still matters at all.

### 27. WCAG target moved from 2.1 AA to 2.2 AA
The handoff specifies **WCAG 2.2 AA**; the original brief said 2.1 AA. 2.2 is a
superset, so nothing already built becomes non-compliant, but the accessibility
pass now needs to cover the nine additional 2.2 criteria, notably target size,
dragging movements, focus appearance and consistent help. Treating 2.2 AA as
the target from here.

### 28. People whose role descriptions still need their own approval
The handoff is explicit: *"Name only people who approve their role
descriptions"* and *"confirm names, titles and permissions before publishing"*.

Currently on the site, all flagged unconfirmed: Conor Sexton, Al Compton,
Dr Paula Walshe, Lydia Harding, Kirstie Harding, Mansi. **Mansi's surname is not
given in any document supplied.** Strategic advisers are shown as a deliberately
empty section until names, titles and permissions are confirmed.

### 29. The "Colour Quest" case example
The handoff asks for one concrete, permission-cleared example: the team found
issues in final review, revised the work, and released after approval. That is
the single most persuasive thing that could go on the Responsible AI page,
because it shows the review process actually stopping something.

Needed: permission to name the episode, and enough detail to describe what was
caught and what changed. Not written yet, because inventing the specifics of a
real production incident would be worse than leaving it out.

### 30. Evidence: and what may not be shown
The handoff rules out displaying, without approval and supporting records:
school names, participant images, partner logos, expert quotations, view counts,
and the "100 plus settings" figure. The evidence section is built to separate
observed feedback from formal research and currently asserts neither. Nothing
goes in until dated, sourced and cleared.

### 31. Materials the handoff commits CLÉ to supplying
Week 1: full-resolution Finn and Fia artwork, permission-cleared team portraits,
work-in-progress visuals, show screenshots, approved trailer links, the domain
decision, and a one-hour story and process call with Conor, Al and Paula.
Week 2: approved bios, advisers' role descriptions, cleared quotes and logo
permissions, evidence notes and dates, and app status wording.
Week 3: admin editor names and emails, newsletter destination and consent text,
contact routing and autoresponse recipients.

The team portraits are the critical path. `story.lead` and every team photograph
stay as placeholders until real, cleared photography exists.

### 32. Names and titles in the bio handoff (2026-10-01)
The "Team Bio & Photos" document names people differently from the handoff this
site was built on, and the document now wins everywhere: Alan Compton (was Al),
Lydia Harding (was Lydia Sexton), Conor as Founder and CEO (was Founder),
Kirstie as Child Development Consultant (was Early Learning Advisor), and Paula
Walshe PhD (was Dr Paula Walshe). Paula's book is Full STEAM Ahead; an earlier
draft of the home page credited her with Síolta in Practice, which her own
biography does not claim. That has been corrected.

Three things the document does not settle:

1. **Kirstie's surname.** The document gives none. She is listed as "Kirstie"
   on the team page and the home page. The earlier handoff said Harding.
2. **Job titles for Alan, Lydia and Paula.** The document gives a title for
   Conor, Kirstie and David only. Creative Director, Executive Producer and
   Education Director are carried over from the earlier handoff and need each
   person's confirmation.
3. **Mansi.** No photograph and no biography arrived for her. She appears on the
   team page with the single line the earlier handoff supports, and is left off
   the home page's six-face grid rather than shown as the one blank tile.

### 33. The family photographs in the bio handoff
Four of the ten images are family snapshots, three of which show a baby's face:
a Christmas photograph, two phone screenshots of the same couple, and a
Halloween photograph outside a house. None is used. Two reasons, in order:
they are personal photographs rather than editorial ones and would not raise the
page they sat on, and publishing a child's face needs that child's parents to
have agreed to it in writing on a site whose whole argument is child wellbeing.
Held, not deleted. Say the word if any is wanted and the consent exists.
