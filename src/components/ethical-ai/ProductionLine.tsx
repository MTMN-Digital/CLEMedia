import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Figure } from "@/components/Figure";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The production line.

   The whole argument of /ethical-ai in one drawing: a single rail with the
   company's six stages on it, the people who are answerable at each shown by
   their portrait, the two tools sitting in ONE place in the middle, and a
   final gate that can send the work back along a dashed return path.

   REBUILT 2026-10-06, from a horizontal strip to a vertical chain.

   The strip version drew the sequence once across the top of the page and then
   the page restated the same six stages in words further down, and separately
   named the two tools again in a section of their own with the one show frame
   parked in a card beside it. Three accounts of one sequence, and a reader who
   had already looked at the drawing had nothing left to read. So the drawing is
   now the page: the chain runs down the middle of a full-bleed band, each
   station carries its own account beside it, and the two blocks that used to
   restate the drawing are stations ON it.

   Why vertical and not a wider strip. A strip gives every station the same
   narrow column, which is exactly wrong here: the stations are not equal. One
   of them is where the tools sit and it has to carry the platforms, the limits
   and the exhibit; one of them is the gate and it has to carry the case. A
   chain lets a station be as tall as its content without starving the others,
   and it gives the return path somewhere real to run, climbing back past three
   stations to the tools rather than hopping over one gap.

   Layout: markers in a left lane below 1024px, in a centre lane above it with
   the accounts alternating either side. The connecting lines are ONE SVG
   overlay that reads the markers' real positions out of the DOM, so both
   layouts share one drawing and nothing is hand-placed.

   Facts only. Stages, names and the sentence under each are the client's own
   account, identical to the six on the home page. The tools station carries the
   two platforms the client named and nothing else. No incident is narrated: the
   real sent-back episode has not been supplied (CONTENT-NEEDED.md), and what
   goes in its place arrives here as `gateSlot` rather than being written.
   ========================================================================== */

type Kind = "person" | "tool" | "gate";

interface Station {
  kind: Kind;
  /** The company's own stage number. Production is not one of the six. */
  index?: string;
  title: string;
  who: string;
  body: string;
  /** Portraits, supplied 2026-10-01. A stage that names a person shows them. */
  faces?: AssetKey[];
}

const STATIONS: Station[] = [
  {
    kind: "person", index: "01", title: "Concept and story", who: "Conor and Alan",
    faces: ["person.conor", "person.alan"],
    body: "The episode concept, the story and the learning goal, set by people before any production begins.",
  },
  {
    kind: "person", index: "02", title: "Script and direction", who: "Alan Compton",
    faces: ["person.alan"],
    body: "The script is written and production directed. Assets are specified and selected by the team, not accepted as they arrive.",
  },
  {
    kind: "tool", title: "Visual and voice production", who: "Runway and ElevenLabs",
    body: "Runway for visual production and ElevenLabs for voice production, inside final production and directed by the team. Nothing here is published on its own.",
  },
  {
    kind: "person", index: "03", title: "Educational review", who: "Paula Walshe PhD",
    faces: ["person.paula"],
    body: "Learning intent and the offline activities that follow the episode, reviewed against early years practice.",
  },
  {
    kind: "person", index: "04", title: "Parent and early years review", who: "Lydia and Kirstie",
    faces: ["person.lydia", "person.kirstie"],
    body: "Script and production read again from a parent's point of view, and from a child's.",
  },
  {
    kind: "person", index: "05", title: "Quality and suitability", who: "The production team",
    body: "Voices and visuals checked for quality, consistency and suitability for the children watching.",
  },
  {
    kind: "gate", index: "06", title: "Final review and approval", who: "The team",
    body: "The finished episode is inspected and changes requested where needed. A release can be held here.",
  },
];

const TOOL_AT = STATIONS.findIndex((s) => s.kind === "tool");
const GATE_AT = STATIONS.findIndex((s) => s.kind === "gate");

/* What each platform is for, and what neither is allowed to do. These two
   blocks used to be a section of their own halfway down the page, which is
   what made the page say the same thing twice. They belong to the one station
   the tools are at, so they live inside it. */
const PLATFORMS: { name: string; role: string; body: string }[] = [
  {
    name: "Runway",
    role: "Visual production",
    body: "Supports elements of visual production and animation, to the script and direction set by the team.",
  },
  {
    name: "ElevenLabs",
    role: "Voice production",
    body: "Supports elements of audio and voice production, reviewed for quality and suitability before release.",
  },
];

