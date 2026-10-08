import { MemberRows } from "./MemberRow";
import { StageHeadRow, StageKey } from "./StageTrack";
import { StageMarksLegend } from "./StageMarks";
import type { Member, Stage } from "./people";

/* ============================================================================
   The dossier: the whole team page in one structure.

   THE PROBLEM IT SOLVES. The page used to open with a band showing the six
   review stages with faces on a track, and then list the same six people
   underneath with the same six stage marks beside their names. Two structures
   carrying one fact. A reader had to hold the track in their head while they
   read the ledger to answer the only question the page exists to answer, which
   is who answers for what.

   So the stages became the columns of the ledger and the band went away. Stage
   copy lives in the column heads, people live in the row heads, the relation
   lives in the cells, and the biographies span the table under each name. One
   move, one grid, nothing drawn twice.

   IT IS A REAL TABLE, not a grid of divs with ARIA on it. Row headers, column
   headers and scope are what make a matrix navigable with a screen reader, and
   they are free with the right element. An ARIA table over CSS grid is the
   version of this that breaks.

   WHAT THE SHAPE SAYS WITHOUT A WORD BEING READ. Columns one to four are
   sparse: one or two people each, named. Columns five and six are solid: every
   core member carries a team mark. So individual accountability early,
   collective accountability at the end, visible before the reader has read a
   single stage name. The adviser's row is the other half of that: it replaces
   all six cells with one statement that the sequence does not apply to him.

   BELOW 1024px a seven column table cannot exist, so the six stage columns are
   display:none and the table runs as one column. The stage copy the column
   heads were carrying is then given once by StageKey above it, and each
   person's marks run as a numbered strip in their own row.
   ========================================================================== */

export function Dossier({
  team,
  advisers,
  stages,
}: {
  team: Member[];
  advisers: Member[];
  stages: Stage[];
}) {
  return (
    <>
      {/* The collapsed view's header, carrying what the column heads carry on a
          wide screen. On the sunken fill muted ink is AA-large only, so every
          line in here is body or ink. */}
      <div className="well rounded-[var(--radius-md)] px-5 py-6 sm:px-7 lg:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-body">
          The six stages, in order
        </p>
        <div className="mt-5">
          <StageKey stages={stages} />
        </div>
        <div className="mt-6 border-t border-rule pt-5">
          <StageMarksLegend />
        </div>
      </div>

      {/* Labelled by its own caption, not by aria-labelledby pointing at the
          h2: aria-labelledby OVERRIDES a caption, so pointing it at the heading
          would have thrown away the one sentence that says what the grid in
          front of the reader actually means. */}
      <table
        /* table-fixed only from 1024. Below it the six stage cells are
           display:none but the biography row still carries colSpan 7, so a
           fixed layout dutifully cut the table into seven equal columns and
           squeezed every name into the first 50px of it: "Conor Sexton" came
           out as two lines and the six marks as a vertical stack. With auto
           layout the five empty columns collapse to nothing and the name cell
           takes the width, which is what the collapsed view wants. */
        className="mt-10 w-full border-collapse text-left lg:mt-0 lg:table-fixed"
      >
        <caption className="sr-only">
          The six review stages an episode passes through, and which of them each person is
          answerable for.
        </caption>
        <thead className="hidden lg:table-header-group">
          <StageHeadRow stages={stages} />
        </thead>

        <tbody>
          {team.map((m) => (
            <MemberRows key={m.name} m={m} stages={stages} />
          ))}
        </tbody>

        {advisers.length > 0 && (
          <tbody>
            <tr>
              <td colSpan={stages.length + 1} className="border-t-2 border-body px-4 pb-1 pt-9">
                <p className="eyebrow">Strategic adviser</p>
                <p className="t-body mt-2.5 max-w-[72ch] text-body">
                  Advisers are not employees, and advisory input sits outside the six review
                  stages. Each adviser is described only as they have approved it.
                </p>
              </td>
            </tr>
            {advisers.map((m) => (
              <MemberRows key={m.name} m={m} stages={stages} outside />
            ))}
          </tbody>
        )}
      </table>
    </>
  );
}
