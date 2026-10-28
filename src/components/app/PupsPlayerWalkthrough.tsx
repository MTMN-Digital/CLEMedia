import { type ReactNode, type CSSProperties, useId, type KeyboardEvent, useState, useRef } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { IconLock, IconCheck } from "@/components/icons";
import { PupsMark } from "@/components/app/PupsMark";
import { type Episode, COMING_SOON } from "@/lib/episodes";
import type { ImageOverride } from "@/lib/content";

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
   reading it as three paragraphs.

   SIZING. Chrome (padding, radii, gaps, dots, the bezel) is in em off a root
   set in container-query units, so the render scales as one object from a
   320px phone to a 1560px desktop. TEXT is different: the titles, runtimes
   and lines on these screens are real content, and an em that lands at 5px
   on a phone is content nobody can read. So every readable string carries a
   `max(13px, Nem)` floor: it scales down with the device until 13px and no
   further. The floor was 11px until 2026-10-27, when the site set 13px as the
   smallest real text anywhere on it; a title on this screen is as real as a
   title on the page. The portrait device is 7:10 rather than 3:4 to give the
   floored type the height it needs.
   ========================================================================== */

export type Stage = "learn" | "watch" | "play";

/* The walkthrough takes the site's own episode shape, so an unreleased one
   arrives here with no runtime and no link and the screens below cope. */
export type AppEpisode = Episode;

export const STAGES: { title: string; id: Stage; line: string }[] = [
  {
    id: "watch",
    title: "Watch",
    line: "An episode, chosen by the child or the adult beside them. Ad free, and nothing autoplays after it.",
  },
  {
    id: "play",
    title: "Play",
    /* REWRITTEN 2026-10-24. "The current story makes Play sound mainly like a
       movement or breathing break, which does not reflect the full offer."
       The prompt is still in it, as one of the things Play holds rather than
       as the whole of it. The games below are the client's own list from the
       same document. */
    line: "Songs, puzzles, matching, recall and jigsaw games built from the episode, plus a short movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    id: "learn",
    title: "Learn",
    line: "A printable or educator-designed activity afterwards, taking the learning off the screen entirely.",
  },
];

/* Readable sizes. One place, so the floor is one number. */
const T = {
  body: "text-[length:max(13px,0.85em)] leading-[1.45]",
  small: "text-[length:max(13px,0.72em)] leading-[1.45]",
  label: "text-[length:max(13px,0.68em)]",
  mono: "text-[length:max(13px,0.66em)]",
  tile: "text-[length:max(13px,0.82em)]",
  name: "text-[length:max(14px,1.05em)]",
  heading: "text-[length:max(16px,1.5em)] @md:text-[length:max(16px,1.9em)]",
  button: "text-[length:max(13px,0.78em)]",
};

/* The app's own header. The grown-ups pill is the one claim the plan makes
   about control: a child can find their way around and cannot accidentally
   find their way out. */
function TopBar() {
  return (
    <div className="flex items-center gap-[0.7em]">
      <PupsMark className="h-[max(16px,1.9em)] w-[max(16px,1.9em)] text-navy" />
      <span className={`${T.name} font-bold leading-none text-ink`}>PupsPlayer</span>
      <span
        /* A soft rectangle, not a pill: on a fully rounded border the lines
           sweep samples the apex of the curve and reads the ground, so the
           1.5px rule it does carry was reported as invisible. */
        className={`${T.label} ml-auto inline-flex items-center gap-[0.45em] rounded-[0.55em] border-[1.5px] border-edge px-[0.9em] py-[0.45em] font-mono uppercase leading-none tracking-[0.12em] text-body`}
      >
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
    <div className="mt-auto flex items-center justify-center gap-[1.8em] border-t-[1.5px] border-rule pt-[1em]">
      {STAGES.map((s) => {
        const on = s.id === active;
        return (
          <span
            key={s.id}
            className={`${T.label} inline-flex items-center gap-[0.5em] font-mono uppercase tracking-[0.14em] ${
              on ? "text-red-deep" : "text-muted"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-[0.6em] w-[0.6em] rounded-full ${on ? "bg-red" : "border-[1.5px] border-current"}`}
            />
            {s.title}
          </span>
        );
      })}
    </div>
  );
}

