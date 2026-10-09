import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Settle } from "@/components/Settle";
import "@/components/draw/draw.css";
import "./rings.css";

/* ============================================================================
   The child leaves. The screen does not.

   WHAT IT DRAWS. A floor seen from above, in one sitting. The screen stands at
   the top edge, small, and stays exactly where it is. A child's footprints
   lead away from it: a pair standing in front of the screen (Watch), then
   steps that break into a jump, a turn and a still pair (Play, the movement or
   breathing prompt), then steps on to a printed sheet lying on the floor at
   the far end, with the sun from the episode drawn on it in red crayon (Learn).
   Three moments of one sitting, read top to bottom, each one further from the
   screen than the last. The viewer gets it in one look because footprints are
   the one mark everybody reads as "somebody went this way".

   THREE CONCEPTS BEFORE THIS, and why this is not any of them.

   1. Three equal columns headed 01 / 02 / 03 in mono. A numbered row of three
      identical cards: a template, and it rendered the company's proposition
      as a feature list. Here the three captions hang off three regions of ONE
      drawing, in the order the drawing runs, and nothing is numbered.

   2. A single stroke running out of a lit screen, arcing up, landing on a
      printed sheet. It drew the wrong subject. The EPISODE does not travel
      anywhere; it stays where it is and ten minutes long. What changes is the
      child. Here nothing leaves the screen. The screen is drawn once, at the
      top, and is never touched again. The trail is the child's, not the
      episode's, and it is made of the child's own marks.

   3. Concentric rings, screen small at the centre, play as the ring around
      it, learning as the ring beyond. The client's verdict was that it still
      did not encapsulate the text. Two reasons. Rings say containment and
      scale: three nested categories, each holding the last. The text says a
      SEQUENCE: three things that happen one after another in one sitting, and
      a child getting progressively further from the screen. And rings put the
      screen at the centre of everything, which is the exact picture of a
      child's world this company exists to argue against. Its own pull quote
      is "the beginning of the thing, not the whole of it". A beginning is an
      edge, not a centre. So the screen sits at the top edge, and the drawing
      runs away from it in one direction, in time.

   THE ONE ACCENT is the sun drawn on the sheet at the end. The screen shows
   the garden and its sun in plain thin ink; the same sun turns up again on the
   paper, in red, in a child's hand. That is "moving the learning off the
   screen entirely", drawn, and nothing on the screen gets the colour.

   NO NUMBER, NO PROPORTION. Nothing is to scale and no distance means
   anything. The jump and the turn are not a count of movements; they are the
   marks a floor would carry after one. The prints are outlines, not solid,
   because a print on a floor lets the floor show through.

   HOW IT ARRIVES. The screen draws, the standing pair lands in front of it,
   then the prints land one after another down the trail, the jump pair as a
   pair, then the sheet, then the crayon sun draws itself last. Once, on
   entry, and it stops. The kit's classes run from mount and this sits a full
   screen below the fold, so it is held until seen with the same arm-then-
   release as TheGap. Each caption settles as the trail reaches its stage.

   TWO ARRANGEMENTS, one drawing. Wide: a 420 by 560 plan beside the three
   captions, the trail running down and to the right. Narrow: the same plan
   straightened into a 150 by 660 strip, authored at the width it really gets
   so the stroke is still 2px, with the captions beside it. In both the three
   stages sit in the vertical thirds of the viewBox and the captions sit in
   the vertical thirds of the same height, so each caption is level with the
   marks it names at every width. See rings.css.

   No copy was cut: the client's three sentences are the captions, verbatim.
   ========================================================================== */

type Print = { x: number; y: number; r: number; d: number; m?: boolean };

/* A footprint: sole and heel, outline only, pointing up (toward -y), centred
   on its own origin, `s` units tall. Mirrored for the other foot. */
function foot(s: number): string {
  const k = s / 31;
  const p = (x: number, y: number) => `${(x * k).toFixed(1)} ${(y * k).toFixed(1)}`;
  return (
    `M${p(-6, -9)} C${p(-6, -14)} ${p(-3, -15.5)} ${p(0, -15.5)} ` +
    `C${p(4, -15.5)} ${p(7, -13)} ${p(7, -8)} C${p(7, -3)} ${p(5, 1)} ${p(4, 4)} ` +
    `C${p(3.5, 5.5)} ${p(-3.5, 5.5)} ${p(-4.5, 4)} C${p(-5.5, 0)} ${p(-6, -4)} ${p(-6, -9)} Z ` +
    `M${p(-3.5, 9)} C${p(-3.5, 7.5)} ${p(3.5, 7.5)} ${p(3.5, 9)} L${p(3.5, 12.5)} ` +
    `C${p(3.5, 15.5)} ${p(-3.5, 15.5)} ${p(-3.5, 12.5)} Z`
  );
}

