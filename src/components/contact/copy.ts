/* The contact page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("contact", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. The
   headline's accent clause sits between *stars*, around the words the page
   sets in <em>. The form's own labels and the registered details are not
   editable: the first are controls, the second is a legal fact. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Get in touch",
  "hero.eyebrow_sub": "CLÉ Family Media, Ireland",
  "hero.aside": "Studios, distributors, investors, educators and press.",
  "hero.title": "Write to *the people who make it*",
  "readers.heading": "Who reads what you send",
  "else.heading": "Some of this is answered better by a page than by us.",
};
