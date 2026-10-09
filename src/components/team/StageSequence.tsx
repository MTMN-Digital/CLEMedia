import type { CSSProperties } from "react";
import { Figure } from "@/components/Figure";
import { Stage, useRoomEntry } from "@/components/render";
import { StageMark } from "./StageMark";
import type { Stage as ReviewStage } from "./people";

/* ============================================================================
   The review board: six sign-off slips, standing on a lit bench.

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
   vertical chain of the same six stages with a return path drawn through it,
   so the team page was running a weaker second copy of a drawing that exists.

   SO THIS IS A THIRD THING, not a correction of either. A review stage ends
   in somebody putting their name to it, so each stage is the slip they sign:
   the number printed large the way a filed document carries one, the stage,
   the people answerable, what they check, and on the one stage the company's
   account says can stop a release, a red band saying so. The slips stand on
   the studio bench under the same lamp as every other object on this site,
   which is what the client asked for by name: coded renders, no image
   generation, in the mtmn.ie manner.

   NOTHING IS ENCODED. No key, no legend, no state carried by a border. The
   two stages the company gives to the team as a whole say "the team" in
   words, exactly as its own account does, and carry no faces, because drawing
   five portraits there would assert who did the check.

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

export function StageSequence({ stages }: { stages: ReviewStage[] }) {
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
        <span className="rk-head-meta">Every episode, every stage</span>
      </div>

      <ol className="rk-bench">
        {stages.map((s, i) => {
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
                        the six stages, and a reader who cannot see the
                        board's layout needs it more than one who can. */}
                    <p className="rk-slip__no tnum">
                      <span className="sr-only">Stage </span>{s.n}
                    </p>
                    <h3 className="rk-slip__title">{s.stage}</h3>

                    {/* What happens at this stage, drawn. Six marks that
                        differ in kind rather than six icons in matched boxes;
                        see components/team/StageMark.tsx. Decorative: the
                        slip already carries the number, the stage, the people
                        and the check as real text. */}
                    <div className="rk-slip__mark">
                      <StageMark n={s.n} />
                    </div>

                    {s.faces.length > 0 && (
                      <ul className="rk-slip__faces">
                        {s.faces.map((f) => (
                          <li key={f}>
                            <Figure
                              asset={f}
                              rounded="rounded-[6px]"
                              className="aspect-square"
                              sizes="48px"
                            />
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="rk-slip__who">
                      {/* Said, not encoded. The matrix drew this distinction
                          as a different border on a square. */}
                      <span className="rk-slip__sign">Signed off by</span>
                      <span className="rk-slip__name">{s.who}</span>
                    </p>

                    <p className="rk-slip__check">{s.checks}</p>

                    {s.hold && (
                      <p className="rk-slip__hold">A release can be held here</p>
                    )}
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
