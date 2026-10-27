import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { RealDogs } from "@/components/story/RealDogs";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { MissionVideo } from "@/components/MissionVideo";
import { Wipe } from "@/components/Wipe";
import { TextLink, Button, Container, Section, Card } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE } from "@/lib/site";
import { useTeam } from "@/components/team/useTeam";
import { emphasis, useImageBlock, useBlock } from "@/lib/content";
import { COPY } from "@/components/story/copy";

/* ============================================================================
   The founder's story.

   WHAT THIS PAGE IS. A letter from Conor Sexton to someone weighing up the
   company: an investor, a broadcaster, an educator. It is in his voice, first
   person, and it has to answer one question, which is whether there is a real
   person and a real reason behind the name.

   THE OPENING IS THE HERO'S, 2026-10-27. The page used to open on a mounted
   portrait, a mono note and a display line at the right of a 16rem margin,
   with no picture and nothing of the home hero's frame; the garden, the
   strongest image this page owns, sat buried in the middle of the letter as a
   ShowFrame floating in paper. The garden is now the opening, in the hero's
   own frame (PageHero), with his name top left, the dek top right, the first
   line of the letter bottom left and the two routes out under it. The
   portrait stays where the letter signs off, on the deep band.

   THE DEVICE, unchanged and the reason the letter works. The margin. A reader
   like that skims first and reads second, so the letter is set the way an
   annotated one is: his prose runs in one measure, and a margin carries the
   things a skimmer is looking for. A rule runs down the inside edge of that
   margin for the length of the letter, and it breaks exactly where the page
   breaks its own measure.

   WHAT THE MARGIN CARRIES CHANGED, 2026-10-27. It carried a filing label
   ("Where it started", "Education, from the outset", "Building an
   alternative", "How it reaches you") over a grey mono note, and the client
   read that shape, repeated four times down one page, as the site's real
   problem. The sentence worth stopping for is now the heading: each section
   opens on the claim its own prose makes, and the note's fact is in the
   heading or was only restating it. Nothing of his was cut; a sentence that
   became a heading left the paragraph it came from so it is not read twice.

   THE DRAWINGS WENT THE SAME DAY. Four line sketches stood in or beside the
   letter (a child at a screen, a stack of screens, the squiggle script, the
   bluebell beside the pull quote). The client judged the sketch register weak
   against the real frames, so they are gone rather than restyled. Their
   component files stay in components/story for the record; nothing mounts
   them.

   FOUR MOMENTS still change the pace of a long read, and three of them are
   objects rather than sections:

     1. the pull quote, full width between two rules
     2. the eight photographs of the real dogs, straight after the frame from
        the series they were drawn for
     3. the route ledger, a slip of card laid across the top edge of the
        biography band, now on the LEFT so the band opens on its object
     4. the film, in a room of its own on the wall ground, with its one note
        on the right

   EVERY FACT HERE IS THE CLIENT'S. The ledger carries only what his own
   biography states: the trade, the one date he gives, the qualifications, the
   university, the programme, fatherhood. Nothing is ordered by a date he did
   not supply, and nothing is added. Every heading on the page is a sentence
   from the letter, or the docket's own two ends put together.
   ========================================================================== */

/* The route in, as the client's own biography lists it. The left column is a
   mono tag, the right is one sentence. No dates other than the one he gives. */
const LEDGER: { tag: string; line: string }[] = [
  { tag: "Food retail", line: "Thirteen years, from apprentice to head butcher." },
  { tag: "2020", line: "A life-changing accident ends that direction." },
  { tag: "Mature student", line: "Back to education, and the chance to build something new." },
  { tag: "QQI Level 6", line: "Marketing, with distinction." },
  { tag: "MTU", line: "Currently studying for a Bachelor of Business in Marketing." },
  { tag: "Student Inc.", line: "The programme at MTU I went through." },
  { tag: "A year of research", line: "Children's media, and an approach to a low-stimulation educational cartoon." },
  { tag: "CLÉ Family Media", line: "Founder and CEO." },
];

/* The four people the prose names, in the order it names them, are derived
   inside the component from useTeam() (see below). How an episode is made is
   linked, not restated: the Responsible AI page owns that account.

   DERIVED FROM people.ts, 2026-10-24. These were four hand-written rows and
   all four titles were stale the moment the client confirmed the real ones.
   READ THROUGH useTeam() SINCE 2026-10-27, so a portrait or a title changed
   in the admin's Team panel changes here too, and the bundled list still
   renders first and whenever the table is empty. */

