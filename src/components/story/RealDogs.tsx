import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Card } from "@/components/ui";
import { ASSETS, type AssetKey } from "@/lib/brand";

/* ============================================================================
   Meet the real Finn and Fia.

   FROM THE CLIENT'S REVIEW DOCUMENT, 22 October 2026: "We would also like to
   use photographs of the real Finn and Fia. Place these on the Story page,
   with a clear introduction such as 'Meet the real Finn and Fia', alongside
   the animated characters... Keep the real dogs and animated characters
   clearly labelled."

   THE EIGHT PHOTOGRAPHS LANDED ON 2026-10-26, and this is now the only block
   of real photography on the site. Everything else here is a frame from the
   animated series.

   HOW THE LABELLING WORKS NOW, and why it changed. With two plates, each one
   carried "A photograph" in print. With eight, that is the same three words
   eight times down one screen, which stops being a label and becomes
   wallpaper. So the claim is made once, in the standing line above the
   gallery, where it is set as a sentence a reader cannot scroll past, and
   each plate carries the dog's name. Every alt text says "photographed" as
   well, so the two readings still match. A reader who sees any part of this
   block still learns that these are photographs and that the characters are
   drawn, which is the thing the review asked for.

   THE LAYOUT IS JUSTIFIED ON THE ASPECT RATIOS, not cropped to a grid. Each
   row is a flex line whose items grow in proportion to their own ratio, so
   every photograph in a row lands at exactly the same height while keeping
   its own shape: four portraits, four landscapes, no square crops, and no
   matched card grid. The arithmetic only works if the mount is taken out of
   it, which is what the 18px basis is: 8px of padding each side plus the
   card's 1px border. Growth then distributes the remaining width in
   proportion to the ratios alone, and the heights come out equal rather than
   nearly equal.

   THE RATIOS ARE READ OFF THE FILES through brand.ts, so a re-export at a
   different crop cannot silently break the justification.

   THE ROWS ARE WRITTEN DOWN rather than computed. Three rows of 3, 2 and 3,
   each mixing the two dogs and mixing portrait with landscape, which is what
   stops it reading as four of one then four of the other. A packing algorithm
   would re-derive the same three rows at one width and something worse at
   every other one.
   ========================================================================== */

type Plate = { asset: AssetKey; name: string };

const ROWS: Plate[][] = [
  [
    { asset: "dog.finn-1", name: "Finn" },
    { asset: "dog.fia-1", name: "Fia" },
    { asset: "dog.finn-4", name: "Finn" },
  ],
  [
    { asset: "dog.fia-2", name: "Fia" },
    { asset: "dog.finn-2", name: "Finn" },
  ],
  [
    { asset: "dog.fia-3", name: "Fia" },
    { asset: "dog.finn-3", name: "Finn" },
    { asset: "dog.fia-4", name: "Fia" },
  ],
];

/* Read off the file, never written down. A ratio typed to three places is
   half a percent out, which is two pixels of height across a row and two
   captions that no longer sit on one line. */
const ratio = (a: AssetKey) => ASSETS[a].width / ASSETS[a].height;

export function RealDogs({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle>
        <h2 id={headingId} className="t-h2 max-w-[18ch]">
          Meet the real Finn and Fia
        </h2>
        <p className="t-body mt-5 max-w-[58ch]">
          Finn and Fia in the series are drawn. <strong className="font-semibold text-ink">The
          eight below are photographs</strong> of the fawn pug and the black pug they are named
          after.
        </p>
      </Settle>

      <div className="mt-12 space-y-4 lg:mt-16 lg:space-y-5">
        {ROWS.map((row, i) => (
          <Settle key={i} className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            {row.map((p) => (
              <figure
                key={p.asset}
                /* 18px of mount, then every remaining pixel shared out in
                   proportion to the photograph's own shape. */
                style={{ flexGrow: ratio(p.asset), flexBasis: "18px" }}
                /* MEASURED, then rejected: wrapping the rows on a phone
                   instead of stacking them. A line of three at 390 wraps to
                   two, and two plates of different shapes across 350px put a
                   portrait at 118px wide, which is a thumbnail of a dog. It
                   also breaks the justification outright, because a plate
                   pinned to a minimum width no longer grows in proportion to
                   its ratio. One plate per line on a phone, full width. */
                className="min-w-0"
              >
                <Card className="card-still overflow-hidden p-2">
                  <Figure
                    asset={p.asset}
                    rounded="rounded-[var(--radius-md)]"
                    sizes="(min-width: 1024px) 40vw, 92vw"
                  />
                </Card>
                <figcaption className="mt-3 pl-1 font-mono text-[13px] uppercase tracking-[0.14em] text-body">
                  {p.name}
                </figcaption>
              </figure>
            ))}
          </Settle>
        ))}
      </div>
    </>
  );
}
