/* The home page's repeated items, as plain-string arrays. Each one is the
   default for a list block (cms.ts passes the same array to list(), the page
   reads it through useList). Anything that is not text (the drawing a stage
   belongs to, the page a card links to) stays in code, matched by index. */

export type Finding = {
  figure: string;
  body: string;
  unit: string;
  source: string;
  href: string;
};

/* Published results, each with the paper it comes from. The link is a field so
   a new item can never point at somebody else's paper. */
export const FINDINGS: Finding[] = [
  {
    figure: "9",
    unit: "minutes",
    body:
      "Four-year-olds who watched nine minutes of a fast, fantastical cartoon did worse on " +
      "self-control and problem-solving tasks straight afterwards than children who watched a " +
      "slower programme or drew.",
    source: "Pediatrics, 2011",
    href: "https://doi.org/10.1542/peds.2010-1919",
  },
  {
    figure: "1",
    unit: "hour",
    body:
      "The World Health Organization's daily ceiling on sedentary screen time for children aged " +
      "two to four, with less advised as better. Every minute a child watches should count.",
    source: "WHO guidelines, 2019",
    href: "https://www.who.int/publications/i/item/9789241550536",
  },
  {
    figure: "16",
    unit: "studies",
    body:
      "Pooled in a 2025 meta-analysis. What showed a short-term effect on children's attention " +
      "and self-control was fantastical content, impossible events one after another, rather " +
      "than how fast a programme was cut.",
    source: "Developmental Science, 2025",
    href: "https://doi.org/10.1111/desc.70069",
  },
];

export const FEEDBACK_PANELS = [
  {
    label: "Parents and educators",
    body:
      "Quotations from families and from educators who have used the episodes are being " +
      "gathered, and each one goes up only with the wording and the attribution that " +
      "person has agreed to.",
  },
  {
    label: "Banteer workshop",
    body:
      "A school workshop has already run in Banteer, and the school's own account of it " +
      "will be printed here under its own name. It is separate from the cross-border study " +
      "we are preparing.",
  },
];

export const BEYOND_CARDS = [
  {
    tab: "AT HOME",
    title: "For parents and children",
    body:
      "Digital learning games and downloadable play packs that turn each episode into an " +
      "activity to do together.",
    link: "Inside the app",
  },
  {
    tab: "IN THE CLASSROOM",
    title: "For educators and children",
    body:
      "Lesson-ready games and printable activities designed by educators, linked to " +
      "[Aistear / EYFS] early-learning goals.",
    link: "Printable material",
  },
];

/* Where each card goes, by index. */
export const BEYOND_LINKS = ["/app", "/shop"];

export const STAGES = [
  {
    word: "Watch",
    line: "An episode, together. Calm stories paced for how young children actually take things in, with nothing autoplaying into something nobody chose.",
  },
  {
    word: "Play",
    line: "A pause for a movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    word: "Learn",
    line: "A printable or an educator-designed activity afterwards, moving the learning off the screen entirely.",
  },
];

export const AI_RECORD = [
  { label: "Decisions", text: "Our creative and educational decisions are made by people." },
  { label: "In final production", text: "Runway for visual production. ElevenLabs for voice production." },
  { label: "Before publication", text: "Our team writes, directs, reviews and approves the work." },
];

export const ROUTES = [
  {
    who: "Broadcasters and platforms",
    line: "If you are interested in licensing, broadcasting or streaming the series.",
  },
  {
    who: "Schools and early-years settings",
    line: "If you would like to use our episodes and learning resources with your children.",
  },
  {
    who: "Press",
    line: "If you are writing about children's media, screen time or AI in production.",
  },
];
