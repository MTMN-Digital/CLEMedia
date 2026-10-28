import { Settle } from "@/components/Settle";
import type { Strand } from "@/components/journal/data";
import "./journal.css";

/* ============================================================================
   The contents: four strands as a ruled list with dotted leaders.

   REBUILT 2026-10-28 from the bench index. The same four rows now sit on
   bare paper: the strand's name on the left, a dotted leader, and the honest
   answer to what is in it on the right, the way a printed contents runs a
   name to a page number. Under each, what the strand is for, word for word
   from data.ts or the admin panel's override.

   The leader is this page's signature (docs/SUBPAGE-PLANS-2026-10-28.md,
   journal section 5). It draws itself from the name to the status as each
   row settles, and reduced motion shows it finished. The list is its own
   Settle so the draw happens when the list enters, not on page load.

   The names are h2s: on the index they follow the h1 directly, and on a
   missing post they follow that page's h1, so a level is never skipped.

   No note above the list, no heading reading the list out, no icons: four
   strand icons on a journal with no posts would be the tell.
   ========================================================================== */

export interface ContentsRow extends Strand {
  /** Published pieces in this strand. Counted from the CMS, never guessed. */
  count: number;
}

export function Contents({ rows }: { rows: ContentsRow[] }) {
  return (
    <Settle as="ol" className="border-t-[1.5px] border-rule">
      {rows.map((row) => {
        const status =
          row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation";
        return (
          <li key={row.slug} className="border-b-[1.5px] border-rule py-7 lg:py-9">
            <div className="jr-row">
              <h2 className="t-h3 text-ink">{row.name}</h2>
              <span className="leader" aria-hidden="true" />
              <p className="tnum font-mono text-[13px] uppercase tracking-[0.14em] text-muted sm:text-[14px]">
                {status}
              </p>
            </div>
            {row.blurb && <p className="t-body mt-3 max-w-[54ch] text-body">{row.blurb}</p>}
          </li>
        );
      })}
    </Settle>
  );
}
