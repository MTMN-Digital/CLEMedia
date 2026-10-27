import { useEffect, type ReactNode } from "react";
import { ASSETS, type AssetKey } from "@/lib/brand";
import type { ImageOverride } from "@/lib/content";

/* ============================================================================
   The opening of every inner page, in the hero's language.

   WHY IT EXISTS, 2026-10-27. The client rates the home hero as by far the
   best thing on the site, and every other page opened on a heading and a grey
   paragraph at the left edge of the paper, which is the shape the client had
   just asked us to stop using. This carries the hero's own geometry to the
   rest of the site, so an inner page reads as the same publication rather than
   as a different template.

   WHAT IT TAKES FROM THE HERO, unchanged: the frame (`.film-hero`,
   `.film-frame`, `.film-stage` and `.film-copy` are the hero's own classes,
   so the gutter, the radius, the dark gaps and the phone collapse cannot
   drift from it), the four corners (identifier top left, a short aside top
   right, the headline bottom left, the actions under it), and the header
   floating on the picture, which `Layout` already does for anything carrying
   `.film-hero`.

   WHAT IS ITS OWN: a still in place of the film, a scrim retuned for a
   headline of two or three lines rather than three words (see `.page-hero`
   in index.css, where the measurements are), the headline face set for a
   sentence rather than a poster, and a provenance credit in the bottom right
   corner, because every frame from the series says what it is.

   TWO VARIANTS. With `asset`, the picture frame. Without it, the same corner
   grid on a rounded panel, in the hero's own dark (`tone="ink"`, cream type)
   or on the deeper paper (`tone="wall"`, ink type), for the pages that have no
   picture to stand on: the legal documents, the journal masthead, a
   download receipt, the 404.

   IT IS THE PAGE'S ONE ORCHESTRATED ENTRANCE. The picture settles, then the
   corners, the headline and the actions arrive in that order. CSS only, so the
   QA sweep can zero the durations, and nothing at all under reduced motion.
   A page that mounts this does not add a second entrance of its own.
   ========================================================================== */

export type PageHeroSize = "short" | "full" | "tall";

export function PageHero({
  id,
  eyebrow,
  title,
  aside,
  actions,
  asset,
  position,
  credit,
  size = "tall",
  tone = "ink",
  override,
}: {
  /** The headline's id. The section is labelled by it. */
  id: string;
  /** Top left. Mono, uppercase. A second line goes in a `<span>`. */
  eyebrow: ReactNode;
  /** Bottom left, the page's h1. Wrap a clause in `<em>` for the accent colour. */
  title: ReactNode;
  /** Top right. One short line, two at most. Never a paragraph. */
  aside?: ReactNode;
  /** Under the headline. Buttons, at most two. */
  actions?: ReactNode;
  /** A still from public/brand. Omit for the plain wall panel. */
  asset?: AssetKey;
  /** object-position for the still, to keep its subject in frame. */
  position?: string;
  /** Required with a frame from the series: says what the picture is. */
  credit?: ReactNode;
  /** full = the hero's own height. tall (default) and short are shorter. */
  size?: PageHeroSize;
  /** Plain panel only. ink (default) is the hero's own dark; wall is the
   *  deeper paper, for a page that should open quietly. */
  tone?: "ink" | "wall";
  /** An admin's replacement for the still (useImageBlock). Null or absent
   *  renders the bundled asset exactly as before. Needs `asset` as well: the
   *  bundled file still sets the frame's width and height. */
  override?: ImageOverride | null;
}) {
  /* The frame runs under the sticky header, so the copy's top row needs to
     know how tall that header is. HeroFilm sets this on the home page; a
     visitor who lands on an inner page first never ran it. */
  useEffect(() => {
    if (!asset) return;
    const header = document.querySelector("header");
    if (!header) return;
    const set = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(header.getBoundingClientRect().height)}px`,
      );
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [asset]);

  const copy = (
    <>
      <p className="page-hero__eyebrow ph-in" style={{ "--d": 0 } as React.CSSProperties}>
        {eyebrow}
      </p>
      {aside && (
        <div className="page-hero__aside ph-in" style={{ "--d": 1 } as React.CSSProperties}>
          {aside}
        </div>
      )}
      <h1 id={id} className="page-hero__title ph-in" style={{ "--d": 2 } as React.CSSProperties}>
        {title}
      </h1>
      {actions && (
        <div className="page-hero__actions ph-in" style={{ "--d": 3 } as React.CSSProperties}>
          {actions}
        </div>
      )}
    </>
  );

  if (!asset) {
    return (
      <section className={`page-hero page-hero--plain page-hero--${size} page-hero--${tone}`} aria-labelledby={id}>
        <div className={`page-hero__panel ${tone === "wall" ? "wall" : ""}`}>
          <div className="page-hero__copy">{copy}</div>
        </div>
      </section>
    );
  }

  const a = ASSETS[asset];
  const ext = a.fallback ?? "jpg";

  return (
    <section className={`film-hero page-hero page-hero--${size}`} aria-labelledby={id}>
      <div className="film-frame">
        <div className="film-stage">
          {override ? (
            <img
              src={override.url}
              alt={override.alt}
              width={a.width}
              height={a.height}
              loading="eager"
              decoding="async"
              {...{ fetchpriority: "high" }}
              className="film-media page-hero__img"
              style={position ? { objectPosition: position } : undefined}
            />
          ) : a.base ? (
            <picture>
              {!a.noAvif && (
                <source type="image/avif" srcSet={`${a.base}.avif 1x, ${a.base}@2x.avif 2x`} sizes="100vw" />
              )}
              <source type="image/webp" srcSet={`${a.base}.webp 1x, ${a.base}@2x.webp 2x`} sizes="100vw" />
              <img
                src={`${a.base}.${ext}`}
                srcSet={`${a.base}.${ext} 1x, ${a.base}@2x.${ext} 2x`}
                sizes="100vw"
                alt={a.alt}
                width={a.width}
                height={a.height}
                loading="eager"
                decoding="async"
                {...{ fetchpriority: "high" }}
                className="film-media page-hero__img"
                style={position ? { objectPosition: position } : undefined}
              />
            </picture>
          ) : (
            /* A slot with no file yet is a labelled block, never a blank. */
            <div className="film-media page-hero__img page-hero__missing" role="img" aria-label={a.alt}>
              <span>{a.label}. {a.width} x {a.height}</span>
            </div>
          )}
          <span aria-hidden="true" className="film-scrim page-hero__scrim" />
          {credit && <p className="page-hero__credit">{credit}</p>}
        </div>
        <div className="film-copy page-hero__copy">{copy}</div>
      </div>
    </section>
  );
}
