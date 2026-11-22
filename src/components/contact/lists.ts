/* Repeated items on the contact page: the defaults of the list block in
   cms.ts and what the page renders until a list is saved. */

/** The four audiences sent to pages that already answer them. Where each
 *  one goes stays in code, matched by index (see TARGETS in Contact.tsx). */
export const ELSEWHERE_ITEMS: { title: string; who: string; line: string }[] = [
  {
    who: "Investors and partners",
    title: "Our story",
    line: "Conor Sexton on what he saw, what he could not find, and what it took to build the alternative.",
  },
  {
    who: "Broadcasters and distributors",
    title: "The team and the advisers",
    line: "Who makes each episode, and what each of them does.",
  },
  {
    who: "Educators and schools",
    title: "Responsible AI",
    line: "The five phases an episode goes through, and where AI is and is not used in making one.",
  },
  {
    who: "Parents",
    title: "The show's own site",
    line: "Episodes, characters and the family activities all live there rather than here.",
  },
];
