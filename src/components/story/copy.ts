/* The story page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("story", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. The
   headline's accent clause sits between *stars*, around the words the page
   sets in <em>. The hero picture is an image block and has no entry. */
export const COPY: Record<string, string> = {
  "hero.eyebrow": "Our story",
  "hero.eyebrow_sub": "Conor Sexton, founder and CEO",
  "hero.aside": "On what he saw, what he could not find, and what it took to build the alternative.",
  "hero.title": "I did not set out to start a *media company.*",
  "saw.heading": "It started while I was minding a friend's four-year-old.",
  "parent.heading": "Education was part of the project from the outset.",
  "here.heading": "From head butcher to children's media.",
  "build.heading": "I could not have made this on my own, and I did not try.",
  "film.heading": "The mission, in his own words",
  "reach.heading": "Free on YouTube for now, with an app on the way.",
  "next.heading": "Interested in working with us?",
  "next.lead": "I would rather answer your questions directly than have you guess at them from a website.",
};
