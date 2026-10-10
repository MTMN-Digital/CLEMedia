import type { CSSProperties, ReactElement } from "react";
import "@/components/draw/draw.css";
import "./stagemark.css";

/* ============================================================================
   Six marks, one per review stage. SECOND SET, drawn 2026-10-10.

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

   THE SIX NOW. Each is the thing the stage physically handles.
   01  One blank page with the first hand-written marks on it. Nothing else
       exists yet; the page is mostly empty and the two strokes are
       handwriting at full weight, not printed lines.
   02  The script: a stack of pages, the front one in screenplay layout
       (a short centred character cue, then an indented block of dialogue,
       twice). It arrives line by line, because here it is being written.
   03  The activity sheet that follows the episode, landscape, with a row of
       big shapes to work on and a dotted line to trace beneath them. This
       is the object Paula reviews against early years practice.
   04  THE SAME SCRIPT AS 02, on purpose: Lydia and Kirstie read the script
       Alan wrote. It is already whole when it arrives, and what draws is a
       reader's mark in the margin beside each block. Written at 02, read
       at 04, one artefact.
   05  The finished episode: a 16:9 frame with a picture in it and the voice
       take as a hand-drawn trace beneath, the same width, because the stage
       checks voices AND visuals. The first set showed only the waveform.
   06  The barrier down, kept from the first set because it was the one that
       worked. The episode waits on the ground under the arm, drawn at the
       same 16:9 proportion as the frame in 05 so it is recognisably the
       same object; the arm and its hinge are the one red in the set.

   THE ACCENT IS SPENT ON 06 AND NOWHERE ELSE. Five marks are ink only. 06
   being the single coloured mark is load-bearing: it is the only stage that
   can stop a release.

   SIZED BY HEIGHT. Every viewBox is 48 tall and the widths run from 38 to
   64, so a page is narrow and a sheet or a barrier is wide. The CSS sizes by
   height and lets the width fall out, which is most of what stops six marks
   in a grid lining up as tiles. Designed to read at 40px (the /ethical-ai
   gates) and 56px (the /team slips); checked at both.

   DECORATIVE, deliberately. Both hosts already carry the number, the stage,
   the person and the sentence as text, so every svg is aria-hidden and
   carries no label of its own.

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

/* One page, the size every page in the set shares. The script (02, 04) and
   the first page (01) are the same sheet so the family reads across the
   board: one page, then a stack of them, then the stack again. */
const PAGE = { x: 3, y: 4, width: 32, height: 43, rx: 1 } as const;

/* 01. Nothing exists yet. One page, blank, and the first two strokes of
   handwriting at the top: the first runs most of the width, the second
   stops short because the hand is still going. Full-weight strokes, because
   this is a hand writing on a page, not a page that has been typed. The
   rest of the page stays empty, which is the whole statement. */
