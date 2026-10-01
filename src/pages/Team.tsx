import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Card, Container, Kicker, Lead, Section, SectionHeading } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   Team and advisors.

   REWRITTEN 2026-10-01 from the client's own "Team Bio & Photos" handoff. Up to
   that point this page carried six seeded descriptions written here from the
   production sequence, every one flagged unconfirmed, and six empty photo
   frames. Everything below is now the client's own account of each person, cut
   down but never embellished: no claim appears here that the handoff does not
   make, and the honours, titles and institutions are theirs verbatim.

   Two things the handoff does not settle, both listed in QUESTIONS.md:
   Kirstie's surname, which it never gives, and the job titles for Lydia, Alan
   and Paula, which it leaves out while giving one for Conor, Kirstie and David.
   The titles below are the ones the company was already using.
   ========================================================================== */

interface Member {
  name: string;
  role: string;
  asset?: AssetKey;
  /* First line is the claim, the rest is the evidence for it. */
  bio: string[];
}

const TEAM: Member[] = [
  {
    name: "Conor Sexton",
    role: "Founder and CEO",
    asset: "person.conor",
    bio: [
      "Conor created The Pawsitive Pugs & Pals® and leads the company's strategy, commercial development, partnerships and audience research.",
      "He came to it from thirteen years in food retail, progressing from apprentice to head butcher. After a life-changing accident in 2020 he returned to education as a mature student, took a QQI Level 6 in Marketing with distinction, and is completing a Bachelor of Business in Marketing at Munster Technological University, where he also went through the Student Inc. programme.",
      "Becoming a father is what gave the company its purpose: building around what parents, educators and children actually need rather than around what the technology makes possible.",
    ],
  },
  {
    name: "Alan Compton",
    role: "Creative Director",
    asset: "person.alan",
    bio: [
      "Alan writes and directs. The look of the world, the performances and the pace of an episode are his call.",
      "He is an award-winning photographer and filmmaker with more than two decades across visual storytelling, design and creative direction, and over fifteen years in commercial film and television. He has worked with international NGOs and commercial clients across Africa, Europe, Asia, the Middle East and North America, on healthcare, humanitarian response and international development.",
      "His photography has been honoured several times at the Prix de la Photographie Paris, including Portrait Photographer of the Year, and his communications work with Nobody Left Outside won a SABRE Award. He has exhibited in London, Paris and Bangkok, most recently at the Royal Albert Hall as part of Nitin Sawhney's Journeys Festival.",
    ],
  },
  {
    name: "Paula Walshe PhD",
    role: "Education Director",
    asset: "person.paula",
    bio: [
      "Paula reviews the learning intent of every episode and the offline activities that follow it.",
      "She lectures in early childhood education at South East Technological University in Carlow. Her doctoral research was on STEM and STEAM in early childhood education, and her book Full STEAM Ahead is a practical guide to playful STEAM learning with young children.",
      "She co-chairs Ireland's Early Childhood STEAM Network, is a forum member of the Women in Digital European initiative, and sits on the EECERA College of Reviewers.",
    ],
  },
  {
    name: "Lydia Harding",
    role: "Executive Producer",
    asset: "person.lydia",
    bio: [
      "Lydia reads every script and every production from a parent's point of view, and from a child's.",
      "She has worked with children with intellectual disabilities, including through horse riding, where she saw how far confidence, communication and independence can go when a child is given the right support.",
      "Her brief here is inclusion: that every child has their own strengths, pace and way of understanding the world, and that an episode should help children recognise and respect difference rather than smooth it away.",
    ],
  },
  {
    name: "Kirstie",
    role: "Child Development Consultant",
    asset: "person.kirstie",
    bio: [
      "Kirstie checks that what gets made is age-appropriate and grounded in real early years practice.",
      "She has over thirty years of hands-on experience in childcare and early education, is qualified in Early Childhood Development and Education and is a fully qualified SNA. She has worked in Montessori and Steiner-based playgroups, outdoor preschools and community crèches.",
      "She is a mother of four grown children.",
    ],
  },
  {
    name: "Mansi",
    role: "Production Coordination",
    /* The one person in the review sequence the handoff sent no photograph or
       biography for. Listed rather than dropped, because she appears in the
       sequence on the home page and on Responsible AI. CONTENT-NEEDED.md. */
    bio: [
      "Mansi holds the schedule together, so that a note raised at one review stage reaches the people who have to act on it.",
    ],
  },
];

