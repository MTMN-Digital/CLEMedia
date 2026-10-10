import "@/components/draw/draw.css";
import "./gap.css";

/* ============================================================================
   Crossing them off.

   The paragraph beside this says, in the founder's own words: "So I went
   looking, and there was less of it than I expected. Plenty of shows were
   gentle. Plenty were educational. Very few were both, and fewer still would
   tell you anything about who had made them or who had checked them before
   they reached a child."

   WHAT IT DRAWS. A loose scatter of small television screens: the shows he
   went through. A hand strikes most of them out, one slash each, the mark
   everyone reads as "crossed off the list". It comes back and strikes most
   of what was left, the other way. One screen is never struck, and it is the
   one accent: lit red, the show that was gentle, educational, and said who
   had made it. Nearly everything on the sheet is crossed through. That is
   "less of it than I expected" in one look, and the screens say WHAT was
   crossed off without a single label.

   WHY IT IS LEGIBLE ON ITS OWN. Three marks, each of which a reader already
   knows: a screen with a stand is a television, a slash through a thing is
   that thing crossed off, and the one left unstruck and coloured is the one
   that was kept. Nothing has to be explained by the paragraph; the paragraph
   only says which search this was.

   THE TWO ATTEMPTS BEFORE THIS, so it is not re-litigated.

   1. THE VENN. Two overlapping circles, Gentle and Educational, a filled lens
      where they met, a dot in the lens, and a three line key underneath. It
      failed because a Venn is the most generic diagram there is and has no
      hand in it; because it needed a key, and a drawing that needs a key is
      admitting it cannot be read; and because it drew the wrong shape. The
      sentence is not two sets meeting. It is a search that narrows, clause
      by clause, and a Venn is static and symmetrical.

   2. THE NESTED WINDOWS. Three frames on one sheet, each drawn inside the
      last, with everything outside each window hatched through, and a red
      mark in the one clear patch left at the end. The narrowing read, and
      the hatch read as a crossing-out. It failed because the SUBJECT did not
      read: nothing in it said what was being narrowed. Abstract windows on a
      hatched field could be a crop, a map, a zoom or a frame, so beside the
      paragraph it was a pattern, not his search. The client's verdict was
      that it made no sense next to the text. The fix was not a better
      abstraction. It was to draw the thing he was looking through.

   The lesson is the one now written into .parallel/CONTRACT.md under
   "LEGIBLE BEATS UNIQUE": draw the artefact, not the abstraction, and if the
   drawing only resolves once the paragraph explains it, it is not working.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. "Plenty", "very few" and "fewer
   still" are relative words. The screens are a hand-placed scatter at mixed
   sizes and tilts, not a grid and not a count; how many there are, how many
   each pass strikes, and which one is left are drawing decisions made so
   that "many", "a few" and "one" read, and nothing else. No axis, no bar,
   no proportion.

   NO LABELS. The sentence is the label and it is right beside the drawing.
   The svg carries the description for a screen reader.

   HOW IT ARRIVES. The screens draw on in a quick scan, then the first pass
   of strikes lands across most of them, one after another; a beat; the
   second pass lands across most of what survived, slanted the other way;
   a beat; the last screen lights red. Once, on entry, then it stops. It sits
   in the letter's Spread, which is a Settle, and the kit pauses its arrivals
   under an armed-but-not-entered ancestor, so it is held until it is seen
   with no observer of its own. No JS, no IntersectionObserver and reduced
   motion all get the finished drawing.
   ========================================================================== */

/* The viewBox is the width the margin column really gives it, so
   stroke-width 2 is 2px on screen. Everything below is in those units. */
const W = 240;
const H = 190;

/* The scatter. Hand placed, not generated: mixed widths, mixed tilts, the
   rows deliberately uneven, so it reads as a pile and not a tally. Screens
   are roughly as big as they can be and still read as "many" at this width.
   `kept` is which pass it survives: 0 is struck in the first pass, 1 in the
   second, 2 is never struck and is the accent. */
