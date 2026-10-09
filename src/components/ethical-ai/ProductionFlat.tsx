import type { ReactNode } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { STATIONS, PLATFORMS, DO_NOT } from "./stations";
import "@/components/draw/draw.css";

/* ============================================================================
   The production line, flat.

   WHAT THIS REPLACED, 2026-10-09. A centred vertical chain, 2,700 pixels tall,
   with the stations alternating left and right of a spine, circular portraits
   on the spine, a dashed return path climbing the whole height, two large
   cards hanging off it, and a LEGEND in the top corner telling you what the
   three marker styles meant. The client's verdict was that it was very poor,
   and every part of that is a thing this project has already killed once:

   - a centred alternating timeline is the most templated shape there is, and
     the eye zigzags down it instead of reading an order;
   - the legend is the stage matrix's key by another route, and /team's matrix
     was replaced precisely because a reader should not have to hold a key in
     their head;
   - the circular portraits breach the contract rule that has said "rounded
     squares, never circles" since the sitepass-w2 run;
   - at 2,700px nobody sees the shape of it at all, and the shape IS the
     argument.

   SO IT IS FLAT AND IT IS DRAWN. One track left to right, six gates on it in
   order, the two tools sitting BELOW the track at the single point they are
   used, and the return path arcing back from the final gate. Around 400px
   tall. The shape of the argument is visible in one look: people the whole
   way across, tools at one point underneath, and a way back from the end.

   NO LEGEND. A gate says who decides on the gate. The tools are below the
   line because they are below the line, which is the same thing the drawn
   boundary further up the page says, in the same hand.

   The detail that used to hang off the chain in cards is unchanged and sits
   under the drawing: the platforms, what neither tool is allowed to do, and
   the held-release case. Not one word of it was cut.
   ========================================================================== */

/* Geometry. The track is the full viewBox width; the six gates sit at even
   intervals along it with a margin at each end for the first and last label. */
const VB_W = 1200;
/* Sized to what is drawn and no more. The first pass left 70px of empty box
   under the tools and pushed the return arc off the top edge, where the
   section clipped it. */
const VB_H = 250;
const TRACK_Y = 128;
const X0 = 70;
const X1 = VB_W - 70;
const gateX = (i: number, n: number) => X0 + ((X1 - X0) * i) / (n - 1);

export function ProductionFlat({ gateSlot }: { gateSlot?: ReactNode }) {
  const people = STATIONS.filter((s) => s.kind !== "tool");
  const n = people.length;
  const toolX = (gateX(1, n) + gateX(2, n)) / 2;
  const lastX = gateX(n - 1, n);

  return (
    <div className="pline">
      <svg
        className="ink pline__art"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Six review gates in a line, with the two production tools sitting below the line at one point, and a return path from the final gate back into production."
      >
        {/* The track. People run the whole length of it. */}
        <path
          pathLength="1"
          d={`M${X0} ${TRACK_Y} H ${X1}`}
          className="ink-line ink-draw"
          style={{ "--d": "0.1s", "--dur": "1.2s" } as React.CSSProperties}
        />

        {/* The gates. The last one is the accent, because it is the only one
            that can stop a release, which is the page's whole claim. */}
        {people.map((s, i) => {
          const x = gateX(i, n);
          const isGate = s.kind === "gate";
          return (
            <g
              key={s.index}
              className="ink-in"
              style={{ "--d": `${0.5 + i * 0.1}s` } as React.CSSProperties}
            >
              <circle cx={x} cy={TRACK_Y} r={isGate ? 11 : 7} className="ink-fill" />
              <circle
                cx={x} cy={TRACK_Y} r={isGate ? 11 : 7}
                className={`ink-line ${isGate ? "ink-accent" : ""}`}
                strokeWidth={isGate ? 2.5 : 2}
              />
              {isGate && <circle cx={x} cy={TRACK_Y} r="4" className="ink-accent-fill" />}
            </g>
          );
        })}

        {/* The tools, below the line, at the one point they are used. */}
        <g className="ink-in" style={{ "--d": "1.15s" } as React.CSSProperties}>
          <path d={`M${toolX} ${TRACK_Y} V ${TRACK_Y + 48}`} className="ink-line ink-thin" />
          <rect x={toolX - 54} y={TRACK_Y + 48} width="108" height="46" rx="6" className="ink-fill" />
          <rect x={toolX - 54} y={TRACK_Y + 48} width="108" height="46" rx="6" className="ink-line ink-thin" />
          <path d={`M${toolX - 38} ${TRACK_Y + 71} h 8 l 5 -11 6 20 6 -16 4 7 h 9`} className="ink-line ink-thin" />
        </g>

        {/* The return. It leaves the final gate, goes back over the track and
            re-enters production: the single most important fact on the page,
            and the chain buried it in a footnote under 2,700px of column. */}
        <path
          pathLength="1"
          d={`M${lastX} ${TRACK_Y - 13} C ${lastX} ${TRACK_Y - 76}, ${toolX} ${TRACK_Y - 86}, ${toolX} ${TRACK_Y - 26}`}
          /* SOLID, not dashed. `.ink-draw` works by animating
             `stroke-dashoffset` against `stroke-dasharray: 1`, so a dash
             pattern on the same path is overridden by the class and silently
             does nothing. It is the only curve on the drawing and the only
             accent stroke, which is distinction enough. */
          className="ink-line ink-accent ink-draw"
          style={{ "--d": "1.45s", "--dur": "0.9s" } as React.CSSProperties}
        />
        <path
          d={`M${toolX - 6} ${TRACK_Y - 34} L ${toolX} ${TRACK_Y - 23} L ${toolX + 6} ${TRACK_Y - 34}`}
          className="ink-line ink-accent ink-in"
          style={{ "--d": "2.3s" } as React.CSSProperties}
        />
      </svg>

      {/* The gates in words, under the track, in the same order. A reader who
          wants the detail reads across; a reader who wants the shape has
          already had it from the drawing. */}
      <Settle as="ol" className="pline__gates">
        {people.map((s) => (
          <li key={s.index} className={s.kind === "gate" ? "pline__gate pline__gate--hold" : "pline__gate"}>
            <p className="ink-label">
              <span className="tnum">{s.index}</span>
              {s.kind === "gate" ? " Can hold a release" : " Person decides"}
            </p>
            <h3>{s.title}</h3>
            <p className="pline__who">{s.who}</p>
            {s.faces && s.faces.length > 0 && (
              <ul className="pline__faces">
                {s.faces.map((f) => (
                  <li key={f}>
                    <Figure asset={f} rounded="rounded-[5px]" className="aspect-square" sizes="40px" />
                  </li>
                ))}
              </ul>
            )}
            <p className="pline__body">{s.body}</p>
          </li>
        ))}
      </Settle>

      <div className="pline__detail">
        <div className="pline__tools">
          <p className="ink-label">The tools, at one point on the line</p>
          <ul>
            {PLATFORMS.map((p) => (
              <li key={p.name}>
                <h4>
                  {p.name} <span>{p.role}</span>
                </h4>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="pline__never">
          <p className="ink-label">Neither tool is used to</p>
          <ul>
            {DO_NOT.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {gateSlot && <div className="pline__case">{gateSlot}</div>}
    </div>
  );
}
