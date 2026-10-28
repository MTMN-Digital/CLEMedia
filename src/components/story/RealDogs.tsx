import type { CSSProperties } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { DrawnRule, DrawnBox } from "@/components/draw/kit";
import { ASSETS, type AssetKey } from "@/lib/brand";
import "./dogs.css";

/* ============================================================================
   The eight photographs of the real Finn and Fia.

   UNCROPPED, 2026-10-28. The four by four mosaic before this cut every
   photograph to a cell shape it was not taken in, and the client asked for
   less cropping and more room. Each picture now keeps its own shape: one row
   per dog, every picture in the row at the same height, its width in
   proportion to its own aspect, so the row fills the measure with nothing
   cut. Each is printed in a drawn frame with a margin of paper, the same
   treatment the garden and the film take further up the page. Under 760px
   the rows wrap two across and the heights stop matching, which is the
   honest cost of not cropping.
   ========================================================================== */

const ROWS: { shots: AssetKey[]; name: string }[] = [
  { name: "Finn, the fawn pug", shots: ["dog.finn-1", "dog.finn-3", "dog.finn-2", "dog.finn-4"] },
  { name: "Fia, the black pug", shots: ["dog.fia-2", "dog.fia-1", "dog.fia-3", "dog.fia-4"] },
];

export function RealDogs({ headingId }: { headingId: string }) {
  return (
    <>
      <DrawnRule v={2} className="mb-10 lg:mb-14" />
      <Settle>
        <h2 id={headingId} className="t-h2">
          The real Finn and Fia
        </h2>
      </Settle>

      <Settle className="dogs">
        {ROWS.map((row, r) => (
          <figure key={row.name} className="dogs__row-wrap">
            <ul className="dogs__row">
              {row.shots.map((a, i) => {
                const { width, height } = ASSETS[a];
                return (
                  <li key={a} className="dogs__shot" style={{ "--ratio": width / height } as CSSProperties}>
                    <div className="letter-print">
                      <DrawnBox v={r * 4 + i} />
                      <Figure asset={a} rounded="rounded-none" sizes="(min-width: 760px) 25vw, 46vw" />
                    </div>
                  </li>
                );
              })}
            </ul>
            <figcaption className="mt-3 font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
              {row.name}
            </figcaption>
          </figure>
        ))}
      </Settle>
      {/* `text-body`, not muted: this line sits at the foot of the band where
          the paper is lightest and muted is the floor of AA there. */}
      <p className="ml-auto mt-6 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
        Finn and Fia in the series are drawn. These are the fawn pug and the black pug they are
        named after.
      </p>
    </>
  );
}
