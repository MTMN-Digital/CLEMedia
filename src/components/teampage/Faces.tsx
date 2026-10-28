import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Stage } from "@/components/render";
import type { Member } from "@/components/team/people";

/* ============================================================================
   The register's faces: eight portraits on the grove, four and four.

   A register opens on the people themselves, at the scale of a magazine
   masthead, in the order the register below uses. A reader who finds Paula
   third here finds her third in the register: the grid is the page's index.

   FLAT, NOT PINNED. The old strip gave each print its own lean and roll,
   which was written for one row of mismatched photographs. Eight prints at
   eight angles read as a pinboard. A register is flat: tilt and roll are zero
   on every face, and what keeps eight sittings together on the dark ground is
   the one lamp up and left of the bench casting all eight shadows the same
   way, a little longer on the lower row, plus the identical crop, radius and
   size. The lamp direction and the shadow depth are the only variation, and
   they vary by position, not by taste.

   NOT A TEAM GRID. No card, no edge, no hover, no link, no icon row. A name
   and a role under each portrait, once.

   WHOEVER HAS NO PORTRAIT IS NOT HERE, and no frame is drawn for them. An
   empty square in a row of faces reads as a missing person; the register
   below carries everyone either way.

   NO SIDEWAYS SCROLL. On a phone the eight wrap to two columns and four rows.
   A register that hides five of its eight people off the edge of the screen
   is not a register.
   ========================================================================== */

/* One lamp up and left of the bench, the same geometry the studio wall uses.
   Column index across the four, so the shadows fan a little from left to
   right as one light would cast them. */
const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / Math.max(1, columns);
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

/* A portrait uploaded in the admin arrives as `photo`, and Figure takes it as
   an override but still wants an asset for the frame's width and height.
   Someone added in the panel has no bundled asset, so they borrow this one:
   it is 440 square like every portrait, and its base is empty, so if the
   override were ever missing it would draw a labelled placeholder rather
   than another person's face. */
const PORTRAIT_FRAME = "person.mansi" as const;

export function Faces({ people }: { people: Member[] }) {
  /* Bundled portrait or an uploaded one: either way there is a face to show. */
  const shown = people.filter((p) => p.asset || p.photo);
  if (shown.length < 2) return null;

  return (
    <Settle as="ul" className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {shown.map((p, i) => {
        const column = i % 4;
        const row = Math.floor(i / 4);
        return (
          <li key={p.name} className="min-w-0">
            <Stage
              tilt={0}
              roll={0}
              depth={row === 0 ? 0.44 : 0.52}
              light={azimuthFor(column, 4)}
              radius="var(--radius-md)"
            >
              <Figure
                asset={p.asset ?? PORTRAIT_FRAME}
                override={p.photo ?? null}
                rounded="rounded-[var(--radius-md)]"
                className="aspect-square"
                /* The source crops are 440 square, 880 at 2x. A column at 1440
                   is about 316px, so the 2x source is a real 2x image. */
                sizes="(min-width: 1024px) 330px, 45vw"
              />
            </Stage>
            {/* No hard-coded colour: inherited, this is cream on the grove. */}
            <p className="t-body mt-4 font-bold leading-tight">{p.name}</p>
            {/* 13px on a phone, the floor; 14px from lg, the eyebrow-sm size.
                Utilities rather than the two classes because `.eyebrow-sm`
                has no responsive variant. */}
            <p className="eyebrow mt-1.5 text-[13px] tracking-[0.16em] lg:text-[14px] lg:tracking-[0.14em]">
              {p.role}
            </p>
          </li>
        );
      })}
    </Settle>
  );
}
