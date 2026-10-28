import type { ReactNode } from "react";

export interface FactRow {
  label: string;
  /** Null or empty: the row does not render. Never print a fact the client
   *  has not supplied; hide the row and log the gap in CONTENT-NEEDED.md. */
  value: ReactNode | null | undefined;
}

/**
 * Plain ruled fact rows for a sheet that is not a document (the case-study
 * protocol, the app's product sheet, the press kit's facts).
 *
 * A `dl`: 1.5px rule above every row and below the last, `dt` in mono 14px
 * uppercase, `dd` in `.t-body` ink. NO dotted leader and NO numerals
 * (cross-site rules 1 and 3): the leader is the journal's and the shop
 * docket's, the numerals are the documents'. Side by side from `sm`, the
 * label over the value on a phone.
 */
export function FactRows({
  rows,
  className = "",
  labelWidth = "9rem",
  tone = "paper",
}: {
  rows: FactRow[];
  className?: string;
  /** The label column at `sm` and up. */
  labelWidth?: "9rem" | "12rem";
  /** "dark" on the bench or grove: cream type and cream rules. */
  tone?: "paper" | "dark";
}) {
  const shown = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");
  if (!shown.length) return null;
  const cols = labelWidth === "12rem" ? "sm:grid-cols-[12rem_minmax(0,1fr)]" : "sm:grid-cols-[9rem_minmax(0,1fr)]";
  const rule = tone === "dark" ? "border-edge-dark" : "border-rule";
  const dt = tone === "dark" ? "text-raised" : "text-body";
  const dd = tone === "dark" ? "text-raised" : "text-ink";
  return (
    <dl className={`border-b-[1.5px] ${rule} ${className}`}>
      {shown.map((r) => (
        <div key={r.label} className={`grid gap-x-6 gap-y-1 border-t-[1.5px] ${rule} py-3 ${cols}`}>
          <dt className={`font-mono text-[14px] uppercase leading-[1.7] tracking-[0.16em] ${dt}`}>{r.label}</dt>
          <dd className={`t-body tnum ${dd}`}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