/* Where the letter hands the reader. Three destinations, one line each, as
   rows on the deep band rather than cards. */
const NEXT: { href?: string; line: string; to?: string; title: string }[] = [
  { title: "The people who make it", line: "The full team and the advisory board, with their own biographies.", to: "/team" },
  { title: "How the work is made and reviewed", line: "The five phases an episode goes through, and where AI is and is not used.", to: "/ethical-ai" },
  { title: "The show itself", line: "Episodes and family activities live on the show's own site.", href: SITE.showUrl },
];

/* ----------------------------------------------------------------------------
   The margin grid. Margin left, prose centre, objects right.
   The margin is sticky on desktop so the heading stays with the paragraph it
   belongs to, which is a layout property and not motion.

   The rule lives on the prose column, not in the grid gap, because a rule drawn
   as a border on the MARGIN column stretches to the margin's own height and a
   sticky margin is short: it drew a 90px stub beside a 400px paragraph. On the
   prose column it is always exactly as long as the prose it is annotating.
   1.5px, like every rule on the site; it was the one 1px line left on it.

   THE MARGIN IS WIDER, 2026-10-27. It was 14rem at lg and 16rem at xl, which
   held a two word label. It now holds a sentence at t-h2 ("It started while I
   was minding a friend's four-year-old.") and at 16rem that sentence set in
   seven lines, taller than the paragraphs beside it. At 22rem it sets in four
   or five. The third track had the room to give: since the gap drawing left
   it, only the four faces and the characters frame stand in it, and they want
   about 22rem of the 34 it has at 1440.

   The prose track is 38rem flat rather than a fraction: 35rem is the measured
   width of the 56ch cap at the prose's own 17px, plus the 3rem the rule and its
   padding cost. A fractional track would have let the measure drift with the
   viewport, which is the thing the cap exists to stop.
---------------------------------------------------------------------------- */
function Spread({
  margin,
  aside,
  children,
  className = "",
}: {
  /** Optional: a paragraph that carries the letter on has no heading of its own. */
  margin?: ReactNode;
  /** Objects that belong beside the letter rather than inside it. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    /* Centred under 1024, where there is no margin column to sit against. A
       62ch block left aligned in an 836px tablet container left 300px of blank
       paper down the right of every screen. On a phone the cap is wider than
       the screen, so nothing changes there. */
    <Settle className={`mx-auto grid max-w-[62ch] gap-8 lg:max-w-none lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[22rem_38rem_minmax(0,1fr)] ${className}`}>
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="lg:border-l-[1.5px] lg:border-rule-soft lg:pl-12">
        {/* 56ch, not 62. Measured in the browser rather than guessed: the ch
            unit is the width of a zero, which in Hanken is wider than the
            average letter, so 62ch was setting 77 characters to the line and
            anything past about 75 reads cheap. 56ch lands at 69. */}
        <div className="max-w-[56ch] space-y-5 t-prose text-body">{children}</div>
      </div>
      {/* Spans both tracks on the two column step, where there is no third one
          to sit in, so it falls under the letter instead of beside it. Between
          1024 and 1280 a third track would have been 32 pixels wide. */}
      {aside && <div className="lg:col-span-2 xl:col-span-1">{aside}</div>}
    </Settle>
  );
}

/* A credit or a provenance note: a small right aligned mono line, the shape
   the home page uses under its own frames. `text-body`, not muted: muted is
   the floor of AA on the lightest paper and this line sits at the foot of a
   band, where the paper is at its lightest. */
function Credit({ children, className = "" }: { className?: string; children: ReactNode }) {
  return (
    <p className={`ml-auto max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body ${className}`}>
      {children}
    </p>
  );
}

