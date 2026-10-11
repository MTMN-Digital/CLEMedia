import { Settle } from "@/components/Settle";
import "@/components/draw/draw.css";
import "./corr.css";

/* ============================================================================
   A correction that stays on the page.

   Of the journal's four standing rules this is the only one that is a SHAPE.
   "If we get something wrong, the correction goes on the piece itself and
   says what changed. Nothing is quietly edited away." Almost every publisher
   on the internet does the opposite: the sentence is swapped and the page
   carries no sign it ever said anything else. Drawing the difference is the
   whole argument, and it needs no new words to do it.

   So: a piece of writing with one line struck through and still legible, and
   the correction written under it with what changed. The struck line is NOT
   removed, which is the point. Nothing here names a real piece or a real
   mistake, because there are none yet: the lines are drawn as ruled strokes,
   not as set text, so the drawing cannot be read as a correction the company
   has actually issued.

   The page writes itself, the strike lands, then the correction is added
   beneath it. In that order, because that is the order it happens in.

   AUTHORED AT HALF SCALE ON PURPOSE. The figure renders at 300px (corr.css),
   so a 150 unit box is 2.0 CSS pixels per unit, which is what the graphite
   in InkDefs needs: the 1.4 unit ruled strokes are 2.8 device pixels and the
   3 unit strike is 6. The first version was 300 units at 300px, 1.0 per
   unit, and on the navy band the cream line work broke into speckle. Stroke
   widths come from the kit in user units and were NOT halved.
   ========================================================================== */

export function Correction() {
  const line = (i: number) => 22 + i * 9.5;

  return (
    <Settle as="figure" className="corr">
      <svg
        className="ink"
        viewBox="0 0 150 110"
        role="img"
        aria-label="A page of writing with one line struck through and still visible, and the correction added underneath it saying what changed."
      >
        <rect x="5" y="6" width="140" height="98" rx="2.5" className="ink-fill" />
        <rect x="5" y="6" width="140" height="98" rx="2.5" className="ink-line ink-thin" />

        {/* The piece. Ruled strokes, never set text: a drawing of a
            correction must not be readable as one the company has issued. */}
        <g className="ink-line ink-thin">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              pathLength="1"
              d={`M15 ${line(i)} H ${i === 4 ? 99 : 135}`}
              className="ink-draw"
              style={{ "--d": `${0.1 + i * 0.09}s`, "--dur": "0.45s" } as React.CSSProperties}
            />
          ))}
        </g>

        {/* The line that was wrong. Struck, and still there. */}
        <path
          pathLength="1"
          d={`M15 ${line(2)} H 135`}
          className="ink-line ink-heavy ink-accent ink-draw"
          style={{ "--d": "0.95s", "--dur": "0.5s" } as React.CSSProperties}
        />

        {/* What changed, added underneath, inside the piece. */}
        <g className="ink-in" style={{ "--d": "1.5s" } as React.CSSProperties}>
          <path d="M15 75 H 25" className="ink-line ink-heavy ink-accent" />
          <g className="ink-line ink-thin">
            <path d="M30 75 H 131" />
            <path d="M30 84.5 H 107" />
          </g>
        </g>
      </svg>

      <figcaption className="corr__cap">
        <p className="ink-label">What a correction looks like here</p>
        <p className="corr__note">
          The line that was wrong stays on the piece, struck through, with what changed written
          under it.
        </p>
      </figcaption>
    </Settle>
  );
}
