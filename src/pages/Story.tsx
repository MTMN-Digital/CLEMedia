import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { ShowFrame } from "@/components/ShowFrame";
import { RealDogs } from "@/components/story/RealDogs";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { MissionVideo } from "@/components/MissionVideo";
import { Bluebell } from "@/components/graphics";
import { TheGap } from "@/components/story/TheGap";
import { Hooks } from "@/components/story/Hooks";
import { Thread } from "@/components/story/Thread";
import { Stage } from "@/components/render";
import { Wipe } from "@/components/Wipe";
import { TextLink, Button, Container, Section, Card } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE } from "@/lib/site";
import { TEAM } from "@/components/team/people";

/* ============================================================================
   The founder's story.

   WHAT THIS PAGE IS. A letter from Conor Sexton to someone weighing up the
   company: an investor, a broadcaster, an educator. It is in his voice, first
   person, and it has to answer one question, which is whether there is a real
   person and a real reason behind the name.

   THE DEVICE, unchanged and the reason this page works. The margin. A reader
   like that skims first and reads second, so the page is set the way an
   annotated letter is: his prose runs in one measure, and a margin carries the
   things a skimmer is looking for (the section, the names, the faces, the route
   in and the route out), in mono. A hairline runs down the inside edge of that
   margin for the whole length of the letter, and it is the page's one quiet
   detail: it breaks exactly where the page breaks its own measure, so the shape
   of the argument is readable in the left edge alone.

   FOUR MOMENTS, raised from two on 2026-10-06. The page was 7,170px tall with
   the pull quote and the garden as the only changes of pace in a very long
   read, which meant eight or nine screens of one rhythm. The two new ones are
   objects rather than sections, so nothing was added to the page to make them:

     1. the pull quote, full width between two rules
     2. the garden, edge to edge
     3. the route ledger, now a slip of card laid across the top edge of the
        biography band rather than a second list in a second margin. The margin
        was doing the same job twice, which is what made the middle of the page
        read as a repeat of its own opening.
     4. the film, in a room of its own on the wall ground, with the margin
        flipped to the right. The one section that is not a letter is the one
        section whose margin is on the other side.

   AND IT IS DENSER. Padding between the letter's movements came down from a
   full section gap to 72px, the garden band from 760px to 620px at its tallest,
   the film from the full container width to the width it needs with its notes
   beside it, and the sign-off rows from 56px to 40px. No sentence of his was
   cut: every word on the page on 2026-10-02 is still on it.

   EVERY FACT HERE IS THE CLIENT'S. The ledger carries only what his own
   biography states: the trade, the one date he gives, the qualifications, the
   university, the programme, fatherhood. Nothing is ordered by a date he did
   not supply, and nothing is added.
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

/* The four people the prose names, in the order it names them. How an episode
   is made is linked, not restated: the Responsible AI page owns that account.

   DERIVED FROM people.ts, 2026-10-24. These were four hand-written rows and
   all four titles were stale the moment the client confirmed the real ones. */
const PEOPLE = TEAM.flatMap((m) =>
  m.asset && m.name !== "Conor Sexton" && m.name !== "Victoria Buchkova"
    ? [{ name: m.name, role: m.role, asset: m.asset }]
    : [],
);

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

   ── A THIRD TRACK, 2026-10-24 ──────────────────────────────────────────────
   The letter used to run in its own 1024px box, centred in the viewport, while
   the garden, the dogs, the biography band and the film beside it all ran at
   the 1560 cap. Five changes of left edge down one page, and none of them
   agreed with the header, which starts its own content 208px further left. The
   letter now starts where the header starts, like everything else.

   Aligning it that way frees about 450px down the right, and the page already
   had three objects with nowhere good to be: the four faces and the gap drawing
   were squeezed into a 224px margin that was also carrying a heading and a
   note, and the characters frame was pushed to the right edge of a 560px
   measure. They go in the third track. The prose measure itself did not move,
   because 69 characters is already right.

   The two drawings the text WRAPS around (the hooks, the thread) deliberately
   stay in the prose. Their whole job is to interrupt the measure, and a drawing
   parked in a column beside the text interrupts nothing.

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
  /** Optional: the gap drawing's spread has no heading to carry. */
  margin?: ReactNode;
  /** Objects that belong beside the letter rather than inside it. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    /* Centred under 1024, where there is no margin column to sit against. A
       62ch block left aligned in an 836px tablet container left 300px of blank
       paper down the right of every screen, which is the exact complaint this
       pass exists to answer. On a phone the cap is wider than the screen, so
       nothing changes there. */
    <Settle className={`mx-auto grid max-w-[62ch] gap-8 lg:max-w-none lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[16rem_38rem_minmax(0,1fr)] ${className}`}>
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="lg:border-l lg:border-[var(--color-rule-soft)] lg:pl-12">
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

