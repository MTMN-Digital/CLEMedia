import "@/components/draw/draw.css";
import "./wrap.css";

/* ============================================================================
   The next hook, arriving.

   The paragraph this sits in says, in the founder's own words: "What struck
   me was the speed. Cuts every second or so. Colours turned up past anything
   in the real world. A new hook arriving before the last one had finished
   landing."

   WHAT IT DRAWS. The last sentence, as a shape. A ground, and things thrown
   onto it in arcs. Each arc leaves the ground before the one in front of it
   has come down, so by the third one the air is full and nothing has landed.
   The final arc runs out of the frame still in the air, and it is the one
   accent: the hook that has not landed yet, which is the one the sentence is
   about.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. The arcs are not seconds, cuts or
   anything else countable; three is simply enough to read as "one after
   another" and few enough to read as a drawing. No axis, no scale, nothing
   measured. The arcs are all the same height because the sentence says
   nothing about any of them being bigger.

   HOW IT ARRIVES. The ground draws, then the arcs draw in order, and each
   one STARTS before the last has finished, so the animation is the sentence
   as well as the picture. Once, on entry, and it stops. It sits inside the
   letter's Settle, whose armed-but-not-entered state pauses the kit's
   animations, so it is held until it is seen.

   THE TEXT RUNS AROUND IT. It floats right of its paragraph above 700px,
   and the outline the prose follows is the rise of the first arc (see
   wrap.css). Decorative: the sentence beside it says everything it says, so
   it is hidden from assistive technology rather than described twice.
   ========================================================================== */

/* The viewBox is the width it is drawn at, so stroke-width 2 is 2px. */
const W = 150;
const H = 105;
const GROUND = 96;
/* Each arc spans SPAN, and the launches are closer together than that, which
   is the whole drawing: every arc leaves the ground 28 short of where the one
   before it comes down. The control point sits below zero so the apex lands
   at y 25 with the quadratic's halving. */
const SPAN = 76;
const CTRL_Y = -46;
const LAUNCHES = [3, 51, 99];

const arc = (x0: number) => `M${x0} ${GROUND} Q${x0 + SPAN / 2} ${CTRL_Y} ${x0 + SPAN} ${GROUND}`;

/* The last arc would land past the frame, so it is cut at the right edge
   while still coming down: the quadratic split (de Casteljau) at the
   parameter where it crosses x = W. With the control point centred, x runs
   linearly in t, so that parameter is simply the fraction of the span
   inside the frame. */
const LAST = (() => {
  const x0 = LAUNCHES[LAUNCHES.length - 1];
  const p0 = { x: x0, y: GROUND };
  const p1 = { x: x0 + SPAN / 2, y: CTRL_Y };
  const p2 = { x: x0 + SPAN, y: GROUND };
  const t = (W - x0) / SPAN;
  const q0 = { x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) };
  const q1 = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  const r = { x: q0.x + t * (q1.x - q0.x), y: q0.y + t * (q1.y - q0.y) };
  const f = (n: number) => Math.round(n * 10) / 10;
  return `M${p0.x} ${p0.y} Q${f(q0.x)} ${f(q0.y)} ${f(r.x)} ${f(r.y)}`;
})();

const d = (delay: string, dur?: string) =>
  ({ "--d": delay, ...(dur ? { "--dur": dur } : {}) }) as React.CSSProperties;

export function Hooks() {
  return (
    <span className="wrap wrap--right wrap--hooks" aria-hidden="true">
      <svg className="ink wrap__ink" viewBox={`0 0 ${W} ${H}`} focusable="false">
        {/* The ground everything is supposed to land on. */}
        <path
          d={`M2 ${GROUND} H${W - 2}`}
          pathLength="1"
          className="ink-line ink-heavy ink-draw"
          style={d("0.1s", "0.7s")}
        />
        {/* The ones on their way down. Each starts drawing 0.45s after the
            last, against a 0.8s draw, so none of them has finished when the
            next one leaves. */}
        {LAUNCHES.slice(0, -1).map((x0, i) => (
          <path
            key={x0}
            d={arc(x0)}
            pathLength="1"
            className="ink-line ink-draw"
            style={d(`${0.5 + i * 0.45}s`, "0.8s")}
          />
        ))}
        {/* The one that has not landed. */}
        <path
          d={LAST}
          pathLength="1"
          className="ink-line ink-accent ink-draw"
          style={d(`${0.5 + (LAUNCHES.length - 1) * 0.45}s`, "0.55s")}
        />
      </svg>
    </span>
  );
}
