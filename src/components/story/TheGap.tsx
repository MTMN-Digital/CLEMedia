import "@/components/draw/draw.css";
import "./gap.css";

/* ============================================================================
   The pile, and the one he kept.

   The paragraph beside this says, in the founder's own words: "So I went
   looking, and there was less of it than I expected. Plenty of shows were
   gentle. Plenty were educational. Very few were both, and fewer still would
   tell you anything about who had made them or who had checked them before
   they reached a child."

   WHAT IT DRAWS. A heap of television sets piled on the floor, tumbled over
   one another the way things end up when a lot of them have been gone
   through and put down. One loose scribble runs across the whole heap in a
   single stroke, a few passes, the mark a hand makes over a block it has
   finished with: not one cross per set, one gesture over the lot, and
   light enough that the sets under it are still sets. Apart from the heap,
   standing upright on the same floor, one set with its screen on, which
   here means paper where the others are dark. It is the only thing in the
   drawing with any weight to it: deep tone on the cabinet, the heaviest
   line on its edge. The one accent is a single short underline on the
   floor beneath it, the way a hand marks the one it is keeping on a list.

   WHY THE ACCENT IS A MARK AND NOT THE SCREEN. Red on this site means
   STOPPED: the bar that holds a release on /ethical-ai, the stamp on the
   sign-off cards, the bars across the blocked exits on /app. A kept set
   with a solid red screen read as the one that was stopped, and a filled
   field is not a rationed accent anyway. So the screen is paper, and the
   red is one stroke under the thing that was kept.

   That is the sentence in one look. "Plenty" is the size of the heap.
   "Less of it than I expected" is that nearly everything he picked up went
   on the pile. "Very few were both, and fewer still ..." is that what came
   out of the search was one set, standing on its own.

   WHY IT IS LEGIBLE ON ITS OWN. A screen on a stand is a television. A heap
   on a floor is a lot of a thing, gone through. A scribble over a thing is
   that thing done with. One left standing, switched on and underlined is
   the one kept.
   Nothing in it needs the paragraph; the paragraph only says whose search
   this was.

   THE THREE ATTEMPTS BEFORE THIS, so it is not re-litigated.

   1. THE VENN. Two overlapping circles and a key. A Venn is the most
      generic diagram there is, it needed a key, and it drew the wrong
      shape: the sentence is a search that narrows, not two sets meeting.

   2. THE NESTED WINDOWS. Three frames drawn inside one another with the
      field hatched out. The narrowing read, but nothing said WHAT was
      being narrowed, so beside the paragraph it was a pattern. The client's
      verdict was that it made no sense next to the text.

   3. THE SCATTER. Eighteen outline television sets at mixed sizes and
      tilts, twelve struck through in one pass, five in a second, one left
      lit. The subject read this time, and it still failed, for the reason
      in .parallel/HAND-2026-10-11.md: it was an icon set. Eighteen
      near-identical outlines in one uniform stroke, no tone, no weight, so
      the two passes did not separate, the survivor did not stand out, and
      the count was readable: seventeen out of eighteen is a figure, and the
      site is forbidden from inventing one.

   The heap answers each of those. The sets overlap and lean, so there is
   no tally to read. The crossing-out is one stroke over everything, so it
   is a gesture and not a score. The kept one is bigger, darker, heavier and
   on its own, so it is the first thing seen.

   A first cut of the heap had the scribble as a dozen dense passes in the
   full line, and at 2x the sets under it were grey slabs: the crossing-out
   had eaten the thing it crossed out, so nothing said what was rejected.
   Four passes now, and the sets keep the ordinary line and their stands.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. How many sets are in the heap is
   a drawing decision made so that "a heap" reads, and they are stacked so
   the ones behind are mostly hidden. No axis, no row, no proportion.

   NO LABELS. The sentence is the label and it is right beside the drawing.
   The svg carries the description for a screen reader.

   HOW IT ARRIVES. The floor draws, the heap lands on it set by set in a
   quick scan; the scribble runs across the lot in one long stroke; a beat;
   the kept one draws its edge, its screen comes on, and the hand underlines
   it. Once, on entry,
   then it stops. It sits in the letter's Spread, which is a Settle, and the
   kit pauses its arrivals under an armed-but-not-entered ancestor, so it is
   held until it is seen with no observer of its own. No JS, no
   IntersectionObserver and reduced motion all get the finished drawing.
   ========================================================================== */

