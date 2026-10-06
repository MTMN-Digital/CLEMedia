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

   2026-10-06. The empty state used to be one loose paragraph under a heading
   in the middle of the page, with about 700px of nothing around it, and it
   read as a hole rather than as a promise. It is now a reserved sheet hanging
   off the gate station of the chain, with the ledger it will be filled into
   drawn and ruled and visibly waiting. Same words, same absence of facts: the
   difference is that a reader can see the shape of the thing being promised,
   which is what makes a held slot read as discipline instead of an omission.
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

/** The ledger, in the order the fields need answering. One list, used both to
 *  rule the empty sheet and to print the filled one, so the two can never
 *  drift apart. */
const FIELDS: { label: string; of: (c: Case) => string | undefined }[] = [
  { label: "Episode", of: (c) => `${c.episode} ${c.title}` },
  { label: "Caught at", of: (c) => c.stage },
  { label: "By", of: (c) => c.who },
  { label: "What was caught", of: (c) => c.caught },
  { label: "What changed", of: (c) => c.changed },
  { label: "Release moved", of: (c) => c.moved },
];

export function CaseStudy() {
  if (!CASE) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-red/45 bg-[color-mix(in_srgb,var(--color-raised)_45%,transparent)] p-5 sm:p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-red-deep">
          Held for the first case
        </p>
        <p className="t-body mt-4 max-w-[52ch] text-body">
          A release has been held back to make changes, and the first time it happens on a published
          episode we will set it out here in full. A process that can stop the work is only worth the
          claim if we are willing to show it stopping the work.
        </p>
        {/* The ledger, ruled and empty. The rules are decorative: the labels
            below them are the readable content, so the whole list is one
            ordinary list to a screen reader and nothing announces a blank. */}
        <dl className="mt-6">
          {FIELDS.map((f) => (
            /* auto, not a fraction: at 390 a half-column made "What was
               caught" wrap onto two lines and the ruled sheet stopped looking
               like a ruled sheet. The label takes the width it needs and the
               rule takes what is left. */
            <div key={f.label} className="hairline grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{f.label}</dt>
              <dd aria-hidden="true" className="h-px bg-[color-mix(in_srgb,var(--color-body)_22%,transparent)]" />
            </div>
          ))}
        </dl>
      </div>
    );
  }

  const rows = FIELDS.map((f) => [f.label, f.of(CASE)] as const).filter(
    (r): r is readonly [string, string] => Boolean(r[1]),
  );

  return (
    <dl className="card rounded-[var(--radius-lg)] px-6 py-2 sm:px-7">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="hairline grid grid-cols-1 gap-x-8 gap-y-1 py-4 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]"
        >
          <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{label}</dt>
          <dd className="t-body text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
