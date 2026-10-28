import type { ReactNode } from "react";

/* ============================================================================
   One row of the protocol sheet.

   A margin column carrying ONE mono label (the section's heading, set small
   and tracked, sticky beside its content at `lg`) and a content column. A
   1.5px hairline above. The label is a plain string on purpose: the margin
   takes no numeral and no display face. Numbered margins belong to the two
   documents (/ethical-ai and the legal pages); this sheet uses labels alone.

   On a phone the margin becomes a single mono line above the content, and
   the full-width hairlines keep the page reading as one ruled sheet.
   ========================================================================== */

export function SheetRow({ id, label, children }: { children: ReactNode; id: string; label: string }) {
  return (
    <section
      aria-labelledby={id}
      className="proto-row hairline grid gap-y-5 py-10 sm:py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-12 lg:py-14"
    >
      <h2
        id={id}
        className="font-mono text-[14px] font-normal uppercase leading-[1.7] tracking-[0.16em] text-body lg:sticky lg:top-28 lg:self-start"
      >
        {label}
      </h2>
      <div className="max-w-[72rem]">{children}</div>
    </section>
  );
}
