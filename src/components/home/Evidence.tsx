import { Settle } from "@/components/Settle";

/* ============================================================================
   The evidence, as three figures with the paper each comes from.

   WHY IT EXISTS. From the client's creative director's revision of the home
   page, 2026-10-13. It is the one section in that deck the site had nothing
   like, and it is aimed squarely at audiences two and three in the brief:
   a broadcaster or an educator asking what this company's claim about calm
   media is actually founded on.

   EVERY FIGURE IS SOMEONE ELSE'S AND SAYS SO. Nothing here is CLÉ's own
   measurement, which is the whole reason this section can ship while the
   section under it cannot: these are published results with a journal, a year
   and a link to the paper. The site's rule against invented statistics is not
   bent by citing somebody else's, as long as the citation is real and the
   reader can get to it in one click. All three were checked against the actual
   papers before they were typed, and all three links resolve.

   THE THIRD CARD IS NOT THE DECK'S. The deck leads it with "35 studies pooled
   in a 2025 meta-analysis". That paper is real (Hinten, Scarf and Imuta,
   Developmental Science, 2025) but it is two analyses, 19 studies on pace and
   16 on fantasy, and nothing published says those sets do not overlap, so 35
   is a number nobody can stand over. The card leads on the fantasy analysis,
   which is the one being cited, at its real count.

   AND THE FINDING CUTS ACROSS THE DECK'S OWN READING. That meta-analysis
   found NO consistent short-term effect of pace. What it found was an effect
   of fantastical content. A company that sells "calm" and cites this paper
   loosely is handing a hostile reader a stick; read properly it is a better
   argument than the deck's, because it says the thing that matters is not how
   fast an episode is cut but whether a four-year-old is being shown one
   impossible event after another. That is a claim about content, which is
   what this company actually controls.

   ON THE GROVE. Cream figures on the show's green. The deck sets its own
   numerals in green on tan, which would make green a second accent on a site
   whose single accent is the show's red and means a thing has been stopped.
   Green is a room here, not a highlight.
   ========================================================================== */

interface Finding {
  figure: string;
  /** What the figure counts. Never a claim, just the unit. */
  unit?: string;
  body: string;
  source: string;
  href: string;
}

const FINDINGS: Finding[] = [
  {
    figure: "9",
    unit: "minutes",
    body:
      "Four-year-olds who watched nine minutes of a fast, fantastical cartoon did worse on " +
      "self-control and problem-solving tasks straight afterwards than children who watched a " +
      "slower programme or drew.",
    source: "Pediatrics, 2011",
    href: "https://doi.org/10.1542/peds.2010-1919",
  },
  {
    figure: "1",
    unit: "hour",
    body:
      "The World Health Organization's daily ceiling on sedentary screen time for children aged " +
      "two to four, with less advised as better. Every minute a child watches should count.",
    source: "WHO guidelines, 2019",
    href: "https://www.who.int/publications/i/item/9789241550536",
  },
  {
    figure: "16",
    unit: "studies",
    body:
      "Pooled in a 2025 meta-analysis. What showed a short-term effect on children's attention " +
      "and self-control was fantastical content, impossible events one after another, rather " +
      "than how fast a programme was cut.",
    source: "Developmental Science, 2025",
    href: "https://doi.org/10.1111/desc.70069",
  },
];

export function Evidence({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,30rem)] lg:items-end">
        <div>
          <h2 id={headingId} className="t-h2 max-w-[26ch]">
            What the research says about fast, chaotic media for young children
          </h2>
        </div>
        <p className="t-lead lg:pb-1">
          None of this is ours. Three published results, with the paper each one comes from, because
          a company that says it builds on research should let you read the research.
        </p>
      </Settle>

      {/* A ruled set, not three cards. The rule over each figure is the only
          furniture: boxing them would make three tiles of a thing that is
          already three of a kind, which is the tell this site spent a fortnight
          getting out of its other sections. */}
      <Settle className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-3 lg:mt-20 lg:gap-x-16">
        {FINDINGS.map((f) => (
          <div key={f.source} className="border-t border-white/22 pt-7">
            <p className="font-display text-[clamp(3rem,2rem+3.4vw,4.75rem)] leading-[0.92] tracking-[-0.03em]">
              {f.figure}
              {f.unit && (
                <span /* NO `opacity-80` SINCE 2026-10-13. It was fine on the olive and fails on
                     the garden ground this band now stands on: the mobile sweep caught it
                     at 4.42 against rgb(97,99,77), under AA. 0.88 is the lowest that
                     passes and clears the worst pixel by 0.02, which is not a margin.
                     The unit is full cream instead: a 1rem body label beside a 4.75rem
                     display numeral was never relying on opacity to be subordinate. */
                  className="ml-2.5 align-baseline font-body text-[clamp(1rem,0.85rem+0.5vw,1.25rem)] font-normal tracking-normal">
                  {f.unit}
                </span>
              )}
            </p>
            <p className="t-body mt-5 max-w-[34ch]">{f.body}</p>
            {/* The citation IS the link. A separate "read more" would be a
                fourth thing to click under three figures, and the reader who
                wants the paper is looking at the journal name already. */}
            <a
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              /* `pt-4` with `mt-2` rather than `mt-6` on its own: the box is
                 unchanged on the page and the target grows upward into the
                 space that was margin. 11.5px of mono set a 19px high box,
                 which is the one thing on this site measured under the 24px
                 WCAG 2.2 target minimum. Top padding only, because
                 `.link-draw` paints its rule at `background-position: 0 100%`
                 and any bottom padding drops the underline off the word. */
              className="link-draw mt-2 inline-block pt-4 font-mono text-[11.5px] uppercase tracking-[0.14em]"
            >
              {f.source}
            </a>
          </div>
        ))}
      </Settle>
    </>
  );
}
