import { Seo, organizationJsonLd } from "@/components/Seo";
import { NotifyForm } from "@/components/NotifyForm";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { HeroFilm } from "@/components/home/HeroFilm";
import { Wipe } from "@/components/Wipe";
import { type Episode } from "@/components/home/EpisodeSlate";
import { FilmStrip } from "@/components/home/FilmStrip";
import { Stage } from "@/components/render/Stage";
import { CallSheet } from "@/components/home/CallSheet";
import { EpisodeRings } from "@/components/home/EpisodeRings";
import {
  Button, Container, Kicker, Lead, Section,
} from "@/components/ui";
import { IconArrow, IconMail } from "@/components/icons";

/* ============================================================================
   THE RULE THIS PAGE WAS REBUILT ON.

   Five real images exist in public/brand/: the felted CLÉ mark, the felted
   Pawsitive Pugs wordmark, the hen and pugs, the tree swing, the bluebells.
   An earlier version of this page used NONE of them, and rendered nine empty
   placeholder frames instead, including a placeholder for the felted wordmark
   that is already in the repo. That is why the page read as a blank sheet.

   So: the artwork is the content. It is used large and full bleed, because
   that is how pawsitivepugs.com carries its own pages. And an empty frame is
   never rendered on this page. Where an asset is missing, the section is built
   from what exists instead, and the gap is listed in CONTENT-NEEDED.md.

   ──────────────────────────────────────────────────────────────────────────
   THE SHAPE, added 2026-10-06.

   The page was ten thousand pixels of one silhouette: eight sections, every
   one of them a heading with rows or cards under it, every one at the same
   1560px container, almost all of them on the same cream. Blur the text and
   four of them were indistinguishable.

   It now runs: a full-bleed frame, then ONE tall band on the deeper wall that
   holds the whole argument (the thesis and the three stages, as a set page
   rather than as two sections), then the two big objects the page already had
   and never bettered (the film, then the filmstrip running off the right
   edge), then the call sheet, the six sign-off slips standing on a shelf in
   a lit room, then the AI position on the wall at display size, then the navy
   close. Updated 2026-10-09: the call sheet stopped being a third copy of the
   team's faces, and the AI band stopped being the quietest block on the page.

   Removed rather than restyled:
     - the second garden picture. The page opens on a full-bleed garden frame
       and then showed a smaller crop of the same garden twelve hundred pixels
       later. /story owns the swing-tree print.
     - the six-row running order. It was the third copy of one idea on the
       site, and the faces underneath it were the same six people again. The
       two are one list now; see CallSheet.
   ========================================================================== */

/* The three stages moved into EpisodeArc.tsx with the drawing they label,
   so the words and the marks they sit on cannot drift apart. */

/* Titles and synopses are the show's own, from its site. Runtime, age range and
   theme are not known and are not invented. */
/* Episode numbers, titles and runtimes are the REAL ones, read off the felted
   title slates and the YouTube metadata, not off the show site's section
   ordering, which lists them in a different sequence. The Strawberry is 002 and
   Chicken Vision is 003; the show site implies the reverse. Runtimes are the
   actual durations. */
const EPISODES: Episode[] = [
  { n: "001", title: "The Feather", runtime: "9:16", asset: "slate.ep1",
    href: "https://www.youtube.com/watch?v=duMH0f12JM0",
    line: "A drifting feather leads Finn and Fia on a garden adventure where slowing down helps them discover the hidden beauty of the tiny world around them." },
  { n: "002", title: "The Strawberry", runtime: "11:10", asset: "slate.ep2",
    href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0",
    line: "After a rainy night in the garden, Finn and Fia help a tiny field mouse reach a strawberry just out of reach." },
  { n: "003", title: "Chicken Vision", runtime: "10:41", asset: "slate.ep3",
    href: "https://www.youtube.com/watch?v=CpgIzsn500Q",
    line: "Finn and Fia meet a hen who sees the garden differently, and discover the world can look magical in many different ways." },
  { n: "004", title: "The Cuckoo's Incredible Journey", runtime: "9:58", asset: "slate.ep4",
    href: "https://www.youtube.com/watch?v=yHYYBpMfE6M",
    line: "Finn and Fia go on a new adventure and meet a cuckoo who has travelled a very long way to get back to the garden." },
];


