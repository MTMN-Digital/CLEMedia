import type { ReactElement, CSSProperties } from "react";
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

   WHAT IS HERE NOW. One landscape plate taking the full column the way the
   production line on /ethical-ai does, so the drawing is the width of the
   sentence above it rather than a stamp in its corner.

   THE UNIT (2026-10-11, later the same day). The plate is authored at 550
   units across and renders at 1376px, so one user unit is 2.5 CSS pixels and
   the kit's 2-unit line is 5px wide. It was 1100 units at the same width,
   1.25px per unit, and the graphite tooth the kit now composites into every
   stroke needs about four device pixels of line to sit in: at 1.25 it read
   as dirt on the line rather than as pencil. The page could not give the
   drawing more room (it already has the whole column), so every coordinate
   was halved against the same rendered width instead. Stroke widths are the
   kit's and were NOT halved: that is the whole trick, the line keeps its
   device size while the geometry gets finer around it. The wobble and the
   tooth are in user units too, so they also doubled in CSS pixels, which is
   what brings this plate to the same hand as the rest of the site. Two
   things were re-tuned rather than halved because they are stroke-relative:
   the dash array on the exit paths and the tag's hole. Both are noted where
   they sit.

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
const VB_W = 550;
const VB_H = 215;
const WALL = { x: 115, y: 55, w: 320, h: 150, rx: 20 };
const FLOOR_Y = 184;

/* The exit paths are dashed in user units, like everything else, so the
   dash kept its proportion to the stroke when the unit halved (a 5-unit dash
   under a 2-unit round-capped line is still a dash and not a dot). What did
   change is how many of them fit: the shortest path is 28 units, which at
   the old "5 7" is two dashes and a stub. "4 5" puts three to four dashes on
   each path, and a 4-unit dash with its caps is still three stroke widths
   long. */
const DASH = "4 5";

/* The three exits. Each `path` runs from the thing inside to just short of
   its bar, each `stop` is the bar, and each `beyond` is the thing outside
   the wall the path was heading for. `d` is when the exit starts. */
