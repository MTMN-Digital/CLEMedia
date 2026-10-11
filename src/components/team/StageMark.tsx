import type { ReactElement, CSSProperties } from "react";
import "@/components/draw/draw.css";
import "./stagemark.css";

/* ============================================================================
   Six marks, one per review stage. SECOND SET, drawn 2026-10-10, REWEIGHTED
   2026-10-11.

   WHAT THE FIRST SET WAS, AND WHY IT FAILED. The first brief demanded six
   marks each unique in kind and silhouette and banned any repetition, and
   the set it got followed that brief well: a story arc for 01 (later a bean
   frame), a fanned pile with one sheet picked out for 02, stacked blocks for
   03, two posts with sightlines to a page for 04, a voice trace with a
   bracket for 05, a barrier down for 06. The client, looking at them in place
   on the review board, said they "don't really illustrate what they are next
   to." He was right, and the fault was the brief, not the hand. Four of the
   six stages are the SAME ACTION: a named person reads the work and can
   object to it. The only way to draw that four different ways was to reach
   for a different metaphor each time, and each metaphor needed its caption
   to teach it. A drawing whose caption has to explain it is not working.
   Only 06 read on its own, and 05 half read.

   THE RULE NOW, written into .parallel/CONTRACT.md as LEGIBLE BEATS UNIQUE:
   1. Legibility first. The reader gets it from the drawing, not the caption.
   2. Where two stages genuinely do the same thing, they CARRY THE SAME MARK.
      Repetition across a set is honest when the work repeats. Difference is
      earned, never manufactured.
   3. Draw the ARTEFACT, not the abstraction. "Educational review" has no
      shape; the activity sheet it reviews does.
   "Never an icon row" still stands: six interchangeable glyphs in matched
   boxes standing in for categories. A set of drawn artefacts at different
   sizes, two of them the same because the work is the same, is not that.
   Do not re-litigate this by making the six different again.

   WHAT CHANGED ON 2026-10-11, AND WHY. The second set had the right six
   objects and nobody could read them. Every line in it was the kit's one
   2-unit stroke, outline only, at 40px, so a page and the text on it were
   the same value and 03 (three small outlines over a dotted rule) was a
   smudge. Three things fixed that, none of them a new metaphor:
   - WEIGHT. Every object's own silhouette is `.ink-edge`. Printed text
     inside a page is `.ink-thin`. A mark a person makes BY HAND (the first
     strokes on 01, the reader's marks on 04, the traced line on 03) is the
     full `.ink-line`, heavier than the print it sits beside, which is how
     the drawing says a hand was here.
   - TONE. Every object stands on a `.ink-wash--deep` of itself, offset down
     and right, or on a toned back page, so it sits forward of the ground.
     The frame in 05 has a toned ground under its horizon so it reads as a
     picture rather than a box with a line in it.
   - SIZE. Both hosts now set 56px. At 40px the thin lines were under a
     pixel and nothing above could have saved them.
   03 was also redrawn as what a worksheet for a four year old actually
   looks like: one big shape coloured in, one still empty beside it, and a
   dotted line under them that a hand has started to trace. Three sizes of
   shape in a row was a key with no legend.

   THE SIX. Each is the thing the stage physically handles.
   01  One blank page with the first hand-written marks on it. Nothing else
       exists yet; the page is mostly empty and the two strokes are
       handwriting at full weight, not printed lines.
   02  The script: a stack of pages, the front one in screenplay layout
       (a short centred character cue, then an indented block of dialogue,
       twice). It arrives line by line, because here it is being written.
   03  The activity sheet that follows the episode, landscape. A shape
       coloured in, a shape still to do, a dotted line half traced. This is
       the object Paula reviews against early years practice.
   04  THE SAME SCRIPT AS 02, on purpose: Lydia and Kirstie read the script
       Alan wrote. It is already whole when it arrives, and what draws is a
       reader's mark in the margin beside each block. Written at 02, read
       at 04, one artefact.
   05  The finished episode: a 16:9 frame with a picture in it and the voice
       take as a hand-drawn trace beneath, the same width, because the stage
       checks voices AND visuals.
   06  The barrier down, kept from the first set because it was the one that
       worked. The episode waits on the ground under the arm, drawn at the
       same 16:9 proportion as the frame in 05 so it is recognisably the
       same object; the arm and its hinge are the one red in the set.

   THE ACCENT IS SPENT ON 06 AND NOWHERE ELSE. Five marks are ink only. 06
   being the single coloured mark is load-bearing: it is the only stage that
   can stop a release.

   SIZED BY HEIGHT. Every viewBox is 48 tall and the widths run from 40 to
   64, so a page is narrow and a sheet or a barrier is wide. The CSS sizes by
   height and lets the width fall out, which is most of what stops six marks
   in a grid lining up as tiles. Designed to read at 56px, which is what both
   hosts (the /ethical-ai gates and the /team slips) now set.

   DECORATIVE, deliberately. Both hosts already carry the number, the stage,
   the person and the sentence as text, so every svg is aria-hidden and
   carries no label of its own.

   ARRIVAL. The kit's classes only, with `--d` and `--dur`; each mark
   choreographs itself inside roughly 1.3s and then stops. The kit's
   hold-until-seen gate pauses everything under an `.is-armed:not(.is-in)`
   ancestor, which both hosts provide, so there is no observer in here. A
   host can push the whole choreography later with `--stagemark-delay`.
   ========================================================================== */

