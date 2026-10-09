import "@/components/draw/draw.css";

/* ============================================================================
   The gap he went looking for.

   The paragraph beside this says, in the founder's own words: "Plenty of
   shows were gentle. Plenty were educational. Very few were both, and fewer
   still would tell you anything about who had made them or who had checked
   them before they reached a child."

   That is two overlapping sets and a small intersection, which is a shape
   before it is a sentence. So it is drawn: gentle on one side, educational on
   the other, and the overlap small, because small is the claim. The third
   condition, knowing who made it, sits as a mark INSIDE the overlap rather
   than as a third circle: a third ring would say it is a comparable
   category, and the point of the sentence is that it narrows what is already
   narrow.

   No number is given and none is implied. The circles are not scaled to
   anything, there is no axis and no count, because nobody supplied one and a
   diagram that invents a proportion is the worst kind of invented claim: it
   looks measured.

   The two sets draw themselves, then the overlap fills, then the mark lands.
   ========================================================================== */

export function TheGap() {
  return (
    <figure className="gap">
      <svg
        className="ink"
        viewBox="0 0 420 240"
        role="img"
        aria-label="Two overlapping sets, gentle and educational, with a small overlap and a mark inside it for the few that also say who made them."
      >
        {/* The overlap, filled first so both outlines sit on top of it. */}
        <path
          d="M210 44 A 96 96 0 0 1 210 196 A 96 96 0 0 1 210 44 Z"
          className="ink-fill ink-in"
          style={{ "--d": "1.05s" } as React.CSSProperties}
        />

        <circle
          cx="162" cy="120" r="96" pathLength="1"
          className="ink-line ink-draw"
          style={{ "--d": "0.1s", "--dur": "1.1s" } as React.CSSProperties}
        />
        <circle
          cx="258" cy="120" r="96" pathLength="1"
          className="ink-line ink-draw"
          style={{ "--d": "0.45s", "--dur": "1.1s" } as React.CSSProperties}
        />

        {/* Inside the overlap: the ones that also tell you who made them and
            who checked them. A mark, not a third set. */}
        <g className="ink-in" style={{ "--d": "1.5s" } as React.CSSProperties}>
          <circle cx="210" cy="120" r="12" className="ink-accent-fill" />
        </g>
      </svg>

      <figcaption className="gap__keys">
        <span className="ink-label gap__key">Gentle</span>
        <span className="ink-label gap__key">Educational</span>
        <span className="ink-label gap__key gap__key--mark">And says who made it</span>
      </figcaption>
    </figure>
  );
}
