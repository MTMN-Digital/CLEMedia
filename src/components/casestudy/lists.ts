/* What an educator is asked to do, in order. Said once, here. No time
   estimate: none has been given, and it is listed as owed. The titles are
   editable (step.N.title in copy.ts); the bodies stay here. */
export const STEP_BODIES: { body: string }[] = [
  { body: "Ireland or England, so the notes you use cite the framework you work to." },
  { body: "Chicken Vision, from the series, free to watch." },
  { body: "A game, colouring pages and Paula's offline activity, with instructions for each." },
  { body: "A short set of questions about what you saw and how the materials worked." },
];

/* What will be published here, for the study. Every value is the page's own
   wording for that item, trimmed to one row. Each is owed, and says so. */
export const FOR_STUDY = [
  { label: "Aistear supporting notes", value: "With Paula for final approval; a download and a short note on how to use them alongside the episode" },
  { label: "EYFS supporting notes", value: "With Paula for final approval; the same" },
  { label: "Selected games", value: "Not supplied yet; instructions on how to play them with a group" },
  { label: "Colouring materials", value: "Not supplied yet; printable pages from the episode, with a note on how to use them" },
  { label: "Paula's offline activity", value: "Not supplied yet; designed by Dr Paula Walshe to follow the episode away from a screen, with step by step instructions" },
  { label: "Participant information", value: "Being agreed; published here before the study opens" },
  { label: "The questionnaire", value: "A draft is with Dr Paula Walshe; published here when the study opens" },
  { label: "Reviewed study findings", value: "None yet; added once the study has run and the responses have been reviewed" },
];

/* Kept apart from the study. The workshop is done and is not part of it. */
export const APART = [
  { label: "Banteer workshop feedback", value: "The workshop in Banteer is complete and is not part of this study; its feedback will be added here once the feedback letter is supplied" },
];

/* What happens to the answers. Only what is true of the form is stated as
   fact; the rest is stated as owed. Privacy wording, reproduced as it was. */
export const ANSWERS = [
  { k: "What the form asks", v: "Your role and setting, the age and number of the children, how you rated the episode and the activity, and two open questions. The email address is optional." },
  { k: "What it does not ask", v: "The name of any child, or anything that identifies one. The form does not ask for it and tells you not to include it." },
  { k: "Who reads the answers", v: "To be confirmed in the participant information." },
  { k: "How long they are kept", v: "To be confirmed in the participant information." },
  { k: "Having yours removed", v: "To be confirmed in the participant information." },
];


/* The themes of each framework, shown in the route panel. */
export const IRELAND_THEMES = [
  { theme: "Well-being" },
  { theme: "Identity and Belonging" },
  { theme: "Communicating" },
  { theme: "Exploring and Thinking" },
];

export const ENGLAND_THEMES = [
  { theme: "Communication and language" },
  { theme: "Personal, social and emotional development" },
  { theme: "Physical development" },
  { theme: "Literacy" },
  { theme: "Mathematics" },
  { theme: "Understanding the world" },
  { theme: "Expressive arts and design" },
];
