import { Settle } from "@/components/Settle";
import { Card, Kicker, SectionHeading, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   Who checks an episode.

   THIS COMPONENT USED TO INVENT A PRODUCTION INCIDENT. It narrated "Episode 004,
   sent back at the fourth gate, published nine days late", with a quoted
   reviewer note and a 6 / 1 / 9 tally, animated across a scroll-pinned stage.
   None of that came from the client. QUESTIONS.md #29 records that the real
   case has not been supplied and that "inventing the specifics of a real
   production incident would be worse than leaving it out", on the one piece of
   the site whose entire purpose is to show the company is honest.

   So the specifics are gone and the process remains. What is stated here is
   only what the client's own handoff supports: the six stages, who is
   answerable at each, and that any of them can hold a release back.

   When Conor supplies the real case, it goes in the slot marked below and this
   becomes the strongest thing on the site. Until then the section is true.
   ========================================================================== */

/* The six stages, titles and attributions only.

   The full sentence for each stage used to live here as well, and it was also
   printed in full on /team and on /ethical-ai. A reader going home, then team,
   then Responsible AI met the identical six paragraphs three times in three
   layouts, which is the single clearest reason the site read as several sites
   rather than one.

   So ownership is now settled: /ethical-ai owns the full account, because the
   sequence IS that page's argument. The home page states that the sequence
   exists and who stands where, and sends the reader on. */
interface Gate {
  n: string;
  stage: string;
  who: string;
}

const GATES: Gate[] = [
  { n: "01", stage: "Concept and story", who: "Conor and Alan" },
  { n: "02", stage: "Script and direction", who: "Alan Compton" },
  { n: "03", stage: "Educational review", who: "Paula Walshe PhD" },
  { n: "04", stage: "Parent and early years review", who: "Lydia and Kirstie" },
  { n: "05", stage: "Quality and suitability", who: "The production team" },
  { n: "06", stage: "Final review and approval", who: "The team" },
];

export function ReviewGateScene() {
  return (
    <div>
      <Settle>
        <SectionHeading
          kicker="How the work gets made"
          title="A named person at every stage"
          lead="This is the sequence an episode goes through before it reaches a child, and who is answerable at each point. Any one of these stages can hold a release back."
        />
      </Settle>

      <Settle className="mt-12">
        <Card className="px-6 py-2 sm:px-10">
          <ol>
            {GATES.map((g) => (
              <li
                key={g.n}
                className="hairline grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[3rem_minmax(0,0.9fr)_minmax(0,1.1fr)] sm:py-6"
              >
                <span className="tnum font-mono text-[13px] text-muted" aria-hidden="true">{g.n}</span>
                <h3 className="t-h3">{g.stage}</h3>
                <p className="eyebrow col-start-2 !text-[11px] sm:col-start-3 sm:mt-0">{g.who}</p>
              </li>
            ))}
          </ol>
        </Card>
      </Settle>

      {/* ---------------------------------------------------------------------
          THE SLOT. When Conor supplies a real case (the handoff refers to one),
          it goes here: the episode, what was caught, by whom, what changed and
          how long the release moved. A real sent-back episode is the single
          most persuasive thing this company owns, and it is the only version of
          this that may ever carry specifics. See CONTENT-NEEDED.md.
      --------------------------------------------------------------------- */}
      <Settle className="mt-8">
        <p className="t-body max-w-[62ch] text-body">
          Nothing is generated and published automatically, and a release has been held back to
          make changes.{" "}
          <TextLink to="/ethical-ai">
            How we use AI, in detail
            <IconArrow size={15} />
          </TextLink>
        </p>
      </Settle>
    </div>
  );
}

/* Kept exported so the eyebrow style stays consistent if this section is
   reused on the Responsible AI page. */
export { Kicker };