function ScreenHeading({ title, line }: { line: string; title: string }) {
  return (
    <div>
      <p className={`${T.heading} font-bold leading-[1.15] text-ink`}>{title}</p>
      <p className={`${T.body} mt-[0.4em] max-w-[30ch] text-body`}>{line}</p>
    </div>
  );
}

/* The body of a screen: fills the space between the header and the stage nav
   and centres its content in it, one column in portrait, two in landscape. */
const BODY =
  "my-[1.4em] grid flex-1 content-center gap-[1.1em] @md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] @md:gap-[1.8em]";

/* ---------------------------------------------------------------------------
   Screen 1, Watch. The library. Four plates, four real titles, four real
   runtimes, and nothing else competing for attention around them.
--------------------------------------------------------------------------- */
function WatchScreen({ episodes }: { episodes: AppEpisode[] }) {
  return (
    <>
      <TopBar />
      <div className={BODY}>
        <ScreenHeading title="Choose an episode" line="Nothing plays until someone picks it." />
        <ul className="grid grid-cols-2 gap-[0.85em]">
          {episodes.map((ep) => (
            <li key={ep.n} className="overflow-hidden rounded-[0.9em] border-[1.5px] border-rule bg-raised">
              <Figure asset={ep.asset} rounded="rounded-none" sizes="(min-width: 1024px) 20vw, 42vw" />
              {/* Below a 384px container the caption stacks and drops the
                  episode number, so the title keeps the width it needs at
                  its 13px floor. The number is still in the list on the page. */}
              <div className="flex flex-col gap-[0.25em] px-[0.8em] py-[0.6em] @sm:flex-row @sm:items-baseline @sm:gap-[0.55em]">
                <span className={`${T.mono} tnum hidden font-mono tracking-[0.14em] text-red-deep @sm:inline`}>
                  {ep.n}
                </span>
                <span className={`${T.tile} truncate font-semibold text-ink`}>{ep.title}</span>
                {/* The runtime, or the mark if there is no runtime because
                    there is no episode yet. Same slot, same question. */}
                {ep.runtime ? (
                  <span className={`${T.mono} tnum shrink-0 font-mono text-muted @sm:ml-auto`}>{ep.runtime}</span>
                ) : (
                  <span
                    className={`${T.mono} shrink-0 rounded-[var(--radius-pill)] bg-[var(--color-red-deep)] px-[0.5em] py-[0.1em] font-mono tracking-[0.1em] whitespace-nowrap text-white uppercase @sm:ml-auto`}
                  >
                    {COMING_SOON}
                  </span>
                )}
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
      <div className={BODY}>
        <div>
          <ScreenHeading
            title="Time to move"
            line="A short movement or breathing prompt, before anything else plays."
          />
          <div className="mt-[1.2em] flex items-center gap-[0.8em] rounded-[0.9em] border-[1.5px] border-rule bg-raised p-[0.6em]">
            <div className="w-[max(56px,5.2em)] shrink-0 overflow-hidden rounded-[0.5em]">
              <Figure asset={episode.asset} rounded="rounded-none" sizes="120px" />
            </div>
            <div className="min-w-0">
              <p className={`${T.tile} truncate font-semibold text-ink`}>{episode.title}</p>
              <p
                className={`${T.mono} mt-[0.2em] inline-flex items-center gap-[0.35em] font-mono uppercase tracking-[0.12em] text-body`}
              >
                <IconCheck className="h-[1.2em] w-[1.2em] text-red-deep" />
                Finished
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-[0.5em]">
          {/* The prompt's stage: a calm disc, and one large target, because
              the plan says large targets and simple navigation. */}
          <div className="flex aspect-square w-[min(100%,max(8.5rem,11em))] items-center justify-center rounded-full bg-sage/35">
            <div className="flex aspect-square w-[68%] items-center justify-center rounded-full bg-sage">
              <span
                className={`${T.button} rounded-full bg-red-fill px-[1.3em] py-[0.65em] font-mono uppercase tracking-[0.14em] text-raised`}
              >
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
function Sheet({ kind, label }: { kind: "colour" | "puzzle" | "activity"; label: string }) {
  return (
    <li>
      <div className="flex aspect-[1/1.3] flex-col gap-[0.45em] rounded-[0.5em] border-[1.5px] border-rule bg-raised p-[0.7em]">
        <span className="h-[0.32em] w-[55%] rounded-full bg-ink/70" aria-hidden="true" />
        {kind === "colour" && (
          <span
            aria-hidden="true"
            className="mx-auto mt-[0.6em] aspect-square w-[62%] rounded-full border-[0.18em] border-body/60"
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
              <span key={i} className="aspect-square rounded-[0.15em] border-[1.5px] border-body/55" />
            ))}
          </span>
        )}
      </div>
      <p className={`${T.small} mt-[0.5em] text-center font-semibold text-ink`}>{label}</p>
    </li>
  );
}

function LearnScreen({ episode }: { episode: AppEpisode }) {
  return (
    <>
      <TopBar />
      <div className={BODY}>
        <div>
          <ScreenHeading
            title="Off the screen now"
            line={`A printable from ${episode.title}, to take to the table.`}
          />
          <span
            className={`${T.button} mt-[1.2em] inline-block rounded-full bg-red-fill px-[1.3em] py-[0.65em] font-mono uppercase tracking-[0.14em] text-raised`}
          >
            Print
          </span>
          <p className={`${T.small} mt-[1em] max-w-[28ch] text-body`}>
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
/* The product sheet's opening (2026-10-28). The walkthrough now lays out the
   whole first screen, because the page's title block and the three stage tabs
   share one column beside the device and only one grid can centre them on it:

     lead (mark, name, descriptor)   |  the device
     the tablist                     |  (spans both rows)
                                     |  the credit

   `lead` is the title block; `credit` is the page's "Drawn from the plan, not
   a screenshot" line, right aligned under the device. On a phone the order is
   lead, device, tabs, the active stage line, credit: the object before the
   facts, and a caption describing the selected tab AFTER the control.

   `capture`: the admin's `device.capture` image slot. The day a real
   screenshot exists it shows in the frame in place of the drawn screens, the
   tabs become a plain list (there is nothing for them to drive) and the page
   drops the credit in the same render. Until then it is null and the drawn
   screens stand. */
export function PupsPlayerWalkthrough({
  episodes,
  lead,
  credit,
  after,
  capture = null,
}: {
  episodes: AppEpisode[];
  lead?: ReactNode;
  credit?: ReactNode;
  /** Rows under the whole opening, full width: the sheet's status rows. */
  after?: ReactNode;
  capture?: ImageOverride | null;
}) {
  const [stage, setStage] = useState<Stage>("watch");
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = episodes[0];
  const interactive = !capture;

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

  /* The three stages: one row each, a red dot, the title, and at lg the stage
     line under the active one. Inactive stages run at --color-body on paper. */
  const stageRow = (s: (typeof STAGES)[number], i: number) => {
    const on = s.id === stage;
    const cls = `hairline group block w-full py-4 text-left transition-colors duration-300 lg:py-5 ${
      on ? "text-ink" : "text-body hover:text-ink"
    }`;
    const inner = (
      <>
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-red transition-colors duration-300 ${
              on ? "bg-red" : "bg-transparent"
            }`}
          />
          <span id={`${base}-title-${s.id}`} className="t-h3 font-bold">{s.title}</span>
        </span>
        {/* The stage line under the active tab only, at lg; the other two
            are a title and a dot, so the column stays shorter than the
            device it is centred on. On a phone the line is the caption. */}
        {on && <span className="t-sm mt-2.5 hidden leading-relaxed text-ink lg:block">{s.line}</span>}
      </>
    );
    if (!interactive) return <div key={s.id} className={cls}>{inner}</div>;
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
        className={cls}
      >
        {inner}
      </button>
    );
  };

  /* The one entrance. Settle staggers its direct children by their `--i`:
     the device settles first, the title block and tabs 120ms behind it, the
     status rows 120ms behind that. Reduced motion renders all of it settled. */
  const order = (i: number) => ({ "--i": String(i) } as CSSProperties);

  return (
    <Settle className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto]">
      {lead && <div style={order(2)} className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end">{lead}</div>}

      {/* The three stages. Under the title block beside the device on desktop,
          a row of three beneath the device on a phone. Only the titles are
          shown in the row; the active stage's line follows as a caption. */}
      <div
        {...(interactive ? { role: "tablist", "aria-label": "The three stages of the model", onKeyDown: move } : {})}
        style={order(2)}
        className="order-3 grid grid-cols-3 gap-x-3 lg:col-start-1 lg:row-start-2 lg:grid-cols-1 lg:gap-0 lg:self-start"
      >
        {STAGES.map(stageRow)}
      </div>

      <div style={order(0)} className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
        <div className="@container">
          <div
            {...(interactive ? { id: `${base}-panel`, role: "tabpanel", "aria-labelledby": `${base}-tab-${stage}` } : {})}
            className="mx-auto w-full max-w-[880px] text-[length:clamp(7px,2.6cqw,16px)] @md:text-[length:clamp(7px,2.1cqw,16px)]"
          >
            {/* The frame: a dark bezel on the tablet, a drawn camera, and the
                screen as the lightest paper stop so it reads as lit. */}
            <div className="relative rounded-[2.4em] bg-ink p-[0.95em] shadow-[0_44px_80px_-44px_rgba(60,50,28,0.55)]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[0.35em] hidden h-[0.28em] w-[0.28em] -translate-x-1/2 rounded-full bg-raised/35 @md:block"
              />
              {/* 7/10 in portrait, 16/10 in landscape: real tablet ratios, and
                  the portrait one gives the floored type the height it needs. */}
              <div className="relative aspect-[7/10] overflow-hidden rounded-[1.6em] bg-paper-1 @md:aspect-[16/10]">
                {capture ? (
                  <img
                    src={capture.url}
                    alt={capture.alt}
                    width={1600}
                    height={1000}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  STAGES.map((s) => {
                    const on = s.id === stage;
                    return (
                      <div
                        key={s.id}
                        aria-hidden={!on}
                        /* inert takes an inactive screen out of the tab order and
                           the accessibility tree. React 18 only forwards it as a
                           string attribute, hence the spread. */
                        {...(on ? {} : { inert: "" })}
                        /* `invisible` as well as opacity 0: an inactive screen
                           is out of the paint as well as out of the tree, and
                           visibility transitions at the end of the fade out
                           and the start of the fade in, so the crossfade is
                           unchanged. */
                        className={`absolute inset-0 flex flex-col p-[1.5em] transition-[opacity,visibility] duration-700 ease-[var(--ease-out)] ${
                          on ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                        }`}
                      >
                        {s.id === "watch" && <WatchScreen episodes={episodes} />}
                        {s.id === "play" && <PlayScreen episode={first} />}
                        {s.id === "learn" && <LearnScreen episode={first} />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        {/* The credit, right aligned under the device, in the device's own
            cell so it follows the device wherever the grid centres it. On a
            phone it is hidden here and printed after the stage line instead,
            so a caption describing the selected tab comes before it. */}
        {credit && <div className="mx-auto mt-5 hidden w-full max-w-[880px] lg:block">{credit}</div>}
      </div>

      {/* On a phone the stage line lives here, because three short titles in a
          row leave no room for it beside them. After the tabs, not inside the
          device column: a caption describing the selected tab has to come
          AFTER the control, or a reader meets the answer before it. */}
      {interactive && (
        <p style={order(3)} className="order-4 t-body text-body lg:hidden" aria-live="polite">
          {current.line}
        </p>
      )}

      {credit && (
        <div style={order(3)} className="order-5 lg:hidden">
          {credit}
        </div>
      )}

      {after && (
        <div style={order(4)} className="order-6 mt-4 lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:mt-8">
          {after}
        </div>
      )}
    </Settle>
  );
}