export default function Home() {

  return (
    <>
      <Seo
        title="Home"
        description="CLÉ Family Media makes calm, purposeful children's media. Watch, Play, Learn: stories built to move a child off the screen and into play, made by a named team who each review every episode before it is released."
        path="/"
        jsonLd={organizationJsonLd}
      />

      {/* ═══ 1. HERO. The mission film, full bleed, muted, with the copy over
          it and sound one press away. It was a rendered studio set until the
          client's own people asked for the film, the way consulting.ie and
          m.ind.coach open. See HeroFilm. ═══ */}
      <HeroFilm />

      {/* The garden, edge to edge, as the horizon the rest of the page sits
          under. It does not drift: one thing moving against a fixed ground is
          an object, two things moving against each other is a scroll effect.

          The caption is not decoration. This is a frame from the animation,
          not a photograph of a real garden, and a company whose Responsible AI
          page turns on being straight about how the work is made cannot put an
          uncaptioned rendered image at the top of its home page. It is also
          the page's first use of the registered mark. */}
      <Section as="div" pad="none">
        {/* The caption sits ON the frame. It used to have a band of its own
            below the image: a strip of bare paper carrying one right-aligned
            mono line and nothing else, which read as a stray label floating
            between two sections. A caption belongs on the thing it captions. */}
        <div className="relative h-[clamp(260px,44vw,620px)] overflow-hidden">
          <Figure
            asset="home.hero"
            fill
            rounded="rounded-none"
            position="center 46%"
            priority
            sizes="100vw"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent pb-4 pt-16 sm:pb-5">
            <Container width="wide">
              <p className="text-right font-mono text-[11px] uppercase tracking-[0.16em] text-[#f3ece0]">
                A frame from The Pawsitive Pugs &amp; Pals<sup className="text-[0.7em]">®</sup>
              </p>
            </Container>
          </div>
        </div>
      </Section>

      {/* ═══ 2. THE ARGUMENT, on the wall.

          One band, two movements, and the page's only change of room. The
          thesis and the three stages used to be two sections of the same
          height on the same ground, and the second of them spent a tall
          photograph and six hundred pixels of empty bottom-right to say three
          short things. Together on the deeper ground they are the centre of
          gravity the page did not have: a display line at the top of the
          band, the argument set in three columns under a rule, and the model
          as three panels divided by hairlines, which is a printed page rather
          than three cards.

          The wall is a stop deeper than the paper and no deeper: measured, the
          first version of this surface put body copy at 3.2:1. See index.css.
          ═══ */}
      <Section labelledBy="thesis-h" pad={["normal", "none"]} className="wall">
          <Container width="wide">
            {/* A SPREAD, not a lone eyebrow over an empty half.
                The eyebrow and the display line used to sit at the left with
                the whole right of the band empty beside them, and the best
                sentence on the page was buried as the third of three columns
                underneath, wearing a coloured left border, which is a card
                tell in its own right. The line now answers the headline
                across the band, which is what it is for, and the argument
                below is two columns rather than three. */}
            <Wipe className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end xl:gap-x-24">
              <div>
                <Kicker>What we believe</Kicker>
                <h2 id="thesis-h" className="t-display mt-6 max-w-[17ch]">
                  We are not going to tell anyone their child watches too much television.
                </h2>
              </div>
              <p className="max-w-[26ch] font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] leading-[1.14] tracking-[-0.01em] text-red-deep lg:pb-2">
                We would rather make the episode the beginning of the thing than the whole of it.
              </p>
            </Wipe>

            <Settle className="hairline mt-14 grid gap-x-12 gap-y-8 pt-10 md:grid-cols-2 lg:gap-x-24">
              <p className="t-lead text-body">
                The gap we saw is narrower than that. Not enough content made at a child's pace,
                with genuine educational intent, and with a clear account of who made it and who
                checked it.
              </p>
              <p className="t-lead text-body">
                Much of what fills the market is fast and loud, built around how long a child keeps
                watching rather than what they take away from it. Attention is what gets measured,
                so attention is what gets designed for.
              </p>
            </Settle>
          </Container>
      </Section>

      {/* ═══ 2b. THE MODEL, drawn.
          Three concepts before this one. Three equal columns under `01` `02`
          `03` in mono (the retired numbered eyebrow and the row of three
          identical cards, in one block). Then a stroke running out of the
          screen onto paper, which drew the wrong subject: the episode does not
          travel. Then concentric rings, which put the screen at the CENTRE of
          the child's world, and the company's own pull quote says it is the
          beginning of the thing rather than the whole of it, which is an edge.
          It is a floor seen from above now: the screen at the top edge, the
          child's own prints leading away from it, and the episode's sun turned
          up again in crayon on a printed sheet at the far end. Not one word of
          the client's three sentences was cut.
          See src/components/home/EpisodeRings.tsx. ═══ */}
      <Section labelledBy="model-h" pad={["tight", "normal"]} className="wall">
        <Container width="wide">
          <Wipe className="grid gap-x-16 gap-y-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <h2 id="model-h" className="t-h2 max-w-[14ch]">One episode, three stages</h2>
            <Lead className="lg:pb-1">
              Designed to move a child from the screen into play and conversation, rather than to
              hold them in front of it.
            </Lead>
          </Wipe>

          <EpisodeRings />
        </Container>
      </Section>

      {/* ═══ 3. THE SERIES. A filmstrip, because perforated stock IS the
          trade. The felted show wordmark is a photograph of a real object on a
          lit felt backdrop, so it cannot be knocked out the way the CLE mark
          was. It is staged instead: leaned back on the ledge under the same
          lamp as the plates below it.

          The strip then runs off the right edge of the page. Boxed inside the
          container it stopped dead at a hard vertical edge mid-slate, which
          reads as a clipping bug rather than as film continuing. ═══ */}
      {/* ON THE BENCH. Perforated film on a dark warm ground is a light table,
          which is where film is actually looked at, and the one place on this
          page where the slates and the staged wordmark have something to be
          lit against. On paper the whole band was tan objects on tan. */}
      <Section labelledBy="series-h" pad={["open", "normal"]} className="bench">
        <Container width="wide">
          {/* The wordmark beside the heading rather than above it: stacked, the
              header block was four hundred pixels tall before a slate arrived.

              Two things had to change before this object read as anything at
              all. The file is cream felt lettering on a cream felt ground with
              a third of the frame empty around it, so at the 288px the stage
              gave it the lettering was about 150px wide and the whole thing
              photographed as a blank tan panel. It is cropped to the object
              (the backdrop's own padding is up to 48px a side, so the stage
              has to be about a hundred wider than the object you want) and
              given a column wide enough to read. Knocking it out of its
              background was tried first and is not possible: unlike the CLÉ
              mark it is lit felt on felt, and a chroma key on it eats the
              letters. */}
          <Wipe className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-end">
            <div className="w-full max-w-[32rem]">
              <Stage backdrop rake ground="ledge" tilt={5} depth={0.6} light={-28}>
                <div className="aspect-[3.1] overflow-hidden rounded-[var(--radius-sm)]">
                  <Figure
                    asset="brand.show"
                    fill
                    rounded="rounded-none"
                    position="center 46%"
                    sizes="(min-width: 1024px) 420px, 88vw"
                  />
                </div>
              </Stage>
            </div>
            <div className="lg:pb-2">
              <h2 id="series-h" className="t-h2 max-w-[16ch]">Our first original series</h2>
              <Lead className="mt-4">
                The Pawsitive Pugs &amp; Pals. Finn, the fawn pug, and Fia, the black pug, in a
                garden that rewards slowing down. Four episodes released so far, nine to eleven
                minutes each.
              </Lead>
            </div>
          </Wipe>
        </Container>

        {/* The filmstrip stays: perforated stock IS the trade, and the rail
            running off both edges is the one piece of this page that already
            read as authored. The studio wall render built alongside it is kept
            in src/components/render for a page that needs a still, lit set of
            objects; it is not mounted here, because the same four plates
            cannot stand twice on one page. */}
        <div className="mt-14">
          <FilmStrip episodes={EPISODES} />
        </div>
      </Section>

      {/* ═══ 4. WHO CHECKS IT. The sequence, not the staff list: see
          CallSheet for what it replaced and why. ═══ */}
      <Section labelledBy="people-h" pad={["tight", "normal"]}>
        <Container width="wide">
          <CallSheet headingId="people-h" />
        </Container>
      </Section>

      {/* ═══ 5. THE AI POSITION. The site's single most important trust
          claim, and it used to be the quietest block on the page: an h2 over
          a plain card of paragraphs on the sunken ground. It now gets the
          page's second display line and a room of its own on the wall.

          Weight comes from type and from being specific, never from a figure.
          There is no statistic, badge or certification to show, and the page
          that argues about honesty is the worst place on this site to invent
          one. What it has is a sentence nobody else in the category says out
          loud, set large, and the facts it rests on (which tools, at which
          point, and who signs off) set as a record beside it. Every word below
          was already on this page; it is rearranged, not added to.

          The record is a FLAT card: it is a block of reading, so it is never
          posed on a Stage. ═══ */}
      <Section labelledBy="ai-h" pad="open" className="wall">
        <Container width="wide">
          <Settle>
            <Kicker>Responsible AI</Kicker>
            <h2 id="ai-h" className="t-display mt-6 max-w-[17ch]">
              AI is a production tool. People remain responsible for the work.
            </h2>
          </Settle>

          <Settle className="hairline mt-14 grid gap-x-16 gap-y-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-x-20">
            {/* The honesty sentence, as the band's pull line. Ink at full
                strength on the wall, at a size set by the face rather than by
                a tint. */}
            <div>
              <p className="border-l-2 border-red pl-6 font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.375rem)] leading-[1.18] text-ink">
                Calling this work handmade would be untrue. Calling it AI-generated would erase the
                people who actually make the decisions.
              </p>
              <div className="mt-10 pl-6">
                <Button to="/ethical-ai" variant="quiet">
                  Read the full position<IconArrow size={16} />
                </Button>
              </div>
            </div>

            <div className="card-stock p-8 pt-9 sm:p-10 sm:pt-11">
              <span className="card-tab" aria-hidden="true">POSITION</span>
              <dl className="divide-y divide-rule">
                <div className="pb-6">
                  <dt className="eyebrow eyebrow-sm">Decisions</dt>
                  <dd className="t-lead mt-2 text-ink">
                    Our creative and educational decisions are made by people.
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="eyebrow eyebrow-sm">In final production</dt>
                  <dd className="t-body mt-2 text-body">
                    Runway for visual production. ElevenLabs for voice production.
                  </dd>
                </div>
                <div className="pt-6">
                  <dt className="eyebrow eyebrow-sm">Before publication</dt>
                  <dd className="t-body mt-2 text-body">
                    Our team directs, reviews and approves the work. Nothing is generated and
                    published automatically.
                  </dd>
                </div>
              </dl>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 6. CONTACT, the one deep band. The two offers are different
          things, so a rule stands between them rather than a gap. ═══ */}
      <Section deep labelledBy="cta-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h2 id="cta-h" className="t-h2 max-w-[16ch]">Working with CLÉ Family Media</h2>
              <p className="t-lead mt-6 max-w-[46ch]">
                We are open to conversations with studios, distribution partners, educators and
                press. If you are assessing the company, we would rather answer your questions
                directly.
              </p>
              <div className="mt-9"><Button to="/contact">Send an enquiry<IconArrow size={16} /></Button></div>
            </div>
            <div className="lg:border-l lg:border-white/15 lg:pl-16">
              <h3 className="t-h3">Occasional updates</h3>
              <p className="t-body mt-3 max-w-[40ch]">
                Production notes and company news, for adults. Infrequent, and easy to leave.
              </p>
              <NotifyForm cta="Sign up" icon={<IconMail size={16} />} done="Thank you. We will be in touch when there is something worth sending." />
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
