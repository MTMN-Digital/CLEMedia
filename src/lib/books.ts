/* ============================================================================
   The printable books, one truth for /app and /shop (cross-site rule 6).

   Measured from the client's Drive with pdfinfo on 2026-10-28 (the shop
   plan's "shared numbers" table). Episodes 1 to 4 ship four PDFs: the
   activity book in colour and in black and white, the colouring book, and
   the activities away from the screen. Episodes 5 and 6 ship three: the
   activity book in black and white only. Eighteen books, twenty-two PDFs,
   all A4; activity and colouring books landscape, the away-from-the-screen
   booklet portrait. Every cover is printed "Designed & Illustrated by
   Victoria Buchkova".

   Page copy prints BOOKS_STATEMENT word for word and no other count. "318"
   and "22" live here and in the plan only, so the two pages cannot drift.
   Prices are never here: they come from products.price_cents per row.
   ========================================================================== */

/** The one sentence of counts both pages print, verbatim. Never reworded. */
export const BOOKS_STATEMENT =
  "Three books for every episode: an activity book, a colouring book and a set of activities away from the screen. For episodes one to four the activity book comes in colour and in black and white. Eighteen books, all A4.";

/** The credit, as the covers print it (with "and" for the ampersand in prose). */
export const BOOKS_CREDIT = "Designed and illustrated by Victoria Buchkova.";

/** The away-from-the-screen booklet names no author. Caption it without one
 *  until the client does (verdict, /app item 3 and /shop item 4). */
export const AWAY_LABEL = "Activities away from the screen";

export type BookKind = "away" | "colouring" | "activity";

export interface BookFile {
  kind: BookKind;
  /** What the product page's "In the folder" line calls it. */
  label: string;
  pages: number;
  /** Activity book only: which editions ship. */
  editions?: ("black and white" | "colour")[];
}

export interface EpisodePack {
  /** Episode number, 1 to 6 (episodes.ts uses "001"). */
  episode: number;
  title: string;
  /** Always three: the activity book counts once whatever its editions. */
  books: 3;
  /** PDFs in the folder: 4 for episodes 1 to 4, 3 for 5 and 6. */
  pdfs: number;
  files: BookFile[];
}

const four = (away: number): BookFile[] => [
  { kind: "activity", label: "Activity book", pages: 20, editions: ["colour", "black and white"] },
  { kind: "colouring", label: "Colouring book", pages: 20 },
  { kind: "away", label: AWAY_LABEL, pages: away },
];

export const PACKS: EpisodePack[] = [
  { episode: 1, title: "The Feather", books: 3, pdfs: 4, files: four(10) },
  { episode: 2, title: "The Strawberry", books: 3, pdfs: 4, files: four(13) },
  { episode: 3, title: "Chicken Vision", books: 3, pdfs: 4, files: four(17) },
  { episode: 4, title: "The Cuckoo", books: 3, pdfs: 4, files: four(13) },
  {
    episode: 5,
    title: "Colour Quest",
    books: 3,
    pdfs: 3,
    files: [
      { kind: "activity", label: "Activity book", pages: 21, editions: ["black and white"] },
      { kind: "colouring", label: "Colouring book", pages: 20 },
      { kind: "away", label: AWAY_LABEL, pages: 13 },
    ],
  },
  {
    episode: 6,
    title: "Fluffy Clouds",
    books: 3,
    pdfs: 3,
    files: [
      { kind: "activity", label: "Activity book", pages: 20, editions: ["black and white"] },
      { kind: "colouring", label: "Colouring book", pages: 20 },
      { kind: "away", label: AWAY_LABEL, pages: 11 },
    ],
  },
];

/** "Activity book, 20 pages, in colour and in black and white". The product
 *  page's "In the folder" line for one file, from the table above. */
export function fileLine(f: BookFile): string {
  const base = `${f.label}, ${f.pages} pages`;
  if (!f.editions) return base;
  return f.editions.length > 1 ? `${base}, in colour and in black and white` : `${base}, ${f.editions[0]}`;
}
