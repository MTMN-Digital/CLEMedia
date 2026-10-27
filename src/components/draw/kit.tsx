import { useId } from "react";
import "./draw.css";
import "./kit.css";

/* ============================================================================
   The drawn kit: structure, not illustration.

   WHAT CHANGED ON 2026-10-27. This site has owned a drawing kit since the
   first pass and has been using it for pictures: a child, a script, a garden,
   a fork in a road, each sitting beside the content. Everything structural,
   every card edge, every hairline, every frame, was a one pixel border or a
   border radius, which is what every other site uses. The client's call was
   to promote the hand from illustration to structure.

   TWO PRIMITIVES carry nearly all of it. `DrawnBox` replaces a card's border,
   `DrawnRule` replaces a hairline. `DrawnCorner` holds a photograph the way
   an album does, `DrawnBracket` marks one row of a set without boxing it, and
   `Perf` is the one piece built for a single job: the filmstrip.

   THE RULE THAT KEEPS IT A HAND. One path used forty times is a pattern, not
   a hand. So the box and the rule each carry three strokes and the caller
   passes its index; a set cycles them and no two neighbours match. The single
   exception is `Perf`, which repeats exactly on purpose, because real film
   perforations are punched the same.

   WHY THEY STRETCH. One box has to serve a card 300px wide and a frame 1300px
   wide. `preserveAspectRatio="none"` stretches the path to the element and
   `vector-effect="non-scaling-stroke"` keeps the stroke off that transform, so
   the weight is identical everywhere and only the wobble stretches, which is
   what a drawn line does when you draw a longer one.

   AND WHY THEY DO NOT DRAW THEMSELVES. `.ink-draw` animates a dash array
   measured in user units, which stops matching `pathLength` the moment the
   stroke leaves that coordinate system. A stretched box drawing itself comes
   out in pieces. They fade with `.ink-in` instead; the marks that DO draw
   themselves, the loops and the lines on /ethical-ai, are unstretched.
   ========================================================================== */

/* Hand-placed wobble. A random walk reads as noise; a drawn rectangle is four
   confident strokes that miss. */
const BOXES = [
  "M4 7 C60 4, 140 5, 196 6 C197 44, 196 80, 195 114 C132 116, 68 115, 5 113 C3 78, 4 42, 4 7Z",
  "M5 5 C62 7, 139 4, 195 7 C196 43, 195 79, 196 115 C130 113, 70 117, 4 114 C5 77, 3 41, 5 5Z",
  "M4 8 C58 5, 142 7, 196 5 C194 42, 197 81, 195 113 C134 117, 66 113, 5 115 C4 79, 5 43, 4 8Z",
];

/** The edge of a card, a panel or a frame. Absolute: give the parent `relative`. */
export function DrawnBox({ v = 0, className = "" }: { className?: string; v?: number }) {
  return (
    <svg
      className={`ink dk-box ${className}`}
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink-line ink-in" vectorEffect="non-scaling-stroke" d={BOXES[v % BOXES.length]} fill="none" />
    </svg>
  );
}

const RULES = [
  "M2 3 C120 1.5, 240 4.2, 360 2.6 C440 1.8, 520 3.8, 598 2.4",
  "M2 2.6 C110 4, 230 1.8, 350 3.4 C450 4.4, 520 2, 598 3.2",
  "M2 3.4 C130 2, 250 4, 370 2.2 C460 1.4, 530 3.6, 598 2.8",
];

/** A hairline, drawn. Sits in normal flow unless given a positioning class. */
export function DrawnRule({ v = 0, className = "" }: { className?: string; v?: number }) {
  return (
    <svg
      className={`ink dk-rule ${className}`}
      viewBox="0 0 600 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className="ink-line ink-in" vectorEffect="non-scaling-stroke" d={RULES[v % RULES.length]} fill="none" />
    </svg>
  );
}

/** One album corner. Four of them hold a picture without boxing it. */
export function DrawnCorner({ at }: { at: "tr" | "tl" | "bl" | "br" }) {
  return (
    <svg className={`ink dk-corner dk-corner--${at}`} viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <path className="ink-line ink-in" d="M24 3.4 C17 2.4, 9.5 3.4, 4.4 3 C3.4 9.5, 4 16.5, 3.4 23.5" fill="none" />
    </svg>
  );
}

/** Marks one thing in a set. The alternative to a tinted panel round it. */
export function DrawnBracket({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ink dk-bracket ${className}`}
      viewBox="0 0 14 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="ink-line ink-in"
        vectorEffect="non-scaling-stroke"
        d="M11 2 C6 3, 3.4 2.6, 2.6 8 C2 30, 3.4 50, 2.6 70 C3 92, 5 96, 11 98"
        fill="none"
      />
    </svg>
  );
}

/** A row of perforations. A `<pattern>` tiles; a scaled path stretches. */
export function Perf({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={`ink dk-perf ${className}`} height="14" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`perf-${uid}`} patternUnits="userSpaceOnUse" width="27" height="14">
          <path
            className="ink-line ink-thin"
            d="M4 3.4 C9.5 2.8, 17 3.3, 22 3 C22.4 6, 22 9, 22.2 11 C17 11.7, 9 11, 4.5 11.2 C3.9 8.6, 4.3 6, 4 3.4Z"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#perf-${uid})`} />
    </svg>
  );
}
