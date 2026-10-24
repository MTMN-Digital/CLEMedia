import type { ReactNode } from "react";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { PLATFORMS, STATIONS, DO_NOT } from "./stations";
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

   SO IT IS FLAT AND IT IS DRAWN. One track left to right, the phases on it in
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

/* Geometry. The track is the full viewBox width; the phases sit at even
   intervals along it with a margin at each end for the first and last label.

   HALVED 2026-10-11, for the graphite. The box was 1200 by 250 and rendered
   in a 1376px column, so one user unit was 1.15 CSS pixels and the kit's
   2-unit stroke was a 2.3px line: half what the tooth in InkDefs needs to
   read as pencil rather than noise. The drawing is already full width, so
   the page could not give it more room; instead every coordinate in here is
   half what it was and the box is 600 by 125. Same rendered size, same
   shape, and a user unit is now 2.3 CSS pixels (0.58 on a 390 phone, up
   from 0.29). The stroke widths come from the kit and were NOT halved: that
   is the point. */
const VB_W = 600;
/* Sized to what is drawn and no more. The first pass left 70px of empty box
   under the tools and pushed the return arc off the top edge, where the
   section clipped it. */
const VB_H = 125;
const TRACK_Y = 64;
const X0 = 35;
const X1 = VB_W - 35;
const gateX = (i: number, n: number) => X0 + ((X1 - X0) * i) / (n - 1);

/* THE RETURN, REDRAWN 2026-10-11. The client's words: "the weird looking
   arrow". What it was: one bezier from the final gate, swelling up past the
   top of the box and over every other gate, landing near 03 with a 12-unit
   head that rendered at about 14px. It read as a lasso.

   What it is now: a conveyor return. Up from the final gate, straight back
   along a rail above the track, down onto the track at the tools, with a
   head big enough to read at the size the drawing actually renders (about
   2.3px per unit in a 1376px column, a quarter of that on a phone). Two
   right-angle corners, rounded, because a belt that goes back is a loop
   with corners, not an arc. The rail sits at RETURN_Y, well inside the box:
   nothing in this drawing may leave its own box. */
const RETURN_Y = 25;
const RETURN_CORNER = 11;
const RETURN_HEAD_LENGTH = 12;
const RETURN_HEAD_HALF_WIDTH = 6;

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
     short of the track so the head is the only thing that touches it.

     WHERE THE RUN ENDS IS A DASH-PHASE QUESTION. The run is 419.2 units long
     (measured with getTotalLength) against a 21-unit dash period, so it ends
     9.2 units into a gap: the last whole dash stops just above the head and
     the head reads as the next mark in the rhythm. It used to overrun the
     head's back by 2 units, which made it 421.2 long and left a 1.2-unit
     stub of dash under two round caps, a dot sitting on top of the chevron.
     Invisible at 1.15px per unit; a blot at 2.3. Anyone who moves a gate,
     the rail or the corner radius changes this length and should check the
     landing again. */
  const r = RETURN_CORNER;
  const returnStartY = TRACK_Y - 8;
  const returnTipY = TRACK_Y - 1.5;
  const returnRunEndY = returnTipY - RETURN_HEAD_LENGTH;
  const returnPath = [
    `M${lastX} ${returnStartY}`,
    `V ${RETURN_Y + r}`,
    `Q ${lastX} ${RETURN_Y} ${lastX - r} ${RETURN_Y}`,
    `H ${toolX + r}`,
    `Q ${toolX} ${RETURN_Y} ${toolX} ${RETURN_Y + r}`,
    `V ${returnRunEndY}`,
  ].join(" ");
  /* The head lands on the track pointing down. End tangent is vertical. */
  const returnHead = arrowHeadFromEndTangent(toolX, returnTipY, toolX, returnTipY - 5);
  /* A second chevron halfway along the rail, pointing left: the rail is 370
     units long and without it the direction of travel is only stated at the
     far end. Same stroke, same accent; it is one path's direction said twice,
     not a second accent. */
  const railMidX = (toolX + lastX) / 2;
  const railChevron = arrowHeadFromEndTangent(railMidX - 6, RETURN_Y, railMidX, RETURN_Y);

  return (
    <div className="pline">
      {/* Wrapped so the kit's hold-until-seen gate applies: this drawing
          sits well below the fold and was finishing before anyone reached it. */}
      <Settle className="pline__draw">
      <svg
        className="ink pline__art"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="The five phases of an episode in a line, with the two production tools sitting below the line at the one point they are used, and a dashed return path from the final sign-off back along the top and down into the animation."
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
              <circle cx={x} cy={TRACK_Y} r={isGate ? 6 : 4} className="ink-fill" />
              <circle
                cx={x} cy={TRACK_Y} r={isGate ? 6 : 4}
                className={`ink-line ink-edge ${isGate ? "ink-accent" : ""}`}
              />
              {isGate && <circle cx={x} cy={TRACK_Y} r="2.25" className="ink-accent-fill" />}
            </g>
          );
        })}

        {/* The tools, below the line, at the one point they are used. The box
            has its own edge and a wash so it sits forward of the ground; the
            voice trace inside it is detail and stays thin. */}
        <g className="ink-in" style={{ "--d": "1.15s" } as React.CSSProperties}>
          <path d={`M${toolX} ${TRACK_Y} V ${TRACK_Y + 24}`} className="ink-line ink-thin" />
          <rect x={toolX - 27} y={TRACK_Y + 24} width="54" height="23" rx="3" className="ink-fill" />
          <rect x={toolX - 27} y={TRACK_Y + 24} width="54" height="23" rx="3" className="ink-wash" />
          <rect x={toolX - 27} y={TRACK_Y + 24} width="54" height="23" rx="3" className="ink-line ink-edge" />
          <path d={`M${toolX - 19} ${TRACK_Y + 35.5} h 4 l 2.5 -5.5 3 10 3 -8 2 3.5 h 4.5`} className="ink-line ink-thin" />
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
            drawing.

            The dash array is in user units and was deliberately NOT halved
            with the geometry: the stroke it sits on was not halved either,
            and a dash that is four strokes long with a gap of three and a
            half is what reads as a dash. Halving it under a stroke twice as
            thick would have left two round caps touching, which is a dotted
            line. */}
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
      <p className="ink-label pline__return">The episode goes back until everyone is happy</p>
      </Settle>

      {/* The gates in words, under the track, in the same order. A reader who
          wants the detail reads across; a reader who wants the shape has
          already had it from the drawing. */}
      <Settle as="ol" className="pline__gates">
        {people.map((s) => (
          <li key={s.index} className={s.kind === "gate" ? "pline__gate pline__gate--hold" : "pline__gate"}>
            <p className="ink-label">
              <span className="tnum">{s.index}</span>
              {s.kind === "gate" ? " Everyone signs off" : " Person decides"}
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
