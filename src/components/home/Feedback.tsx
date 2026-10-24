import { Settle } from "@/components/Settle";
import { Lead, Kicker } from "@/components/ui";

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
  return (
    <>
      <Settle className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,30rem)] lg:items-end">
        <div>
          <Kicker>What people say</Kicker>
          <h2 id={headingId} className="t-h2 mt-5 max-w-[24ch]">
            Feedback from parents and educators
          </h2>
        </div>
        <Lead className="lg:pb-1">
          In their own words, with their permission. We do not turn what one family said into a
          percentage, and we do not print anything nobody has agreed to.
        </Lead>
      </Settle>

      {QUOTES.length > 0 ? (
        <Settle as="ul" className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:mt-18 lg:gap-x-16">
          {QUOTES.map((q) => (
            <li key={q.words.slice(0, 48)} className="border-t border-rule pt-7">
              <blockquote className="t-lead max-w-[42ch] text-ink">
                <p>{q.words}</p>
              </blockquote>
              <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                {q.from}
              </p>
            </li>
          ))}
        </Settle>
      ) : (
        /* The honest empty state, in the same voice the shop's empty shelf
           uses. A dashed edge says held open; a tinted panel says finished. */
        <Settle className="mt-12 grid gap-6 border-t border-rule pt-10 lg:mt-16 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-[var(--radius-lg)] border border-dashed border-rule p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Parents and educators
            </p>
            <p className="t-body mt-4 max-w-[46ch] text-body">
              Quotations from families and from educators who have used the episodes are being
              gathered, and each one goes up only with the wording and the attribution that
              person has agreed to.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-dashed border-rule p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Banteer workshop
            </p>
            <p className="t-body mt-4 max-w-[46ch] text-body">
              A school workshop has already run in Banteer, and the school's own account of it
              will be printed here under its own name. It is separate from the cross-border study
              we are preparing.
            </p>
          </div>
        </Settle>
      )}
    </>
  );
}
