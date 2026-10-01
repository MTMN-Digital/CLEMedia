import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Button, Container, Kicker, Lead, Panel, Section, SectionHeading } from "@/components/ui";
import { Settle } from "@/components/Settle";
import { IconArrow, IconCheck, IconHands, IconHuman, IconLearn, IconLock, IconResearch } from "@/components/icons";
import { EthicsOrbit, HumanLedDiagram, PawTrail, WaveDivider } from "@/components/graphics";

/** The two platforms currently in use, named because vagueness reads worse. */
const TOOLS = [
  { name: "Runway", role: "Supports elements of visual production and animation." },
  { name: "ElevenLabs", role: "Supports elements of audio and voice production." },
];

const PRINCIPLES = [
  {
    icon: IconHands,
    title: "Human creativity comes first",
    body:
      "Characters, stories, educational objectives, scripts and creative direction all begin with people. Tools can help bring those ideas to screen. They do not decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  },
  {
    icon: IconCheck,
    title: "Human oversight at every stage",
    body:
      "Using AI does not remove responsibility. Our team reviews, directs and refines the work throughout production. Outputs are not automatically generated and published.",
  },
  {
    icon: IconLock,
    title: "Protecting original IP",
    body:
      "The Pawsitive Pugs & Pals®, its characters and its world are original intellectual property. We do not intentionally use AI to reproduce the identifiable style, characters or IP of other creators or children's brands. The aim is to build our own world, not imitate somebody else's.",
  },
  {
    icon: IconHuman,
    title: "Children's interests come before technology",
    body:
      "The fact that technology can do something does not mean we should. Decisions are guided by the child's experience first: calm, age-appropriate content that moves a child beyond passive viewing into play, conversation and offline learning.",
  },
  {
    icon: IconLearn,
    title: "Education requires human judgement",
    body:
      "Educational content deserves more than an automated check. Decisions about learning objectives, activities, language and child development stay with qualified people.",
  },
  {
    icon: IconResearch,
    title: "Transparency matters",
    body:
      "We will not pretend AI is absent from our process. Equally, calling our programmes simply AI-generated misrepresents the human development, direction and review involved. We prefer a clearer description, which is the line at the top of this page.",
  },
];

const FAQ = [
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

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <Panel className="overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-4 p-6 text-left text-[16px] font-semibold text-ink"
        >
          {q}
          <span
            aria-hidden="true"
            className="ml-auto shrink-0 text-red-deep transition-transform duration-300"
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          >
            <IconArrow size={18} />
          </span>
        </button>
      </h3>
      {open && (
        <p className="border-t border-hairline/60 px-6 pb-6 pt-4 text-[14.5px] leading-relaxed text-slate">
          {a}
        </p>
      )}
    </Panel>
  );
}

export default function EthicalAi() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Seo
        title="Responsible AI"
        description="Human-led children's media, produced with the responsible support of AI-enabled technology. How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production workflow, and who reviews the work before release."
        path="/ethical-ai"
      />

      <Section className="!pb-10">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <Kicker>Responsible AI</Kicker>
              <h1 className="mt-5 t-h1 font-display">
                Human-led. AI-enabled. Built responsibly.
              </h1>
              <Lead className="mt-6">
                Technology should expand what a creative team can achieve, not replace the people,
                judgement and responsibility behind children's content. AI-enabled production tools
                let a small independent studio make ambitious original work. Our team stays
                accountable for every decision and every release.
              </Lead>
            </div>
            <Settle>
              <EthicsOrbit className="mx-auto w-full max-w-[380px] drift-slow" />
            </Settle>
          </div>
        </Container>
      </Section>

      {/* The position, stated plainly */}
      <Section tone="cream" className="!py-14" labelledBy="position-h">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <h2 id="position-h" className="t-h2 font-display">Our position</h2>
            <div className="max-w-[62ch] space-y-5 font-body">
              <p className="font-display t-h3 leading-snug text-ink">
                AI is a production tool. People remain responsible for the work.
              </p>
              <p>
                Our creative and educational decisions are made by people. In final production we
                use Runway for visual production and ElevenLabs for voice production. Our team
                directs, reviews and approves the work before publication.
              </p>
              <p className="text-ink">
                We would rather describe that accurately than flatter ourselves in either direction.
                Calling this work handmade would be untrue. Calling it AI-generated would erase the
                people who actually make the decisions.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Tools, named */}
      <Section className="!py-14" labelledBy="tools-h">
        <Container>
          <SectionHeading
            id="tools-h"
            kicker="The tools"
            title="What we currently use, by name"
            lead="Two platforms, both inside final production, neither operating on its own."
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Settle as="li" key={t.name}>
                <Panel className="h-full p-7">
                  <h3 className="font-display t-h3 text-ink">{t.name}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-slate">{t.role}</p>
                </Panel>
              </Settle>
            ))}
          </ul>
          <p className="mt-6 max-w-[64ch] text-[13.5px] text-deep">
            Naming the platforms does not imply that either provider endorses CLÉ Family Media.
          </p>
        </Container>
      </Section>

      {/* The sequence */}
      <Section tone="cream" labelledBy="process-h">
        <Container>
          <SectionHeading
            id="process-h"
            kicker="The workflow"
            title="Six stages, each with a person accountable for it"
          />
          <div className="mt-12">
            <HumanLedDiagram />
          </div>
          <p className="mt-7 max-w-[62ch] text-[14px] text-deep">
            People sit at both ends of this sequence. The tools sit in the middle, and only in the
            middle.
          </p>
        </Container>
      </Section>

      {/* Principles */}
      <Section labelledBy="principles-h" className="relative overflow-hidden">
        <PawTrail className="pointer-events-none absolute -right-10 top-8 h-[240px] w-[320px] text-clay/20" />
        <Container className="relative">
          <SectionHeading
            id="principles-h"
            kicker="Our principles"
            title="The standards we hold ourselves to"
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <Settle as="li" key={p.title}>
                <Panel className="h-full p-7">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-white/70 text-red-deep ">
                    <p.icon size={21} />
                  </span>
                  <h3 className="t-h3">{p.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate">{p.body}</p>
                </Panel>
              </Settle>
            ))}
          </ul>
        </Container>
      </Section>

      <div className="text-[#F3E7D6]"><WaveDivider /></div>

      {/* FAQ */}
      <Section tone="cream" labelledBy="faq-h" className="!pt-10">
        <Container>
          <SectionHeading id="faq-h" kicker="Questions" title="The ones we are asked most" />
          <div className="mt-8 grid max-w-[62rem] gap-4">
            {FAQ.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Commitment */}
      <Section labelledBy="commit-h">
        <Container>
          <div className="max-w-[60ch]">
            <Kicker>Our commitment</Kicker>
            <h2 id="commit-h" className="mt-4 t-h2 font-display">
              The technology will keep changing. The responsibility will not.
            </h2>
            <p className="mt-5 t-lead leading-relaxed">
              As the company grows we will keep reviewing our practice around human creative
              authorship, intellectual property and commercial rights, performer and voice consent,
              tool selection, transparency with audiences and partners, child safety, educational
              integrity, and making sure technology supports rather than replaces meaningful human
              creativity.
            </p>
            <p className="mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-ink">
              If something here does not satisfy you, whether you are a parent, an educator or a
              distribution partner, we would genuinely rather have the conversation than have you
              assume.
            </p>
            <Button to="/contact" className="mt-8">
              Get in touch
              <IconArrow size={17} />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
