import { Settle } from "@/components/Settle";
import type { Member, Stage } from "./people";
import { StandsAt } from "./StandsAt";

/* ============================================================================
   The people, and the stages each of them stands at, in words.

   This is the other half of `StageSequence`. The sequence answers "who stands
   at stage three"; this answers "what is Paula answerable for", which is the
   question an investor asks about a named individual. The matrix it replaces
   tried to answer both at once with a grid of squares and answered neither
   quickly.

   THE STAGES ARE WRITTEN OUT. A person's stages used to be six small boxes in
   three states against a legend. They are now the stage names, in a sentence.
   It costs a line of text per person and removes the key entirely, and it is
   the version a screen reader was already being given, so the two readings
   finally match.

   WHOEVER IS NOT NAMED ANYWHERE SAYS SO. Mansi holds the schedule and stands
   at no review stage; the adviser sits outside the sequence altogether. Both
   state it, because an empty row of dashed boxes reads as missing data rather
   than as a deliberate fact about the company's account.
   ========================================================================== */

function standsAt(m: Member, stages: Stage[]): string {
  const named = stages.filter((s) => m.named.includes(Number(s.n)));
  const shared = m.team ? stages.filter((s) => s.shared) : [];
  const parts: string[] = [];
  if (named.length) parts.push(named.map((s) => s.stage.toLowerCase()).join(", "));
  if (shared.length) {
    parts.push(
      `${named.length ? "and " : ""}the ${shared.length} stages the team takes together`,
    );
  }
  return parts.join(" ");
}

export function Roster({
  people,
  stages,
  outside = false,
}: {
  people: Member[];
  stages: Stage[];
  /** Advisers sit outside the six stages entirely. */
  outside?: boolean;
}) {
  return (
    <ul className="grid gap-y-10 lg:gap-y-12">
      {people.map((m) => {
        const at = outside ? "" : standsAt(m, stages);
        return (
          <Settle as="li" key={m.name}>
            <div className="hairline grid gap-5 pt-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-14 lg:pt-10 xl:gap-20">
              {/* NO PORTRAIT, 2026-10-09. This was the THIRD photograph of the
                  same person on one page: the strip in the opening band, the
                  review board, and then here. Three face lists down a single
                  page is the "boring vertical list" complaint arriving by a
                  different route, and the one that earns its place least is
                  this one, where the reading is the biography. The name is
                  set as the display line instead and the margin carries the
                  stages, which is what this column is actually for. */}
              <div className="min-w-0">
                <p className="t-h3 font-display leading-tight">{m.name}</p>
                <p className="eyebrow eyebrow-sm mt-2">{m.role}</p>
                {/* Where this one stands on the six, in the margin beside the
                    name. The sentence below still spells it out; this is for
                    the reader scanning seven biographies for the one person
                    they came to check. */}
                <StandsAt member={m} stages={stages} outside={outside} />
              </div>

              <div className="min-w-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em]">
                  {outside
                    ? "Outside the six review stages"
                    : at
                      ? "Stands at"
                      : "Not at a review stage"}
                </p>
                {!outside && at && <p className="t-prose mt-1.5 first-letter:uppercase">{at}</p>}
                {m.bio.map((line, i) => (
                  <p key={i} className={i === 0 ? "t-prose mt-5" : "t-prose mt-4"}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Settle>
        );
      })}
    </ul>
  );
}
