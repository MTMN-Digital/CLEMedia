import "@/components/draw/draw.css";
import "./routes.css";

/* ============================================================================
   The two routes, drawn.

   WHY. "Pick your route" was a heading, two lines of text and a pair of
   buttons, in a column about 480px wide on a band 1,376px wide: the right
   two thirds of it were empty for the whole section. It is also the one piece
   of structure on this page a reader has to hold in their head, that the
   episode and the questionnaire are the same on both routes and only the
   supporting notes differ, and it was being asserted in a sentence rather
   than shown.

   WHAT IT DRAWS, and every word of it is already on the page: one episode
   goes in, the route splits for the curriculum notes, and both sides arrive
   at the same questionnaire. Nothing is claimed here that the section does
   not say in prose directly above it.

   THE LABELS ARE HTML, not <text>. That is the kit's rule: real fonts, real
   line breaks, selectable, and a screen reader reads them in order. The SVG
   carries the lines only and is aria-hidden.

   ON A PHONE the drawing is not shrunk, it is replaced. Three nodes and two
   curves across 350px is a diagram nobody can read; the same four labels run
   down a rule instead, which is the same information in the shape that fits.
   ========================================================================== */

export function TwoRoutes() {
  return (
    <div className="routes">
      {/* ── The drawing, from `sm` up ─────────────────────────────────── */}
      <div className="routes__art" aria-hidden="true">
        <svg className="ink" viewBox="0 0 520 260" preserveAspectRatio="none" focusable="false">
          {/* In, then the split. `pathLength` is what the draw animates
              against, so every path carries it whatever its real length. */}
          <path
            pathLength="1"
            d="M18 130 H 150"
            className="ink-line ink-draw"
            style={{ "--d": "0.05s", "--dur": "0.5s" } as React.CSSProperties}
          />
          <path
            pathLength="1"
            d="M150 130 C 196 130 196 58 242 58 H 300"
            className="ink-line ink-draw"
            style={{ "--d": "0.4s", "--dur": "0.7s" } as React.CSSProperties}
          />
          <path
            pathLength="1"
            d="M150 130 C 196 130 196 202 242 202 H 300"
            className="ink-line ink-draw"
            style={{ "--d": "0.4s", "--dur": "0.7s" } as React.CSSProperties}
          />
          {/* And back together. */}
          <path
            pathLength="1"
            d="M300 58 H 358 C 404 58 404 130 450 130 H 502"
            className="ink-line ink-draw"
            style={{ "--d": "1.05s", "--dur": "0.7s" } as React.CSSProperties}
          />
          <path
            pathLength="1"
            d="M300 202 H 358 C 404 202 404 130 450 130"
            className="ink-line ink-draw"
            style={{ "--d": "1.05s", "--dur": "0.7s" } as React.CSSProperties}
          />
          {/* The three places something happens. Exact, not hand drawn: the
              displacement filter moves a point by up to 2.6 units, which bites
              a crescent out of a node this size. Same opt-out as StandsAt. */}
          <g className="ink--exact">
            {[
              [150, 130, "0.45s"],
              [300, 58, "1.0s"],
              [300, 202, "1.0s"],
              [450, 130, "1.6s"],
            ].map(([cx, cy, d]) => (
              <g key={`${cx}-${cy}`} className="ink-in" style={{ "--d": d } as React.CSSProperties}>
                <circle cx={cx as number} cy={cy as number} r="6" className="ink-fill" />
                <circle cx={cx as number} cy={cy as number} r="6" className="ink-line ink-thin" />
              </g>
            ))}
            <g className="ink-in" style={{ "--d": "1.75s" } as React.CSSProperties}>
              <circle cx="450" cy="130" r="3.4" className="ink-accent-fill" />
            </g>
          </g>
        </svg>

        <p className="ink-label routes__at routes__at--in">One episode</p>
        <p className="ink-label routes__at routes__at--up">Aistear, Ireland</p>
        <p className="ink-label routes__at routes__at--down">EYFS, England</p>
        <p className="ink-label routes__at routes__at--out">The same questionnaire</p>
      </div>

      {/* ── The phone reading ─────────────────────────────────────────── */}
      <ol className="routes__list">
        <li><span className="ink-label">One episode</span></li>
        <li className="routes__list-branch"><span className="ink-label">Aistear, Ireland</span></li>
        <li className="routes__list-branch"><span className="ink-label">EYFS, England</span></li>
        <li><span className="ink-label">The same questionnaire</span></li>
      </ol>
    </div>
  );
}
