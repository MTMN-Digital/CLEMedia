/* ============================================================================
   The line, as a table: the opening of clause 4, "What a tool is never used
   for".

   WHAT THIS REPLACES, 2026-10-27. TheLine.tsx drew the boundary: four labels
   above a rule, two below it, ticks hanging off a 3px rule that painted
   itself red on entry. It was a second diagram on a page the direction now
   allows one, and the production line (Figure 1) is the one that explains a
   process, so the drawing went and the words stayed.

   NOT ONE LABEL IS CUT. The four things only people decide and the two
   platforms with what they are named for are the same six strings, lifted
   verbatim from "The lines we hold" and the stage account. The red rule
   between the rows is kept as the one accent line: it IS the boundary the
   clause heading states, and the thing the six commitments under it
   describe.

   NO SETTLE OF ITS OWN, 2026-10-28. The page is a document and its one
   entrance is the sheet's; the clauses below it do not settle one by one.
   ========================================================================== */

import { useList, useBlock } from "@/lib/content";
import { COPY } from "./copy";
import { LINE_TOOL_ITEMS, PEOPLE_ITEMS } from "./lists";

export function TheLineTable() {
  const people = useList("ethical-ai", "people.items", PEOPLE_ITEMS);
  const tools = useList("ethical-ai", "line.tools.items", LINE_TOOL_ITEMS);
  const peopleLabel = useBlock("ethical-ai", "line.people", COPY["line.people"]);
  const toolsLabel = useBlock("ethical-ai", "line.tools", COPY["line.tools"]);
  return (
    <dl className="border-t-[1.5px] border-rule">
      <div className="grid gap-y-3 py-6 md:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] md:gap-x-8">
        <dt className="font-mono text-[14px] uppercase tracking-[0.14em] text-body">{peopleLabel}</dt>
        <dd>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {people.map((p, i) => (
              <li key={i} className="text-[17px] font-semibold leading-[1.3] text-ink">
                {p.text}
              </li>
            ))}
          </ul>
        </dd>
      </div>
      {/* The boundary. Red, 3px: the only accent rule on the page outside the
          drawing, and the line the clause heading states in words. */}
      <div className="grid gap-y-3 border-t-[3px] border-red-deep py-6 md:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] md:gap-x-8">
        <dt className="font-mono text-[14px] uppercase tracking-[0.14em] text-body">{toolsLabel}</dt>
        <dd>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {tools.map((t, i) => (
              <li key={i} className="text-[17px] leading-[1.3] text-body">
                <strong className="font-semibold text-ink">{t.name}</strong>
                <span className="block text-[15px] leading-[1.5]">{t.does}</span>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