export type StageNumber = 6 | 5 | 4 | 1 | 2 | 3;

/* A delay inside the mark, offset by whatever the host asks for. */
const at = (d: number, dur?: number): CSSProperties =>
  ({
    "--d": `calc(var(--stagemark-delay, 0s) + ${d}s)`,
    ...(dur !== undefined ? { "--dur": `${dur}s` } : {}),
  }) as CSSProperties;

/* `.ink--fine`, ALL SIX, decided 2026-10-11. The kit's default filter now
   carries a graphite tooth that needs about four device pixels of stroke to
   sit in. These marks are 48 units tall rendered at 56px, so a user unit is
   1.17 CSS pixels and the 2-unit line is 2.3px: at that size the tooth is
   not graphite, it is a speckled smudge along every edge (photographed on
   the /team slips before this change). Neither route to a bigger unit is
   open to a mark inside a card. Growing the box to the 96px the tooth needs
   crowds the portraits beside it and makes the card worse to fix a texture
   nobody sees at 56px. Halving the coordinates instead would put the
   script's seven 1.4-unit print lines on a 2.25-unit pitch, which does not
   read as text. So the six keep the hand's wobble and drop the tooth, as
   one set: half the marks on one filter and half on the other would show. */
const SVG = { className: "ink ink--fine stagemark", "aria-hidden": true, focusable: "false" } as const;

/* One page, the size every page in the set shares. The script (02, 04) and
   the first page (01) are the same sheet so the family reads across the
   board: one page, then a stack of them, then the stack again. */
const PAGE = { x: 3, y: 3, width: 32, height: 43, rx: 1 } as const;
/* The tone a lone object stands on: itself, offset down and right. */
const SHADOW = 2.5;

/* An object with its own paper, its own edge, and a toned shadow under it.
   Rendered in that order so the wash is under the line work. */
function Sheet({ x, y, width, height, rx }: { width: number; height: number; y: number; rx: number; x: number }) {
  return (
    <>
      <rect x={x + SHADOW} y={y + SHADOW} width={width} height={height} rx={rx} className="ink-wash--deep" />
      <rect x={x} y={y} width={width} height={height} rx={rx} className="ink-fill" />
      <rect x={x} y={y} width={width} height={height} rx={rx} className="ink-line ink-edge" />
    </>
  );
}

/* 01. Nothing exists yet. One page, blank, and the first two strokes of
   handwriting at the top: the first runs most of the width, the second
   stops short because the hand is still going. Full-weight strokes, because
   this is a hand writing on a page, not a page that has been typed. The
   rest of the page stays empty, which is the whole statement. */
function FirstPage() {
  return (
    <svg {...SVG} viewBox="0 0 40 48">
      <g className="ink-in" style={at(0)}>
        <Sheet {...PAGE} />
      </g>
      <path
        d="M8.5 11 q2 -2.4 4 0 t4 0 t4 0 t4 0 t4 0"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0.3, 0.5)}
      />
      <path
        d="M8.5 18.5 q2 -2.4 4 0 t4 0 t4 0"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0.75, 0.4)}
      />
    </svg>
  );
}

/* The script page's lines, in screenplay layout: a short cue centred on the
   page, then a block of dialogue indented under it, twice. Shared by 02 and
   04 so the two stages carry the identical page. */
const SCRIPT_LINES = [
  "M15 10.5 H23",
  "M10 15.5 H30",
  "M10 20 H28",
  "M10 24.5 H29",
  "M15 31 H23",
  "M10 36 H30",
  "M10 40.5 H26",
] as const;

/* The stack: a second page behind the front one, drawn as tone with a thin
   edge, so only its top and right show past the front page and the pair
   read as paper on paper rather than two outlines. */
function ScriptPages() {
  return (
    <>
      <rect x="8" y="0.5" width="32" height="43" rx="1" className="ink-wash--deep" />
      <rect x="8" y="0.5" width="32" height="43" rx="1" className="ink-line ink-thin" />
      <rect {...PAGE} className="ink-fill" />
      <rect {...PAGE} className="ink-line ink-edge" />
    </>
  );
}

/* 02. The script being written. The stack lands, then the lines arrive one
   after another from the top, cue, block, cue, block, at the pace of a page
   being typed. Thin, because printed text is detail inside an object. */
function ScriptWritten() {
  return (
    <svg {...SVG} viewBox="0 0 43 48">
      <g className="ink-in" style={at(0)}>
        <ScriptPages />
      </g>
      {SCRIPT_LINES.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength="1"
          className="ink-line ink-thin ink-draw"
          style={at(0.25 + i * 0.12, 0.35)}
        />
      ))}
    </svg>
  );
}

