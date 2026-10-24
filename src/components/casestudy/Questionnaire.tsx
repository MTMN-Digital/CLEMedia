import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { STUDY_OPEN } from "./config";
import type { RouteId } from "./RoutePicker";
import { OFFLINE, SETTINGS, OPEN, SCALE, AGES, type Choice, ROLES, SIZES, STATEMENTS } from "./questions";

/* ============================================================================
   The educator questionnaire.

   GATED BY STUDY_OPEN (config.ts). The client requires the participant
   information and the handling of responses to be agreed before this collects
   anything, and they are not. So while the gate is false:
     - the whole form renders and can be read, in full, in order;
     - every field is disabled, and a notice ABOVE the form says so in words,
       so nothing is switched off silently;
     - the submit handler returns before any request, as well as the button
       being inert, so a form submitted by some other route still sends
       nothing;
     - the confirmation panel exists but cannot be reached.
   Opening the study is a change to STUDY_OPEN and nothing here.

   Every question's wording is a draft: see questions.ts.
   ========================================================================== */

/* One group of radios as pills, the same control as the enquiry type on
   /contact. Native inputs, visually hidden, so it is keyboard and screen
   reader operable; `disabled` is honest while the study is closed. */
function Pills({
  name, legend, options, value, onChange, closed, required = true,
}: {
  name: string;
  legend: string;
  onChange: (v: string) => void;
  closed: boolean;
  options: Choice[];
  value: string;
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className="field-label">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <label
            key={o.value}
            className={`chip ${closed ? "cursor-not-allowed" : ""}`}
            data-on={value === o.value ? "" : undefined}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              disabled={closed}
              required={required}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Questionnaire({ route }: { route: RouteId }) {
  const closed = !STUDY_OPEN;
  const [a, setA] = useState<Record<string, string>>({});
  const set = (k: string) => (v: string) => setA((d) => ({ ...d, [k]: v }));
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* The gate, enforced here as well as on the button. */
    if (!STUDY_OPEN) return;
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/study-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fd), ...a, route }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error ?? "Could not save your answers. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not save your answers. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }

  /* The confirmation. Moves focus into itself so a keyboard or screen reader
     user lands on it rather than on a form that has vanished. */
  if (sent) {
    return (
      <div
        role="status"
        tabIndex={-1}
        ref={(el) => el?.focus()}
        className="card rounded-[var(--radius-lg)] px-6 py-8 sm:px-8"
      >
        <h3 className="t-h2 max-w-[16ch]">Thank you. Your answers are in.</h3>
        <p className="t-body mt-4 max-w-[52ch] text-body">
          We have saved your questionnaire. You do not need to do anything else, and you will not
          be added to a mailing list. If you gave an email address it will only be used to follow
          up on this study.
        </p>
      </div>
    );
  }

  const offlineUsed = a.offline_activity !== undefined && a.offline_activity !== "none";

  return (
    <div>
      {/* Plain, and above the form rather than below it. Not an apology. */}
      {closed && (
        <div role="note" className="mb-8 rounded-[var(--radius-md)] border border-ink bg-raised px-5 py-5 sm:px-6">
          <p className="t-h3">The study has not opened, so this cannot be filled in yet.</p>
          <p className="t-body mt-2 max-w-[60ch] text-body">
            You can read every question below. Nothing you type here can be sent, and the fields
            are switched off for that reason. Before the study opens we will publish the
            participant information and say what happens to the answers. When it opens, this same
            form will start taking responses and this notice will go.
          </p>
        </div>
      )}

      <form onSubmit={submit} aria-describedby="draft-note">
        {/* Honeypot, no CAPTCHA, which would cost us accessibility. */}
        <div aria-hidden="true" className="absolute left-[-9999px]">
          <label htmlFor="study-website">Leave this empty</label>
          <input id="study-website" name="company_website" tabIndex={-1} autoComplete="off" />
        </div>

        <p id="draft-note" className="t-sm max-w-[60ch] text-body">
          Draft questions, awaiting approval by the education adviser. The final wording may
          change before the study opens. Route selected: {route === "ireland" ? "Ireland (Aistear)" : "England (EYFS)"}.
        </p>

        <div className="mt-8 grid gap-8">
          <Pills name="role" legend="Your role" options={ROLES} value={a.role ?? ""} onChange={set("role")} closed={closed} />
          <Pills name="setting" legend="Where you work" options={SETTINGS} value={a.setting ?? ""} onChange={set("setting")} closed={closed} />
          <Pills name="age_band" legend="Age of the children" options={AGES} value={a.age_band ?? ""} onChange={set("age_band")} closed={closed} />
          <Pills name="group_size" legend="How many children were in the group" options={SIZES} value={a.group_size ?? ""} onChange={set("group_size")} closed={closed} />
          <Pills name="offline_activity" legend="How much of Paula's offline activity did you do" options={OFFLINE} value={a.offline_activity ?? ""} onChange={set("offline_activity")} closed={closed} />
        </div>

        <div className="mt-12 grid gap-8 border-t border-rule pt-10">
          <p className="t-body max-w-[60ch] text-body">
            How far do you agree with each statement about episode 003, Chicken Vision?
          </p>
          {STATEMENTS.filter((s) => !s.onlyIfOffline || offlineUsed || closed).map((s) => (
            <Pills
              key={s.field}
              name={s.field}
              legend={s.text}
              options={SCALE}
              value={a[s.field] ?? ""}
              onChange={set(s.field)}
              closed={closed}
            />
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-rule pt-10">
          {OPEN.map((q) => (
            <div key={q.field}>
              <label htmlFor={`q-${q.field}`} className="field-label">
                {q.text} <span className="opt">(optional)</span>
              </label>
              <textarea
                id={`q-${q.field}`}
                name={q.field}
                rows={5}
                maxLength={2000}
                disabled={closed}
                className="field-textarea"
              />
            </div>
          ))}
          <div>
            <label htmlFor="q-contact" className="field-label">
              Email, if you are happy for us to follow up on this study <span className="opt">(optional)</span>
            </label>
            <input
              id="q-contact"
              name="contact_email"
              type="email"
              autoComplete="email"
              maxLength={320}
              disabled={closed}
              className="field-input"
            />
          </div>
        </div>

        {error && <p role="alert" className="t-sm mt-6 font-medium text-red-deep">{error}</p>}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button type="submit" disabled={closed || busy}>
            {closed ? "Opens with the study" : busy ? "Sending" : "Send my answers"}
            <IconArrow size={16} />
          </Button>
          <p className="t-sm text-body">
            {closed ? "Submission is switched off until the study opens." : "Questions without \"optional\" are required."}
          </p>
        </div>
      </form>
    </div>
  );
}
