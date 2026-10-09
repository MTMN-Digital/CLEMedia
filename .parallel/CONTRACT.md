# CONTRACT: CLÉ Family Media site pass

Frozen at `6307ee9`. No shard may edit anything in the convergence points list.
If you think you need to, that is a contract gap: report it, do not edit.

## Reference to mirror

**`src/pages/Story.tsx`.** Every shard matches its pattern language, not an
abstract idea of good. What it does, and what to copy:

- A left heading column and a right body column, repeated down the page, so the
  eye has one consistent place to find "what is this section".
- Surfaces travel through the VALUE RANGE, they do not alternate within a
  sliver of it. See "The surfaces" below: this rule used to read "paper, then
  `.wall`, then paper, closing on one `deep` band", and following it produced
  nine pages that measured as one tone.
- One full-bleed image moment, captioned.
- One pull-quote moment at display size.
- One card moment, a table or a panel set into the column.
- Sections vary in width. Not every section is the same container.

## Convergence points: integration only

`src/App.tsx` · `src/components/Layout.tsx` · `src/styles/index.css` ·
`src/components/ui.tsx` · `src/lib/*` · `src/components/Seo.tsx`

## The spacing contract

`<Section pad="...">` is the ONLY way to set section rhythm. There are no
`!py-*` escapes left in the codebase and no shard may add one.

| Step | Desktop | Use |
|---|---|---|
| `tight` | 80px | a section that leans on its neighbour |
| `normal` | 112px | the default |
| `open` | 160px | a section that needs air around it |
| `none` | 0 | a section that butts against the next |

Asymmetric: `pad={["tight", "none"]}` is top then bottom.

## Buttons

`<Button variant="primary" | "quiet" size="normal" | "large">`. Two variants,
because there are two treatments. There used to be five names and three of them
silently rendered as `quiet`. `size="large"` is for a page whose whole job is
one action, the download and the buy button, and nothing else.

Do not restyle a button with `className`. `.deep .btn-quiet` already handles a
quiet button on the navy band.

## Type and tokens

- Headings `t-display` / `t-h2` / `t-h3`, body `t-body`, small `t-sm`.
- `.eyebrow` for section labels, `.eyebrow eyebrow-sm` for a role line.
- Colour, radius and easing come from `var(--color-*)`, `var(--radius-*)`,
  `var(--ease-out)`. No literal that restates a token.
- Prefer the Tailwind utility over the long form: `border-rule` not
  `border-[var(--color-rule)]`, `ease-out` not `ease-[var(--ease-out)]`.
- `--color-slate`, `--color-deep`, `--color-clay`, `--color-cream` and
  `--color-hairline` are DEPRECATED aliases. Nothing new uses them.

## Shared primitives, use before building

`Container` (`width="wide" | "text"`) · `Section` · `Button` · `TextLink` ·
`Card` · `Kicker` · `Lead` · `Note` · `Figure` · `Settle` · `Wipe` ·
`DisclosurePanel` · `NotifyForm`

Eight chassis primitives were deleted at integration: `SectionHeading`, `Tile`,
`Well`, `Panel`, `ArchCard`, `Rail`, `EmptyState` and `Capsule`. None had a
consumer, two were aliases of `Card`, and `ArchCard` drew a circular portrait,
which this contract forbids. `.tile`, `.well` and `.hairline` remain as classes
and are used directly.

## Non-negotiables

- NEVER an em dash or an en dash. Anywhere. Comma, colon, parentheses or two
  sentences.
- No AI-generated imagery. No stock photography of families or children.
- Do not invent claims, statistics, testimonials, logos or awards. A missing
  fact goes in `CONTENT-NEEDED.md`, not into the page.
- WCAG 2.1 AA on every text element, measured not assumed.
- The Pawsitive Pugs & Pals®, PupsPlayer™, CLÉ Family Media, Conor Sexton.
- Mobile first: 390px must work, not just 1440px.

## Run sitepass-w2 additions

**Portraits are rounded squares, never circles.** `rounded-[var(--radius-md)]`
with `aspect-square`, as `src/components/team/PeopleStrip.tsx` does it. `/contact`
currently uses circles for the same six faces, which is the same people rendered
two ways on one site. Wave 1 showed two shards independently reaching for the
same image because nothing said which; this says it.

**Three image slots on this entire site are filled**: `home.hero`,
`home.characters` and `story.garden`. They are FRAMES FROM THE ANIMATED SHOW,
not photographs, and `src/lib/brand.ts` says so at the top of the file. Never
caption one as a photograph. This contract said "three real photographs" for
two waves, which was wrong, and a cold review caught it by reading brand.ts.
Everything else in `src/lib/brand.ts` with `base: null` is an unfilled
placeholder. Do NOT add a full-bleed image moment
unless you can name which of those three it is and no other page already uses it
that way. `story.garden` belongs to `/story`, `home.characters` to `/app`,
`home.hero` to `/`. A page without an image finds its change of pace in a card,
a quote, or a change of surface instead.


