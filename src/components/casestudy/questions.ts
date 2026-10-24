/* ============================================================================
   The educator questionnaire, as a DRAFT.

   EVERY QUESTION IN THIS FILE IS A DRAFT AWAITING THE EDUCATION ADVISER'S
   APPROVAL. None has been approved by anyone. They are written so the form
   can be built, read and reviewed, for an educator who has used episode 003
   and its offline activity with one group of children. The wording, the
   scale and which questions exist at all are for the adviser to change, and
   when she does, this file changes and nothing else has to.

   Two rules the drafts follow, because they hold whatever the adviser decides:
   no question asks for a child's name or any detail that identifies a child,
   and nothing is required that the educator could not answer from what they
   saw (no question asks them to measure learning).
   ========================================================================== */

export type Choice = { value: string; label: string };

export const ROLES: Choice[] = [
  { value: "childminder", label: "Childminder" },
  { value: "early_years_educator", label: "Early years educator" },
  { value: "teacher", label: "Teacher" },
  { value: "other", label: "Other" },
];

export const SETTINGS: Choice[] = [
  { value: "home", label: "In a home" },
  { value: "centre", label: "Early years centre" },
  { value: "school", label: "School" },
  { value: "other", label: "Somewhere else" },
];

export const AGES: Choice[] = [
  { value: "under_3", label: "Under 3" },
  { value: "3_to_4", label: "3 to 4" },
  { value: "5_to_6", label: "5 to 6" },
  { value: "mixed", label: "A mix of ages" },
];

export const SIZES: Choice[] = [
  { value: "1_to_5", label: "1 to 5" },
  { value: "6_to_12", label: "6 to 12" },
  { value: "13_to_20", label: "13 to 20" },
  { value: "over_20", label: "More than 20" },
];

export const OFFLINE: Choice[] = [
  { value: "full", label: "All of it" },
  { value: "part", label: "Part of it" },
  { value: "none", label: "None of it" },
];

export const SCALE: Choice[] = [
  { value: "1", label: "Strongly disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neither" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly agree" },
];

/** Statements rated on SCALE. `field` matches the column in migration 0007. */
export const STATEMENTS: { field: string; text: string; onlyIfOffline?: boolean }[] = [
  { field: "r_attention", text: "The children stayed with the episode for most of its length." },
  { field: "r_language", text: "The language and pace of the episode suited the children I watched it with." },
  { field: "r_framework", text: "I could connect what the children did to the learning themes of the framework for my route." },
  { field: "r_offline", text: "The offline activity was easy to set up and run with my group.", onlyIfOffline: true },
  { field: "r_again", text: "I would use another episode and activity in the same way." },
];

export const OPEN: { field: string; text: string }[] = [
  { field: "noticed", text: "What did you notice the children say or do during or after the episode? Please do not include any child's name or anything that could identify a child." },
  { field: "change", text: "What would you change about the episode, the materials or the activity?" },
];
