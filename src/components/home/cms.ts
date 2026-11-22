import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { STAGES, FINDINGS, ROUTES, FEEDBACK_PANELS, AI_RECORD, BEYOND_CARDS } from "@/components/home/lists";

/* Extra editable blocks for the "home" page, owned by this page's folder.
   blocks.ts appends them to the registry. Keys already in the base table
   (hero.cta_*, thesis.*, model.heading, evidence.heading, series.*, ai.*,
   updates.*, photo and caption blocks) are not repeated here. */
const HOME = "src/pages/Home.tsx";
const DIR = "src/components/home";

export const CMS: BlockDef[] = [
  line("home", "Top of the page", "hero.eyebrow", "Small label, top left of the film", `${DIR}/HeroFilm.tsx: p.film-eyebrow`),
  line("home", "Top of the page", "hero.ages", "Age range beside that label", `${DIR}/HeroFilm.tsx: p.film-eyebrow span`),
  line("home", "Top of the page", "hero.note", "Short line, top right of the film", `${DIR}/HeroFilm.tsx: p.film-note`),
  line("home", "Top of the page", "hero.cta_case", "Third button", `${DIR}/HeroFilm.tsx: third <Button> label`),

  list(
    "home", "How an episode works", "model.stages", "The three stages beside the drawing: Watch, Play, Learn",
    `${DIR}/EpisodeRings.tsx: STAGES`, "stage",
    [
      { name: "word", label: "Stage name", kind: "line" },
      { name: "line", label: "What happens", kind: "paragraph" },
    ],
    STAGES, { min: 3, max: 3 },
  ),

  list(
    "home", "The research", "evidence.findings", "The three research figures with their papers",
    `${DIR}/Evidence.tsx: FINDINGS`, "figure",
    [
      { name: "figure", label: "Big number", kind: "line" },
      { name: "unit", label: "What it counts (minutes, hour, studies)", kind: "line", optional: true },
      { name: "body", label: "What the research found", kind: "paragraph" },
      { name: "source", label: "Paper or body it comes from, with year", kind: "line" },
      { name: "href", label: "Web address of the paper", kind: "line" },
    ],
    FINDINGS, { min: 1, max: 6 },
  ),
  para("home", "The research", "evidence.note", "Sentence under the three figures", `${DIR}/Evidence.tsx: p after the figures`),
  para("home", "The research", "evidence.caption", "Small caption at the foot of the garden band", `${HOME}: p.font-mono under Evidence`),

  line("home", "Feedback", "feedback.heading", "Headline", `${DIR}/Feedback.tsx: h2`),
  list(
    "home", "Feedback", "feedback.panels", "The two notes shown until quotations are added",
    `${DIR}/Feedback.tsx: empty-state panels`, "note",
    [
      { name: "label", label: "Small label", kind: "line" },
      { name: "body", label: "Text", kind: "paragraph" },
    ],
    FEEDBACK_PANELS, { min: 1, max: 2 },
  ),
  para("home", "Feedback", "feedback.note", "Sentence under the two notes", `${DIR}/Feedback.tsx: p.lg:col-span-2`),

  line("home", "Beyond the screen", "beyond.heading", "Large headline", `${DIR}/BeyondScreen.tsx: h2`),
  para("home", "Beyond the screen", "beyond.lead", "Sentence under the headline", `${DIR}/BeyondScreen.tsx: font-display p`),
  list(
    "home", "Beyond the screen", "beyond.cards", "The two cards: at home and in the classroom",
    `${DIR}/BeyondScreen.tsx: two cards`, "card",
    [
      { name: "tab", label: "Tab on the top edge", kind: "line" },
      { name: "title", label: "Card heading", kind: "line" },
      { name: "body", label: "Text", kind: "paragraph" },
      { name: "link", label: "Link words", kind: "line" },
    ],
    BEYOND_CARDS, { min: 1, max: 4 },
  ),

  line("home", "Who checks it", "callsheet.heading", "Headline above the film strip of five steps", `${DIR}/CallSheet.tsx: h2`),
  line("home", "Who checks it", "callsheet.link", "Link under the film strip", `${DIR}/CallSheet.tsx: TextLink`),

  line("home", "How we use AI", "ai.tab", "Tab on the top edge of the card", `${HOME}: span.card-tab`),
  list(
    "home", "How we use AI", "ai.record", "The three facts in the card beside the quote",
    `${HOME}: dl in the position card`, "fact",
    [
      { name: "label", label: "Small label", kind: "line" },
      { name: "text", label: "Text", kind: "paragraph" },
    ],
    AI_RECORD, { min: 1, max: 5 },
  ),

  line("home", "Get in touch", "touch.heading", "Headline", `${DIR}/GetInTouch.tsx: h2`),
  list(
    "home", "Get in touch", "touch.routes", "The people who might get in touch (first one is shown largest)",
    `${DIR}/GetInTouch.tsx: ROUTES`, "route",
    [
      { name: "who", label: "Who they are", kind: "line" },
      { name: "line", label: "When to get in touch", kind: "paragraph" },
    ],
    ROUTES, { min: 1, max: 5 },
  ),

  line("home", "The series", "slates.watch", "Link words at the foot of a released episode", `${DIR}/EpisodeSlate.tsx: last p`),
  line("home", "The series", "slates.guidance", "Small label before the guidance credit", `${DIR}/EpisodeSlate.tsx: dt`),
  line("home", "The series", "slates.passed_by", "Small label before the reviewer credit", `${DIR}/EpisodeSlate.tsx: dt`),
  line("home", "The series", "filmstrip.hint", "Hint along the foot of the film strip", `${DIR}/FilmStrip.tsx: edge print`),
];
