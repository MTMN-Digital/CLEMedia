import { Figure } from "@/components/Figure";
import { type Episode, COMING_SOON } from "@/lib/episodes";

/* ============================================================================
   The Watch row's contents: the six title slates, three across, each released
   one a link to its video. The slates are felted objects photographed on a
   surface, so each sits on a 1.5px rule with its caption under it, not in a
   card. The caption is the walkthrough tile's: mono episode number in the
   deep red, the title, and the runtime or the "Coming soon" mark for the two
   episodes that have a title and art and nothing else. Episode numbers in a
   caption are not margin numerals.
   ========================================================================== */

function Caption({ ep }: { ep: Episode }) {
  return (
    <span className="mt-3 flex flex-col gap-1 border-t-[1.5px] border-rule pt-3 sm:flex-row sm:items-baseline sm:gap-3.5">
      <span className="tnum font-mono text-[14.5px] tracking-[0.14em] text-red-deep">{ep.n}</span>
      <span className="t-sm font-semibold text-ink group-hover:text-red-deep">{ep.title}</span>
      {ep.runtime ? (
        <span className="tnum font-mono text-[14.5px] text-muted sm:ml-auto">{ep.runtime}</span>
      ) : (
        <span className="w-fit rounded-[var(--radius-pill)] bg-[var(--color-red-deep)] px-2.5 py-0.5 font-mono text-[13px] uppercase tracking-[0.1em] text-white sm:ml-auto">
          {COMING_SOON}
        </span>
      )}
    </span>
  );
}

export function EpisodeSlates({ episodes, id }: { episodes: Episode[]; id?: string }) {
  return (
    <ul id={id} className="grid grid-cols-2 gap-x-4 gap-y-7 scroll-mt-24 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-9">
      {episodes.map((ep) => {
        const inner = (
          <>
            <Figure
              asset={ep.asset}
              rounded="rounded-[var(--radius-sm)]"
              sizes="(min-width: 1024px) 30vw, 45vw"
            />
            <Caption ep={ep} />
          </>
        );
        return (
          <li key={ep.n}>
            {ep.href ? (
              <a
                href={ep.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                aria-label={`Episode ${ep.n}, ${ep.title}, on YouTube (opens in a new tab)`}
              >
                {inner}
              </a>
            ) : (
              <div>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
