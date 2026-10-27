import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Container, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { ADVISORS, PHASES, TEAM } from "@/components/team/people";
import { StageSequence } from "@/components/team/StageSequence";
import { Roster } from "@/components/team/Roster";
import { PeopleStrip } from "@/components/team/PeopleStrip";
import "@/components/teampage/bench.css";

/* ============================================================================
   Team and advisers.

   The site's argument is "the same people read everything". This is the page where that
   has to be visible rather than asserted.

   REBUILT 2026-10-06 ON ONE STRUCTURE. The page used to be two: a band at the
   top showing six review stages on a track with the answerable person's face
   sitting at each, and a ledger below listing the same six people with the same
   six stage marks against their names. Both were good; together they said one
   thing twice, and the reader had to carry the first half in their head to use
   the second. The track is gone, the stages are the COLUMNS of the ledger, and
   the answer to "who answers for what" is now one grid read in one move.

   THE PAGE IS THEREFORE THREE MOVEMENTS, NOT FOUR. The separate adviser card
   went into the roster as a row under a rule, with the statement that the
   sequence does not apply to him in place of his stages, which says "outside
   the process" harder than a card on a different axis ever did and takes a
   quarter of the height. Nothing was cut: every biography, every stage
   sentence and the adviser's whole entry are still on the page.

   THE SHAPE, with the text blurred out, 2026-10-09: a bench band of type
   ending on the faces, then a lit room with six slips standing on two shelves,
   then a wide ruled roster with a column of portraits down its left edge, then
   a navy close. The matrix that paragraph used to describe was replaced twice
   over; see StageSequence.tsx for both attempts and why this is the third.
   Nothing else on this site looks like it, and in particular it is the
   opposite of /story, which is one measure with a mono margin and no grid at
   all.

   IN THE HERO'S LANGUAGE, 2026-10-27. The home hero was signed off and every
   inner page now opens in its corners. /team keeps its bench (the dark ground
   is what makes the mismatched portraits sit together, see HANDOVER), so the
   corners come to the bench instead of a picture: identifier top left, one
   line top right, the headline bottom left at the hero's size, its sentence
   under it, and the band still ends on the faces. The two grey blocks that
   used to sit under the heading went where they were actually talking: the
   note about the phases is above the board it describes.

   There is no group photograph (team.group is null), so the opening is made
   from type and the deeper ground alone. The people, bios and stages live in
   src/components/team/people.ts, all of it the client's own account from the
   2026-10-01 handoff.
   ========================================================================== */

