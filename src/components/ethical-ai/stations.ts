import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The five phases, the two platforms, and the three things neither tool does.

   EXTRACTED 2026-10-09 from ProductionLine.tsx, which drew them as a 2,700px
   vertical chain and was replaced by ProductionFlat. The data outlived the
   drawing, which is the whole reason it now sits in a file of its own: this
   is the client's own account of how an episode is made, and the last time a
   second copy of it existed in a component (HumanLedDiagram, deleted
   2026-10-03) the copy was WRONG and disagreed with the company about its own
   process. One source, and the drawings read from it.

   REWRITTEN 2026-10-24 from the client's review document of 22 October, which
   withdraws the six-stage account this file held: "Our process involves
   repeated team reviews, rather than one separate review assigned to each
   person." See the note at the top of components/team/people.ts for what the
   shape change actually was. Three things went with it here:

   - The per-stage owner. Alan leads throughout; the same five read everything.
   - "A release can be held here", which the document asks for by name.
   - The portraits. Four of the five phases would carry the same six faces,
     and this page already shows the people once in the room below it.

   This page OWNS the full account, so each phase here carries the whole
   sentence. Home and /team carry one clause each and link here.
   ========================================================================== */

export type Kind = "tool" | "person" | "gate";

export interface Station {
  kind: Kind;
  /** The company's own phase number. Production is not one of the five. */
  index?: string;
  title: string;
  who: string;
  body: string;
  /** Kept on the type, unused since 2026-10-24. See the note above. */
  faces?: AssetKey[];
}

export const STATIONS: Station[] = [
  {
    kind: "person", index: "01", title: "First draft", who: "Alan writes, five read",
    body: "Alan writes the script. Paula, Lydia, Kirstie, Conor and David Toth each read it and give him their feedback and input.",
  },
  {
    kind: "person", index: "02", title: "Revised drafts", who: "Alan and the same five",
    body: "Alan writes the next draft from that feedback and the same group reads it again. This usually takes three or four rounds before the script is locked.",
  },
  {
    kind: "tool", title: "Visual and voice production", who: "Runway and ElevenLabs",
    body: "Runway for visual production and ElevenLabs for voice production, inside the animation and directed by Alan. Nothing here is published on its own.",
  },
  {
    kind: "person", index: "03", title: "Animation", who: "Alan Compton",
    body: "Once the script is locked Alan begins the animation, using his creative judgement throughout production.",
  },
  {
    kind: "person", index: "04", title: "Episode review", who: "The team",
    body: "The team watches the finished episode and gives feedback. Alan makes the necessary changes and shares the revised version.",
  },
  {
    kind: "gate", index: "05", title: "Final sign-off", who: "The team",
    body: "The team repeats the viewing and revision until everyone is happy with the episode, and signs it off for release.",
  },
];


/* What each platform is for, and what neither is allowed to do. These two
   blocks used to be a section of their own halfway down the page, which is
   what made the page say the same thing twice. They belong to the one station
   the tools are at, so they live inside it. */
export const PLATFORMS: { body: string; name: string; role: string }[] = [
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

/* Where on the line the two tools are used, in the client's own sentence.
   NEEDED FROM CLIENT (CONTENT-NEEDED.md, "Where in the sequence the AI tools
   run"). While this is null the tools table (clause 3) has no "Where on the
   line" column and nothing on the page attaches a phase number to the tools:
   Figure 1 draws them at one point and the clause may restate the drawing,
   but a dated document cannot assert a placement the company has not stated.
   When Conor's sentence arrives it goes here and both rows print it. */
export const TOOL_PLACEMENT: string | null = null;

export const DO_NOT = [
  "Decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  "Generate and publish anything automatically. Every output is directed, reviewed and approved by the team before publication.",
  "Replace the educational judgement of qualified people. Learning objectives, activities, language and child development stay with them.",
];

