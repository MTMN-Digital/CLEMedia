import { Settle } from "@/components/Settle";
import type { Strand } from "@/components/journal/data";

/* ============================================================================
   The contents.

   A printed contents page: index number, the strand set large, leader dots
   running across the gap, and the status in the right margin where a page
   number would be. That shape is the whole argument for it. Four strands laid
   out as four boxes says "here are four features"; the same four as a contents
   page says "this is a publication with sections, and here is what is in each
   of them", which is the true statement and the more serious one.

   The leaders are a flexed hairline rather than a row of full stops, because a
   repeated character does not stay on the baseline across a fluid width and
   broke onto two lines at 390. They are hidden below `sm`, where there is no
   gap left to lead across.

   The right margin never carries a date or a count the client has not got: an
   empty strand reads "In preparation", a filled one reads the real number of
   published pieces.
   ========================================================================== */

export interface ContentsRow extends Strand {
  /** Published pieces in this strand. Counted from the CMS, never guessed. */
  count: number;
}

export function Contents({ rows }: { rows: ContentsRow[] }) {
  return (
    <Settle as="ol" className="mt-10 border-t border-rule sm:mt-14">
      {rows.map((row, i) => (
        <li
          key={row.slug}
          className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-9"
        >
          <span className="tnum pt-[0.45em] font-mono text-[13px] text-muted" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-4">
              <h3 className="font-display text-[clamp(1.4rem,1.1rem+1.4vw,2.4rem)] leading-[1.06] text-ink">
                {row.name}
              </h3>
              {/* The leaders are drawn off `muted` at a third, not off `rule`:
                  at the rule's own alpha they vanished against the card, and
                  the status in the margin then read as floating free of the
                  strand it belongs to. */}
              <span
                className="hidden h-0 flex-1 translate-y-[-0.25em] border-b border-dotted border-muted/35 sm:block"
                aria-hidden="true"
              />
              <span className="hidden shrink-0 font-mono text-[12px] uppercase tracking-[0.14em] text-muted sm:block">
                {row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation"}
              </span>
            </div>
            {row.blurb && (
              <p className="t-body mt-3.5 max-w-[62ch] text-body">{row.blurb}</p>
            )}
            <span className="mt-3 block font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted sm:hidden">
              {row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation"}
            </span>
          </div>
        </li>
      ))}
    </Settle>
  );
}