export function Story() {
  /* The people the prose names, in the order the team list gives them, and
     Conor for the sign-off. `m.asset` is the marker for a portrait: the
     Figure needs the bundled asset for its frame even when an uploaded photo
     replaces the picture inside it. */
  const { team } = useTeam();
  const people = team.flatMap((m) =>
    m.asset && m.name !== "Conor Sexton" && m.name !== "Victoria Buchkova"
      ? [{ name: m.name, role: m.role, asset: m.asset, photo: m.photo ?? null }]
      : [],
  );
  const conor = team.find((m) => m.name === "Conor Sexton");

  /* EDITABLE FROM THE ADMIN, 2026-10-27. Every string below is the page's
     own wording (components/story/copy.ts) until a content_blocks row
     replaces it, so with nothing saved the letter reads exactly as written.
     The headline's accent clause is written between *stars*. */
  const heroEyebrow = useBlock("story", "hero.eyebrow", COPY["hero.eyebrow"]);
  const heroEyebrowSub = useBlock("story", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroAside = useBlock("story", "hero.aside", COPY["hero.aside"]);
  const heroTitle = useBlock("story", "hero.title", COPY["hero.title"]);
  const heroImage = useImageBlock("story", "hero.image");
  const sawHeading = useBlock("story", "saw.heading", COPY["saw.heading"]);
  const parentHeading = useBlock("story", "parent.heading", COPY["parent.heading"]);
  const hereHeading = useBlock("story", "here.heading", COPY["here.heading"]);
  const buildHeading = useBlock("story", "build.heading", COPY["build.heading"]);
  const filmHeading = useBlock("story", "film.heading", COPY["film.heading"]);
  const reachHeading = useBlock("story", "reach.heading", COPY["reach.heading"]);
  const nextHeading = useBlock("story", "next.heading", COPY["next.heading"]);
  const nextLead = useBlock("story", "next.lead", COPY["next.lead"]);

  return (
    <>
      <Seo
        title="Our story"
        description="Conor Sexton on why he founded CLÉ Family Media: the media young children encounter, becoming a parent, and building a practical alternative with creative and education specialists."
        path="/story"
      />

      {/* ═══ THE OPENING, in the hero's frame. The garden the series is set
          in, which was the page's mid-page plate until 2026-10-27, is now what
          the page opens on. The dek that sat under his portrait is the aside,
          the first line of the letter is the headline, and the credit says what
          the picture is, as every frame from the series does. Centre 45 per
          cent keeps the two pugs on the grass in frame at the hero's crop. ═══ */}
      <PageHero
        id="story-h"
        asset="story.garden"
        override={heroImage}
        position="center 45%"
        size="tall"
        credit={
          <>
            The garden the series is set in, with its rope swing. A frame from The Pawsitive Pugs
            &amp; Pals<sup className="text-[0.7em]">&reg;</sup>.
          </>
        }
        eyebrow={<>{heroEyebrow}<span>{heroEyebrowSub}</span></>}
        aside={<>{heroAside}</>}
        title={emphasis(heroTitle)}
        actions={
          <>
            <Button to="/team">Meet the team<IconArrow size={16} /></Button>
            <Button to="/contact" variant="quiet">Get in touch</Button>
          </>
        }
      />

      {/* ═══ THE LETTER. Three movements and the pull quote, in ONE section
          rather than three, because three sections meant three lots of 112px
          of padding doing nothing between four paragraphs of prose. Each
          movement's heading is the claim its paragraph makes. ═══ */}
      <Section labelledBy="saw-h" pad={["normal", "tight"]}>
        <Container width="wide">
          <Spread
            margin={
              /* Was "Where it started" over the note "Minding a friend's
                 four-year-old, before any of this was a company." The note's
                 fact is the heading now, in the letter's own words. */
              <h2 id="saw-h" className="t-h2">{sawHeading}</h2>
            }
          >
            <p>
              The idea for CL&Eacute; Family Media began while I was minding a friend's
              four-year-old son. He was watching YouTube when something came up that was not
              appropriate for his age. My fianc&eacute;e, Lydia, was pregnant with our little
              girl at the time.
            </p>
            <p>
              I spent a year researching children's media and developing an approach for a
              low-stimulation educational cartoon. I knew I could not build it alone, so I began
              bringing together people with the creative and educational experience the project
              needed.
            </p>
          </Spread>

          <Spread
            className="mt-16 sm:mt-[4.5rem]"
            margin={
              /* Was "Education, from the outset" over "The first person I
                 brought in, and why." The paragraph's last sentence is the
                 heading, so the paragraph no longer ends on it. */
              <h2 id="parent-h" className="t-h2">{parentHeading}</h2>
            }
          >
            <p>
              Paula was involved from the beginning. We had never met in person, but I spoke to
              her online and shared my vision and ambition. She wanted to be involved while the
              early work on production tools, pacing and voices was still taking shape.
            </p>
          </Spread>
        </Container>

        {/* MOMENT ONE. The measure breaks: the quote runs the full width
            between two rules, set in the display face with the quotation marks
            hung in red. The page's one display moment after the hero. The
            bluebell that grew beside it is gone with the other sketches. */}
        <Container width="wide" className="my-10 sm:my-14">
          <Wipe>
            <blockquote className="border-y-[1.5px] border-rule py-10 sm:py-14">
              <p className="t-h1 max-w-[26ch] pl-[0.45em] font-display text-ink [text-indent:-0.45em]">
                <span className="text-red-deep" aria-hidden="true">&ldquo;</span>
                I knew I could not build it alone, so I began bringing together people with the
                creative and educational experience the project needed.
                <span className="text-red-deep" aria-hidden="true">&rdquo;</span>
              </p>
            </blockquote>
          </Wipe>
        </Container>

        <Container width="wide">
          {/* No heading: this paragraph carries the letter on after the
              quote. The heap-of-sets drawing that stood beside it is gone. */}
          <Spread>
            <p>
              There was less of it than I expected. Plenty of shows were gentle. Plenty were
              educational. Very few were both, and fewer still would tell you anything about who
              had made them or who had checked them before they reached a child.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ THE REAL FINN AND FIA, on paper. The order is the argument: the
          drawn garden the page opened on, then the two dogs it was drawn for.
          Asked for by the client on 2026-10-24; see components/story/RealDogs.tsx
          for why each plate is framed the way it is. ═══ */}
      <Section labelledBy="dogs-h" pad="tight">
        <Container width="wide">
          <RealDogs headingId="dogs-h" />
        </Container>
      </Section>

      {/* ═══ HOW I GOT HERE. The changed ground: a sunken well, full width,
          and the one section of the letter that opens on its object. The
          route is a slip of card laid across the top edge of the band, tabbed
          and a fraction off true, on the LEFT since 2026-10-27, with the
          heading and the biography beside it. The heading is the docket's two
          ends put together, where it used to be a label over a grey lead.

          Muted and red are AA-large only on the sunken fill, so everything on
          the band itself is body or ink; the card is raised paper, where muted
          is safe again. Added from the client's own biography; every line is
          his. ═══ */}
      <Section labelledBy="here-h" className="well">
        <Container width="wide">
          {/* The card column is wide on purpose. At 27rem every ledger line
              wrapped to two and the sheet ran 640px tall beside 600px of
              prose, with a 290px hole between them. At 37rem most lines set in
              one, the sheet is a third shorter, and the gutter reads as a
              gutter instead of as a gap nobody filled.

              The card is first in the grid at lg and second in the DOM, so a
              phone reads the heading before the ledger it summarises. */}
          <Settle className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,33rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,37rem)_minmax(0,1fr)] xl:gap-16">
            <div className="lg:order-last">
              <h2 id="here-h" className="t-h1 max-w-[16ch]">{hereHeading}</h2>
              <div className="mt-7 max-w-[56ch] space-y-4 t-prose text-body">
                <p className="text-ink">
                  I spent thirteen years in food retail, starting as an apprentice and finishing
                  as head butcher. It is not the background anyone expects behind a children's
                  media company, and I would not trade it.
                </p>
                <p>
                  You learn quickly what people actually want when they are standing in front of
                  you, and you learn to run a counter that does not fall apart on a Saturday.
                </p>
                <p>
                  A life-changing accident in 2020 ended that direction. I went back to education
                  as a mature student instead, took a QQI Level 6 in Marketing with distinction,
                  and I am studying for a Bachelor of Business in Marketing at Munster
                  Technological University, where I also went through the Student Inc. programme.
                </p>
                <p className="text-ink">
                  Returning to education gave me the opportunity to build something new.
                </p>
              </div>
            </div>

            {/* The slip of card. -mt is bigger than the band's own padding on
                purpose, so the sheet crosses the edge and sits half on the
                paper above and half on the well: .bleed-up alone stops 26px
                short of the boundary once the band's padding is counted, which
                reads as a card that nearly lines up rather than one laid down
                by hand. */}
            <div className="card-stock tilt-b relative self-start px-5 pb-5 pt-7 sm:px-7 sm:pb-7 sm:pt-8 lg:-mt-28">
              <span className="card-tab uppercase">The short version</span>
              <ol>
                {LEDGER.map((row) => (
                  <li
                    key={row.tag}
                    className="hairline grid grid-cols-1 gap-x-6 gap-y-0.5 py-3 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
                  >
                    <span className="tnum font-mono text-[14.5px] leading-[1.7] tracking-[0.01em] text-muted">{row.tag}</span>
                    <span className="text-[15.5px] leading-[1.6] text-ink">{row.line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ BUILDING AN ALTERNATIVE. Opens on the paragraph's own first
          sentence, full width over the three tracks, because a ten word
          heading does not set in a margin: the margin keeps the route to the
          process page. The object column carries the four faces the prose
          names, so "people who knew far more than I did" has people in it, and
          the characters appear once beside the paragraph that introduces them:
          supporting cast, on this site. ═══ */}
      <Section labelledBy="build-h" pad="tight">
        <Container width="wide">
          <Settle>
            <h2 id="build-h" className="t-h2 max-w-[22ch]">
              {buildHeading}
            </h2>
          </Settle>
          <Spread
            className="mt-10 sm:mt-12"
            margin={
              <TextLink to="/ethical-ai">How an episode is made<IconArrow size={15} /></TextLink>
            }
            /* The four faces and the frame stand in the object column, at the
               size they were drawn for, beside the paragraph that names them.
               They were in a 224px margin and at the right edge of the measure
               respectively until 2026-10-24. */
            aside={
              <div className="lg:max-w-[22rem] xl:max-w-none">
                <ul className="space-y-4">
                  {people.map((p) => (
                    <li key={p.name} className="flex items-center gap-3.5">
                      <div className="w-[52px] shrink-0">
                        <Figure asset={p.asset} override={p.photo} rounded="rounded-[7px]" className="aspect-square" sizes="52px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold leading-tight text-ink">{p.name}</p>
                        <p className="mt-1 font-mono text-[14px] leading-[1.65] tracking-[0.02em] text-muted">{p.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <figure className="mt-9">
                  <Card className="card-still tilt-a overflow-hidden p-2">
                    <Figure asset="home.characters" rounded="rounded-[var(--radius-md)]" sizes="(min-width: 1280px) 420px, 352px" />
                  </Card>
                  {/* `text-body`, not muted. Measured after the frame moved
                      into this column: muted is #6b4e3a, and at the foot of
                      this band the paper has washed down to #d4c5a8, where it
                      comes out at 4.45:1 against a 4.5 floor. Body is 6.74:1
                      on the same stop. Right aligned, like every credit. */}
                  <figcaption className="ml-auto mt-3 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
                    Finn and Fia, with a hen. A frame from the series.
                  </figcaption>
                </figure>
              </div>
            }
          >
            <p>
              The company came together around people who knew far more than I did: Alan on the
              creative side, who writes the scripts, directs and sets the pace of an episode;
              Paula on the educational side, who brings the learning expertise and reads every
              draft; Lydia, Kirstie and David bringing the parent, early years and industry
              perspectives that catch details which may be missed during production.
            </p>
            <p>
              That work became <em>The Pawsitive Pugs &amp; Pals</em>, our first original series.
              Finn, the fawn pug, and Fia, the black pug, came out of it. The learning was built
              in from the start rather than added once the scripts were finished, which is a
              slower way to make a show and, as far as we can tell, the only way to make
              this one.
            </p>
            <p>
              Being a small studio is not something we are apologising for. The people who set
              the story are the same people who read every draft of it, and the work goes round
              between us until we are all happy with it. That is worth more to me than volume.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ MOMENT FOUR. The film, in a room of its own. The one section of
          this page that is not a letter is the one section whose note is on
          the right, on the wall ground rather than the paper: the reader feels
          the change of register before reading a word of it. The heading names
          a film, which is the one label the page keeps.

          It used to run the full 1376px of the wide container, which made it
          774px tall and left the page with a single enormous rectangle and
          nothing beside it. At 1030px it is still the largest thing on the
          page and its note has somewhere to be. ═══ */}
      <Section labelledBy="film-h" className="wall">
        <Container width="wide">
          <Settle className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-x-14">
            <div>
              <h2 id="film-h" className="t-h2 max-w-[18ch]">{filmHeading}</h2>
              <MissionVideo className="mt-7" eager />
            </div>
            {/* Not sticky, unlike the letter's margin. There is no long column
                of prose here for a heading to track, and a sticky note beside a
                600px film just slides about for no reason. A credit line, not
                a grey block: right aligned, on the film's own axis at lg. */}
            <div className="lg:pt-12">
              <Credit className="lg:ml-0 lg:max-w-[30ch]">
                The film starts muted. Turn the sound on when you are ready to, and the captions
                are there whether you do or not. Nothing on this site starts talking at you.
              </Credit>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ HOW IT REACHES YOU. No margin track: the heading runs the width
          of the page over the two paragraphs set side by side, and the two
          routes out sit under them. Was "How it reaches you" over the mono
          line "Watch. Play. Learn."; the heading is now what the paragraphs
          say, free on YouTube now and the player in development. ═══ */}
      <Section labelledBy="reach-h" pad="tight">
        <Container width="wide">
          <Settle>
            <h2 id="reach-h" className="t-h2 max-w-[20ch]">
              {reachHeading}
            </h2>
            <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-x-14">
              <p className="max-w-[56ch] t-prose text-body">
                The model is Watch, Play, Learn, and it is more literal than it sounds. Our Watch,
                Play, Learn approach connects calm stories with interactive games, creative tasks
                and practical activities children can explore beyond the screen. Each episode
                introduces ideas children can then explore through games and practical activities.
              </p>
              <p className="max-w-[56ch] t-prose text-body">
                In practice, families find us free on YouTube, which is simply where
                discovery happens for a series like ours. The show's own site is where the
                episodes and the family activities properly live, and we are building a product
                experience to support ad-free viewing and the offline activities together. That
                is in development rather than available, and we will say so plainly until the day
                it is not.
              </p>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-3">
              <li>
                <TextLink href={SITE.showUrl}>The show's own site<IconExternal size={14} /></TextLink>
              </li>
              <li>
                {/* One span: TextLink is an inline-flex with a gap, so a bare
                    <sup> beside the name became its own item with a gap
                    before it, and the mark floated off the word. */}
                <TextLink to="/app">
                  <span>{SITE.playerName}<sup className="text-[0.7em]">&trade;</sup>, in development</span>
                  <IconArrow size={15} />
                </TextLink>
              </li>
            </ul>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE SIGN-OFF, on the one deep band. A letter ends with a name and
          an address, so this one does: his, and three places the reader can
          go to check what he has said. Rows, not cards. The portrait that
          opened the page until 2026-10-27 lives here now, and only here. ═══ */}
      <Section deep labelledBy="next-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-[56px] shrink-0">
                  <Figure asset="person.conor" override={conor?.photo ?? null} rounded="rounded-[var(--radius-sm)]" className="aspect-square" sizes="56px" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold">Conor Sexton</p>
                  <p className="eyebrow eyebrow-sm mt-1">Founder and CEO</p>
                </div>
              </div>
              <h2 id="next-h" className="t-h2 mt-8 max-w-[16ch]">{nextHeading}</h2>
              <p className="t-lead mt-5 max-w-[42ch] opacity-85">{nextLead}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/contact">Send an enquiry<IconArrow size={16} /></Button>
              </div>
            </div>

            <ul className="border-t-[1.5px] border-edge-dark">
              {NEXT.map((n) => {
                const inner = (
                  <>
                    <span className="min-w-0">
                      <span className="block text-[17px] font-semibold">{n.title}</span>
                      <span className="t-body mt-1 block max-w-[44ch] opacity-80">{n.line}</span>
                    </span>
                    <span className="mt-1 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
                      {n.href ? <IconExternal size={16} /> : <IconArrow size={16} />}
                    </span>
                  </>
                );
                const cls = "group flex items-start justify-between gap-6 py-5";
                return (
                  <li key={n.title} className="border-b-[1.5px] border-edge-dark">
                    {n.to ? (
                      <Link to={n.to} className={cls}>{inner}</Link>
                    ) : (
                      <a href={n.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </Settle>
        </Container>
      </Section>
    </>
  );
}

/* App.tsx lazy-loads the default; the named export is the one the admin run's
   registry checks for. Same component. */
export default Story;
