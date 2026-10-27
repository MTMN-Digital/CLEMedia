import { Slot } from "./Slot";

/* ============================================================================
   Pick your route.

   Ireland and England are different curricula, so the two routes cite
   different frameworks. Aistear is the Irish early childhood curriculum
   framework and EYFS is the English statutory framework; the client has
   confirmed both routes. Only facts about the frameworks themselves are
   written here (their published names and structure). Nothing about how the
   study maps episode 003 to either is claimed, because that mapping is
   Paula's work and is not yet approved.

   The supporting material for each route is a marked slot until Paula
   approves it. The radios are native inputs so the choice is keyboard and
   screen reader operable, like the enquiry type on /contact.
   ========================================================================== */

export type RouteId = "england" | "ireland";

const ROUTES: {
  id: RouteId;
  themes: string[];
  framework: string;
  slot: string;
  summary: string;
  label: string;
  themesLabel: string;
}[] = [
  {
    id: "ireland",
    label: "Ireland",
    framework: "Aistear",
    summary:
      "Aistear is the early childhood curriculum framework for children from birth to six in Ireland. It is organised around four themes, and the Ireland route reads the episode and its activities against them.",
    themesLabel: "The four Aistear themes",
    themes: ["Well-being", "Identity and Belonging", "Communicating", "Exploring and Thinking"],
    slot: "The Aistear supporting notes for this route are with Paula for final approval. They will appear here as a download, with a short note on how to use them alongside the episode.",
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
    slot: "The EYFS supporting notes for this route are with Paula for final approval. They will appear here as a download, with a short note on how to use them alongside the episode.",
  },
];

export function RoutePicker({ route, onChange }: { route: RouteId; onChange: (r: RouteId) => void }) {
  const current = ROUTES.find((r) => r.id === route)!;

  return (
    <div>
      <fieldset>
        <legend className="field-label">Where are you teaching?</legend>
        <div className="flex flex-wrap gap-2.5">
          {ROUTES.map((r) => (
            <label key={r.id} className="chip" data-on={route === r.id ? "" : undefined}>
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

      {/* Announced when the route changes, so a screen reader user hears that
          the panel below it now describes a different framework. */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16" aria-live="polite">
        <div>
          <h3 className="t-h2 max-w-[14ch]">{current.framework}</h3>
          <p className="t-body mt-5 max-w-[52ch] text-body">{current.summary}</p>
          <p className="field-label mt-7">{current.themesLabel}</p>
          <ul className="border-t-[1.5px] border-rule">
            {current.themes.map((t) => (
              <li key={t} className="border-b-[1.5px] border-rule py-3 text-[16px] text-ink">{t}</li>
            ))}
          </ul>
        </div>
        <Slot title={`${current.framework} supporting notes`} coming={current.slot} />
      </div>
    </div>
  );
}
