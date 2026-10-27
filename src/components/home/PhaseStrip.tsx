import { Settle } from "@/components/Settle";
import { DrawnBox, Perf } from "@/components/draw/kit";
import { PHASES } from "@/components/team/people";
import "./strip.css";

/* ============================================================================
   The five phases, on a strip of film drawn by hand.

   WHAT THIS REPLACES, 2026-10-27. Five slips standing on a lit brown bench,
   each printing a four word label while the client's own sentence about that
   phase sat unused in people.ts. Three things were wrong with it and the
   client named all three: the section opened with a heading, a lead and a
   closing note before the reader learned anything; the cards carried our
   summary instead of the company's words; and five cream rounded rectangles
   on a brown shelf is a grid rather than a set piece.

   SO: the heading stays outside and above, the lead is deleted because it was
   a summary of the five sentences now printed in the frames, and the object
   is a filmstrip. The company makes film and nothing in this site's furniture
   said so anywhere.

   NOTHING IN IT IS SOLID. A filled black strip was tried first and it was the
   heaviest object on the page. The stock is two rows of drawn perforations,
   each frame is a drawn rectangle, and the page's own paper runs straight
   through, which is the whole difference.

   NO BOX ROUND THE WHOLE STRIP. Drawn, it put two vertical strokes through
   the perforation rows and read as a mistake: real stock has no ends, it runs
   off both edges. The two rows of holes ARE the edges.

   THE LOOPS ARE THE POINT. Phases 02 and 05 repeat, which is the genuinely
   unusual thing about how this company works and the one fact the old board
   could only state in words. The mark is drawn where it happens.
   ========================================================================== */

function Loop() {
  return (
    <svg className="ink ink--fine strip__loop" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M28 17a11 11 0 1 1-4.8-9.1" fill="none" />
      <path className="ink-line ink-draw ink-accent" pathLength="1" d="M24.2 2.4l-1.4 5.8 5.7 1" fill="none" />
    </svg>
  );
}

export function PhaseStrip() {
  return (
    <Settle className="strip">
      <Perf />
      <ol className="strip__frames">
        {PHASES.map((s, i) => (
          <li key={s.n} className="strip__frame">
            <DrawnBox v={i + 1} />
            <div className="strip__in">
              <p className="strip__no tnum" aria-hidden="true">{s.n}</p>
              <h3 className="strip__title">
                <span className="sr-only">Phase {s.n}. </span>
                {s.phase}
              </h3>
              <p className="strip__what">{s.what}</p>
              {s.rounds && (
                <p className="strip__rounds">
                  <Loop />
                  {s.rounds}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <Perf />
    </Settle>
  );
}
