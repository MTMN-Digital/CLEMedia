import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Settle } from "@/components/Settle";
import "@/components/draw/draw.css";
import "./rings.css";

/* ============================================================================
   One episode, three stages, drawn as three moments in a room.

   WHAT IT DRAWS. Three small scenes, stacked, one per third, read top to
   bottom beside the three captions.

   Watch: a screen on its stand showing the garden and its sun, and in front
   of it the backs of two heads, a grown-up's and a child's, overlapping. Two
   heads from behind in front of a screen is the one picture of "watching,
   together" that needs no caption.

   Play: the same screen, paused, two bars across the garden. The child is up
   off the floor beside it, arms out, feet clear of the ground line. The
   screen is now the smaller thing in the scene and the child is the bigger.

   Learn: no screen. A sheet of paper on the table, seen from above, with the
   sun from the episode drawn on it in red crayon, and the crayon lying across
   the corner where it was put down.

   WHY THIS AND NOT THE FLOOR PLAN. The previous drawing was a floor seen
   from above with footprints walking away from a screen. Photographed at
   1440 the prints were ten-pixel blobs, the jump was a gap in a trail, and
   the sheet at the far end ran past the bottom of the viewBox and was
   clipped. A plan view asks the viewer to decode three kinds of mark in one
   picture; at 300 to 440 pixels wide nobody does. Three elevations of real
   objects, each the obvious picture of its word, read in one look.

   WHAT CONNECTS THEM. The sun. Thin ink on the screen twice, then red crayon
   on the paper. And the screen itself: present, present and paused, then
   gone. That absence is "moving the learning off the screen entirely".

   THE ONE ACCENT is the crayon sun on the sheet. Nothing on either screen
   gets the colour, and the crayon itself is drawn in line.

   WEIGHT AND TONE. Every object has paper under it so nothing behind shows
   through, and the two kinds of thing that sit in front carry a wash: the
   people (deep) and the crayon on the sheet (light). Silhouettes are
   `.ink-edge`, the stand, the limbs and the pause bars are `.ink-line`, the
   garden, the rays and the ruled lines on the sheet are `.ink-thin`. The
   ground each scene stands on is `.ink-heavy`.

   HOW IT ARRIVES. Top to bottom, in order: the first ground and screen draw,
   the garden appears, the two heads land. Then the second scene, the child
   last, limbs drawing out from the body. Then the sheet, the crayon, and the
   red sun draws itself at the very end. Once, on entry, then it stops. The
   kit runs from mount and this sits a screen below the fold, so the hold in
   rings.css keeps it at frame zero until the observer releases it. Each
   caption settles as its scene starts.

   TWO ARRANGEMENTS, one drawing. Wide: 420 by 560, the three scenes in the
   vertical thirds at 187 and 373. Narrow: 150 by 600, thirds at 200, the
   same three scenes rebuilt for a strip 100 units wide so the stroke is
   still 2px at the width it really gets. Every mark sits inside the box with
   margin, because the art is `slice` inside a clipped frame (see rings.css)
   and a mark authored past the edge is a mark nobody sees. In the strip the
   content stays within x 27 to 123, which is what survives the sideways
   overspill on a 320px phone.

   No copy was cut: the client's three sentences are the captions, verbatim.
   ========================================================================== */

type Rect = { x: number; y: number; w: number; h: number };

const at = (d: number, dur?: number) =>
  ({ "--d": `${d}s`, ...(dur ? { "--dur": `${dur}s` } : {}) }) as React.CSSProperties;

const f = (n: number) => n.toFixed(1);

/* A rounded rectangle as a path, so one `d` can be filled, washed and
   stroked by the same three layers. */
