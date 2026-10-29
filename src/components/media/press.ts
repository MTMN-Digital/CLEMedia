import { COMING_SOON, EPISODES } from "@/lib/episodes";

/* ============================================================================
   The press kit's manifest, 2026-10-28.

   Every file the contact sheet offers, with its pixel size, format and weight
   written here rather than guessed in JSX. The numbers were measured on the
   files in public/brand and public/video (stat for bytes, PIL for pixels,
   ffprobe for the film). When a file is replaced, re-measure and change the
   line here; nothing on the page computes a size.

   The plan put this at src/lib/press.ts. lib/ is frozen for the subpage
   rebuild, so it lives with the page's own components instead.
   ========================================================================== */

/** The day a line on the sheet last changed. Not a company attestation, not
 *  a version: the sheet's wording was rebuilt on this date. Change it by hand
 *  when a fact or a spelling changes. Never new Date(). */
export const UPDATED = "2026-10-28";

/** Portraits are offered for download only once every sitter has confirmed
 *  in writing that their photograph may be reused editorially. Until then the
 *  People row lists names and roles and nothing else. Flip by hand. */
export const PRESS_PORTRAITS = false;

export function sheetDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

export type Format = "PNG" | "SVG" | "MP4" | "JPG";

export interface PressFile {
  id: string;
  /** Caption line one. The asset's own description, shortened to one line. */
  title: string;
  /** The file the link downloads. */
  file: string;
  /** The filename the browser suggests. */
  download: string;
  format: Format;
  width: number;
  height: number;
  bytes: number;
  /** The film only. */
  duration?: string;
  /** What the thumbnail shows. `webp` is optional: the vector marks are their
   *  own thumbnail. The WebPs are 360px copies in /brand/thumbs, since a tile
   *  is about 115px wide on a phone: the full files were 1.1MB for the grid.
   *  Width and height stay the original's, for the aspect ratio. */
  thumb: { src: string; width: number; height: number; webp?: string };
  alt: string;
}

export interface PressRow {
  label: string;
  files: PressFile[];
}

export function humanSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* Byte counts of the six slate downloads, in episode order. */
const SLATE_BYTES = [164092, 158376, 174680, 186636, 188942, 164451];

const MARKS: PressFile[] = [
  {
    id: "cle-mark",
    title: "The CLÉ Family Media mark, felted lettering",
    file: "/brand/cle-mark@2x.png",
    download: "cle-family-media-mark.png",
    format: "PNG",
    width: 1182,
    height: 1183,
    bytes: 1724459,
    thumb: { webp: "/brand/thumbs/cle-mark.webp", src: "/brand/cle-mark.png", width: 591, height: 591 },
    alt: "The CLÉ Family Media logo, the letters formed from needle-felted animals",
  },
  {
    id: "show-wordmark",
    title: "The Pawsitive Pugs & Pals wordmark, single colour",
    file: "/brand/show-wordmark.svg",
    download: "pawsitive-pugs-and-pals-wordmark.svg",
    format: "SVG",
    width: 1871,
    height: 523,
    bytes: 10723,
    thumb: { src: "/brand/show-wordmark.svg", width: 1871, height: 523 },
    alt: "The Pawsitive Pugs & Pals wordmark in one colour",
  },
  {
    id: "pupsplayer",
    title: "The PupsPlayer mark",
    file: "/brand/pupsplayer.svg",
    download: "pupsplayer-mark.svg",
    format: "SVG",
    width: 2713,
    height: 2681,
    bytes: 3981,
    thumb: { src: "/brand/pupsplayer.svg", width: 2713, height: 2681 },
    alt: "The PupsPlayer paw and play mark",
  },
  {
    id: "show-logo",
    title: "The show logo, felted lettering on its ground",
    file: "/brand/show-logo@2x.jpg",
    download: "pawsitive-pugs-and-pals-logo.jpg",
    format: "JPG",
    width: 1600,
    height: 900,
    bytes: 259444,
    thumb: { webp: "/brand/thumbs/show-logo.webp", src: "/brand/show-logo.jpg", width: 1000, height: 563 },
    alt: "The Pawsitive Pugs & Pals logo, needle-felted lettering with paw prints and bones",
  },
];

