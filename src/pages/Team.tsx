import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Card, Container, Kicker, Lead, Section, SectionHeading } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { ADVISORS, STAGES, TEAM } from "@/components/team/people";
import { StageTrack } from "@/components/team/StageTrack";
import { StageMarksLegend } from "@/components/team/StageMarks";
import { MemberRow } from "@/components/team/MemberRow";

/* ============================================================================
   Team and advisers.

   The site's argument is "named, and answerable". This is the page where that
   has to be visible rather than asserted, so the page is built on one idea:
   the review sequence and the people are the same information seen two ways.

   The band at the top shows it from the sequence's side: six stages on a
   track, and the portrait of whoever is answerable sitting on the track at
   that stage. The ledger below shows it from the person's side: each name
   carries six marks, lit at the stages that person holds. An adviser carries
   no marks, which is how the reader tells an adviser from the core team
   before reading a heading.

   There is no group photograph (team.group is null), so the opening is made
   from the six portraits that exist, the type and the sunken ground. The
   people, bios and stages live in src/components/team/people.ts, all of it
   the client's own account from the 2026-10-01 handoff.
   ========================================================================== */

export default function Team() {
  return (
    <>
      <Seo
        title="Team and advisers"
        description="The people behind CLÉ Family Media: the six review stages every episode passes through, the named person answerable at each, the core team's own biographies, and the strategic adviser who shapes the model."
        path="/team"
      />

      {/* ═══ 1. OPENING. Left-set type, then the track in a sunken band that
          runs edge to edge. The band is the ground the portraits sit on, and
          the one place on this page the paper gives way to a deeper fill
          other than the navy close. ═══ */}
      <Section className="!pb-0">
        <Container width="wide">
          <Wipe className="max-w-[56rem]">
            <Kicker>Team and advisers</Kicker>
            <h1 className="t-display mt-5 max-w-[14ch]">Who answers for every episode</h1>
            <Lead className="mt-6 max-w-[54ch]">
              A small core team. Between them they decide what gets made, how it gets made and
              what it is supposed to do for the child watching. Each of them stands at a point in
              the review sequence an episode passes through before a child sees it, and any stage
              can hold a release back.
            </Lead>
          </Wipe>
        </Container>

        <div className="well mt-14 sm:mt-16 lg:mt-20">
          <Container width="wide" className="py-14 sm:py-16 lg:py-20">
            <Settle className="lg:flex lg:items-end lg:justify-between lg:gap-12">
              <h2 id="track-h" className="t-h2 max-w-[18ch]">
                Six stages, and who stands at each
              </h2>
              <p className="t-body mt-4 max-w-[46ch] text-body lg:mt-0 lg:text-right">
                The faces at a stage are the people named as answerable for it; the two stages
                the whole team takes carry a team mark instead. The same people are listed
                below, each with the stages they hold marked against their name.
              </p>
            </Settle>
            <div className="mt-12 lg:mt-16" role="group" aria-labelledby="track-h">
              <StageTrack stages={STAGES} />
            </div>
          </Container>
        </div>
      </Section>

      {/* ═══ 2. THE LEDGER. The same people, the other way round. Open hairline
          rows on the paper, left-set and capped short of the page width so
          they read as a ledger rather than a centred block. The biographies
          keep a 62ch measure. ═══ */}
      <Section labelledBy="core-h">
        <Container width="wide">
          <Settle className="grid max-w-[76rem] gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <SectionHeading
              id="core-h"
              kicker="Core team"
              title="Who makes the work"
              lead="Each name carries the stages it is answerable for. The biographies are the team's own, cut down and never added to."
            />
            <StageMarksLegend />
          </Settle>
          {/* Settle IS the list. A div between ul and li drops the list
              semantics, so six people stop being announced as a list of six;
              as the ul itself, Settle staggers the rows directly. */}
          <Settle as="ul" className="mt-6 max-w-[76rem]">
            {TEAM.map((m) => (
              <MemberRow key={m.name} m={m} stages={STAGES} />
            ))}
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. THE ADVISER. A raised card on a narrower, centred axis, with no
          stage marks: the shape says "outside the sequence" before the copy
          does. ═══ */}
      <Section labelledBy="advisers-h">
        <Container width="default">
          <Settle>
            <SectionHeading
              id="advisers-h"
              kicker="Strategic adviser"
              title="Input within a defined remit"
              lead="Advisers are not employees, and they are shown separately for exactly that reason. Advisory input sits outside the six review stages, and each adviser is described only as they have approved it."
            />
          </Settle>
          <Settle className="mt-10">
            {ADVISORS.map((m) => (
              <Card key={m.name} as="article" className="card-still p-6 sm:p-10">
                <div className="grid gap-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
                  <div>
                    {/* Not flex: inside a .card the stylesheet gives picture
                        overflow:hidden, and a flex item with that loses its
                        min-width and collapses to 0px with a w-full image. */}
                    <div className="w-[120px] sm:w-full [&_picture]:block">
                      {m.asset && (
                        <Figure
                          asset={m.asset}
                          rounded="rounded-[var(--radius-md)]"
                          className="aspect-square"
                          sizes="(min-width: 1024px) 180px, (min-width: 640px) 150px, 120px"
                        />
                      )}
                    </div>
                    <h3 className="t-h3 mt-5">{m.name}</h3>
                    <p className="eyebrow mt-2 !text-[11px]">{m.role}</p>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-body">
                      Advisory remit. Not a review stage.
                    </p>
                  </div>
                  <div className="max-w-[62ch] space-y-3.5 sm:pt-1">
                    {m.bio.map((p, i) => (
                      <p key={p.slice(0, 24)} className={i === 0 ? "t-body text-ink" : "t-body text-body"}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. CLOSE, the one deep band ═══ */}
      <Section deep labelledBy="team-cta-h">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="team-cta-h" className="t-h2 max-w-[18ch]">
                Every episode passes through these people before a child sees it
              </h2>
              <p className="t-lead mt-6 max-w-[46ch] opacity-85">
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
