import type { CSSProperties, ReactElement } from "react";
import "@/components/draw/draw.css";
import "./noway.css";

/* ============================================================================
   No way out.

   The line this sits under is the best sentence on the page: "A young child
   can find their way around it, and cannot accidentally find their way out of
   it." That is a shape, and both halves of it have to be in the drawing.

   WHAT WAS HERE BEFORE, and why it failed. The first version was a rounded
   boundary with three small identical circles inside it, joined in a
   triangle, and three dashed paths leaving the circles and stopping at a red
   bar just inside the wall. A caption beside it listed what the circles were
   ("Inside, all connected: Episodes, Activities, Printables") and what the
   bars stopped ("Autoplay to the next thing, A purchase inside the app, An
   advert"). The client's verdict was that it did not really illustrate what
   it sat next to, and the diagnosis is that only half of it did. The stops
   read: a path cut by a bar is a thing anyone can see. The inside did not
   read at all. Three unlabelled circles are a diagram of nothing, so the
   half of the sentence about a child finding their way AROUND the app was
   carried entirely by the caption, which is to say by a key. A drawing that
   needs a key is not finished (.parallel/CONTRACT.md, "legible beats
   unique"), and the specific failure is rule four of that section: an
   abstract node was drawn where a real artefact exists. An episode, an
   activity and a printable all have shapes. The circles had none.

   WHAT IS HERE NOW. Every node, inside and out, is the real object it stood
   for, so the drawing names its own parts and the caption is gone.

   Inside the boundary:
     An EPISODE, drawn as the landscape plate the walkthrough above shows
       four of, with a play mark in it.
     An ACTIVITY, drawn as a small child mid-jump, arms up. The page's own
       words for the activity are "a short movement or breathing prompt" and
       "something a child does rather than only sees", so the artefact of
       the activity is the child doing it. No face, no features: a round
       head and five lines, drawn the way the kit draws a person (posts and
       lines, see team/StageMark.tsx), with one arm higher than the other
       so it is a jump and not a pictogram.
     A PRINTABLE, drawn as a sheet of paper with a folded corner, a title
       line and a puzzle grid, which is the walkthrough's own mark for the
       puzzle sheet. The fold is what makes it paper rather than a screen.
   The three are joined to each other by solid lines, which is the claim
   that the play follows the story rather than sitting beside it, and that
   a child who taps anything gets somewhere they are meant to be.

   Outside the boundary, one real thing at the end of each exit, so the
   three stops name themselves too. All three are the page's own claims from
   the feature list, in its own words:
     "No autoplay into something nobody chose": a queue of plates stacked up
       beyond the top wall, the next things that would play by themselves.
     "No surprise purchases inside the app": a price tag beyond the left
       wall.
     "No advertising to children anywhere in it": a billboard on two posts
       beyond the right wall.
   They are drawn thin because they are never reached. The exit paths are
   dashed because they are the paths a child never takes. The bar across
   each one is the accent, and the only accent: the stop is what the drawing
   is about.

   THE STOP SITS INSIDE THE WALL, not on it. Taking the paths to the wall and
   laying the bars along it is tidier and reads worse: an accent bar on the
   boundary merges into it and looks like a red length of wall. The gap
   between bar and wall is deliberate. Each exit runs perpendicular to the
   wall it meets so its bar is one short straight line; the very first
   version ran them diagonally into the corners and the bars came out
   crooked, which read as a mistake.

   ORDER OF ARRIVAL. The boundary draws itself, the three things inside
   land, the lines between them draw, and then each exit appears with the
   thing it leads to and is cut by its bar, top, left, right. The stop is
   the last thing that happens, three times. Nothing loops. The kit's
   hold-until-seen gate pauses everything under an `.is-armed:not(.is-in)`
   ancestor and the page wraps this in a `Settle`, so there is no observer
   in here.

   MEANINGFUL, not decorative. With the caption gone the drawing is the only
   place on the page that puts the three exits against the three things
   inside, so the svg is `role="img"` with a label that says in words what
   the drawing says in ink.

   SIZE. It ships at up to 400px wide, standing alone under the pull
   statement on the prose axis, and takes the full column width below that.
   The old version was 300px beside a caption column; the caption is gone,
   so the drawing takes the room it needs to be read.
   ========================================================================== */

const at = (d: number, dur?: number): CSSProperties =>
  ({ "--d": `${d}s`, ...(dur !== undefined ? { "--dur": `${dur}s` } : {}) }) as CSSProperties;

