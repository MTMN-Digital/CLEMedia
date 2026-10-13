import type { ReactNode } from "react";
import { Settle } from "@/components/Settle";

/* ============================================================================
   Tested in homes and schools: the company's own measurement, and the one
   section on this site that is deliberately unfinished in public.

   WHY IT SHIPS WITH HOLES IN IT. From the client's creative director's
   revision of the home page, 2026-10-13, where all four figures are drawn as
   `[__]`. The decision was to build it that way rather than wait: the brackets
   are set in the display face at the size the real numbers will take, so the
   section is finished the day the numbers arrive and, until then, anyone who
   opens the page can see exactly what is owed. Logged in CONTENT-NEEDED.md.

   IT MUST NOT GO LIVE LIKE THIS. A bracket is a request, not a statistic, and
   the hard rule in CLAUDE.md is that no figure is ever invented. The note
   under the list says so in the page's own voice and removes ITSELF the moment
   every figure is filled, so nobody has to remember to delete it.

   THE SENTENCE ABOVE THE FIGURES IS A CLAIM TOO. "We tested the series with
   families at home and with classes in schools" is the creative director's
   wording and it is as unverified as the numbers under it. It is here because
   it is the client's own copy and this build does not cut the client's copy,
   but it is listed in CONTENT-NEEDED.md beside the figures and it goes out
   with them if the testing turns out not to have happened.

   ON PAPER, NOT ON THE NAVY. The deck sets this band on a navy gradient, which
   is the most striking slide in it. Two reasons it is paper here: this site
   spends its one deep band on the close, and four empty brackets in heavy ink
   on bare paper read as a form waiting to be filled in, which is the honest
   thing for this section to look like right now.
   ========================================================================== */

interface Measure {
  /** Null until the company supplies it. Null is what draws the bracket. */
  value: string | null;
  suffix?: string;
  /** What the figure counts. May carry a second, inline hole of its own. */
  label: ReactNode;
}

/* The inline hole, at body size, for the one line that counts two things.
   Same component as the big one so there is a single definition of what a
   missing figure looks like. */
function Hole() {
  return (
    <span className="text-muted" aria-label="figure not yet supplied">
      [__]
    </span>
  );
}

const SCHOOLS: string | null = null;

const MEASURES: Measure[] = [
  {
    value: null,
    suffix: "%",
    label: "average share of each episode watched",
  },
  {
    value: null,
    label: (
      <>
        families and {SCHOOLS ?? <Hole />} schools in testing, children aged 3 to 5
      </>
    ),
  },
  {
    value: null,
    suffix: "%",
    label: "of children described as hard to settle who watched to the end",
  },
];

const pending = SCHOOLS === null || MEASURES.some((m) => m.value === null);

/* The bracket. Not a styled input and not three underscores in a paragraph:
   it is set in the same face, at the same size and on the same baseline as the
   figure that will replace it, so the section's shape does not move when the
   numbers land. */
function Figure({ value, suffix }: { suffix?: string; value: string | null }) {
  return (
    <span className="whitespace-nowrap font-display text-[clamp(2.5rem,1.7rem+2.6vw,3.75rem)] leading-[0.95] tracking-[-0.03em] text-ink">
      {value ?? <Hole />}
      {suffix}
    </span>
  );
}

export function Tested({ headingId }: { headingId: string }) {
  return (
    <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,34rem)] lg:gap-x-20">
      <Settle>
        <p className="eyebrow">Tested in homes and schools</p>
        <h2 id={headingId} className="t-display mt-6 max-w-[14ch]">
          Calm does not mean easy to switch off.
        </h2>
        <p className="t-lead mt-8 max-w-[44ch]">
          We tested the series with families at home and with classes in schools, including children
          who find it hard to settle or focus. They watched to the end.
        </p>

        {/* Under the claim, not under the figures. It qualifies the sentence
            as much as the numbers, and it is what the left column had instead
            of the deck's "how we test" link, which points at a page this site
            does not have. */}
        {pending && (
          <p className="mt-10 max-w-[40ch] border-t border-rule pt-5 font-mono text-[11.5px] uppercase leading-[1.7] tracking-[0.12em] text-muted">
            Figures awaited from CLÉ. Nothing here is estimated, and this note disappears when they
            are supplied.
          </p>
        )}
      </Settle>

      <Settle>
        <ul>
          {MEASURES.map((m, i) => (
            <li
              key={i}
              className="hairline flex flex-wrap items-baseline gap-x-6 gap-y-2 py-7 first:border-t-0 first:pt-0 lg:gap-x-8"
            >
              <Figure value={m.value} suffix={m.suffix} />
              <p className="t-body max-w-[26ch] flex-1">{m.label}</p>
            </li>
          ))}
        </ul>
      </Settle>
    </div>
  );
}
