import { type EpisodePack, PACKS, AWAY_LABEL } from "@/lib/books";
import type { Product } from "@/lib/types";

/* ============================================================================
   The static half of the catalogue: which episode a product row belongs to,
   the cover that stands in for a row with no uploaded artwork, and the three
   sample pages the product page shows under the decision.

   The shelf still reads `products`. Titles, slugs, prices and descriptions
   come from the admin and nothing here states one. What is here is the
   artwork rendered from the client's Drive on 2026-10-28 (Cover-1 of each
   activity book, never Cover-2, which puts the illustration on a photographic
   garden render and falls under the site's no-AI-imagery rule), keyed by
   episode, and a resolver that reads the episode off a row's slug or title.
   A row that names no episode gets no cover fallback and no sample band.

   Files live in public/brand/shop: webp with a jpg fallback, 1x and 2x,
   nothing over about 200KB. Every page is printed with Victoria Buchkova's
   credit; the away-from-the-screen booklet names no author, so its page is
   captioned without one (verdict, /shop item 4).
   ========================================================================== */

const ROOT = "/brand/shop";

export interface Picture {
  webp: string;
  height: number;
  jpg: string;
  webp2x: string;
  alt: string;
  width: number;
  jpg2x: string;
}

export interface SamplePage extends Picture {
  caption: string;
}

/** The motif Victoria drew into each cover, read off the renders. */
const MOTIF: Record<number, string> = {
  1: "a feather",
  2: "a strawberry",
  3: "a hen",
  4: "a nest with three eggs",
  5: "a rainbow",
  6: "two clouds",
};

/** The first activity page of each book, by the title printed on it. The
 *  name comes from the file the client sent, not from anything written here. */
const ACTIVITY_TITLE: Record<number, string> = {
  1: "Connect the dots",
  2: "All about my friend",
  3: "All about me",
  4: "Connect the dots",
  5: "Colour the rainbow",
  6: "Water Cycle",
};

function picture(base: string, width: number, height: number, alt: string): Picture {
  return {
    webp: `${base}.webp`,
    jpg: `${base}.jpg`,
    webp2x: `${base}@2x.webp`,
    jpg2x: `${base}@2x.jpg`,
    width,
    height,
    alt,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** The activity book's cover, A4 landscape, 720 x 509 at 1x. */
export function coverFor(pack: EpisodePack): Picture {
  return picture(
    `${ROOT}/covers/episode-${pad(pack.episode)}`,
    720,
    509,
    `The cover of the Episode ${pack.episode} activity book, ${pack.title}: Finn and Fia looking over the title, with ${MOTIF[pack.episode]} under it, drawn by Victoria Buchkova.`,
  );
}

/** Three real pages from the pack: the first activity page, the first
 *  colouring page and page two of the away-from-the-screen booklet. */
export function samplesFor(pack: EpisodePack): SamplePage[] {
  const dir = `${ROOT}/samples/episode-${pad(pack.episode)}`;
  const n = pack.episode;
  return [
    {
      ...picture(`${dir}/activity`, 440, 311, `A page from the Episode ${n} activity book: ${ACTIVITY_TITLE[n]}.`),
      caption: `Activity book, page: ${ACTIVITY_TITLE[n]}`,
    },
    {
      ...picture(`${dir}/colouring`, 440, 311, `The first page of the Episode ${n} colouring book, a line drawing to colour in.`),
      caption: "Colouring book, page one",
    },
    {
      ...picture(`${dir}/away`, 320, 453, `Page two of the Episode ${n} booklet of activities away from the screen.`),
      caption: `${AWAY_LABEL}, page two`,
    },
  ];
}

const slugOf = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Which episode a product row is for, read off its slug or its title: the
 * episode's own title ("the-feather", "Chicken Vision") or "episode 3" /
 * "episode-03". Null when neither names one, in which case the row renders
 * exactly as the admin filled it and nothing static is added.
 */
export function packFor(p: Pick<Product, "slug" | "title"> | null | undefined): EpisodePack | null {
  if (!p) return null;
  const hay = `${slugOf(p.slug ?? "")}-${slugOf(p.title ?? "")}`;
  for (const pack of PACKS) {
    if (hay.includes(slugOf(pack.title))) return pack;
  }
  const m = hay.match(/episode-0?([1-6])(?:-|$)/);
  if (m) return PACKS.find((pack) => pack.episode === Number(m[1])) ?? null;
  return null;
}