export default function Team() {
  return (
    <>
      <Seo
        title="Team and advisers"
        description="The people behind CLÉ Family Media: the five phases an episode goes through from first draft to release, the five who read every draft, and the core team's own biographies."
        path="/team"
      />

      {/* ═══ 1. OPENING, on the bench, in the hero's corners. The one page on
          this site whose first screen is not a picture: a deeper room, so the
          grid that follows reads as something laid out on a table rather than
          more of the same page. ═══ */}
      {/* THE BENCH, not the wall. This band ends on the seven faces, and `.wall`
          is within a few percent of the paper above it, so mounted portraits
          with real shadows had nothing to stand out from: the shadows fell on
          a ground the same value as the thing casting them. On the bench the
          faces are lit.

          AND IN THE GROVE, 2026-10-13. The olive is the green of the knitted
          jumpers Finn and Fia wear in every render, which makes it the right
          room for the people who make them: this is the one band on the site
          where the company's own faces are the content. It is the same band in
          a second hue, not a second band, so nothing above changes. Measured
          equal to the umber it replaces, cream at 6.44:1 flat against 6.41 and
          5.39:1 under the lamp against 5.38. See `.grove` in index.css. */}
      <Section className="bench grove" pad="open" labelledBy="team-h">
        <Container width="wide">
          {/* THE CORNERS, since 2026-10-27. A display heading over a five line
              grey lead over a hairline over a second grey note was the shape
              the client named as the site's problem, and it was the first
              screen of this page. The eyebrow, aside and title are PageHero's
              own classes, used as given on the bench; `.team-open` is the grid
              they expect (components/teampage/bench.css). The ink override
              PageHero applies under 820px lives inside `.film-hero`, so the
              type stays cream on the bench at every width. */}
          <Wipe>
            <div className="team-open">
              <p className="page-hero__eyebrow">
                Our team<span>Core team and advisers</span>
              </p>
              <p className="page-hero__aside">A small core team.</p>
              <h1 id="team-h" className="page-hero__title">
                The people who make every episode
              </h1>
              <p className="team-open__lead t-lead">
                Between them they decide what gets made, how it gets made and what it is supposed
                to do for the child watching. Alan writes and animates, and the rest of them read
                every draft and watch every episode before it is released.
              </p>
            </div>
            {/* The band ends on the faces. It used to end on 400px of bare
                wall, which is the "layouts are thin" complaint in one place:
                the opening of the page about the team showed nobody. */}
            <div className="mt-14 lg:mt-20">
              <PeopleStrip people={[...TEAM, ...ADVISORS]} />
            </div>
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 2. THE SEQUENCE, read in order. ═══ */}
      <Section labelledBy="dossier-h" pad="tight">
        <Container width="wide">
          {/* THE CLAIM IS THE HEADING, 2026-10-27. "How an episode gets made"
              was a filing label with the real sentence parked in a grey lead
              under it. The lead's claim is the heading now, and the line that
              used to introduce the whole page from the bench sits where it is
              actually talking: a small mono note at the right, directly above
              the board it describes. No lead. */}
          <Settle className="pb-10 lg:pb-14">
            <h2 id="dossier-h" className="t-h2 max-w-[24ch]">
              A script goes round three or four times. The cut goes round until everyone is happy.
            </h2>
            <p className="ml-auto mt-10 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body lg:mt-14">
              In order, from the first draft to the finished episode. Then the same work from the
              other side: each person, and the phases they come into. Nobody is claimed for a phase
              the company's own account does not place them in.
            </p>
          </Settle>
          <StageSequence phases={PHASES} />
        </Container>
      </Section>

      {/* ═══ 3. THE PEOPLE. The same fact from the other side: what each
          person actually does, written out, with their own biography. ═══ */}
      <Section labelledBy="people-h" pad="tight">
        <Container width="wide">
          {/* A display claim, not a label: the biographies' own provenance is
              the sentence worth stopping for, so it is the heading, a size up
              from the board's so the two sections do not open in one shape.
              The second half of the old lead is the provenance note at the
              right, above the roster it qualifies. */}
          <Settle className="pb-10 lg:pb-14">
            <h2 id="people-h" className="t-h1 max-w-[18ch]">
              In their own words, cut down and never added to.
            </h2>
            <p className="ml-auto mt-10 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body lg:mt-14">
              Where the company's account does not place a person in a phase, nothing is claimed
              for them there.
            </p>
          </Settle>
          <Roster people={TEAM} phases={PHASES} />
          <div className="mt-16 border-t-[1.5px] border-rule pt-10 lg:mt-20 lg:pt-14">
            {/* A sub-head inside the set, not a mono eyebrow over it. */}
            <h3 className="t-h3">Adviser</h3>
            <p className="t-body mt-3 max-w-[62ch]">
              Advisers are not employees. Each is described only as they have approved it.
            </p>
            <div className="mt-10">
              <Roster people={ADVISORS} phases={PHASES} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 4. CLOSE, the one deep band ═══ */}
      <Section deep labelledBy="team-cta-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="team-cta-h" className="t-h2 max-w-[18ch]">
                Every episode passes through these people before a child sees it
              </h2>
              <p className="t-lead mt-5 max-w-[46ch] opacity-85">
                How an episode is written, reviewed and made, and where AI is and is not used, is
                set out in full on the Responsible AI page.
              </p>
            </div>
            {/* The quiet button is ink on a hairline, which disappears on navy.
                The earlier page shipped two of them here, invisible. One
                primary, and one quiet relit in the band's own paper. */}
            <div className="flex flex-wrap items-start gap-4 lg:justify-end">
              <Button to="/ethical-ai">
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
