import "@/components/draw/draw.css";
import "./wrap.css";

/* ============================================================================
   Beside a small child, watching it.

   The paragraph this sits in says, in the founder's own words: "I started
   paying proper attention to children's media the way most people do, by
   sitting beside a small child who was watching it. What struck me was the
   speed. Cuts every second or so. Colours turned up past anything in the
   real world. A new hook arriving before the last one had finished landing."

   WHAT IT DRAWS. The scene the paragraph is written from, and the speed.
   A small child, seen from behind, sitting on the floor in front of a
   television. The child is the nearest thing and the only solid one: deep
   tone, the heaviest line, a neck and a shoulder line so it is a person
   and not a pebble. The set stands on the same floor, its cabinet in tone
   and its screen left as bare paper, because it is on. Behind the screen,
   stacked up and off to the side of it, are the frames that have not
   settled yet: three ghosts of the screen, each a step further out, thin
   line, the picture changing faster than anyone can follow. The one accent
   is a pair of short speed dashes on the outermost ghost, the frame that is
   still arriving: a small mark on the thing that is moving too fast, and
   nothing pointed at the child.

   WHY IT IS LEGIBLE ON ITS OWN. A head on shoulders on a seated body is a
   person, and a small one in front of a large set is a small child. A
   screen on a stand is a television. A shape with ghosts of itself trailing
   off it is a shape moving fast. The paragraph is not needed to read it; it
   says whose child and whose evening.

   THE TWO ATTEMPTS BEFORE THIS, so it is not re-litigated.

   1. THE ARCS. Three equal arcs on a baseline, the last one cut by the
      frame and red, for "a new hook arriving before the last one had
      finished landing". Three smooth arcs on a baseline at 150 by 105 are
      a line chart whatever they are meant to be. It drew one clause as a
      diagram.

   2. THE FLASHES. The same child and set as now, with three jagged red
      bolts flung from the screen at the back of the child. At 2x it read
      as the television attacking the child: a lightning silhouette, in
      the one colour this site uses for a thing being stopped (the held
      release on /ethical-ai, the sign-off stamp, the barred exits on
      /app), aimed at a figure who cannot see it coming. On the story page
      of a children's media company, inside the founder's own letter, that
      cannot be the read. The paragraph is about speed, not harm, so the
      drawing now draws speed, and the red is a mark on the moving thing.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. Three ghosts is enough to read as
   "one after another" and few enough to read as a drawing; they are not
   cuts, seconds or anything countable. No axis, no scale, nothing measured.

   HOW IT ARRIVES. The floor draws, the set draws and its screen comes on,
   the child draws, and then the ghosts land one on the heels of the last,
   and the dashes mark the outermost, which is the sentence as well as the
   picture. Once, on entry, and it stops. It sits inside the letter's
   Settle, whose armed-but-not-entered state pauses the kit's animations,
   so it is held until it is seen.

   IT STANDS ABOVE ITS PARAGRAPH. It used to float into the prose with the
   child's own silhouette as the shape the text followed, which is in
   wrap.css along with why a 56ch measure could not afford it. Decorative
   either way: it is the very sentence it draws, so it is hidden from
   assistive technology rather than read twice.
   ========================================================================== */

/* The viewBox is the width it is drawn at, so stroke-width 2 is 2px.

   WHY IT TAKES `.ink--fine`. The float's width is set by the prose measure
   and not by the drawing (see wrap.css: 150 wide keeps 45 to 49 characters
   to the line, and the measure is the client's copy, which is never cut),
   so it cannot be given more room. Re-authoring it at half size against the
   same 150px, the only ratio that would give the graphite its two device
   pixels per unit, does not survive: the child's neck (6 by 4) and head
   (r 9.5) are then smaller than the 2.8 edge stroke that draws them, the
   two speed dashes become dots, and the screen's inset is narrower than the
   two strokes that bound it. So it keeps the wobble and drops the tooth, as
   does Thread, which floats in the same letter a page down: one float with
   graphite beside one without would be visible. */
const W = 150;
const H = 105;
const FLOOR = 98;

/* The child, from behind: a head, a neck, a shoulder line, and a seated
   body that widens to the floor. One path for the body so the edge draws as
   one stroke; the head is its own circle on top. */
const CHILD_BODY = [
  "M17 72 C17 68.5 19.5 67 23 67",
  "L27 67 L27 63 L33 63 L33 67 L37 67",
  "C40.5 67 43 68.5 43 72",
  "C43 80 44.5 86 48 92",
  `C49.5 95 48.5 ${FLOOR} 46 ${FLOOR}`,
  `L14 ${FLOOR}`,
  `C11.5 ${FLOOR} 10.5 95 12 92`,
  "C15.5 86 17 80 17 72 Z",
].join(" ");
const CHILD_HEAD = "M39.5 54 a9.5 9.5 0 1 1 -19 0 a9.5 9.5 0 1 1 19 0 Z";
const CHILD = `${CHILD_BODY} ${CHILD_HEAD}`;

