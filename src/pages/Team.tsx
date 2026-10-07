import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Container, Kicker, Lead, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { ADVISORS, STAGES, TEAM } from "@/components/team/people";
import { Dossier } from "@/components/team/Dossier";
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
   went into the table as a row under a rule whose six cells are replaced by the
   statement that the sequence does not apply to him, which says "outside the
   process" harder than a card on a different axis ever did, and takes a
   quarter of the height. Nothing was cut: every biography, every stage
   sentence and the adviser's whole entry are still on the page.

   THE SHAPE, with the text blurred out: a deep band of type, then a wide ruled
   grid with a column of faces down its left edge and a scatter of marks across
   it, then a navy close. Nothing else on this site looks like that, and in
   particular it is the opposite of /story, which is one measure with a mono
   margin and no grid at all.

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
      <Section className="wall !py-14 sm:!py-16 lg:!py-20">
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
                <p className="mt-6 max-w-[44ch] border-t border-[var(--color-rule)] pt-6 font-mono text-[12px] leading-[1.75] tracking-[0.02em] text-body">
                  Everything below is one table. The six stages run across it, the people run down
                  it, and a mark where they meet is the company's own account of who is answerable
                  there. Two of the stages are taken by the team as a whole, so they carry a team
                  mark rather than a name.
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

      {/* ═══ 2. THE DOSSIER. The page. ═══ */}
      <Section labelledBy="dossier-h" className="!py-14 sm:!py-16 lg:!py-20">
        <Container width="wide">
          <Settle className="grid gap-5 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,46ch)] lg:items-end lg:gap-12 lg:pb-10">
            <h2 id="dossier-h" className="t-h2 max-w-[20ch]">
              Six stages, and who stands at each
            </h2>
            <p className="t-body text-body">
              The biographies are the team's own, cut down and never added to. Where the company's
              account does not name a person at a stage, nothing is claimed for them there.
            </p>
          </Settle>
          <Dossier team={TEAM} advisers={ADVISORS} stages={STAGES} />
        </Container>
      </Section>

      {/* ═══ 3. CLOSE, the one deep band ═══ */}
      <Section deep labelledBy="team-cta-h" className="!py-16 sm:!py-20">
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
              <Button to="/contact" variant="quiet" className="!border-raised/35 !text-raised">
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
