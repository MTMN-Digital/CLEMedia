/* The Responsible AI page's editable copy, keyed by block key
   (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("ethical-ai", key, COPY[key]) so
   an empty content_blocks table shows the page exactly as written here.

   REBUILT 2026-10-28 as a position statement (docs/SUBPAGE-PLANS-2026-10-28.md,
   "## ethical-ai"). The page is a document now: a title block, a contents
   rail, six numbered clauses and an appendix. Every key below is one line of
   that document. The six commitments, the five phases, the two platforms,
   the three refusals and the four answers are the company's position and
   stay in stations.ts and in the page file; they are not editable here.

   KEYS KEPT from the old page, each with a new home:
   - hero.title     the summary line under the h1 (no *stars* any more)
   - hero.aside     the value of the "Tools named" status row
   - line.heading   the first sentence of Figure 1's caption
   - line.lead      the first paragraph of clause 1
   - commit.heading and commit.lead  open clause 6
   RETIRED: hero.eyebrow, hero.eyebrow_sub, lines.heading, faq.heading (the
   headings they fed are gone; the clause headings replace them). */
export const COPY: Record<string, string> = {
  /* Title block */
  title: "Responsible AI",
  "hero.title": "AI is a production tool. People remain responsible for the work.",
  "applies.value": "Every episode of The Pawsitive Pugs & Pals®",
  "hero.aside": "Runway, ElevenLabs",

  /* Figure 1 */
  "line.heading": "People decide at every phase and the tools sit in one place in the middle.",
  "figure.caption":
    "The sequence an episode goes through before it reaches a child; when the final sign-off asks for changes, the work goes back round until everyone is happy.",

  /* Clause headings. Nouns naming what each clause holds, never claims. */
  "clause.1.heading": "Position",
  "clause.2.heading": "How an episode is made",
  "clause.3.heading": "The tools",
  "clause.4.heading": "What a tool is never used for",
  "clause.5.heading": "Six commitments",
  "clause.6.heading": "Review of this position",
  "appendix.heading": "Questions people ask",

  /* 1 Position */
  "line.lead":
    "Our creative and educational decisions are made by people. Our team directs, reviews and approves the work before publication.",
  "position.second":
    "Calling this work handmade would be untrue. Calling it AI-generated would erase the people who actually make the decisions. Runway and ElevenLabs sit inside final production, and this document says so by name. The story, the script, the direction, every review and the final approval are theirs.",
  "position.third":
    "This document sets out where the tools sit, what they are never used for, the commitments the company holds itself to, and what the reviews are for.",

  /* 2 How an episode is made */
  "made.lead":
    "An episode passes through five phases, shown in Figure 1. People decide at every one of them; the tools are used at one point, between the locked script and the animation.",
  "return.body":
    "The dashed return is the part that matters. When the final review asks for changes, the work goes back into production and is re-reviewed, and the team watches and revises again until everyone is happy with the episode and signs it off for release.",
  "reviews.line": "The people in the sequence are listed on the team page.",

  /* 3 The tools */
  "tools.note":
    "Both sit inside a human-led workflow rather than operating as autonomous content creators. As the technology changes we will keep reviewing the platforms we use, their commercial terms, and how they align with our standards on intellectual property, consent and responsible production.",

  /* 6 Review of this position */
  "commit.heading": "The technology will keep changing. The responsibility will not.",
  "commit.lead":
    "As the company grows we will keep reviewing our practice around human creative authorship, intellectual property and commercial rights, performer and voice consent, tool selection, transparency with audiences and partners, child safety, educational integrity, and making sure technology supports rather than replaces meaningful human creativity.",
  "review.body":
    "If something here does not satisfy you, whether you are a parent, an educator or a distribution partner, we would genuinely rather have the conversation than have you assume.",
  "review.link": "Write to us",
};
