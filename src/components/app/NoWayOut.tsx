import type { CSSProperties, ReactElement } from "react";
import "@/components/draw/draw.css";
import "./noway.css";

/* ============================================================================
   No way out.

   The line this sits under is the best sentence on the page: "A young child
   can find their way around it, and cannot accidentally find their way out of
   it." That is a shape, and both halves of it have to be in the drawing.

   WHAT WAS HERE BEFORE, and why it was redrawn (2026-10-11). The second
   version got the parts right and the composition wrong. It was a 360-unit
   plate standing alone at 400px in a 1376px column, so three quarters of its
   own box was empty paper. The child inside was a stick figure with both
   arms up, which reads as cheering, the opposite of what the drawing says.
   The three things outside the wall were glyphs too small to name, so the
   point of the drawing, WHAT is being kept out, was carried by nothing. And
   every mark was the same 2-unit line, so the wall, the child, the plate and
   the price tag were all the same value and nothing was in front of anything.

   WHAT IS HERE NOW. One landscape plate, 1100 units wide, taking the full
   column the way the production line on /ethical-ai does, so the drawing is
   the width of the sentence above it rather than a stamp in its corner.

   Inside the boundary, a room. Three real things stand on one floor:
     An EPISODE, the landscape plate the walkthrough shows four of, with a
       play mark in it, washed deep so it is the heaviest thing in the room.
     A CHILD, standing between the other two, one hand on the episode and
       the other on the sheet. A round head and posts, no face, the way the
       kit draws a person (team/StageMark.tsx). The arms are at mid height
       and each one ends ON a thing, which is what makes it a child using the
       app and not a child cheering: hands that land on objects are doing
       something, hands in the air are not.
     A PRINTABLE, a sheet with a folded corner, a title line and the puzzle
       grid, washed light. The fold is what makes it paper and not a second
       screen.
   The floor joins them and the child's hands join them. That is the first
   half of the sentence: everything inside leads to everything inside, and a
   child in the middle of it has both of them in reach.

   Outside the boundary, the three things that usually come with children's
   video, each one drawn large enough to be named at a glance and each one
   the page's own claim, in its own words:
     "No autoplay into something nobody chose": a queue of plates above the
       top wall, the next things that would play by themselves.
     "No surprise purchases inside the app": a price tag beyond the left
       wall, point and hole towards the room, a euro mark on it.
     "No advertising to children anywhere in it": a hoarding beyond the
       right wall, a framed portrait board on one off-centre post, standing
       on its own bit of ground.
   They are line only, no wash, so they sit behind the room. The inside is
   tone and the outside is outline, which is the whole weight argument in one
   decision.

   THE STOP SITS INSIDE THE WALL, not on it. Each exit is a dashed path, the
   path a child never takes, running from the thing inside straight at the
   thing outside, and a red bar cuts it just short of the wall. Taking the
   paths to the wall and laying the bars along it is tidier and reads worse:
   an accent bar on the boundary merges into it and looks like a red length
   of wall. The gap between bar and wall is deliberate. Each exit runs
   perpendicular to the wall it meets so its bar is one short straight line;
   the very first version ran them diagonally into the corners and the bars
   came out crooked, which read as a mistake. The bar is the accent and the
   only accent: the stop is what the drawing is about.

   WEIGHT. `.ink-edge` on the wall and on every object's own silhouette,
   `.ink-line` for the play mark, the sheet's title and the child's limbs,
   `.ink-thin` for everything inside an object (the puzzle grid, the
   billboard's copy, the tag's label, the plate's progress strip). The wobble
   is the kit's, applied at paint time by `.ink`; nothing here is bent by hand.

   ORDER OF ARRIVAL. The wall draws, the floor draws, the episode lands, the
   child lands, the sheet lands. Then each exit appears with the thing it
   leads to and is cut by its bar, top, left, right. The stop is the last
   thing that happens, three times. Nothing loops. The kit's hold-until-seen
   gate pauses everything under an `.is-armed:not(.is-in)` ancestor and the
   page wraps this in a `Settle`, so there is no observer in here. Reduced
   motion collapses to this finished pose, which is the pose it was drawn in.

   MEANINGFUL, not decorative. The drawing is the only place on the page that
   puts the three exits against the three things inside, so the svg is
   `role="img"` with a label that says in words what the drawing says in ink.
   ========================================================================== */

const at = (d: number, dur?: number): CSSProperties =>
  ({ "--d": `${d}s`, ...(dur !== undefined ? { "--dur": `${dur}s` } : {}) }) as CSSProperties;

/* The room. */
const VB_W = 1100;
const VB_H = 430;
const WALL = { x: 230, y: 110, w: 640, h: 300, rx: 40 };
const FLOOR_Y = 368;

/* The three exits. Each `path` runs from the thing inside to just short of
   its bar, each `stop` is the bar, and each `beyond` is the thing outside
   the wall the path was heading for. `d` is when the exit starts. */
