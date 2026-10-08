import { Settle } from "@/components/Settle";
import type { Strand } from "@/components/journal/data";

/* ============================================================================
   The contents.

   Four strands, each set as a row: the name large on the left, what it is for
   and its status on the right, the same left heading and right body shape the
   Story page uses. Four boxes would say "four features"; rows with a rule
   between them say "a publication with sections", which is the true statement.

   The status never carries a date or a count the client has not got: an empty
   strand reads "In preparation", a filled one reads the real number of
   published pieces, counted from the CMS.
   ========================================================================== */

export interface ContentsRow extends Strand {
  /** Published pieces in this strand. Counted from the CMS, never guessed. */
  count: number;
}

export function Contents({ rows }: { rows: ContentsRow[] }) {
  return (
    <Settle as="ol" className="border-t border-rule">
      {rows.map((row, i) => {
        const status =
          row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation";
        return (
          <li
            key={row.slug}
            className="grid gap-x-12 gap-y-4 border-b border-rule py-9 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
          >
            <div className="flex items-baseline gap-5">
              <span className="tnum font-mono text-[13px] text-muted" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.04] tracking-[-0.01em] text-ink">
                {row.name}
              </h3>
            </div>
            <div className="min-w-0 pl-0 sm:pl-[2.2rem] lg:pl-0">
              {row.blurb && <p className="t-lead max-w-[46ch] text-ink">{row.blurb}</p>}
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-body">{status}</p>
            </div>
          </li>
        );
      })}
    </Settle>
  );
}
