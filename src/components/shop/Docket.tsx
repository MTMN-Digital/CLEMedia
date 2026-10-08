import type { ReactNode } from "react";

/* ============================================================================
   The docket.

   A till receipt, torn off at the top. It carries the terms of a purchase as
   figures in a mono column rather than as three cards explaining how buying
   works, which is what this page used to do and what every page on the
   internet does.

   It is used twice: on /shop it states what a purchase will be before you
   make one, and on /download it states what the purchase was. Same object,
   same rules, so the promise and the receipt are visibly the same document.

   The torn edge is a sawtooth drawn in the card's own colour over the ground,
   not a border-image: a border-image loses the warm paper fill at the notch
   and the tear reads as a dark comb. Rows are tabular so the figures line up
   in a column, which is the whole point of setting terms as a receipt.
   ========================================================================== */

export interface DocketRow {
  k: string;
  v: ReactNode;
  /** Pull the eye to one row. Used for the figure that actually matters. */
  strong?: boolean;
}

export function Docket({
  label,
  rows,
  foot,
  className = "",
}: {
  label: string;
  rows: DocketRow[];
  foot?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* The tear. Triangles in the sheet colour, sitting on the ground. */}
      <div
        aria-hidden="true"
        className="h-[9px] w-full"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-raised) 25%, transparent 25%), linear-gradient(-135deg, var(--color-raised) 25%, transparent 25%)",
          backgroundSize: "11px 11px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
        }}
      />
      <div className="border border-t-0 border-rule bg-raised px-5 py-6 sm:px-7">
        <p className="eyebrow">{label}</p>

        <dl className="mt-5 font-mono text-[13px] leading-[1.5]">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline gap-2 py-[7px]">
              <dt className={r.strong ? "text-ink" : "text-body"}>{r.k}</dt>
              {/* The leader. A receipt lines its figures up with dots. */}
              <span
                aria-hidden="true"
                className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-rule"
              />
              <dd /* Not `shrink-0`: a product title is one of these values and a long
                   one pushed the row 26px past a 390 screen. It still takes its
                   natural width while there is room, and breaks when there is not. */
                className={`tnum min-w-0 break-words text-right ${r.strong ? "text-[15px] font-semibold text-ink" : "text-ink"}`}>
                {r.v}
              </dd>
            </div>
          ))}
        </dl>

        {foot && <p className="mt-5 border-t border-rule pt-5 text-[13.5px] leading-[1.6] text-body">{foot}</p>}
      </div>
    </div>
  );
}
