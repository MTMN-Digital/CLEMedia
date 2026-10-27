# CONTRACT-UI.md, CLÉ Family Media

**Frozen 2026-09-23. A shard may not change anything in this file.** If a shard
believes something here is wrong, it says so in its report and builds to the
contract anyway. Changing a token or a primitive mid-run is how eight parallel
shards produce eight different sites.

Reference implementation: `src/pages/Home.tsx`. Read it before building a page.
Everything below is already working there.

---

## The direction: the show site's world, in a corporate register

The sister site is `pawsitivepugs.com`. This site is the same brand with a
tonal shift toward the official, not a new brand. Everything below was measured
off the live show site or off our own reference builds (`viecura-demo`,
`Managed-Energy`), not invented.

The brand is physically made things: needle-felted wool objects photographed in
golden-hour light, in a garden. **So the page is an environment, not a stack of
coloured blocks.** That distinction is the whole contract.

Five moves, and every page conforms:

| Move | Decision |
|---|---|
| **Type pairing** | Calistoga for display at 40px and up, Hanken Grotesk for everything else, and a very widely tracked uppercase micro-kicker as the third voice. **Only Calistoga is the show site's.** Corrected 2026-10-27: this line used to claim all three faces came from the show site, which is wrong. The brand's own body face is Montserrat, sampled live and recorded in DESIGN-TOKENS.md; Hanken Grotesk, Fraunces (hero) and Spline Sans Mono (labels) are MTMN's choices. Either keep them and say so, or move the body face back to Montserrat. QUESTIONS.md. |
| **Palette stance** | The show's own colours, sampled live, plus darkened steps so text passes AA. One continuous warm ground; the deep registers float on it. |
| **Layout stance** | A continuous environment with objects sitting in it. Frosted trays, arch cards, smoked deep panels. Centred section openers, left-aligned substance. |
| **Motion** | A drifting golden-hour bloom behind everything, one orchestrated entrance per section, and the stitch headline. House easing throughout. |
| **Signature detail** | The stitch headline: the hero draws itself character by character in wool thread, then settles into ink. The brand's lettering is needle-felted, so this is literally what it is. |

---

## The environment, and why it is layered this way

Three layers. **The order is load-bearing.** An earlier pass had each section
paint its own opaque ground, which covered the drifting light and put the page
straight back to being a stack of blocks.

```
html          the base colour, the canvas under everything
body::before  the GROUND: ONE document-scale gradient running the whole ladder
              from lightest linen down into clay and back up, plus the woven
              wool. One gradient over the entire page, so there is no seam
              anywhere by construction rather than by matching numbers at
              section edges.
body::after   the LIGHT: a drifting golden-hour bloom, fixed, translucent,
              ABOVE the ground so it actually reads. 34s, alternate.
sections      TRANSPARENT. A section adds local warmth and never a ground.
```

**A section must never set a background colour.** `<Section>` applies `.zone`,
which adds only two blooms whose centres are pushed past the box (`-4%` and
`104%`) so the peak lands at the divider itself. Adjacent sections each
contribute half of one bloom and the seam becomes the brightest point on the
page rather than a line across it.

The two noise layers on the ground are **anisotropic**, warp and weft. That is
the trick: one axis of fractal noise reads as digital grain, two crossed axes
read as woven cloth.

---

## Tokens

All in `src/styles/index.css`. **Never write a raw hex anywhere else.**

```
The light ladder, the continuous ground. L0 lightest, L5 deepest.
--color-l0  #FCF4E6   ink 16.45  body 10.48  muted 6.92
--color-l1  #F8EDDA   ink 15.50  body  9.88  muted 6.53
--color-l2  #F2E3CB   ink 14.22  body  9.07  muted 5.99
--color-l3  #E6D4BC   ink 12.41  body  7.91  muted 5.23   (brand cream)
--color-l4  #DCC6AB   ink 10.87  body  6.93  muted 4.58
--color-l5  #D2BA9C   ink  9.62  body  6.13  muted 4.05

Floating deep panels. Never a full-bleed band.
--color-navy       #1F325B   white 12.61
--color-umber      #3B2C21   white 13.39
--color-sage-deep  #4A6E5A   white  5.72
--color-clay-deep  #8A684C   white  5.04

Objects and fills.   --color-linen #F8DFB6 · --color-cream #E6D4BC
                     --color-clay #BC9E86 · --color-sage #94B7A4
Ink ramp.            --color-ink #1A1614 · --color-body #4A352A
                     --color-muted #6B4E3A   (the floor)
Accent, rationed.    --color-red #A32E32 · --color-red-deep #8E2428
The light.           --sun --amber --leaf --sky  (RGB triplets, for rgba())
Wool.                --wool-thread #B08A63 · --wool-shine #E9CDA3
```

Every rung of the ladder carries ink, body, muted and red-deep at AA or better,
so **text is safe anywhere on the gradient**, not only at its endpoints. That
is what lets the ground move continuously under the content.

Red is the fill and red-deep is the text weight. **Red never goes on a deep
panel** (1.39 on clay-deep, near invisible on navy); a deep panel's CTA is
`<Button variant="light">`.

