/* The home page's editable copy, keyed by block key (src/lib/blocks.ts).

   THIS IS THE DEFAULT, NOT A COPY. Each string is the page's own wording,
   character for character, and the page renders it through
   useBlock("home", key, COPY[key]), so an empty content_blocks table shows
   the page exactly as it is written here. The Pages panel reads the same
   object to show the original beside whatever has been changed.

   Headlines with an accent clause carry it between *stars*, around the same
   words the page wraps in an Underline (see emphasis() in src/lib/content.ts).
   The "Watch. Play. Learn." headline is the brand line and is not here. */
export const COPY: Record<string, string> = {
  "hero.cta_primary": "How we make it",
  "hero.cta_secondary": "Visit the show",
  "thesis.heading": "We are not going to tell anyone their child watches too much television.",
  "thesis.pull": "We would rather an episode started something a child *carries on with*.",
  "thesis.lead_1":
    "The gap we saw is narrower than that. Not enough content made at a child's pace, with genuine educational intent, and with a clear account of who made it and who checked it.",
  "thesis.lead_2":
    "Much of what fills the market is fast and loud, built around how long a child keeps watching rather than what they take away from it. Attention is what gets measured, so attention is what gets designed for.",
  "model.heading":
    "Designed to move a child from the screen into play and conversation, rather than to hold them in front of it.",
  "evidence.heading": "The research we build on.",
  "series.heading": "Our first original series",
  "series.lead":
    "The Pawsitive Pugs & Pals. Finn, the fawn pug, and Fia, the black pug, in a garden that rewards slowing down. Four episodes released so far, nine to eleven minutes each.",
  "ai.heading": "AI is a production tool. *People remain responsible* for the work.",
  "ai.pull":
    "Calling this work handmade would be untrue. Calling it AI-generated would erase the people who actually make the decisions.",
  "ai.cta": "Read the full position",
  "updates.heading": "Occasional updates",
  "updates.body": "Production notes and company news, for adults. Infrequent, and easy to leave.",
};