function rr(r: Rect, rad: number): string {
  const { x, y, w, h } = r;
  return (
    `M${f(x + rad)} ${f(y)} H${f(x + w - rad)} a${rad} ${rad} 0 0 1 ${rad} ${rad} ` +
    `V${f(y + h - rad)} a${rad} ${rad} 0 0 1 ${-rad} ${rad} H${f(x + rad)} ` +
    `a${rad} ${rad} 0 0 1 ${-rad} ${-rad} V${f(y + rad)} a${rad} ${rad} 0 0 1 ${rad} ${-rad} Z`
  );
}

function circle(cx: number, cy: number, r: number): string {
  return `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0 Z`;
}

/* An object with a body of its own. Paper under it so nothing behind shows
   through, a wash over the paper if it is to sit forward, and its own
   silhouette on top in the edge weight. The silhouette either draws itself
   or lands with the paper. */
function Solid({ d, tone, draw, delay, dur = 0.9 }: {
  d: string; tone?: "wash" | "deep"; draw?: boolean; delay: number; dur?: number;
}) {
  return (
    <g>
      <g className="ink-in" style={at(delay)}>
        <path d={d} className="ink-fill" />
        {tone && <path d={d} className={tone === "deep" ? "ink-wash ink-wash--deep" : "ink-wash"} />}
      </g>
      {draw ? (
        <path d={d} pathLength="1" className="ink-line ink-edge ink-draw" style={at(delay, dur)} />
      ) : (
        <path d={d} className="ink-line ink-edge ink-in" style={at(delay)} />
      )}
    </g>
  );
}

/* The floor a scene stands on. */
function Ground({ x1, x2, y, delay }: { x1: number; x2: number; y: number; delay: number }) {
  return (
    <path d={`M${x1} ${y} H${x2}`} pathLength="1" className="ink-line ink-heavy ink-draw" style={at(delay, 0.7)} />
  );
}

/* The screen, on a stand, standing on the ground at `g`. It shows the
   garden and its sun in thin ink. Paused, two bars cross the garden. */
function Screen({ r, g, paused, t }: { r: Rect; g: number; paused?: boolean; t: number }) {
  const cx = r.x + r.w / 2, bottom = r.y + r.h;
  const foot = r.w * 0.3;
  const hill =
    `M${f(r.x + r.w * 0.08)} ${f(r.y + r.h * 0.74)} ` +
    `q ${f(r.w * 0.2)} ${f(-r.h * 0.26)} ${f(r.w * 0.45)} ${f(-r.h * 0.08)} ` +
    `q ${f(r.w * 0.18)} ${f(r.h * 0.12)} ${f(r.w * 0.4)} ${f(-r.h * 0.18)}`;
  const sun = { x: r.x + r.w * 0.76, y: r.y + r.h * 0.32, r: r.w * 0.058 };
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.3;
    const c = Math.cos(a), s = Math.sin(a);
    return `M${f(sun.x + c * sun.r * 1.45)} ${f(sun.y + s * sun.r * 1.45)} L${f(sun.x + c * sun.r * 1.95)} ${f(sun.y + s * sun.r * 1.95)}`;
  }).join(" ");
  /* Pause bars: narrow rounded rects in the edge weight, so the stroke
     closes over the inside and each bar paints solid at every size. */
  const barH = r.h * 0.3, barW = r.w * 0.028, barGap = r.w * 0.055;
  const barY = r.y + r.h / 2 - barH / 2;
  const bar = (bx: number) => rr({ x: bx - barW / 2, y: barY, w: barW, h: barH }, 1);
  return (
    <g>
      {/* Stand first, so the screen's own paper sits over the stem's top. */}
      <path
        d={`M${f(cx)} ${f(bottom - 2)} V${f(g)} M${f(cx - foot / 2)} ${f(g)} H${f(cx + foot / 2)}`}
        pathLength="1"
        className="ink-line ink-draw"
        style={at(t + 0.15, 0.5)}
      />
      <Solid d={rr(r, Math.round(r.w * 0.045))} draw delay={t + 0.05} />
      <g className="ink-in" style={at(t + 0.55)}>
        <path d={hill} className="ink-line ink-thin" />
        <path d={circle(sun.x, sun.y, sun.r)} className="ink-line ink-thin" />
        <path d={rays} className="ink-line ink-thin" />
      </g>
      {paused && (
        <path d={`${bar(cx - barGap)} ${bar(cx + barGap)}`} className="ink-line ink-edge ink-in" style={at(t + 0.7)} />
      )}
    </g>
  );
}

