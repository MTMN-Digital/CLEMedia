import { Settle } from "@/components/Settle";

/* ============================================================================
   The case study.

   The production line on this page draws a return path: the final review can
   send an episode back. That claim is the strongest thing this company owns,
   and at the moment it is only a claim. One real case, named, turns it into
   evidence.

   SO THIS SECTION IS BUILT AND EMPTY ON PURPOSE. `CASE` is null until Conor
   supplies the facts, and the section renders a short, true statement of what
   is coming instead of a fake one. Fill in the object and the whole case
   renders: no layout work, no second pass.

   WHAT IT MUST NEVER DO is invent any of it. An earlier build of this site
   narrated "Episode 004, sent back at the fourth gate, published nine days
   late", with a quoted reviewer note, none of which came from the client. On
   the one page whose purpose is to show this company is honest, invented
   specifics are the worst thing that could be here. The fields below are the
   questions, in the order they need answering.
   ========================================================================== */

export interface Case {
  /** The episode, as the show numbers it. "002", not "the second one". */
  episode: string;
  title: string;
  /** Which of the six stages caught it, by number and name. */
  stage: string;
  /** The person answerable at that stage, named as they want to be named. */
  who: string;
  /** What they caught, in their own words if possible. */
  caught: string;
  /** What changed as a result. */
  changed: string;
  /** How long the release moved. A real figure or nothing at all. */
  moved?: string;
}

/* Fill this in. Every field is a fact from the client, or it stays null. */
export const CASE: Case | null = null;

export function CaseStudy() {
  if (!CASE) {
    return (
      <Settle className="max-w-[62ch]">
        <p className="t-body text-body">
          A release has been held back to make changes, and the first time it happens on a
          published episode we will set it out here in full: which episode, what was caught, who
          caught it and what changed. A process that can stop the work is only worth the claim if
          we are willing to show it stopping the work.
        </p>
      </Settle>
    );
  }

  const rows: [string, string][] = [
    ["Episode", `${CASE.episode} ${CASE.title}`],
    ["Caught at", CASE.stage],
    ["By", CASE.who],
    ["What was caught", CASE.caught],
    ["What changed", CASE.changed],
    ...(CASE.moved ? ([["Release moved", CASE.moved]] as [string, string][]) : []),
  ];

  return (
    <Settle as="dl" className="max-w-[72ch]">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="hairline grid grid-cols-1 gap-x-10 gap-y-1 py-5 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
        >
          <dt className="eyebrow !text-[11px]">{label}</dt>
          <dd className="t-body text-ink">{value}</dd>
        </div>
      ))}
    </Settle>
  );
}
