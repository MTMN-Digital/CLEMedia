import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Section } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE } from "@/lib/site";
import { useBlock } from "@/lib/content";
import "@/components/legal/notfound.css";

/* The 404 page's editable copy, keyed by block key (src/lib/blocks.ts). The
   default, not a copy: each string is the page's own wording, character for
   character, rendered through useBlock("404", key, COPY[key]) so an empty
   content_blocks table shows the page exactly as written here. "404" itself
   and the four routes back are not editable. The title is plain text: no
   accent clause, no stars, nothing an admin could type that renders as more
   than the words. */
export const COPY: Record<string, string> = {
  "hero.eyebrow_sub": "Page not found",
  "hero.aside": "Everything below is still where it should be.",
  "hero.title": "That page has wandered off",
  "routes.heading": "The link may be old, or we may have moved something.",
};

/* ============================================================================
   404: a notice.

   A notice is type and a list of ways out, and the one picture on it is the
   reel with a frame missing, which is the company's own joke about a page
   that is not there.

   THE OPENING, 2026-10-28. Bare paper. One mono status line, the headline in
   the site's display face at `.t-h1`, the lead under it, and the four routes
   back as a ruled list beside them. No panel of any tone, no pink accent, no
   buttons: the two buttons the panel carried were rows one and three of the
   list said twice.

   THE DEVICE: the missing frame. This company's trade is a series, so a page
   that is not there is a frame that is not in the reel. The strip is the
   house's own perforated stock (`.filmstrip`, `.sprockets`, `.edge-print`,
   `.frame-ticks` in index.css, the same chrome the home page's FilmStrip
   wears), with real episode title slates either side of one empty frame. The
   empty frame is where the character leads, which is the one thing the brief
   allows on this page and nowhere else: the paw trail walks out of it and off
   the stock, and now it walks (notfound.css), one print after another.

   WHAT WAS TRIED AND THROWN AWAY: a drawn garden gate standing open with the
   trail going through it. Two rounds of it. A five-bar gate at this scale is
   thin line work with no weight, it read as a bit of fence panel with a post
   beside it, and a drawing invented for one page does not belong to the brand
   the way the stock does. Also dropped: the numeral set huge in the hero
   face, which competed with the heading and is the least useful thing on the
   page.

   ORDER. On a phone the reel sits between the lead and the routes, so the
   missing frame is on the first screen with the headline; at `lg` the routes
   move up beside the title and the reel runs under both (the grid is in
   notfound.css). This page is an interruption, not a destination: the
   notice, the reel and the routes, and nothing after them.
   ========================================================================== */

const ROUTES_BACK: { href?: string; line: string; to?: string; title: string }[] = [
  { title: "The home page", line: "What the company is, and what it makes.", to: "/" },
  { title: "Our story", line: "Conor Sexton on why he started the company.", to: "/story" },
  { title: "Contact", line: "Partnership, press, educators, or anything else.", to: "/contact" },
  {
    title: "The show's own site",
    line: "Episodes, characters and the family activities from The Pawsitive Pugs & Pals®.",
    href: SITE.showUrl,
  },
];

/* The trail across the empty frame. Opacity falls to the right: the animal is
   on its way out of shot, which is the whole joke and the whole apology. */
const PAWS: { x: number; r: number; y: number }[] = [
  { x: 4, y: 112, r: -8 },
  { x: 48, y: 98, r: 6 },
  { x: 92, y: 106, r: -6 },
  { x: 136, y: 91, r: 7 },
  { x: 180, y: 99, r: -5 },
  { x: 224, y: 84, r: 6 },
  { x: 268, y: 92, r: -4 },
  { x: 312, y: 77, r: 5 },
  { x: 356, y: 85, r: -3 },
];

/** One paw, at the same proportions as the trail in `graphics.tsx`. Its
 *  resting opacity and its place in the trail ride on the element as custom
 *  properties, which is all the CSS needs to walk it in. */
function Paw({ x, y, r, o, i }: { y: number; o: number; r: number; i: number; x: number }) {
  return (
    <g
      className="doc404-paw"
      style={{ "--o": o, "--i": i } as CSSProperties}
      transform={`translate(${x} ${y}) rotate(${r}) scale(2.1)`}
    >
      <ellipse cx="0" cy="4" rx="5" ry="4.3" />
      <ellipse cx="-5.4" cy="-1.4" rx="2.2" ry="2.8" />
      <ellipse cx="-1.8" cy="-4.6" rx="2.1" ry="2.7" />
      <ellipse cx="2.2" cy="-4.6" rx="2.1" ry="2.7" />
      <ellipse cx="5.8" cy="-1.4" rx="2.2" ry="2.8" />
    </g>
  );
}

/**
 * The frame that is not there.
 *
 * A dashed keyline on the bare stock rather than a filled rectangle: a grey
 * box at 16 by 9 is the house's own placeholder tell, and this has to read as
 * a deliberate hole in the reel.
 */
