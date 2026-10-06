import { Stage } from "@/components/render";
import { STRANDS, formatDate } from "@/components/journal/data";
import type { Post } from "@/lib/types";

/* ============================================================================
   Page one.

   THE PROBLEM THIS SOLVES. The journal has no posts in it, and the first
   version of this page answered that with four identical rounded cards that
   each said "First post arriving shortly." Four boxes saying nothing four
   times is worse than one object saying it once, and it made an empty journal
   look like a broken one.

   SO THE SIGNATURE HERE IS AN OBJECT, NOT A GRID. A single sheet standing on
   the bench under the same lamp as the garden print on the home page and the
   boards on the studio wall: the front page of the journal, drawn in code,
   with its masthead set, its dateline ruled and its four standing heads in
   place. The lead slot is the only thing empty, and it is filled with the
   words "In preparation" set in the headline face, because an honest empty
   headline is a statement and a grey rectangle is a loading skeleton.

   WHAT I TRIED FIRST AND THREW AWAY: greeked body lines under the headline,
   which is what a real newspaper render would have. On screen, ruled lines
   standing in for text are indistinguishable from a skeleton loader, and on a
   page whose whole subject is that nothing is published yet that reads as a
   page that failed to load. Every line on this sheet is now real type.

   IT IS WIRED, NOT A DRAWING. Publish a post and the lead slot takes its
   headline, its strand and its date. Nothing about the sheet is a placeholder
   waiting to be replaced by a designer.
   ========================================================================== */

export function FrontPage({
  latest,
  latestStrand,
  className = "",
}: {
  latest: Post | null;
  latestStrand: string | null;
  className?: string;
}) {
  const date = formatDate(latest?.published_at ?? null);

  return (
    <figure className={className}>
      <Stage backdrop rake ground="ledge" tilt={5} turn={-2} depth={0.55} light={-30} radius="3px">
        <div className="bg-raised px-5 py-5 text-left sm:px-7 sm:py-6">
          {/* The standing rail above the masthead, as a printed page carries. */}
          <div className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            <span>CL&Eacute; Family Media</span>
            <span className="tnum">{latest ? "Current" : "Issue one"}</span>
          </div>

          <div className="mt-2 border-t-2 border-[var(--color-ink)]" />
          <p className="mt-3 font-hero text-[clamp(1.4rem,1.1rem+1vw,1.95rem)] leading-[0.98] tracking-[-0.015em] text-ink">
            Notes from the studio
          </p>
          <div className="mt-3 border-t border-rule" />
          <div className="mt-2 flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            <span>{latestStrand ?? "Four strands"}</span>
            <span className="tnum">{date ?? "No pieces yet"}</span>
          </div>

          {/* The lead slot. */}
          <div className="mt-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-deep">
              Lead piece
            </p>
            <p className="mt-2 line-clamp-3 font-display text-[clamp(1.0625rem,0.95rem+0.5vw,1.35rem)] leading-[1.14] text-ink">
              {latest?.title ?? "In preparation"}
            </p>
            <p className="mt-2.5 line-clamp-3 text-[12px] leading-[1.55] text-body">
              {latest?.excerpt ?? "The first piece is being written in the studio."}
            </p>
          </div>

          {/* The standing heads, two columns with a column rule between them. */}
          <div className="mt-6 grid grid-cols-2 border-t border-rule pt-4">
            <ul className="space-y-3 pr-4">
              {STRANDS.slice(0, 2).map((s, i) => (
                <StandingHead key={s.slug} n={i + 1} name={s.name} />
              ))}
            </ul>
            <ul className="space-y-3 border-l border-rule pl-4">
              {STRANDS.slice(2).map((s, i) => (
                <StandingHead key={s.slug} n={i + 3} name={s.name} />
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-rule pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
            Watch. Play. Learn.
          </div>
        </div>
      </Stage>

      <figcaption className="mt-5 max-w-[34ch] font-mono text-[12px] leading-[1.65] text-muted">
        Page one, drawn rather than photographed. The lead slot fills itself in from the first
        piece published.
      </figcaption>
    </figure>
  );
}

function StandingHead({ n, name }: { n: number; name: string }) {
  return (
    <li>
      <span className="tnum font-mono text-[9px] tracking-[0.18em] text-muted">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-0.5 block text-[11.5px] font-semibold leading-tight text-ink">{name}</span>
    </li>
  );
}
