/* The app page's repeated sets, as plain strings. The page reads them with
   useList() and cms.ts registers the SAME arrays as the editor's defaults, so
   the two can never drift. The client's own wording, unchanged since the
   2026-10-24 review document. */

export type AppFeature = { title: string; body: string };

/* The eight commitments, grouped by the stage of Watch, Play, Learn each one
   belongs to. */
export const WATCH_ITEMS: AppFeature[] = [
  {
    title: "Every episode, ad free",
    body: "The full run of The Pawsitive Pugs & Pals in one place, with nothing competing for a child's attention around it. No autoplay into something nobody chose.",
  },
  {
    title: "Built for small hands",
    body: "Large targets, simple navigation and no dark patterns.",
  },
];

export const PLAY_ITEMS: AppFeature[] = [
  {
    title: "Play that follows the story",
    body: "Each episode has activities built from what just happened in it, so the play reinforces the idea rather than sitting beside it as a separate game.",
  },
  {
    title: "Games, songs and a drawing canvas",
    body: "Songs, puzzles, tasks, matching, recall and jigsaw games, colouring sheets and a blank canvas to draw on. The interactive games are being built for families at home and for classroom boards.",
  },
];

export const LEARN_ITEMS: AppFeature[] = [
  {
    title: "Printables for the table",
    body: "Colouring, puzzles and activity sheets to print and take away from the screen, because not all of this should happen on one.",
  },
  {
    title: "A mindfulness guide, and the offline activities",
    body: "Paula's offline activities and a mindfulness guide, so the time after an episode has somewhere to go that is not another screen.",
  },
  {
    title: "Grounded in the learning",
    body: "Every activity maps back to the early years objective behind its episode, reviewed by the same people who review the episodes.",
  },
];

/* The games list from the client's 22 October document, as a spec rather
   than a promise. */
export const GAMES: { name: string }[] = [
  { name: "Songs" },
  { name: "Puzzles" },
  { name: "Tasks" },
  { name: "Matching" },
  { name: "Recall" },
  { name: "Jigsaws" },
  { name: "Colouring sheets" },
  { name: "A blank canvas" },
  { name: "A movement or breathing prompt" },
];

/* The four refusals, as the specification they are. */
export const WALLS: { label: string; line: string }[] = [
  { label: "Autoplay", line: "You are in control. When an episode ends, the next episode does not autoplay. The choice to continue belongs to the child and their grown-up." },
  { label: "Purchases", line: "No purchases inside a game." },
  { label: "Advertising", line: "No advertising to children anywhere in it, and nothing recommending the next thing to watch." },
  { label: "Grown-ups", line: "Clear settings for parents, behind the Grown-ups button in the player." },
];
