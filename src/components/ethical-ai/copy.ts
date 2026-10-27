/* The Responsible AI page's editable copy, keyed by block key
   (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("ethical-ai", key, COPY[key]) so
   an empty content_blocks table shows the page exactly as written here. The
   headline's accent clause sits between *stars*, around the words the page
   sets in <em>. The six commitments and the four questions are the company's
   position and are not editable here. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Responsible AI",
  "hero.eyebrow_sub": "How an episode is made",
  "hero.aside": "Runway for visual production. ElevenLabs for voice production.",
  "hero.title": "AI is a production tool. *People remain responsible* for the work.",
  "line.heading": "People decide at every phase. The tools sit in one place in the middle.",
  "line.lead":
    "Our creative and educational decisions are made by people. Our team directs, reviews and approves the work before publication.",
  "lines.heading": "People decide what a story teaches. Tools assist with how it looks and sounds.",
  "faq.heading": "Which tools, who approves, and what happens when a review finds a problem.",
  "commit.heading": "The technology will keep changing. The responsibility will not.",
  "commit.lead":
    "As the company grows we will keep reviewing our practice around human creative authorship, intellectual property and commercial rights, performer and voice consent, tool selection, transparency with audiences and partners, child safety, educational integrity, and making sure technology supports rather than replaces meaningful human creativity.",
};
