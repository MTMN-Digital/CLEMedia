import type { CSSProperties, ReactElement } from "react";
import "@/components/draw/draw.css";
import "./stagemark.css";

/* ============================================================================
   Six marks, one per review stage.

   THE PROBLEM WITH THE BRIEF, stated before the answer. Six small drawings
   shown together, three across and two down, is the shape of an icon row,
   and an icon row is banned on this site (draw.css, rule three). The marks
   below are drawn to not be one, and it is worth being explicit about what
   that took, because "six clever icons" would have failed the same test.

   1. THEY DIFFER IN KIND. One is three canes tied at the top and pushed
      into bare ground, with nothing growing on them (01, an open frame,
      all line, no object inside it). One is a pile of paper with one sheet
      pulled out (02, a cluster, mostly thin). One is a stack standing on a floor (03, an
      object, tall). One is two lines of sight meeting a page (04, a
      gesture, open, mostly thin). One is a dense jagged line with a mark
      over part of it (05, a trace again but of a different texture, and
      annotated). One is a barrier down over a thing on the ground (06, an
      object, grounded, heavy). They do not share a silhouette, a visual
      mass, a stroke mix, or a box: the viewBoxes run from 56 to 96 wide on
      a 48 unit height and the CSS sizes by height, so the wide ones are
      wide and the tall one is tall. The eye cannot line them up.

   2. EACH ONE DEPICTS WHAT ONLY ITS STAGE DOES. The test used was the
      brief's own: would this mark serve the next stage with the label
      swapped. An empty frame set before anything grows is only the stage
      that happens before anything exists. The pulled take is only the
      stage that selects assets rather than accepting them. The blocks are
      only the offline, hands-on activity reviewed against early years
      practice. Two heights reading one page is only the stage that reads
      as a parent and as a child. A take with a stretch bracketed to redo is
      only the stage that listens. A barrier down is only the stage that can
      hold a release.

   3. NONE IS A CATEGORY SYMBOL. No magnifier, bulb, tick, gear, lined
      document, bubble or eye. Each is a thing that is physically on a desk
      or in a room when that stage happens in a small studio.

   4. 06 IS NOT THE SIXTH OF SIX. It is the only mark with the accent, the
      only one with a heavy stroke, the only one with a solid, the only one
      standing on the kit's ground line, and the last thing that moves in it
      is the arm coming down. The accent is spent here and nowhere else in
      the set, which is the kit's rule and the page's claim: five stages
      decide, one can stop.

   THE SIX, for the record:
   01  A bean frame: three canes tied together at the top and set into the
       ground, with nothing on them yet. The first thing put into a garden,
       before anything grows, and the thing everything that grows is held
       to. Three canes, one tie, bare ground.
   02  Assets as they arrive, fanned in a loose pile, thin. The one the
       director picked, lifted out and set square at full weight.
   03  Three blocks stacked the way a child stacks them, the top one not
       quite straight, standing on the activity sheet lying flat.
   04  The script, upright, read from two heights: a tall post and a short
       one, each with a line of sight to the page.
   05  A voice take as a hand-drawn trace, with the stretch to redo
       bracketed above it.
   06  The barrier down. The episode waits on the ground under the arm; the
       arm and its hinge are the one red in the set.

   DECORATIVE, deliberately. Both hosts already carry the number, the stage,
   the person and the sentence as text, so every svg is aria-hidden and
   carries no label of its own. A label here would be the same text twice.

   ARRIVAL. The kit's classes only, with `--d` and `--dur`; each mark
   choreographs itself inside roughly 1.3s and then stops. The kit's
   hold-until-seen gate pauses everything under an `.is-armed:not(.is-in)`
   ancestor, which both hosts provide, so there is no observer in here. A
   host can push the whole choreography later with `--stagemark-delay`.
   ========================================================================== */

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6;

