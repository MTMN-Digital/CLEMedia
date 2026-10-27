import type { CSSProperties } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { DrawnCorner } from "@/components/draw/kit";
import type { AssetKey } from "@/lib/brand";
import "./dogs.css";

/* ============================================================================
   The eight photographs of the real Finn and Fia.

   THE SHAPE. Four by four, fully tiled. Each big portrait is a two by two
   block on the diagonal and the block beside it holds three frames of the
   OTHER dog, so the fawn mass sits top left and the dark mass bottom right,
   each anchored by the other. The client asked for one rectangle with the two
   sets coiled around each other, and this is that without a gap in it. Four
   drawn corners hold the whole grid: one set per picture would be thirty two
   marks and read as noise.

   THE FRAMING IS COMPUTED, NOT CHOSEN, 2026-10-27. Two builds of this grid
   were rejected for bad framing and both were cropped by eye. The problem is
   not taste, it is that the photographs are portrait, landscape and square
   and the cells are not, so `object-position` on a full frame either leaves
   the dog small in a field of backdrop or takes the top off its head.

   So the crop is derived per picture. The backdrop is one flat red, so every
   pixel far from the corner colour is dog; that gives a bounding box; the
   box is then grown to the exact aspect of the cell it is going into, sized
   so the dog fills about 84 per cent of it, floored at half the frame so a
   600px file is never magnified past two, and slid inside the image. The
   vertical centre is biased to 38 per cent of the dog rather than its middle,
   because a pug's head is the photograph and its mass is in its chest.

   `w/h/l/t` are that crop expressed as the image's size and offset in
   percentages of the cell, so the browser does no fitting of its own. They
   are tied to the four by four, so under 760px, where the grid is two across
   and the cells change shape, the component falls back to `object-position`
   with `at`, which is the same measured centre.
   ========================================================================== */

interface Shot {
  a: AssetKey;
  cell: string;
  /** The crop, as the image's box in percentages of its cell. */
  w: number;
  h: number;
  l: number;
  t: number;
  /** The measured subject centre, for the phone layout's own cell shapes. */
  at: string;
}

const SHOTS: Shot[] = [
  /* The fawn anchor, top left, and three of Fia beside him. */
  { a: "dog.finn-1", cell: "a", w: 113.3, h: 172.8, l: 0.0, t: -41.7, at: "44% 53%" },
  { a: "dog.fia-3", cell: "b", w: 116.6, h: 100.0, l: -9.4, t: 0.0, at: "51% 39%" },
  { a: "dog.fia-4", cell: "c", w: 133.6, h: 100.0, l: -27.0, t: 0.0, at: "58% 43%" },
  { a: "dog.fia-1", cell: "d", w: 137.8, h: 198.1, l: -16.6, t: -47.1, at: "48% 49%" },
  /* Three of Finn, and the dark anchor at the bottom right. */
  { a: "dog.finn-3", cell: "e", w: 120.7, h: 176.9, l: -20.7, t: -21.2, at: "60% 40%" },
  { a: "dog.finn-4", cell: "f", w: 100.0, h: 130.0, l: 0.0, t: -0.3, at: "54% 39%" },
  { a: "dog.finn-2", cell: "g", w: 127.3, h: 200.0, l: 0.0, t: -53.1, at: "35% 52%" },
  { a: "dog.fia-2", cell: "h", w: 100.0, h: 141.2, l: 0.0, t: -9.0, at: "46% 42%" },
];

/* THE HEADING IS THE CLAIM, 2026-10-27. "Meet the real Finn and Fia" over a
   grey two line lead was a filing label, and the characters were leading a
   heading on the company site. The sentence the lead was making is the
   heading now, and it is about the photographs; the rest of the lead is the
   credit under the grid, where a provenance line belongs. */
export function RealDogs({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle>
        <h2 id={headingId} className="t-h2 max-w-[22ch]">
          The eight below are photographs of the real Finn and Fia.
        </h2>
      </Settle>

      <Settle className="dogs">
        <DrawnCorner at="tl" />
        <DrawnCorner at="tr" />
        <DrawnCorner at="bl" />
        <DrawnCorner at="br" />
        <ul className="dogs__grid">
          {SHOTS.map((s) => (
            <li
              key={s.a}
              className={`dogs__cell dogs__${s.cell}`}
              style={
                {
                  "--w": `${s.w}%`,
                  "--h": `${s.h}%`,
                  "--l": `${s.l}%`,
                  "--t": `${s.t}%`,
                  "--at": s.at,
                } as CSSProperties
              }
            >
              <Figure
                asset={s.a}
                fill
                rounded="rounded-none"
                sizes="(min-width: 1100px) 45vw, 92vw"
              />
            </li>
          ))}
        </ul>
      </Settle>
      {/* `text-body`, not muted: this line sits at the foot of the band where
          the paper is lightest and muted is the floor of AA there. */}
      <p className="ml-auto mt-4 max-w-[44ch] text-right font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">
        Finn and Fia in the series are drawn. These are the fawn pug and the black pug they are
        named after.
      </p>
    </>
  );
}
