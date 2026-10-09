import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Container, Kicker, Lead, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { ADVISORS, STAGES, TEAM } from "@/components/team/people";
import { StageSequence } from "@/components/team/StageSequence";
import { Roster } from "@/components/team/Roster";
import { PeopleStrip } from "@/components/team/PeopleStrip";

/* ============================================================================
   Team and advisers.

   The site's argument is "named, and answerable". This is the page where that
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
        description="The people behind CLÉ Family Media: the six review stages every episode passes through, the named person answerable at each, the core team's own biographies, and the strategic adviser who shapes the model."
        path="/team"
      />

      {/* ═══ 1. OPENING, on the wall. The one page on this site whose first
          screen is not paper: a deeper room, so the grid that follows reads as
          something laid out on a table rather than more of the same page. The
          wall's own floor is --color-sunken, where body ink is 6.7:1 and the
          red eyebrow 5.1:1, both AA. ═══ */}
      {/* THE BENCH, not the wall. This band ends on the six faces, and `.wall`
          is within a few percent of the paper above it, so mounted portraits
          with real shadows had nothing to stand out from: the shadows fell on
          a ground the same value as the thing casting them. On the bench the
          faces are lit. */}
      <Section className="bench" pad="open">
        <Container width="wide">
          {/* A spread, not a heading with a note parked at the far right. The
              first build put the lead under the h1 and the mono note in a 21rem
              column, which left 440px of nothing across the middle of the band
              and 110px of nothing under it. Title on the left, the whole of the
              voice on the right, both columns flush to the band's own edges. */}
          <Wipe>
            {/* Centred under 1024, where the spread collapses to one column:
                left aligned, the 46ch lead and the 44ch note left 300px of
                blank wall down the right of a tablet. */}
            <div className="mx-auto grid max-w-[64ch] gap-10 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-end lg:gap-16 xl:gap-24">
              <div>
                <Kicker>Team and advisers</Kicker>
                {/* Three lines, not two. The right column of this spread is
                    345px of lead and note; a two line title left 250px of bare
                    wall under it whichever way the two were aligned. Set to
                    break at eleven characters the title is 210px tall, the two
                    columns very nearly match, and a display face gets to act
                    like one. */}
                <h1 className="t-display mt-5 max-w-[11ch]">Who answers for every episode</h1>
              </div>
              <div>
                <Lead className="max-w-[46ch]">
                  A small core team. Between them they decide what gets made, how it gets made and
                  what it is supposed to do for the child watching. Each of them stands at a point
                  in the review sequence an episode passes through before a child sees it, and any
                  stage can hold a release back.
                </Lead>
                {/* Was an account of a table that no longer exists: the six
                    stages were a matrix of marks against a legend until
                    2026-10-03, and the paragraph describing how to read it
                    outlived two rebuilds of the thing it described. */}
                <p className="mt-6 max-w-[44ch] border-t border-rule pt-6 font-mono text-[12px] leading-[1.75] tracking-[0.02em]">
                  Below, the six stages as the slips they are signed off on, then the same fact
                  from the other side: each person, and what they answer for. Two of the stages
                  the company gives to the team as a whole, and those say so rather than naming
                  anyone.
                </p>
              </div>
            </div>
            {/* The band ends on the faces. It used to end on 400px of bare
                wall, which is the "layouts are thin" complaint in one place:
                the opening of the page about the team showed nobody. */}
            <PeopleStrip people={[...TEAM, ...ADVISORS]} />
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 2. THE SEQUENCE, read in order. ═══ */}
      <Section labelledBy="dossier-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,46ch)] lg:items-end lg:gap-12 lg:pb-14">
            <h2 id="dossier-h" className="t-h2 max-w-[20ch]">
              Six stages, and who stands at each
            </h2>
            <p className="t-body">
              In the order an episode passes through them. Every stage names the people answerable
              there, and the last one can send the work back.
            </p>
          </Settle>
          <StageSequence stages={STAGES} />
        </Container>
      </Section>

      {/* ═══ 3. THE PEOPLE. The same fact from the other side: what each
          person is answerable for, written out, with their own biography. ═══ */}
      <Section labelledBy="people-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,46ch)] lg:items-end lg:gap-12 lg:pb-14">
            <h2 id="people-h" className="t-h2 max-w-[20ch]">
              The people, and what each answers for
            </h2>
            <p className="t-body">
              The biographies are the team's own, cut down and never added to. Where the company's
              account does not name a person at a stage, nothing is claimed for them there.
            </p>
          </Settle>
          <Roster people={TEAM} stages={STAGES} />
          <div className="mt-16 border-t border-rule pt-10 lg:mt-20 lg:pt-14">
            <p className="eyebrow">Strategic adviser</p>
            <p className="t-body mt-3 max-w-[62ch]">
              Advisers are not employees, and advisory input sits outside the six review stages.
              Each adviser is described only as they have approved it.
            </p>
            <div className="mt-10">
              <Roster people={ADVISORS} stages={STAGES} outside />
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 3. CLOSE, the one deep band ═══ */}
      <Section deep labelledBy="team-cta-h" pad="tight">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="team-cta-h" className="t-h2 max-w-[18ch]">
                Every episode passes through these people before a child sees it
              </h2>
              <p className="t-lead mt-5 max-w-[46ch] opacity-85">
                How the work is made, stage by stage, and where AI is and is not used, is set out
                in full on the Responsible AI page.
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
