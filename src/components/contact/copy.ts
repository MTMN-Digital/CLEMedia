/* The contact page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("contact", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. The
   form's own labels, the subject line (which is the API's own string) and the
   registered details are not editable: the first are controls, the second is
   code, the third is a legal fact.

   REKEYED 2026-10-28 with the subpage rebuild. The page no longer opens on a
   panel, so `hero.eyebrow_sub`, `hero.aside` and `hero.title` render nowhere
   and are retired; `hero.eyebrow` is promoted to the page title and renamed
   `title`; `lead` is new and carries the one sentence beside it. */
export const COPY: Record<string, string> = {
  title: "Get in touch",
  lead: "Studios, distributors, investors, educators and press. Choose what this is about, and it arrives marked as that, with the company that makes the series.",
  "readers.heading": "Who reads what you send",
  "readers.note": "Not a shared inbox with a logo over it. These five are named on the review stages of every episode.",
  "else.heading": "Answered elsewhere",
  "else.line": "Who is asking, and where it is written down.",
};
