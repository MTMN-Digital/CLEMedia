import "@/components/draw/draw.css";

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
   ========================================================================== */

export function Correction() {
  const line = (i: number) => 44 + i * 19;

  return (
    <figure className="corr">
      <svg
        className="ink"
        viewBox="0 0 300 220"
        role="img"
        aria-label="A page of writing with one line struck through and still visible, and the correction added underneath it saying what changed."
      >
        <rect x="10" y="12" width="280" height="196" rx="5" className="ink-fill" />
        <rect x="10" y="12" width="280" height="196" rx="5" className="ink-line ink-thin" />

        {/* The piece. Ruled strokes, never set text: a drawing of a
            correction must not be readable as one the company has issued. */}
        <g className="ink-line ink-thin">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              pathLength="1"
              d={`M30 ${line(i)} H ${i === 4 ? 198 : 270}`}
              className="ink-draw"
              style={{ "--d": `${0.1 + i * 0.09}s`, "--dur": "0.45s" } as React.CSSProperties}
            />
          ))}
        </g>

        {/* The line that was wrong. Struck, and still there. */}
        <path
          pathLength="1"
          d={`M30 ${line(2)} H 270`}
          className="ink-line ink-heavy ink-accent ink-draw"
          style={{ "--d": "0.95s", "--dur": "0.5s" } as React.CSSProperties}
        />

        {/* What changed, added underneath, inside the piece. */}
        <g className="ink-in" style={{ "--d": "1.5s" } as React.CSSProperties}>
          <path d="M30 150 H 50" className="ink-line ink-heavy ink-accent" />
          <g className="ink-line ink-thin">
            <path d="M60 150 H 262" />
            <path d="M60 169 H 214" />
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
    </figure>
  );
}
