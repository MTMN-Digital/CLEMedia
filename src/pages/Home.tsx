import { Seo, organizationJsonLd } from "@/components/Seo";
import { ShowFrame } from "@/components/ShowFrame";
import { NotifyForm } from "@/components/NotifyForm";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { HeroFilm } from "@/components/home/HeroFilm";
import { Wipe } from "@/components/Wipe";
import { EPISODES } from "@/lib/episodes";
import { FilmStrip } from "@/components/home/FilmStrip";
import { Stage } from "@/components/render/Stage";
import { CallSheet } from "@/components/home/CallSheet";
import { Evidence } from "@/components/home/Evidence";
import { Feedback } from "@/components/home/Feedback";
import { BeyondScreen } from "@/components/home/BeyondScreen";
import { GetInTouch } from "@/components/home/GetInTouch";
import { EpisodeRings } from "@/components/home/EpisodeRings";
import { DrawnBracket } from "@/components/draw/kit";
import { Watermark, Underline } from "@/components/draw/Mark";
import {
  Lead, Section, Container, Button,
} from "@/components/ui";
import { IconMail, IconArrow } from "@/components/icons";

/* ============================================================================
   THE RULE THIS PAGE WAS REBUILT ON.

   Five real images exist in public/brand/: the felted CLÉ mark, the felted
   Pawsitive Pugs wordmark, the hen and pugs, the tree swing, the bluebells.
   An earlier version of this page used NONE of them, and rendered nine empty
   placeholder frames instead, including a placeholder for the felted wordmark
   that is already in the repo. That is why the page read as a blank sheet.

   So: the artwork is the content. It is used large, because that is how
   pawsitivepugs.com carries its own pages. Not full bleed any more: see
   ShowFrame.tsx for why the bands became contained, rounded, uncropped
   frames. And an empty frame is
   never rendered on this page. Where an asset is missing, the section is built
   from what exists instead, and the gap is listed in CONTENT-NEEDED.md.

   ──────────────────────────────────────────────────────────────────────────
   THE SHAPE, added 2026-10-06.

   The page was ten thousand pixels of one silhouette: eight sections, every
   one of them a heading with rows or cards under it, every one at the same
   1560px container, almost all of them on the same cream. Blur the text and
   four of them were indistinguishable.

   It now runs: the mission film, then ONE tall band on the deeper wall that
   holds the whole argument (the thesis and the three stages, as a set page
   rather than as two sections), then the two big objects the page already had
   and never bettered (the film, then the filmstrip running off the right
   edge), then the call sheet, the six sign-off slips standing on a shelf in
   a lit room, then the AI position on the wall at display size, then the navy
   close. Updated 2026-10-09: the call sheet stopped being a third copy of the
   team's faces, and the AI band stopped being the quietest block on the page.

   Updated 2026-10-13: the garden frame no longer sits under the film. The
   film's own poster is Finn and Fia at a puddle in that garden, so the page
   was opening on two views of one place before a word of the argument. It is
   a 3:1 ribbon between the research band and the testing band now, and the
   page opens on the film straight into the thesis.

   Removed rather than restyled:
     - the second garden picture. The page showed a smaller crop of the same
       garden twelve hundred pixels after the first. /story owns the
       swing-tree print.
     - the six-row running order. It was the third copy of one idea on the
       site, and the faces underneath it were the same six people again. The
       two are one list now; see CallSheet.
   ========================================================================== */

/* The three stages moved into EpisodeArc.tsx with the drawing they label,
   so the words and the marks they sit on cannot drift apart. */

/* Titles and synopses are the show's own, from its site. Runtime, age range and
   theme are not known and are not invented. */
