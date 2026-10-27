import { useId } from "react";
import "./draw.css";
import "./mark.css";

/* ============================================================================
   Two devices this site did not have, both lifted in KIND from mtmn.ie and
   rebuilt in this site's hand rather than its skin.

   WHY THESE TWO. mtmn.ie carries a giant italic watermark word behind every
   hero at 4.5% alpha, and an underline that draws itself under the one
   emphasised phrase in the headline. Neither is decoration: the watermark
   gives a flat band depth without a second colour, and the underline is the
   page telling you which words to take away. This site had neither. It had
   one global paper grain and nothing else behind the type, and it had no way
   at all to emphasise a phrase: every heading was one undifferentiated run of
   Calistoga.

   WHAT CHANGED IN THE TRANSLATION. mtmn.ie is gold on warm black and may use
   a gradient; this site is ink on paper and the brief rules gradients out
   with one bounded exception. So the watermark is a DRAWN object rather than
   a set word, and the underline is a drawn stroke rather than a gradient bar.

   THE REVEAL IS A CLIP, NOT A DASH. `.ink-draw` animates a dash array in user
   units, which stops matching `pathLength` the moment the stroke leaves that
   coordinate system; a stretched path drawing itself comes out in pieces, and
   an underline has to stretch because it is as long as the phrase it is
   under. Animating `clip-path` instead reveals the stroke left to right at
   any width, which is also closer to what a pen actually does.
   ========================================================================== */

/* Four strokes, so a page with two marks on it does not repeat one. The
   viewBox is deliberately long and flat: stretched to a short phrase the
   wobble compresses, which is what a drawn line does. */
const UNDERS = [
  "M3 7 C70 3.4, 150 8.2, 220 5 C290 2.2, 360 7.4, 437 4.6",
  "M3 5.4 C64 8, 146 3.6, 214 6.6 C286 9.2, 364 4.2, 437 6.4",
  "M3 6.6 C78 4, 152 9, 226 5.6 C296 2.6, 368 8, 437 5.2",
  "M3 4.8 C72 7.6, 148 4, 218 7.2 C292 10, 366 5, 437 7",
];

/**
 * One phrase, underlined by hand. The stroke draws itself once on entry and
 * is simply there under `prefers-reduced-motion`.
 */
export function Underline({
  children,
  v = 0,
  accent = false,
}: {
  v?: number;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="mk">
      <span className="mk__word">{children}</span>
      <svg
        className={`ink mk__rule ${accent ? "mk__rule--accent" : ""}`}
        viewBox="0 0 440 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="ink-line"
          vectorEffect="non-scaling-stroke"
          d={UNDERS[v % UNDERS.length]}
          fill="none"
        />
      </svg>
    </span>
  );
}

/* The watermark shapes. Each is ONE continuous contour, because a watermark
   at 5% ink has to read as a silhouette at a glance and a drawing made of
   separate marks reads as dirt. */
const MARKS: Record<string, { d: string; box: string }> = {
  /* The sun the show's own episodes end on, drawn as rays round a centre. */
  sun: {
    box: "0 0 200 200",
    d: "M100 48a52 52 0 1 0 .1 0M100 4v26M100 170v26M4 100h26M170 100h26M32 32l18 18M150 150l18 18M168 32l-18 18M50 150l-18 18",
  },
  /* A leaf, for the garden the series is set in. */
  leaf: {
    box: "0 0 200 200",
    d: "M28 172C28 92 92 28 172 28c0 80-64 144-144 144ZM28 172C64 136 104 104 160 84",
  },
  /* A pug's head in one line: the show's lead, used the way the brief says a
     character may be used on this site, as a watermark and never as the
     subject. */
  pug: {
    box: "0 0 200 200",
    d: "M62 56c-14-16-30-20-34-6-4 13 4 30 14 40M138 56c14-16 30-20 34-6 4 13-4 30-14 40M100 36c-34 0-58 26-58 62 0 40 26 66 58 66s58-26 58-66c0-36-24-62-58-62ZM78 92c0 6 4 10 9 10s9-4 9-10M104 92c0 6 4 10 9 10s9-4 9-10M88 124c4 6 20 6 24 0",
  },
};

/**
 * A drawn object at watermark strength behind a band. It bleeds off whichever
 * edge the caller puts it on; nothing is ever centred and complete, because a
 * complete shape at 5% reads as a mistake rather than as depth.
 */
export function Watermark({
  shape = "sun",
  at = "right",
  className = "",
}: {
  shape?: keyof typeof MARKS;
  at?: "left" | "right";
  className?: string;
}) {
  const m = MARKS[shape];
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      className={`ink mk-wm mk-wm--${at} ${className}`}
      viewBox={m.box}
      aria-hidden="true"
      focusable="false"
      role="presentation"
      id={`wm-${uid}`}
    >
      <path className="mk-wm__line" d={m.d} fill="none" />
    </svg>
  );
}
