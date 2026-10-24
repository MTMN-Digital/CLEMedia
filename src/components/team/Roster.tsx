import { Settle } from "@/components/Settle";
import type { Phase, Member } from "./people";
import { StandsAt } from "./StandsAt";

/* ============================================================================
   The people, and the phases each of them comes into, in words.

   This is the other half of `StageSequence`. The sequence answers "what
   happens at the revised drafts"; this answers "what does Paula actually do
   here", which is the question an investor asks about a named individual.

   THE PHASES ARE WRITTEN OUT, not encoded. They used to be small boxes in
   three states against a legend. It costs a line of text per person, removes
   the key entirely, and it is the version a screen reader was already being
   given, so the two readings match.

   WHOEVER IS IN NO PHASE SAYS SO. Mansi is a production assistant on the
   nursery rhymes and Victoria designs the games and puzzles; neither is in
   the script and episode reviews, and both state it, because an empty row
   reads as missing data rather than as a deliberate fact.

   THE `outside` PROP IS GONE, 2026-10-24. It rendered advisers as sitting
   outside the sequence entirely, which was true of the six-stage account and
   is not true of this one: the 22 October document puts David Toth in the
   reading group for every draft and says in as many words that he must be
   recognised for his script input. A person is now in the phases their own
   row says they are in, adviser or not.
   ========================================================================== */

function comesInto(m: Member, phases: Phase[]): string {
  const at = phases.filter((s) => m.phases.includes(Number(s.n)));
  return at.map((s) => s.phase.toLowerCase()).join(", ");
}

export function Roster({ people, phases }: { phases: Phase[]; people: Member[] }) {
  return (
    <ul className="grid gap-y-10 lg:gap-y-12">
      {people.map((m) => {
        const at = comesInto(m, phases);
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
                    the reader scanning the whole roster for the one person
                    they came to check. */}
                {at && <StandsAt member={m} phases={phases} />}
              </div>

              <div className="min-w-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em]">
                  {at ? "Takes part in" : "Not in the script and episode reviews"}
                </p>
                {at && <p className="t-prose mt-1.5 first-letter:uppercase">{at}</p>}
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