/* The back of a head and shoulders, sitting on the ground at `g`, in front
   of whatever is behind it. One closed path so the wash never doubles. */
function viewer(x: number, g: number, r: number): string {
  const neck = g - 1.3 * r;
  return (
    `M${f(x - 1.9 * r)} ${f(g)} ` +
    `C${f(x - 1.9 * r)} ${f(g - 0.7 * r)} ${f(x - 1.2 * r)} ${f(g - 1.05 * r)} ${f(x - 0.55 * r)} ${f(g - 1.1 * r)} ` +
    `L${f(x - 0.55 * r)} ${f(neck)} ` +
    `A${f(r)} ${f(r)} 0 1 1 ${f(x + 0.55 * r)} ${f(neck)} ` +
    `L${f(x + 0.55 * r)} ${f(g - 1.1 * r)} ` +
    `C${f(x + 1.2 * r)} ${f(g - 1.05 * r)} ${f(x + 1.9 * r)} ${f(g - 0.7 * r)} ${f(x + 1.9 * r)} ${f(g)} Z`
  );
}

/* The child, up in the air: arms out, legs apart, feet at `fy` which is
   above the ground. `s` scales the whole figure, 1 being the wide plan. */
function Child({ cx, fy, s, t }: { cx: number; fy: number; s: number; t: number }) {
  const u = (n: number) => n * s;
  const headR = u(14), headY = fy - u(97);
  const top = fy - u(83), hip = fy - u(39);
  const sw = u(15), hw = u(20), c = u(4);
  const torso =
    `M${f(cx - sw + c)} ${f(top)} H${f(cx + sw - c)} q${f(c)} 0 ${f(c)} ${f(c)} ` +
    `L${f(cx + hw)} ${f(hip - c)} q0 ${f(c)} ${f(-c)} ${f(c)} ` +
    `H${f(cx - hw + c)} q${f(-c)} 0 ${f(-c)} ${f(-c)} ` +
    `L${f(cx - sw)} ${f(top + c)} q0 ${f(-c)} ${f(c)} ${f(-c)} Z`;
  const arms =
    `M${f(cx - sw + 1)} ${f(top + u(4))} L${f(cx - u(38))} ${f(fy - u(114))} ` +
    `M${f(cx + sw - 1)} ${f(top + u(4))} L${f(cx + u(38))} ${f(fy - u(114))}`;
  const legs =
    `M${f(cx - u(10))} ${f(hip - 1)} L${f(cx - u(17))} ${f(fy)} M${f(cx - u(24))} ${f(fy)} h${f(u(12))} ` +
    `M${f(cx + u(10))} ${f(hip - 1)} L${f(cx + u(17))} ${f(fy)} M${f(cx + u(12))} ${f(fy)} h${f(u(12))}`;
  return (
    <g>
      <path d={legs} pathLength="1" className="ink-line ink-draw" style={at(t + 0.1, 0.5)} />
      <path d={arms} pathLength="1" className="ink-line ink-draw" style={at(t + 0.2, 0.5)} />
      <Solid d={`${circle(cx, headY, headR)} ${torso}`} tone="deep" delay={t} />
    </g>
  );
}

/* The sheet on the table, seen from above, the sun on it in crayon and the
   crayon across the corner. `k` scales the marks on the sheet. */
