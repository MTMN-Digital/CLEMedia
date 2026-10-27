import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { PageHero } from "@/components/PageHero";
import { Settle } from "@/components/Settle";
import { Button, Container, Section } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   404.

   The old page was a heading, a paragraph and two buttons on an empty field,
   with the whole right half of a 1440 frame blank and a ghost "404" set in
   clay at 1.4:1 against the ground.

   THE OPENING, 2026-10-27. The heading and its grey lead at the left edge of
   the paper are gone; the page opens the way every page now opens, in the
   hero's frame. The plain panel in the hero's own dark: "404" and "Page not
   found" top left, the reassurance top right, "That page has wandered off"
   bottom left at the hero's scale, and the two routes most people want under
   it. The lead's first sentence, the one that explains rather than reassures,
   now stands over the list of routes it was really introducing.

   THE DEVICE: the missing frame. This company's trade is a series, so a page
   that is not there is a frame that is not in the reel. The strip is the
   house's own perforated stock (`.filmstrip`, `.sprockets`, `.edge-print`,
   `.frame-ticks` in index.css, the same chrome the home page's FilmStrip
   wears), with two real episode title slates either side of one empty frame.
   The empty frame is where the character leads, which is the one thing the
   brief allows on this page and nowhere else: the paw trail walks out of it
   and off the stock.

   WHAT WAS TRIED AND THROWN AWAY: a drawn garden gate standing open with the
   trail going through it. Two rounds of it. A five-bar gate at this scale is
   thin line work with no weight, it read as a bit of fence panel with a post
   beside it, and a drawing invented for one page does not belong to the brand
   the way the stock does. Also dropped: the numeral set huge in Fraunces,
   which competed with the heading and is the least useful thing on the page.

   The routes are real routes, one line each, in a ruled list under the
   opening. This page is an interruption, not a destination: the panel, the
   routes and the strip, and nothing after them.
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

/** One paw, at the same proportions as the trail in `graphics.tsx`. */
function Paw({ x, y, r, o }: { o: number; r: number; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(2.1)`} opacity={o}>
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
          <Paw key={i} x={p.x} y={p.y} r={p.r} o={0.46 - i * 0.042} />
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
  return (
    <>
      <Seo title="Page not found" description="That page doesn't exist." path="/404" noIndex />

      {/* ═══ 1. THE OPENING, in the hero's frame.
          Ink, not wall: a page that is not there opens in the dark of the
          gaps around the film, which is also the stock the missing frame
          below sits on. Short, because the routes are the point. ═══ */}
      <PageHero
        id="nf-h"
        size="short"
        tone="ink"
        eyebrow={
          <>
            404<span>Page not found</span>
          </>
        }
        aside={<>Everything below is still where it should be.</>}
        title={
          <>
            That page has <em>wandered off</em>
          </>
        }
        actions={
          <>
            <Button to="/">
              The home page
              <IconArrow size={16} />
            </Button>
            <Button to="/contact" variant="quiet">
              Get in touch
            </Button>
          </>
        }
      />

      {/* ═══ 2. THE ROUTES BACK.
          The explanation in a left track, the four routes as a ruled list
          beside it: the sentence introduces the list, so it sits where the
          list starts rather than over it. ═══ */}
      <Section pad="tight" labelledBy="nf-routes-h">
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
            <h2 id="nf-routes-h" className="t-h3 max-w-[22ch]">
              The link may be old, or we may have moved something.
            </h2>

            <Settle as="ul" className="border-t-[1.5px] border-rule">
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
                      <Link to={r.to} className={cls}>{inner}</Link>
                    ) : (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </Settle>
          </div>
        </Container>

        {/* ═══ 3. THE REEL.
            The strip runs edge to edge, outside the container, because a
            length of film boxed in a column is a picture of film.
            `.filmstrip-root` carries the gutter the type above it uses, and
            `.filmstrip-head` is the class that applies it, which is why the
            frames are inside one. ═══ */}
        <div className="filmstrip-root mt-16 sm:mt-20">
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

            {/* Four frames, not three: three left the right third of the stock
                black, and a length of film is frames all the way across. */}
            <div className="filmstrip-head">
              <ul className="flex gap-5 overflow-x-auto py-6 [scrollbar-width:none] sm:gap-6">
                <li className="w-[70vw] shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[22rem] sm:flex-1">
                  <Figure asset="slate.ep1" rounded="rounded-[6px]" sizes="340px" />
                </li>
                {/* First on a phone, where only one frame is on screen and the
                    one that carries the page's point has to be it. */}
                <li className="order-first w-[70vw] shrink-0 sm:order-none sm:w-auto sm:min-w-0 sm:max-w-[22rem] sm:flex-1">
                  <MissingFrame />
                </li>
                <li className="w-[70vw] shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[22rem] sm:flex-1">
                  <Figure asset="slate.ep2" rounded="rounded-[6px]" sizes="340px" />
                </li>
                <li className="w-[70vw] shrink-0 sm:w-auto sm:min-w-0 sm:max-w-[22rem] sm:flex-1">
                  <Figure asset="slate.ep3" rounded="rounded-[6px]" sizes="340px" />
                </li>
              </ul>
            </div>

            <span className="sprockets sprockets-bottom" aria-hidden="true" />
          </div>
        </div>
      </Section>
    </>
  );
}