function MissingFrame() {
  return (
    <div className="relative aspect-[16/9] w-full rounded-[6px] border-[1.5px] border-dashed border-[rgba(246,240,226,0.34)]">
      <svg
        viewBox="0 0 360 180"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        fill="rgb(246 240 226)"
        preserveAspectRatio="xMidYMid meet"
      >
        {PAWS.map((p, i) => (
          <Paw key={i} i={i} x={p.x} y={p.y} r={p.r} o={0.46 - i * 0.042} />
        ))}
      </svg>
      <p className="absolute left-3 top-3 font-mono text-[14px] uppercase tracking-[0.2em] text-[rgba(246,240,226,0.62)]">
        404
      </p>
      {/* 0.6, not the 0.42 the edge print uses. The edge print is aria-hidden
          decoration on the margin of the stock; this is the one line that says
          what the picture means, so it is held to AA: 0.42 measures 3.75:1 on
          the stock and 0.6 measures 6.4:1. And 13px, the floor for real text,
          because it is real text. */}
      <p className="absolute bottom-3 left-3 font-mono text-[13px] uppercase tracking-[0.18em] text-[rgba(246,240,226,0.6)]">
        Frame missing
      </p>
    </div>
  );
}

export default function NotFound() {
  /* EDITABLE FROM THE ADMIN, 2026-10-27: the page's own wording (COPY above)
     until a content_blocks row replaces it. The two sentences of the lead are
     two blocks rendered as one paragraph, both keys kept. */
  const heroEyebrowSub = useBlock("404", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroAside = useBlock("404", "hero.aside", COPY["hero.aside"]);
  const heroTitle = useBlock("404", "hero.title", COPY["hero.title"]);
  const routesHeading = useBlock("404", "routes.heading", COPY["routes.heading"]);

  const frame = "w-[70vw] shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[22rem] sm:flex-1";

  return (
    <>
      <Seo title="Page not found" description="That page doesn't exist." path="/404" noIndex />

      {/* Header, then 96px of paper at a desk and 40px on a phone, then the
          notice. The grid's three children are the title block, the reel and
          the routes, in that DOM order; the columns are in notfound.css. */}
      <Section pad={["none", "normal"]}>
        <div className="filmstrip-root doc404-grid pt-10 lg:pt-24">
          {/* ═══ 1. THE NOTICE.
              The status line is the one mono label the page is allowed,
              because it is a status (muted, not the eyebrow's red: a status
              is furniture). The headline is the page's own words, as plain
              text. The lead is the explanation and the reassurance in one
              paragraph, over the list it introduces. ═══ */}
          <Settle className="doc404-title">
            <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
              404 · {heroEyebrowSub}
            </p>
            <h1 className="t-h1 mt-5 max-w-[12ch]">{heroTitle}</h1>
            <p className="t-lead mt-6 max-w-[40ch] text-body">
              {routesHeading} {heroAside}
            </p>
          </Settle>

          {/* ═══ 2. THE REEL.
              The strip runs edge to edge, because a length of film boxed in
              a column is a picture of film. `.filmstrip-root` carries the
              gutter the type above it uses, and `.filmstrip-head` is the
              class that applies it, which is why the frames are inside one.
              Between the lead and the routes on a phone; under both at a
              desk. ═══ */}
          <div className="doc404-reel filmstrip-root">
            <div className="filmstrip-band overflow-hidden">
              <span className="sprockets sprockets-top" aria-hidden="true" />
              <div className="filmstrip-head flex items-center gap-5 pb-1 pt-2" aria-hidden="true">
                {/* print-mark: edge print on the stock's margin, decorative */}
                <span className="edge-print whitespace-nowrap font-mono uppercase">
                  CLÉ FAMILY MEDIA
                </span>
                <span className="frame-ticks h-3 flex-1" />
                {/* print-mark */}
                <span className="edge-print whitespace-nowrap font-mono">404</span>
              </div>

              {/* Four frames, not three: three left the right third of the
                  stock black, and a length of film is frames all the way
                  across. */}
              <div className="filmstrip-head">
                <ul className="flex gap-5 overflow-x-auto py-6 [scrollbar-width:none] sm:gap-6">
                  <li className={frame}>
                    <Figure asset="slate.ep1" rounded="rounded-[6px]" sizes="340px" />
                  </li>
                  {/* First on a phone, where only one frame is on screen and
                      the one that carries the page's point has to be it. */}
                  <li className={`order-first sm:order-none ${frame}`}>
                    <MissingFrame />
                  </li>
                  <li className={frame}>
                    <Figure asset="slate.ep2" rounded="rounded-[6px]" sizes="340px" />
                  </li>
                  <li className={frame}>
                    <Figure asset="slate.ep3" rounded="rounded-[6px]" sizes="340px" />
                  </li>
                </ul>
              </div>

              <span className="sprockets sprockets-bottom" aria-hidden="true" />
            </div>
          </div>

          {/* ═══ 3. THE ROUTES BACK.
              Four real routes, one line each, in a ruled list labelled by
              the h1: the lead is the sentence that introduces them. ═══ */}
          <Settle as="ul" className="doc404-routes border-t-[1.5px] border-rule">
            {ROUTES_BACK.map((r) => {
              const inner = (
                <>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold text-ink">{r.title}</span>
                    <span className="t-sm mt-1 block text-body">{r.line}</span>
                  </span>
                  <span className="mt-1 shrink-0 text-muted transition-colors group-hover:text-red-deep">
                    {r.href ? <IconExternal size={16} /> : <IconArrow size={16} />}
                  </span>
                </>
              );
              const cls = "group flex min-h-[44px] items-start justify-between gap-6 py-5";
              return (
                <li key={r.title} className="border-b-[1.5px] border-rule">
                  {r.to ? (
                    <Link to={r.to} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                      <span className="sr-only">(opens the show site in a new tab)</span>
                    </a>
                  )}
                </li>
              );
            })}
          </Settle>
        </div>
      </Section>
    </>
  );
}
