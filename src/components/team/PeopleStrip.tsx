import { Figure } from "@/components/Figure";
import { Stage } from "@/components/render";
import type { Member } from "./people";

/* ============================================================================
   The faces, across the foot of the page's opening band.

   WHY IT IS HERE. The brief puts people first, and the page opened on a title,
   a lead and a mono note with 400px of bare wall under them: the first actual
   photograph of anyone was a 76px square some way down a table. The band now
   ends on the team at a size where they read as people rather than as row
   markers, and the matrix below answers the harder question of who is
   each person actually does.

   NOT A TEAM GRID. There are no cards, no hover states, no job titles repeated
   from the table under every face, and nothing is clickable. It is a row of
   portraits and names, once, at the point of arrival.

   WHOEVER HAS NO PORTRAIT IS NOT HERE, and no frame is drawn for them. An
   empty square in a row of faces reads as a missing person; the table below
   carries everyone either way.

   MOUNTED, NOT PASTED. Each portrait stands on a Stage, which gives it one
   light, a lean of its own and a shadow that belongs to that light, so the row
   reads as photographs mounted on a wall rather than six images sitting flat
   in a grid. The lean is hand-written per position for the same reason the
   studio wall's is: a rotation function applied down a row is visible as a
   function.

   The portraits themselves are still the client's own, unretouched. The open
   question about them, that they were taken in six different places and do not
   sit together, is a photography problem and is logged in CONTENT-NEEDED.md.
   Lighting them consistently here is the most that can honestly be done to it
   without altering how six real people look.
   ========================================================================== */

/* One position per portrait, under one lamp up and to the left. The far end
   of the row sits a little deeper, which is what stops it reading as a
   straight line. A seventh was written when Victoria joined, rather than
   wrapping back to the first, because a repeat at the end of a short row is
   as visible as a rotation function would have been. */
const MOUNT = [
  { roll: -0.7, tilt: 2.4, depth: 0.38 },
  { roll: 0.5, tilt: 1.8, depth: 0.46 },
  { roll: -0.35, tilt: 2.6, depth: 0.4 },
  { roll: 0.65, tilt: 2.0, depth: 0.52 },
  { roll: -0.5, tilt: 2.3, depth: 0.44 },
  { roll: 0.3, tilt: 1.9, depth: 0.56 },
  { roll: -0.45, tilt: 2.1, depth: 0.42 },
];

/* One lamp up and left of the bench, the same geometry StageSequence and the
   studio wall use. */
const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / Math.max(1, columns);
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

export function PeopleStrip({ people }: { people: Member[] }) {
  const shown = people.filter((p) => p.asset);
  if (shown.length < 2) return null;

  return (
    <>
      <ul
        /* Scrolls sideways on a phone rather than wrapping to two ragged rows or
           shrinking six faces to thumbnails again. `-mx-` plus matching padding
           so the row bleeds to the band's edge as it scrolls. */
        className="-mx-[var(--gutter)] mt-12 flex gap-4 overflow-x-auto px-[var(--gutter)] pb-1 sm:gap-5 lg:mx-0 lg:mt-16 lg:grid lg:overflow-visible lg:px-0"
        /* ONE COLUMN PER FACE. This was `lg:grid-cols-6` while the row happened
           to hold six; the seventh portrait would have dropped to a second row
           on its own. Inline rather than a Tailwind class because the count is
           data, and inert below `lg`, where the element is a flex row. */
        style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}
      >
        {shown.map((p, i) => {
          const m = MOUNT[i % MOUNT.length];
          return (
          <li key={p.name} className="w-[38vw] shrink-0 sm:w-[25vw] lg:w-auto">
            <Stage
              roll={m.roll}
              tilt={m.tilt}
              depth={m.depth}
              /* ONE LAMP, 2026-10-09. The whole row was lit at -32, so six
                 portraits on one bench cast six parallel shadows and read as
                 six separate lights. Six columns above 1024; below that the
                 row scrolls, so the column index still reads left to right
                 along the strip, which is what the lamp is crossing. */
              light={azimuthFor(i, shown.length)}
              lift
              radius="var(--radius-md)"
            >
              <Figure
                asset={p.asset!}
                rounded="rounded-[var(--radius-md)]"
                className="aspect-square"
                /* The source crops are 440 square, 880 at 2x, so a column on a
                   1440 screen asks for about 200 and gets a real 2x image. */
                sizes="(min-width: 1024px) 200px, 38vw"
              />
            </Stage>
            {/* No hard-coded `text-ink`. The strip now sits on the bench, where
                ink measured 2.17:1, and a component that names its own colour
                cannot follow the surface it is put on. Inherited, it is ink on
                paper and cream on the bench. */}
            <p className="t-sm mt-4 font-bold leading-tight">{p.name}</p>
            <p className="eyebrow eyebrow-xs mt-1">{p.role}</p>
          </li>
          );
        })}
      </ul>
      {/* The cue, below `lg` only, where the row scrolls. The face cut by
          the band's edge is the real affordance, but it is also exactly
          what a broken grid looks like, and the home page's filmstrip
          already says this in the same voice. No `tabIndex` on the row to
          go with it: there is nothing focusable inside it, and every name
          and role in it is set out again in the dossier below, so a
          keyboard never has to reach the end of the strip to get at
          anything.

          NO `opacity` ON IT. Dimmed to 0.7 this composites to 4.11:1 on
          the olive, under AA, which is the trap `opacity-80` sprang on the
          evidence band three days ago. Full cream is 6.44:1 flat and
          5.39:1 under the lamp, and an 11px tracked mono line is already
          subordinate to the 14px names above it without any help. */}
      <p aria-hidden="true" className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] lg:hidden">
        Scroll sideways for the rest
      </p>
    </>
  );
}
