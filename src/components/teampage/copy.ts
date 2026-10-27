/* The team page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("team", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. The
   people themselves come from src/components/team/people.ts and the admin's
   Team panel, not from here. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Our team",
  "hero.eyebrow_sub": "Core team and advisers",
  "hero.aside": "A small core team.",
  "hero.title": "The people who make every episode",
  "hero.lead":
    "Between them they decide what gets made, how it gets made and what it is supposed to do for the child watching. Alan writes and animates, and the rest of them read every draft and watch every episode before it is released.",
  "dossier.heading": "A script goes round three or four times. The cut goes round until everyone is happy.",
  "people.heading": "In their own words, cut down and never added to.",
  "cta.heading": "Every episode passes through these people before a child sees it",
  "cta.lead":
    "How an episode is written, reviewed and made, and where AI is and is not used, is set out in full on the Responsible AI page.",
};
