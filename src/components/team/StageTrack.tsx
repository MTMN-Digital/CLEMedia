import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import type { AssetKey } from "@/lib/brand";
import type { Stage } from "./people";

/* ============================================================================
   The track: the review sequence with the people on it.

   The home page lists the six stages as hairline rows with a name in mono
   under each title. Here the same six stages run as a horizontal track, and
   the portrait of whoever is answerable sits ON the track at that stage, so
   accountability is something the reader sees rather than reads. One rule
   runs the width of the band through the centre of every face; each portrait
   wears a ring in the band's own colour so it breaks the rule rather than
   sitting in front of it.

   Below 1024px the track turns vertical and each stage becomes a row: faces
   on the left, the stage on the right, a rule between stages.

   Everything here lives in the sunken band, where muted ink is AA-large only,
   so the small type is set in body ink and the mono label in the deep red,
   which clears AA on this fill.
   ========================================================================== */

function Faces({ keys }: { keys: AssetKey[] }) {
  const single = keys.length === 1;
  const pair = keys.length === 2;
  const size = single ? "w-[72px]" : pair ? "w-16" : "w-11";
  const overlap = pair ? "-ml-4" : "-ml-3.5";
  return (
    <div className="flex h-[72px] items-center">
      {keys.map((k, i) => (
        <div
          key={k}
          className={`relative flex shrink-0 rounded-full ring-4 ring-sunken ${size} ${i ? overlap : ""}`}
          style={{ zIndex: keys.length - i }}
        >
          <Figure asset={k} rounded="rounded-full" className="aspect-square" sizes="72px" />
        </div>
      ))}
    </div>
  );
}

export function StageTrack({ stages }: { stages: Stage[] }) {
  return (
    <div className="relative">
      {/* The rule the faces sit on. 36px is half the tallest portrait, so it
          runs through the centre of every circle whatever its size. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-9 hidden h-px bg-rule lg:block"
      />
      <Settle as="ol" className="grid lg:grid-cols-6 lg:gap-x-6">
        {stages.map((s) => (
          <li
            key={s.n}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1 border-t border-rule py-6 first:border-t-0 lg:block lg:border-t-0 lg:py-0"
          >
            <Faces keys={s.faces} />
            {/* A single face or a pair sits beside its text at every width. The
                five-face cluster of the team stages is too wide for a phone to
                share a row with, so below 640px the text drops under it. */}
            <div
              className={
                s.shared
                  ? "col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 lg:mt-6"
                  : "lg:mt-6"
              }
            >
              <span className="tnum font-mono text-[12px] tracking-[0.12em] text-body" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="t-h3 mt-1.5 max-w-[14ch]">
                <span className="sr-only">Stage {Number(s.n)}. </span>
                {s.stage}
              </h3>
              <p className="eyebrow mt-2 !text-[11px]">{s.who}</p>
              <p className="t-sm mt-3 max-w-[30ch] leading-relaxed text-body">{s.checks}</p>
              {s.hold && (
                <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-red-deep">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red-deep" />
                  A release can be held here
                </p>
              )}
            </div>
          </li>
        ))}
      </Settle>
    </div>
  );
}
