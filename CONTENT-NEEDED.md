# CONTENT NEEDED, CLÉ Family Media corporate site

Everything the site needs that has not been supplied. Each entry ships as a
clearly marked placeholder until it arrives: a flat brand-colour block at the
required dimensions with a visible label.

**Hard rules, no exceptions:** no stock photography of families or children, no
AI-generated imagery anywhere on this site, no fabricated photograph of a real
person, and no invented statistics, testimonials, "trusted by" logos, awards,
user numbers or research findings. A credibility block with no supplied claim
stays empty and gets listed here.

Status: ❌ not supplied · ⚠️ partial or unconfirmed · ✅ received

---

## Brand assets, BRAND TOOL KIT received and audited 2026-09-19

Kit audited in full: 741MB, 355 files, 13 folders. Palette and typefaces are
resolved (`DESIGN-TOKENS.md`). The logo is not.

| Item | Status | Needed for | Notes |
|---|---|---|---|
| Brand colour palette, exact hex | ✅ | Design tokens, stage 1 gate | `#BC9E86` clay · `#E6D4BC` cream · `#A32E32` red · `#B5E2F6` PupsPlayer. Confirmed against live site CSS + `wall 000.jpg` |
| Typefaces + web-licensed font files | ✅ | Type scale, stage 1 gate | **Calistoga** + **Montserrat**, both SIL OFL 1.1. Free to embed and self-host. No licence to buy |
| Accessible neutral text colours | ⚠️ | Every page | Brand red `#A32E32` passes AAA on white (7.01:1), but clay and cream carry no text at any size and red is the rationed accent. Ink ramp proposed, awaiting approval. QUESTIONS.md #20 |
| Show logo, mono (Pawsitive Pugs & Pals) | ✅ | Show cross-link, footer | `logo-black.png` 1000×333, `logo white.png` 1871×523. Flat, clean, vectorises fine |
| PupsPlayer™ mark | ✅ | `/app` | `PP-logo.png` 2713×2681, flat `#B5E2F6`, 95.7% single colour |
| **CLÉ Family Media logo, vector** | ❌ | Header, footer, OG, favicon | **Does not exist in any usable form.** Only a 3D felted render and an AI 3D monogram. Zero SVG/AI/EPS in the entire kit. QUESTIONS.md #21 |
| CLÉ wordmark, flat / mono | ❌ | Header, small sizes, dark grounds | Same gap. Needs supplying or approval to draw one |
| Favicon / app icon source | ❌ | Favicon set | Blocked on the CLÉ mark above |
| Character art (Finn, Fia, others) | ✅ | Show handoff module, small accents | Plentiful in `GENERAL EPISODE STILLS/`. Supporting cast only |

## Photography, none exists

**There is no photograph anywhere in the BRAND TOOL KIT.** Every image is
AI-generated or a render; filenames and XMP carry the prompts. See QUESTIONS.md
#22 and #23.

| Item | Status | Needed for | Notes |
|---|---|---|---|
| Garden photography | ⚠️ | Home hero, section breaks | The "garden" stills are AI-generated. Cannot be used as the real garden |
| Founder photography, Conor, Lydia | ❌ | `/story`, `/team` | `PEOPLE/` holds five AI cartoon avatars. Unusable under the brief's hard rules |
| Team and advisor headshots | ❌ | `/team` | None exist. Shoot or supplied headshots required |
| Process / behind-the-scenes / workspace | ❌ | `/story`, `/ethical-ai` | None exist |
| Real-dog photography | ❌ | Show handoff, `/story` | The pugs in the kit are animated characters, not the real dogs |

## Copy

