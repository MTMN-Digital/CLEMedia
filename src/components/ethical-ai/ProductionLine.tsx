import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Figure } from "@/components/Figure";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The production line.

   The whole argument of /ethical-ai in one drawing: a single rail with the
   company's six stages on it, the people who are answerable at each shown by
   their portrait, the two tools sitting in ONE place in the middle, and a
   final gate that can send the work back along a dashed return path.

   A reader should get all of that without reading a word of body copy, which
   is why the rail, the ticks and the return are drawn rather than implied by
   a card grid. The rail is drawn as an edit timeline (fine frame ticks under
   the line) because that is the one production artefact that is honestly
   ours: an episode is cut, reviewed and re-cut on one of these.

   Layout: a vertical list below 1280px, seven columns from 1280px up. The
   connecting lines are ONE SVG overlay that reads the markers' real positions
   out of the DOM, so both layouts share one drawing and nothing is hand-placed.

   Facts only. Stages, names and the sentence under each are the client's own
   account, identical to the six on the home page. The tools node carries the
   two platforms the client named and nothing else. No incident is narrated:
   the real sent-back episode has not been supplied (CONTENT-NEEDED.md).
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

const MARK = "relative z-10 flex h-14 shrink-0 items-center justify-center sm:h-16";

function Marker({ s, innerRef }: { s: Station; innerRef: (el: HTMLDivElement | null) => void }) {
  if (s.kind === "tool") {
    return (
      <div
        ref={innerRef}
        className={`${MARK} w-14 rounded-[var(--radius-md)] border border-rule bg-[color-mix(in_srgb,var(--color-sage)_46%,var(--color-raised))] text-ink sm:w-16 xl:w-28`}
      >
        <ToolGlyph />
      </div>
    );
  }
  if (s.kind === "gate") {
    return (
      <div ref={innerRef} className={`${MARK} w-14 rounded-full bg-raised text-red-deep ring-2 ring-red/70 sm:w-16`}>
        <HoldGlyph />
      </div>
    );
  }
  if (s.faces) {
    return (
      <div ref={innerRef} className={`${MARK} -space-x-4`}>
        {s.faces.map((a) => (
          <div key={a} className="h-14 w-14 overflow-hidden rounded-full bg-sunken ring-2 ring-[var(--color-raised)] sm:h-16 sm:w-16">
            <Figure asset={a} rounded="rounded-full" className="aspect-square" sizes="64px" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div ref={innerRef} className={`${MARK} w-14 rounded-full border border-rule bg-raised text-ink sm:w-16`}>
      <TeamGlyph />
    </div>
  );
}

/* ── The drawing ──────────────────────────────────────────────────────────── */

interface Box { cx: number; cy: number; top: number; left: number }
interface Geometry { w: number; h: number; horizontal: boolean; boxes: Box[] }

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

  const rail = g.horizontal
    ? { x1: first.cx, y1: first.cy, x2: last.cx, y2: last.cy }
    : { x1: first.cx, y1: first.cy, x2: first.cx, y2: last.cy };

  /* The return: out of the gate, along a lane clear of the markers, back into
     the tools node. Above the row on desktop, left of the column on mobile. */
  const gap = 9;
  const back = g.horizontal
    ? rounded([[gate.cx, gate.top], [gate.cx, gate.top - 34], [tool.cx, gate.top - 34], [tool.cx, tool.top - gap]], 12)
    : rounded([[gate.left, gate.cy], [gate.left - 18, gate.cy], [gate.left - 18, tool.cy], [tool.left - gap, tool.cy]], 12);
  const head = g.horizontal
    ? `M${tool.cx} ${tool.top - 1} l-5 -8 h10 z`
    : `M${tool.left - 1} ${tool.cy} l-8 -5 v10 z`;

  /* Hidden only while Settle has ARMED the block, released when it is IN. No
     JS, reduced motion and crawlers never see .is-armed, so they get the
     finished drawing with no transition to wait for. */
  const draw =
    "transition-[stroke-dashoffset] delay-[450ms] duration-[1400ms] ease-[var(--ease-out)] [.is-armed_&]:[stroke-dashoffset:1] [.is-armed.is-in_&]:[stroke-dashoffset:0]";
  const fade =
    "transition-opacity delay-[1750ms] duration-500 [.is-armed_&]:opacity-0 [.is-armed.is-in_&]:opacity-100";

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true"
    >
      {/* Frame ticks under the rail: a 1 by 7 dash every 12px. */}
      <line {...rail} stroke="var(--color-body)" strokeOpacity="0.22" strokeWidth="7" strokeDasharray="1 11" />
      <line {...rail} stroke="var(--color-body)" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d={back} pathLength={1} fill="none" stroke="var(--color-red)" strokeWidth="1.75"
        strokeLinecap="round" strokeDasharray="1" className={draw} />
      <path d={head} fill="var(--color-red)" className={fade} />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function ProductionLine() {
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
      boxes.push({ cx: r.left - hr.left + r.width / 2, cy: r.top - hr.top + r.height / 2, top: r.top - hr.top, left: r.left - hr.left });
    }
    const ys = boxes.map((b) => b.cy);
    setG({ w: hr.width, h: hr.height, horizontal: Math.max(...ys) - Math.min(...ys) < 4, boxes });
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

      {/* pl-7 on mobile is the lane the return runs down; pt-14 on desktop is
          the lane it runs across. Both are cleared when the other layout is
          active so the drawing never collides with copy. */}
      <ol className="relative z-10 grid gap-y-9 pl-7 xl:grid-cols-7 xl:gap-y-0 xl:pl-0 xl:pt-14">
        {STATIONS.map((s, i) => {
          const kindLabel = s.kind === "tool" ? "Tool assists" : s.kind === "gate" ? "Gate, can hold" : "Person decides";
          /* Three layouts from one row: marker and a stacked copy block on
             mobile; marker, title block and body as three columns from
             1024px, so the spine reads as a full sheet rather than a list
             down the left of an empty page; marker over copy in seven
             columns from 1280px. */
          return (
            <li key={s.title} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-5 gap-y-2.5 sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-x-8 xl:flex xl:flex-col xl:gap-0 xl:px-3 xl:first:pl-0 xl:last:pr-0">
              <Marker s={s} innerRef={(el) => { marks.current[i] = el; }} />
              <div className="pt-0.5 xl:mt-5 xl:pt-0">
                <p className={`tnum font-mono text-[10.5px] uppercase tracking-[0.14em] ${s.kind === "gate" ? "text-red-deep" : "text-muted"}`}>
                  {s.index && <span className="mr-2">{s.index}</span>}
                  {kindLabel}
                </p>
                <h3 className="t-h3 mt-1.5 max-w-[16ch] xl:max-w-none">{s.title}</h3>
                <p className="t-sm mt-1 font-semibold text-ink">{s.who}</p>
              </div>
              <p className="t-sm col-start-2 max-w-[46ch] leading-relaxed text-body lg:col-start-auto lg:pt-0.5 xl:mt-2.5 xl:pt-0">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