function FirstPage() {
  return (
    <svg {...SVG} viewBox="0 0 38 48">
      <g className="ink-in" style={at(0)}>
        <rect {...PAGE} className="ink-fill" />
        <rect {...PAGE} className="ink-line" />
      </g>
      <path
        d="M9 11.5 q2 -2.2 4 0 t4 0 t4 0 t4 0 t3 0"
        pathLength="1"
        className="ink-line ink-draw"
        style={at(0.3, 0.5)}
      />
      <path
        d="M9 18.5 q2 -2.2 4 0 t4 0 t3 0"
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
  "M15 11 H23",
  "M10 16 H30",
  "M10 21 H28",
  "M15 28 H23",
  "M10 33 H30",
  "M10 38 H27",
  "M10 43 H20",
] as const;

/* The stack: a second page offset behind the front one. The front page's
   fill hides most of it, so only a top edge and a right edge show, which is
   what a stack of pages looks like from above. */
function ScriptPages() {
  return (
    <>
      <rect x="7" y="1" width="32" height="43" rx="1" className="ink-line ink-thin" />
      <rect {...PAGE} className="ink-fill" />
      <rect {...PAGE} className="ink-line" />
    </>
  );
}

/* 02. The script being written. The stack lands, then the lines arrive one
   after another from the top, cue, block, cue, block, at the pace of a page
   being typed. Thin, because printed text is detail inside an object. */
function ScriptWritten() {
  return (
    <svg {...SVG} viewBox="0 0 42 48">
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
   makes against a passage they want to talk about. Two blocks, two marks,
   two readers. Nothing else changes, because nothing else should. */
function ScriptRead() {
  return (
    <svg {...SVG} viewBox="0 0 42 48">
      <g className="ink-in" style={at(0)}>
        <ScriptPages />
        <g className="ink-line ink-thin">
          {SCRIPT_LINES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <path d="M6.5 14 V 22" pathLength="1" className="ink-line ink-draw" style={at(0.5, 0.4)} />
      <path d="M6.5 31 V 39" pathLength="1" className="ink-line ink-draw" style={at(0.85, 0.4)} />
    </svg>
  );
}

/* 03. The activity sheet. Landscape, because a worksheet for a four year
   old is, with a row of three big shapes to work on and a dotted line to
   trace beneath. The shapes draw themselves one at a time, left to right,
   and the trace line lands last. The dotted line is an `.ink-in`, not a
   draw, because the kit's draw overrides any dash. */
function ActivitySheet() {
  return (
    <svg {...SVG} viewBox="0 0 58 48">
      <g className="ink-in" style={at(0)}>
        <rect x="2" y="6" width="54" height="37" rx="1" className="ink-fill" />
        <rect x="2" y="6" width="54" height="37" rx="1" className="ink-line" />
      </g>
      <circle cx="13" cy="19.5" r="6" pathLength="1" className="ink-line ink-draw" style={at(0.25, 0.45)} />
      <rect x="23" y="13.5" width="12" height="12" pathLength="1" className="ink-line ink-draw" style={at(0.5, 0.45)} />
      <path d="M39 25.5 L45 13.5 L51 25.5 Z" pathLength="1" className="ink-line ink-draw" style={at(0.75, 0.45)} />
      <path
        d="M8 35.5 H50"
        strokeDasharray="2 2.6"
        className="ink-line ink-thin ink-in"
        style={at(1.05)}
      />
    </svg>
  );
}

/* 05. The finished episode: picture and sound together. A 16:9 frame with
   the garden's horizon inside it, and the voice take as a hand-drawn trace
   under it at the same width, drawing itself at the pace of being played
   through. Both halves at once because the stage checks both. */
function Episode() {
  return (
    <svg {...SVG} viewBox="0 0 62 48">
      <g className="ink-in" style={at(0)}>
        <rect x="4" y="3" width="54" height="30" rx="1.5" className="ink-fill" />
        <rect x="4" y="3" width="54" height="30" rx="1.5" className="ink-line" />
      </g>
      <path
        d="M4 26 C 14 18 22 24 30 21 S 46 12 58 19"
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
   on it (the same 16:9 object as 05, small), then the post rises, and last
   the arm comes down from the hinge: the arm's path starts at the post so
   `.ink-draw` swings it out from there. The arm and the hinge are the only
   accent in the set. */
function Held() {
  return (
    <svg {...SVG} viewBox="0 0 64 48">
      <path d="M2 45 H62" className="ink-line ink-heavy ink-in" style={at(0)} />
      <g className="ink-in" style={at(0.2)}>
        <rect x="6" y="35" width="18" height="10" rx="1" className="ink-fill" />
        <rect x="6" y="35" width="18" height="10" rx="1" className="ink-line" />
      </g>
      <path d="M52 45 V 12" pathLength="1" className="ink-line ink-draw" style={at(0.35, 0.5)} />
      <circle cx="52" cy="14" r="3" className="ink-accent-fill ink-in" style={at(0.8)} />
      <path d="M54 14 H 10" pathLength="1" className="ink-line ink-heavy ink-accent ink-draw" style={at(0.85, 0.55)} />
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
