import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { DrawnCorner } from "@/components/draw/kit";
import type { AssetKey } from "@/lib/brand";
import "./dogs.css";

/* ============================================================================
   The eight photographs of the real Finn and Fia.

   WHAT THIS REPLACED, 2026-10-27. A justified gallery: four rows of two or
   three pictures at their own proportions, which read as a contact sheet and
   gave the two dogs equal, undifferentiated weight. The client asked for one
   rectangle holding all eight, one large portrait of each dog, and the other
   six arranged so the two sets coil around each other.

   SO IT IS A FOUR BY FOUR, FULLY TILED. Each big portrait is a two by two
   block on the diagonal, and the block beside it holds three frames of the
   OTHER dog: fawn mass at the top left, dark mass at the bottom right, each
   anchored by the other dog's pictures. That is the yin and yang reading the
   client asked for, and it stays a true rectangle with no gap in it.

   THE CROPS ARE MEASURED, NOT GUESSED. Every frame fills its cell, so every
   dog had to be found inside its own photograph first: the backdrop is one
   flat deep red, so the subject is every pixel far from the corner colour,
   and `--at` below is the centroid of that for each file. Fia was visibly off
   centre in the first build of this grid because the crop assumed she was in
   the middle of the frame and she is not.

   CORNERS ON THE RECTANGLE, NOT ON EVERY FRAME. Four drawn corners per
   picture is thirty two marks and reads as noise. The grid is one mounted
   print, held at its own four corners, the way an album page is.

   THE SENTENCE UNDER THE HEADING STAYS. "The eight below are photographs" is
   the one line on this page that separates the real dogs from the drawn
   characters, and the brief rules out any ambiguity about which is which.
   ========================================================================== */

/* `at` is the subject's centroid in its own frame, measured from the files.
   `cell` is where it sits in the four by four. */
interface Shot {
  a: AssetKey;
  cell: string;
  at: string;
}

const SHOTS: Shot[] = [
  /* The fawn anchor, top left. A head and shoulders portrait in a square
     cell, so the vertical centre is set ABOVE the subject's own middle:
     centred on the body it loses the top of the head, which is the whole
     photograph. */
  { a: "dog.finn-1", at: "42% 38%", cell: "dogs__a" },
  /* Three of Fia beside him. */
  { a: "dog.fia-3", at: "51% 45%", cell: "dogs__b" },
  { a: "dog.fia-4", at: "58% 45%", cell: "dogs__c" },
  { a: "dog.fia-1", at: "48% 50%", cell: "dogs__d" },
  /* Three of Finn under him. */
  { a: "dog.finn-3", at: "60% 40%", cell: "dogs__e" },
  { a: "dog.finn-4", at: "55% 10%", cell: "dogs__f" },
  { a: "dog.finn-2", at: "35% 50%", cell: "dogs__g" },
  /* The dark anchor, bottom right, standing full length. */
  { a: "dog.fia-2", at: "43% 46%", cell: "dogs__h" },
];

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

      <Settle className="dogs">
        <DrawnCorner at="tl" />
        <DrawnCorner at="tr" />
        <DrawnCorner at="bl" />
        <DrawnCorner at="br" />
        <ul className="dogs__grid">
          {SHOTS.map((s) => (
            <li key={s.a} className={`dogs__cell ${s.cell}`}>
              <Figure
                asset={s.a}
                fill
                position={s.at}
                rounded="rounded-none"
                sizes="(min-width: 1100px) 45vw, 92vw"
              />
            </li>
          ))}
        </ul>
      </Settle>
    </>
  );
}
