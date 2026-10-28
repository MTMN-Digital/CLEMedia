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

export type RouteId = "england" | "ireland";

export const ROUTES: {
  id: RouteId;
  framework: string;
  themes: string[];
  label: string;
  themesLabel: string;
  summary: string;
}[] = [
  {
    id: "ireland",
    label: "Ireland",
    framework: "Aistear",
    summary:
      "Aistear is the early childhood curriculum framework for children from birth to six in Ireland. It is organised around four themes, and the Ireland route reads the episode and its activities against them.",
    themesLabel: "The four Aistear themes",
    themes: ["Well-being", "Identity and Belonging", "Communicating", "Exploring and Thinking"],
  },
  {
    id: "england",
    label: "England",
    framework: "EYFS",
    summary:
      "The Early Years Foundation Stage is the statutory framework for children from birth to the end of the reception year in England. The England route reads the episode and its activities against its areas of learning.",
    themesLabel: "The EYFS areas of learning",
    themes: [
      "Communication and language",
      "Personal, social and emotional development",
      "Physical development",
      "Literacy",
      "Mathematics",
      "Understanding the world",
      "Expressive arts and design",
    ],
  },
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
  return (
    <div aria-live="polite">
      <h3 className="t-h3">{current.framework}</h3>
      <p className="t-body mt-4 max-w-[56ch] text-body">{current.summary}</p>
      <p className="field-label mt-7">{current.themesLabel}</p>
      {/* Two columns from `lg`, so the seven EYFS areas sit at the height of
          the four Aistear themes. Each row keeps its own rule. */}
      <ul className="max-w-[56rem] border-t-[1.5px] border-rule lg:columns-2 lg:gap-x-12">
        {current.themes.map((t) => (
          <li key={t} className="t-body break-inside-avoid border-b-[1.5px] border-rule py-3 text-ink">{t}</li>
        ))}
      </ul>
    </div>
  );
}