const DO_NOT = [
  "Decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  "Generate and publish anything automatically. Every output is directed, reviewed and approved by the team before publication.",
  "Replace the educational judgement of qualified people. Learning objectives, activities, language and child development stay with them.",
];

/* ── Glyphs for the stations with no portrait ──────────────────────────── */

/** Frames and a waveform: picture and sound, which is what the tools make. */
function ToolGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5.5" width="23" height="12" rx="2" />
      <path d="M7 11.5h2M21 11.5h2" />
      <path d="M4 24h3l2-4 3 7 3-6 2 3h9" />
    </svg>
  );
}

/** Two heads: the production team, not one named person. */
function TeamGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="10.5" r="3.6" />
      <path d="M3.5 24a7.5 7.5 0 0 1 15 0" />
      <circle cx="20.5" cy="11.5" r="3" />
      <path d="M20 17.5c3.8 0 6.6 2.6 6.6 6.5" />
    </svg>
  );
}

/** A hold. Two bars, which is what a release that is waiting looks like. */
function HoldGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M9.5 7v12M16.5 7v12" />
    </svg>
  );
}

/* ── Markers ─────────────────────────────────────────────────────────────── */

const MARK = "relative z-10 flex h-14 shrink-0 items-center justify-center";

function Marker({ s, innerRef }: { s: Station; innerRef: (el: HTMLDivElement | null) => void }) {
  if (s.kind === "tool") {
    return (
      <div
        ref={innerRef}
        className={`${MARK} w-14 rounded-[var(--radius-md)] border border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))] text-ink`}
      >
        <ToolGlyph />
      </div>
    );
  }
  if (s.kind === "gate") {
    return (
      <div ref={innerRef} className={`${MARK} w-14 rounded-full bg-raised text-red-deep ring-2 ring-red/70`}>
        <HoldGlyph />
      </div>
    );
  }
  if (s.faces) {
    /* Faces are capped at two and overlap, so the widest marker on the chain
       stays inside the lane the return path has to share with it. */
    return (
      <div ref={innerRef} className={`${MARK} -space-x-4`}>
        {s.faces.map((a) => (
          <div key={a} className="h-14 w-14 overflow-hidden rounded-full bg-sunken ring-2 ring-[var(--color-raised)]">
            <Figure asset={a} rounded="rounded-full" className="aspect-square" sizes="56px" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div ref={innerRef} className={`${MARK} w-14 rounded-full border border-rule bg-raised text-ink`}>
      <TeamGlyph />
    </div>
  );
}

/* ── The drawing ──────────────────────────────────────────────────────────── */

interface Box { cx: number; cy: number; left: number }
/** `lane` is the x the return path climbs: left of the markers in the stacked
 *  layout, inside the centre lane in the chain. Measured, never assumed. */
interface Geometry { w: number; h: number; lane: number; boxes: Box[] }

/** A polyline with rounded corners, so the return reads as drawn, not plotted. */
function rounded(points: [number, number][], r: number): string {
  if (points.length < 2) return "";
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, inLen / 2, outLen / 2);
    const ax = cx - ((cx - px) / inLen) * rr;
    const ay = cy - ((cy - py) / inLen) * rr;
    const bx = cx + ((nx - cx) / outLen) * rr;
    const by = cy + ((ny - cy) / outLen) * rr;
    d += ` L${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx} ${ly}`;
}

function Lines({ g }: { g: Geometry }) {
  const first = g.boxes[0];
  const last = g.boxes[g.boxes.length - 1];
  const tool = g.boxes[TOOL_AT];
  const gate = g.boxes[GATE_AT];

  /* The rail is one straight vertical through the marker centres in both
     layouts. Only the lane it runs in moves. */
  const rail = { x1: first.cx, y1: first.cy, x2: first.cx, y2: last.cy };

  /* The return: out of the gate, up a lane clear of every marker, back into the
     tools node. See `measure` for how the lane is found. */
  const gap = 9;
  const back = rounded(
    [
      [gate.left - 2, gate.cy],
      [g.lane, gate.cy],
      [g.lane, tool.cy],
      [tool.left - gap, tool.cy],
    ],
    14,
  );
  const head = `M${tool.left - 1} ${tool.cy} l-8 -5 v10 z`;

  /* The return is dashed and STAYS dashed once drawn: the dash is what tells
     it apart from the solid rail, and the caption promises it. So the draw-on
     is not a dashoffset trick (that spends the dash array on the animation and
     leaves a solid line) and not a mask (Chrome clips a tall mask raster at
     narrow widths). It is a clip-path wipe travelling from the gate towards
     the tools, bottom to top up the chain.

     Hidden only while Settle has ARMED the block, released when it is IN. No
     JS, reduced motion and crawlers never see .is-armed, so they get the
     finished drawing with no transition to wait for. */
  const draw =
    "transition-[clip-path] delay-[450ms] duration-[1400ms] ease-[var(--ease-out)] " +
    "[.is-armed_&]:[clip-path:inset(100%_-4px_-4px_-4px)] [.is-armed.is-in_&]:[clip-path:inset(-4px)]";
  const fade =
    "transition-opacity delay-[1750ms] duration-500 [.is-armed_&]:opacity-0 [.is-armed.is-in_&]:opacity-100";

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true"
    >
      {/* Frame ticks along the rail: a 1 by 11 dash every 12px, which is an
          edit timeline, the one production artefact that is honestly ours. */}
      <line {...rail} stroke="var(--color-body)" strokeOpacity="0.22" strokeWidth="7" strokeDasharray="1 11" />
      <line {...rail} stroke="var(--color-body)" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d={back} fill="none" stroke="var(--color-red)" strokeWidth="1.75"
        strokeLinecap="round" strokeDasharray="6 5" className={draw} />
      <path d={head} fill="var(--color-red)" className={fade} />
    </svg>
  );
}

/* ── A station's account, beside its marker ──────────────────────────────── */

function Account({ s }: { s: Station }) {
  const kindLabel = s.kind === "tool" ? "Tool assists" : s.kind === "gate" ? "Gate, can hold" : "Person decides";
  return (
    <>
      <p className={`tnum font-mono text-[10.5px] uppercase tracking-[0.14em] ${s.kind === "gate" ? "text-red-deep" : "text-muted"}`}>
        {s.index && <span className="mr-2">{s.index}</span>}
        {kindLabel}
      </p>
      <h3 className="t-h3 mt-2">{s.title}</h3>
      <p className="t-sm mt-1 font-semibold text-ink">{s.who}</p>
      <p className="t-body mt-3 max-w-[46ch] text-body">{s.body}</p>
    </>
  );
}

/* The one object on the wall.

   Six stations are set type on the ground; this one is a card, because it is
   the one place in the sequence where something other than a person is doing
   work, and because it carries the exhibit. The show frame used to sit in a
   card off to the right of a section further down, where it illustrated
   nothing; here it is evidence at the point in the line that produced it. */
function ToolCard({ s }: { s: Station }) {
  return (
    /* card-still: this sheet is half a metre tall and carries no link, so the
       3px lift the house card does on approach reads as the page twitching
       rather than as a surface being picked up. */
    <div className="card card-still rounded-[var(--radius-lg)] p-5 sm:p-7 lg:p-8">
      <Account s={s} />

      {/* One column, not a label column and a description column. Measured at
          1100, where this card is half of a half of the band: the two-column
          version left the description 187px wide, which is about 26 characters
          to the line, and 26 characters is a column of hyphens. */}
      <dl className="mt-7">
        {PLATFORMS.map((p) => (
          <div key={p.name} className="hairline py-5">
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="t-h3 text-ink">{p.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{p.role}</span>
            </dt>
            <dd className="t-body mt-2 text-body">{p.body}</dd>
          </div>
        ))}
      </dl>

      {/* The small print stays with the platforms it is about, and it is also
          what brings this half of the station to within a line of the other
          half's height. */}
      <p className="t-sm mt-6 text-body">
        Naming the platforms does not imply that either provider endorses CLÉ Family Media. As the
        technology changes we will keep reviewing the platforms we use, their commercial terms, and
        how they align with our standards on intellectual property, consent and responsible
        production.
      </p>
    </div>
  );
}

/* The other half of the tools station, across the lane from the card.

   The exhibit is a frame of the thing the tools actually produced, at the point
   in the line that produced it. It used to sit in a card off to the right of a
   section further down the page, where it illustrated nothing in particular.

   The limits sit under it rather than inside the card because this station is
   the only one on the chain with enough to say to need both sides, and because
   a card carrying the account, the platforms, the limits and the small print
   ran to 900px against 300px of exhibit opposite it: one tall column of
   everything beside one short column of nothing is the shape this whole pass
   exists to get rid of. Split, the two sides finish within a line of each
   other. */
function ToolAside() {
  return (
    <div>
      <figure>
        <div className="card card-still overflow-hidden rounded-[var(--radius-lg)] p-2.5">
          <Figure
            asset="home.characters"
            rounded="rounded-[var(--radius-md)]"
            sizes="(min-width: 1024px) 38vw, 90vw"
          />
        </div>
        <figcaption className="t-sm mt-4 max-w-[46ch] text-body">
          Finn and Fia, a frame from <em>The Pawsitive Pugs &amp; Pals®</em>. The visuals are produced
          with Runway, to a story, script and direction set by people, and are reviewed by the team
          before release.
        </figcaption>
      </figure>

      <div className="mt-9 border-t border-t-rule pt-7">
        <h4 className="t-h3">Neither tool is used to</h4>
        <ul className="mt-4 space-y-3">
          {DO_NOT.map((line) => (
            <li key={line} className="flex gap-3.5">
              <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <p className="t-body max-w-[52ch] text-body">{line}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function ProductionLine({ gateSlot }: { gateSlot?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const marks = useRef<(HTMLDivElement | null)[]>([]);
  const [g, setG] = useState<Geometry | null>(null);

  const measure = useCallback(() => {
    const host = wrap.current;
    if (!host) return;
    const hr = host.getBoundingClientRect();
    const boxes: Box[] = [];
    for (let i = 0; i < STATIONS.length; i++) {
      const el = marks.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      boxes.push({
        cx: r.left - hr.left + r.width / 2,
        cy: r.top - hr.top + r.height / 2,
        left: r.left - hr.left,
      });
    }
    /* Which layout is live is read off the markers themselves rather than off a
       media query, so the two can never disagree: if the lane is near the
       middle of the band this is the chain, otherwise it is the stacked list.
       The chain's return lane is set back from the WIDEST marker, because the
       two-portrait markers are the widest things on it and a constant offset
       went through Lydia and Kirstie's faces at one breakpoint and not at
       another. */
    const centred = Math.abs(boxes[0].cx - hr.width / 2) < hr.width * 0.12;
    const widest = Math.max(...boxes.map((b) => b.cx - b.left));
    const lane = centred ? boxes[0].cx - widest - 16 : Math.min(...boxes.map((b) => b.left)) - 18;
    setG({ w: hr.width, h: hr.height, lane, boxes });
  }, []);

  useLayoutEffect(() => {
    measure();
    const host = wrap.current;
    if (!host) return;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(host);
    window.addEventListener("resize", measure, { passive: true });
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div ref={wrap} className="relative">
      {g && <Lines g={g} />}

      {/* pl-7 below 1024px is the lane the return climbs; above it the lane is
          the middle column of the grid and the accounts alternate either side.
          Markers are pinned to the top of their row (items-start), so a tall
          station simply makes a longer run of rail rather than dragging its
          neighbours' markers out of line. */}
      <ol className="relative z-10 grid gap-y-11 pl-5 sm:pl-7 lg:gap-y-12 lg:pl-0">
        {STATIONS.map((s, i) => {
          const left = i % 2 === 0;
          /* Only two stations carry more than a sentence, and both of them put
             the extra across the lane rather than under the account, so the
             far side of the chain is never a column of nothing beside a column
             of everything. */
          const aside = s.kind === "tool" ? <ToolAside /> : s.kind === "gate" ? gateSlot : null;
          const near = left ? "lg:col-start-1 lg:pr-10 xl:pr-14" : "lg:col-start-3 lg:pl-10 xl:pl-14";
          const far = left ? "lg:col-start-3 lg:pl-10 xl:pl-14" : "lg:col-start-1 lg:pr-10 xl:pr-14";
          return (
            <li
              key={s.title}
              className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-5 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:gap-x-0 lg:gap-y-0"
            >
              <div className="lg:col-start-2 lg:row-start-1 lg:flex lg:justify-center">
                <Marker s={s} innerRef={(el) => { marks.current[i] = el; }} />
              </div>
              <div className={`col-start-2 pt-0.5 lg:row-start-1 lg:pt-0 ${near}`}>
                {s.kind === "tool" ? <ToolCard s={s} /> : <Account s={s} />}
              </div>
              {aside && (
                <div className={`col-start-2 mt-7 lg:row-start-1 lg:mt-0 ${far}`}>{aside}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