/* 04. The same script, read. The page is already whole when it arrives
   (it was written at 02), and the only things that draw are the reader's
   marks in the margin, one beside each block of dialogue: the mark a reader
   makes against a passage they want to talk about. Edge weight, by hand,
   heavier than the print beside it. Two blocks, two marks, two readers.
   Nothing else changes, because nothing else should. */
function ScriptRead() {
  return (
    <svg {...SVG} viewBox="0 0 43 48">
      <g className="ink-in" style={at(0)}>
        <ScriptPages />
        <g className="ink-line ink-thin">
          {SCRIPT_LINES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <path d="M6.5 14 V 25.5" pathLength="1" className="ink-line ink-edge ink-draw" style={at(0.5, 0.4)} />
      <path d="M6.5 34.5 V 41.5" pathLength="1" className="ink-line ink-edge ink-draw" style={at(0.85, 0.4)} />
    </svg>
  );
}

/* 03. The activity sheet. Landscape, because a worksheet for a four year
   old is. On it: a big shape already coloured in (tone), a second shape
   still empty beside it, and a dotted line underneath that a hand has
   started to trace. The sheet lands, the coloured shape fills, the empty
   shape draws, then the dots land and the hand traces the first stretch.
   The dotted line is an `.ink-in`, not a draw, because the kit's draw
   overrides any dash. */
function ActivitySheet() {
  return (
    <svg {...SVG} viewBox="0 0 62 48">
      <g className="ink-in" style={at(0)}>
        <Sheet x={2} y={4} width={56} height={38} rx={1} />
      </g>
      <circle cx="15.5" cy="19" r="8.5" className="ink-wash--deep ink-in" style={at(0.25)} />
      <circle cx="15.5" cy="19" r="8.5" pathLength="1" className="ink-line ink-draw" style={at(0.25, 0.45)} />
      <rect x="31" y="10.5" width="17" height="17" rx="0.5" pathLength="1" className="ink-line ink-draw" style={at(0.55, 0.45)} />
      <path
        d="M8 35 H52"
        strokeDasharray="1.6 2.6"
        className="ink-line ink-thin ink-in"
        style={at(0.9)}
      />
      <path
        d="M8 35 q5 -2.4 10 0 t9 0"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(1.05, 0.45)}
      />
    </svg>
  );
}

/* 05. The finished episode: picture and sound together. A 16:9 frame with
   the garden's horizon inside it and the ground under the horizon toned,
   so it reads as a picture and not a box with a line in it. The voice take
   is a hand-drawn trace under it at the same width, drawing itself at the
   pace of being played through. Both halves at once because the stage
   checks both. */
function Episode() {
  return (
    <svg {...SVG} viewBox="0 0 62 48">
      <g className="ink-in" style={at(0)}>
        <Sheet x={4} y={2} width={54} height={30} rx={1.5} />
      </g>
      <path
        d="M4 25 C 14 17 22 23 30 20 S 46 11 58 18 V 32 H 4 Z"
        className="ink-wash ink-in"
        style={at(0.2)}
      />
      <path
        d="M4 25 C 14 17 22 23 30 20 S 46 11 58 18"
        pathLength="1"
        className="ink-line ink-thin ink-draw"
        style={at(0.2, 0.5)}
      />
      <path
        d="M4 41 L6 39 8 43 10 36.5 12 41 14 39 16 45 18 36.5 20 41 22 39 24 43 26 37 28 40 30 38 32 44 34 36.5 36 42 38 39 40 45.5 42 38 44 41 46 39 48 43 50 37.5 52 41 54 39.5 56 42 58 40.5"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0.4, 0.9)}
      />
    </svg>
  );
}

/* 06. Held. Kept from the first set. Ground first, then the episode waiting
   on it (the same 16:9 object as 05, small, with its own tone), then the
   post rises, and last the arm comes down from the hinge: the arm's path
   starts at the post so `.ink-draw` swings it out from there. The arm and
   the hinge are the only accent in the set. */
function Held() {
  return (
    <svg {...SVG} viewBox="0 0 64 48">
      <path d="M2 45 H62" className="ink-line ink-heavy ink-in" style={at(0)} />
      <g className="ink-in" style={at(0.2)}>
        <rect x="6" y="34" width="20" height="11" rx="1" className="ink-fill" />
        <rect x="6" y="34" width="20" height="11" rx="1" className="ink-wash" />
        <rect x="6" y="34" width="20" height="11" rx="1" className="ink-line ink-edge" />
      </g>
      <path d="M52 45 V 11" pathLength="1" className="ink-line ink-edge ink-draw" style={at(0.35, 0.5)} />
      <circle cx="52" cy="13" r="3.4" className="ink-accent-fill ink-in" style={at(0.8)} />
      <path d="M54 13 H 9" pathLength="1" className="ink-line ink-edge ink-accent ink-draw" style={at(0.85, 0.55)} />
    </svg>
  );
}

const MARKS: Record<StageNumber, () => ReactElement> = {
  1: FirstPage,
  2: ScriptWritten,
  3: ActivitySheet,
  4: ScriptRead,
  5: Episode,
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