/* THE UNITS. The margin column gives this drawing 256px at its widest, and
   it was first authored 240 units wide, one unit to the pixel, which put the
   kit's 2 unit line at 2 device pixels: half what the graphite in the hand
   filter needs to read as graphite rather than noise (see InkDefs.tsx and
   .parallel/GROW-2026-10-11.md). The page cannot give the margin more room,
   so the geometry was re-authored at half size instead: 120 by 95, at the
   same 256px, so every stroke is now about 2.1 device pixels per unit and
   the drawing itself has not moved. Stroke widths come from the kit and
   were NOT halved; that is the point.

   Three measures below are set against the stroke rather than halved,
   because at half size they would have been eaten by the line: the stand's
   height, the inset of a screen inside its cabinet, and the gap between the
   floor and the mark under the kept set. Each is the same number of device
   pixels it was before. */
const W = 120;
const H = 95;
const FLOOR = 86;

/* One television set: a cabinet, a screen inset in it, and a short stand.
   `h` follows `w` so every set has the same proportions and reads as the
   same kind of thing at any size. */
type Set = { tilt: number; x: number; w: number; y: number };
/* Four units, not three: the stem has to show clear of the cabinet's own
   stroke and the bar's, or the stand is a bar glued to the set. */
const STAND = 4;
const setH = (w: number) => Math.round(w * 0.7);
const cabinet = ({ x, y, w }: Set) => {
  const h = setH(w);
  const r = 1.5;
  return [
    `M${x + r} ${y}`,
    `H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r}`,
    `V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `H${x + r} Q${x} ${y + h} ${x} ${y + h - r}`,
    `V${y + r} Q${x} ${y} ${x + r} ${y} Z`,
  ].join(" ");
};
const stand = ({ x, y, w }: Set) => {
  const h = setH(w);
  const cx = x + w / 2;
  const half = Math.round(w * 0.24);
  return `M${cx} ${y + h} v${STAND} M${cx - half} ${y + h + STAND} H${cx + half}`;
};
const outline = (s: Set) => `${cabinet(s)} ${stand(s)}`;
const centre = (s: Set) => `${s.x + s.w / 2} ${s.y + setH(s.w) / 2}`;
/* A strip of paper about a line's width between the cabinet's stroke and
   the dark screen, so the set keeps its bezel. */
const SCREEN_INSET = 2.25;

/* The heap. Hand placed and drawn back to front, so the ones behind are
   mostly hidden. Nothing in it is square to anything else: some lean hard,
   one lies on its side, two are upside down with their stands in the air,
   which is how sets look once they have been put down and not picked up
   again. A pile that was dropped, not a stack that was built. */
const HEAP: Set[] = [
  /* on the floor: two upright, one on its side between them */
  { x: 48, y: 66, w: 27, tilt: 5 },
  { x: 0, y: 64, w: 28, tilt: -8 },
  { x: 26, y: 60, w: 24, tilt: 90 },
  /* resting on those, leaning out, stands poking out of the pile's sides */
  { x: 42, y: 47, w: 25, tilt: -16 },
  { x: 7, y: 45, w: 26, tilt: 24 },
  /* and on those: one upside down at the left, its stand in the air */
  { x: 4, y: 30, w: 22, tilt: 212 },
  { x: 21, y: 29, w: 26, tilt: -6 },
  /* on top, upside down, its stand in the air */
  { x: 37, y: 14, w: 23, tilt: 170 },
];

/* The one kept. Upright, on the same floor, apart from the heap, and the
   largest thing on the sheet because it is the nearest. Its stand bar lands
   exactly on the floor: y + setH(w) + STAND = FLOOR. */
const KEPT: Set = { x: 81, y: 58, w: 34, tilt: 0 };
/* Its screen sits a little deeper in than the heap's: the kept set has the
   heaviest edge and the screen has its own thin line, and the strip of deep
   tone between the two is what reads as a cabinet rather than a frame. */
const KEPT_INSET = 3.25;

/* The crossing-out: one stroke, four loose passes back and forth over the
   heap, the way a hand scribbles out a block it is done with. Four and not
   a dozen, because the sets under it have to stay readable as sets or the
   viewer cannot tell what was rejected. The turns are uneven and the legs
   are different lengths so it is not lacing; it follows the heap's own
   outline so the short leg is at the top where the pile is narrow. Each
   leg bows a little so none of it is ruled. */
const SCRIBBLE = (() => {
  const pts: [number, number][] = [
    [31, 18], [70, 28], [2, 43], [75, 59], [3, 77],
  ];
  return pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    const bow = i % 2 === 0 ? 3.5 : -3.5;
    return `${acc} Q${(px + x) / 2} ${(py + y) / 2 + bow} ${x} ${y}`;
  }, "");
})();

const d = (delay: number, dur?: number) =>
  ({ "--d": `${delay.toFixed(2)}s`, ...(dur ? { "--dur": `${dur}s` } : {}) }) as React.CSSProperties;

/* The arrival, in seconds. */
const FLOOR_AT = 0.05;
const HEAP_FROM = 0.1;
const HEAP_STEP = 0.06;
const HEAP_DUR = 0.3;
const SCRIBBLE_AT = 0.85;
const SCRIBBLE_DUR = 0.9;
const KEPT_AT = 1.65;
const KEPT_DUR = 0.7;
const ON_AT = 2.1;
const MARK_AT = 2.3;

export function TheGap() {
  const keptH = setH(KEPT.w);
  return (
    <figure className="gap">
      <svg
        className="ink gap__ink"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="A heap of television sets piled on the floor, the shows he went through, loosely scribbled out in one stroke. Apart from the heap, one set stands upright with its screen on, underlined in red: the one that was gentle, educational, and said who had made it."
      >
        {/* The floor everything is on. */}
        <path
          d={`M2 ${FLOOR} H${W - 2}`}
          pathLength="1"
          className="ink-line ink-heavy ink-draw"
          style={d(FLOOR_AT, 0.6)}
        />

        {/* The heap: paper under each set so the one in front covers the
            one behind, a dark screen on each because none of them is on,
            and the ordinary line for the edges and stands so each still
            names itself under the scribble. The heavy line is kept for the
            one that matters. */}
        {HEAP.map((s, i) => {
          const h = setH(s.w);
          const at = HEAP_FROM + HEAP_STEP * i;
          return (
            <g key={i} transform={`rotate(${s.tilt} ${centre(s)})`}>
              <path d={cabinet(s)} className="ink-fill ink-in" style={d(at)} />
              <rect
                x={s.x + SCREEN_INSET}
                y={s.y + SCREEN_INSET}
                width={s.w - SCREEN_INSET * 2}
                height={h - SCREEN_INSET * 2}
                rx="0.75"
                className="ink-wash ink-wash--deep ink-in"
                style={d(at)}
              />
              <path
                d={outline(s)}
                pathLength="1"
                className="ink-line ink-draw"
                style={d(at, HEAP_DUR)}
              />
            </g>
          );
        })}

        {/* Crossed off, the lot of them, in one stroke. */}
        <path
          d={SCRIBBLE}
          pathLength="1"
          className="ink-line ink-draw"
          style={d(SCRIBBLE_AT, SCRIBBLE_DUR)}
        />

        {/* The one kept: deep tone, the heaviest edge, and the screen on,
            which is paper where every other screen is dark. */}
        <path
          d={cabinet(KEPT)}
          className="ink-wash ink-wash--deep ink-in"
          style={d(KEPT_AT)}
        />
        <path
          d={outline(KEPT)}
          pathLength="1"
          className="ink-line ink-edge ink-draw"
          style={d(KEPT_AT, KEPT_DUR)}
        />
        <rect
          x={KEPT.x + KEPT_INSET}
          y={KEPT.y + KEPT_INSET}
          width={KEPT.w - KEPT_INSET * 2}
          height={keptH - KEPT_INSET * 2}
          rx="1"
          className="ink-fill ink-in"
          style={d(ON_AT)}
        />
        <rect
          x={KEPT.x + KEPT_INSET}
          y={KEPT.y + KEPT_INSET}
          width={KEPT.w - KEPT_INSET * 2}
          height={keptH - KEPT_INSET * 2}
          rx="1"
          className="ink-line ink-thin ink-in"
          style={d(ON_AT)}
        />
        {/* Kept: one short stroke under it on the floor. The one accent.
            4.5 below the floor, not 3.5: the floor is the heavy line and
            the mark needs a strip of paper between them to be its own
            stroke. */}
        <path
          d={`M${KEPT.x + 4} ${FLOOR + 4.5} H${KEPT.x + KEPT.w - 4}`}
          pathLength="1"
          className="ink-line ink-accent ink-draw"
          style={d(MARK_AT, 0.4)}
        />
      </svg>
    </figure>
  );
}
