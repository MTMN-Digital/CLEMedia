import { Settle } from "@/components/Settle";
import { useBlock, useSetting, useList } from "@/lib/content";
import { COPY } from "@/components/home/copy";
import { FEEDBACK_PANELS } from "@/components/home/lists";

/* ============================================================================
   Feedback from parents and educators.

   WHAT THIS REPLACES. Until 2026-10-24 this slot held "Tested in homes and
   schools": four measurement figures drawn as `[__]` from the creative
   director's revision of the home page, with a note under them saying the
   numbers were owed. It was built that way deliberately, so that anyone
   opening the page could see exactly what was missing.

   The client's review document of 22 October replaces it: "For now, replace
   the empty statistics counters with a section titled Feedback from parents
   and educators. Conor has parent and teacher quotes ready to supply. Use
   their exact approved wording and agreed attribution, with permission. Do
   not invent quotations or convert individual experiences into percentages."

   That is the right call and it is worth saying why. Four figures nobody had
   measured were four claims waiting to be made. A quotation is a smaller
   claim and a checkable one: a real person said a real sentence and agreed to
   it being printed.

   SO THIS SHIPS EMPTY, the same way the figures did, and for the same reason.
   `QUOTES` is empty until the client supplies the approved wording and the
   attribution each person has agreed to. Nothing here is written for them and
   nothing is drafted "as a placeholder", because a drafted quotation is a
   fabricated one the moment somebody forgets it was a draft.

   THE BANTEER WORKSHOP IS SEPARATE, by instruction: it is a completed school
   workshop, not part of the planned cross-border study, and it is "a
   separately attributed school account". Its letter has not been supplied
   either, so its slot is its own and says so.
   ========================================================================== */

export interface Quote {
  /** The approved wording, exactly as agreed. Never edited for length. */
  words: string;
  /** The attribution the person agreed to, which may be partial. */
  from: string;
}

/* Empty until Conor supplies them with permission. CONTENT-NEEDED.md. */
export const QUOTES: Quote[] = [];

export function Feedback({ headingId }: { headingId: string }) {
  /* Entered in the admin (Quotes), stored as the `quotes` setting. */
  const heading = useBlock("home", "feedback.heading", COPY["feedback.heading"]);
  const panels = useList("home", "feedback.panels", FEEDBACK_PANELS);
  const note = useBlock("home", "feedback.note", COPY["feedback.note"]);
  const quotes = useSetting("quotes", { items: QUOTES }).items.filter((q) => q.words?.trim());
  return (
    <>
      {/* THE OPENER IS ONE LINE, 2026-10-27. "Feedback from parents and
          educators" was a label, and the two panels under it are already
          headed "Parents and educators" and "Banteer workshop", so it was
          also the third time the same words appeared inside 400 pixels. The
          claim is the heading now and the policy sentence has moved under the
          panels, where it reads as the note it is. */}
      <Settle>
        <h2 id={headingId} className="t-h2 max-w-[22ch]">
          {heading}
        </h2>
      </Settle>

      {quotes.length > 0 ? (
        <Settle key="quotes" as="ul" className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:mt-18 lg:gap-x-16">
          {quotes.map((q) => (
            <li key={q.words.slice(0, 48)} className="border-t-[1.5px] border-rule pt-7">
              <blockquote className="t-lead max-w-[42ch] text-ink">
                <p>{q.words}</p>
              </blockquote>
              <p className="mt-5 font-mono text-[14.5px] uppercase tracking-[0.14em] text-muted">
                {q.from}
              </p>
            </li>
          ))}
        </Settle>
      ) : (
        /* The honest empty state, in the same voice the shop's empty shelf
           uses. A dashed edge says held open; a tinted panel says finished. */
        <Settle key="empty" className="mt-12 grid gap-6 border-t-[1.5px] border-rule pt-10 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          {panels.map((p, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-[color:var(--color-edge)] p-6 sm:p-7">
              <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
                {p.label}
              </p>
              <p className="t-body mt-4 max-w-[46ch] text-body">{p.body}</p>
            </div>
          ))}
          <p className="t-body lg:col-span-2">
            {note}
          </p>
        </Settle>
      )}
    </>
  );
}
