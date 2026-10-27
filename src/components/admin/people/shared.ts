import type { PersonRow } from "@/lib/admin";
import { ADVISORS, PHASES, TEAM } from "@/components/team/people";

/* Shared between the list and the form: the words for a person's type, the
   five phases as checkbox labels, and the bundled team as rows for the
   one-click import. */

export type PersonType = PersonRow["type"];

export const TYPE_OPTIONS: { value: PersonType; label: string }[] = [
  { value: "team", label: "Core team" },
  { value: "advisor", label: "Adviser" },
];

export const TYPE_LABEL: Record<PersonType, string> = { team: "Core team", advisor: "Adviser" };

/** The five production phases, numbered 1 to 5, named as the team page names them. */
export const PHASE_OPTIONS = PHASES.map((p) => ({ n: Number(p.n), label: p.phase }));

/**
 * The bundled TEAM and ADVISORS as rows, in running order, for "Import the
 * current team". Bio paragraphs join with a blank line, the bundled portrait
 * is kept through asset_key, and nothing is marked unconfirmed: these are the
 * client's own words from src/components/team/people.ts.
 */
export function bundledRows(): Partial<PersonRow>[] {
  const rows = (type: PersonType, list: typeof TEAM) =>
    list.map((m, i) => ({
      name: m.name,
      role: m.role,
      bio: m.bio.join("\n\n"),
      photo: null,
      photo_alt: null,
      type,
      sort_order: i + 1,
      visible: true,
      unconfirmed: false,
      phases: m.phases,
      asset_key: m.asset ?? null,
    }));
  return [...rows("team", TEAM), ...rows("advisor", ADVISORS)];
}