/* The set. Cabinet, screen inset in it, a stand down to the floor. */
const TV = { x: 68, y: 40, w: 64, h: 46 };
const SCREEN = { x: TV.x + 4, y: TV.y + 4, w: TV.w - 8, h: TV.h - 8 };
const CABINET = (() => {
  const { x, y, w, h } = TV;
  const r = 3;
  return [
    `M${x + r} ${y}`,
    `H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r}`,
    `V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `H${x + r} Q${x} ${y + h} ${x} ${y + h - r}`,
    `V${y + r} Q${x} ${y} ${x + r} ${y} Z`,
  ].join(" ");
})();
const TV_STAND = (() => {
  const cx = TV.x + TV.w / 2;
  const bottom = TV.y + TV.h;
  return `M${cx} ${bottom} V${FLOOR - 1} M${cx - 14} ${FLOOR - 1} H${cx + 14}`;
})();
const TV_EDGE = `${CABINET} ${TV_STAND}`;

/* The frames that have not settled: the screen again, each one a step up
   and out from the last, drawn behind the cabinet so the set covers their
   near corners and they read as trailing off it. */
const GHOST_STEP = 6;
const GHOSTS = [1, 2, 3].map((n) => ({
  x: SCREEN.x + GHOST_STEP * n,
  y: SCREEN.y - GHOST_STEP * n,
}));
const OUTER = GHOSTS[GHOSTS.length - 1];

/* Two short dashes just above the top edge of the outermost frame, by its
   right corner, along the line it is arriving on. One mark, one element,
   and inside the box so the float's edge is the drawing's edge. */
const DASHES = [
  `M${OUTER.x + SCREEN.w - 16} ${OUTER.y - 4} l5 -4`,
  `M${OUTER.x + SCREEN.w - 7} ${OUTER.y - 4} l5 -4`,
].join(" ");

const d = (delay: string, dur?: string) =>
  ({ "--d": delay, ...(dur ? { "--dur": dur } : {}) }) as React.CSSProperties;

export function Hooks() {
  return (
    <span
      className="wrap wrap--hooks"
      /* DECORATIVE, like Thread beside it. The kit's rule is that a drawing is
         a new way to read a claim and never a new claim, and this one stands
         over the very sentence it draws. Announcing it would read the same
         statement to a screen reader twice, once as the author's prose and
         once as a description of a picture of that prose. */
      aria-hidden="true"
    >
      <svg className="ink ink--fine wrap__ink" viewBox={`0 0 ${W} ${H}`} focusable="false" aria-hidden="true">
        {/* The floor they are both on. */}
        <path
          d={`M3 ${FLOOR} H${W - 3}`}
          pathLength="1"
          className="ink-line ink-heavy ink-draw"
          style={d("0.1s", "0.7s")}
        />

        {/* The frames still arriving, behind the set, fast, one on the
            heels of the last. */}
        {GHOSTS.map((g, i) => (
          <rect
            key={i}
            x={g.x}
            y={g.y}
            width={SCREEN.w}
            height={SCREEN.h}
            rx="1.5"
            className="ink-line ink-thin ink-in"
            style={d(`${1.5 + i * 0.12}s`)}
          />
        ))}

        {/* The set: paper then tone on the cabinet so it covers the ghosts,
            the screen left as paper because it is on, its own edge the
            heavier line, the screen's edge the thin one. */}
        <path d={CABINET} className="ink-fill ink-in" style={d("0.4s")} />
        <path d={CABINET} className="ink-wash ink-in" style={d("0.4s")} />
        <path
          d={TV_EDGE}
          pathLength="1"
          className="ink-line ink-edge ink-draw"
          style={d("0.4s", "0.9s")}
        />
        <rect
          x={SCREEN.x}
          y={SCREEN.y}
          width={SCREEN.w}
          height={SCREEN.h}
          rx="1.5"
          className="ink-fill ink-in"
          style={d("0.9s")}
        />
        <rect
          x={SCREEN.x}
          y={SCREEN.y}
          width={SCREEN.w}
          height={SCREEN.h}
          rx="1.5"
          className="ink-line ink-thin ink-in"
          style={d("0.9s")}
        />

        {/* The child, nearest and solid. */}
        <path d={CHILD} className="ink-wash ink-wash--deep ink-in" style={d("0.8s")} />
        <path
          d={CHILD}
          pathLength="1"
          className="ink-line ink-edge ink-draw"
          style={d("0.8s", "0.8s")}
        />

        {/* The mark on the frame that is moving too fast. The one accent. */}
        <path
          d={DASHES}
          pathLength="1"
          className="ink-line ink-accent ink-draw"
          style={d("1.95s", "0.3s")}
        />
      </svg>
    </span>
  );
}
