import type { Stage } from "./people";

/* ============================================================================
   Six marks against a name: the review sequence seen from the person's side.

   Filled: the company's account names this person at that stage. Solid
   border: a stage the whole team takes. Dashed border: not at this stage. The
   adviser renders none of these, which is the visible difference between a
   core member and an adviser before any heading is read.

   The state lives on the border, never on the digit's opacity: the digit is
   the only visual label for which stage a mark refers to, so it stays at AA
   (muted ink on the paper ground is 5.9:1) in every state.

   Numbers are aria-hidden and the state is spoken instead, so a screen reader
   hears "Stage 3, Educational review, named here" rather than six digits.
   ========================================================================== */

type State = "named" | "team" | "none";

const LOOK: Record<State, string> = {
  named: "bg-red-deep text-raised",
  team: "border border-body text-body",
  none: "border border-dashed border-rule text-muted",
};

const SPOKEN: Record<State, string> = {
  named: "named here",
  team: "a team stage",
  none: "not at this stage",
};

function Mark({ n, state }: { n: number; state: State }) {
  return (
    <span
      className={`tnum flex h-7 w-7 items-center justify-center rounded-[6px] font-mono text-[11px] ${LOOK[state]}`}
    >
      <span aria-hidden="true">{n}</span>
    </span>
  );
}

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
        const state: State = named.includes(n) ? "named" : team && s.shared ? "team" : "none";
        return (
          <li key={s.n}>
            <Mark n={n} state={state} />
            <span className="sr-only">
              Stage {n}, {s.stage}: {SPOKEN[state]}.
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** The key to the marks. Rendered once, beside the rows that use them. */
export function StageMarksLegend() {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-body">
      <div className="flex items-center gap-2.5">
        <dt><Mark n={1} state="named" /></dt>
        <dd>Named at the stage</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt><Mark n={5} state="team" /></dt>
        <dd>A stage the whole team takes</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt><Mark n={2} state="none" /></dt>
        <dd>Not at this stage</dd>
      </div>
    </dl>
  );
}
