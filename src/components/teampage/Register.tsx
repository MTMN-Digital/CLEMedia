import { useState } from "react";
import { Settle } from "@/components/Settle";
import { DisclosurePanel } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import type { Phase, Member } from "@/components/team/people";

/* ============================================================================
   The register: one ruled row per person.

   Three tracks at lg: the name and role; the biography, first paragraph open
   and the rest one control away; and the roll call, five numerals showing
   which of the five phases this person is in, with the same fact in words
   under them. On a phone the roll call moves up under the role, because the
   phase fact is the scannable answer and the prose follows.

   THE ROLL CALL IS THE PAGE'S SIGNATURE. Read down the third track and the
   company's process is laid out as data: one full row of five discs (the
   animator), four matching rows with the third hollow (the readers), one
   two-disc row (the industry adviser), three rows with none (the illustrator,
   the rhymes, the app's interface). Two states only, a red disc and a hollow
   ring; no legend box, no percentages, no animation. The numerals row is
   aria-hidden and the words are the accessible text, so a screen reader gets
   exactly the sentence it got before.

   NOBODY IN NO PHASE GETS A ROW OF RINGS. Five hollow rings beside a person
   read as missing data, when the fact is that the work sits outside the
   script and episode reviews entirely. The label says so in words instead.

   EVERY VALUE IS READ FROM `people.ts`. `phases` is the one source; the
   register cannot disagree with the Responsible AI page about who is in what.

   NOTHING IN A BIOGRAPHY IS CUT. The opening paragraph says what the person
   does here and is always open; the career behind it is a disclosure.
   ========================================================================== */

/* The same fact, in the fewest words that are still exactly true. Four of
   the eight people are in the identical four phases, so each line names the
   exception rather than listing the rule; the numerals beside it show exactly
   which phases. */
function comesInto(m: Member, phases: Phase[]): string {
  const at = phases.filter((s) => m.phases.includes(Number(s.n)));
  if (!at.length) return "";
  if (at.length === phases.length) return "Every phase";
  const out = phases.filter((s) => !m.phases.includes(Number(s.n)));
  /* One gap, named. Two or more and the list is shorter than the exception. */
  if (out.length === 1) return `Every phase but the ${out[0].phase.toLowerCase()}`;
  return at.map((s) => s.phase.toLowerCase()).join(", ");
}

/* Five 28px discs on one line. 32px pitch at lg, 36px on a phone. A phase the
   person is in: cream numeral on red-deep (10.44:1). A phase they are not in:
   body numeral (8.0:1 on paper-2) inside a 1.5px ring. The ring is `edge`,
   not `rule`: `rule` is tuned to about 2.2:1 on paper because a divider is
   exempt from 1.4.11, and a ring that stands for "not in this phase" is not a
   divider. `edge` is the token the stylesheet keeps for a line that has to
   clear 3:1, and on paper-2 it measures 3.8:1. The fill token is `red-deep`
   on purpose: it is the one red that carries text. */
function RollCall({ member, phases }: { phases: Phase[]; member: Member }) {
  return (
    <ul aria-hidden="true" className="mt-3 flex gap-2 lg:gap-1">
      {phases.map((s) => {
        const on = member.phases.includes(Number(s.n));
        return (
          <li
            key={s.n}
            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[15px] leading-none tnum ${
              on ? "bg-red-deep text-raised" : "border-[1.5px] border-edge text-body"
            }`}
          >
            {Number(s.n)}
          </li>
        );
      })}
    </ul>
  );
}

function Entry({ member, phases }: { phases: Phase[]; member: Member }) {
  const at = comesInto(member, phases);
  const [open, setOpen] = useState(false);
  /* Named off the person rather than `useId`, so the id in the DOM says who
     the panel belongs to when something is being debugged in the inspector. */
  const panelId = `bio-${member.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const [lead, ...rest] = member.bio;

  return (
    <Settle as="li">
      <div className="hairline grid gap-5 pt-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,38rem)_minmax(0,1fr)] lg:gap-x-14 lg:pt-10">
        <div className="min-w-0">
          <p className="t-h3 font-display leading-tight">{member.name}</p>
          {/* The role is `people.ts` `role`, verbatim. */}
          <p className="eyebrow eyebrow-sm mt-2">{member.role}</p>
        </div>

        {/* Phone order: name, roll call, prose. At lg the grid puts the prose
            in track 2 and the roll call in track 3 without changing the DOM. */}
        <div className="order-3 min-w-0 lg:order-none">
          {lead && <p className="t-prose">{lead}</p>}
          {rest.length > 0 && (
            <>
              <DisclosurePanel id={panelId} open={open}>
                {/* The top margin belongs to the first hidden paragraph, not
                    to the panel: a panel with its own padding still occupies
                    that padding when the rows collapse to 0fr. */}
                {rest.map((line, i) => (
                  <p key={i} className="t-prose mt-4">
                    {line}
                  </p>
                ))}
              </DisclosurePanel>
              {/* The arrow turns a quarter on open, as the questions on the
                  Responsible AI page do. A 44px box so the control is a real
                  target on a phone. */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="mt-2 inline-flex min-h-11 items-center gap-2 font-mono text-[14px] uppercase tracking-[0.14em] text-red-deep"
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

        {/* The roll call. `text-body`, not `text-muted`: body is 8.0:1 on
            paper-2 where muted sits nearer the floor. */}
        <div className="order-2 min-w-0 lg:order-none lg:pt-1">
          <p className="font-mono text-[14.5px] uppercase tracking-[0.14em] text-body">
            {at ? "Takes part in" : "Not in the script and episode reviews"}
          </p>
          {at && <RollCall member={member} phases={phases} />}
          {at && <p className="t-body mt-2 max-w-[26ch]">{at}</p>}
        </div>
      </div>
    </Settle>
  );
}

export function Register({ people, phases }: { phases: Phase[]; people: Member[] }) {
  return (
    <ul className="grid gap-y-10 lg:gap-y-12">
      {people.map((m) => (
        <Entry key={m.name} member={m} phases={phases} />
      ))}
    </ul>
  );
}
