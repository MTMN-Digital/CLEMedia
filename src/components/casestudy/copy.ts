/* The case study page's editable copy, keyed by block key
   (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("case-study", key, COPY[key]) so
   an empty content_blocks table shows the page exactly as written here. The
   headline's accent clause sits between *stars*, around the words the page
   sets in <em>. The hero's aside follows STUDY_OPEN and the title slate is an
   image block, so neither has an entry. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Case study",
  "hero.eyebrow_sub": "Ireland and England",
  "hero.title": "A case study across *two curricula*",
  "ask.heading": "Choose a route, watch one episode, use the materials, answer the questionnaire.",
  "route.heading": "Ireland follows Aistear, England follows the EYFS.",
  "mat.heading": "Watch it, then use the materials",
  "q.heading": "The questionnaire opens when the participant information is published.",
  "out.heading": "The Banteer workshop has taken place. The study has not started.",
  "data.heading": "What happens to your answers",
};
