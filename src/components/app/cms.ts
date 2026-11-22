import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { PAGE_CAPTIONS } from "./LearnMaterial";
import { WALLS, PLAY_ITEMS, GAMES, LEARN_ITEMS, WATCH_ITEMS } from "./items";

/* Extra editable blocks for the "app" page, owned by this page's folder.
   blocks.ts appends them to the registry. Defaults live in AppPage.tsx (COPY)
   and items.ts. See .parallel/portal/CONTRACT.md, Run 3. */
const APP = "src/pages/AppPage.tsx";
const FEATURE_FIELDS = [
  { name: "title", label: "Feature name", kind: "line" as const },
  { name: "body", label: "What it means", kind: "paragraph" as const },
];

export const CMS: BlockDef[] = [
  line("app", "Top of the page", "device.credit", "Small note under the drawn tablet (shows until a real screenshot is uploaded)", `${APP}: drawn-from-plan note`),

  line("app", "Status", "status.label_status", "Status table: the first row's label", `${APP}: FactRows label`),
  line("app", "Status", "status.label_holds", "Status table: the second row's label", `${APP}: FactRows label`),
  line("app", "Status", "status.label_for", "Status table: the third row's label", `${APP}: FactRows label`),
  line("app", "Status", "status.label_stores", "Status table: the fourth row's label", `${APP}: FactRows label`),
  line("app", "Status", "status.stores_empty", "Status table: what the stores row says until the store links are added", `${APP}: FactRows stores`),
  line("app", "Status", "status.label_until", "Status table: the last row's label", `${APP}: FactRows label`),
  line("app", "Status", "until.lead", "Status table, last row: the words before the 'listed below' link", `${APP}: Until then row`),
  line("app", "Status", "until.link", "Status table, last row: the link down to the episodes", `${APP}: Until then row`),
  line("app", "Status", "until.notify", "Status table, last row: the link down to the email sign-up", `${APP}: Until then row`),

  line("app", "What is in it", "watch.title", "Watch: the stage name (also the tab and the drawn tablet's footer)", `${APP}: StageLabel watch`),
  para("app", "What is in it", "watch.line", "Watch: the sentence under the stage name (also under the tab)", `${APP}: StageLabel watch`),
  line("app", "What is in it", "play.title", "Play: the stage name (also the tab and the drawn tablet's footer)", `${APP}: StageLabel play`),
  para("app", "What is in it", "play.line", "Play: the sentence under the stage name (also under the tab)", `${APP}: StageLabel play`),
  line("app", "What is in it", "learn.title", "Learn: the stage name (also the tab and the drawn tablet's footer)", `${APP}: StageLabel learn`),
  para("app", "What is in it", "learn.line", "Learn: the sentence under the stage name (also under the tab)", `${APP}: StageLabel learn`),
  list("app", "What is in it", "watch.items", "Watch: what the app does for watching (list beside the episode tiles)", `${APP}: StageLabel watch`, "feature", FEATURE_FIELDS, WATCH_ITEMS, { max: 4 }),
  list("app", "What is in it", "play.items", "Play: what the app does for playing (list beside the games)", `${APP}: StageLabel play`, "feature", FEATURE_FIELDS, PLAY_ITEMS, { max: 4 }),
  list("app", "What is in it", "learn.items", "Learn: what the app does for learning (list beside the books)", `${APP}: StageLabel learn`, "feature", FEATURE_FIELDS, LEARN_ITEMS, { max: 5 }),
  list("app", "What is in it", "play.games", "The planned games and activities, one per line", `${APP}: Play row games`, "game or activity", [{ name: "name", label: "Game or activity", kind: "line" }], GAMES, { max: 16 }),

  line("app", "What is in it", "learn.covers_caption", "Learn: the words before the books credit, under the three covers", `${APP}: LearnMaterial covers caption`),
  list("app", "What is in it", "learn.captions", "Learn: captions under the three sample pages, in page order", `${APP}: LearnMaterial pages`, "caption", [{ name: "caption", label: "Caption", kind: "line" }], PAGE_CAPTIONS, { min: 3, max: 3 }),

  list("app", "What it will not do", "walls.items", "The things the app will not do (label and sentence)", `${APP}: WALLS`, "promise", [
    { name: "label", label: "Short label", kind: "line" },
    { name: "line", label: "Sentence", kind: "paragraph" },
  ], WALLS, { max: 6 }),

  line("app", "Who checks it", "check.link", "Link text under the review sentence", `${APP}: review link`),

  line("app", "Closing", "close.shop", "Closing link to the shop", `${APP}: closing links`),
  line("app", "Closing", "close.show", "Closing link to the show's own site", `${APP}: closing links`),
];
