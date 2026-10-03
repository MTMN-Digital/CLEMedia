import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Card, Container, Kicker, Section, TextLink } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The founder's story, rebuilt 2026-10-02.

   WHAT THIS PAGE IS. A letter from Conor Sexton to someone weighing up the
   company: an investor, a broadcaster, an educator. It is in his voice, first
   person, and it has to answer one question, which is whether there is a real
   person and a real reason behind the name.

   THE DEVICE. The margin. A reader like that skims first and reads second, so
   the page is set the way an annotated letter is: his prose runs in one
   measure down the right, and a margin on the left carries the things a
   skimmer is looking for (the section, the names, the faces, the route in and
   the route out), in mono. Twice the margin empties and the page breaks its
   own measure: once for the pull quote, which runs the full width of the page
   as a statement between two rules, and once for the garden, edge to edge.
   The biography sits on a changed ground, a sunken well, with the facts of
   his route set as a ledger beside the prose.

   The earlier version was a single 65ch column with a sticky table of
   contents, which is a blog post. Nothing in it was wrong; it just never
   changed pace.

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
  { tag: "Mature student", line: "Back to education, choosing again from the beginning." },
  { tag: "QQI Level 6", line: "Marketing, with distinction." },
  { tag: "MTU", line: "A Bachelor of Business in Marketing at Munster Technological University, now being finished." },
  { tag: "Student Inc.", line: "The programme at MTU I went through." },
  { tag: "A father", line: "The question stops being interesting and becomes urgent." },
  { tag: "CLÉ Family Media", line: "Founder and CEO." },
];

/* The four people the prose names, in the order it names them. Six review
   stages exist and are linked, not restated: the Responsible AI page owns them. */
const PEOPLE: { name: string; role: string; asset: AssetKey }[] = [
  { name: "Alan Compton", role: "Creative Director", asset: "person.alan" },
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula" },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia" },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie" },
];

/* Where the letter hands the reader. Three destinations, one line each, as
   rows on the deep band rather than cards. */
const NEXT: { title: string; line: string; to?: string; href?: string }[] = [
  { title: "The people who make it", line: "The full team and the advisory board, with their own biographies.", to: "/team" },
  { title: "How the work is made and reviewed", line: "The six stages an episode passes through, and where AI is and is not used.", to: "/ethical-ai" },
  { title: "The show itself", line: "Episodes and family activities live on the show's own site.", href: SITE.showUrl },
];

/* ----------------------------------------------------------------------------
   The margin grid. Margin left, prose right, stacked on anything under 1024px.
   The margin is sticky on desktop so the heading stays with the paragraph it
   belongs to, which is a layout property and not motion.
---------------------------------------------------------------------------- */
function Spread({
  margin,
  children,
  className = "",
}: {
  margin: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Settle className={`grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-24 ${className}`}>
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="max-w-[62ch] space-y-6 text-[17px] leading-[1.72] text-body">{children}</div>
    </Settle>
  );
}

/* A line in the margin. Mono, small, muted: muted clears AA on every paper
   stop, and the margin never sits on the well. */
