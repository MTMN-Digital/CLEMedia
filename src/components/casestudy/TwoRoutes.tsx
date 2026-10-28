import "@/components/draw/draw.css";
import "./routes.css";
import type { RouteId } from "./RoutePicker";

/* ============================================================================
   The two routes, drawn, and operated.

   WHY. It is the one piece of structure on this page a reader has to hold in
   their head, that the episode and the questionnaire are the same on both
   routes and only the supporting notes differ, and a sentence asserts it
   where a drawing shows it. Since 2026-10-28 it is the page's opening object:
   the protocol sheet opens on the study's structure, not on a title block.

   WHAT IT DRAWS, and every word of it is already on the page: one episode
   goes in, the route splits for the curriculum notes, and both sides arrive
   at the same questionnaire. Nothing is claimed here that the page does not
   say in prose below it.

   OPERATED BY THE CHIPS. `route` is the chosen route from the two radios
   under the drawing. The chosen branch's mid node takes the accent fill and
   its two paths the heavier stroke; the other branch thins. Nothing is added
   to the SVG for this (no new path, no text): the drawing already built is
   the one being switched. It stays aria-hidden; the radios and the aria-live
   panel are the accessible state.

   THE LABELS ARE HTML, not <text>. That is the kit's rule: real fonts, real
   line breaks, selectable, and a screen reader reads them in order. The SVG
   carries the lines only and is aria-hidden.

   ON A PHONE the drawing is not shrunk, it is replaced. Three nodes and two
   curves across 350px is a diagram nobody can read; the same four labels run
   down a rule instead, and the chosen branch carries the filled marker.
   ========================================================================== */

export function TwoRoutes({ route }: { route: RouteId }) {
  const up = route === "ireland";
  const on = "routes__path--on";
  const off = "ink-thin routes__path--off";

  return (
    <div className="routes" data-route={route}>
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
            className={`ink-line ink-draw ${up ? on : off}`}
            style={{ "--d": "0.4s", "--dur": "0.7s" } as React.CSSProperties}
          />
          <path
            pathLength="1"
            d="M150 130 C 196 130 196 202 242 202 H 300"
            className={`ink-line ink-draw ${up ? off : on}`}
            style={{ "--d": "0.4s", "--dur": "0.7s" } as React.CSSProperties}
          />
          {/* And back together. */}
          <path
            pathLength="1"
            d="M300 58 H 358 C 404 58 404 130 450 130 H 502"
            className={`ink-line ink-draw ${up ? on : off}`}
            style={{ "--d": "1.05s", "--dur": "0.7s" } as React.CSSProperties}
          />
          <path
            pathLength="1"
            d="M300 202 H 358 C 404 202 404 130 450 130"
            className={`ink-line ink-draw ${up ? off : on}`}
            style={{ "--d": "1.05s", "--dur": "0.7s" } as React.CSSProperties}
          />
          {/* The four places something happens. Exact, not hand drawn: the
              displacement filter moves a point by up to 2.6 units, which bites
              a crescent out of a node this size. The two mid nodes are the
              choice: the chosen one is filled with the accent. */}
          <g className="ink--exact">
            {[
              { cx: 150, cy: 130, d: "0.45s", chosen: false },
              { cx: 300, cy: 58, d: "1.0s", chosen: up },
              { cx: 300, cy: 202, d: "1.0s", chosen: !up },
              { cx: 450, cy: 130, d: "1.6s", chosen: false },
            ].map(({ cx, cy, d, chosen }) => (
              <g key={`${cx}-${cy}`} className="ink-in" style={{ "--d": d } as React.CSSProperties}>
                <circle cx={cx} cy={cy} r="6" className={`routes__node ${chosen ? "ink-accent-fill" : "ink-fill"}`} />
                <circle cx={cx} cy={cy} r="6" className="ink-line ink-thin" />
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
        <li className={`routes__list-branch ${up ? "routes__list-branch--on" : ""}`}>
          <span className="ink-label">Aistear, Ireland</span>
        </li>
        <li className={`routes__list-branch ${up ? "" : "routes__list-branch--on"}`}>
          <span className="ink-label">EYFS, England</span>
        </li>
        <li><span className="ink-label">The same questionnaire</span></li>
      </ol>
    </div>
  );
}
