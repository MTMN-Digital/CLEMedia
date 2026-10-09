import { Settle } from "@/components/Settle";
import "@/components/draw/draw.css";

/* ============================================================================
   The episode is the small part.

   TWO VERSIONS BEFORE THIS. First, three equal columns headed `01` `02` `03`
   in mono: the retired numbered eyebrow and the row of three identical cards,
   in one block. Then a stroke running out of a screen, arcing up and landing
   on a printed sheet, which the client's verdict was "perhaps the wrong
   concept". He was right, and the reason is worth writing down: an arc says
   the EPISODE travels from the screen to the paper. It does not. The episode
   stays where it is and ten minutes long; what changes is how far out from it
   the child gets. A journey drew the wrong subject.

   SO IT IS RINGS. The screen sits small at the centre, lit. Play is the ring
   around it. Learning is the ring beyond that. This is not a metaphor anybody
   had to invent for the drawing: it is the page's own pull quote, two screens
   above, in the client's own words. "We would rather make the episode the
   beginning of the thing than the whole of it." The drawing says exactly that
   and nothing more.

   WHY THE EPISODE IS DRAWN SMALL. Because that is the claim. A screen at the
   centre of three rings, taking a fifth of the width, is the whole argument
   of a company whose product is the ten minutes and whose point is the hour
   after it. Scale carries the meaning here, so nothing else needs to.

   THE RINGS OPEN FROM THE INSIDE OUT, smallest first, once, and then stop.
   The order is the reading order and the reading order is the argument.

   No copy was cut: the client's three sentences are the captions.
   ========================================================================== */

/* The mark beside each reading IS that reading's ring, at 16px: a filled
   screen, the solid ring, the dashed one. Not a legend parked in a corner,
   which is what the old production line made you hold in your head; the mark
   sits against the word it belongs to. */
function Glyph({ kind }: { kind: "screen" | "solid" | "dashed" }) {
  return (
    <svg className="rings__glyph" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {kind === "screen" ? (
        <>
          <rect x="3" y="5" width="14" height="9.5" rx="1.6" className="ink-fill" />
          <rect x="3" y="5" width="14" height="9.5" rx="1.6" className="ink-line" strokeWidth="1.6" />
        </>
      ) : (
        <circle
          cx="10" cy="10" r="7.6"
          className="ink-line"
          strokeWidth="1.6"
          strokeDasharray={kind === "dashed" ? "2.4 3.4" : undefined}
        />
      )}
    </svg>
  );
}

const RINGS: { key: string; word: string; line: string; glyph: "screen" | "solid" | "dashed" }[] = [
  {
    key: "watch",
    glyph: "screen",
    word: "Watch",
    line: "An episode, together. Calm stories paced for how young children actually take things in, with nothing autoplaying into something nobody chose.",
  },
  {
    key: "play",
    glyph: "solid",
    word: "Play",
    line: "A pause for a movement or breathing prompt, so the episode becomes something a child does rather than only sees.",
  },
  {
    key: "learn",
    glyph: "dashed",
    word: "Learn",
    line: "A printable or an educator-designed activity afterwards, moving the learning off the screen entirely.",
  },
];

export function EpisodeRings() {
  return (
    <div className="rings">
      <div className="rings__art">
        <svg
          className="ink"
          viewBox="0 0 440 440"
          role="img"
          aria-label="The episode drawn small at the centre, with play as the ring around it and learning as the ring beyond."
        >
          {/* Outer: the learning that happens off the screen entirely. Dashed
              because it has no edge the company controls, which is the point
              of it. */}
          <circle
            cx="220" cy="220" r="202"
            className="ink-line ink-thin ink-open"
            strokeDasharray="5 9"
            style={{ "--d": "0.95s" } as React.CSSProperties}
          />
          {/* Middle: play, in the room. */}
          <circle
            cx="220" cy="220" r="134"
            className="ink-line ink-open"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          />
          {/* The screen. Ten minutes, and a fifth of the width. */}
          <g className="ink-in" style={{ "--d": "0.15s" } as React.CSSProperties}>
            <rect x="162" y="186" width="116" height="74" rx="7" className="ink-fill" />
            <rect x="162" y="186" width="116" height="74" rx="7" className="ink-line" />
            {/* The garden horizon the show is set in, and its sun. */}
            <path d="M172 246 q 24 -22 48 -9 q 22 12 48 -17" className="ink-line ink-thin" />
            <circle cx="252" cy="206" r="6" className="ink-accent-fill" />
            <path d="M220 260 v 11 M202 271 h 36" className="ink-line" />
          </g>
        </svg>
      </div>

      <Settle as="ol" className="rings__words">
        {RINGS.map((r) => (
          <li key={r.key} className="rings__word">
            <h3 className="ink-name">
              <Glyph kind={r.glyph} />
              {r.word}
            </h3>
            <p className="ink-note">{r.line}</p>
          </li>
        ))}
      </Settle>
    </div>
  );
}