const EXITS: { key: string; path: string; stop: string; d: number; beyond: () => ReactElement }[] = [
  {
    key: "autoplay",
    path: "M422 244 V 162",
    stop: "M392 155 H 452",
    d: 2.0,
    /* The next things, queued. Three plates stacked up and back beyond the
       top wall, the front one carrying the play mark. The two behind are
       drawn as only the edges the front one leaves visible, rather than as
       full rectangles under a paper fill: `.ink-fill` is the raised white and
       on this ground it read as the brightest thing in the drawing. */
    beyond: () => (
      <>
        <path d="M386 18 V 14 a6 6 0 0 1 6 -6 H 500 a6 6 0 0 1 6 6 V 72 a6 6 0 0 1 -6 6 H 494" className="ink-line ink-thin" />
        <path d="M374 28 V 24 a6 6 0 0 1 6 -6 H 488 a6 6 0 0 1 6 6 V 82 a6 6 0 0 1 -6 6 H 482" className="ink-line ink-thin" />
        <rect x="362" y="28" width="120" height="70" rx="6" className="ink-line ink-edge" />
        <path d="M410 50 L436 63 L410 76 Z" className="ink-line" />
      </>
    ),
  },
  {
    key: "purchase",
    path: "M314 310 H 258",
    stop: "M252 284 V 336",
    d: 2.2,
    /* A price tag, point and hole towards the room, with a euro mark on it.
       Two label lines read as a luggage tag; the currency mark is what makes
       it a price. It is drawn, not set as <text>, so it stays in the hand
       and takes the wobble with the rest. */
    beyond: () => (
      <>
        <path d="M70 288 H156 L196 310 L156 332 H70 Z" className="ink-line ink-edge" />
        <circle cx="166" cy="310" r="4.5" className="ink-line" />
        <path d="M130 299 A 15 15 0 1 0 130 321 M100 306 H 128 M100 314 H 126" className="ink-line" />
      </>
    ),
  },
  {
    key: "advert",
    path: "M772 300 H 842",
    stop: "M848 274 V 326",
    d: 2.4,
    /* A hoarding: a portrait board with a visible frame, on ONE post set
       off centre, standing on its own ground. The first pass was a landscape
       board on two symmetric posts, which is the silhouette of a television
       on a stand, and /story on this site is drawn entirely in television
       sets. Taller than wide, framed, and one-legged, it cannot be a screen. */
    beyond: () => (
      <>
        <rect x="948" y="196" width="100" height="138" rx="3" className="ink-line ink-edge" />
        <rect x="957" y="205" width="82" height="120" rx="2" className="ink-line ink-thin" />
        <path d="M964 334 V 368" className="ink-line" />
        <path d={`M940 ${FLOOR_Y} H 1056`} className="ink-line ink-heavy" />
        <path d="M968 236 H1028 M968 256 H1012 M968 276 H1024 M968 296 H1002" className="ink-line ink-thin" />
      </>
    ),
  },
];

export function NoWayOut() {
  return (
    <figure className="noway">
      <svg
        className="ink noway__ink"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="A child standing inside a boundary with one hand on an episode and the other on a printable sheet, the three of them on one floor. Beyond the boundary wait a queue of episodes that would autoplay, a price tag marked in euro and an advertising hoarding on a post, and the path towards each one is cut by a bar just inside the wall."
      >
        {/* The wall. */}
        <rect
          x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} rx={WALL.rx} pathLength="1"
          className="ink-line ink-edge ink-draw"
          style={at(0.1, 1.1)}
        />

        {/* The floor everything inside stands on. */}
        <path
          d={`M270 ${FLOOR_Y} H 830`}
          pathLength="1"
          className="ink-line ink-heavy ink-draw"
          style={at(0.7, 0.6)}
        />

        {/* The episode: a landscape plate with a play mark, washed deep. */}
        <g className="ink-in" style={at(1.0)}>
          <rect x="320" y="250" width="205" height="116" rx="8" className="ink-wash ink-wash--deep" />
          <rect x="320" y="250" width="205" height="116" rx="8" className="ink-line ink-edge" />
          <path d="M402 286 L440 307 L402 328 Z" className="ink-line" />
          <path d="M334 352 H 511" className="ink-line ink-thin" />
        </g>

        {/* The child, between the two, a hand on each. */}
        <g className="ink-in" style={at(1.2)}>
          <circle cx="590" cy="220" r="19" className="ink-line ink-edge" />
          <path
            d={`M590 239 V 300 M590 300 L572 ${FLOOR_Y} M590 300 L608 ${FLOOR_Y} M590 256 L530 274 M590 256 L650 298`}
            className="ink-line"
          />
        </g>

        {/* The printable: a sheet with a folded corner, a title line and the
            puzzle grid, washed light. */}
        <g className="ink-in" style={at(1.4)}>
          <path d="M655 262 H741 L765 286 V366 H655 Z" className="ink-wash" />
          <path d="M655 262 H741 L765 286 V366 H655 Z" className="ink-line ink-edge" />
          <path d="M741 262 V286 H765" className="ink-line" />
          <path d="M670 288 H 716" className="ink-line" />
          <g className="ink-line ink-thin">
            <rect x="672" y="302" width="60" height="54" />
            <path d="M692 302 V356 M712 302 V356 M672 320 H732 M672 338 H732" />
          </g>
        </g>

        {/* The three ways out. The path and the thing it leads to appear
            together, then the bar cuts the path. The bar is a bar and not an
            arrowhead: an arrow pointing at a wall still reads as going
            somewhere. */}
        {EXITS.map((x) => (
          <g key={x.key}>
            <g className="ink-in" style={at(x.d)}>
              <path d={x.path} strokeDasharray="5 7" className="ink-line" />
              {x.beyond()}
            </g>
            <path
              d={x.stop}
              pathLength="1"
              className="ink-line ink-heavy ink-accent ink-draw"
              style={at(x.d + 0.22, 0.3)}
            />
          </g>
        ))}
      </svg>
    </figure>
  );
}