| Item | Status | Needed for | Notes |
|---|---|---|---|
| Home hero, positioning line | ❌ | `/` | One line: what CLÉ is and who it is for |
| "The problem" section | ❌ | `/` | Plainly written, no scaremongering |
| Watch · Play · Learn, three blocks | ❌ | `/` | One short block each |
| Company at a glance | ❌ | `/` | What CLÉ is, produces, and where it is going |
| Research and credibility strip | ❌ | `/` | **No claim ships unsupplied.** Empty until provided |
| Founder story, long-form | ❌ | `/story` | Carries the emotional weight of the site |
| Team and advisor bios | ⚠️ | `/team` | Names + credited roles recovered from `CREDITS/`, and they correct the earlier list (Lydia **Harding**, not Sexton). Still no bios. See QUESTIONS.md #5 |
| Ethical AI, position statement | ❌ | `/ethical-ai` | AI as production tool in a human-led process |
| Ethical AI, process stages | ❌ | `/ethical-ai` | Concept → scripting → creative dev → review. Where a human decides, where a tool assists |
| Ethical AI, safeguards and red lines | ❌ | `/ethical-ai` | The lines the company will not cross |
| Journal, four category names | ❌ | `/journal` | One published per week |
| First four journal posts | ❌ | `/journal` | |
| App page content | ❌ | `/app` | Features, screens, age range, availability |
| App pre-launch copy | ❌ | `/app` | What is coming, target window, notify-me |
| App store links and screenshots | ❌ | `/app` | Not available until launch |
| Media / podcast entries | ❌ | `/media` | UK podcast expected December. Empty state handled meanwhile |
| Shop products, copy, prices, PDFs | ❌ | `/shop` | ~€3-4 each |
| Company registration details, address | ❌ | Footer, `/terms` | Irish registered company details |
| Contact email addresses | ❌ | `/contact`, footer | Separate routes for general / partnership / press |
| Social profile links | ❌ | Footer | |
| Privacy policy | ❌ | `/privacy` | Needs legal review, not to be drafted by me |
| Terms | ❌ | `/terms` | Needs legal review. Must cover digital-goods sale |
| Cookie policy | ❌ | `/cookies` | Depends on the analytics choice. See QUESTIONS.md #16 |
| Press kit assets | ❌ | `/contact` | Optional, omitted if none exist |

## Reference material I could not access

| Item | Status | Notes |
|---|---|---|
| `pawsitivepugs.com` full review | ❌ | Blocked by this environment's egress proxy. Need allowlisting or screenshots |
| `m.ind.coach` design reference | ❌ | Same. Needed to match the intended feel |

---

## Placeholder convention

Every gap renders as `<AssetPlaceholder>`: a flat brand-colour block at the
exact final dimensions, labelled with what belongs there and its row in this
file. They are deliberately visible, never subtle, the client should be able
to scan any page and see precisely what is still outstanding. A build that
reaches launch with placeholders still in it has failed, so this list is the
launch checklist for content.


---

## Brand assets wired, 2026-09-20

Three image slots and all three logos are live. See
`BRAND TOOL KIT/web-exports/2026-09-20/` and `src/lib/brand.ts`.

| Slot | State | Note |
|---|---|---|
| `home.hero` | ✅ | Show frame: bluebells in the garden at sunrise |
| `story.garden` | ✅ | Show frame: the garden with a rope swing |
| `home.characters` | ✅ | Show frame: two pugs and a hen |
| `LOGOS.showBlack` / `.showWhite` | ✅ | One vectorised SVG, coloured by CSS |
| `LOGOS.pupsPlayer` | ✅ | Vectorised SVG |
| `story.lead` | ❌ | **Stays empty.** No photograph of Conor or Lydia exists |
| `home.company` | ❌ | **Stays empty.** No photograph of the team exists |
| `app.hero`, `app.screen1-3`, `home.app` | ❌ | No app screenshots exist. QUESTIONS.md #14 |
| `LOGOS.cle` | ❌ | No vector CLÉ mark exists. QUESTIONS.md #21 |

The three filled slots are **frames from the animated show**, not photographs,
and their alt text says so. They are not a substitute for the photography this
file still lists as outstanding.

---

## Brand objects to export from the BRAND TOOL KIT (added 2026-09-22)

The kit is on Alan's Mac and unreadable from the build. Every item below has a
slot waiting in `src/lib/brand.ts` rendering a labelled placeholder, so
dropping the files into `public/brand/` and setting one `base` per slot is the
whole integration.

Export as trimmed transparent PNG at 2x, metadata stripped. The kit's files
carry XMP with generation prompts in them, which must not ship to a public
website.

| Slot | What to find | Size (1x) |
|---|---|---|
| `object.cle-mark` | The felted CLÉ Family Media mark, on transparent | 900x900 |
| `object.pack` | A felted character group, for the show cross-link | 1200x700 |
| `object.section-marker` | A neutral felted marker with no show wordmark on it | 800x500 |

