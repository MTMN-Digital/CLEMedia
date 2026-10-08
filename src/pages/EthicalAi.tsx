import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { ProductionLine } from "@/components/ethical-ai/ProductionLine";
import { CaseStudy } from "@/components/ethical-ai/CaseStudy";
import { Button, Container, Kicker, Lead, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   Responsible AI.

   The most important trust page on the site, for investors and educators. A
   company that makes children's media with AI tools has to say exactly what
   the tools do, what people decide, and where the work can be stopped.

   SHAPE, set 2026-10-06. One drawing owns the middle of this page: a vertical
   chain on a full-bleed wall band, markers down a centre lane, each station's
   account alternating either side of it, and a dashed return climbing back
   from the gate to the tools. Nothing above it or below it is wide: the page
   opens on a short two-column statement, and closes on a measure, a single
   column of principles and a set of questions. With the text blurred it is a
   light head, one tall dark band with a spine down the middle of it, then
   narrow columns and the navy foot, which is a silhouette no other page here
   has.

   WHAT WENT. The sequence used to be drawn once as a strip across the top and
   then described again twice: a tools section halfway down that re-named
   Runway and ElevenLabs with the one show frame parked in a card beside it,
   and a case-study heading with a lone paragraph under it and about 700px of
   nothing around it. Both are now stations ON the chain, which is where they
   were always arguing from. The page lost two sections and gained density.

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
    a: "The work is revised and re-reviewed before it goes out. A release can be delayed to make that possible, and has. Getting an episode right matters more to us than getting it out on the original date.",
  },
];

/** The house disclosure: grid-rows 0fr to 1fr, so the panel's height animates
 *  without measuring it. Closed panels are also hidden from assistive tech. */
function Question({ id, q, a, open, onToggle }: { id: string; q: string; a: string; open: boolean; onToggle: () => void }) {
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
            className={`mt-0.5 shrink-0 text-red-deep transition-transform duration-300 ease-[var(--ease-out)] ${open ? "rotate-90" : ""}`}
          >
            <IconArrow size={18} />
          </span>
        </button>
      </h3>
      <div
        id={id}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="t-body max-w-[62ch] pb-7 text-body">{a}</p>
        </div>
      </div>
    </li>
  );
}