/* Captioned from EPISODES, so the title on the slate's line is the one the
   client set, and the two unreleased titles carry the same two words every
   other surface uses. */
const SLATES: PressFile[] = EPISODES.map((e, i) => {
  const n = i + 1;
  const title = e.released ? `Episode ${e.n}, ${e.title}` : `Episode ${e.n}, ${e.title}, ${COMING_SOON}`;
  return {
    id: `slate-${n}`,
    title,
    file: `/brand/slate-ep${n}@2x.jpg`,
    download: `pawsitive-pugs-slate-${e.n}.jpg`,
    format: "JPG",
    width: 1280,
    height: 720,
    bytes: SLATE_BYTES[i],
    thumb: { webp: `/brand/thumbs/slate-ep${n}.webp`, src: `/brand/slate-ep${n}.jpg`, width: 640, height: 360 },
    alt: `Episode ${e.n}, ${e.title}, its felted title slate, with Finn and Fia looking over it`,
  };
});

const FRAME_CAPTION = "A frame from The Pawsitive Pugs & Pals, series one";

const FRAMES: PressFile[] = [
  {
    id: "frame-meadow",
    title: FRAME_CAPTION,
    file: "/brand/show-meadow@2x.jpg",
    download: "pawsitive-pugs-frame-meadow.jpg",
    format: "JPG",
    width: 3200,
    height: 1600,
    bytes: 457659,
    thumb: { webp: "/brand/thumbs/show-meadow.webp", src: "/brand/show-meadow.jpg", width: 1600, height: 800 },
    alt: "Finn and Fia looking over a leaf in a wildflower meadow at sunrise, with a ladybird on it, a scene from The Pawsitive Pugs and Pals",
  },
  {
    id: "frame-snail",
    title: FRAME_CAPTION,
    file: "/brand/show-snail@2x.jpg",
    download: "pawsitive-pugs-frame-snail.jpg",
    format: "JPG",
    width: 3200,
    height: 1600,
    bytes: 517902,
    thumb: { webp: "/brand/thumbs/show-snail.webp", src: "/brand/show-snail.jpg", width: 1600, height: 800 },
    alt: "A snail crossing a dewy garden path in low morning sun, a scene from The Pawsitive Pugs and Pals",
  },
  {
    id: "frame-garden",
    title: FRAME_CAPTION,
    file: "/brand/story-garden@2x.jpg",
    download: "pawsitive-pugs-frame-garden.jpg",
    format: "JPG",
    width: 2400,
    height: 1600,
    bytes: 446512,
    thumb: { webp: "/brand/thumbs/story-garden.webp", src: "/brand/story-garden.jpg", width: 1200, height: 800 },
    alt: "The garden in The Pawsitive Pugs and Pals, with a rope swing hanging from an old tree",
  },
];

/* The caption names no speaker: the repository does not record who is heard
   in the film. */
const FILM: PressFile[] = [
  {
    id: "mission-film",
    title: "The mission film",
    file: "/video/mission-1440.mp4",
    download: "cle-family-media-mission-film.mp4",
    format: "MP4",
    width: 2560,
    height: 1424,
    bytes: 42422615,
    duration: "1:04",
    thumb: { webp: "/brand/thumbs/mission-poster.webp", src: "/video/mission-poster.jpg", width: 1920, height: 1068 },
    alt: "The opening frame of the CLÉ Family Media mission film",
  },
];

export const ART: PressRow[] = [
  { label: "Marks", files: MARKS },
  { label: "Title slates", files: SLATES },
  { label: "Frames", files: FRAMES },
  { label: "The film", files: FILM },
];
