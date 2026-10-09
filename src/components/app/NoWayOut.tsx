import "@/components/draw/draw.css";

/* ============================================================================
   No way out.

   The line this sits under is the best sentence on the page: "A young child
   can find their way around it, and cannot accidentally find their way out of
   it." That is a shape. Inside a boundary, everything connects to everything,
   so a child who taps anything gets somewhere they are meant to be. At the
   boundary, the three ways a children's app usually leaks a child out of it
   stop dead.

   The three that stop are not invented. The page already states all three in
   the client's own words, in the feature list above it: "no autoplay into
   something nobody chose", "no surprise purchases inside the app", and "no
   advertising to children anywhere in it".

   WHAT THE INSIDE IS. Episodes, the activities built from them, and the
   printables. Those are the three things the app contains, named on the page.
   They are drawn connected to each other because that is the claim: the play
   follows the story rather than sitting beside it.

   The boundary draws itself first, then the inside connects, then the three
   outward paths run up to the wall and stop. The stop is the point, so it is
   the last thing that happens and the arrowheads are what the accent is spent
   on.
   ========================================================================== */

const INSIDE = [
  { cx: 150, cy: 86, label: "Episodes" },
  { cx: 92, cy: 168, label: "Activities" },
  { cx: 208, cy: 168, label: "Printables" },
];

/* Where the three usual exits would be. Each runs PERPENDICULAR to the wall
   it meets, so the stop bar across it is one short straight line: the first
   version ran them diagonally into the corners and the arrowheads came out
   crooked, which read as a drawing mistake rather than as a wall. */
const BLOCKED: { d: string; stop: string; label: string }[] = [
  { d: "M150 86 V 34", stop: "M132 34 H 168", label: "Autoplay to the next thing" },
  { d: "M92 168 H 40", stop: "M40 150 V 186", label: "A purchase inside the app" },
  { d: "M208 168 H 260", stop: "M260 150 V 186", label: "An advert" },
];

const INSIDE_NAMES = ["Episodes", "Activities", "Printables"];

export function NoWayOut() {
  return (
    <figure className="noway">
      <svg
        className="ink"
        viewBox="0 0 300 250"
        role="img"
        aria-label="Episodes, activities and printables connected to each other inside a boundary, with autoplay, in-app purchases and advertising each stopping at the boundary."
      >
        {/* The boundary. */}
        <rect
          x="14" y="14" width="272" height="206" rx="26" pathLength="1"
          className="ink-line ink-draw"
          style={{ "--d": "0.1s", "--dur": "1.2s" } as React.CSSProperties}
        />

        {/* Everything inside connects to everything inside. */}
        <g className="ink-line ink-thin ink-in" style={{ "--d": "1.05s" } as React.CSSProperties}>
          <path d="M150 86 L92 168 M150 86 L208 168 M92 168 H208" />
        </g>

        {INSIDE.map((n, i) => (
          <g key={n.label} className="ink-in" style={{ "--d": `${0.95 + i * 0.1}s` } as React.CSSProperties}>
            <circle cx={n.cx} cy={n.cy} r="12" className="ink-fill" />
            <circle cx={n.cx} cy={n.cy} r="12" className="ink-line" />
          </g>
        ))}

        {/* The three ways out, each stopping at the wall. The STOP is a bar
            across the path, not an arrowhead: an arrow pointing at a wall
            still reads as going somewhere. */}
        {BLOCKED.map((b, i) => (
          <g key={b.label} className="ink-in" style={{ "--d": `${1.5 + i * 0.14}s` } as React.CSSProperties}>
            <path d={b.d} className="ink-line ink-thin" strokeDasharray="4 5" />
            <path d={b.stop} className="ink-line ink-accent" strokeWidth="3" />
          </g>
        ))}

      </svg>

      <figcaption className="noway__keys">
        <div>
          <p className="ink-label">Inside, all connected</p>
          <p className="noway__inside">{INSIDE_NAMES.join(" \u00b7 ")}</p>
        </div>
        <div>
          <p className="ink-label">Stops at the edge</p>
          <ul>
            {BLOCKED.map((b) => (
              <li key={b.label}>{b.label}</li>
            ))}
          </ul>
        </div>
      </figcaption>
    </figure>
  );
}