function Sheet({ r, tilt, k, crayon, t }: {
  r: Rect; tilt: number; k: number; crayon: { x: number; y: number; a: number; len: number }; t: number;
}) {
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const sun = { x: r.x + r.w * 0.47, y: r.y + r.h * 0.6, r: 23 * k };
  /* A loop that does not quite close: a crayon, not a compass. */
  const loop =
    `M${f(sun.x)} ${f(sun.y - sun.r)} ` +
    `c ${f(17 * k)} ${f(-3 * k)} ${f(26 * k)} ${f(14 * k)} ${f(22 * k)} ${f(26 * k)} ` +
    `c ${f(-4 * k)} ${f(16 * k)} ${f(-26 * k)} ${f(21 * k)} ${f(-37 * k)} ${f(9 * k)} ` +
    `c ${f(-10 * k)} ${f(-12 * k)} ${f(-7 * k)} ${f(-35 * k)} ${f(18 * k)} ${f(-38 * k)}`;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.2;
    const c = Math.cos(a), s = Math.sin(a);
    return `M${f(sun.x + c * sun.r * 1.35)} ${f(sun.y + s * sun.r * 1.35)} L${f(sun.x + c * sun.r * 1.75)} ${f(sun.y + s * sun.r * 1.75)}`;
  }).join(" ");
  const cw = 6.5 * k, tip = 12 * k;
  const crayonBody =
    `M0 0 L${f(tip)} ${f(-cw)} H${f(crayon.len - cw)} a${f(cw)} ${f(cw)} 0 0 1 0 ${f(2 * cw)} H${f(tip)} Z`;
  const crayonBands = `M${f(tip)} ${f(-cw)} V${f(cw)} M${f(tip + 9 * k)} ${f(-cw)} V${f(cw)}`;
  return (
    <g transform={`rotate(${tilt} ${f(cx)} ${f(cy)})`}>
      <Solid d={rr(r, 2)} delay={t} />
      <path
        d={`M${f(r.x + 14 * k)} ${f(r.y + 18 * k)} h${f(r.w - 28 * k)} M${f(r.x + 14 * k)} ${f(r.y + 30 * k)} h${f(r.w * 0.5)}`}
        className="ink-line ink-thin ink-in"
        style={at(t + 0.2)}
      />
      {/* Held invisible until the sheet is there: a `.ink-draw` path at
          offset 1 still paints its round cap as a dot at its start, and the
          one red dot on the page must not arrive before its paper. */}
      <g className="ink-in" style={at(t)}>
        <path d={loop} pathLength="1" className="ink-line ink-accent ink-draw" style={at(t + 0.55, 0.8)} />
        <path d={rays} pathLength="1" className="ink-line ink-accent ink-draw" style={at(t + 1.25, 0.5)} />
      </g>
      <g transform={`translate(${f(crayon.x)} ${f(crayon.y)}) rotate(${crayon.a})`}>
        <Solid d={crayonBody} tone="wash" delay={t + 0.35} />
        <path d={crayonBands} className="ink-line ink-thin ink-in" style={at(t + 0.35)} />
      </g>
    </g>
  );
}

/* When each scene starts. The captions settle on the same clock. */
const T = { watch: 0, play: 1.25, learn: 2.5 };

type Plan = {
  box: string;
  watch: { ground: { x1: number; x2: number; y: number }; screen: Rect; adult: { x: number; r: number }; child: { x: number; r: number } };
  play: { ground: { x1: number; x2: number; y: number }; screen: Rect; child: { cx: number; fy: number; s: number } };
  learn: { sheet: Rect; tilt: number; k: number; crayon: { x: number; y: number; a: number; len: number } };
};

/* Wide: 420 by 560, thirds at 187 and 373. */
const W: Plan = {
  box: "0 0 420 560",
  watch: {
    ground: { x1: 48, x2: 372, y: 170 },
    screen: { x: 95, y: 28, w: 190, h: 116 },
    adult: { x: 152, r: 21 },
    child: { x: 208, r: 15 },
  },
  play: {
    ground: { x1: 48, x2: 372, y: 352 },
    screen: { x: 72, y: 246, w: 146, h: 92 },
    child: { cx: 300, fy: 338, s: 1 },
  },
  learn: {
    sheet: { x: 136, y: 388, w: 128, h: 152 },
    tilt: -4,
    k: 1,
    crayon: { x: 232, y: 512, a: 24, len: 72 },
  },
};

