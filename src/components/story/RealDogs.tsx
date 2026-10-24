import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Card } from "@/components/ui";

/* ============================================================================
   Meet the real Finn and Fia.

   FROM THE CLIENT'S REVIEW DOCUMENT, 22 October 2026: "We would also like to
   use photographs of the real Finn and Fia. Place these on the Story page,
   with a clear introduction such as 'Meet the real Finn and Fia', alongside
   the animated characters... Keep the real dogs and animated characters
   clearly labelled."

   WHY THE LABELLING IS THE WHOLE POINT. This site's Responsible AI page turns
   on being straight about what is rendered and what is photographed, and this
   is the one block that puts the two side by side. So each plate says in print
   which it is, in the same mono the frames on this site are captioned in, and
   the label is not optional furniture: a reader who scrolls past at speed must
   still come away knowing which pair is a photograph.

   THE PHOTOGRAPHS HAVE NOT ARRIVED. Conor sent eight originals, four of each
   dog, in a folder whose link did not reach us. Both assets are `null` in
   brand.ts, so the Figure renders the house placeholder at the right shape
   with its own label, and this section is finished the moment two files land.
   Nothing here is a stand-in photograph, because the rule on this build is
   that a missing picture is a marked hole and never a borrowed one.
   ========================================================================== */

const DOGS = [
  {
    asset: "dog.finn",
    name: "Finn",
    line: "The fawn pug. Finn in the series is based on him.",
  },
  {
    asset: "dog.fia",
    name: "Fia",
    line: "The black pug. Fia in the series is based on her.",
  },
] as const;

export function RealDogs({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,44ch)] lg:items-end lg:gap-16">
        <div>
          <h2 id={headingId} className="t-h2 max-w-[18ch]">
            Meet the real Finn and Fia
          </h2>
        </div>
        <p className="t-body lg:pb-1">
          Finn and Fia in the series are drawn. These two are the pugs they are named after, and
          every plate below says which it is.
        </p>
      </Settle>

      <Settle as="ul" className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:gap-12">
        {DOGS.map((d, i) => (
          <li key={d.name}>
            <Card className={`card-still overflow-hidden p-2 ${i === 0 ? "tilt-a" : "tilt-b"}`}>
              <Figure
                asset={d.asset}
                rounded="rounded-[var(--radius-md)]"
                className="aspect-square"
                sizes="(min-width: 640px) 46vw, 92vw"
              />
            </Card>
            <figcaption className="mt-3.5 pl-1">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                A photograph
              </p>
              <p className="mt-1.5 text-[15.5px] leading-[1.6] text-ink">
                <strong className="font-semibold">{d.name}.</strong> {d.line}
              </p>
            </figcaption>
          </li>
        ))}
      </Settle>
    </>
  );
}
