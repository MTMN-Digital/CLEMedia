import { Settle } from "@/components/Settle";
import type { Strand } from "@/components/journal/data";

/* ============================================================================
   The contents, as a ruled index.

   WHAT THIS REPLACED, 2026-10-27. Four strands as four tabbed cards laid on
   the bench, each with its own lean, its own tab position and its own depth
   off the surface, and every tab saying "in preparation". Four matched cards
   with the same status is the same stutter four times, and a staged object
   is the wrong register for a contents list: a journal's contents is a
   column of rules, not a desk.

   SO: one object, four rows, on the bench. The strand's name large on the
   left, what it is for in the middle, and the honest answer to what is in it
   as a mono label on the right. The label is INSIDE the object, which is the
   one place a mono label still lives on this site. Every description is the
   written one from data.ts, word for word, or the admin panel's if Conor has
   written his own.

   THE ORDINALS STAY GONE. `01 / THE RESEARCH` above a strand is the numbered
   mono eyebrow the house retired, and the strands have no order anyway.
   ========================================================================== */

export interface ContentsRow extends Strand {
  /** Published pieces in this strand. Counted from the CMS, never guessed. */
  count: number;
}

export function Contents({ rows }: { rows: ContentsRow[] }) {
  return (
    <div>
      {/* What the right hand column is. A short line in the object's own
          corner rather than a lead under the heading. */}
      <p className="t-sm ml-auto mb-4 max-w-[44ch] text-right opacity-85">
        The status beside each one is the honest answer to what is in it.
      </p>
      <Settle as="ol" className="border-t-[1.5px] border-edge-dark">
        {rows.map((row) => {
          const status =
            row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation";
          return (
            <li
              key={row.slug}
              className="grid gap-x-10 gap-y-3 border-b-[1.5px] border-edge-dark py-7 sm:py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(9rem,auto)] lg:items-baseline"
            >
              <h3 className="t-h3 max-w-[14ch]">{row.name}</h3>
              {row.blurb ? (
                <p className="t-body max-w-[54ch] opacity-85">{row.blurb}</p>
              ) : (
                <span className="hidden lg:block" aria-hidden="true" />
              )}
              <p className="tnum font-mono text-[13px] uppercase tracking-[0.14em] lg:text-right">
                {status}
              </p>
            </li>
          );
        })}
      </Settle>
    </div>
  );
}
