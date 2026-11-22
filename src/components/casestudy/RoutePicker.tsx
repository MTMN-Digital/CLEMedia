/* ============================================================================
   The route: the chips and the framework panel.

   Ireland and England are different curricula, so the two routes cite
   different frameworks. Aistear is the Irish early childhood curriculum
   framework and EYFS is the English statutory framework; the client has
   confirmed both routes. Only facts about the frameworks themselves are
   written here (their published names and structure). Nothing about how the
   study maps episode 003 to either is claimed, because that mapping is
   Paula's work and is not yet approved.

   SPLIT IN TWO, 2026-10-28. The chips sit under the drawing in the first
   screen and drive it (TwoRoutes takes the same `route`); the framework
   panel sits further down the sheet, in "The route you chose". Both read one
   piece of state held by the page. The radios are native inputs so the
   choice is keyboard and screen reader operable, like the enquiry type on
   /contact.

   The supporting notes for each route are not here any more: they are rows
   in "What will be published here", stated as owed.
   ========================================================================== */

import { useList, useBlock } from "@/lib/content";
import { COPY } from "./copy";
import { ENGLAND_THEMES, IRELAND_THEMES } from "./lists";

export type RouteId = "england" | "ireland";

export const ROUTES: { framework: string; id: RouteId; label: string }[] = [
  { id: "ireland", label: "Ireland", framework: "Aistear" },
  { id: "england", label: "England", framework: "EYFS" },
];

/** The two radios, as chips. The legend is the question. */
export function RouteChips({ route, onChange, className = "" }: { onChange: (r: RouteId) => void; className?: string; route: RouteId }) {
  return (
    <fieldset className={className}>
      <legend className="field-label">Where are you teaching?</legend>
      <div className="flex flex-wrap gap-2.5">
        {ROUTES.map((r) => (
          <label key={r.id} className="chip min-h-[44px]" data-on={route === r.id ? "" : undefined}>
            <input
              type="radio"
              name="study-route"
              value={r.id}
              checked={route === r.id}
              onChange={() => onChange(r.id)}
              className="sr-only"
            />
            {r.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** The chosen framework: its name, its summary and its themes, verbatim.
 *  Announced when the route changes, so a screen reader user hears that it
 *  now describes a different framework. The swap has no transition: a fade
 *  on live content is noise. */
export function RoutePanel({ route }: { route: RouteId }) {
  const current = ROUTES.find((r) => r.id === route)!;
  const id = current.id;
  const summary = useBlock("case-study", `route.${id}.summary`, COPY[`route.${id}.summary`]);
  const themesLabel = useBlock("case-study", `route.${id}.themes.label`, COPY[`route.${id}.themes.label`]);
  const themes = useList("case-study", `route.${id}.themes`, id === "ireland" ? IRELAND_THEMES : ENGLAND_THEMES);
  return (
    <div aria-live="polite">
      <h3 className="t-h3">{current.framework}</h3>
      <p className="t-body mt-4 max-w-[56ch] text-body">{summary}</p>
      <p className="field-label mt-7">{themesLabel}</p>
      {/* Two columns from `lg`, so the seven EYFS areas sit at the height of
          the four Aistear themes. Each row keeps its own rule. */}
      <ul className="max-w-[56rem] border-t-[1.5px] border-rule lg:columns-2 lg:gap-x-12">
        {themes.map((t, i) => (
          <li key={i} className="t-body break-inside-avoid border-b-[1.5px] border-rule py-3 text-ink">{t.theme}</li>
        ))}
      </ul>
    </div>
  );
}
