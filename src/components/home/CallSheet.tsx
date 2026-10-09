import type { CSSProperties } from "react";
import { Stage, useRoomEntry } from "@/components/render";
import { Settle } from "@/components/Settle";
import { Kicker, Lead, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { STAGES } from "@/components/team/people";

/* ============================================================================
   The call sheet: the sign-off sequence, standing on the bench.

   WHAT THIS REPLACES, AND WHY. This block was a six-row list of the same six
   faces /team shows twice and /contact shows once, each with a role and a line
   of biography. It was the third copy of the company's faces on the site and
   it read as a staff directory, which is not what the home page is arguing.

   The home page's claim is narrower: an episode passes through six stages in
   a fixed order, a named person answers for each of the first four, and a
   release can be held at the last. So the block now shows exactly that and
   nothing else. Six slips on the review board's shelf, each carrying its
   number, its stage and who signs it off, in words. No portraits and no
   biographies: those are /team's job, and the link under the board goes there.

   It is the review board's reading of the render kit (StageSequence.tsx), cut
   down. /team's slips also carry the faces and what each stage checks; these
   carry the sequence only, so a reader going Home to Team gets the argument
   first and the people second rather than the same board twice.

   The stages, the names and the stage that can hold a release are read from
   src/components/team/people.ts, the company's own account, so this board and
   /team's can never disagree.
   ========================================================================== */

/* How each slip stands. Hand-placed so no two neighbours match: lean, a small
   turn toward the middle of the shelf, a fraction of roll, and a depth that
   alternates so neighbours sit at different distances from the wall. */
const POSE = [
  { tilt: 5.6, turn: -1.8, roll: 0.22, depth: 0.5 },
  { tilt: 7.1, turn: 0.4, roll: -0.3, depth: 0.6 },
  { tilt: 4.9, turn: 2.1, roll: 0.15, depth: 0.44 },
  { tilt: 6.8, turn: -2.3, roll: -0.2, depth: 0.58 },
  { tilt: 5.2, turn: -0.3, roll: 0.34, depth: 0.46 },
  { tilt: 6.3, turn: 1.6, roll: -0.26, depth: 0.55 },
];

/* One lamp, up and left of the shelf. Each slip is lit from the angle to it,
   picked by COLUMN, so the slip under another one is lit from the same side
   because the lamp is above them both. Same geometry as the review board on
   /team (lamp 0.6 of a bench to the left, 2.2 above), written out for the
   three columns because three numbers are shorter than the function. */
const LIGHT_BY_COLUMN = [-33, -25, -19];

export function CallSheet({ headingId }: { headingId: string }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div>
      {/* The heading and the claim as a spread on the paper, so the board
          below arrives as a scene rather than as a box with a title in it. */}
      <Settle className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-end lg:gap-16 xl:gap-24">
        <div>
          <Kicker>How the work gets made</Kicker>
          <h2 id={headingId} className="t-h2 mt-4 max-w-[14ch]">
            A named person at every stage
          </h2>
        </div>
        <Lead className="max-w-[46ch] lg:pb-1">
          This is the sequence an episode goes through before it reaches a child, and who is
          answerable at each point. Any one of these stages can hold a release back.
        </Lead>
      </Settle>

      <div
        ref={ref}
        className={`rk-studio rk-board mt-10 lg:mt-14 ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
      >
        <span className="rk-rake" aria-hidden="true" />

        <div className="rk-head" aria-hidden="true">
          <span>Sign-off sequence</span>
          <span className="rk-head-rule" />
          <span className="rk-head-meta">Every episode, before release</span>
        </div>

        <ol className="rk-bench">
          {STAGES.map((s, i) => {
            const pose = POSE[i % POSE.length];
            return (
              <li key={s.n} className="rk-item" style={{ "--i": i } as CSSProperties}>
                <div className="rk-plate">
                  <Stage
                    seated
                    light={LIGHT_BY_COLUMN[i % 3]}
                    tilt={pose.tilt}
                    turn={pose.turn}
                    roll={pose.roll}
                    depth={pose.depth}
                    radius="var(--radius-md)"
                  >
                    <article className="rk-slip">
                      <p className="rk-slip__no tnum">
                        <span className="sr-only">Stage </span>{s.n}
                      </p>
                      <h3 className="rk-slip__title">{s.stage}</h3>
                      <p className="rk-slip__who">
                        <span className="rk-slip__sign">Signed off by</span>
                        <span className="rk-slip__name">{s.who}</span>
                      </p>
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

      {/* Off the wall and back on the paper, where muted and body both pass:
          the note and the link are read, so they do not stand in the room. */}
      <Settle className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-start lg:gap-16 xl:gap-24">
        <p className="t-body max-w-[52ch] text-body">
          The last two stages are taken by the production team together, and a release has been
          held back to make changes.
        </p>
        <div>
          <TextLink to="/team">
            Who each of them is, and the advisory board
            <IconArrow size={15} />
          </TextLink>
        </div>
      </Settle>
    </div>
  );
}
