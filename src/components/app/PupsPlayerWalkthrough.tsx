import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Figure } from "@/components/Figure";
import { IconCheck, IconLock } from "@/components/icons";
import { LOGOS, type AssetKey } from "@/lib/brand";

/* ============================================================================
   The drawn product.

   PupsPlayer has no screenshots yet: `app.hero` and `app.screen1-3` are null,
   and the previous page rendered them as three labelled grey frames, which on
   a page about a product is the worst possible thing to show. So the product
   is drawn instead: the app's interface built in HTML and CSS inside a tablet
   frame, on the site's own tokens, carrying the four real episode plates and
   the real titles and runtimes.

   It shows only what the page already claims the app will do. An episode
   library with nothing autoplaying, the movement or breathing prompt that
   follows an episode, and the printables that take the learning off the
   screen. Nothing on these screens is a feature the plan does not name, and
   the caption under the device says in so many words that it is drawn from
   the plan, not captured from a build.

   The three stages are a real tablist. Choosing one changes the screen, so a
   reader walks the Watch, Play, Learn model through the product rather than
   reading it as three paragraphs. Every size inside the device is in em off a
   root set in container-query units, so the render scales as one object from
   a 320px phone to a 1560px desktop and nothing inside it reflows on its own.
   ========================================================================== */

export type Stage = "watch" | "play" | "learn";

export interface AppEpisode {
  n: string;
  title: string;
  runtime: string;
  asset: AssetKey;
  href: string;
}

export const STAGES: { id: Stage; title: string; line: string }[] = [
  {
    id: "watch",
    title: "Watch",
    line: "An episode, chosen by the child or the adult beside them. Ad free, and nothing autoplays after it.",
  },
  {
    id: "play",
    title: "Play",
    line: "A pause for a short movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    id: "learn",
    title: "Learn",
    line: "A printable or educator-designed activity afterwards, taking the learning off the screen entirely.",
  },
];

/* The PupsPlayer mark is a flat single-colour SVG filled with currentColor, so
   it is applied as a mask over the current text colour rather than loaded as
   an image, which would render it black. */