/* The three exits. Each `path` runs from the thing inside to just short of
   its bar, each `stop` is the bar, and each `beyond` is the thing outside
   the wall the path was heading for. `d` is when the exit starts. */
const EXITS: { key: string; path: string; stop: string; d: number; beyond: () => ReactElement }[] = [
  {
    key: "autoplay",
    path: "M180 92 V 72",
    stop: "M163 70 H197",
    d: 2.0,
    /* The next things, queued. Three plates stacked up and back, the front
       one carrying the play mark. */
    beyond: () => (
      <>
        <rect x="172" y="6" width="40" height="26" rx="3" />
        <rect x="166" y="12" width="40" height="26" rx="3" />
        <rect x="160" y="18" width="40" height="26" rx="3" />
        <path d="M175 25 L185 31 L175 37 Z" />
      </>
    ),
  },
  {
    key: "purchase",
    path: "M98 196 H 80",
    stop: "M78 180 V 212",
    d: 2.18,
    /* A price tag, point and hole towards the wall. */
    beyond: () => (
      <>
        <path d="M20 196 L32 184 H50 V208 H32 Z" />
        <circle cx="34" cy="196" r="2.6" />
      </>
    ),
  },
  {
    key: "advert",
    path: "M264 196 H 282",
    stop: "M284 180 V 212",
    d: 2.36,
    /* A billboard on two posts, with two lines of copy on it. */
    beyond: () => (
      <>
        <rect x="310" y="178" width="42" height="26" rx="2" />
        <path d="M320 204 V 220 M342 204 V 220" />
        <path d="M317 187 H345 M317 195 H335" />
      </>
    ),
  },
];

/* The lines between the three things inside. Each starts at the edge of one
   object and ends at the edge of the next, never at a centre, so they read as
   paths between things rather than as a triangle with things on its corners. */
const JOINS = [
  "M161 130 L124 160",
  "M199 130 L236 170",
  "M134 196 H224",
];

export function NoWayOut() {
  return (
    <figure className="noway">
      <svg
        className="ink noway__ink"
        viewBox="0 0 360 258"
        role="img"
        aria-label="An episode, a movement activity and a printable sheet, joined to each other inside a boundary. Three paths lead out of it, towards the next things queued to autoplay, a price tag and a billboard, and each one stops at a bar just inside the boundary."
      >
        {/* The boundary. */}
        <rect
          x="62" y="56" width="236" height="190" rx="26" pathLength="1"
          className="ink-line ink-draw"
          style={at(0.1, 1.1)}
        />

        {/* The episode: a landscape plate with a play mark. */}
        <g className="ink-in" style={at(0.85)}>
          <rect x="152" y="92" width="56" height="38" rx="4" className="ink-fill" />
          <rect x="152" y="92" width="56" height="38" rx="4" className="ink-line" />
          <path d="M174 103 L188 111 L174 119 Z" className="ink-line" />
        </g>

        {/* The activity: a child mid-jump, arms up, one higher than the other. */}
        <g className="ink-in" style={at(1.0)}>
          <circle cx="116" cy="170" r="6.5" className="ink-fill" />
          <circle cx="116" cy="170" r="6.5" className="ink-line" />
          <path
            d="M116 177 V 197 M116 182 L101 170 M116 182 L130 167 M116 197 L106 214 M116 197 L127 213"
            className="ink-line"
          />
        </g>

        {/* The printable: a sheet with a folded corner, a title line and a
            puzzle grid. */}
        <g className="ink-in" style={at(1.15)}>
          <path d="M226 170 H250 L262 182 V216 H226 Z" className="ink-fill" />
          <path d="M226 170 H250 L262 182 V216 H226 Z" className="ink-line" />
          <path d="M250 170 V182 H262" className="ink-line" />
          <path d="M232 182 H244" className="ink-line" />
          <g className="ink-line ink-thin">
            <rect x="233" y="190" width="21" height="21" />
            <path d="M240 190 V211 M247 190 V211 M233 197 H254 M233 204 H254" />
          </g>
        </g>

        {/* Everything inside leads to everything inside. */}
        {JOINS.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            className="ink-line ink-thin ink-draw"
            style={at(1.35 + i * 0.15, 0.45)}
          />
        ))}

        {/* The three ways out. The path and the thing it leads to appear
            together, then the bar cuts the path. The bar is a bar and not an
            arrowhead: an arrow pointing at a wall still reads as going
            somewhere. */}
        {EXITS.map((x) => (
          <g key={x.key}>
            <g className="ink-line ink-thin ink-in" style={at(x.d)}>
              <path d={x.path} strokeDasharray="4 5" />
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