## The surfaces, and the flatness this fixes (2026-10-08)

Measured across the palette: every ground the site used for a section sat
between **0.94 and 0.57** relative luminance, and then jumped to navy at
**0.033**. The whole middle of the range was empty. A page went light, a
shade less light, a shade less light, then one dark band at the end, which is
why adding objects to pages kept failing to make them less flat. The objects
were cream on tan, so they had nowhere to stand out from.

| Surface | Luminance | What it is for |
|---|---|---|
| `card-stock` / `.card` | 0.94 | an object ON a ground, never a ground itself |
| paper (default) | 0.84 | reading |
| `.wall` | 0.64 to 0.57 | a change of room, still light |
| **`.bench`** | **0.11** | **where a page WORKS: objects lit against dark** |
| `.deep` | 0.03 | where a page ENDS, cool and final |

**A page may carry one `.bench` and one `.deep`.** They are not two dark bands
doing the same job: the bench is warm and lit from the same lamp as every
staged object, the close is cool and flat. Put the page's objects on the bench,
because that is the only ground on this site they can be lit against.

**A light surface inside a dark band keeps its own ink.** `.bench h3` and
`.deep h3` are descendant selectors, so a card on the bench had cream headings
on cream paper and its titles vanished. `index.css` carries explicit
`.bench .card-stock h3` style rules to put the ink back; they use real classes
rather than `:where()` so they outrank the inverted rule instead of tying with
it and losing on source order.

**Cream on the bench is 5.3:1 and the margin is thin.** Do not dim it with
`opacity`, and do not brighten the bench's lamp: at a 17% cream radial the
brightest corner measured 4.29:1, which is a fail, and the lift is largest
exactly where a heading sits.
## Run 2026-10-09-cle-rooms additions: THE LIT ROOM

Everything above still holds. This section adds the one thing the earlier
contract predates: the render kit, and the reading of it that `/contact` and
`/team` now ship. Those two pages are the reference for this run. Open them
before writing anything.

### Why this exists

The client's verdict on the site, four times in one session, was that it was
flat, and then, after a correct but generic rebuild of `/contact`, that it
"isn't unique in any way and it doesn't relate to CLÉ". The answer both times
is the same: the company makes needle-felted objects by hand, photographs them
and hangs them up, so its site shows objects standing in a lit room rather than
content sitting in boxes on a page. A card with a hairline and a soft shadow is
a sheet on a page. An object reads as present when it has a position in a
space, a light falling on it from somewhere in particular, a shadow that
belongs to that light, and a surface it stands on. The kit supplies those four
things and nothing else.

### The two references, and what each is for

**`src/pages/Contact.tsx` plus `.rk-corr` in render.css: THE ROOM.** One
`.rk-studio` panel holding a two-column scene. Five people mounted on the wall
on their own ledges, and the sheet you write on standing in front of them. Copy
this when a page has a few important objects and one block of content that has
to stay perfectly readable.

**`src/components/team/StageSequence.tsx` plus `.rk-board` / `.rk-slip`: THE
SHELF.** Six numbered slips standing on two shelves under one lamp, read left
to right, three across and two down, aligned by their FEET so they stand at
their own heights. Copy this when a page has a set of peer items that belong in
an order.

Mirror whichever is closer. Do not invent a third reading of the kit.

### The classes, and what each needs around it

| Class | What it is | Needs |
|---|---|---|
| `.rk-studio` | the room: wall panel, radius, padding, `container-name: studio` | `is-armed` / `is-in` from `useRoomEntry()` |
| `.rk-room` | modifier on `.rk-studio` that raises the wall's dark floor | a TALL room only. See the gradient trap below |
| `.rk-rake` | the raking light across the wall | first child of `.rk-studio`, `aria-hidden` |
| `.rk-head` | the picture rail: a functional shelf label, never a strapline | inside `.rk-studio`; pairs with `.rk-head-rule` + `.rk-head-meta` |
| `.rk-bench` | the grid of objects: 1 / 2 / 4 across by container width | direct children are `.rk-item` |
| `.rk-board .rk-bench` | the same grid at 3 across, with one ledge per row of three | the `.rk-board` modifier on `.rk-studio` |
| `.rk-item` | one cell; owns the shelf under its row via `::after` | `--i` set inline for the entry stagger |
| `.rk-plate` | the object's own box; margin-bottom equals the ledge height | wraps a `Stage` |
| `.rk-mat` | the cream mount a print sits on | holds `.rk-pic`, and the caption if there is one |
| `.rk-pic` | the clipped picture window inside the mount | holds `Figure` plus `.rk-light` |
| `.rk-light` | the light falling across the face of the picture | inside `.rk-pic`, `aria-hidden` |
| `.rk-tag` | a small cream label card standing at the object's foot | positioned against `.rk-plate` |
| `.rk-corr__sheet` | a FLAT lit sheet, not on a Stage | anything with text fields or controls |

