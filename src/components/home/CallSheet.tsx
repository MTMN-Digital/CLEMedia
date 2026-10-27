import { Settle } from "@/components/Settle";
import { TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PhaseStrip } from "./PhaseStrip";

/* ============================================================================
   How an episode is actually made.

   THE STRUCTURE THE CLIENT SETTLED ON 2026-10-27. The heading stays outside
   and above the object; the client's own words go inside it. That deletes the
   lead this section used to carry, which was our summary of the five
   sentences the company had already written, one per phase. Those sentences
   are now printed in the frames, where they are read once instead of
   paraphrased above and withheld below.

   WHAT ELSE WENT. The board's own printed rail ("How an episode is made",
   "Every episode, every draft"), because the heading already says it. And the
   closing note about scripts going round three or four times, because slips
   02 and 05 print exactly that and the drawn loops show it.

   The sequence itself lives in src/components/team/people.ts, the company's
   own account, so this and /team can never disagree. See PhaseStrip.tsx for
   why the object is a strip of film and why nothing in it is filled.
   ========================================================================== */

export function CallSheet({ headingId }: { headingId: string }) {
  return (
    <div>
      <Settle>
        <h2 id={headingId} className="t-h2">
          Five people read every draft
        </h2>
      </Settle>

      <PhaseStrip />

      <Settle className="mt-10">
        <TextLink to="/team">
          Who each of them is, and the advisory board
          <IconArrow size={15} />
        </TextLink>
      </Settle>
    </div>
  );
}