const ADVISORS: Member[] = [
  {
    name: "David Toth",
    role: "Strategic Advisor",
    asset: "person.david",
    bio: [
      "David shapes platform strategy and the low-stimulation media framework that connects screen time to real-world creativity, nature and offline play.",
      "He is a children's media professional specialising in educational rubrics, content strategy and creator coaching, with over two decades advising youth brands including Nickelodeon, LEGO and BBC Kids on content quality and platform safety.",
      "He has also managed global operations for animation properties at Warner Bros. Studios, including Cartoon Network and DC Entertainment.",
    ],
  },
];

/* A row, not a card in a grid. The biographies run to three paragraphs and a
   three-column grid of them is a wall; a row gives the portrait a fixed column
   and lets the prose set its own measure. */
function MemberRow({ m }: { m: Member }) {
  return (
    <li className="hairline grid grid-cols-[88px_1fr] items-start gap-x-7 gap-y-5 py-10 sm:grid-cols-[164px_1fr] sm:gap-x-10 lg:grid-cols-[200px_minmax(0,1fr)]">
      <div className="w-full">
        {m.asset ? (
          <Figure
            asset={m.asset}
            rounded="rounded-full"
            className="aspect-square"
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 164px, 88px"
          />
        ) : (
          /* No frame where there is no photograph. An empty circle on a page
             about named, answerable people reads as a missing person. */
          <span
            aria-hidden="true"
            className="well flex aspect-square w-full items-center justify-center rounded-full font-display text-[clamp(22px,4vw,34px)] text-muted"
          >
            {m.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="col-span-2 sm:col-span-1">
        <h3 className="t-h3">{m.name}</h3>
        <p className="eyebrow mt-2 !text-[11px]">{m.role}</p>
        <div className="mt-4 space-y-3.5">
          {m.bio.map((p, i) => (
            <p key={p.slice(0, 24)} className={i === 0 ? "t-body text-ink" : "t-body text-body"}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function Team() {
  return (
    <>
      <Seo
        title="Team and advisors"
        description="The people behind CLÉ Family Media: the core team who make and review every episode, and the strategic advisers who shape the educational model."
        path="/team"
      />

      <Section className="!pb-8">
        <Container width="wide">
          <Wipe className="max-w-[52rem]">
            <Kicker>Team and advisors</Kicker>
            <h1 className="t-h1 mt-5 max-w-[16ch]">The people making it</h1>
            <Lead className="mt-6">
              A small core team. Between them they decide what gets made, how it gets made and what
              it is supposed to do for the child watching. Everyone named here appears in the
              production and review sequence, not only on this page.
            </Lead>
          </Wipe>
        </Container>
      </Section>

      <Section className="!pt-6" labelledBy="core-h">
        <Container width="wide">
          <SectionHeading id="core-h" kicker="Core team" title="Who makes the work" />
          <ul className="mt-6">
            {TEAM.map((m) => (
              <Settle key={m.name} as="div">
                <MemberRow m={m} />
              </Settle>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="advisors-h">
        <Container width="wide">
          <Settle>
            <SectionHeading
              id="advisors-h"
              kicker="Strategic advisers"
              title="Input within a defined remit"
              lead="Advisers are not employees, and they are shown separately for exactly that reason. Each one is described only as they have approved it."
            />
          </Settle>
          <Settle className="mt-10">
            <Card className="px-6 sm:px-10">
              <ul>
                {ADVISORS.map((m) => (
                  <MemberRow key={m.name} m={m} />
                ))}
              </ul>
            </Card>
          </Settle>
        </Container>
      </Section>

      <Section deep labelledBy="team-cta-h">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="team-cta-h" className="t-h2 max-w-[18ch]">
                Every episode passes through these people before a child sees it
              </h2>
              <p className="t-lead mt-6 max-w-[46ch] opacity-85">
                The review sequence sets out what each stage checks, who is answerable for it, and
                where a release can be held back.
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-4 lg:justify-end">
              <Button to="/ethical-ai" variant="quiet">
                How we make it
                <IconArrow size={16} />
              </Button>
              <Button to="/contact" variant="quiet">
                Partnership enquiries
                <IconArrow size={16} />
              </Button>
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