function PupsMark({ className = "" }: { className?: string }) {
  if (!LOGOS.pupsPlayer) return null;
  const url = `url(${LOGOS.pupsPlayer})`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/* The app's own header. The grown-ups pill is the one claim the plan makes
   about control: a child can find their way around and cannot accidentally
   find their way out. */
function TopBar() {
  return (
    <div className="flex items-center gap-[0.7em]">
      <PupsMark className="h-[1.9em] w-[1.9em] text-navy" />
      <span className="text-[1.05em] font-bold leading-none text-ink">PupsPlayer</span>
      <span className="ml-auto inline-flex items-center gap-[0.45em] rounded-full border border-rule px-[0.9em] py-[0.45em] font-mono text-[0.68em] uppercase leading-none tracking-[0.12em] text-body">
        <IconLock className="h-[1.1em] w-[1.1em]" />
        Grown-ups
      </span>
    </div>
  );
}

/* The app's own footer: where the child is in the model. It mirrors the
   tablist outside the device, so the product and the page agree. */
function StageNav({ active }: { active: Stage }) {
  return (
    <div className="mt-auto flex items-center justify-center gap-[1.8em] border-t border-rule pt-[1em]">
      {STAGES.map((s) => {
        const on = s.id === active;
        return (
          <span
            key={s.id}
            className={`inline-flex items-center gap-[0.5em] font-mono text-[0.68em] uppercase tracking-[0.14em] ${
              on ? "text-red-deep" : "text-muted"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-[0.6em] w-[0.6em] rounded-full ${on ? "bg-red" : "border border-current"}`}
            />
            {s.title}
          </span>
        );
      })}
    </div>
  );
}

function ScreenHeading({ title, line }: { title: string; line: string }) {
  return (
    <div>
      <p className="text-[1.5em] font-bold leading-[1.15] text-ink @md:text-[1.9em]">{title}</p>
      <p className="mt-[0.4em] max-w-[30ch] text-[0.85em] leading-[1.45] text-body">{line}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Screen 1, Watch. The library. Four plates, four real titles, four real
   runtimes, and nothing else competing for attention around them.
--------------------------------------------------------------------------- */
function WatchScreen({ episodes }: { episodes: AppEpisode[] }) {
  return (
    <>
      <TopBar />
      <div className="my-[1.4em] grid flex-1 content-center gap-[1.1em] @md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] @md:gap-[1.8em]">
        <ScreenHeading title="Choose an episode" line="Nothing plays until someone picks it." />
        <ul className="grid grid-cols-2 gap-[0.85em]">
          {episodes.map((ep) => (
            <li key={ep.n} className="overflow-hidden rounded-[0.9em] border border-rule bg-raised">
              <Figure asset={ep.asset} rounded="rounded-none" sizes="(min-width: 1024px) 20vw, 42vw" />
              <div className="flex items-baseline gap-[0.55em] px-[0.8em] py-[0.6em]">
                <span className="tnum font-mono text-[0.66em] tracking-[0.14em] text-red-deep">{ep.n}</span>
                <span className="truncate text-[0.82em] font-semibold text-ink">{ep.title}</span>
                <span className="tnum ml-auto shrink-0 font-mono text-[0.66em] text-muted">{ep.runtime}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <StageNav active="watch" />
    </>
  );
}

/* ---------------------------------------------------------------------------
   Screen 2, Play. The episode has finished and the next thing is not another
   episode. The prompt itself is not written here: the plan says a movement or
   breathing prompt, and that is as specific as this screen is allowed to be.
--------------------------------------------------------------------------- */
function PlayScreen({ episode }: { episode: AppEpisode }) {
  return (
    <>
      <TopBar />
      <div className="my-[1.4em] grid flex-1 content-center gap-[1.1em] @md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] @md:gap-[1.8em]">
        <div>
          <ScreenHeading
            title="Time to move"
            line="A short movement or breathing prompt, before anything else plays."
          />
          <div className="mt-[1.2em] flex items-center gap-[0.8em] rounded-[0.9em] border border-rule bg-raised p-[0.6em]">
            <div className="w-[5.2em] shrink-0 overflow-hidden rounded-[0.5em]">
              <Figure asset={episode.asset} rounded="rounded-none" sizes="120px" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.8em] font-semibold text-ink">{episode.title}</p>
              <p className="mt-[0.2em] inline-flex items-center gap-[0.35em] font-mono text-[0.64em] uppercase tracking-[0.12em] text-body">
                <IconCheck className="h-[1.2em] w-[1.2em] text-red-deep" />
                Finished
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-[0.5em]">
          {/* The prompt's stage: a calm disc, and one large target, because
              the plan says large targets and simple navigation. */}
          <div className="flex aspect-square w-[min(100%,11em)] items-center justify-center rounded-full bg-sage/35">
            <div className="flex aspect-square w-[68%] items-center justify-center rounded-full bg-sage">
              <span className="rounded-full bg-red px-[1.3em] py-[0.65em] font-mono text-[0.78em] uppercase tracking-[0.14em] text-raised">
                Start
              </span>
            </div>
          </div>
        </div>
      </div>
      <StageNav active="play" />
    </>
  );
}

/* ---------------------------------------------------------------------------
   Screen 3, Learn. Three sheets, drawn as paper: the plan names colouring,
   puzzles and activity sheets, and the three generic marks below are those
   three kinds and nothing more specific.
--------------------------------------------------------------------------- */
function Sheet({ kind, label }: { kind: "colour" | "activity" | "puzzle"; label: string }) {
  return (
    <li>
      <div className="flex aspect-[1/1.3] flex-col gap-[0.45em] rounded-[0.5em] border border-rule bg-raised p-[0.7em]">
        <span className="h-[0.32em] w-[55%] rounded-full bg-ink/70" aria-hidden="true" />
        {kind === "colour" && (
          <span
            aria-hidden="true"
            className="mx-auto mt-[0.6em] aspect-square w-[62%] rounded-full border-[0.18em] border-body/45"
          />
        )}
        {kind === "activity" && (
          <span aria-hidden="true" className="mt-[0.6em] flex flex-col gap-[0.55em]">
            <span className="h-[0.25em] w-full rounded-full bg-rule" />
            <span className="h-[0.25em] w-[85%] rounded-full bg-rule" />
            <span className="h-[0.25em] w-full rounded-full bg-rule" />
            <span className="h-[0.25em] w-[70%] rounded-full bg-rule" />
          </span>
        )}
        {kind === "puzzle" && (
          <span aria-hidden="true" className="mt-[0.6em] grid grid-cols-3 gap-[0.3em]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="aspect-square rounded-[0.15em] border border-body/35" />
            ))}
          </span>
        )}
      </div>
      <p className="mt-[0.5em] text-center text-[0.72em] font-semibold text-ink">{label}</p>
    </li>
  );
}

function LearnScreen({ episode }: { episode: AppEpisode }) {
  return (
    <>
      <TopBar />
      <div className="my-[1.4em] grid flex-1 content-center gap-[1.1em] @md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] @md:gap-[1.8em]">
        <div>
          <ScreenHeading
            title="Off the screen now"
            line={`A printable from ${episode.title}, to take to the table.`}
          />
          <span className="mt-[1.2em] inline-block rounded-full bg-red px-[1.3em] py-[0.65em] font-mono text-[0.78em] uppercase tracking-[0.14em] text-raised">
            Print
          </span>
          <p className="mt-[1em] max-w-[28ch] text-[0.72em] leading-[1.45] text-body">
            Educator designed, and reviewed against early years practice before it is included.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-[0.85em] self-start">
          <Sheet kind="colour" label="Colouring" />
          <Sheet kind="activity" label="Activity sheet" />
          <Sheet kind="puzzle" label="Puzzle" />
        </ul>
      </div>
      <StageNav active="learn" />
    </>
  );
}

/* ---------------------------------------------------------------------------
   The device and the tablist that drives it.
--------------------------------------------------------------------------- */
export function PupsPlayerWalkthrough({ episodes }: { episodes: AppEpisode[] }) {
  const [stage, setStage] = useState<Stage>("watch");
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = episodes[0];

  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = STAGES.findIndex((s) => s.id === stage);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % STAGES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + STAGES.length) % STAGES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = STAGES.length - 1;
    else return;
    e.preventDefault();
    setStage(STAGES[next].id);
    tabs.current[next]?.focus();
  };

  const current = STAGES.find((s) => s.id === stage) ?? STAGES[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
      {/* The three stages. Vertical beside the device on desktop, a row of
          three beneath it on a phone. Only the titles are shown in the row;
          the active stage's line follows the device as a caption instead. */}
      <div
        role="tablist"
        aria-label="The three stages of the model"
        onKeyDown={move}
        className="order-2 grid grid-cols-3 gap-x-3 lg:order-1 lg:grid-cols-1 lg:gap-0"
      >
        {STAGES.map((s, i) => {
          const on = s.id === stage;
          return (
            <button
              key={s.id}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${base}-tab-${s.id}`}
              aria-selected={on}
              aria-labelledby={`${base}-title-${s.id}`}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setStage(s.id)}
              className={`hairline group block w-full py-4 text-left transition-colors duration-300 lg:py-6 ${
                on ? "text-ink" : "text-muted hover:text-body"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full border border-red transition-colors duration-300 ${
                    on ? "bg-red" : "bg-transparent"
                  }`}
                />
                <span id={`${base}-title-${s.id}`} className="t-h3 font-bold">{s.title}</span>
              </span>
              <span className={`t-sm mt-2.5 hidden leading-relaxed lg:block ${on ? "text-body" : "text-muted"}`}>
                {s.line}
              </span>
            </button>
          );
        })}
      </div>

      <div className="order-1 lg:order-2">
        <div className="@container">
          <div
            id={`${base}-panel`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${stage}`}
            className="mx-auto w-full text-[clamp(7px,2.6cqw,16px)] @md:text-[clamp(7px,2.1cqw,16px)]"
          >
            {/* The frame: a dark bezel on the tablet, a drawn camera, and the
                screen as the lightest paper stop so it reads as lit. */}
            <div className="relative rounded-[2.4em] bg-ink p-[0.95em] shadow-[0_44px_80px_-44px_rgba(60,50,28,0.55)]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[0.35em] hidden h-[0.28em] w-[0.28em] -translate-x-1/2 rounded-full bg-raised/35 @md:block"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6em] bg-paper-1 @md:aspect-[4/3]">
                {STAGES.map((s) => {
                  const on = s.id === stage;
                  return (
                    <div
                      key={s.id}
                      aria-hidden={!on}
                      className={`absolute inset-0 flex flex-col p-[1.5em] transition-opacity duration-700 ease-[var(--ease-out)] ${
                        on ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      {s.id === "watch" && <WatchScreen episodes={episodes} />}
                      {s.id === "play" && <PlayScreen episode={first} />}
                      {s.id === "learn" && <LearnScreen episode={first} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Drawn from the plan, not a screenshot
        </p>
        {/* On a phone the stage line lives here, under the device, because
            three short titles in a row leave no room for it. */}
        <p className="t-body mt-4 text-body lg:hidden" aria-live="polite">
          {current.line}
        </p>
      </div>
    </div>
  );
}