/* The six live in lib/episodes.ts, which is the only copy of them on the
   site. Five and six have art and a title and nothing else, and the strip
   marks them rather than hiding them. */


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
      {/* `none` at the bottom until 2026-10-13, so that this band and the one
          under it would read as one wall. They never did: `.wall` carries its
          own radial lamp positioned at `14% -14%` of its OWN box, so a second
          wall section restarts the light and draws a visible line across the
          page. All butting them achieved was putting that line 16 pixels under
          the last line of body copy, with the descenders sitting on it. The
          seam is unavoidable without merging two separately labelled sections
          into one, so it is moved into open space instead, where a change of
          light reads as light rather than as a rule. */}
      <Section labelledBy="thesis-h" pad={["normal", "tight"]} className="wall mk-host">
          {/* See components/draw/Mark.tsx. The band was a flat surface with a
              radial lamp on it and nothing else; this gives it something to
              be lit, without a second colour and without a gradient. */}
          <Watermark shape="sun" at="right" />
          <Container width="wide">
            {/* STACKED, NOT A SPREAD, since 2026-10-26. Ten sections across the
               site opened with the heading alone in the left column and a lone
               paragraph parked at the right, bottom aligned to the heading's
               last line. On a wide screen that leaves the sentence floating in
               the middle of the band with blank paper above it, and the reader
               has to jump right and down to find the words the heading was
               asking for. Heading, then its sentence under it, one left edge. */}
            <Wipe>
              <h2 id="thesis-h" className="t-display max-w-[21ch]">
                We are not going to tell anyone their child watches too much television.
              </h2>
              <p className="mt-8 max-w-[34ch] font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] leading-[1.14] tracking-[-0.01em] text-red-deep">
                We would rather an episode started something a child{" "}
                <Underline accent>carries on with</Underline>.
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
          Then that floor seen from above, with the child's own prints walking
          off it, which failed for a reason worth keeping: at the width this
          column actually gets, a plan view asks the viewer to decode three
          kinds of mark at once, and the prints came out at ten pixels and read
          as blobs rather than feet.
          It is three small scenes in elevation now, one per caption: two heads
          watching a screen, the child up off the floor beside a paused one,
          and a sheet with the episode's sun drawn on it in crayon and no
          screen anywhere in it. One child, one screen, one sun, read top to
          bottom. Not one word of the client's three sentences was cut.
          See src/components/home/EpisodeRings.tsx. ═══ */}
      <Section labelledBy="model-h" pad={["tight", "normal"]} className="wall">
        <Container width="wide">
          {/* STACKED, not a spread. MEASURED 2026-10-26: eight sections of the home
          page opened with the identical two-column header, heading left and a
          lead floating at the right on the heading's last baseline, which is
          what made the page read as one template repeated down the screen
          rather than as a sequence of different things. Three of the eight
          now open stacked, at the measure the lead actually wants, and the
          spread is kept for the places where the right-hand line answers the
          heading rather than merely explaining it. */}
          {/* NO LEAD, 2026-10-27. "One episode, three stages" was a filing
              label and the sentence under it was the actual claim, so the
              claim is the heading now and the label is gone: the three scenes
              below are visibly three stages and carry the words Watch, Play
              and Learn themselves. Measured before this pass, seven of the
              home page's ten sections opened with a heading and a grey
              21px three line paragraph at the same left edge and the same
              measure, which is the repetition the client was reading as the
              page's real problem. */}
          <Wipe>
            <h2 id="model-h" className="t-h2 max-w-[30ch]">
              Designed to move a child from the screen into play and conversation, rather than
              to hold them in front of it.
            </h2>
          </Wipe>

          <EpisodeRings />
        </Container>
      </Section>

      {/* ═══ 2c. THE EVIDENCE, in the grove.

          Three published results with the paper each comes from, and the
          page's first use of the show's green as a room. It arrives here, on
          the heels of the company's own argument, because the order of the
          page is now: what we believe, how an episode is shaped, and then what
          anyone else has found. See Evidence.tsx for why the third figure is
          not the one the client's deck printed. ═══ */}
      {/* THE GARDEN IS THE GROUND, 2026-10-13.

          The research figures used to sit on the olive, with a picture of the
          garden in its own block underneath. That picture was the weakest
          thing on the page: the hero film is already this garden, so a second
          view of it read as a repeat, and whatever shape it was cut to it
          needed air on both sides and got 192 pixels of it. Three goes at
          sizing it did not fix that, because the problem was that it was a
          block at all.

          So it stopped being a block and became the room. One fewer section,
          the picture is finally doing work, and the figures gain a ground that
          argues for them: this is the world the series is set in, and these
          are the findings the company builds it on.

          THE TINT IS MEASURED, NOT PICKED. Cream type has to clear 5.3:1
          against the BRIGHTEST pixel in the photograph, which is the sun at
          rgb(254,255,252). Solving for the lightest overlay that does it:
          the show's own olive needs 93 percent and hides the picture
          completely; navy needs 71; this forest green needs 74 and leaves a
          quarter of the picture showing, which is the most any tint in the
          green family can give. Flat, one hue, no gradient. The real contrast
          sampler agrees at 1440 and at 390.

          THE CAPTION IS NOT OPTIONAL. brand.ts records the rule: every one of
          these frames carries a visible line saying it is a frame from the
          animation, because they are rendered and this company's Responsible
          AI page turns on being straight about that. A background is still a
          frame on the page, so it is captioned at the foot of the band. */}
      <Section
        labelledBy="evidence-h"
        pad={["open", "normal"]}
        className="bench relative overflow-hidden !bg-none !bg-transparent"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <Figure asset="home.hero" fill rounded="rounded-none" position="center 44%" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: "rgba(44, 53, 38, 0.74)" }} />
        </div>
        <Container width="wide" className="relative">
          <Evidence headingId="evidence-h" />
          {/* #eee9df, not `text-muted` and not a dimmed cream. On the worst
              pixel of this ground, rgb(99,106,94), the muted token is dark on
              dark and a 0.78 cream measures 4.35, under AA. This is the
              darkest step of the cream that still clears it, at 4.62. */}
          <p className="ml-auto mt-16 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-[#eee9df] lg:mt-24">
            Behind this, a frame from The Pawsitive Pugs &amp; Pals
            <sup className="text-[0.7em]">&reg;</sup>. The garden the show&rsquo;s world is built
            from, animated, not photographed.
          </p>
        </Container>
      </Section>

      {/* ═══ 2d. WHAT PEOPLE SAY, and it is not in yet.

          This was four measurement figures drawn as empty brackets until
          2026-10-24, when the client's review document replaced them with
          quotations from parents and educators. Still the one deliberately
          unfinished block on the site, for a better reason than before: a
          quotation is a checkable claim where a figure nobody had measured was
          not. See Feedback.tsx. ═══ */}
      <Section labelledBy="tested-h" pad="normal">
        <Container width="wide">
          <Feedback headingId="tested-h" />
        </Container>
      </Section>

      {/* The meadow: the way into the series, and the first sight of Finn
          and Fia on the page. Everything above this point is the company
          talking about its work, and this is the work. The old band sliced the
          leaf the composition stands on clean in half. Captioned for the same
          reason the garden above is: it is a frame from the animation, not a
          photograph. */}
      <ShowFrame
        asset="show.meadow"
        caption="Finn and Fia. A frame from the series."
      />

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

      {/* ═══ 3b. BEYOND THE SCREEN. The Play and the Learn, which the page
          argued for at the top and then never showed. See BeyondScreen. ═══ */}
      {/* ON THE OLIVE, 2026-10-13. The green was built for the research band
          and lost its room when that band became the garden. It lands here,
          and better than where it was: this is the section about getting a
          child off the screen and into play, and the green is the colour of
          Finn and Fia's own knitted jumpers.

          It also breaks the longest flat run on the page. After the film band
          this was 2,644 pixels of unbroken paper across three blocks. The
          filmstrip above ends on its sprocket edge, which terminates the umber
          cleanly, so two dark bands meeting here read as two rooms rather than
          as mud. The two cards keep their own ink through the light-surface
          guard in index.css. */}
      <Section labelledBy="beyond-h" pad="normal" className="bench grove mk-host">
        <Watermark shape="leaf" at="right" />
        <Container width="wide">
          <BeyondScreen headingId="beyond-h" />
        </Container>
      </Section>

      {/* ═══ 4. WHO CHECKS IT. The sequence, not the staff list: see
          CallSheet for what it replaced and why. ═══ */}
      <Section labelledBy="people-h" pad={["tight", "normal"]}>
        <Container width="wide">
          <CallSheet headingId="people-h" />
        </Container>
      </Section>

      {/* The snail. The page's third and last frame, and the one that argues
          the company's pace without a word: a garden path at a snail's speed,
          directly above the band about how the work is actually produced. The
          old band cropped off its antennae. */}
      <ShowFrame asset="show.snail" caption="A frame from the series." />

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
      <Section labelledBy="ai-h" pad="open" className="wall mk-host">
        <Container width="wide">
          <Settle>
            <h2 id="ai-h" className="t-display max-w-[17ch]">
              AI is a production tool. <Underline v={2}>People remain responsible</Underline> for
              the work.
            </h2>
          </Settle>

          <Settle className="hairline mt-14 grid gap-x-16 gap-y-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-x-20">
            {/* The honesty sentence, as the band's pull line. Ink at full
                strength on the wall, at a size set by the face rather than by
                a tint. */}
            <div>
              {/* The bracket is DRAWN, 2026-10-27. This was `border-l-2
                  border-red`, which is the one card-decoration tell the house
                  rules name outright, and the kit already had the mark built
                  for exactly this job and nothing using it. */}
              <div className="relative pl-6">
                <DrawnBracket className="absolute left-0 top-0 h-full w-[14px]" />
                <p className="font-display text-[clamp(1.5rem,1.1rem+1.5vw,2.375rem)] leading-[1.18] text-ink">
                  Calling this work handmade would be untrue. Calling it AI-generated would erase
                  the people who actually make the decisions.
                </p>
              </div>
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
                    Our team writes, directs, reviews and approves the work.
                  </dd>
                </div>
              </dl>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 6. GET IN TOUCH, split three ways, on paper. The band it
          replaces was one heading and one paragraph addressed to nobody; its
          paragraph is still here, as the lead. See GetInTouch. ═══ */}
      <Section labelledBy="cta-h" pad="normal">
        <Container width="wide">
          <GetInTouch headingId="cta-h" />
        </Container>
      </Section>

      {/* ═══ 7. THE CLOSE, and the page's one deep band. Just the sign-up:
          it used to share the band with the contact copy, which is now a
          section of its own, so this is a single short thing standing
          between the page and the footer. ═══ */}
      <Section deep labelledBy="updates-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-start">
            <div>
              <h2 id="updates-h" className="t-h2 max-w-[14ch]">Occasional updates</h2>
              <p className="t-body mt-4 max-w-[42ch]">
                Production notes and company news, for adults. Infrequent, and easy to leave.
              </p>
            </div>
            <NotifyForm cta="Sign up" icon={<IconMail size={16} />} done="Thank you. We will be in touch when there is something worth sending." />
          </Settle>
        </Container>
      </Section>
    </>
  );
}
