import type { ReactNode } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { STATIONS, PLATFORMS, DO_NOT } from "./stations";
import { StageMark } from "@/components/team/StageMark";
import "@/components/draw/draw.css";
import "./pline.css";

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
   used, and the return path looping back from the final gate along a rail
   above the track and down into the tools. Around 300px tall. The shape of the argument is visible in one look: people the whole
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

/* THE RETURN, REDRAWN 2026-10-11. The client's words: "the weird looking
   arrow". What it was: one bezier from the final gate, swelling up past the
   top of the box and over every other gate, landing near 03 with a 12-unit
   head that rendered at about 14px. It read as a lasso.

   What it is now: a conveyor return. Up from the final gate, straight back
   along a rail above the track, down onto the track at the tools, with a
   head big enough to read at the size the drawing actually renders (about
   1.15px per unit in a 1376px column, a third of that on a phone). Two
   right-angle corners, rounded, because a belt that goes back is a loop
   with corners, not an arc. The rail sits at RETURN_Y, well inside the box:
   nothing in this drawing may leave its own box. */
const RETURN_Y = 50;
const RETURN_CORNER = 22;
const RETURN_HEAD_LENGTH = 24;
const RETURN_HEAD_HALF_WIDTH = 12;

function arrowHeadFromEndTangent(
  endX: number,
  endY: number,
  controlX: number,
  controlY: number,
) {
  const tangentX = endX - controlX;
  const tangentY = endY - controlY;
  const tangentLength = Math.hypot(tangentX, tangentY);
  const backX = endX - (tangentX / tangentLength) * RETURN_HEAD_LENGTH;
  const backY = endY - (tangentY / tangentLength) * RETURN_HEAD_LENGTH;
  const normalX = (-tangentY / tangentLength) * RETURN_HEAD_HALF_WIDTH;
  const normalY = (tangentX / tangentLength) * RETURN_HEAD_HALF_WIDTH;

  return `M${backX + normalX} ${backY + normalY} L${endX} ${endY} L${backX - normalX} ${backY - normalY}`;
}