/* A delay inside the mark, offset by whatever the host asks for. */
const at = (d: number, dur?: number): CSSProperties =>
  ({
    "--d": `calc(var(--stagemark-delay, 0s) + ${d}s)`,
    ...(dur !== undefined ? { "--dur": `${dur}s` } : {}),
  }) as CSSProperties;

const SVG = { className: "ink stagemark", "aria-hidden": true, focusable: "false" } as const;

/* 01. Set before anything exists. The first draft of this was a story arc
   with the acts ticked, and at 56px on a cream slip a curve with ticks on
   it is a line graph, whatever the ticks mean. This is the frame a gardener
   puts up before anything is planted: three canes pushed into bare ground
   and tied together at the top, and nothing growing on them. The concept,
   the story and the learning goal are the three canes, set at once and
   held by one tie, and everything that grows later is held to them. Only
   the stage that happens before anything exists can be an empty frame.

   The canes cross and carry on past the tie, the way cut canes do. That
   crossing is what stops it reading as a camera tripod, which on a media
   company's site would say the opposite of the sentence beside it. The
   canes are cut to three different lengths because they are canes, not a
   drawn triangle; the feet go through the ground line because they are
   pushed in, not stood on it. Each cane draws from its foot upward, left,
   right, then the back one, and the tie lands last. No ink-heavy and no
   accent: the ground here is the thin line of 04's floor, not the surface
   06 stands on. */
function Canes() {
  return (
    <svg {...SVG} viewBox="0 0 60 48">
      <path d="M3 44 H57" className="ink-line ink-thin ink-in" style={at(0)} />
      <path d="M7 47.5 L35.3 7" pathLength="1" className="ink-line ink-draw" style={at(0.1, 0.5)} />
      <path d="M53 47.5 L23.5 8.8" pathLength="1" className="ink-line ink-draw" style={at(0.3, 0.5)} />
      <path d="M31 47 L28.2 3" pathLength="1" className="ink-line ink-draw" style={at(0.5, 0.5)} />
      <g className="ink-in" style={at(0.95)}>
        <circle cx="29" cy="16" r="2.6" className="ink-fill" />
        <circle cx="29" cy="16" r="2.6" className="ink-line" />
      </g>
    </svg>
  );
}

/* 02. Selected, not accepted as they arrive. The pile is thin and loose
   because nobody chose its order; the picked one is the only full-weight
   line, and it draws itself after the pile has landed. */
function Picked() {
  return (
    <svg {...SVG} viewBox="0 0 64 48">
      <g className="ink-line ink-thin ink-in" style={at(0)}>
        <rect x="6" y="26" width="24" height="17" rx="1.5" transform="rotate(-12 18 34)" />
        <rect x="10" y="27" width="24" height="17" rx="1.5" transform="rotate(-4 22 35)" />
        <rect x="14" y="28" width="24" height="17" rx="1.5" transform="rotate(4 26 36)" />
      </g>
      <rect x="34" y="6" width="25" height="18" rx="1.5" className="ink-fill ink-in" style={at(0.4)} />
      <rect
        x="34" y="6" width="25" height="18" rx="1.5"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0.4, 0.7)}
      />
    </svg>
  );
}

/* 03. Early years practice is hands-on. The blocks land one on another,
   bottom first, and the top one is set down a few degrees off, which is how
   a child sets a block down. The sheet under them is the activity. */
function Blocks() {
  return (
    <svg {...SVG} viewBox="0 0 56 48">
      <path d="M4 44 L14 31 H52 L42 44 Z" className="ink-line ink-thin ink-in" style={at(0)} />
      <g className="ink-in" style={at(0.25)}>
        <rect x="18" y="31" width="19" height="11" className="ink-fill" />
        <rect x="18" y="31" width="19" height="11" className="ink-line" />
      </g>
      <g className="ink-in" style={at(0.5)}>
        <rect x="22" y="20" width="14" height="11" className="ink-fill" />
        <rect x="22" y="20" width="14" height="11" className="ink-line" />
      </g>
      <g className="ink-in" style={at(0.75)} transform="rotate(7 25.5 13.5)">
        <rect x="20" y="8" width="11" height="11" className="ink-fill" />
        <rect x="20" y="8" width="11" height="11" className="ink-line" />
      </g>
    </svg>
  );
}