/* Narrow: 150 by 600, thirds at 200 and 400. Content within x 27 to 123. */
const N: Plan = {
  box: "0 0 150 600",
  watch: {
    ground: { x1: 30, x2: 120, y: 134 },
    screen: { x: 30, y: 60, w: 90, h: 58 },
    adult: { x: 58, r: 12 },
    child: { x: 90, r: 9 },
  },
  play: {
    ground: { x1: 30, x2: 120, y: 342 },
    screen: { x: 28, y: 286, w: 60, h: 40 },
    child: { cx: 98, fy: 332, s: 0.7 },
  },
  learn: {
    sheet: { x: 31, y: 444, w: 88, h: 106 },
    tilt: -4,
    k: 0.69,
    crayon: { x: 78, y: 528, a: 22, len: 42 },
  },
};

function Drawing({ plan, className, label }: { plan: Plan; className: string; label: string }) {
  const { watch, play, learn } = plan;
  return (
    <svg className={`ink trail__art ${className}`} viewBox={plan.box} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      {/* Watch. The screen, the garden on it, two heads in front of it. */}
      <Ground {...watch.ground} delay={T.watch} />
      <Screen r={watch.screen} g={watch.ground.y} t={T.watch} />
      <Solid d={viewer(watch.adult.x, watch.ground.y, watch.adult.r)} tone="deep" delay={T.watch + 0.85} />
      <Solid d={viewer(watch.child.x, watch.ground.y, watch.child.r)} tone="deep" delay={T.watch + 1.0} />

      {/* Play. The screen paused, the child up off the floor beside it. */}
      <Ground {...play.ground} delay={T.play} />
      <Screen r={play.screen} g={play.ground.y} paused t={T.play} />
      <Child {...play.child} t={T.play + 0.75} />

      {/* Learn. No screen. The sheet, the crayon, and the sun in red. */}
      <Sheet r={learn.sheet} tilt={learn.tilt} k={learn.k} crayon={learn.crayon} t={T.learn} />
    </svg>
  );
}

const STAGES = [
  {
    key: "watch",
    word: "Watch",
    line: "An episode, together. Calm stories paced for how young children actually take things in, with nothing autoplaying into something nobody chose.",
  },
  {
    key: "play",
    word: "Play",
    line: "A pause for a movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    key: "learn",
    word: "Learn",
    line: "A printable or an educator-designed activity afterwards, moving the learning off the screen entirely.",
  },
];

const LABEL =
  "Three small scenes, top to bottom. A screen on a stand showing a garden and its sun, with the backs of two heads in front of it, a grown-up's and a child's. The same screen paused, two bars across the garden, and the child up in the air beside it, arms out, feet off the floor. Then no screen: a sheet of paper on the table with the sun from the episode drawn on it in red crayon, and the crayon lying across its corner.";

export function EpisodeTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof IntersectionObserver !== "undefined") setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  /* Each caption settles as its scene starts: Settle reads `--i` in 60ms
     units and leaves one that is already set. */
  const beat = (t: number) => ({ "--i": Math.round(t / 0.06) } as React.CSSProperties);
  const beats = [T.watch, T.play, T.learn];

  return (
    <div ref={ref} className={`trail ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""}`}>
      <Drawing plan={W} className="trail__art--wide" label={LABEL} />
      <Drawing plan={N} className="trail__art--narrow" label={LABEL} />

      <Settle as="ol" className="trail__words">
        {STAGES.map((st, i) => (
          <li key={st.key} className="trail__word" style={beat(beats[i])}>
            <h3 className="ink-name">{st.word}</h3>
            <p className="ink-note">{st.line}</p>
          </li>
        ))}
      </Settle>
    </div>
  );
}

/* Home.tsx imports this name. The drawing changed; the import did not. */
export { EpisodeTrail as EpisodeRings };
