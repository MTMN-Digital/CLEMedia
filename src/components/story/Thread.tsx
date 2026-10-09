import "@/components/draw/draw.css";
import "./wrap.css";

/* ============================================================================
   Built in from the start.

   The paragraph this sits in says, in the founder's own words: "The learning
   was built in from the start rather than added once the scripts were
   finished, which is a slower way to make a show and, as far as we can tell,
   the only way to make this one."

   WHAT IT DRAWS. A script: a sheet of paper with its lines of text drawn as
   thin rules. Through the lines, from the very first one to the last, runs a
   single red thread. It starts at the first word of the first line, which is
   "from the start", and it is stitched down through every line of the page,
   which is "built in". Nothing is tacked on at the end because the sentence
   says that is the thing they did not do, and a drawing of the thing not
   done would need a label and a cross through it.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. Seven lines is a page, not a
   count of anything; the lengths vary the way a page of prose does and the
   last is short because paragraphs end. No scale, nothing measured.

   HOW IT ARRIVES. The sheet draws its own edge, its lines land, and then the
   thread draws down through them, slowly, because the sentence says it is
   the slower way. Once, on entry, and it stops. It sits inside the letter's
   Settle, whose armed-but-not-entered state pauses the kit's animations, so
   it is held until it is seen.

   THE TEXT RUNS AROUND IT. It floats left of its paragraph above 700px, laid
   down six degrees off true like the ledger card further up the page, and
   the prose follows the lean of the sheet's edge (see wrap.css). Decorative:
   the sentence beside it is the whole of what it says, so it is hidden from
   assistive technology rather than described twice.
   ========================================================================== */

/* The viewBox is the width it is drawn at, so stroke-width 2 is 2px. */
const W = 140;
const H = 150;

/* The sheet, in its own coordinates (u along the top edge, v down the side),
   rotated 6 degrees. One place for the rotation so the edge, the lines and
   the thread all lean together. */
const ANGLE = (6 * Math.PI) / 180;
const C = Math.cos(ANGLE);
const S = Math.sin(ANGLE);
const ORIGIN = { x: 20, y: 8 };
const SHEET = { w: 110, h: 124 };
const pt = (u: number, v: number) => ({
  x: ORIGIN.x + u * C - v * S,
  y: ORIGIN.y + u * S + v * C,
});
const f = (n: number) => Math.round(n * 10) / 10;
const xy = (u: number, v: number) => {
  const p = pt(u, v);
  return `${f(p.x)} ${f(p.y)}`;
};

const EDGE = `M${xy(0, 0)} L${xy(SHEET.w, 0)} L${xy(SHEET.w, SHEET.h)} L${xy(0, SHEET.h)} Z`;

/* The lines of the script. Lengths vary the way set prose does. */
const LINE_U = 12;
const LINE_V0 = 18;
const LINE_STEP = 15;
const LINE_LENGTHS = [84, 80, 76, 86, 78, 82, 46];
const LINES = LINE_LENGTHS.map((len, i) => {
  const v = LINE_V0 + i * LINE_STEP;
  return `M${xy(LINE_U, v)} L${xy(LINE_U + len, v)}`;
});

/* The thread. It begins on the first line at its first word and crosses each
   line below it in turn, ending on the last. Cubic segments with vertical
   handles, so it reads as one continuous stitch rather than a zigzag. */
const STITCH: [number, number][] = [
  [LINE_U, LINE_V0],
  [52, LINE_V0 + LINE_STEP * 1],
  [18, LINE_V0 + LINE_STEP * 2],
  [56, LINE_V0 + LINE_STEP * 3],
  [20, LINE_V0 + LINE_STEP * 4],
  [54, LINE_V0 + LINE_STEP * 5],
  [46, LINE_V0 + LINE_STEP * 6],
];
const THREAD = STITCH.reduce((acc, [u, v], i) => {
  if (i === 0) return `M${xy(u, v)}`;
  const [pu, pv] = STITCH[i - 1];
  const reach = 9;
  return `${acc} C${xy(pu, pv + reach)} ${xy(u, v - reach)} ${xy(u, v)}`;
}, "");

const d = (delay: string, dur?: string) =>
  ({ "--d": delay, ...(dur ? { "--dur": dur } : {}) }) as React.CSSProperties;

export function Thread() {
  return (
    <span className="wrap wrap--left wrap--thread" aria-hidden="true">
      <svg className="ink wrap__ink" viewBox={`0 0 ${W} ${H}`} focusable="false">
        {/* The sheet: its paper first, then its edge drawing itself. */}
        <path d={EDGE} className="ink-fill ink-in" style={d("0.1s")} />
        <path
          d={EDGE}
          pathLength="1"
          className="ink-line ink-draw"
          style={d("0.1s", "1.1s")}
        />
        {/* The script, line by line. */}
        {LINES.map((line, i) => (
          <path
            key={line}
            d={line}
            className="ink-line ink-thin ink-in"
            style={d(`${0.7 + i * 0.07}s`)}
          />
        ))}
        {/* The learning, from the first line down. The one accent. */}
        <path
          d={THREAD}
          pathLength="1"
          className="ink-line ink-accent ink-draw"
          style={d("1.3s", "1.8s")}
        />
      </svg>
    </span>
  );
}
