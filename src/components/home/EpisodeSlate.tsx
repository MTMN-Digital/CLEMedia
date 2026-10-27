import { Figure } from "@/components/Figure";
import { type Episode, COMING_SOON } from "@/lib/episodes";
import { DrawnCorner } from "@/components/draw/kit";

/* ============================================================================
   Domain-specific chrome: the production slate.

   The finding that made this section: "Podium wraps every project tile in
   camera viewfinder language: corner brackets, a blinking REC dot, a running
   timecode, an index. The chrome states what the studio does before you read a
   word. Generic cards cannot be rescued by better type; they need a frame that
   belongs to the trade."

   CLÉ's trade is children's television, so the frame is a clapperboard slate:
   production number, title, runtime, age guidance, and the named person who
   passed it. Corner brackets mark the frame. None of it is decoration; every
   field is a real fact about the episode.

   Nothing here is invented. Runtime and age guidance come from the episode
   data and render only when supplied, so an unknown field is absent rather
   than guessed.
   ========================================================================== */

/* The shape lives in lib/episodes.ts now, with the list itself. Re-exported
   so the components that already import `Episode` from here keep working. */
export type { Episode };

/* THE BRACKETS ARE DRAWN, since 2026-10-27. They were four spans carrying two
   CSS borders each, which is a viewfinder mark set with the one tool this site
   has decided not to use for structure. The kit's corner is the same mark in
   the hand that draws everything else. See components/draw/kit.tsx. */

export function EpisodeSlate({ ep }: { ep: Episode }) {
  /* AN UNRELEASED EPISODE IS NOT A LINK. There is nowhere to go, so it is a
     div: a disabled anchor is still in the tab order and still announces
     itself as a link to a screen reader, which is a worse answer than not
     being one. Everything inside is identical, so the two tiles sit in the
     strip at the same size and weight as the four that are out. */
  const Shell = ep.released ? "a" : "div";
  const linkProps = ep.released
    ? { href: ep.href, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Shell
      {...linkProps}
      className="group relative block focus-visible:outline-none"
    >
      {/* The frame. Corner brackets are the viewfinder move, in red so they
          read as a mark rather than a border. */}
      {/* `overflow-visible`: the drawn corners sit a few pixels outside the
          frame, the way a real mount's do, and a clipped corner is a square
          one. */}
      <div className="card relative rounded-[var(--radius-lg)] p-2.5">
        <DrawnCorner at="tl" /><DrawnCorner at="tr" /><DrawnCorner at="bl" /><DrawnCorner at="br" />

        <div className="relative overflow-hidden rounded-[var(--radius-md)]">
          <Figure
            asset={ep.asset}
            rounded="rounded-none"
            sizes="(min-width: 768px) 46vw, 92vw"
            className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
          />

          {/* The slate strip, across the foot of the frame. */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[rgba(26,22,20,0.82)] px-3 py-2 backdrop-blur-[2px]">
            <span className="tnum font-mono text-[14px] tracking-[0.14em] text-white/90">
              EP {ep.n}
            </span>
            <span className="h-3 w-px bg-white/25" aria-hidden="true" />
            <span className="truncate font-mono text-[14px] tracking-[0.1em] text-white/90">
              PAWSITIVE PUGS &amp; PALS
            </span>
            {/* A runtime if there is one, and the mark if there is not. They
                occupy the same slot because they answer the same question:
                what is this, and can I watch it. */}
            {ep.runtime ? (
              <span className="tnum ml-auto font-mono text-[14px] tracking-[0.12em] text-white/90">
                {ep.runtime}
              </span>
            ) : (
              <span className="ml-auto rounded-[var(--radius-pill)] bg-[var(--color-red-deep)] px-2 py-0.5 font-mono text-[13px] tracking-[0.12em] whitespace-nowrap text-white uppercase">
                {COMING_SOON}
              </span>
            )}
          </div>
        </div>

        <div className="px-3 pb-2 pt-5">
          <h3 className="t-h3">{ep.title}</h3>
          {/* No synopsis has been supplied for an unreleased episode and one
              is not written here. The tile carries its number, its title and
              its artwork, which is everything that is actually known. */}
          {ep.line && <p className="t-body mt-2.5 text-slate">{ep.line}</p>}

          {/* The credit line. Only renders the fields that actually exist. */}
          {(ep.guidance || ep.reviewer) && (
            <dl className="hairline mt-5 flex flex-wrap gap-x-7 gap-y-2 pt-4">
              {ep.guidance && (
                <div>
                  <dt className="font-mono text-[13px] uppercase tracking-[0.16em] text-deep">Guidance</dt>
                  <dd className="t-sm mt-1 text-ink">{ep.guidance}</dd>
                </div>
              )}
              {ep.reviewer && (
                <div>
                  <dt className="font-mono text-[13px] uppercase tracking-[0.16em] text-deep">Passed by</dt>
                  <dd className="t-sm mt-1 text-ink">{ep.reviewer}</dd>
                </div>
              )}
            </dl>
          )}

          <p className="mt-5 font-mono text-[14px] uppercase tracking-[0.16em] text-red-deep">
            {ep.released ? "Watch on YouTube" : COMING_SOON}
          </p>
        </div>
      </div>
    </Shell>
  );
}
