/* The press kit's repeated sets, as plain strings. The page reads them with
   useList() and cms.ts registers the SAME arrays as the editor's defaults.
   Anything that is not text (where a fact's link goes) stays in Media.tsx,
   matched by position. */

/* The Facts rows that are plain text. The Registered and Player rows are built
   from the company settings and the app launch flag, so they stay in code and
   are placed between these by Media.tsx. */
export type FactItem = { value: string; label: string; link: string };

export const FACTS: FactItem[] = [
  { label: "Company", value: "CLÉ Family Media, an Irish children's media company. Watch, Play, Learn.", link: "" },
  { label: "Founder", value: "Conor Sexton, Founder & CEO.", link: "Our story" },
  {
    label: "Series",
    value: "The Pawsitive Pugs & Pals®, an animated series for children aged two to six.",
    link: "The show's own site",
  },
  { label: "Characters", value: "Finn, the fawn pug. Fia, the black pug.", link: "" },
  {
    label: "Episodes",
    value:
      "Series one. Four released and free to watch: The Feather (9:16), The Strawberry (11:10), Chicken Vision (10:41), The Cuckoo (9:58). Two further titles, Colour Quest and Fluffy Clouds, not yet released.",
    link: "The show's own site",
  },
  { label: "Where to watch", value: "The show's own site, pawsitivepugs.com.", link: "" },
  {
    label: "Imagery",
    value:
      "The series is animated. How imagery and voice are produced, and which tools are used where, is set out on the Responsible AI page.",
    link: "Responsible AI",
  },
];

/* The mistakes the company does not want in print. */
export type SpellingItem = { pending: string; value: string; label: string };

export const SPELLINGS: SpellingItem[] = [
  {
    label: "The company",
    value: "CLÉ Family Media, with the É, is the trading name. The registered company is CLE Family Media 25 Limited, without it.",
    pending: "",
  },
  { label: "The series", value: "The Pawsitive Pugs & Pals®, with the ampersand and the registered mark on first use.", pending: "" },
  { label: "The founder", value: "Conor Sexton. Founder & CEO.", pending: "" },
  { label: "The dogs", value: "Finn and Fia. Finn is the fawn pug, Fia the black pug.", pending: "" },
  { label: "Episode four", value: "The Cuckoo.", pending: "Title for print: to be confirmed" },
];

/* The labels of the four rows of art, in the order press.ts lists them. */
export const ART_LABELS: { label: string }[] = [
  { label: "Marks" },
  { label: "Title slates" },
  { label: "Frames" },
  { label: "The film" },
];