/* Walking: n prints along a straight line, alternating feet either side of
   it, each turned to face the way it is going. Delays run on from t0. */
function walk(
  x0: number, y0: number, x1: number, y1: number,
  n: number, side: number, t0: number, dt: number, lead: 1 | -1 = 1,
): Print[] {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
  const px = -dy / len, py = dx / len;
  const r = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const s = i % 2 === 0 ? lead : -lead;
    return { x: x0 + dx * t + px * side * s, y: y0 + dy * t + py * side * s, r, d: t0 + i * dt, m: s > 0 };
  });
}

/* A pair standing still: feet side by side, both facing `r`. */
function pair(x: number, y: number, gap: number, r: number, d: number): Print[] {
  const a = (r * Math.PI) / 180;
  const px = Math.cos(a) * gap / 2, py = Math.sin(a) * gap / 2;
  return [
    { x: x - px, y: y - py, r, d },
    { x: x + px, y: y + py, r, d, m: true },
  ];
}

const at = (d: number, dur?: number) =>
  ({ "--d": `${d}s`, ...(dur ? { "--dur": `${dur}s` } : {}) }) as React.CSSProperties;

const STEP = 0.13;

/* ─── Wide: 420 by 560, thirds at 187 and 373 ────────────────────────────── */
const W = {
  box: "0 0 420 560",
  screen: { x: 48, y: 28, w: 156, h: 100 },
  horizon: "M60 108 q 30 -26 62 -12 q 28 12 70 -20",
  sun: { cx: 174, cy: 54, r: 7 },
  sheet: { cx: 322, cy: 504, w: 124, h: 100, tilt: -6 },
  prints: [
    ...pair(126, 170, 17, 0, 0.5),
    ...walk(150, 210, 212, 266, 3, 7, 0.8, STEP),
    /* The jump: both feet at once, apart, toes out. */
    { x: 234, y: 298, r: 215, d: 1.3 },
    { x: 272, y: 298, r: 145, d: 1.3, m: true },
    /* The turn: facing across the trail. */
    ...pair(252, 336, 17, 90, 1.55),
    /* Still: the breathing prompt. */
    ...pair(296, 356, 17, 180, 1.8),
    ...walk(304, 390, 314, 414, 2, 7, 2.05, STEP, -1),
    ...pair(322, 440, 17, 180, 2.35),
  ] as Print[],
  foot: 31,
};

/* ─── Narrow: 150 by 660, thirds at 220 and 440 ──────────────────────────── */
const N = {
  box: "0 0 150 660",
  screen: { x: 27, y: 22, w: 96, h: 62 },
  horizon: "M36 72 q 18 -16 38 -8 q 18 8 42 -13",
  sun: { cx: 104, cy: 38, r: 5 },
  sheet: { cx: 75, cy: 584, w: 80, h: 66, tilt: -5 },
  prints: [
    ...pair(75, 118, 13, 0, 0.5),
    ...walk(75, 150, 75, 230, 4, 5.5, 0.8, STEP),
    { x: 58, y: 268, r: 215, d: 1.4 },
    { x: 92, y: 268, r: 145, d: 1.4, m: true },
    ...pair(75, 302, 13, 90, 1.65),
    ...pair(75, 338, 13, 180, 1.9),
    ...walk(75, 372, 75, 476, 5, 5.5, 2.15, STEP, -1),
    ...pair(75, 510, 13, 180, 2.9),
  ] as Print[],
  foot: 23,
};

type Plan = typeof W;

