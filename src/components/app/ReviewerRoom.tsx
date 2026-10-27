import { Figure } from "@/components/Figure";
import type { AssetKey } from "@/lib/brand";

/* The three reviewers, as a credits row.

   Until 2026-10-27 they stood on the render kit's studio wall, each print on
   its own ledge under one lamp, the way /contact mounts its five. That made
   this the third wall of the same faces on the site (/team, /contact, here),
   and the mounts set the role line at the kit's 11px floor. The faces are
   still the point, since this is the app's own claim about who reviews what
   goes into it, so they stay at a size you can read; the stage goes. One
   rule, a square print, the name, the role and the one line of what that
   person checks. Every name, role and sentence is the client's. */

export type Reviewer = { name: string; role: string; line: string; asset: AssetKey };

export function ReviewerRoom({ people }: { people: Reviewer[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-y-10">
      {people.map((p) => (
        /* A phone sets the print beside the caption, so three people take
           three short rows rather than three screens. From 640px up each one
           is a column: print, then caption under it. */
        <li
          key={p.name}
          className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 border-t-[1.5px] border-rule pt-5 sm:block sm:pt-6"
        >
          <div className="w-[5.5rem] sm:w-full sm:max-w-[12rem]">
            <Figure
              asset={p.asset}
              rounded="rounded-[var(--radius-md)]"
              className="aspect-square"
              sizes="(min-width: 640px) 192px, 88px"
            />
          </div>
          <div className="sm:mt-5">
            <p className="t-body font-semibold text-ink">{p.name}</p>
            {/* The role is a label inside the credit, which is where a mono
                label still belongs. 13px, the floor for real text. */}
            <p className="mt-1 font-mono text-[13px] uppercase leading-[1.6] tracking-[0.14em] text-body">
              {p.role}
            </p>
            <p className="t-sm mt-3 max-w-[32ch] leading-[1.6] text-body">{p.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
