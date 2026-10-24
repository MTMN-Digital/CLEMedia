import type { CSSProperties } from "react";
import { useRoomEntry, Stage } from "@/components/render";
import { StageMark } from "./StageMark";
import type { Phase } from "./people";

/* ============================================================================
   The review board: the phases of an episode, as slips on a lit bench.

   TWO VERSIONS BEFORE THIS ONE, and both are why this one is shaped the way
   it is.

   Version 1 was a matrix: six stage columns, a row per person, and a small
   square per cell that was filled, outlined or dashed against a legend. The
   client's verdict was that it was "very difficult to understand, not very
   accessible", and it was right. Three states encoded as shapes need a key,
   and the desktop version dropped the digit from the squares, so answering
   "who does the educational review" meant counting columns.

   Version 2 was a numbered vertical list with a marker, a drawn spine and the
   faces. The client's verdict was "a boring vertical list", and it was right
   again. Clear was the floor, not the goal. Worse, /ethical-ai already owns a
   vertical chain of the same sequence with a return path drawn through it,
   so the team page was running a weaker second copy of a drawing that exists.

   SO THIS IS A THIRD THING, not a correction of either. Each phase is a slip
   off the production: the number printed large the way a filed document
   carries one, what the phase is, who does it, and one sentence of what
   happens. The slips stand on the studio bench under the same lamp as every
   other object on this site, which is what the client asked for by name:
   coded renders, no image generation, in the mtmn.ie manner.

   FIVE SLIPS, NOT SIX, FROM 2026-10-24. The six-stage sign-off sequence this
   board was built for was withdrawn by the client's review document, which
   describes repeated whole-group reviews rather than one gate per person. See
   the note at the top of people.ts. Three things went with it: the "Signed
   off by" line, because nothing is signed off until the last phase; the
   portraits on each slip, because the same five faces on four of five slips
   is the "third copy of the company's faces" problem this site has already
   solved once; and the red band saying a release can be held, which the
   document asks for by name.

   WHAT REPLACED THE FACES is the `rounds` line, on the two phases the
   document says repeat. That is the genuinely unusual thing about this
   process and it had no way of being said on the old board at all.

   NOTHING IS ENCODED. No key, no legend, no state carried by a border.

   THE ORDER IS THE READING ORDER. Three across and two down on a desktop, two
   across on a tablet, one column on a phone. The numerals are set large
   enough to be the first thing read in each slip, so the sequence survives
   every one of those reflows without a connecting line having to redraw
   itself. A line was tried and is what made version 2 a timeline template.
   ========================================================================== */

/* How each slip stands. Hand-placed, so no two match: the lean, the small
   turn toward the centre of the bench, a fraction of roll, and a depth that
   alternates so neighbours sit at different distances from the wall. */
const POSE = [
  { tilt: 6.2, turn: -2.2, roll: -0.3, depth: 0.56 },
  { tilt: 4.8, turn: -0.6, roll: 0.25, depth: 0.42 },
  { tilt: 7.0, turn: 1.9, roll: -0.18, depth: 0.6 },
  { tilt: 5.4, turn: -1.6, roll: 0.35, depth: 0.46 },
  { tilt: 6.6, turn: 0.5, roll: -0.28, depth: 0.58 },
  { tilt: 5.1, turn: 2.2, roll: 0.2, depth: 0.44 },
];

/* The lamp sits up and left of the bench, and each slip's light azimuth is
   the angle from the lamp to that slip, so the shadows fan away from one
   point instead of running parallel. Columns rather than items: on a
   two-row bench the slip below another one is lit from the same side as it,
   because the lamp is above them both. */
const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / columns;
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

export function StageSequence({ phases }: { phases: Phase[] }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div
      ref={ref}
      className={`rk-studio rk-board ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />

      <div className="rk-head" aria-hidden="true">
        <span>Review board</span>
        <span className="rk-head-rule" />
        <span className="rk-head-meta">Every episode, every draft</span>
      </div>

      <ol className="rk-bench">
        {phases.map((s, i) => {
          const pose = POSE[i % POSE.length];
          /* Three across above 58rem, two across above 32rem, one below. The
             azimuth is picked for the widest of those, which is where the
             bench is long enough for the fan to be visible at all. */
          const column = i % 3;
          return (
            <li key={s.n} className="rk-item" style={{ "--i": i } as CSSProperties}>
              <div className="rk-plate">
                <Stage
                  seated
                  light={azimuthFor(column, 3)}
                  tilt={pose.tilt}
                  turn={pose.turn}
                  roll={pose.roll}
                  depth={pose.depth}
                  radius="var(--radius-md)"
                >
                  <article className="rk-slip">
                    {/* The number is read out, not hidden. It is the order of
                        the five phases, and a reader who cannot see the
                        board's layout needs it more than one who can. */}
                    <p className="rk-slip__no tnum">
                      <span className="sr-only">Phase </span>{s.n}
                    </p>
                    <h3 className="rk-slip__title">{s.phase}</h3>

                    {/* What happens in this phase, drawn. Marks that differ in
                        kind rather than icons in matched boxes; see
                        components/team/StageMark.tsx. Decorative: the slip
                        already carries the number, the phase, who does it and
                        the sentence as real text. */}
                    <div className="rk-slip__mark">
                      <StageMark n={s.n} />
                    </div>

                    <p className="rk-slip__who">
                      <span className="rk-slip__name">{s.who}</span>
                    </p>

                    <p className="rk-slip__check">{s.what}</p>

                    {s.rounds && <p className="rk-slip__rounds">{s.rounds}</p>}
                  </article>
                </Stage>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
