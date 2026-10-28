import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { ClosingLine } from "@/components/ClosingLine";
import { Container, Section, TextLink } from "@/components/ui";
import { Watermark } from "@/components/draw/Mark";
import { PHASES } from "@/components/team/people";
import { useTeam } from "@/components/team/useTeam";
import { useBlock } from "@/lib/content";
import { COPY } from "@/components/teampage/copy";
import { Faces } from "@/components/teampage/Faces";
import { Register } from "@/components/teampage/Register";

/* ============================================================================
   Team and advisers: a register.

   REBUILT 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, "## team"). The page
   is a credits page: the faces are the first screen at the scale of a
   magazine masthead, and under them one ruled register in which every person
   has a name, a role, what they do here in one paragraph, and a roll call of
   the five phases showing which ones they are in. Reading down the phase
   column tells the whole production story without a diagram.

   WHAT CAME OFF. The corner grid on the bench (identifier, aside, a claim
   headline at the hero's size), the per-print lean on the portraits, the
   sideways scroll strip on a phone, the lit review board of five slips (the
   five-phase sequence now has two renderings on the site, the home strip and
   the Responsible AI drawing, and this page carries the per-person key
   instead), the display claim over the biographies, the dots on a track, and
   the navy closing band with its two buttons. Every fact survives: the phase
   names are in the key line, the five phase sentences are the Responsible AI
   page's, and nothing in any biography is cut.

   The title is a label, not a sentence making a case. The home page argues;
   this page lists.

   The people, bios and phases live in src/components/team/people.ts, all of
   it the client's own account, and arrive through useTeam() so rows saved in
   the admin's Team panel replace the bundled lists once they load.
   ========================================================================== */

export default function Team() {
  const { team, advisors } = useTeam();

  /* EDITABLE FROM THE ADMIN. Every string below is the page's own wording
     (components/teampage/copy.ts) until a content_blocks row replaces it. */
  const heroTitle = useBlock("team", "hero.title", COPY["hero.title"]);
  const registerHeading = useBlock("team", "register.heading", COPY["register.heading"]);
  const registerKey = useBlock("team", "register.key", COPY["register.key"]);
  const adviserHeading = useBlock("team", "adviser.heading", COPY["adviser.heading"]);
  const adviserLead = useBlock("team", "adviser.lead", COPY["adviser.lead"]);
  const closeLead = useBlock("team", "close.lead", COPY["close.lead"]);
  const closeLink = useBlock("team", "close.link", COPY["close.link"]);

  return (
    <>
      <Seo
        title="Team and advisers"
        description="The people behind CLÉ Family Media: the core team and advisers, what each of them does on an episode, and the five phases every episode passes through, in the company's own words."
        path="/team"
      />

      {/* ═══ 1. THE OPENING BAND: the label, the one paragraph, the faces.
          On the grove, the green of the knitted jumpers Finn and Fia wear in
          every render, the one band on the site where the company's own
          faces are the content. The dark ground is what makes eight sittings
          taken in eight places read as one group. The band ends on the
          second row's roles; no rule anywhere in it. ═══ */}
      {/* `open` above, `normal` below: the plan asks for 96px under the
          second row's roles, and 88 is the nearest step the spacing contract
          has. */}
      <Section className="bench grove mk-host" pad={["open", "normal"]} labelledBy="team-h">
        <Watermark shape="sun" at="right" />
        <Container width="wide">
          {/* The masthead line: the label alone, the h1 in Calistoga. The
              paragraph that sat beside it was cut on 2026-10-28 at the
              client's request; the faces say it. */}
          <Settle>
            <h1 id="team-h" className="t-h1">
              {heroTitle}
            </h1>
          </Settle>

          {/* The register's faces, in the register's order: TEAM then
              ADVISORS, portraits only. Four and four at lg, two across on a
              phone. */}
          <div className="mt-10 lg:mt-14">
            <Faces people={[...team, ...advisors]} />
          </div>
        </Container>
      </Section>

      {/* ═══ 2. THE REGISTER, on paper. ═══ */}
      <Section className="bg-paper-2" pad={["none", "normal"]} labelledBy="register-h">
        <Container width="wide">
          <Settle className="pt-18">
            {/* A label on a list, not a second headline, so `.t-h3`. */}
            <h2 id="register-h" className="t-h3">
              {registerHeading}
            </h2>
            {/* The key, one line: the five phase names in mono, then the
                sentence in the company's words, then where the full account
                is. Middle dots between the names, never a dash. */}
            <p className="t-body mt-5 max-w-[78ch]">
              <strong className="font-bold">Phases</strong>{" "}
              {PHASES.map((s, i) => (
                <span key={s.n}>
                  <span className="whitespace-nowrap font-mono text-[14px] uppercase tracking-[0.14em]">
                    {Number(s.n)} {s.phase}
                  </span>
                  {i < PHASES.length - 1 ? " · " : ". "}
                </span>
              ))}
              {registerKey} The full account is on the{" "}
              <TextLink to="/ethical-ai" className="text-[17px]!">
                Responsible AI page
              </TextLink>
              .
            </p>
          </Settle>

          <div className="mt-10 lg:mt-12">
            <Register people={team} phases={PHASES} />
          </div>

          {/* The adviser block: a rule, a sub-head inside the set, the note,
              then the row in the same shape. */}
          <div className="hairline mt-16 pt-10 lg:mt-20 lg:pt-14">
            <h2 className="t-h3">{adviserHeading}</h2>
            <p className="t-body mt-3 max-w-[62ch]">{adviserLead}</p>
            <div className="mt-10">
              <Register people={advisors} phases={PHASES} />
            </div>
          </div>

          {/* ═══ 3. THE CLOSING: one line and one link, then the footer. The
              reading order is team to Responsible AI. ═══ */}
          <ClosingLine className="mt-18" link={{ to: "/ethical-ai", label: closeLink }}>
            {closeLead}
          </ClosingLine>
        </Container>
      </Section>
    </>
  );
}
