import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { PageHero } from "@/components/PageHero";
import { ProductionFlat } from "@/components/ethical-ai/ProductionFlat";
import { TheLineTable } from "@/components/ethical-ai/TheLineTable";
import { ForTheChild } from "@/components/ethical-ai/ForTheChild";
import { Container, TextLink, Button, Section, DisclosurePanel } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { useBlock, emphasis } from "@/lib/content";
import { COPY } from "@/components/ethical-ai/copy";

/* ============================================================================
   Responsible AI.

   The most important trust page on the site, for investors and educators. A
   company that makes children's media with AI tools has to say exactly what
   the tools do, what people decide, and where the work can be stopped.

   SHAPE, set 2026-10-06, carried to the hero's language 2026-10-27. One
   drawing owns the middle of this page: the flat production line on a
   full-bleed wall band, with the dashed return climbing back from the final
   sign-off to the tools. With the text blurred it is a dark panel at the top
   (the opening, in the gaps-around-the-film dark, because this page argues
   about how pictures are made and no still on the site can be credited with
   more than "a frame from the series"), one tall paper band with a line
   across it, a pair of large sentences, a ruled table and six commitments,
   a sheet of questions, then the navy foot.

   WHAT CHANGED 2026-10-27. The page used to open on the position line over
   two grey paragraphs: the exact heading-and-grey-lead shape the client
   named as the site's real problem. The position line is now the PageHero
   headline, the two tool names are its aside, and the two facts from the
   paragraphs moved to where they are talking: the decisions sentences open
   the band beside its heading, and the "sequence an episode goes through"
   note is the small line directly above the drawing. The drawn boundary
   (TheLine) was a second diagram on a page allowed one; it is a two-row
   ruled table now, every label kept. The honesty section is the page's pull
   moment and is set as the large pair. Every section opens in its own shape.

   Every sentence here is the client's own position or already in the repo.
   Nothing is added: no incident, no number, no date. The real sent-back
   episode has not been supplied and is not invented here either
   (CONTENT-NEEDED.md).
   ========================================================================== */