`Stage` is the lit-object primitive: `seated`, `ground="ledge"`, `light`
(azimuth in degrees, 0 overhead, negative from the left), `tilt`, `turn`,
`roll`, `depth` 0 to 1, `backdrop`, `rake`, `lift`, `radius`. A board on a
ledge is `tilt` 5 to 8. Hand-place every pose so no two objects match: three
objects with identical poses is a shop display, not a studio.

### One lamp, not N lamps

There is ONE light in the room and every object's azimuth is the angle from
that light to that object. Compute it from the object's COLUMN, not its index,
so a second row is lit the same way as the first (the lamp is above them both).
`StageSequence.tsx` and `StudioWall.tsx` both show the two-line version of
this. A row of objects each lit by its own identical sweep reads as a row of
separate lights, which is the single tell that separates a rendered scene from
a row of cards with drop shadows.

### The sheet does not lean

Every object in this kit sits on a few degrees of 3D rotation. **Anything
holding a form field, a control, or a long block of reading does not.** A
rotated ancestor blurs text in every field and moves the caret and the native
autofill panel off the control they belong to. The room supplies the light and
the shadow; the thing the visitor has to use stays square and flat. Use
`.rk-corr__sheet`, which is lit by the room without being posed by it.

### The four contrast traps this codebase has already paid for

1. **Never dim a text colour with `opacity`.** Four separate AA failures so
   far, every one of them `opacity` on ink or on muted. Hierarchy comes from
   size, face and tracking. Use the token at full strength.
2. **`--color-muted` is the floor, and only on PAPER.** On the render kit's
   wall, text is `--color-ink` at full strength or it does not go on the wall.
3. **A caption on a lit wall belongs INSIDE the `.rk-mat`, on cream.** That is
   how a framed print carries one, and it is the only place its contrast stops
   depending on how deep the room is.
4. **The wall gradient darkens down the panel, and `.grain` multiplies on top.**
   A painted pixel is roughly 10% darker than the CSS colour says. A room
   tuned over 600px fails at 1200px: that is what `.rk-room` is for.

### Motion

`Settle` and `useRoomEntry` only. Both reveal once on entry and both collapse
under `prefers-reduced-motion`. No animation library, no `@keyframes`, no
infinite loop, no parallax, no scroll pinning. `Relief` (the scroll-driven
lamp) and `HangingMarks` (`.rk-hang`, which drifts forever) are mounted by the
footer and by `/contact` and are NOT for a shard to add: the brief puts the
characters in the supporting cast and allows one dedicated module, which is
already spent.

### Images

`src/lib/brand.ts` is the whole universe. Every image goes through `Figure`
with a key from the `AssetKey` union. There is no image generation on this
project and no stock photography. A key whose `base` is `null` is an unfilled
placeholder and renders a labelled block: that is correct behaviour, not
something to work around.

### Typecheck, and the one command a shard may run

`npx tsc --noEmit -p tsconfig.app.json`

That is the only build command. Four shards run concurrently in ONE checkout
against one `node_modules` and one `dist/`, so no shard runs `npm install`,
`npm run build` or a dev server. `tsconfig.app.json` is not incremental, so
concurrent typechecks are safe. Integration runs the real build. This overrides
item 1 of the earlier `DONE-WHEN.md`.

### Integration rulings, run 2026-10-09-cle-rooms

- **A database image is not an AssetKey.** `Figure` is for `src/lib/brand.ts`
  keys. A product thumbnail from Supabase renders as a plain `img` inside the
  same `.rk-mat` / `.rk-pic` mount, `alt=""` when the tag beside it names the
  product. `src/components/shop/Shelf.tsx` is the reference.
- **The launch flag is `APP_LAUNCHED` in `src/lib/site.ts`.** No page keeps its
  own copy.
- **A wall of three portraits with no sheet beside it** uses
  `.rk-corr__people--row`, which holds three across in the wide room. No inline
  `gridTemplateColumns`.
- **Board light is read from the 3-across column** (`i % 3`) at every width, as
  `StageSequence` does. At 1 and 2 columns the azimuth is the desktop column's,
  which is accepted: the poses still differ and nothing reads as N lamps.
- **`ShopProduct` is out of scope for this run** and keeps its current layout.
