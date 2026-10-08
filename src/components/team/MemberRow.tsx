import { Figure } from "@/components/Figure";
import { Mark, StageMarks, stateFor } from "./StageMarks";
import type { Member, Stage } from "./people";

/* ============================================================================
   One person, as two rows of the dossier.

   ROW ONE is the matrix row: the portrait and the name in the row header, then
   one cell under each of the six stage columns carrying the mark for that
   person at that stage. Read across and you have what one person is answerable
   for; read down a column and you have who stands at one stage. That is the
   whole point of the rebuild, and it is why the stages are no longer drawn a
   second time above the page as a track.

   ROW TWO is the biography, spanning the table and set in two columns on a
   wide screen. A biography is 90 words and the matrix row is 110px tall, so
   putting the biography INSIDE the row head was the first thing tried and it
   was wrong: it made the row 280px tall and left six mark cells with 240px of
   nothing under each mark. Spanning the table keeps the marks on a tight grid
   and gives the prose a measure of about 48 characters per column.

   BELOW 1024px the six mark cells are display:none and the table runs as a
   single column, so the marks move into the row header as a numbered strip and
   the stage names are carried once by StageKey above the table. Nothing is
   announced twice: whichever view is hidden is hidden with display:none, so it
   is out of the accessibility tree as well as off the screen.

   Mansi has no portrait, so her row is a different shape rather than a row
   with a hole in it: the identity simply starts at the column's left edge. No
   disc, no initial, no placeholder frame. An empty circle on a page about
   named people reads as a missing person.
   ========================================================================== */

export function MemberRows({
  m,
  stages,
  outside = false,
}: {
  m: Member;
  stages: Stage[];
  /** An adviser: the six cells are replaced by one statement that they do not
   *  apply, which is a stronger signal than six dashed boxes. */
  outside?: boolean;
}) {
  return (
    <>
      <tr>
        <th scope="row" className="hairline px-4 pb-4 pt-7 text-left align-top font-normal lg:pb-7">
          <div className="flex items-start gap-4">
            {/* Width on the wrapper: Figure's own w-full beats a w-* passed
                into className, which is a Tailwind ordering trap.

                Mansi has no portrait, and the slot stays EMPTY rather than
                carrying a disc, an initial or a labelled frame: an empty circle
                on a page about named people reads as a missing person. It does
                keep its width, though. Collapsing it moved her name 92px left
                of every other name in the column, which at a glance read as a
                layout bug rather than as an honest gap. */}
            <div className="w-[64px] shrink-0 sm:w-[76px] [&_picture]:block">
              {m.asset && (
                <Figure
                  asset={m.asset}
                  rounded="rounded-[var(--radius-sm)]"
                  className="aspect-square"
                  sizes="76px"
                />
              )}
            </div>
            <div className="min-w-0">
              <span className="t-h3 block font-bold leading-[1.25] text-ink">{m.name}</span>
              <span className="eyebrow eyebrow-sm mt-1.5 block">{m.role}</span>
              {!outside && (
                <div className="mt-4 lg:hidden">
                  <StageMarks named={m.named} team={m.team} stages={stages} />
                </div>
              )}
            </div>
          </div>
        </th>

        {outside ? (
          <td
            colSpan={stages.length}
            className="hairline hidden border-l border-rule px-4 align-middle lg:table-cell"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-body">
              Outside the six review stages
            </span>
          </td>
        ) : (
          stages.map((s, i) => {
            const n = i + 1;
            const state = stateFor(s, n, m.named, m.team);
            return (
              <td
                key={s.n}
                className={`hairline hidden px-3 text-center align-middle lg:table-cell ${
                  i === 0 ? "border-l border-rule" : ""
                }`}
              >
                <Mark state={state} />
                <span className="sr-only">
                  {s.stage}: {state === "named" ? "named here" : state === "team" ? "a team stage" : "not at this stage"}.
                </span>
              </td>
            );
          })
        )}
      </tr>

      <tr>
        <td colSpan={stages.length + 1} className="pb-8 pt-0">
          {/* THE BIOGRAPHY IS SET ON THE TABLE'S OWN COLUMNS, not in a text
              block under it. The first track is 30%, the same width as the
              column of names, so the first paragraph (the claim) sits under
              the person's name; the evidence for it sits under their marks.
              That is the one thing on this page that rewards a second look,
              and it only works because the padding matches the cells above:
              16px on the name track, 12px on the rest.

              CSS columns were the first attempt and they are wrong here. They
              balance by height, so a long paragraph and a short one landed two
              in the first column and one in the second, and nothing lined up
              with anything in the row above. */}
          <div className="px-4 lg:grid lg:grid-cols-[30%_minmax(0,1fr)_minmax(0,1fr)] lg:px-0">
            {m.bio.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                className={`t-body mb-3.5 max-w-[62ch] last:mb-0 lg:mb-0 lg:px-3 ${
                  i === 0 ? "text-ink lg:pl-4" : "text-body"
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        </td>
      </tr>
    </>
  );
}
