import { useState } from "react";
import { Settle } from "@/components/Settle";
import { DisclosurePanel } from "@/components/ui";
import { IconArrow } from "@/components/icons";
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
   given, so the two readings match. SUMMARISED 2026-10-26, still in words:
   see `comesInto`. The full list is still what the track draws.

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

   ── THE MEASURE, AND THE FOLD, 2026-10-24 ─────────────────────────────────
   MEASURED, not judged: these biographies were setting 103 to 140 characters
   to the line at 1440, in a column 1,056px wide with nothing in it but the
   prose. Nothing else on the site is over 80 and the house reads anything past
   about 75 as cheap. It was the largest block of unbroken text left anywhere
   here, and it is the reason the page read as a wall. The prose track is now
   38rem flat, the same one the founder's letter is set to on /story, so the
   two pages about the company share a measure.

   THAT MADE THE PAGE TALLER, which is the opposite of what was wanted, so the
   biographies now fold. The opening paragraph of each is the one that says
   what the person does here, and it is always open; the career history behind
   it is a disclosure. NOTHING IS CUT. Every word the team supplied is still on
   the page and a reader who wants it is one control away from it, which was
   the client's own instruction about his copy.

   THE PHASES MOVED OUT of the top of the prose column and into a third track.
   They were the first thing in that column, so every biography appeared to
   start halfway down a block it did not belong to.
   ========================================================================== */

/* The same fact, in the fewest words that are still exactly true.
   SAID IN FULL IT REPEATED: four of the eight people are in the identical
   four phases, so four rows ran the identical three lines, "first draft,
   revised drafts, episode review, final sign-off", one under another down the
   longest page of text on the site. Repetition at that length stops being
   information and becomes a texture a reader skips, which is the opposite of
   what a roster is for. Every line below is derived from `phases` in
   people.ts and names the exception rather than listing the rule; the track
   beside it still shows exactly which phases, node by node. */
function comesInto(m: Member, phases: Phase[]): string {
  const at = phases.filter((s) => m.phases.includes(Number(s.n)));
  if (!at.length) return "";
  if (at.length === phases.length) return "Every phase";
  const out = phases.filter((s) => !m.phases.includes(Number(s.n)));
  /* One gap, named. Two or more and the list is shorter than the exception. */
  if (out.length === 1) return `Every phase but the ${out[0].phase.toLowerCase()}`;
  return at.map((s) => s.phase.toLowerCase()).join(", ");
}

function Entry({ member, phases }: { phases: Phase[]; member: Member }) {
  const at = comesInto(member, phases);
  const [open, setOpen] = useState(false);
  /* Named off the person rather than `useId`, so the id in the DOM says who
     the panel belongs to when something is being debugged in the inspector. */
  const panelId = `bio-${member.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  /* The first paragraph is what this person does at CLÉ. The rest is where
     they came from, which is the part a reader asks for rather than needs. */
  const [lead, ...rest] = member.bio;

  return (
    <Settle as="li">
      <div className="hairline grid gap-5 pt-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,38rem)_minmax(0,1fr)] lg:gap-x-14 lg:pt-10">
        {/* NO PORTRAIT, 2026-10-09, and still none. This was the THIRD
            photograph of the same person on one page: the strip in the opening
            band, the review board, and then here. Three face lists down a
            single page is the "boring vertical list" complaint arriving by a
            different route, and the one that earns its place least is this
            one, where the reading is the biography. The name is set as the
            display line instead. Confirmed as the right call on 2026-10-24,
            when the roster was rebuilt and a portrait was offered again. */}
        <div className="min-w-0">
          <p className="t-h3 font-display leading-tight">{member.name}</p>
          <p className="eyebrow eyebrow-sm mt-2">{member.role}</p>
        </div>

        <div className="min-w-0">
          {lead && <p className="t-prose">{lead}</p>}
          {rest.length > 0 && (
            <>
              <DisclosurePanel id={panelId} open={open}>
                {/* The top margin belongs to the first hidden paragraph, not
                    to the panel: a panel with its own padding still occupies
                    that padding when the rows collapse to 0fr, which leaves a
                    gap under every closed biography. */}
                {rest.map((line, i) => (
                  <p key={i} className="t-prose mt-4">
                    {line}
                  </p>
                ))}
              </DisclosurePanel>
              {/* Same control as the questions on /ethical-ai: the house
                  rotates the arrow a quarter turn rather than keeping a second
                  chevron for the purpose. */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                /* `py-1.5` is not decoration. The label is 11.5px mono, which
                   gives the button a 16px box, and WCAG 2.2 AA asks for a
                   24x24 target. The padding takes it to 28. The site has been
                   caught by this once already, on the evidence citations. */
                className="mt-4 inline-flex min-h-[24px] items-center gap-2 py-1.5 font-mono text-[13.5px] uppercase tracking-[0.14em] text-red-deep"
              >
                <span className="link-draw">
                  {open ? "Less" : `More about ${member.name.split(" ")[0]}`}
                </span>
                <span
                  aria-hidden="true"
                  className={`transition-transform duration-300 ease-out ${open ? "rotate-90" : ""}`}
                >
                  <IconArrow size={14} />
                </span>
              </button>
            </>
          )}
        </div>

        {/* The third track. Where this one stands on the five, beside the
            biography rather than on top of it. */}
        {/* `text-body`, not `text-muted`. This band carries a vertical wash,
            and the roster is the longest thing on it, so its last rows sit on
            the darkest stop the wash reaches: #ddcdaf, where muted measures
            4.84:1 against a 4.5 floor. It passes, and 0.34 of headroom on a
            surface that is still getting darker is not a margin, it is a
            countdown: the same token already failed outright at #d4c5a8 on
            /story the same day. Body is 7.32:1 on the same stop. It also
            stopped the sweep reporting this label intermittently, which it did
            on two runs out of four while the machine was loaded. */}
        <div className="min-w-0 lg:pt-1">
          <p className="font-mono text-[14.5px] uppercase tracking-[0.14em] text-body">
            {at ? "Takes part in" : "Not in the script and episode reviews"}
          </p>
          {at && <p className="t-body mt-1.5 max-w-[26ch]">{at}</p>}
          {at && <StandsAt member={member} phases={phases} />}
        </div>
      </div>
    </Settle>
  );
}

export function Roster({ people, phases }: { phases: Phase[]; people: Member[] }) {
  return (
    <ul className="grid gap-y-10 lg:gap-y-12">
      {people.map((m) => (
        <Entry key={m.name} member={m} phases={phases} />
      ))}
    </ul>
  );
}
