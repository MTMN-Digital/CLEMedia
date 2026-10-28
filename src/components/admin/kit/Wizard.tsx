import { type ReactNode, useEffect, useState, useRef } from "react";
import { AdminButton } from "./basics";
import type { SaveStatus } from "./feedback";

/* ============================================================================
   Making something new, one step at a time.

   The same fields the edit view holds, split into a few short steps with the
   list of steps beside them (above them on a phone). Next never goes dead: if
   a step is missing something, pressing it says what, by the field and in the
   footer, and stays put. A finished step shows its answer in the list and can
   be gone back to. The last step's button is the editor's own save, so a new
   thing is made exactly the way an edited one is saved.
   ========================================================================== */

export interface WizardStep {
  title: string;
  /** What this step was answered with, shown in the list once it is passed. */
  answer?: string | null;
  /** The first thing still missing on this step, or null when it is complete. */
  error?: string | null;
  body: ReactNode;
}

export function Wizard({
  steps,
  onFinish,
  finishLabel,
  finishingLabel = "Saving",
  status,
  onShowErrors,
}: {
  steps: WizardStep[];
  onFinish: () => void;
  finishLabel: string;
  finishingLabel?: string;
  status: SaveStatus;
  /** True when Next is pressed on an incomplete step, so its fields show their
      errors; false on moving to another step, so a new step starts clean. */
  onShowErrors: (show: boolean) => void;
}) {
  const [at, setAt] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [reached, setReached] = useState(0);
  const head = useRef<HTMLHeadingElement>(null);
  const last = at === steps.length - 1;
  const step = steps[at];

  // A new step takes the focus to its title, so a screen reader hears where it is.
  const shown = useRef(at);
  useEffect(() => {
    if (shown.current === at) return;
    shown.current = at;
    head.current?.focus();
  }, [at]);

  function go(i: number) {
    setBlocked(false);
    onShowErrors(false);
    setAt(i);
    setReached((r) => Math.max(r, i));
  }

  function next() {
    if (step.error) {
      setBlocked(true);
      onShowErrors(true);
      return;
    }
    if (last) onFinish();
    else go(at + 1);
  }

  let footer: ReactNode = steps[at + 1] ? null : "Check it over, then finish.";
  let tone = "idle";
  if (blocked && step.error) {
    footer = step.error;
    tone = "error";
  } else if (status.kind === "error") {
    footer = status.message;
    tone = "error";
  } else if (status.kind === "saving") footer = `${finishingLabel}...`;

  return (
    <form
      className="adm-wiz"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
    >
      <ol className="adm-wiz__rail" aria-label="Steps">
        {steps.map((s, i) => {
          const state = i === at ? "current" : i < at || i <= reached ? "done" : "todo";
          const canGo = i !== at && i <= reached;
          return (
            <li key={s.title} data-state={state} aria-current={i === at ? "step" : undefined}>
              <button type="button" disabled={!canGo} onClick={() => go(i)}>
                <span className="adm-wiz__num" aria-hidden="true">
                  {state === "done" ? (
                    <svg width="14" height="14" viewBox="0 0 16 16">
                      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0">
                  <strong>{s.title}</strong>
                  {state === "done" && s.answer && <span>{s.answer}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="adm-wiz__step" aria-labelledby="adm-wiz-h">
        <p className="adm-label">
          Step {at + 1} of {steps.length}
        </p>
        <h2 id="adm-wiz-h" ref={head} tabIndex={-1} className="adm-wiz__title">
          {step.title}
        </h2>
        <div className="adm-stack">{step.body}</div>
      </section>

      <div className="adm-savebar adm-wiz__foot">
        <p className="adm-savebar__status" data-tone={tone} role={tone === "error" ? "alert" : "status"} aria-live="polite">
          {footer}
        </p>
        <div className="adm-savebar__actions">
          {at > 0 && (
            <AdminButton variant="quiet" onClick={() => go(at - 1)}>
              Back
            </AdminButton>
          )}
          <AdminButton type="submit" busy={status.kind === "saving"} busyLabel={finishingLabel}>
            {last ? finishLabel : `Next: ${steps[at + 1].title.toLowerCase()}`}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}