/* A line in the margin. Mono, small, muted: muted clears AA on every paper
   stop, and the margin never sits on the well.
   The width caps are lg-only on purpose. Under 1024px there is no margin
   column, the note is a full width line above the prose, and a 26ch cap there
   set a four word column down the left of a phone. */
function Note({ children, className = "" }: { className?: string; children: ReactNode }) {
  return <p className={`font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-muted ${className}`}>{children}</p>;
}

export default function Story() {
  return (
    <>
      <Seo
        title="Our story"
        description="Conor Sexton on why he founded CLÉ Family Media: the media young children encounter, becoming a parent, and building a practical alternative with creative and education specialists."
        path="/story"
      />

      {/* ═══ MASTHEAD. The margin is established in the first screen rather
          than at the second heading: his portrait, his name and the dek sit in
          the margin column, and the headline starts on the prose axis the rest
          of the letter is set to. Before this the masthead ran edge to edge in
          the wide container while the letter ran in the default one, so the
          page had two different left edges in its first two screens. ═══ */}
      <Section pad={["tight", "none"]}>
        <Container width="wide">
          <Settle className="mx-auto grid max-w-[62ch] gap-8 lg:max-w-none lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-end lg:gap-x-12 xl:grid-cols-[16rem_minmax(0,1fr)]">
            <div>
              <div className="flex items-center gap-4 lg:block">
                {/* Width on the wrapper: Figure's own w-full beats a width in
                    className, which is a Tailwind ordering trap. */}
                {/* A MOUNTED PRINT, not a circle. The contract has said
                    "portraits are rounded squares, never circles" since the
                    sitepass-w2 run and this page had three of them, which is
                    the same six people rendered two ways on one site. It is
                    also the letter's only object, so it stands on a ledge
                    under the room's lamp like every other portrait here. */}
                <div className="w-[88px] shrink-0 sm:w-[100px] lg:w-[128px]">
                  <Stage seated ground="ledge" light={-34} tilt={5.4} turn={-1.2} roll={-0.3} depth={0.5}>
                    <div className="rk-mat">
                      <div className="rk-pic">
                        <Figure asset="person.conor" priority rounded="rounded-none" className="aspect-square" sizes="128px" />
                        <span className="rk-light" aria-hidden="true" />
                      </div>
                    </div>
                  </Stage>
                </div>
                <div className="lg:mt-5">
                  <p className="text-[16px] font-semibold text-ink">Conor Sexton</p>
                  <p className="eyebrow eyebrow-sm mt-1.5">Founder and CEO</p>
                </div>
              </div>
              <Note className="mt-5 lg:max-w-[26ch]">
                On what he saw, what he could not find, and what it took to build the alternative.
              </Note>
            </div>
            <div className="lg:border-l lg:border-[var(--color-rule-soft)] lg:pl-12">
              <h1 className="t-display max-w-[15ch]">I did not set out to start a media company.</h1>
            </div>
          </Settle>
          {/* The rule takes the same cap as the masthead above it. Left at the
              container width it ran 140px past the centred block on a tablet
              and underlined nothing. */}
          <div className="hairline mx-auto mt-12 max-w-[62ch] sm:mt-14 lg:max-w-none" />
        </Container>
      </Section>

      {/* ═══ THE LETTER. Three movements and the pull quote, in ONE section
          rather than three, because three sections meant three lots of 112px
          of padding doing nothing between four paragraphs of prose. ═══ */}
      <Section labelledBy="saw-h" pad="tight">
        <Container width="wide">
          <Spread
            margin={
              <>
                <h2 id="saw-h" className="t-h2">Where it started</h2>
                <Note className="mt-4 lg:max-w-[26ch]">Minding a friend's four-year-old, before any of this was a company.</Note>
              </>
            }
          >
            {/* The prose runs AROUND the first drawing rather than beside
                it: the hooks float right of the opening paragraph and the
                second paragraph carries on around them. See
                components/story/Hooks.tsx. */}
            <div className="wrap-flow space-y-5">
              <p>
                <Hooks />
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
            </div>
          </Spread>

          <Spread
            className="mt-16 sm:mt-[4.5rem]"
            margin={
              <>
                <h2 id="parent-h" className="t-h2">Education, from the outset</h2>
                <Note className="mt-4 lg:max-w-[26ch]">The first person I brought in, and why.</Note>
              </>
            }
          >
            <p>
              Paula was involved from the beginning. We had never met in person, but I spoke to
              her online and shared my vision and ambition. She wanted to be involved while the
              early work on production tools, pacing and voices was still taking shape. Education
              was part of the project from the outset.
            </p>
          </Spread>
        </Container>

        {/* MOMENT ONE. The measure breaks: the quote runs the full width
            between two rules, set in the display face with the quotation marks
            hung in red. Not a box with a coloured edge, which is what it was. */}
        <Container width="wide" className="my-10 sm:my-14">
          <Wipe>
            {/* The letter's one drawn moment. The bluebell is the show's own
                world, it was drawn for this project in graphics.tsx and never
                mounted anywhere, and it is the only ornament on this page.
                It grows beside the line rather than sitting on top of it. */}
            <blockquote className="grid items-center gap-7 border-y border-rule py-10 sm:py-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
              <Bluebell size={132} className="story-bell hidden text-red-deep lg:block" />
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
          {/* The drawing of the sentence sits in the object column, not in the
              margin. "Plenty were gentle, plenty were educational, very few
              were both" is a shape before it is a sentence, and in a 224px
              margin the heap of sets it is drawn as was smaller than the
              paragraph's own first word. See components/story/TheGap.tsx. */}
          <Spread aside={<TheGap />}>
            <p>
              There was less of it than I expected. Plenty of shows were gentle. Plenty were
              educational. Very few were both, and fewer still would tell you anything about who
              had made them or who had checked them before they reached a child.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ MOMENT TWO. The garden: the world the company built, and the
          one moment where the letter stops and shows the reader something. It
          ran edge to edge until 2026-10-13, where the band kept 65 percent of
          the frame at 1440 and 48 percent at 1920; see ShowFrame.tsx. Captioned
          as what it is, a frame from the show and not a photograph. ═══ */}
      <ShowFrame
        asset="story.garden"
        caption={
          <>
            The garden the series is set in, with its rope swing. A frame from The Pawsitive Pugs
            &amp; Pals&reg;.
          </>
        }
      />

      {/* ═══ THE REAL FINN AND FIA, on paper, straight after the frame from
          the series. The order is the argument: the drawn garden, then the two
          dogs it was drawn for. Asked for by the client on 2026-10-24; see
          components/story/RealDogs.tsx for why each plate is labelled. ═══ */}
      <Section labelledBy="dogs-h" pad="tight">
        <Container width="wide">
          <RealDogs headingId="dogs-h" />
        </Container>
      </Section>

      {/* ═══ HOW I GOT HERE. The changed ground: a sunken well, full width.
          MOMENT THREE is the route itself, which is no longer a second list in
          a second margin but a slip of card laid across the top edge of the
          band, tabbed and a fraction off true. The margin was carrying a
          heading, a note, four faces AND a ledger across the page, so the
          middle of the letter read as a repeat of its own opening.

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
              gutter instead of as a gap nobody filled. */}
          <Settle className="mx-auto grid max-w-[62ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,37rem)] xl:gap-14">
            <div>
              <h2 id="here-h" className="t-h1 max-w-[12ch]">How I got here</h2>
              <p className="t-lead mt-6 max-w-[42ch] text-ink">
                I spent thirteen years in food retail, starting as an apprentice and finishing as
                head butcher. It is not the background anyone expects behind a children's media
                company, and I would not trade it.
              </p>
              <div className="mt-5 max-w-[56ch] space-y-4 t-prose text-body">
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
                    <span className="tnum font-mono text-[12px] leading-[1.7] tracking-[0.01em] text-muted">{row.tag}</span>
                    <span className="text-[15.5px] leading-[1.6] text-ink">{row.line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ BUILDING AN ALTERNATIVE. The object column carries the four faces
          the prose names, so "people who knew far more than I did" has people
          in it, and the characters appear once beside the paragraph that
          introduces them: supporting cast, on this site. Both of them were in
          the margin and the prose respectively until 2026-10-24; see the note
          on `Spread` for why they moved and what the margin keeps. ═══ */}
      <Section labelledBy="build-h" pad="tight">
        <Container width="wide">
          <Spread
            margin={
              <>
                <h2 id="build-h" className="t-h2">Building an alternative</h2>
                <div className="mt-5">
                  <TextLink to="/ethical-ai">How an episode is made<IconArrow size={15} /></TextLink>
                </div>
              </>
            }
            /* The four faces and the frame both moved out of the letter on
               2026-10-24. The faces were under a heading in a 224px margin, at
               40px each with their roles wrapping to three lines; the frame was
               pushed to the right edge of a 560px measure at `sm:ml-auto`,
               where it read as a paragraph that had been nudged aside rather
               than as the one picture in this part of the page. Both of them
               now stand in the object column, at the size they were drawn for,
               beside the paragraph that names them. */
            aside={
              <div className="lg:max-w-[22rem] xl:max-w-none">
                <ul className="space-y-4">
                  {PEOPLE.map((p) => (
                    <li key={p.name} className="flex items-center gap-3.5">
                      <div className="w-[52px] shrink-0">
                        <Figure asset={p.asset} rounded="rounded-[7px]" className="aspect-square" sizes="52px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold leading-tight text-ink">{p.name}</p>
                        <Note className="mt-1 text-[11px]">{p.role}</Note>
                      </div>
                    </li>
                  ))}
                </ul>
                <figure className="mt-9">
                  <Card className="card-still tilt-a overflow-hidden p-2">
                    <Figure asset="home.characters" rounded="rounded-[var(--radius-md)]" sizes="(min-width: 1280px) 420px, 352px" />
                  </Card>
                  {/* `text-body`, not the page's muted `Note`. Measured after
                      the frame moved into this column: muted is #6b4e3a, and
                      at the foot of this band the paper has washed down to
                      #d4c5a8, where it comes out at 4.45:1 against a 4.5
                      floor. It passed where the frame used to sit, 200px
                      higher up the same band. Body is 6.74:1 on the same
                      stop. The token's own note in index.css calls muted "the
                      floor", and this is where the floor gives way. */}
                  <figcaption className="mt-2.5 pl-1 font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-body">
                    Finn and Fia, with a hen. A frame from the series.
                  </figcaption>
                </figure>
              </div>
            }
          >
            <p>
              I could not have made this on my own, and I did not try. The company came
              together around people who knew far more than I did: Alan on the creative side,
              who writes the scripts, directs and sets the pace of an episode; Paula on the
              educational side, who brings the learning expertise and reads every draft; Lydia,
              Kirstie and David bringing the parent, early years and industry perspectives that
              catch details which may be missed during production.
            </p>
            {/* The second drawing the prose runs around: the script with the
                learning stitched through it from the first line, floated
                left so the page zigzags, drawing left then the frame right.
                See components/story/Thread.tsx. */}
            <div className="wrap-flow">
              <p>
                <Thread />
                That work became <em>The Pawsitive Pugs &amp; Pals</em>, our first original series.
                Finn, the fawn pug, and Fia, the black pug, came out of it. The learning was built
                in from the start rather than added once the scripts were finished, which is a
                slower way to make a show and, as far as we can tell, the only way to make
                this one.
              </p>
            </div>
            <p>
              Being a small studio is not something we are apologising for. The people who set
              the story are the same people who read every draft of it, and the work goes round
              between us until we are all happy with it. That is worth more to me than volume.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ MOMENT FOUR. The film, in a room of its own. The one section of
          this page that is not a letter is the one section whose margin is on
          the right, on the wall ground rather than the paper: the reader feels
          the change of register before reading a word of it.

          It used to run the full 1376px of the wide container, which made it
          774px tall and left the page with a single enormous rectangle and
          nothing beside it. At 1030px it is still the largest thing on the
          page and its notes have somewhere to be. ═══ */}
      <Section labelledBy="film-h" className="wall">
        <Container width="wide">
          <Settle className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-x-14">
            <div>
              <h2 id="film-h" className="t-h2 max-w-[18ch]">The mission, in his own words</h2>
              <MissionVideo className="mt-7" eager />
            </div>
            {/* Not sticky, unlike the letter's margin. There is no long column
                of prose here for a heading to track, and a sticky note beside a
                600px film just slides about for no reason. */}
            <div className="lg:pt-12">
              <p className="font-mono text-[12px] leading-[1.7] tracking-[0.02em] text-body lg:max-w-[30ch]">
                The film starts muted. Turn the sound on when you are ready to, and the captions
                are there whether you do or not. Nothing on this site starts talking at you.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ HOW IT REACHES YOU ═══ */}
      <Section labelledBy="reach-h" pad="tight">
        <Container width="wide">
          <Spread
            margin={
              <>
                <h2 id="reach-h" className="t-h2">How it reaches you</h2>
                <Note className="mt-4">Watch. Play. Learn.</Note>
                <ul className="mt-5 space-y-3">
                  <li>
                    <TextLink href={SITE.showUrl}>The show's own site<IconExternal size={14} /></TextLink>
                  </li>
                  <li>
                    <TextLink to="/app">{SITE.playerName}, in development<IconArrow size={15} /></TextLink>
                  </li>
                </ul>
              </>
            }
          >
            <p>
              The model is Watch, Play, Learn, and it is more literal than it sounds. Our Watch,
              Play, Learn approach connects calm stories with interactive games, creative tasks
              and practical activities children can explore beyond the screen. Each episode
              introduces ideas children can then explore through games and practical activities.
            </p>
            <p>
              In practice, families find us free on YouTube, which is simply where
              discovery happens for a series like ours. The show's own site is where the
              episodes and the family activities properly live, and we are building a product
              experience to support ad-free viewing and the offline activities together. That
              is in development rather than available, and we will say so plainly until the day
              it is not.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ THE SIGN-OFF, on the one deep band. A letter ends with a name and
          an address, so this one does: his, and three places the reader can
          go to check what he has said. Rows, not cards. ═══ */}
      <Section deep labelledBy="next-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-[56px] shrink-0">
                  <Figure asset="person.conor" rounded="rounded-[var(--radius-sm)]" className="aspect-square" sizes="56px" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold">Conor Sexton</p>
                  <p className="eyebrow eyebrow-sm mt-1">Founder and CEO</p>
                </div>
              </div>
              <h2 id="next-h" className="t-h2 mt-8 max-w-[16ch]">Interested in working with us?</h2>
              <p className="t-lead mt-5 max-w-[42ch] opacity-85">
                I would rather answer your questions directly than have you guess at them from a
                website.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/contact">Send an enquiry<IconArrow size={16} /></Button>
              </div>
            </div>

            <ul className="border-t border-white/20">
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
                  <li key={n.title} className="border-b border-white/20">
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