Still outstanding and still blocking, unchanged from the audit above: there is
no vector CLÉ wordmark anywhere in the kit, which blocks the header lockup, the
favicon set and every Open Graph card. QUESTIONS.md #21.

## Photography still needed

Real photography only. The kit's `PEOPLE/` folder is AI-generated and cannot be
used here, and this site's Responsible AI page makes that a credibility risk
rather than a preference.

| Slot | What | Size (1x) |
|---|---|---|
| `person.conor` `person.al` `person.paula` `person.lydia` `person.kirstie` `person.mansi` | Headshots, square crop, consistent lighting | 900x900 |
| `team.group` | The team together | 1680x945 |
| `process.workspace` `process.review` `process.script` | The room, a review in progress, scripts and notes | 1400x933 |
| `garden.real` `garden.detail` | The real garden the show's world is based on | 1680x945 |
| `journal.default` | Default journal card image | 1200x675 |
| `social.og` | Open Graph card. Blocked on the CLÉ mark | 1200x630 |

Note, corrected 2026-09-23: an earlier version of this file asked for a
photograph of the lettering "being made by hand: wool, hands, tools". That was
written on the assumption that the brand's felted objects are physically made.
The kit's own filenames (`Nano Banana 2 - create a close up of the wool
butterfly.png`) say they are rendered. Dramatising handcraft on the site that
promises transparency would be the worst kind of own goal, so the ask is
withdrawn. Wool stays as the brand's visual language, and nothing on the site
claims anyone wove anything.

---

## Wool objects to export (added 2026-09-23)

How pawsitivepugs.com actually uses wool: as discrete rendered objects standing
in for NAMES. The show wordmark, the episode title plates, the SEASON ONE sign,
the sub-brand marks, the badges, and three small objects in the footer. Its
ordinary section headings are plain set type.

The corporate site follows that, more sparingly. Every item below has a slot
waiting in `src/lib/brand.ts` rendering a labelled placeholder, so dropping the
files into `public/brand/` and setting one `base` per slot is the whole job. No
hand-drawn stand-ins were made: a hand-drawn felted object is worse than an
honest empty slot.

Export as trimmed transparent PNG at 2x, metadata stripped. The kit's files
carry XMP with generation prompts in them, which must not ship to a public site.

| Slot | Kit folder | What |
|---|---|---|
| `wool.show` | LOGOS + ICONS | The Pawsitive Pugs & Pals wordmark |
| `wool.pupsplayer` | LOGOS + ICONS | The PupsPlayer mark |
| `wool.cle` | does not exist | The CLÉ mark. See below |
| `wool.ep1` to `wool.ep4` | **TITLE SLATES** | Episode plates: The Feather, Chicken Vision, The Strawberry, Cuckoo |
| `wool.snuggle` | TITLE SLATES | Snuggle Woods, the announced series |
| `wool.mark.paw` | LOGOS + ICONS | Small felted paw or PPP object, footer |
| `wool.mark.post` | LOGOS + ICONS | Small felted envelope object, footer |

**A note on TITLE SLATES.** `CLAUDE.md` lists that folder under "not relevant:
show content, not migrated". That was written when this site's job was
credibility. The job is now to show the series, so the title slates are the
content, and they are the single highest-value export on this list.

**Still blocking, unchanged.** There is no vector or rendered CLÉ Family Media
mark anywhere in the kit, only a 3D felted render and an AI monogram. It blocks
the header lockup, the favicon set and every Open Graph card. QUESTIONS.md #21.

## The one thing that would most improve this site

A real sent-back episode. The handoff refers to a case; the specifics have never
been supplied. `ReviewGateScene` now states the process with no invented detail,
and there is a marked slot in it waiting for: which episode, what was caught, by
whom, what changed, and how long the release moved.

An earlier build of that component invented all of it (an "Episode 004" sent
back "nine days" with a quoted reviewer note). That has been removed. On the one
section whose purpose is to show this company is honest, invented specifics were
indefensible, and QUESTIONS.md #29 already said so.

## Portraits, supplied 2026-10-01

Five of the six core team plus the strategic adviser arrived in the client's
"Team Bio & Photos" document and are live: Conor, Alan, Lydia, Kirstie, Paula
and David Toth. They are cropped square on the face and carry one warm grade,
which is what lets a studio headshot, a dark editorial portrait and a phone
selfie sit in the same row.

Still wanted, in order of what it would change:

| What | Where it lands | Why it matters |
|---|---|---|
| A photograph of Mansi | `person.mansi`, team page | The one person in the review sequence with no face |
| Higher-resolution Paula | `person.paula` | The supplied file is 438x394, so the 2x is an upscale |
| The team together | `team.group` | No group photograph exists |
| Workspace and review session | `process.workspace`, `process.review` | Responsible AI still illustrates its argument with drawings |
| The real garden | `garden.real`, `garden.detail` | Would replace the generated hero |
| The felting being made | `craft.felting` | The best possible answer to the AI question |

`story.lead` is now closed rather than pending: the Story page opens on a byline
with Conor's portrait instead of a 1680x720 band that never existed.

## From the sub-page rebuild, 2026-10-03

Five pages (Story, Team, Responsible AI, App, Contact) were rebuilt and each
one met the same wall: the design is finished, the fact behind it is not. None
of these gaps is guessed at on the live site. Every one of them is a place
where a section changed shape rather than show an empty frame.

| What | Where it lands | Why it matters |
|---|---|---|
| **Mansi: a photograph and two lines of biography** | `/team`, `/contact`, `person.mansi` | She is the only person in the review sequence with no face. Both pages now give her a text row rather than an empty circle, which works, but she reads as less present than the people beside her |
| **Who reads each enquiry route** | `/contact` | The page shows the whole named team and assigns nobody to a route. Partnership, educator, press and general all land in the same place as far as a sender can tell |
| **A public contact address** | `/contact`, footer | No email, phone, postal address or office hours exist anywhere on the site. The form is the only way in, which is unusual for a company asking distributors to take it seriously |
| **Whether a response time may be stated** | `/contact` | The page deliberately promises nothing. If the company is willing to commit to one, it is the single strongest thing that page could add |
| **App store links** | `/app` | `STORE_LINKS` are null, and the page says "not yet listed" rather than showing a dead badge |
| **Confirmation of the PupsPlayer plan** | `/app` | The six commitments were carried over from the earlier draft and drawn into the coded product render. Conor to confirm they are still the plan, in particular "no advertising to children" and "no surprise purchases" |
| **Launch wording** | `/app` | The page says "In development" with no date. Confirm whether a target window may be published |
| **Where in the sequence the AI tools run** | `/ethical-ai` | The production line draws them between script and direction (02) and educational review (03), which matches the previous diagram and "in final production". Worth one sentence from Conor to be certain, because the drawing makes the claim precisely |
| **A real sent-back episode** | `/`, `/ethical-ai` | Still the single most valuable thing this client could supply. The dashed return path on the production line is drawn and waiting for it: which episode, what was caught, by whom, what changed, how long the release moved |
| **A press pack** | `/contact` | The old page offered one to journalists. None exists, so the offer has been removed rather than left standing |

Closed since the last pass: the PupsPlayer screenshots (`app.screen1-3`) are no
longer blocking, because the product is now drawn in code and captioned as the
plan rather than a screenshot. Real screens replace the render whenever a build
exists.

## From Conor's email, 2026-10-05

**The mission video. LANDED, live on the site.** The file came through on
2026-10-05 (64 seconds, 3856x2144, 37 MB). It is self-hosted rather than put on
YouTube: a third-party player sets cookies and reports every view back to
Google, which is not a thing to put on a children's media company's site when
the alternative is three static files. Shipped as 1080p (15 MB), 720p (7 MB)
and 480p (3 MB), with the rendition chosen at runtime from the window and the
connection, muted autoplay on entering view, and one press for sound. It plays
in two places: a section of its own on the home page, below the argument and
above the series, and full width on `/story`.

Captions are generated from the audio and checked by hand, and they are the
part that needs Conor's eye: `public/video/mission.en.vtt`. One correction was
already needed, "positive pugs and pals" to "The Pawsitive Pugs & Pals". If any
other word is wrong it is wrong on screen for anyone watching with sound off,
which on a muted autoplaying film is most people.

One judgement for Conor rather than for us: the film is animated in the show's
own CG, and this site argues that AI is a tool in a human-led process and never
the author. His own film of his own show is his to place, and nothing on the
page claims it was made any particular way. Worth him knowing it sits two
sections above the responsible-AI copy.

**The family photographs.** Three personal snapshots of Conor, Lydia and their
child arrived as a PDF, with a show still pasted over the child's face in each.
They are NOT on the site and nothing has been prepared from them. They are
personal photographs rather than editorial ones, and the company site does not
need the founder's own child on it to make its argument. If a reason to use one
appears later, the place is the fatherhood section of `/story`, and the child's
face would be covered with a shaped cut-out rather than a pasted rectangle.
Lydia is unwell; this is not a thing to chase.

**The case study.** The section is now built on `/ethical-ai` and renders an
honest statement of what is coming. To fill it, Conor needs to answer, for one
real held release:

| Field | What it needs |
|---|---|
| Episode | The number and title as the show numbers it |
| Caught at | Which of the six stages, by number and name |
| By | The person answerable at that stage, named as they want to be named |
| What was caught | In their own words if possible |
| What changed | What was actually different in the released episode |
| Release moved | A real figure, or nothing at all |

Fill `CASE` in `src/components/ethical-ai/CaseStudy.tsx` and the whole section
renders. No layout work follows.

## Shop and media

### Purchase to download, CLOSED 2026-10-06

The gap raised above is fixed in code. `api/download.ts` now accepts
`session_id` as well as `token` and resolves it against `orders.stripe_session_id`,
and `/download/pending` reads the session id out of Stripe's redirect, retries
six times two seconds apart while the webhook catches up, and falls back to the
pending screen after that. A buyer who has just paid now reaches their file
without anyone being emailed a receipt by hand.

Still to do, and it needs the client: the end to end purchase test at build
stage 9, against live keys, with a real card. Nothing here has been exercised
against Stripe itself.


Added 2026-10-06 with the rebuild of `/shop`, `/shop/:slug`, `/media` and
`/download/:token`. All four pages are built to be good while empty: no product
title, price, page count, publication, logo or quote is invented anywhere on
them, and each empty slot below is visible on the page rather than filled with
something plausible.

### Shop

| Item | Status | Needed for | Notes |
|---|---|---|---|
| **The first products** | ❌ | `/shop`, `/shop/:slug` | Nothing is in `products`. The shelf says so in one line and lists the kinds of thing coming (colouring books, puzzle packs, activity sheets) in the client's own words. The index, the price and the product page all appear by themselves the moment a row is published from the admin panel. Each needs: title, slug, description, price in cents, the PDF in the `product-files` bucket, and a thumbnail |
| **Product artwork** | ❌ | `/shop/:slug` | `products.thumbnail` is a URL into `public-media`. The product page prints it on the drawn sheet, so a flat cover image is enough; nothing needs cutting out. With no thumbnail the page shows the blank sheet and says the artwork has not been uploaded |
| **Page count and age suitability** | ❌ | `/shop/:slug` | The brief asks the product page to state how many pages are in a pack and what age it suits. **`products` has no column for either**, and neither is invented on the page. Two routes: put both in the first line of the product description (works today, no migration), or add `page_count int` and `age_range text` to `public.products` and the admin form. The page's spec docket is where they would go. Needs a decision before the first product goes in |
| **Prices** | ⚠️ | `/shop` | The brief says around EUR 3 to 4. No price is printed anywhere until a real row exists: there is no "from EUR 3" on the shop page, because that is a price nobody has set |
| **VAT treatment on digital goods** | ❌ | `/shop/:slug`, `/terms` | Still for the client and their accountant. The price shown is `price_cents` exactly as stored, with no tax line either way. If prices are to be shown VAT inclusive, that is a sentence on the product page and a note in the terms |

### The gap between paying and downloading

**This is a build gap, not a content gap, and it is the one thing in the shop
that is not finished.**

Stripe's `success_url` is `/download/pending?session_id=…` (see
`api/create-checkout-session.ts`), and nothing maps a Stripe session id to a
download token: `api/download.ts` accepts a token and nothing else, and the
webhook mints the token into `orders` without emailing it. So a buyer who has
just paid lands on a page that cannot reach their file.

`/download/pending` now handles that state honestly: it confirms the payment,
says the link is not on the page, and asks the buyer to send the Stripe receipt
so the file can be sent back by hand. That is a holding position, not a
solution. Closing it properly needs one of:

1. a server route that exchanges `session_id` for the order's token, which is
   the smallest change and keeps the no-account promise intact, or
2. the webhook emailing the download link to the address Stripe collected,
   which costs a sending service and should be checked against the promise that
   a purchase never puts anyone on a list.

Either is an API change and was out of scope for the page pass. Flagged here so
it is not discovered during the stage 9 purchase-to-download test with the
client.

### Media and press

| Item | Status | Needed for | Notes |
|---|---|---|---|
| **The December podcast** | ⚠️ | `/media` | The one real fact: a UK podcast appearance booked for December, with more to follow around the app launch. The index carries it with no show name, host, date or link, because none has been supplied. Needed to publish it properly: the show, the episode title, the air date and the URL |
| **Coverage as it runs** | ❌ | `/media` | `media_items` is empty, so the index shows the booking and one visibly pending row. Any row added from the admin panel takes over the index automatically. A row wants: title, outlet, date, one sentence, link |
| **Press contact routing** | ⚠️ | `/media`, `/contact` | The notes-to-editors sheet sends journalists to the press route on the contact form, because no press email address, phone number or named spokesperson has been supplied. A direct press address would be better on a press page, and so would a named contact |
| **Artwork for press use** | ❌ | `/media` | The sheet says artwork comes through the press route rather than offering a download, because there is no press kit and the CLÉ mark still does not exist as a vector. Worth assembling once the mark lands: logo, character art, episode stills, founder portrait |
| **No logo strip, deliberately** | ✅ | `/media` | Nothing has been written about the company yet, so there is no "as featured in" row and no quote. The page says so in a sentence rather than hiding the gap |

## Journal

Added 2026-10-06 with the rebuild of `/journal` and `/journal/:slug`. The index
is now the journal's own front matter: a masthead, a statement of what the
journal is for, the front page drawn as an object with its lead slot honestly
empty, and the four strands set as a contents page. **No post, headline, date,
author, reading time or category description is invented anywhere on either
page.** The strand names are the only drafted content and they are labelled on
the page as working names.

| Item | Status | Needed for | Notes |
|---|---|---|---|
| **The four strand names, confirmed** | ⚠️ | `/journal` | Still QUESTIONS.md #8. The page ships the four working names (The Research · How It's Made · Parents Helping Parents · Building CLÉ) and says in print that they are working names. A row added to `categories` with a matching slug (`research` `process` `parents` `company`) takes over the name and the description with no code change |
| **The first piece** | ❌ | `/journal`, `/journal/:slug` | `posts` is empty, so the contents reads "In preparation" against every strand and the drawn front page carries "In preparation" in its headline slot. Publishing one post fills the masthead rail, the lead slot, the strand count and the published list at once. A post wants: title, slug, strand, excerpt, body, and a date |
| **The four standing rules, signed off** | ⚠️ | `/journal` | The navy band makes four commitments in the company's name: every piece is written by a person and carries their name, corrections stay on the piece and say what changed, nothing is sponsored and nothing is advertised, and a reader can ask for a subject. The first restates what `/` and `/ethical-ai` already say about the production process. The other three are new and are Conor's to confirm or strike before launch |
| **The cadence** | ⚠️ | `/journal` | "One piece a week, once we start" comes from the handoff note. It is a promise with nothing behind it yet, so it is phrased as the plan rather than as something already happening. Worth confirming before launch, because the first missed week is visible on a page that counts pieces |
| **Author names as they want to be named** | ❌ | `/journal/:slug` | `posts.author` is a free text column and the byline prints it exactly. A post with no author simply has no byline rather than defaulting to the company. Same caution as the team credits: a film credit is not necessarily how someone wants to be named on a company site |
| **Hero images for pieces** | ❌ | `/journal/:slug` | `posts.hero_image` is a URL into `public-media` and the template runs it edge to edge. `hero_alt` is used as both the caption and the alternative text, so it should read as a caption. Without one the piece opens on type, which is a legitimate look and not a gap |
| **`journal.default`** | ❌ | `/journal` | Listed above under photography. The rebuilt index does not use it: the index is a contents page rather than a grid of cards, so there is nothing for a default card image to fill. It is still worth having for Open Graph on a piece with no hero |

**How a post should be written.** `posts.body` is a plain text column and the
public page renders a small Markdown subset, so Conor can write in the admin
textarea with no editor and no HTML: `## ` for a section heading, `### ` for a
sub-heading, `> ` for a pull quote, `- ` for a bullet list, `1. ` for a numbered
list, `---` for a rule, `**bold**`, `*italic*`, `[text](/page-or-url)` for a
link and `![caption](image-url)` for an image. Anything else prints as the
characters that were typed. Stored HTML is deliberately not rendered: it would
put an injection path through the public site for the sake of a convenience in
an admin panel one person uses.

