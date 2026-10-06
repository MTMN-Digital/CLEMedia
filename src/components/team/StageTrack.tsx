import { StageMarksLegend } from "./StageMarks";
import type { Stage } from "./people";

/* ============================================================================
   The stage axis of the dossier.

   WHAT THIS FILE USED TO BE, and why it is not that any more. Until 2026-10-06
   it drew a horizontal track across the top of the team page: six stages, with
   the portrait of whoever is answerable sitting on the track at each one. It
   worked, but the ledger of people underneath it carried the same six faces and
   the same six stage marks, so the page made its one argument twice and read as
   two pages stacked. The track is gone and the stages are now the COLUMNS of
   the ledger, which is the same information in one structure instead of two.

   So this file is the header row of that table, plus the same six stages as a
   plain list for the viewport where a seven column table cannot exist.

   Everything here sits on the sunken fill, where muted ink is AA-large only, so
   the small type is set in body ink and the mono label in the deep red, which
   measures 5.1:1 on this fill.
   ========================================================================== */

/** The header row. The corner cell carries the key to the marks, because the
 *  one cell that is neither a stage nor a person is where a printed table puts
 *  its key, and it was the only thing on the page competing with the h2. */
export function StageHeadRow({ stages }: { stages: Stage[] }) {
  return (
    <tr>
      {/* Widths live on the header cells, not in a colgroup. A colgroup would
          set widths on columns whose cells are display:none below 1024px and
          the browsers disagree about what a fixed table does with those; a
          width on a header cell is simply ignored when the header itself is
          display:none, which is the behaviour the collapsed view needs. */}
      <th scope="col" className="w-[30%] bg-sunken px-4 pb-5 pt-6 text-left align-bottom">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-body">
          How to read this
        </span>
        <StageMarksLegend className="mt-3.5" />
      </th>
      {stages.map((s, i) => (
        <th
          key={s.n}
          scope="col"
          className={`w-[11.66%] bg-sunken px-3 pb-5 pt-6 text-left align-top ${i === 0 ? "border-l border-[var(--color-rule)]" : ""}`}
        >
          <span className="tnum block font-mono text-[12px] tracking-[0.14em] text-body" aria-hidden="true">
            {s.n}
          </span>
          <span className="mt-1.5 block text-[14.5px] font-bold leading-[1.28] text-ink">
            <span className="sr-only">Stage {Number(s.n)}. </span>
            {s.stage}
          </span>
          <span className="eyebrow mt-2 block !text-[10px] !tracking-[0.1em]">{s.who}</span>
          <span className="mt-2.5 block text-[12px] leading-[1.5] text-body">{s.checks}</span>
          {s.hold && (
            <span className="mt-2.5 flex items-start gap-1.5 font-mono text-[10px] uppercase leading-[1.4] tracking-[0.1em] text-red-deep">
              <span aria-hidden="true" className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-deep" />
              A release can be held here
            </span>
          )}
        </th>
      ))}
    </tr>
  );
}

/** The same six stages for the collapsed view, where the table has one column
 *  and no header. Hairline rows on the sunken band, so the reader meets the
 *  sequence once before meeting the marks that refer to it. */
export function StageKey({ stages }: { stages: Stage[] }) {
  return (
    <ol>
      {stages.map((s) => (
        <li key={s.n} className="hairline grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-4 first:border-t-0 first:pt-0">
          <span className="tnum pt-0.5 font-mono text-[12px] tracking-[0.12em] text-body" aria-hidden="true">
            {s.n}
          </span>
          <span>
            <span className="block text-[15px] font-bold leading-[1.3] text-ink">
              <span className="sr-only">Stage {Number(s.n)}. </span>
              {s.stage}
            </span>
            <span className="eyebrow mt-1.5 block !text-[10px]">{s.who}</span>
            <span className="mt-2 block text-[13px] leading-[1.55] text-body">{s.checks}</span>
            {s.hold && (
              <span className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-red-deep">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-deep" />
                A release can be held here
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
