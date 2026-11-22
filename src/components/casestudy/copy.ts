/* The case study page's editable copy, keyed by block key
   (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("case-study", key, COPY[key]) so
   an empty content_blocks table shows the page exactly as written here. No
   stars, no accent clause: the protocol sheet has no claim set as a heading.
   The status rows (Not yet open, Opens, Routes, Episode, Materials,
   Questionnaire, Results) have editable labels; the Status and Episode
   values are computed from STUDY_OPEN and the episode table and stay in
   code. */
export const COPY: Record<string, string> = {
  "head.eyebrow": "Study protocol",
  "step2.caption": "Episode 003 title slate. A frame from the series.",
  "step2.link": "Watch on YouTube",
  "q.status": "Draft, awaiting Dr Paula Walshe",
  "data.privacy": "Privacy policy",
  "hero.title": "Cross-border case study",
  "route.label": "The route",
  "who.label": "Who it is for",
  "steps.label": "The four steps",
  "pub.label": "To be published",
  "pub.study": "For the study",
  "q.label": "The questionnaire",
  "step.1.title": "Choose a route",
  "step.2.title": "Watch episode 003 with your group",
  "step.3.title": "Use the materials",
  "step.4.title": "Answer the questionnaire",
  "hero.lead":
    "Early years educators in Ireland and in England use one episode of The Pawsitive Pugs & Pals®, and a set of activities made to go with it, with a group of children, and then tell us what they saw.",
  "status.foot": "The participant information is agreed and published here first. The questionnaire opens after it.",
  "route.heading":
    "Ireland follows Aistear and England follows the EYFS. The episode and the questionnaire are the same on both routes; only the supporting notes differ, so choose the one you work to.",
  "ask.heading": "Educators working with young children in Ireland or England.",
  "ask.body":
    "The age range and the kinds of setting we are looking for are being confirmed with Dr Paula Walshe, and will be stated here before the study opens, along with how long it takes.",
  "steps.watch": "Watch it through with the children before you use any of the materials below.",
  "out.heading": "Kept apart from the study",
  "q.body":
    "It asks about what you saw and how the materials worked. It does not ask for the name of any child. Complete it after you have used the episode and the activity with your group.",
  "data.heading": "Your answers",
  "data.lead": "The study will not open until the participant information is agreed and published on this page.",
  "close.line": "How the company uses AI in making the episodes is written down on its own page.",
  "close.link": "Responsible AI",
  "facts.status.label": "Status",
  "facts.opens.label": "Opens",
  "facts.opens": "Date to be confirmed",
  "facts.routes.label": "Routes",
  "facts.routes": "Ireland (Aistear) and England (EYFS)",
  "facts.episode.label": "Episode",
  "facts.materials.label": "Materials",
  "facts.materials": "Notes with Dr Paula Walshe; games and colouring not yet supplied",
  "facts.questionnaire.label": "Questionnaire",
  "facts.questionnaire": "Draft, awaiting approval",
  "facts.results.label": "Results",
  "facts.results": "None yet",
  "route.ireland.summary":
    "Aistear is the early childhood curriculum framework for children from birth to six in Ireland. It is organised around four themes, and the Ireland route reads the episode and its activities against them.",
  "route.ireland.themes.label": "The four Aistear themes",
  "route.england.summary":
    "The Early Years Foundation Stage is the statutory framework for children from birth to the end of the reception year in England. The England route reads the episode and its activities against its areas of learning.",
  "route.england.themes.label": "The EYFS areas of learning",
};