type Screen = { x: number; y: number; w: number; tilt: number; kept: 0 | 1 | 2 };
const SCREENS: Screen[] = [
  { x: 8, y: 10, w: 26, tilt: -3, kept: 0 },
  { x: 52, y: 0, w: 23, tilt: 4, kept: 0 },
  { x: 96, y: 14, w: 28, tilt: -2, kept: 1 },
  { x: 150, y: 2, w: 24, tilt: 3, kept: 0 },
  { x: 198, y: 18, w: 27, tilt: -4, kept: 0 },
  { x: 22, y: 54, w: 24, tilt: 2, kept: 1 },
  { x: 70, y: 64, w: 25, tilt: -5, kept: 0 },
  { x: 124, y: 50, w: 23, tilt: 1, kept: 0 },
  { x: 166, y: 66, w: 28, tilt: -3, kept: 1 },
  { x: 0, y: 100, w: 25, tilt: -2, kept: 0 },
  { x: 46, y: 108, w: 27, tilt: 3, kept: 0 },
  { x: 104, y: 96, w: 24, tilt: -4, kept: 2 },
  { x: 150, y: 112, w: 26, tilt: 2, kept: 0 },
  { x: 208, y: 94, w: 23, tilt: -3, kept: 1 },
  { x: 24, y: 152, w: 24, tilt: 4, kept: 0 },
  { x: 80, y: 158, w: 27, tilt: -2, kept: 1 },
  { x: 134, y: 150, w: 24, tilt: 3, kept: 0 },
  { x: 186, y: 160, w: 26, tilt: -4, kept: 0 },
];

/* A television: a rounded screen on a short stand. One path, so the whole
   object draws as one stroke under `.ink-draw`. */
const screenH = (w: number) => Math.round(w * 0.68);
const tv = (s: Screen) => {
  const { x, y, w } = s;
  const h = screenH(w);
  const r = 2.5;
  const cx = x + w / 2;
  const base = Math.round(w * 0.42) / 2;
  return [
    `M${x + r} ${y}`,
    `H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r}`,
    `V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `H${x + r} Q${x} ${y + h} ${x} ${y + h - r}`,
    `V${y + r} Q${x} ${y} ${x + r} ${y} Z`,
    `M${cx} ${y + h} v3.5`,
    `M${cx - base} ${y + h + 3.5} H${cx + base}`,
  ].join(" ");
};

/* The crossing-out. One slash through the screen face, a little past its
   edges the way a pen overshoots. The first pass falls one way, the second
   pass the other, so at rest the sheet still shows that the hand went over
   it twice. Either way it is the same mark: crossed off. */
const strike = (s: Screen, pass: 0 | 1) => {
  const { x, y, w } = s;
  const h = screenH(w);
  const o = 3;
  return pass === 0
    ? `M${x - o} ${y - o} L${x + w + o} ${y + h + o}`
    : `M${x - o} ${y + h + o} L${x + w + o} ${y - o}`;
};

const centre = (s: Screen) => `${s.x + s.w / 2} ${s.y + screenH(s.w) / 2}`;

const d = (delay: number, dur?: number) =>
  ({ "--d": `${delay.toFixed(2)}s`, ...(dur ? { "--dur": `${dur}s` } : {}) }) as React.CSSProperties;

/* The arrival, in seconds. */
const SCAN_FROM = 0.05;
const SCAN_STEP = 0.04;
const SCAN_DUR = 0.4;
const PASS1_FROM = 1.35;
const PASS1_STEP = 0.08;
const PASS2_FROM = 2.9;
const PASS2_STEP = 0.16;
const STRIKE_DUR = 0.22;
const LIT_AT = 3.95;

export function TheGap() {
  let pass1 = 0;
  let pass2 = 0;

  return (
    <figure className="gap">
      <svg
        className="ink gap__ink"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="A loose scatter of small television screens, the shows he went through. Nearly every one has been struck through with a single pen stroke, in two passes, the way a hand crosses things off a list. One screen is left unstruck and lit red: the one that was gentle, educational, and said who had made it."
      >
        {SCREENS.map((s, i) => {
          const h = screenH(s.w);
          const inset = 2.2;
          let strikeEl: React.ReactNode = null;
          if (s.kept === 0) {
            strikeEl = (
              <path
                d={strike(s, 0)}
                pathLength="1"
                className="ink-line ink-draw"
                style={d(PASS1_FROM + PASS1_STEP * pass1++, STRIKE_DUR)}
              />
            );
          } else if (s.kept === 1) {
            strikeEl = (
              <path
                d={strike(s, 1)}
                pathLength="1"
                className="ink-line ink-draw"
                style={d(PASS2_FROM + PASS2_STEP * pass2++, STRIKE_DUR)}
              />
            );
          }
          return (
            <g key={i} transform={`rotate(${s.tilt} ${centre(s)})`}>
              {s.kept === 2 && (
                <rect
                  x={s.x + inset}
                  y={s.y + inset}
                  width={s.w - inset * 2}
                  height={h - inset * 2}
                  rx="1.2"
                  className="ink-accent-fill ink-in"
                  style={d(LIT_AT)}
                />
              )}
              <path
                d={tv(s)}
                pathLength="1"
                className="ink-line ink-draw"
                style={d(SCAN_FROM + SCAN_STEP * i, SCAN_DUR)}
              />
              {strikeEl}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
