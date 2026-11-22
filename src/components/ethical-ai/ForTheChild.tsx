/* ============================================================================
   What the reviews are for: sub-clause 2.7 of the Responsible AI position.

   WHAT THIS REPLACES. Until 2026-10-24 this slot held a ruled, empty ledger
   waiting for the first episode the review sent back: "Held for the first
   case", with six blank rules under it and a line saying a process that can
   stop the work is only worth the claim if we are willing to show it
   stopping the work.

   It was true, it was honest, and the client's review document of 22 October
   asks for it to go: "Please also remove repeated language about being
   answerable, holding releases back and nothing being published
   automatically. Explain the review process clearly once, then use the
   remaining space to show the value for children, parents and educators."

   Clause 2 explains the process once. So this is the remaining space, spent
   the way the document asks. Every line below is the company's own
   commitment from its own documents, and not one of them is a claim about
   what the review caught, because nothing has been supplied about what the
   review caught.

   UNBOXED 2026-10-28. It used to sit in a rounded, bordered box beside the
   drawing: a sheet on a sheet, once the page became a document. It is three
   ruled rows now, the mono `dt` over a 17px `dd`, under a sub-clause heading
   the page file sets.
   ========================================================================== */

import { useList } from "@/lib/content";
import { FOR_ITEMS } from "./lists";

export function ForTheChild() {
  const items = useList("ethical-ai", "for.items", FOR_ITEMS);
  return (
    <dl className="border-b-[1.5px] border-rule">
      {items.map((f, i) => (
        <div key={i} className="hairline py-4">
          <dt className="font-mono text-[14px] uppercase tracking-[0.12em] text-body">{f.who}</dt>
          <dd className="t-body mt-1.5 max-w-[58ch] text-ink">{f.line}</dd>
        </div>
      ))}
    </dl>
  );
}