export default function EthicalAi() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Seo
        title="Responsible AI"
        description="How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production process: six stages, a named person at each, and a final gate that can send the work back before release."
        path="/ethical-ai"
      />

      {/* ═══ 1. THE POSITION, as the headline. The client's own line, which the
          home page already carries as a section heading, is the whole page in
          twelve words, so it is the h1 and nothing paraphrases it. ═══ */}
      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          <Settle>
            <Kicker>Responsible AI</Kicker>
            <h1 className="t-display mt-6 max-w-[17ch]">
              AI is a production tool. People remain responsible for the work.
            </h1>
            <div className="mt-9 grid gap-6 lg:grid-cols-2 lg:gap-16">
              <Lead>
                Our creative and educational decisions are made by people. In final production we use
                Runway for visual production and ElevenLabs for voice production. Our team directs,
                reviews and approves the work before publication.
              </Lead>
              <p className="t-body max-w-[48ch] text-body lg:pt-1.5">
                Below is the sequence an episode goes through before it reaches a child. People sit at
                both ends of it, the tools sit in one place in the middle, and the last gate can send
                the work back.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 2. THE CHAIN. The page's one band and its whole argument. Full
          bleed on the wall ground, because this is a different room rather
          than more of the same page, and because a drawing that is the
          argument should not be boxed to the width of a paragraph. ═══ */}
      <Section labelledBy="line-h" className="wall">
        <Container width="wide">
          <Settle className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h2 id="line-h" className="t-h2 max-w-[18ch]">Six stages, and one place for the tools</h2>
            <ul className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[0.14em] text-body" aria-label="Key">
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border border-rule bg-raised" />
                Person decides
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] border border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))]" />
                Tool assists
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-raised ring-2 ring-red/70" />
                Gate, can hold a release
              </li>
            </ul>
          </Settle>

          {/* One Settle around the whole chain, not one per station: the draw-on
              of the return path keys off this element's own .is-armed.is-in, and
              a per-station Settle would arm seven separate clocks for one line. */}
          <Settle className="mt-14 sm:mt-16">
            <ProductionLine gateSlot={<CaseStudy />} />
          </Settle>

          <Settle className="mt-14 flex max-w-[64ch] gap-4">
            <span aria-hidden="true" className="mt-3 h-px w-8 shrink-0 border-t-[1.75px] border-dashed border-red" />
            <p className="t-body text-body">
              The dashed return is the part that matters. When the final review asks for changes, the
              work goes back into production and is re-reviewed before it goes out. A release can
              wait for that, and has.
            </p>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. NEITHER WORD IS TRUE. The two descriptions the company refuses,
          side by side with a rule between them, and the sentence that
          resolves them above. Narrow, and set in type alone: after the band
          the page wants one quiet argument at one measure. ═══ */}
      <Section labelledBy="honest-h">
        <Container width="default">
          <Wipe>
            <h2 id="honest-h" className="t-h2 max-w-[20ch]">
              We would rather describe that accurately than flatter ourselves in either direction.
            </h2>
            <div className="mt-10 grid gap-9 md:grid-cols-2 md:gap-0">
              <div className="md:pr-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Not handmade</p>
                <p className="t-lead mt-4 text-ink">Calling this work handmade would be untrue.</p>
                <p className="t-body mt-4 text-body">
                  Runway and ElevenLabs sit inside final production, and this page says so by name.
                </p>
              </div>
              {/* border-t explicitly, not the `.hairline` class: `.hairline` is
                  author CSS later in the utilities layer than Tailwind's own
                  `md:border-t-0`, so the stacked rule survived the breakpoint
                  and drew a stray stub over the second column on desktop. */}
              <div className="border-t border-t-rule pt-9 md:border-t-0 md:border-l md:border-l-rule md:pl-12 md:pt-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Not AI-generated</p>
                <p className="t-lead mt-4 text-ink">Calling it AI-generated would erase the people who actually make the decisions.</p>
                <p className="t-body mt-4 text-body">
                  The story, the script, the direction, every review and the final approval are theirs.
                </p>
              </div>
            </div>
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 4. THE LINES WE HOLD. Six commitments as a long read in hairline
          rows, not six icon cards: a principle is a sentence a reader holds
          the company to, and it is easier to hold someone to a sentence than
          to a pictogram. ═══ */}
      <Section labelledBy="lines-h" pad={["none", "tight"]}>
        <Container width="default">
          {/* The line sits on the heading's baseline immediately after it, not
              flung to the far edge of the column: at 1440 a right-aligned
              second cell put nine words a third of a metre from the heading
              they belong to and the two read as unrelated. */}
          <Settle className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-7">
            <h2 id="lines-h" className="t-h2">The lines we hold</h2>
            <p className="t-body text-body">The standards we hold ourselves to.</p>
          </Settle>
          <Settle as="ol" className="mt-10">
            {LINES.map((l) => (
              <li key={l.title} className="hairline grid gap-y-2 py-7 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-x-10">
                <h3 className="t-h3 max-w-[16ch]">{l.title}</h3>
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
          what a set of answers to standing questions is. ═══ */}
      <Section labelledBy="faq-h" pad={["tight", "normal"]}>
        <Container width="default">
          <Settle>
            <h2 id="faq-h" className="t-h2 max-w-[18ch]">The questions we are asked most</h2>
          </Settle>
          <Settle className="mt-9">
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
                The technology will keep changing. The responsibility will not.
              </h2>
              <p className="t-lead mt-6 max-w-[52ch] opacity-85">
                As the company grows we will keep reviewing our practice around human creative
                authorship, intellectual property and commercial rights, performer and voice consent,
                tool selection, transparency with audiences and partners, child safety, educational
                integrity, and making sure technology supports rather than replaces meaningful human
                creativity.
              </p>
            </div>
            <div className="lg:pt-2">
              <p className="t-body max-w-[42ch] opacity-85">
                If something here does not satisfy you, whether you are a parent, an educator or a
                distribution partner, we would genuinely rather have the conversation than have you
                assume.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Button to="/contact">Get in touch<IconArrow size={16} /></Button>
                <Link to="/team" className="link-draw inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  The people in the sequence<IconArrow size={15} />
                </Link>
              </div>
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