export function ProductionFlat({ gateSlot }: { gateSlot?: ReactNode }) {
  const people = STATIONS.filter((s) => s.kind !== "tool");
  const n = people.length;
  const toolX = (gateX(1, n) + gateX(2, n)) / 2;
  const lastX = gateX(n - 1, n);

  /* The return leaves the top of the final gate's ring, runs up to the rail,
     back along it, and down onto the track at the tools. The dashed run stops
     short of the track so the head is the only thing that touches it. */
  const r = RETURN_CORNER;
  const returnStartY = TRACK_Y - 16;
  const returnTipY = TRACK_Y - 3;
  const returnRunEndY = returnTipY - RETURN_HEAD_LENGTH + 4;
  const returnPath = [
    `M${lastX} ${returnStartY}`,
    `V ${RETURN_Y + r}`,
    `Q ${lastX} ${RETURN_Y} ${lastX - r} ${RETURN_Y}`,
    `H ${toolX + r}`,
    `Q ${toolX} ${RETURN_Y} ${toolX} ${RETURN_Y + r}`,
    `V ${returnRunEndY}`,
  ].join(" ");
  /* The head lands on the track pointing down. End tangent is vertical. */
  const returnHead = arrowHeadFromEndTangent(toolX, returnTipY, toolX, returnTipY - 10);
  /* A second chevron halfway along the rail, pointing left: the rail is 740
     units long and without it the direction of travel is only stated at the
     far end. Same stroke, same accent; it is one path's direction said twice,
     not a second accent. */
  const railMidX = (toolX + lastX) / 2;
  const railChevron = arrowHeadFromEndTangent(railMidX - 12, RETURN_Y, railMidX, RETURN_Y);

  return (
    <div className="pline">
      {/* Wrapped so the kit's hold-until-seen gate applies: this drawing
          sits well below the fold and was finishing before anyone reached it. */}
      <Settle className="pline__draw">
      <svg
        className="ink pline__art"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="Six review gates in a line, with the two production tools sitting below the line at one point, and a dashed return path from the final gate back along the top and down into production at the tools."
      >
        {/* The track. People run the whole length of it. */}
        <path
          pathLength="1"
          d={`M${X0} ${TRACK_Y} H ${X1}`}
          className="ink-line ink-draw"
          style={{ "--d": "0.1s", "--dur": "1.2s" } as React.CSSProperties}
        />

        {/* The gates, at edge weight: they are the objects on the track and
            the track is the line between them. The last one is ringed in the
            accent, because it is the only one that can stop a release, which
            is the page's whole claim. */}
        {people.map((s, i) => {
          const x = gateX(i, n);
          const isGate = s.kind === "gate";
          return (
            <g
              key={s.index}
              className="ink-in"
              style={{ "--d": `${0.5 + i * 0.1}s` } as React.CSSProperties}
            >
              <circle cx={x} cy={TRACK_Y} r={isGate ? 12 : 8} className="ink-fill" />
              <circle
                cx={x} cy={TRACK_Y} r={isGate ? 12 : 8}
                className={`ink-line ink-edge ${isGate ? "ink-accent" : ""}`}
              />
              {isGate && <circle cx={x} cy={TRACK_Y} r="4.5" className="ink-accent-fill" />}
            </g>
          );
        })}

        {/* The tools, below the line, at the one point they are used. The box
            has its own edge and a wash so it sits forward of the ground; the
            voice trace inside it is detail and stays thin. */}
        <g className="ink-in" style={{ "--d": "1.15s" } as React.CSSProperties}>
          <path d={`M${toolX} ${TRACK_Y} V ${TRACK_Y + 48}`} className="ink-line ink-thin" />
          <rect x={toolX - 54} y={TRACK_Y + 48} width="108" height="46" rx="6" className="ink-fill" />
          <rect x={toolX - 54} y={TRACK_Y + 48} width="108" height="46" rx="6" className="ink-wash" />
          <rect x={toolX - 54} y={TRACK_Y + 48} width="108" height="46" rx="6" className="ink-line ink-edge" />
          <path d={`M${toolX - 38} ${TRACK_Y + 71} h 8 l 5 -11 6 20 6 -16 4 7 h 9`} className="ink-line ink-thin" />
        </g>

        {/* The return. It leaves the final gate, goes back along the rail
            above the track and re-enters production at the tools: the single
            most important fact on the page, and the chain buried it in a
            footnote under 2,700px of column.

            DASHED, because the caption under this drawing calls it "the
            dashed return" and carries a dashed swatch. `.ink-draw` cannot be
            dashed (the class sets its own dash array), so the run is an
            `.ink-in` with the dash on the attribute, and the head is the part
            that draws. Edge weight, and the only accent stroke in the
            drawing. */}
        <path
          d={returnPath}
          strokeDasharray="11 10"
          className="ink-line ink-edge ink-accent ink-in"
          style={{ "--d": "1.45s" } as React.CSSProperties}
        />
        <path
          d={railChevron}
          className="ink-line ink-edge ink-accent ink-in"
          style={{ "--d": "1.75s" } as React.CSSProperties}
        />
        <path
          pathLength="1"
          d={returnHead}
          className="ink-line ink-edge ink-accent ink-draw"
          style={{ "--d": "2.0s", "--dur": "0.5s" } as React.CSSProperties}
        />
      </svg>
      {/* Said in words inside the loop, lifted from the hero paragraph above
          the drawing. Hidden on a phone, where the loop is 20px tall and the
          caption under the drawing says the same thing. */}
      <p className="ink-label pline__return">The last gate can send the work back</p>
      </Settle>

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
            {s.index && (
              <div className="pline__mark">
                <StageMark n={s.index} />
              </div>
            )}
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
