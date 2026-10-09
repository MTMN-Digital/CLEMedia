import { Settle } from "@/components/Settle";
import { Stage } from "@/components/render";
import type { Strand } from "@/components/journal/data";

/* ============================================================================
   The contents, as the file it is.

   WHAT THIS REPLACED. Four strands set as four text rows with a hairline
   between them and a mono ordinal in the margin. It was honest and it was
   completely flat, on a page that otherwise had no object on it at all: the
   journal was the one page where a reader met nothing but type.

   WHY CARDS, and why these cards. A journal's strands are its sections, and
   sections in a studio live on tabbed dividers in a file. The tab is not
   decoration, it is the thing that tells you where one section starts, and it
   lets the four read as one object with four parts rather than four separate
   boxes. `card-stock` and `card-tab` already existed for exactly this and were
   used once, on a single note elsewhere on the page.

   THE ORDINALS ARE GONE. `01 / THE RESEARCH` above a strand is the numbered
   mono eyebrow the house retired: it was the escape from the default until it
   became the default. The strands have no order anyway, which is the giveaway
   that the number was carrying nothing. The tab carries the name instead,
   which is what a tab is for.

   HAND-PLACED, NOT GENERATED. Each card has its own lean, its own tab
   position and its own depth off the surface, so the file reads as something
   somebody put down rather than a grid with a rotation function applied. The
   values are written out for that reason, and a fifth strand gets its own
   line rather than a modulo.
   ========================================================================== */

export interface ContentsRow extends Strand {
  /** Published pieces in this strand. Counted from the CMS, never guessed. */
  count: number;
}

/* ONE LAMP, 2026-10-09. All four cards were lit at `light={-32}`, the same
   azimuth, so every shadow on the desk ran parallel and the file read as four
   cards each with its own light rather than four cards under the room's. Every
   other staged object on this site reads its azimuth from its COLUMN, and this
   was the last place that did not. Two columns above 1024 and one below, so
   the single-column case gets the middle of the sweep.

   They are SEATED as well. A card lying on a desk meets the desk, and without
   it the four had a cast shadow but no contact pool, which is what made them
   look laid over the bench rather than on it. */
const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / columns;
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

/* lean: degrees of roll. tab: where the divider's tab sits along the top edge.
   lift: how far off the surface, which drives the shadow. */
const PLACED = [
  { lean: -0.55, tab: "1.75rem", lift: 0.42 },
  { lean: 0.42, tab: "7.5rem", lift: 0.55 },
  { lean: -0.3, tab: "3.25rem", lift: 0.48 },
  { lean: 0.6, tab: "9rem", lift: 0.6 },
];

export function Contents({ rows }: { rows: ContentsRow[] }) {
  return (
    <Settle
      as="ol"
      /* Two up on a desk, one on a phone. Never four across: a 46ch blurb at a
         quarter of 1440 is four words a line. */
      className="grid gap-x-10 gap-y-14 sm:gap-y-16 lg:grid-cols-2 lg:gap-x-14"
    >
      {rows.map((row, i) => {
        const place = PLACED[i % PLACED.length];
        const status =
          row.count > 0 ? `${row.count} ${row.count === 1 ? "piece" : "pieces"}` : "In preparation";
        return (
          <li
            key={row.slug}
            /* The second column sits lower, the way a second row of cards laid
               on a desk never lines up with the first. */
            className={i % 2 === 1 ? "lg:mt-12" : undefined}
          >
            <Stage
              roll={place.lean}
              tilt={2.2}
              depth={place.lift}
              light={azimuthFor(i % 2, 2)}
              seated
              lift
              radius="var(--radius-md)"
              className="h-full"
            >
              <article className="card-stock relative h-full px-6 pb-7 pt-9 sm:px-8 sm:pb-9 sm:pt-11">
                {/* The tab carries the STATE, not the name. A tab repeating
                    the heading two lines below it is the same stutter twice;
                    a job bag in a studio carries where the work has got to. */}
                <span className="card-tab uppercase" style={{ left: place.tab }}>
                  {status}
                </span>
                <h3 className="font-display text-[clamp(1.5rem,1.15rem+1.4vw,2.1rem)] leading-[1.08] tracking-[-0.01em] text-ink">
                  {row.name}
                </h3>
                {row.blurb && <p className="t-prose mt-4 max-w-[44ch] text-body">{row.blurb}</p>}
              </article>
            </Stage>
          </li>
        );
      })}
    </Settle>
  );
}
