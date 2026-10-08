import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Stage } from "@/components/render/Stage";
import { Kicker, Lead, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The call sheet: the review sequence and the faces, as one object.

   WHAT THIS REPLACES, AND WHY. The home page used to run two sections back to
   back that were the same section twice. First a six-row running order (stage,
   who is answerable), then a three-across grid of the same people's faces with
   a line each about what they check. A reader met Paula Walshe twice in nine
   hundred pixels, once as a row and once as a tile, and the page paid section
   padding and a heading for each. Worse, the six-row ledger was the third copy
   of one idea on the site: /ethical-ai owns the full account of the sequence
   and /team states it again.

   So the two are one list now, ordered by the sequence rather than by seniority,
   with the stage each person is answerable for printed against their face. The
   home page's claim is "named people, in a fixed order, any of whom can stop a
   release", and that claim is now a single thing you can look at.

   WHAT WAS LOST ON PURPOSE. Stages 05 and 06 belong to the production team
   collectively rather than to one named person, so they have no row; they are
   stated in the note beside the list instead. Nothing was invented to fill
   them, and no stage was dropped from the count.

   ORDER. An earlier pass put Paula second deliberately, as "the credential that
   survives a search". She is third here only because the educational review is
   the third stage, and the list is the sequence now. On a screen she is still in
   the first half of it, above the fold on a laptop.
   ========================================================================== */

interface Member {
  name: string;
  role: string;
  line: string;
  asset: AssetKey;
  /** The stage this person is answerable for, from the client's own sequence. */
  stage?: { n: string; name: string };
  /** For anyone who sits outside the episode sequence. */
  standing?: string;
}

/* Names, titles and lines are the client's 2026-10-01 "Team Bio & Photos"
   handoff: Alan rather than Al, Lydia Harding rather than Lydia Sexton, Kirstie
   without the surname an earlier draft gave her. Paula's book is Full STEAM
   Ahead.

   The stage against each name is the client's own six-stage sequence, not an
   inference: Conor and Alan at concept, Alan at script and direction, Paula at
   educational review, Lydia and Kirstie at parent and early years review. Two
   people carry 04, so 04 appears twice, which is what the sequence actually
   says. David Toth advises the company rather than passing episodes, so his row
   carries no number and the column of figures visibly stops before it.

   Six here, not the whole company: Mansi's handoff carried no photograph and no
   biography, so she is on /team in full rather than as the one blank tile in a
   list of faces. The link beside this list is what carries the reader to her. */
const MEMBERS: Member[] = [
  {
    name: "Conor Sexton",
    role: "Founder and CEO",
    stage: { n: "01", name: "Concept and story" },
    asset: "person.conor",
    line: "Sets each episode's concept and story alongside Alan, and leads strategy and partnerships.",
  },
  {
    name: "Alan Compton",
    role: "Creative Director",
    stage: { n: "02", name: "Script and direction" },
    asset: "person.alan",
    line: "Writes and directs. The look, the performances and the pace of an episode are his call.",
  },
  {
    name: "Paula Walshe PhD",
    role: "Education Director",
    stage: { n: "03", name: "Educational review" },
    asset: "person.paula",
    line: "Lectures in early childhood education at SETU Carlow and wrote Full STEAM Ahead. Reviews learning intent against early years practice.",
  },
  {
    name: "Lydia Harding",
    role: "Executive Producer",
    stage: { n: "04", name: "Parent and early years review" },
    asset: "person.lydia",
    line: "Reads script and production from a parent's point of view, and from a child's, before anything is released.",
  },
  {
    name: "Kirstie",
    role: "Child Development Consultant",
    stage: { n: "04", name: "Parent and early years review" },
    asset: "person.kirstie",
    line: "Thirty years in childcare and early education, and a qualified SNA. Checks that what is made is age-appropriate.",
  },
  {
    name: "David Toth",
    role: "Strategic Advisor",
    standing: "Advisory board",
    asset: "person.david",
    line: "Two decades advising Nickelodeon, LEGO and BBC Kids on content quality and platform safety. Shapes platform strategy here.",
  },
];

export function CallSheet({ headingId }: { headingId: string }) {
  return (
    <div className="grid gap-y-12 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-x-20">
      {/* The margin column. It carries the argument and the two stages that
          belong to nobody in particular, so the list beside it can be nothing
          but people.

          Top and bottom, not top and then six hundred pixels of nothing: the
          list is three times the height of this column, so the note and the
          two links are set against the foot of the last row. Air between two
          anchored blocks reads as typesetting; the same air hanging under a
          single block reads as a column that ran out. */}
      <Settle className="lg:flex lg:flex-col lg:justify-between lg:pt-2">
        <div>
          <Kicker>How the work gets made</Kicker>
          <h2 id={headingId} className="t-h2 mt-4 max-w-[13ch]">
            A named person at every stage
          </h2>
          <Lead className="mt-5">
            This is the sequence an episode goes through before it reaches a child, and who is
            answerable at each point. Any one of these stages can hold a release back.
          </Lead>
        </div>
        {/* ---------------------------------------------------------------
            THE SLOT. When Conor supplies a real case (the handoff refers to
            one), it goes here: the episode, what was caught, by whom, what
            changed and how long the release moved. A real sent-back episode is
            the single most persuasive thing this company owns, and it is the
            only version of this that may ever carry specifics. Until then the
            paragraph states the process and nothing about an incident. See
            CONTENT-NEEDED.md.
        --------------------------------------------------------------- */}
        <div className="mt-8 lg:mt-12 lg:pb-2">
          {/* No rule over this block. With the column justified to the foot of
              the list its top edge lands wherever its own height puts it, which
              was ten pixels off the rule of the row beside it: a rule that
              nearly aligns is worse than no rule. */}
          <p className="t-body max-w-[46ch] text-body">
            Two further stages, quality and suitability and final approval, are taken by the
            production team together. Nothing is generated and published automatically, and a
            release has been held back to make changes.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3">
            <TextLink to="/ethical-ai">
              How we use AI, in detail
              <IconArrow size={15} />
            </TextLink>
            <TextLink to="/team">
              The full team and advisory board
              <IconArrow size={15} />
            </TextLink>
          </div>
        </div>
      </Settle>

      {/* The list. Faces down one axis, the stage figures down another, so the
          sequence can be read as a column without reading a word of it. */}
      <Settle as="ol">
        {MEMBERS.map((m, i) => (
          <li
            key={m.name}
            className="hairline grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-x-5 gap-y-4 py-7 sm:grid-cols-[9rem_8rem_minmax(0,1fr)] sm:gap-x-8 sm:py-8"
          >
            {/* Square, not circular: a circular crop is an avatar, and an
                avatar is a user interface. These are photographs of people who
                are answerable for something. Each leans a little differently
                because a hand put it on the ledge. */}
            <Stage
              seated
              lift
              tilt={4 + (i % 3)}
              turn={i % 2 ? -2.5 : 2}
              roll={i % 2 ? 0.5 : -0.6}
              depth={0.4 + (i % 3) * 0.08}
              light={-30}
              radius="var(--radius-sm)"
              className="w-full"
            >
              <Figure
                asset={m.asset}
                rounded="rounded-[var(--radius-sm)]"
                className="aspect-square"
                sizes="(min-width: 640px) 144px, 96px"
              />
            </Stage>

            {/* The figures are --color-muted rather than a lighter grey: muted
                is the floor at which text still passes AA on the clay ground,
                and these are read, not decoration. */}
            <p className="sm:pt-1 sm:text-right">
              {m.stage ? (
                <>
                  <span className="tnum block font-mono text-[1.25rem] leading-none text-muted">
                    <span className="sr-only">Stage </span>
                    {m.stage.n}
                  </span>
                  <span className="mt-2.5 block font-mono text-[11px] uppercase leading-[1.5] tracking-[0.14em] text-muted">
                    {m.stage.name}
                  </span>
                </>
              ) : (
                <span className="block font-mono text-[11px] uppercase leading-[1.5] tracking-[0.14em] text-muted">
                  {m.standing}
                </span>
              )}
            </p>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="t-h3">{m.name}</h3>
              <p className="eyebrow eyebrow-sm mt-2">{m.role}</p>
              <p className="t-body mt-3 max-w-[52ch] text-body">{m.line}</p>
            </div>
          </li>
        ))}
      </Settle>
    </div>
  );
}