const LINES = [
  {
    title: "Human creativity comes first",
    body: "Characters, stories, educational objectives, scripts and creative direction all begin with people. Tools can help bring those ideas to screen. They do not decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  },
  {
    title: "Human oversight at every stage",
    body: "Using AI does not remove responsibility. Our team reviews, directs and refines the work throughout production. Outputs are not automatically generated and published.",
  },
  {
    title: "Protecting original IP",
    body: "The Pawsitive Pugs & Pals®, its characters and its world are original intellectual property. We do not intentionally use AI to reproduce the identifiable style, characters or IP of other creators or children's brands. The aim is to build our own world rather than imitate somebody else's.",
  },
  {
    title: "Children's interests come before technology",
    body: "The fact that technology can do something does not mean we should. Decisions are guided by the child's experience first: calm, age-appropriate content that moves a child beyond passive viewing into play, conversation and offline learning.",
  },
  {
    title: "Education requires human judgement",
    body: "Educational content deserves more than an automated check. Decisions about learning objectives, activities, language and child development stay with qualified people.",
  },
  {
    title: "Transparency matters",
    body: "We will not pretend AI is absent from our process. Equally, calling our programmes simply AI-generated misrepresents the human development, direction and review involved. We prefer the clearer description at the top of this page.",
  },
];

const QUESTIONS = [
  {
    q: "Which tools are used?",
    a: "Runway, for elements of visual production and animation, and ElevenLabs, for elements of audio and voice production. Both sit inside a human-led workflow rather than operating as autonomous content creators. As the technology changes we will keep reviewing the platforms we use, their commercial terms, and how they align with our standards on intellectual property, consent and responsible production.",
  },
  {
    q: "Who writes and approves the stories?",
    a: "Conor and Alan set the concept and the story. Alan writes the script and directs production. The finished episode is reviewed by the team before release, and any of them can ask for changes.",
  },
  {
    q: "How are educational decisions made?",
    a: "Paula Walshe PhD reviews the learning intent of each episode and the activities that follow it. Lydia and Kirstie bring parent and early years perspectives to script and production review. Those judgements are made by people, and we do not automate them.",
  },
  {
    q: "What happens when a review identifies a problem?",
    a: "The work is revised and re-reviewed, and the team watches and revises again until everyone is happy with the episode and signs it off for release. Getting an episode right matters more to us than getting it out on the original date.",
  },
];

/** One question. The panel is the shared `DisclosurePanel`; the button is here
 *  because it is a heading, and the open state belongs to the list so that
 *  opening one answer closes the last. */
function Question({ id, q, a, open, onToggle }: { open: boolean; onToggle: () => void; q: string; id: string; a: string }) {
  return (
    <li className="hairline">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="t-h3">{q}</span>
          <span
            aria-hidden="true"
            className={`mt-0.5 shrink-0 text-red-deep transition-transform duration-300 ease-out ${open ? "rotate-90" : ""}`}
          >
            <IconArrow size={18} />
          </span>
        </button>
      </h3>
      <DisclosurePanel id={id} open={open}>
        <p className="t-body max-w-[62ch] pb-7 text-body">{a}</p>
      </DisclosurePanel>
    </li>
  );
}

export default function EthicalAi() {
  const [open, setOpen] = useState<number | null>(0);

  /* EDITABLE FROM THE ADMIN, 2026-10-27. Every string below is the page's
     own wording (components/ethical-ai/copy.ts) until a content_blocks row
     replaces it. The headline's accent clause is written between *stars*.
     The six commitments and the four answers are the position itself and
     stay in this file. */
  const heroEyebrow = useBlock("ethical-ai", "hero.eyebrow", COPY["hero.eyebrow"]);
  const heroEyebrowSub = useBlock("ethical-ai", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroAside = useBlock("ethical-ai", "hero.aside", COPY["hero.aside"]);
  const heroTitle = useBlock("ethical-ai", "hero.title", COPY["hero.title"]);
  const lineHeading = useBlock("ethical-ai", "line.heading", COPY["line.heading"]);
  const lineLead = useBlock("ethical-ai", "line.lead", COPY["line.lead"]);
  const linesHeading = useBlock("ethical-ai", "lines.heading", COPY["lines.heading"]);
  const faqHeading = useBlock("ethical-ai", "faq.heading", COPY["faq.heading"]);
  const commitHeading = useBlock("ethical-ai", "commit.heading", COPY["commit.heading"]);
  const commitLead = useBlock("ethical-ai", "commit.lead", COPY["commit.lead"]);

  return (
    <>
      <Seo
        title="Responsible AI"
        description="How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production process: five phases, the same five people reading every draft, and what the reviews are for."
        path="/ethical-ai"
      />

      {/* ═══ 1. THE POSITION, in the hero's frame. The client's own line, which
          the home page already carries as a section heading, is the whole page
          in twelve words, so it is the h1 and nothing paraphrases it. Plain
          panel, no still: the page argues about how pictures are made, so the
          opening stays typographic and dark, like the gaps around the film.
          The aside is the one fact an investor wants first (which tools), and
          "People remain responsible" takes the accent because it is the
          company's position in three words.

          The first action is a hand-written anchor rather than `Button`:
          `Button to` goes through the router (no hash scroll) and `Button
          href` opens a new tab. Same classes, same look. ═══ */}
      <PageHero
        id="ai-h"
        size="tall"
        tone="ink"
        eyebrow={<>{heroEyebrow}<span>{heroEyebrowSub}</span></>}
        aside={<>{heroAside}</>}
        title={emphasis(heroTitle)}
        actions={
          <>
            <a href="#line-h" className="btn btn-primary">
              See the five phases<IconArrow size={16} />
            </a>
            <Button to="/team" variant="quiet">Who is in the sequence</Button>
          </>
        }
      />

      {/* ═══ 2. THE LINE. The page's one band and its whole argument. Full
          bleed on the wall ground, because this is a different room rather
          than more of the same page, and because a drawing that is the
          argument should not be boxed to the width of a paragraph.

          The heading is the claim the drawing makes. The two decisions
          sentences that used to be the page's grey lead open the band BESIDE
          the heading, not under it, so the band does not start in the shape
          the hero just avoided; the note about the sequence is the small line
          directly above the drawing it introduces, with the key beside it. ═══ */}
      <Section labelledBy="line-h" className="wall">
        <Container width="wide">
          <Settle className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-x-16">
            <h2 id="line-h" className="t-h2 max-w-[18ch] scroll-mt-28">
              {lineHeading}
            </h2>
            <p className="t-lead max-w-[40ch] text-ink lg:justify-self-end">{lineLead}</p>
          </Settle>

          <Settle className="mt-14 flex flex-col gap-5 border-t-[1.5px] border-rule pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <p className="t-sm max-w-[52ch] text-body">
              Below is the sequence an episode goes through before it reaches a child. It goes back
              round until everyone is happy.
            </p>
            <ul className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[14px] uppercase tracking-[0.14em] text-body" aria-label="Key">
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-[1.5px] border-rule bg-raised" />
                Person decides
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] border-[1.5px] border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))]" />
                Tool assists
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-raised ring-2 ring-red/70" />
                Everyone signs off
              </li>
            </ul>
          </Settle>

          {/* One Settle around the whole line, not one per phase: the draw-on
              of the return path keys off this element's own .is-armed.is-in, and
              a per-phase Settle would arm seven separate clocks for one line. */}
          <Settle className="mt-6">
            <ProductionFlat gateSlot={<ForTheChild />} />
          </Settle>

          <Settle className="mt-14 flex max-w-[64ch] gap-4">
            <span aria-hidden="true" className="mt-3 h-0 w-8 shrink-0 border-t-2 border-dashed border-red" />
            <p className="t-body text-body">
              The dashed return is the part that matters. When the final review asks for changes,
              the work goes back into production and is re-reviewed, and the team watches and
              revises again until everyone is happy with the episode and signs it off for release.
            </p>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. NEITHER WORD IS TRUE. The page's pull moment: the two
          descriptions the company refuses, as one large pair in the display
          face, side by side with a rule between them. The pair IS the
          heading; the sentence that used to sit over it ("We would rather
          describe that accurately...") only said that the pair was coming, so
          it is gone, and the two NOT labels went with it because each
          sentence already says which word it refuses. ═══ */}
      <Section labelledBy="honest-h">
        <Container width="wide">
          <Wipe>
            <h2 id="honest-h" className="grid gap-9 xl:grid-cols-2 xl:gap-0">
              <span className="block font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.375rem)] leading-[1.18] tracking-[-0.005em] text-ink xl:max-w-[22ch] xl:pr-14">
                Calling this work handmade would be untrue.
              </span>
              <span className="block border-t-[1.5px] border-rule-soft pt-9 font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.375rem)] leading-[1.18] tracking-[-0.005em] text-ink xl:max-w-[24ch] xl:border-l-[1.5px] xl:border-t-0 xl:pl-14 xl:pt-0">
                Calling it AI-generated would erase the people who actually make the decisions.
              </span>
            </h2>
            <div className="mt-7 grid gap-6 xl:grid-cols-2 xl:gap-0">
              <p className="t-body max-w-[44ch] text-body xl:pr-14">
                Runway and ElevenLabs sit inside final production, and this page says so by name.
              </p>
              <p className="t-body max-w-[44ch] text-body xl:pl-14">
                The story, the script, the direction, every review and the final approval are theirs.
              </p>
            </div>
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 4. THE LINES WE HOLD. The heading is the boundary the old drawing
          drew; the boundary itself is a two-row ruled table now (see
          TheLineTable.tsx), because the production line above is the page's
          one diagram. Then the six commitments as a long read in hairline
          rows, not six icon cards: a principle is a sentence a reader holds
          the company to, and it is easier to hold someone to a sentence than
          to a pictogram. ═══ */}
      <Section labelledBy="lines-h" pad={["tight", "tight"]}>
        <Container width="wide">
          <Settle>
            <h2 id="lines-h" className="t-h2 max-w-[22ch]">
              {linesHeading}
            </h2>
          </Settle>

          <TheLineTable />

          {/* TWO-UP AT XL. Six hairline rows one under another was both the
              empty right third and the tallest run of prose left on the page;
              two columns of three spend the width and take about 900px of
              scroll out of it. The titles stack over their bodies at that
              breakpoint, because a 14rem title track inside a 573px cell
              leaves the body about 190px, which is not a measure. */}
          <Settle as="ol" className="mt-16 xl:grid xl:grid-cols-2 xl:gap-x-14">
            {LINES.map((l) => (
              <li key={l.title} className="hairline grid content-start gap-y-2 py-7 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-x-10 xl:grid-cols-1 xl:gap-x-0">
                {/* The 16ch cap was sized for a side track about 400px wide. Stacked over
                    a 558px body it broke four of the six titles onto three lines, so it
                    opens up where the title sits above rather than beside. */}
                <h3 className="t-h3 max-w-[16ch] xl:max-w-[26ch]">{l.title}</h3>
                {/* Measured at 1440, not guessed: the free column set 89
                    characters to the line and a 68ch cap still set 80, because
                    `ch` on Hanken is about 8.7px against an average character
                    of 7.3. 62ch lands at 73, which is inside the 75 the house
                    reads as a measure rather than as a scan. */}
                <p className="t-body max-w-[62ch] text-body">{l.body}</p>
              </li>
            ))}
          </Settle>
        </Container>
      </Section>

      {/* ═══ 5. THE QUESTIONS PEOPLE ACTUALLY ASK. On a sheet, not on the
          ground: the rows above are already a full-width stack of hairline
          rows, and two of those in a row is exactly the sameness this pass is
          for. A sheet with a tab reads as a document handed over, which is
          what a set of answers to standing questions is. The heading is the
          four questions in one line. ═══ */}
      <Section labelledBy="faq-h" pad={["tight", "normal"]}>
        <Container width="wide">
          {/* The sheet takes the width and the heading sits in the margin of
              it. Nothing inside the sheet widens: the answers keep their 62ch
              cap, so the extra width becomes paper rather than a longer line.
              Air inside an object reads as an object; air beside a column
              reads as a mistake, which is what this section was. */}
          <div className="xl:grid xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:items-start xl:gap-x-14">
            <Settle>
              <h2 id="faq-h" className="t-h2 max-w-[18ch]">
                {faqHeading}
              </h2>
            </Settle>
            <Settle className="mt-9 xl:mt-0">
              <div className="card-stock px-5 pb-2 pt-9 sm:px-9 sm:pt-10">
                <span className="card-tab" aria-hidden="true">ASKED AND ANSWERED</span>
                <ul>
                  {QUESTIONS.map((f, i) => (
                    <Question
                      key={f.q}
                      id={`ai-q-${i}`}
                      q={f.q}
                      a={f.a}
                      open={open === i}
                      onToggle={() => setOpen(open === i ? null : i)}
                    />
                  ))}
                </ul>
              </div>
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 6. THE COMMITMENT, the one deep band ═══ */}
      {/* The site footer is navy too, so this band and the footer meet with no
          edge between them. Its bottom padding is cut back accordingly: at the
          full section rhythm the two together read as 900px of unbroken navy
          with a hundred words in it. */}
      <Section deep labelledBy="commit-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="commit-h" className="t-h2 max-w-[20ch]">
                {commitHeading}
              </h2>
              <p className="t-lead mt-6 max-w-[52ch] opacity-85">{commitLead}</p>
            </div>
            <div className="lg:pt-2">
              <p className="t-body max-w-[42ch] opacity-85">
                If something here does not satisfy you, whether you are a parent, an educator or a
                distribution partner, we would genuinely rather have the conversation than have you
                assume.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Button to="/contact">Get in touch<IconArrow size={16} /></Button>
                <TextLink to="/team">
                  The people in the sequence<IconArrow size={15} />
                </TextLink>
              </div>
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
