import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { BOOKS_STATEMENT, BOOKS_CREDIT } from "@/lib/books";

/* ============================================================================
   The Learn row's contents, and the page's signature: the real material.

   Episode one's three book covers on a rule, and four real pages under them
   at a size where their set type can be read. It is the first time the site
   shows the thing a child will hold, and it sits a screen below a device that
   admits it is drawn.

   Exported 2026-10-28 from the client's Drive into public/brand/activity:
   the three `Cover-1_*` covers (only those: `Cover-2_*` carries a rendered
   garden behind the illustration, which is the show's vocabulary, not the
   product's), three landscape pages from the colour activity book with their
   true page numbers read from the PDF, and page one of the away-from-the-
   screen booklet, which names no author and is captioned without one.

   Every cover prints "Designed & Illustrated by Victoria Buchkova", so the
   credit line covers all three. Nothing here says the books are in the app:
   where they ship is a question for the client, and the note under the pages
   says so until it is answered.
   ========================================================================== */

const DIR = "/brand/activity";

interface Pic {
  height: number;
  file: string;
  alt: string;
  width: number;
}

function Picture({ pic, sizes, className = "" }: { sizes: string; pic: Pic; className?: string }) {
  const b = `${DIR}/${pic.file}`;
  return (
    <picture>
      <source type="image/webp" srcSet={`${b}.webp ${pic.width}w, ${b}@2x.webp ${pic.width * 2}w`} sizes={sizes} />
      <img
        src={`${b}.jpg`}
        srcSet={`${b}.jpg ${pic.width}w, ${b}@2x.jpg ${pic.width * 2}w`}
        sizes={sizes}
        alt={pic.alt}
        width={pic.width}
        height={pic.height}
        loading="lazy"
        decoding="async"
        className={`block h-auto w-full rounded-[var(--radius-sm)] border-[1.5px] border-rule ${className}`}
      />
    </picture>
  );
}

const COVERS: Pic[] = [
  { file: "ep1-activity", alt: "The cover of the episode one activity book: Finn and Fia over a sign reading Episode 1, The Feather, with Activity Book printed under it", width: 440, height: 311 },
  { file: "ep1-colouring", alt: "The cover of the episode one colouring book: Finn and Fia over a sign reading Episode 1, The Feather, with Colouring Book printed under it", width: 440, height: 311 },
  { file: "ep1-offline", alt: "The cover of the episode one offline games booklet, portrait: Finn and Fia over a sign reading Episode 1, The Feather, with Offline Games printed under it", width: 220, height: 311 },
];

/* The true page numbers, read from `Activity pages-01-colour.pdf` at export. */
const PAGES: (Pic & { caption: string })[] = [
  { file: "ep1-ispy", alt: "An activity page headed I Spy: count the pictures and write the numbers in the boxes, with feathers, frogs, ladybirds and butterflies to count", width: 440, height: 311, caption: "I Spy, activity book p.4" },
  { file: "ep1-maze", alt: "An activity page headed Maze challenge: help the pug get the feather", width: 440, height: 311, caption: "Maze challenge, activity book p.6" },
  { file: "ep1-breathing", alt: "An activity page headed Feather breathing: follow the arrows with your index finger, breathe out and back in slowly as you trace it", width: 440, height: 311, caption: "Feather breathing, activity book p.19" },
];

const AWAY: Pic = {
  file: "ep1-away-1",
  alt: "Page one of the episode one booklet of activities away from the screen: Educational Materials, Episode 1, The Feather, the key vocabulary list, an adult supervision note, and the felted CLE Family Media, Made in Ireland badge",
  width: 320,
  height: 452,
};

/* The pages arrive: on viewport entry each rises 10px and fades in, 600ms,
   70ms apart in reading order, once. The hidden state sits behind `is-armed`,
   which only JS adds and never under reduced motion, so no JS, crawlers and
   reduced-motion readers all get finished pages. */
function usePagesArrive() {
  const ref = useRef<HTMLUListElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof IntersectionObserver !== "undefined") setArmed(true);
  }, []);
  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);
  return { ref, cls: `sheet-pages ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""}` };
}

export function LearnMaterial({ awayCaption, note }: { awayCaption: string; note: string }) {
  const pages = usePagesArrive();
  return (
    <div className="min-w-0">
      {/* The three covers. At lg a row of three on one rule, the two landscape
          covers and the portrait one standing at one height. On a phone a
          scroll-snap row at 78% of the viewport, so the titles stay readable. */}
      <ul className="sheet-covers" aria-label="The three books for episode one">
        {COVERS.map((c) => (
          <li key={c.file} className={c.width < c.height ? "sheet-cover sheet-cover--portrait" : "sheet-cover"}>
            <Picture pic={c} sizes={c.width < c.height ? "(min-width: 1024px) 200px, 39vw" : "(min-width: 1024px) 400px, 78vw"} />
          </li>
        ))}
      </ul>
      <p className="t-sm mt-5 max-w-[78ch] text-body">
        The three books for episode one. {BOOKS_STATEMENT} {BOOKS_CREDIT}
      </p>

      {/* Four pages at reading size: three landscape pages, then the portrait
          page beside its caption. Stacked at full width on a phone, each with
          its caption under it: a page is read, not browsed. */}
      <ul ref={pages.ref} className={`${pages.cls} mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2`}>
        {PAGES.map((p) => (
          <li key={p.file}>
            <Picture pic={p} sizes="(min-width: 1024px) 490px, (min-width: 640px) 45vw, 100vw" />
            <p className="mt-2.5 font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body">{p.caption}</p>
          </li>
        ))}
        <li className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="w-full sm:w-[62%] sm:shrink-0">
            <Picture pic={AWAY} sizes="(min-width: 1024px) 311px, (min-width: 640px) 28vw, 100vw" />
          </div>
          <p className="t-body max-w-[36ch] text-ink">{awayCaption}</p>
        </li>
      </ul>

      <p className="t-body mt-8 max-w-[64ch] text-body">{note}</p>
    </div>
  );
}