/* 04. Read again, from two heights. The page is upright and full weight;
   the two readers are a tall post and a short one on the same floor, and
   their lines of sight draw out to the page after it is there. No faces,
   no eyes: the heights are the whole point. */
function TwoHeights() {
  return (
    <svg {...SVG} viewBox="0 0 72 48">
      <path d="M2 44 H44" className="ink-line ink-thin ink-in" style={at(0)} />
      <path d="M9 44 V 6 M24 44 V 27" className="ink-line ink-in" style={at(0.1)} />
      <g className="ink-in" style={at(0.3)}>
        <rect x="50" y="8" width="17" height="30" rx="1" className="ink-fill" />
        <rect x="50" y="8" width="17" height="30" rx="1" className="ink-line" />
      </g>
      <path d="M9 6 L50 15" pathLength="1" className="ink-line ink-thin ink-draw" style={at(0.6, 0.6)} />
      <path d="M24 27 L50 30" pathLength="1" className="ink-line ink-thin ink-draw" style={at(0.8, 0.5)} />
    </svg>
  );
}

/* 05. Listened to. The take is a hand-drawn trace, uneven on purpose, and
   it draws itself at the pace of being played through. The bracket lands
   after, over the stretch that gets sent back. */
function Take() {
  return (
    <svg {...SVG} viewBox="0 0 88 48">
      <path
        d="M4 28 l3 -3 2 5 3 -9 2 7 3 -4 3 11 2 -16 3 9 2 -3 3 7 3 -12 2 7 3 -4 2 6 3 -13 3 15 2 -9 3 6 2 -3 3 7 3 -11 2 5 3 -3 2 6 3 -8 3 6 2 -3 3 2"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0, 1.1)}
      />
      <path d="M38 9 v -4 h 27 v 4" className="ink-line ink-in" style={at(1.05)} />
    </svg>
  );
}

/* 06. Held. Ground first, then the episode waiting on it, then the post
   rises, and last the arm comes down from the hinge: the arm's path starts
   at the post so `.ink-draw` swings it out from there. The arm and the hinge
   are the only accent in the set. */
function Held() {
  return (
    <svg {...SVG} viewBox="0 0 64 48">
      <path d="M2 45 H62" className="ink-line ink-heavy ink-in" style={at(0)} />
      <g className="ink-in" style={at(0.2)}>
        <rect x="8" y="33" width="13" height="12" rx="1" className="ink-fill" />
        <rect x="8" y="33" width="13" height="12" rx="1" className="ink-line" />
      </g>
      <path d="M52 45 V 12" pathLength="1" className="ink-line ink-draw" style={at(0.35, 0.5)} />
      <circle cx="52" cy="14" r="3" className="ink-accent-fill ink-in" style={at(0.8)} />
      <path d="M54 14 H 10" pathLength="1" className="ink-line ink-heavy ink-accent ink-draw" style={at(0.85, 0.55)} />
    </svg>
  );
}

const MARKS: Record<StageNumber, () => ReactElement> = {
  1: Canes,
  2: Picked,
  3: Blocks,
  4: TwoHeights,
  5: Take,
  6: Held,
};

/* `n` is the company's own stage number, 1 to 6, as a number or as the
   two-digit string the data files carry ("01"). Anything else renders
   nothing rather than a wrong drawing. */
export function StageMark({ n }: { n: StageNumber | number | string }) {
  const k = typeof n === "string" ? Number.parseInt(n, 10) : n;
  const Mark = (MARKS as Partial<Record<number, () => ReactElement>>)[k];
  if (!Mark) return null;
  return <Mark />;
}
