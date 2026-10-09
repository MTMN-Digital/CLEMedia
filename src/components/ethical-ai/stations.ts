import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The six stages, the two platforms, and the three things neither tool does.

   EXTRACTED 2026-10-09 from ProductionLine.tsx, which drew them as a 2,700px
   vertical chain and was replaced by ProductionFlat. The data outlived the
   drawing, which is the whole reason it now sits in a file of its own: this
   is the client's own account of how an episode is made, and the last time a
   second copy of it existed in a component (HumanLedDiagram, deleted
   2026-10-03) the copy was WRONG and disagreed with the company about its own
   process. One source, and the drawings read from it.
   ========================================================================== */

export type Kind = "person" | "tool" | "gate";

export interface Station {
  kind: Kind;
  /** The company's own stage number. Production is not one of the six. */
  index?: string;
  title: string;
  who: string;
  body: string;
  /** Portraits, supplied 2026-10-01. A stage that names a person shows them. */
  faces?: AssetKey[];
}

export const STATIONS: Station[] = [
  {
    kind: "person", index: "01", title: "Concept and story", who: "Conor and Alan",
    faces: ["person.conor", "person.alan"],
    body: "The episode concept, the story and the learning goal, set by people before any production begins.",
  },
  {
    kind: "person", index: "02", title: "Script and direction", who: "Alan Compton",
    faces: ["person.alan"],
    body: "The script is written and production directed. Assets are specified and selected by the team, not accepted as they arrive.",
  },
  {
    kind: "tool", title: "Visual and voice production", who: "Runway and ElevenLabs",
    body: "Runway for visual production and ElevenLabs for voice production, inside final production and directed by the team. Nothing here is published on its own.",
  },
  {
    kind: "person", index: "03", title: "Educational review", who: "Paula Walshe PhD",
    faces: ["person.paula"],
    body: "Learning intent and the offline activities that follow the episode, reviewed against early years practice.",
  },
  {
    kind: "person", index: "04", title: "Parent and early years review", who: "Lydia and Kirstie",
    faces: ["person.lydia", "person.kirstie"],
    body: "Script and production read again from a parent's point of view, and from a child's.",
  },
  {
    kind: "person", index: "05", title: "Quality and suitability", who: "The production team",
    body: "Voices and visuals checked for quality, consistency and suitability for the children watching.",
  },
  {
    kind: "gate", index: "06", title: "Final review and approval", who: "The team",
    body: "The finished episode is inspected and changes requested where needed. A release can be held here.",
  },
];


/* What each platform is for, and what neither is allowed to do. These two
   blocks used to be a section of their own halfway down the page, which is
   what made the page say the same thing twice. They belong to the one station
   the tools are at, so they live inside it. */
export const PLATFORMS: { name: string; role: string; body: string }[] = [
  {
    name: "Runway",
    role: "Visual production",
    body: "Supports elements of visual production and animation, to the script and direction set by the team.",
  },
  {
    name: "ElevenLabs",
    role: "Voice production",
    body: "Supports elements of audio and voice production, reviewed for quality and suitability before release.",
  },
];

export const DO_NOT = [
  "Decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  "Generate and publish anything automatically. Every output is directed, reviewed and approved by the team before publication.",
  "Replace the educational judgement of qualified people. Learning objectives, activities, language and child development stay with them.",
];

