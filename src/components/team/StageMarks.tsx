import type { Stage } from "./people";

/* ============================================================================
   One mark: does this person stand at this stage.

   Filled: the company's account names this person at that stage. Solid
   border: a stage the whole team takes. Dashed border: not at this stage. The
   adviser renders none of these, which is the visible difference between a
   core member and an adviser before any heading is read.

   TWO PLACES, ONE MARK. In the dossier table the mark sits in a cell under a
   stage column, so the column head says which stage it is and the mark carries
   no digit. Below 1024px the table collapses to one column and the stage
   columns are gone, so the same six marks run as a strip inside the person's
   own cell and the digit comes back, because there is nothing else left to say
   which stage a mark belongs to.

   The state lives on the border and the fill, never on a digit's opacity: the
   digit is the only visual label for which stage a mark refers to, so it stays
   at AA (muted ink on the paper ground is 5.9:1) in every state.

   Numbers are aria-hidden and the state is spoken instead, so a screen reader
   hears "Stage 3, Educational review, named here" rather than six digits.
   ========================================================================== */

export type MarkState = "named" | "team" | "none";

const LOOK: Record<MarkState, string> = {
  named: "border border-red-deep bg-red-deep text-raised",
  team: "border border-body text-body",
  none: "border border-dashed border-rule text-muted",
};

const SPOKEN: Record<MarkState, string> = {
  named: "named here",
  team: "a team stage",
  none: "not at this stage",
};

/** Which state a person is in at a given stage. One rule, used by both views. */
export function stateFor(stage: Stage, n: number, named: number[], team: boolean): MarkState {
  if (named.includes(n)) return "named";
  if (team && stage.shared) return "team";
  return "none";
}

export function Mark({ n, state }: { n?: number; state: MarkState }) {
  return (
    <span
      className={`tnum inline-flex h-7 w-7 items-center justify-center rounded-[6px] font-mono text-[11px] ${LOOK[state]}`}
    >
      {n !== undefined && <span aria-hidden="true">{n}</span>}
    </span>
  );
}

/** The strip: six marks against one name, for the collapsed single column. */
export function StageMarks({
  named,
  team,
  stages,
}: {
  named: number[];
  team: boolean;
  stages: Stage[];
}) {
  return (
    <ol className="flex flex-wrap gap-1.5" aria-label="Review stages">
      {stages.map((s, i) => {
        const n = i + 1;
        return (
          <li key={s.n}>
            <Mark n={n} state={stateFor(s, n, named, team)} />
            <span className="sr-only">
              Stage {n}, {s.stage}: {SPOKEN[stateFor(s, n, named, team)]}.
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** The key to the marks. It lives in the table's corner cell, which is where a
 *  printed table puts its key: the one cell that is neither a stage nor a
 *  person. Stacked rather than in a row, because the corner cell is the width
 *  of the name column and a row of three ran under the first stage column. */
export function StageMarksLegend({ className = "" }: { className?: string }) {
  return (
    <dl className={`flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-body ${className}`}>
      <div className="flex items-center gap-2.5">
        <dt><Mark state="named" /></dt>
        <dd>Named at the stage</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt><Mark state="team" /></dt>
        <dd>A stage the whole team takes</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt><Mark state="none" /></dt>
        <dd>Not at this stage</dd>
      </div>
    </dl>
  );
}