## Contact and utility

`/contact`, `/privacy`, `/terms`, `/cookies` and the 404, from the page uplift
on 2026-10-06. Nothing below has been guessed at on the pages themselves.

| Item | Status | Needed for | Notes |
|---|---|---|---|
| **Registered company details** | ❌ | `/contact`, `/privacy` | Company number and registered office. The slot is BUILT AND VISIBLY EMPTY on the closing band of `/contact` ("not published yet"), because the privacy policy already promises both "at the foot of this page once registration details are confirmed". Two lines of data fills it, and the privacy policy's own promise stops being outstanding |
| **Who reads each enquiry route** | ❌ | `/contact` | The form marks a message as partnership, educator, press or general, and that is all anyone has told us. The page therefore says nothing about who opens which, and names no person against any route. If Conor wants "partnership enquiries reach Conor directly" on the page, he has to say it is true first |
| **A reply time** | ❌ | `/contact` | Deliberately absent. No "we reply within two working days" anywhere, because nobody has committed to one. It is the cheapest credibility line on the page and the easiest to break |
| **A postal address, a phone number, office hours** | ❌ | `/contact` | None supplied, none invented. An address is the one of the three an investor actually looks for; see registered company details above |
| **A press pack** | ❌ | `/contact` | Already listed above from the earlier pass. Still none, so the press route takes a message rather than offering a download |
| **Solicitor review of all three legal documents** | ⚠️ | `/privacy`, `/terms`, `/cookies` | The three pages are typeset as documents now, with numbered and anchored sections, an index and defined terms marked. **Not one word of the clause text was changed**, and every page carries the "Draft, pending legal review" notice at the top of the document. They are drafts until a solicitor has been through them |
| **The date on the legal documents** | ⚠️ | `/privacy`, `/terms`, `/cookies` | `DRAFTED` in `src/pages/Legal.tsx` is `2026-09-20`, the day the wording was last written. It used to be `new Date()`, so the page told every reader it had been updated the day they opened it, which on a GDPR page is a false statement about a legal document. **Change a clause, change that constant in the same edit.** |

**What the three legal drafts do not cover.** Listed for whoever reviews them,
not filled in here, because writing any of it would be drafting law rather than
setting it:

- **Privacy.** No contact details for the controller beyond "the contact page",
  no retention periods in actual time ("a reasonable period afterwards"), no
  statement about transfers outside the EEA, and the processors are described by
  role ("our hosting and database providers, our payment processor and our email
  delivery provider") rather than named. Supabase, Stripe and Resend are the
  three the code actually talks to.
- **Terms.** No company identification block: registered name, company number,
  registered office and VAT status are all required of an Irish company selling
  to consumers online, and none is stated. VAT treatment of digital goods is
  summarised as "include any applicable tax", which is the client's and their
  accountant's call, not ours. No complaints route and no ODR reference.
- **Cookies.** No cookie table: name, purpose and duration of each. The analytics
  paragraph states a preference for a cookieless tool rather than naming the one
  in use, which is correct while none is installed and has to be filled in the
  day one is.

**The 404.** It uses the episode title slates `slate.ep1`, `slate.ep2` and
`slate.ep3` as the frames either side of the missing one. Those are currently
the four public YouTube thumbnails; whenever Alan exports the kit's own TITLE
SLATES into the same slots the page picks them up with no change.