const EXITS: { beyond: () => ReactElement; path: string; key: string; d: number; stop: string }[] = [
  {
    key: "autoplay",
    path: "M211 122 V 81",
    stop: "M196 77.5 H 226",
    d: 2.0,
    /* The next things, queued. Three plates stacked up and back beyond the
       top wall, the front one carrying the play mark. The two behind are
       drawn as only the edges the front one leaves visible, rather than as
       full rectangles under a paper fill: `.ink-fill` is the raised white and
       on this ground it read as the brightest thing in the drawing. */
    beyond: () => (
      <>
        <path d="M193 9 V 7 a3 3 0 0 1 3 -3 H 250 a3 3 0 0 1 3 3 V 36 a3 3 0 0 1 -3 3 H 247" className="ink-line ink-thin" />
        <path d="M187 14 V 12 a3 3 0 0 1 3 -3 H 244 a3 3 0 0 1 3 3 V 41 a3 3 0 0 1 -3 3 H 241" className="ink-line ink-thin" />
        <rect x="181" y="14" width="60" height="35" rx="3" className="ink-line ink-edge" />
        <path d="M205 25 L218 31.5 L205 38 Z" className="ink-line" />
      </>
    ),
  },
  {
    key: "purchase",
    path: "M157 155 H 129",
    stop: "M126 142 V 168",
    d: 2.2,
    /* A price tag, point and hole towards the room, with a euro mark on it.
       Two label lines read as a luggage tag; the currency mark is what makes
       it a price. It is drawn, not set as <text>, so it stays in the hand
       and takes the wobble with the rest.

       The hole is `.ink-thin` at r 3 rather than `.ink-line` at the halved
       r 2.25: a 2-unit stroke on a 2.25 radius leaves no hole in the middle,
       it is a dot. It is detail inside the tag, so the thin weight is the
       right one anyway. The euro keeps its halved geometry: the arc is 7.5
       in radius and the two bars sit 4 units apart under a 2-unit line,
       which leaves a 2-unit gap of paper between them, enough to read as two
       bars and not one thick one. */
    beyond: () => (
      <>
        <path d="M35 144 H78 L98 155 L78 166 H35 Z" className="ink-line ink-edge" />
        <circle cx="83" cy="155" r="3" className="ink-line ink-thin" />
        <path d="M65 149.5 A 7.5 7.5 0 1 0 65 160.5 M50 153 H 64 M50 157 H 63" className="ink-line" />
      </>
    ),
  },
  {
    key: "advert",
    path: "M386 150 H 421",
    stop: "M424 137 V 163",
    d: 2.4,
    /* A hoarding: a portrait board with a visible frame, on ONE post set
       off centre, standing on its own ground. The first pass was a landscape
       board on two symmetric posts, which is the silhouette of a television
       on a stand, and /story on this site is drawn entirely in television
       sets. Taller than wide, framed, and one-legged, it cannot be a screen. */
    beyond: () => (
      <>
        <rect x="474" y="98" width="50" height="69" rx="1.5" className="ink-line ink-edge" />
        <rect x="478.5" y="102.5" width="41" height="60" rx="1" className="ink-line ink-thin" />
        <path d="M482 167 V 184" className="ink-line" />
        <path d={`M470 ${FLOOR_Y} H 528`} className="ink-line ink-heavy" />
        <path d="M484 118 H514 M484 128 H506 M484 138 H512 M484 148 H501" className="ink-line ink-thin" />
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
          d={`M135 ${FLOOR_Y} H 415`}
          pathLength="1"
          className="ink-line ink-heavy ink-draw"
          style={at(0.7, 0.6)}
        />

        {/* The episode: a landscape plate with a play mark, washed deep. */}
        <g className="ink-in" style={at(1.0)}>
          <rect x="160" y="125" width="102.5" height="58" rx="4" className="ink-wash ink-wash--deep" />
          <rect x="160" y="125" width="102.5" height="58" rx="4" className="ink-line ink-edge" />
          <path d="M201 143 L220 153.5 L201 164 Z" className="ink-line" />
          <path d="M167 176 H 255.5" className="ink-line ink-thin" />
        </g>

        {/* The child, between the two, a hand on each. */}
        <g className="ink-in" style={at(1.2)}>
          <circle cx="295" cy="110" r="9.5" className="ink-line ink-edge" />
          <path
            d={`M295 119.5 V 150 M295 150 L286 ${FLOOR_Y} M295 150 L304 ${FLOOR_Y} M295 128 L265 137 M295 128 L325 149`}
            className="ink-line"
          />
        </g>

        {/* The printable: a sheet with a folded corner, a title line and the
            puzzle grid, washed light. */}
        <g className="ink-in" style={at(1.4)}>
          <path d="M327.5 131 H370.5 L382.5 143 V183 H327.5 Z" className="ink-wash" />
          <path d="M327.5 131 H370.5 L382.5 143 V183 H327.5 Z" className="ink-line ink-edge" />
          <path d="M370.5 131 V143 H382.5" className="ink-line" />
          <path d="M335 144 H 358" className="ink-line" />
          <g className="ink-line ink-thin">
            <rect x="336" y="151" width="30" height="27" />
            <path d="M346 151 V178 M356 151 V178 M336 160 H366 M336 169 H366" />
          </g>
        </g>

        {/* The three ways out. The path and the thing it leads to appear
            together, then the bar cuts the path. The bar is a bar and not an
            arrowhead: an arrow pointing at a wall still reads as going
            somewhere. */}
        {EXITS.map((x) => (
          <g key={x.key}>
            <g className="ink-in" style={at(x.d)}>
              <path d={x.path} strokeDasharray={DASH} className="ink-line" />
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
