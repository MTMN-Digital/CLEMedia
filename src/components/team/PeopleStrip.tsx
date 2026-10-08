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
   answerable for what.

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

   The portraits themselves are still the client's six, unretouched. The open
   question about them, that they were taken in six different places and do not
   sit together, is a photography problem and is logged in CONTENT-NEEDED.md.
   Lighting them consistently here is the most that can honestly be done to it
   without altering how six real people look.
   ========================================================================== */

/* Six positions under one lamp up and to the left. The far end of the row
   sits a little deeper, which is what stops it reading as a straight line. */
const MOUNT = [
  { roll: -0.7, tilt: 2.4, depth: 0.38 },
  { roll: 0.5, tilt: 1.8, depth: 0.46 },
  { roll: -0.35, tilt: 2.6, depth: 0.4 },
  { roll: 0.65, tilt: 2.0, depth: 0.52 },
  { roll: -0.5, tilt: 2.3, depth: 0.44 },
  { roll: 0.3, tilt: 1.9, depth: 0.56 },
];

export function PeopleStrip({ people }: { people: Member[] }) {
  const shown = people.filter((p) => p.asset);
  if (shown.length < 2) return null;

  return (
    <ul
      /* Scrolls sideways on a phone rather than wrapping to two ragged rows or
         shrinking six faces to thumbnails again. `-mx-` plus matching padding
         so the row bleeds to the band's edge as it scrolls. */
      className="-mx-[var(--gutter)] mt-12 flex gap-4 overflow-x-auto px-[var(--gutter)] pb-1 sm:gap-5 lg:mx-0 lg:mt-16 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0"
    >
      {shown.map((p, i) => {
        const m = MOUNT[i % MOUNT.length];
        return (
        <li key={p.name} className="w-[38vw] shrink-0 sm:w-[25vw] lg:w-auto">
          <Stage
            roll={m.roll}
            tilt={m.tilt}
            depth={m.depth}
            light={-32}
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
          <p className="t-sm mt-4 font-bold leading-tight text-ink">{p.name}</p>
          <p className="eyebrow eyebrow-xs mt-1">{p.role}</p>
        </li>
        );
      })}
    </ul>
  );
}
