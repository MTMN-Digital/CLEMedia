/* ============================================================================
   The empty shelf.

   Nothing is on sale, so the shelf is drawn empty on purpose: three blank
   sheets stood up on a board, one for each kind of thing being prepared. They
   carry no artwork, title, price or count, because none of those exist. The
   shapes are the same proportion as the printed sheet at the top of the page,
   so the page keeps one object and shows it first made, then waiting.

   Decoration only: the text under each sheet is the content, so the sheets
   are hidden from assistive tech.
   ========================================================================== */

export interface ShelfKind {
  kind: string;
  line: string;
}

const LEAN = ["tilt-a", "", "tilt-b"] as const;

export function EmptyShelf({ kinds }: { kinds: ShelfKind[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-3 lg:gap-x-14">
      {kinds.map((k, i) => (
        <li key={k.kind}>
          <div aria-hidden="true" className="flex h-[19rem] items-end justify-center sm:h-[17rem] lg:h-[20rem]">
            <div
              className={`${LEAN[i % LEAN.length]} aspect-[1/1.3] h-[calc(100%-1rem)] border border-dashed border-rule bg-raised/50 px-6 pt-8`}
            >
              {/* Ruled lines where the artwork will be. Quiet on purpose. */}
              {[0, 1, 2, 3, 4].map((n) => (
                <div key={n} className="mb-5 border-t border-rule-soft" style={{ width: n === 0 ? "55%" : "100%" }} />
              ))}
            </div>
          </div>
          {/* The board the sheet would stand on. */}
          <div aria-hidden="true" className="h-[10px] border-y border-rule bg-paper-3" />
          <p className="mt-6 text-[17px] font-semibold text-ink">{k.kind}</p>
          <p className="mt-1.5 max-w-[34ch] text-[15px] leading-[1.6] text-body">{k.line}</p>
        </li>
      ))}
    </ul>
  );
}