---

## Primitives, from `src/components/ui.tsx`

| Component | Use |
|---|---|
| `<Section zone material>` | Every band. Paints no ground. `material`: `wool` on the mid and deep stretches, `tooth` wherever a band carries long copy, `none` to opt out. |
| `<Container width>` | Width by role: `measure` `text` `default` `wide` `bleed`. **Vary it down the page.** |
| `<DeepPanel tone luminous>` | The deep registers as smoked glass floating on the ground. `navy` `umber` `sage` `clay`. Inverts hairline and quiet-text colours for everything inside. |
| `<Tray luminous>` | Warm frosted glass holding a group of objects. Never wraps a paragraph on its own. |
| `<Panel tone>` | The lighter inner panel a tray holds. `linen` `cream` `white` `recessed`. |
| `<ArchCard person>` | The signature silhouette: arched frosted panel, round recessed portrait, name in Calistoga, role in the kicker voice. |
| `<Rail items>` | Hairline rows: index, title, attribution, body. The site's own corporate device. |
| `<StitchHeadline text>` | The hero moment. One per page, on the `<h1>` only. |
| `<ReviewGateScene />` | The set-piece. Home only. See **Set-pieces**. |
| `<GardenCanvas variant poster>` | The hero shader scene. Home only. See **The hero scene**. |
| `<SectionHeading align>` | `center` for a band opener, `start` for anything a reader works through. |
| `<Kicker>` | The micro-kicker. Plain functional language, never a marketing line, never a number. |
| `<Button variant>` | `primary` red fill on the light ground. `light` linen fill inside a deep panel. `outline` frosted glass. |
| `<TextLink>` `<EmptyState>` `<Enter>` `<Figure>` | As before. `<Enter>` wraps a GROUP, never one element. |

### Glass, texture and utilities

Four glass variants: `.glass` (warm frosted), `.glass-recessed` (sunken),
`.glass-luminous` (adds the golden halo, one per page at most), `.glass-deep`
(smoked, takes `.panel-*`). Plus `.glass-bar`, the sticky header: a heavy warm
wash, because a header is the one piece of glass that must never let what is
under it read through.

Three textures: `.tex-wool` (crossed warp and weft), `.tex-tooth` (finer paper
grain for reading surfaces), `.tex-fibre` (light strokes, for deep panels).
Each is a masked `::before` behind content.

`.wool-fill` and `.wool-animate` put the wool metallic on the wordmark.
`rule-t` `rule-b` `rule-l` and `arch` are `@utility`, so `md:rule-l` composes.

## The hero scene

`src/components/hero/GardenCanvas.tsx` plus `gardenShader.ts`: one fullscreen
WebGL2 fragment shader drawing first light in the garden, with every surface
passed through an anisotropic fibre pass so the frame reads as FELT rather than
photographic. Structure taken from `eos-web/src/components/home/dawn/`.

Back to front: sky gradient, sun disc and bloom, noise-broken light shafts,
three depth layers of blade silhouettes, bluebell stems on the near layer,
drifting pollen, the wool pass, grain.

- **`uDawn` is one value**, driven by an eased entrance and then by scroll,
  combined with `max()` so scroll can only ever advance the sunrise, never
  rewind it mid-entrance and stutter.
- **Device pixels capped at 1.5x.** This is a fullscreen fragment shader, so
  pixel count is the entire cost.
- **Three ways it degrades, all to the poster underneath**: no WebGL2, a shader
  that fails to link, or the hero scrolled past or the tab hidden (the loop
  stops and resumes).
- **Reduced motion draws one settled frame and stops.** Sun up, no motes.
- The canvas fades into the ground at the foot of the frame, so the hero hands
  off with no edge, the same rule the zones follow.

**Why procedural and not a photograph.** The previous hero was a generated
photograph of a garden, on a site whose Responsible AI page draws a line at
exactly that. A woollen garden is unmistakably a made thing: it is a drawing of
the show's world rather than a picture claiming to be the real one, so it sits
inside the imagery rule rather than against it.

A GLSL comment may not contain a backtick. The shader is a JS template literal
and a backtick closes it, which fails as a TypeScript syntax error dozens of
lines away from the real cause.

## Set-pieces

A page's central argument is **performed, not asserted**. That is the single
biggest difference between this site and a template, and it is what our own
reference builds do: `eos-web/src/components/home/TransformationScene.tsx` is
999 lines whose only job is to make a chaos of spreadsheets converge into a
live console as you scroll.

CLÉ's is `src/components/home/ReviewGateScene.tsx`: an episode carried through
the six real review gates, sent back at the fourth, published nine days late.
One per page at most, on the claim that page exists to make.

The rules a set-piece follows:

- **A scroll-pinned stage.** A tall wrapper gives the scroll distance; an inner
  `sticky` element holds the stage. One `useScroll` progress value drives every
  phase, so the phases can never disagree with each other.
- **Fixed logical size, scaled to the container.** Author the geometry once at a
  base width and `transform: scale()` it, so it stays sharp and the maths never
  becomes responsive.
