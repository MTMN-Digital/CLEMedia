import type { ReactNode } from "react";

export interface StatusRow {
  label: string;
  /** Null or empty: the row does not render. A document hides a fact it does
   *  not have (Adopted, Approved by) rather than printing it empty. */
  value: ReactNode | null | undefined;
}

/**
 * A document's status rows: plain ruled `dt`/`dd` pairs, a 1.5px rule under
 * each, NO dotted leader. The leader is the journal's signature and the shop
 * docket's (cross-site rule 1 as settled by the journal and legal verdicts),
 * so the documents print their facts as plain furniture.
 *
 * Label left, value right on one line where it fits; a long value wraps under
 * its label on a phone rather than squeezing it.
 */
export function DocStatus({ rows, className = "" }: { rows: StatusRow[]; className?: string }) {
  const shown = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");
  if (!shown.length) return null;
  return (
    <dl className={className}>
      {shown.map((r) => (
        <div
          key={r.label}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-[1.5px] border-rule py-2.5"
        >
          <dt className="text-[15px] text-body">{r.label}</dt>
          <dd className="tnum text-right font-mono text-[15px] text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