function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
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

      {/* ═══ OPENING. His first line, at display size, with the byline set
          against it rather than under it. The portrait is the only image above
          the fold: a first-person piece opens on the person. ═══ */}
      <Section className="!pb-0">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-end lg:gap-16">
            <div>
              <Kicker>Our story</Kicker>
              <h1 className="t-display mt-6 max-w-[15ch]">I did not set out to start a media company.</h1>
            </div>
            <div className="lg:pb-2">
              <div className="flex items-center gap-5">
                {/* Width on the wrapper: Figure's own w-full beats a width in
                    className, which is a Tailwind ordering trap. */}
                <div className="w-[84px] shrink-0 sm:w-[96px]">
                  <Figure asset="person.conor" priority rounded="rounded-full" className="aspect-square" sizes="96px" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-ink">Conor Sexton</p>
                  <p className="eyebrow mt-1.5 !text-[11px]">Founder and CEO</p>
                </div>
              </div>
              <p className="t-body mt-6 max-w-[36ch] text-body">
                On what he saw, what he could not find, and what it took to build the alternative.
              </p>
            </div>
          </Settle>
          <div className="hairline mt-14 sm:mt-20" />
        </Container>
      </Section>

      {/* ═══ WHAT I SAW ═══ */}
      <Section labelledBy="saw-h" className="!pt-14 sm:!pt-16">
        <Container>
          <Spread
            margin={
              <>
                <h2 id="saw-h" className="t-h2">What I saw</h2>
                <Note className="mt-4 max-w-[26ch]">Beside a small child, before any of this was a company.</Note>
              </>
            }
          >
            <p>
              I started paying proper attention to children's media the way most people do, by
              sitting beside a small child who was watching it. What struck me was the speed.
              Cuts every second or so. Colours turned up past anything in the real world. A new
              hook arriving before the last one had finished landing.
            </p>
            <p>
              None of it was malicious. You could see the logic plainly enough: attention is
              what gets measured, so attention is what gets designed for. But watching a child
              come off forty minutes of it, wired and brittle and somehow tired at the same
              time, I could not accept that this was simply how children's content had to work.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ BECOMING A PARENT. The one paragraph, then the page breaks its
          own measure: the pull quote runs the full width between two rules,
          set in the display face with the quotation marks hung in red. Not a
          box with a coloured edge, which is what it was. Then the measure
          resumes with an empty margin. ═══ */}
      <Section labelledBy="parent-h" className="!pt-0">
        <Container>
          <Spread
            margin={
              <>
                <h2 id="parent-h" className="t-h2">Becoming a parent</h2>
                <Note className="mt-4 max-w-[26ch]">What I went looking for, and how little of it there was.</Note>
              </>
            }
          >
            <p>
              Becoming a parent changes the question from an interesting one into an urgent one.
              It stops being about media in general and becomes about the specific twenty
              minutes in front of you, and whether you are glad about them afterwards.
            </p>
          </Spread>
        </Container>

        <Container width="wide" className="my-14 sm:my-20">
          <Wipe>
            <blockquote className="border-y border-rule py-10 sm:py-14 lg:py-16">
              <p className="t-h1 max-w-[26ch] pl-[0.45em] font-display text-ink [text-indent:-0.45em]">
                <span className="text-red-deep" aria-hidden="true">&ldquo;</span>
                I was not looking for something to keep her quiet. I was looking for something I
                would be glad she had watched.
                <span className="text-red-deep" aria-hidden="true">&rdquo;</span>
              </p>
            </blockquote>
          </Wipe>
        </Container>

        <Container>
          <Spread margin={<span className="hidden lg:block" aria-hidden="true" />}>
            <p>
              So I went looking, and there was less of it than I expected. Plenty of shows were
              gentle. Plenty were educational. Very few were both, and fewer still would tell
              you anything about who had made them or who had checked them before they reached
              a child.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ THE GARDEN. Edge to edge and taller than it is wide on a phone,
          because this is the world the company built and a thumbnail in a
          text column says the opposite. Captioned as what it is: a frame from
          the show, not a photograph. ═══ */}
      <Section className="!py-0" as="div">
        <Wipe>
          <figure>
            <div className="h-[clamp(320px,56vw,760px)] overflow-hidden">
              <Figure
                asset="story.garden"
                fill
                rounded="rounded-none"
                position="center 62%"
                sizes="100vw"
              />
            </div>
            <Container width="wide">
              <figcaption className="pt-4">
                <Note>The garden the series is set in, with its rope swing. A frame from The Pawsitive Pugs &amp; Pals&reg;.</Note>
              </figcaption>
            </Container>
          </figure>
        </Wipe>
      </Section>

      {/* ═══ HOW I GOT HERE. The changed ground: a sunken well, full width,
          with his route set as a ledger beside the prose. Muted and red are
          AA-large only on this fill, so everything here is body or ink.
          Added from the client's own biography; every line is his. ═══ */}
      <Section labelledBy="here-h" className="well">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
            <div>
              <h2 id="here-h" className="t-h1 max-w-[12ch]">How I got here</h2>
              <p className="t-lead mt-8 max-w-[44ch] text-ink">
                I spent thirteen years in food retail, starting as an apprentice and finishing as
                head butcher. It is not the background anyone expects behind a children's media
                company, and I would not trade it.
              </p>
              <div className="mt-6 max-w-[56ch] space-y-5 text-[17px] leading-[1.72] text-body">
                <p>
                  You learn quickly what people actually want when they are standing in front of
                  you, and you learn to run a counter that does not fall apart on a Saturday.
                </p>
                <p>
                  A life-changing accident in 2020 ended that direction. I went back to education
                  as a mature student instead, took a QQI Level 6 in Marketing with distinction,
                  and I am finishing a Bachelor of Business in Marketing at Munster Technological
                  University, where I also went through the Student Inc. programme.
                </p>
                <p className="text-ink">
                  So the company is not a pivot from somewhere adjacent. It is the thing I built
                  once I had to choose again from the beginning.
                </p>
              </div>
            </div>

            <div className="lg:pt-3">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-body">The short version</p>
              <ol className="mt-4">
                {LEDGER.map((row) => (
                  <li
                    key={row.tag}
                    className="hairline grid grid-cols-1 gap-x-8 gap-y-1 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:py-5"
                  >
                    <span className="tnum font-mono text-[13px] leading-[1.6] text-body">{row.tag}</span>
                    <span className="text-[16px] leading-[1.6] text-ink">{row.line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ BUILDING AN ALTERNATIVE. The margin carries the four faces the
          prose names, so "people who knew far more than I did" has people in
          it. The characters appear once, small, as a placed object beside the
          paragraph that introduces them: supporting cast, on this site. ═══ */}
      <Section labelledBy="build-h">
        <Container>
          <Spread
            margin={
              <>
                <h2 id="build-h" className="t-h2">Building an alternative</h2>
                <ul className="mt-6 space-y-3.5">
                  {PEOPLE.map((p) => (
                    <li key={p.name} className="flex items-center gap-3">
                      <div className="w-[44px] shrink-0">
                        <Figure asset={p.asset} rounded="rounded-full" className="aspect-square" sizes="44px" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold leading-tight text-ink">{p.name}</p>
                        <Note className="mt-0.5 !text-[11px]">{p.role}</Note>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <TextLink to="/ethical-ai">The six review stages<IconArrow size={15} /></TextLink>
                </div>
              </>
            }
          >
            <p>
              I could not have made this on my own, and I did not try. The company came
              together around people who knew far more than I did: Alan on the creative side,
              who writes and directs and sets the pace of an episode; Paula on the educational
              side, who reviews the learning intent before a script exists; Lydia and Kirstie
              bringing the parent and early years perspectives that catch what a production read
              misses.
            </p>
            <p>
              <em>The Pawsitive Pugs &amp; Pals</em> is our first original series. Finn, the fawn
              pug, and Fia, the black pug, came out of that work. The learning was built in from
              the start rather than added once the scripts were finished, which is a slower way
              to make a show and, as far as we can tell, the only way to make this one.
            </p>
            <figure className="!mt-9 w-[min(100%,340px)] sm:ml-auto">
              <Card className="card-still tilt-b overflow-hidden p-2">
                <Figure
                  asset="home.characters"
                  rounded="rounded-[var(--radius-md)]"
                  sizes="340px"
                />
              </Card>
              <figcaption className="mt-3 pl-1">
                <Note>Finn and Fia, with a hen. A frame from the series.</Note>
              </figcaption>
            </figure>
            <p className="!mt-9">
              Being a small studio is not something we are apologising for. It means the people
              who set the story are the same people who check it before release, and that any
              of them can hold a release back. That is worth more to me than volume.
            </p>
          </Spread>
        </Container>
      </Section>

      {/* ═══ HOW IT REACHES YOU ═══ */}
      <Section labelledBy="reach-h" className="!pt-0">
        <Container>
          <Spread
            margin={
              <>
                <h2 id="reach-h" className="t-h2">How it reaches you</h2>
                <Note className="mt-4">Watch. Play. Learn.</Note>
                <ul className="mt-6 space-y-3">
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
              The model is Watch, Play, Learn, and it is more literal than it sounds. Watch an
              episode together. Pause for a movement or a breathing prompt. Then carry on with a
              printable or an educator-designed activity, away from the screen entirely. The
              episode is the beginning of the thing, not the whole of it.
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
      <Section deep labelledBy="next-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-[56px] shrink-0">
                  <Figure asset="person.conor" rounded="rounded-full" className="aspect-square" sizes="56px" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold">Conor Sexton</p>
                  <p className="eyebrow mt-1 !text-[11px]">Founder and CEO</p>
                </div>
              </div>
              <h2 id="next-h" className="t-h2 mt-10 max-w-[16ch]">If you are weighing up the company</h2>
              <p className="t-lead mt-6 max-w-[42ch] opacity-85">
                I would rather answer your questions directly than have you guess at them from a
                website.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/contact">Send an enquiry<IconArrow size={16} /></Button>
              </div>
            </div>

            <ul className="border-t border-white/20">
              {NEXT.map((n) => {
                const inner = (
                  <>
                    <span className="min-w-0">
                      <span className="block text-[17px] font-semibold">{n.title}</span>
                      <span className="t-body mt-1.5 block max-w-[44ch] opacity-80">{n.line}</span>
                    </span>
                    <span className="mt-1 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
                      {n.href ? <IconExternal size={16} /> : <IconArrow size={16} />}
                    </span>
                  </>
                );
                const cls = "group flex items-start justify-between gap-6 py-6 sm:py-7";
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
