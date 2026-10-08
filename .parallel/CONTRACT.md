# CONTRACT: CLÉ Family Media site pass

Frozen at `6307ee9`. No shard may edit anything in the convergence points list.
If you think you need to, that is a contract gap: report it, do not edit.

## Reference to mirror

**`src/pages/Story.tsx`.** Every shard matches its pattern language, not an
abstract idea of good. What it does, and what to copy:

- A left heading column and a right body column, repeated down the page, so the
  eye has one consistent place to find "what is this section".
- Surfaces alternate: paper, then `.wall`, then paper, closing on one `deep`
  band. One deep band per page, and it is the last section before the footer.
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
`Card` · `Kicker` · `Lead` · `Note` · `Figure` · `Settle` · `Wipe`

## Non-negotiables

- NEVER an em dash or an en dash. Anywhere. Comma, colon, parentheses or two
  sentences.
- No AI-generated imagery. No stock photography of families or children.
- Do not invent claims, statistics, testimonials, logos or awards. A missing
  fact goes in `CONTENT-NEEDED.md`, not into the page.
- WCAG 2.1 AA on every text element, measured not assumed.
- The Pawsitive Pugs & Pals®, PupsPlayer™, CLÉ Family Media, Conor Sexton.
- Mobile first: 390px must work, not just 1440px.
