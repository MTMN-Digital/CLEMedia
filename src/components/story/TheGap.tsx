import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "@/components/draw/draw.css";
import "./gap.css";

/* ============================================================================
   The search that kept finding less.

   The paragraph beside this says, in the founder's own words: "So I went
   looking, and there was less of it than I expected. Plenty of shows were
   gentle. Plenty were educational. Very few were both, and fewer still would
   tell you anything about who had made them or who had checked them before
   they reached a child."

   WHAT IT DRAWS. Three looks at the same field, each one tighter than the
   last. The first frame is everything he went through. He looks again and
   draws a smaller window inside it, and what lies outside that window is
   hatched through: set aside. He looks a third time and the window is smaller
   again, and more of the field is struck. What is left at the end is one small
   clear patch of paper with a single red mark in it: the few that were gentle,
   educational, and would say who had made them. Almost the whole sheet is
   crossed out. That is "less of it than I expected" in one look.

   WHY NOT THE VENN. The first version was two overlapping circles, Gentle and
   Educational, with a filled lens and a dot in it, and a three line key
   underneath. The client's verdict was that it did not carry the meaning of
   the sentence, and the client was right, for three reasons.
   1. A Venn is the most generic diagram there is. It has no hand, so it says
      nothing about who is looking or how it felt to look.
   2. It needed a key. Three labels under the picture restating the sentence
      is the picture admitting it cannot be read on its own.
   3. It drew the wrong shape. The sentence is not about two sets meeting. It
      is a search that narrows: plenty, then very few, then fewer still. Each
      clause eliminates. A Venn is static and symmetrical; the sentence moves,
      and it moves in one direction, toward less. Nested windows, each drawn
      after the last with the rest of the sheet struck out, are that motion.

   NO NUMBER IS GIVEN AND NONE IS IMPLIED. The frames are not scaled to
   anything. There is no axis, no count, no bar, and no proportion claimed:
   "plenty", "very few" and "fewer still" are relative words, and each window
   is simply smaller than the one before it. The hatch is a crossing-out, the
   mark every reader knows from a hand striking a line through a list; it is
   not a density of anything.

   NO LABELS. The sentence is the label, and it is right beside the drawing.
   The svg carries the description for a screen reader.

   HOW IT ARRIVES. The field draws, then the second window, then the hatch
   lands outside it; then the third window, then its hatch; then the mark.
   Once, on entry, and it stops. The kit's classes run from mount, and this
   sits a long way below the fold on /story, so it is held until it is seen:
   the same arm-then-release pattern as Settle, so no JS, no
   IntersectionObserver and reduced motion all get the finished drawing.
   ========================================================================== */

/* Three looks. Each window sits inside the last and drifts toward the same
   corner, the way a crop sequence does, rather than shrinking concentrically
   into a target. Numbers are viewBox units; the viewBox is the real width the
   margin column gives it, so stroke-width 2 is 2px on screen. */
const FIELD = { x: 1, y: 1, w: 238, h: 190 };
const SECOND = { x: 34, y: 20, w: 172, h: 130 };
const THIRD = { x: 110, y: 42, w: 58, h: 46 };
const MARK = { cx: THIRD.x + THIRD.w / 2, cy: THIRD.y + THIRD.h / 2, r: 5 };

type Box = { x: number; y: number; w: number; h: number };
const box = (b: Box) => `M${b.x} ${b.y} H${b.x + b.w} V${b.y + b.h} H${b.x} Z`;
/* Everything in `outer` that is not in `inner`, as one even-odd shape. */
const band = (outer: Box, inner: Box) => `${box(outer)} ${box(inner)}`;

const d = (delay: string, dur?: string) =>
  ({ "--d": delay, ...(dur ? { "--dur": dur } : {}) }) as React.CSSProperties;

export function TheGap() {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const hatch = `gap-hatch-${useId().replace(/:/g, "")}`;

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
      { rootMargin: "0px 0px -6% 0px", threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <figure
      ref={ref}
      className={`gap ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""}`}
    >
      <svg
        className="ink gap__ink"
        viewBox="0 0 240 192"
        role="img"
        aria-label="One field looked through three times. Each look draws a smaller window inside the last and strikes out everything around it, until almost the whole sheet is crossed through and one small clear window remains, holding a single mark: the few shows that were gentle, educational, and said who had made them."
      >
        <defs>
          {/* The crossing-out. A hand's diagonal strike, repeated. */}
          <pattern
            id={hatch}
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <path d="M0 0 V9" className="ink-line ink-thin" />
          </pattern>
        </defs>

        {/* The first look: everything he went through. */}
        <path
          d={box(FIELD)}
          pathLength="1"
          className="ink-line ink-draw"
          style={d("0.1s", "0.9s")}
        />

        {/* The second look. The window draws, then what is outside it is
            struck through. */}
        <path
          d={box(SECOND)}
          pathLength="1"
          className="ink-line ink-draw"
          style={d("0.75s", "0.8s")}
        />
        <path
          d={band(FIELD, SECOND)}
          fill={`url(#${hatch})`}
          fillRule="evenodd"
          className="ink-in"
          style={d("1.3s")}
        />

        {/* The third look, tighter again. */}
        <path
          d={box(THIRD)}
          pathLength="1"
          className="ink-line ink-draw"
          style={d("1.85s", "0.6s")}
        />
        <path
          d={band(SECOND, THIRD)}
          fill={`url(#${hatch})`}
          fillRule="evenodd"
          className="ink-in"
          style={d("2.25s")}
        />

        {/* What was left at the end of the search. The one accent. */}
        <g className="ink-in" style={d("2.75s")}>
          <circle cx={MARK.cx} cy={MARK.cy} r={MARK.r} className="ink-accent-fill" />
        </g>
      </svg>
    </figure>
  );
}
