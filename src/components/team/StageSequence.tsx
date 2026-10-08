import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import type { Stage } from "./people";

/* ============================================================================
   The six stages, read in order, with the people who stand at each.

   WHAT THIS REPLACED, and why. The page carried a matrix: six stage columns,
   a row per person, and a small square in each cell that was filled, outlined
   or dashed. It was a real table with real headers, so it was correct, and it
   was still the hardest thing on the site to read. Three states encoded as
   shapes need a legend; a legend means the reader holds a key in their head
   while they scan; and the desktop version dropped the digit from the squares,
   so answering "who does the educational review" meant counting columns. The
   heading above it promises "who stands at each", and the matrix made you
   reconstruct that rather than telling you.

   The data always supported this. Each stage already names its people, says
   what is checked there, and carries their portraits: the comment in
   `people.ts` says it was moved so the page "can show the same information two
   ways". It only ever showed one of them.

   SO THE SHAPE IS THE ARGUMENT NOW. Six stages in order down the page, each
   one naming who stands there and what they check. Nothing is encoded. There
   is no key. The two stages the company gives to the team as a whole say so in
   words instead of carrying a different border, and the one stage that can
   hold a release is marked as such, because that is the single most important
   fact on the page and the matrix buried it in a footnote.

   THE LINE IS THE SEQUENCE. A rule runs down the markers and draws itself as
   the reader travels, which is the one thing a review sequence should do and a
   grid of boxes cannot: it says these happen in an order, and nothing reaches
   the end without passing all of them. It is a scaleY transform on a single
   element under `prefers-reduced-motion`-aware CSS, so it costs one composited
   property and collapses to a drawn line for anyone who asked for stillness.
   ========================================================================== */

export function StageSequence({ stages }: { stages: Stage[] }) {
  return (
    <ol className="rk-seq">
      {stages.map((s) => (
        <Settle as="li" key={s.n} className="rk-seq__step">
          {/* The spine. One per step so the draw is paced by the step's own
              arrival rather than by the length of the whole list. */}
          <span className="rk-seq__spine" aria-hidden="true" />

          <span className="rk-seq__marker" aria-hidden="true">
            <span className="tnum">{s.n}</span>
          </span>

          <div className="rk-seq__body">
            <h3 className="rk-seq__title">{s.stage}</h3>

            <p className="rk-seq__who">
              {/* Said, not encoded. The matrix drew this distinction as a
                  different border on a square. */}
              <span className="rk-seq__wholabel">Who stands here</span>
              <span className="rk-seq__whoname">{s.who}</span>
            </p>

            {s.faces.length > 0 && (
              <ul className="rk-seq__faces">
                {s.faces.map((f) => (
                  <li key={f}>
                    <Figure
                      asset={f}
                      rounded="rounded-[var(--radius-sm)]"
                      className="aspect-square"
                      sizes="56px"
                    />
                  </li>
                ))}
              </ul>
            )}

            <p className="rk-seq__checks">{s.checks}</p>

            {s.hold && (
              <p className="rk-seq__hold">
                A release can be held here.
              </p>
            )}
          </div>
        </Settle>
      ))}
    </ol>
  );
}
