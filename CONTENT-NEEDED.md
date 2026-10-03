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
