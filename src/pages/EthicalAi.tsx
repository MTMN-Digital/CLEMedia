import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { ProductionLine } from "@/components/ethical-ai/ProductionLine";
import { Button, Card, Container, Kicker, Lead, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   Responsible AI.

   The most important trust page on the site, for investors and educators. A
   company that makes children's media with AI tools has to say exactly what
   the tools do, what people decide, and where the work can be stopped.

   The page is built around one drawing, the production line, and everything
   else serves it: what the tools do and do not do, the lines the company
   holds, the questions people actually ask. Every sentence here is the
   client's own position or already in the repo. Nothing is added: no
   incident, no number, no date. The real sent-back episode has not been
   supplied and is not invented here either (CONTENT-NEEDED.md).
   ========================================================================== */

const DO_NOT = [
  "Decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  "Generate and publish anything automatically. Every output is directed, reviewed and approved by the team before publication.",
  "Replace the educational judgement of qualified people. Learning objectives, activities, language and child development stay with them.",
];

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
    a: "The work is revised and re-reviewed before it goes out. A release can be delayed to make that possible, and has been. Getting an episode right matters more to us than getting it out on the original date.",
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
      <Section className="!pb-0">
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

      {/* ═══ 2. THE PRODUCTION LINE. The spine. Full width, because seven
          stations with a face on each need the room, and because the drawing
          is the page's argument rather than an illustration beside it. ═══ */}
      <Section labelledBy="line-h">
        <Container width="wide">
          <Settle className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h2 id="line-h" className="t-h2 max-w-[18ch]">Six stages, and one place for the tools</h2>
            <ul className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted" aria-label="Key">
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

          <Settle className="mt-14 sm:mt-16">
            <ProductionLine />
          </Settle>

          <Settle className="mt-12 flex max-w-[64ch] gap-4">
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
          resolves them above. Set in type alone: the point is the words. ═══ */}
      <Section labelledBy="honest-h">
        <Container width="default">
          <Wipe>
            <h2 id="honest-h" className="t-h2 max-w-[22ch]">
              We would rather describe that accurately than flatter ourselves in either direction.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-0">
              <div className="md:pr-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Not handmade</p>
                <p className="t-lead mt-4 text-ink">Calling this work handmade would be untrue.</p>
                <p className="t-body mt-4 max-w-[40ch] text-body">
                  Runway and ElevenLabs sit inside final production, and this page says so by name.
                </p>
              </div>
              <div className="hairline pt-10 md:border-t-0 md:border-l md:border-l-rule md:pl-12 md:pt-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Not AI-generated</p>
                <p className="t-lead mt-4 text-ink">Calling it AI-generated would erase the people who actually make the decisions.</p>
                <p className="t-body mt-4 max-w-[40ch] text-body">
                  The story, the script, the direction, every review and the final approval are theirs.
                </p>
              </div>
            </div>
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 4. THE TOOLS. Named, with the one show frame on the page beside
          them: a frame is the honest exhibit of what the tools produce, and
          it is clearly the animated product, not a photograph of anything.
          The frame hangs off the right of the column the way the hero garden
          does on the home page, so the section is not two equal boxes. ═══ */}
      <Section labelledBy="tools-h">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-20">
            <Settle>
              <h2 id="tools-h" className="t-h2 max-w-[18ch]">What the tools do, and what they do not</h2>
              <Lead className="mt-5">
                Two platforms, both inside final production, neither operating on its own.
              </Lead>

              <dl className="mt-10">
                <div className="hairline grid gap-y-2 py-6 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] sm:gap-x-8">
                  <dt>
                    <span className="t-h3 block text-ink">Runway</span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Visual production</span>
                  </dt>
                  <dd className="t-body text-body">Supports elements of visual production and animation, to the script and direction set by the team.</dd>
                </div>
                <div className="hairline grid gap-y-2 py-6 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] sm:gap-x-8">
                  <dt>
                    <span className="t-h3 block text-ink">ElevenLabs</span>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Voice production</span>
                  </dt>
                  <dd className="t-body text-body">Supports elements of audio and voice production, reviewed for quality and suitability before release.</dd>
                </div>
              </dl>

              <div className="hairline pt-7">
                <h3 className="t-h3">Neither tool is used to</h3>
                <ul className="mt-4 space-y-3">
                  {DO_NOT.map((line) => (
                    <li key={line} className="flex gap-3.5">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                      <p className="t-body max-w-[58ch] text-body">{line}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="t-sm mt-8 max-w-[60ch] text-body">
                Naming the platforms does not imply that either provider endorses CLÉ Family Media. As
                the technology changes we will keep reviewing the platforms we use, their commercial
                terms, and how they align with our standards on intellectual property, consent and
                responsible production.
              </p>
            </Settle>

            <Wipe className="lg:pt-3">
              <figure>
                <Card className="tilt-b overflow-hidden p-2.5">
                  <Figure
                    asset="home.characters"
                    rounded="rounded-[var(--radius-md)]"
                    sizes="(min-width: 1024px) 40vw, 92vw"
                  />
                </Card>
                <figcaption className="t-sm mt-5 max-w-[46ch] text-body">
                  Finn and Fia, a frame from <em>The Pawsitive Pugs &amp; Pals®</em>. The visuals are
                  produced with Runway, to a story, script and direction set by people, and are
                  reviewed by the team before release.
                </figcaption>
              </figure>
            </Wipe>
          </div>
        </Container>
      </Section>

      {/* ═══ 5. THE LINES WE HOLD. Six commitments as a long read in hairline
          rows, not six icon cards: a principle is a sentence a reader holds
          the company to, and it is easier to hold someone to a sentence than
          to a pictogram. ═══ */}
      <Section labelledBy="lines-h">
        <Container width="text">
          <Settle>
            <h2 id="lines-h" className="t-h2">The lines we hold</h2>
            <Lead className="mt-5">The standards we hold ourselves to.</Lead>
          </Settle>
          <Settle as="ol" className="mt-12">
            {LINES.map((l) => (
              <li key={l.title} className="hairline grid gap-y-2 py-7 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-x-10">
                <h3 className="t-h3 max-w-[16ch]">{l.title}</h3>
                <p className="t-body text-body">{l.body}</p>
              </li>
            ))}
          </Settle>
        </Container>
      </Section>

      {/* ═══ 6. THE QUESTIONS PEOPLE ACTUALLY ASK ═══ */}
      <Section labelledBy="faq-h">
        <Container width="text">
          <Settle>
            <h2 id="faq-h" className="t-h2">The questions we are asked most</h2>
          </Settle>
          <Settle as="ul" className="mt-10 border-b border-b-rule">
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
          </Settle>
        </Container>
      </Section>

      {/* ═══ 7. THE COMMITMENT, the one deep band ═══ */}
      <Section deep labelledBy="commit-h">
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