function Drawing({ plan, id, className, label }: { plan: Plan; id: string; className: string; label: string }) {
  const { screen: s, sheet: sh } = plan;
  const screenPath = `M${s.x + 8} ${s.y} H${s.x + s.w - 8} a8 8 0 0 1 8 8 V${s.y + s.h - 8} a8 8 0 0 1 -8 8 H${s.x + 8} a8 8 0 0 1 -8 -8 V${s.y + 8} a8 8 0 0 1 8 -8 Z`;
  const standY = s.y + s.h;
  const k = plan.foot / 31;
  const sunR = 13 * k, rayIn = 18 * k, rayOut = 25 * k;
  const sunCx = sh.cx - 2 * k, sunCy = sh.cy + 12 * k;
  /* A loop that does not quite close: a crayon, not a compass. */
  const sunLoop =
    `M${sunCx} ${sunCy - sunR} c ${10 * k} ${-2 * k} ${15 * k} ${8 * k} ${13 * k} ${15 * k} ` +
    `c ${-2 * k} ${9 * k} ${-15 * k} ${12 * k} ${-21 * k} ${5 * k} ` +
    `c ${-6 * k} ${-7 * k} ${-4 * k} ${-20 * k} ${10 * k} ${-22 * k}`;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.2;
    return `M${(sunCx + Math.cos(a) * rayIn).toFixed(1)} ${(sunCy + Math.sin(a) * rayIn).toFixed(1)} L${(sunCx + Math.cos(a) * rayOut).toFixed(1)} ${(sunCy + Math.sin(a) * rayOut).toFixed(1)}`;
  }).join(" ");
  const last = plan.prints.reduce((m, p) => Math.max(m, p.d), 0);
  const sheetAt = last + 0.25;
  const sx = sh.cx - sh.w / 2, sy = sh.cy - sh.h / 2;

  return (
    <svg className={`ink trail__art ${className}`} viewBox={plan.box} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <path id={`fp-${id}`} d={foot(plan.foot)} />
      </defs>

      {/* The screen. Drawn first, and never touched again. */}
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="8" className="ink-fill ink-in" style={at(0.1)} />
      <path d={screenPath} pathLength="1" className="ink-line ink-draw" style={at(0.1, 0.8)} />
      <g className="ink-in" style={at(0.45)}>
        <path d={plan.horizon} className="ink-line ink-thin" />
        <circle cx={plan.sun.cx} cy={plan.sun.cy} r={plan.sun.r} className="ink-line ink-thin" />
        <path d={`M${s.x + s.w / 2} ${standY} v ${12 * k} M${s.x + s.w / 2 - 26 * k} ${standY + 12 * k} h ${52 * k}`} className="ink-line" />
      </g>

      {/* The child's prints, landing one after another away from it. */}
      {plan.prints.map((p, i) => (
        <use
          key={i}
          href={`#fp-${id}`}
          transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r.toFixed(1)})${p.m ? " scale(-1 1)" : ""}`}
          className="ink-line ink-in"
          style={at(p.d)}
        />
      ))}

      {/* The sheet on the floor at the far end, and what the child drew on it. */}
      <g transform={`rotate(${sh.tilt} ${sh.cx} ${sh.cy})`}>
        <g className="ink-in" style={at(sheetAt)}>
          <rect x={sx} y={sy} width={sh.w} height={sh.h} className="ink-fill" />
          <rect x={sx} y={sy} width={sh.w} height={sh.h} className="ink-line" />
          <path
            d={`M${sx + 14 * k} ${sy + 16 * k} h ${sh.w - 28 * k} M${sx + 14 * k} ${sy + 28 * k} h ${sh.w * 0.5}`}
            className="ink-line ink-thin"
          />
        </g>
        {/* Held invisible until the sheet is there: a `.ink-draw` path at
            offset 1 still paints its round cap as a dot at its start, and
            the one red dot on the page must not arrive before its paper. */}
        <g className="ink-in" style={at(sheetAt)}>
          <path d={sunLoop} pathLength="1" className="ink-line ink-accent ink-draw" style={at(sheetAt + 0.35, 0.8)} />
          <path d={rays} pathLength="1" className="ink-line ink-accent ink-draw" style={at(sheetAt + 1.0, 0.6)} />
        </g>
      </g>
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
  "A floor seen from above. A screen stays at the top edge, showing a garden and its sun. A child's footprints lead away from it: a pair standing in front of the screen, then steps that break into a jump, a turn and a still pair, then steps on to a printed sheet lying on the floor at the far end, with the sun from the episode drawn on it in red crayon.";

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

  return (
    <div ref={ref} className={`trail ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""}`}>
      <Drawing plan={W} id="w" className="trail__art--wide" label={LABEL} />
      <Drawing plan={N} id="n" className="trail__art--narrow" label={LABEL} />

      {/* Each caption settles as the trail reaches its stage: Settle reads
          `--i` in 60ms units and leaves one that is already set. */}
      <Settle as="ol" className="trail__words">
        {STAGES.map((st, i) => (
          <li key={st.key} className="trail__word" style={{ "--i": i * 18 } as React.CSSProperties}>
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
