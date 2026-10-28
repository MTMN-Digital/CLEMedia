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

const FOR = [
  {
    who: "For the child",
    line: "A pace a young child can follow, and an episode that ends rather than rolls into the next one.",
  },
  {
    who: "For the parent",
    line: "No in-game purchases and no algorithmic recommendations, so nothing in it is designed to keep a child watching.",
  },
  {
    who: "For the educator",
    line: "Learning intent set before production and checked by an early years specialist, with printable activities that take it off the screen.",
  },
];

export function ForTheChild() {
  return (
    <dl className="border-b-[1.5px] border-rule">
      {FOR.map((f) => (
        <div key={f.who} className="hairline py-4">
          <dt className="font-mono text-[14px] uppercase tracking-[0.12em] text-body">{f.who}</dt>
          <dd className="t-body mt-1.5 max-w-[58ch] text-ink">{f.line}</dd>
        </div>
      ))}
    </dl>
  );
}