- **The diagram is static and the motion is additive.** Every label, rule and
  number paints at full opacity on the first frame. Only position, state and
  counters animate. A diagram whose visibility depends on an animation frame
  renders blank in a hidden tab, a prerender or a crawler.
- **Deterministic, and it never loops.** Figures settle and stay. A sequence
  that cycles reads as a screensaver, not as a record of something that
  happened.
- **Mobile and reduced motion get an AUTHORED alternative**, not a disabled
  version. The same story, told as a still.
- **The section carrying it must set `pinned`.** See below.

### Things that will silently do nothing

- **`-webkit-text-stroke-width` is not animatable.** A keyframe that tries to
  animate it snaps to the end state and the effect vanishes with no error. The
  stitch uses `opacity`, `color`, `text-shadow` and `transform` only.
- **A negative z-index pseudo-element paints below its own element's
  background.** That is why the ground is on `body::before` and the page's base
  colour is on `html`, not on `body`.
- **Changing `animation-delay` does not restart a finished animation.** Remove
  the animation, force a reflow, then re-add it.
- **`content-visibility: auto` breaks a scroll-linked animation.** The browser
  skips layout for an offscreen section, so framer measures the scroll range
  against the `contain-intrinsic-size` placeholder and the whole timeline
  compresses into the first fifth of the scroll. Any section holding a pinned
  scene passes `pinned` to `<Section>`, which adds `.cv-off`.

### Banned outright

- A section painting its own background colour. It breaks the environment.
- Red on a deep panel.
- Calistoga below 20px. It reads as a children's face there, which is the one
  tonal shift this site is trying not to make. `h3` and `h4` are the grotesque,
  set in `@layer base`.
- A faked heavier Calistoga. One weight, no italic. Hierarchy is size, case,
  colour and spacing.
- `01 / SECTION` numbered eyebrows. Numbers inside `<Rail>` are structural and
  fine; a number as a decorative section label is not.
- More than one `<StitchHeadline>` or more than one `luminous` per page.
- The same container width on every section.
- Two filled buttons side by side. One `<Button>`, then a `<TextLink>`.

---

## Imagery

**The rule, agreed 2026-09-22: a brand mark is a brand mark regardless of how
it was made, but anything that depicts reality has to be real.**

- **Allowed.** The felted wordmarks, marks and brand objects from the existing
  BRAND TOOL KIT, as wordmarks and section markers. They are already public on
  the sister site and nobody reads a felted sign as a photograph.
- **Not allowed.** Any generated or stock image of a person, the garden, the
  workspace, the team or the production process. Those are claims about the
  world: real photography or a labelled placeholder, nothing else. No stock
  photography of families or children. Never a fabricated photograph of a real
  person.

Every image goes through `<Figure asset="person.conor" />`. Slots live in
`src/lib/brand.ts` with intrinsic size and alt text. A null slot renders a loud
labelled placeholder at the right dimensions, so a supplied file is a one-line
change and nothing reflows. **Do not add an `<img>` by hand.**

The kit is on Alan's Mac and unreadable from the build. A shard that needs an
object it does not have opens a slot, renders the placeholder, and adds the
file to the export list in `CONTENT-NEEDED.md`.

---

## Copy

Irish audience. `€`, `+353`, Irish spelling. **No em dashes and no en dashes
anywhere**, including code comments and commit messages. Use a comma, a colon,
parentheses or two sentences.

Registered marks on first use per page: The Pawsitive Pugs & Pals®,
PupsPlayer™, CLÉ Family Media (with the É).

**Never invent a claim.** No statistics, testimonials, partner logos, awards or
research findings the client has not supplied. A credibility block with nothing
in it stays empty, renders an `<EmptyState>` and gets a line in
`CONTENT-NEEDED.md`.

---

## Content

Copy goes through `src/lib/content.ts`:

```ts
const blocks = usePageBlocks("home");
const title = block(blocks, "hero.title", "Children's media made by people");
```

The fallback is the real shipping copy and ships in the bundle, so the page
renders complete with no JavaScript and no database. A CMS row replaces it when
one exists. **Never render a loading state for text.**

---

## Accessibility and performance, non-negotiable

- Mobile first, 320px to 2560px. Test at 390px, not a narrowed desktop window.
- WCAG 2.1 AA on every text and UI element. Measure against the ladder above.
- One `<h1>` per page. Headings descend without skipping. Real landmarks.
- Visible focus is global; do not remove an outline.
- `prefers-reduced-motion` collapses everything: the sun drift, the stitch, the
  entrances and the wool sweep all stop and land on their final state.
- **Nothing is hidden by CSS that only JavaScript can reveal.** `<Enter>` and
  `<StitchHeadline>` both arm from JS precisely so a crawler, a no-JS visitor
  and reduced motion all get finished content.
- `content-visibility: auto` on every section after the first, so the page
  skips layout, paint and animation below the fold. The hero is excluded: it
  must paint immediately for LCP.
- Every interactive target is at least 44px on touch.
