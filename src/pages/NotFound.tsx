import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Container, Kicker, Section } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   404.

   The old page was a heading, a paragraph and two buttons on an empty field,
   with the whole right half of a 1440 frame blank and a ghost "404" set in
   clay at 1.4:1 against the ground.

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

   The routes are real routes, one line each, in the column that used to be
   empty paper. Held to one screen at 1440 by 900: this page is an
   interruption, not a destination.
   ========================================================================== */

const ROUTES_BACK: { title: string; line: string; to?: string; href?: string }[] = [
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
const PAWS: { x: number; y: number; r: number }[] = [
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
function Paw({ x, y, r, o }: { x: number; y: number; r: number; o: number }) {
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
    <div className="relative aspect-[16/9] w-full rounded-[6px] border border-dashed border-[rgba(246,240,226,0.34)]">
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
      <p className="absolute left-3 top-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[rgba(246,240,226,0.62)]">
        404
      </p>
      {/* 0.6, not the 0.42 the edge print uses. The edge print is aria-hidden
          decoration on the margin of the stock; this is the one line that says
          what the picture means, so it is held to AA: 0.42 measures 3.75:1 on
          the stock and 0.6 measures 6.4:1. */}
      <p className="absolute bottom-3 left-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[rgba(246,240,226,0.6)]">
        Frame missing
      </p>
    </div>
  );
}

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="That page doesn't exist." path="/404" noIndex />

      <Section pad="tight">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:gap-20">
            <Settle>
              <Kicker>404, page not found</Kicker>
              <h1 className="t-h1 mt-5 max-w-[14ch]">That page has wandered off</h1>
              <p className="t-lead mt-5 max-w-[42ch] text-body">
                The link may be old, or we may have moved something. Everything below is still
                where it should be.
              </p>
            </Settle>

            <Settle as="ul" className="lg:pt-2">
              {ROUTES_BACK.map((r) => {
                const inner = (
                  <>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-semibold text-ink">{r.title}</span>
                      <span className="t-sm mt-1 block text-body">{r.line}</span>
                    </span>
                    <span className="mt-1 shrink-0 text-muted transition-colors group-hover:text-red-deep">
                      {r.href ? <IconExternal size={16} /> : <IconArrow size={16} />}
                    </span>
                  </>
                );
                const cls = "group flex items-start justify-between gap-6 py-4";
                return (
                  <li key={r.title} className="hairline last:border-b last:border-rule">
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

        {/* The strip runs edge to edge, outside the container, because a length
            of film boxed in a column is a picture of film. `.filmstrip-root`
            carries the gutter the type above it uses, and `.filmstrip-head` is
            the class that applies it, which is why the frames are inside one. */}
        <div className="filmstrip-root mt-14 sm:mt-16">
          <div className="filmstrip-band overflow-hidden">
            <span className="sprockets sprockets-top" aria-hidden="true" />
            <div className="filmstrip-head flex items-center gap-5 pb-1 pt-2" aria-hidden="true">
              <span className="edge-print whitespace-nowrap font-mono uppercase">
                CLÉ FAMILY MEDIA
              </span>
              <span className="frame-ticks h-3 flex-1" />
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
