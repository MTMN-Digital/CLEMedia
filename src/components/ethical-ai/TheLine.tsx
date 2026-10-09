import { Settle } from "@/components/Settle";

/* ============================================================================
   The line, drawn.

   WHY. "The lines we hold" was six titles each followed by a forty-five word
   paragraph, in hairline rows: around 270 words of solid prose in the middle
   of a 755 word page, and the single densest block on the site. The client's
   verdict on the site was "so many words, and blocks of words", and this was
   the worst of them.

   NOT ONE WORD IS CUT. The six commitments are still there underneath, in
   full. This sits above them and draws the thing they are all about, so a
   reader who is scanning gets the answer in one look and a reader who wants
   the detail still has every sentence of it.

   WHAT IT DRAWS. The page's whole argument is a boundary: tools do some of
   the production, people decide everything that matters, and the line between
   them does not move. So the line is a line. What only people do sits above
   it, what the tools do sits below it, and every label on it is lifted
   VERBATIM from what the page already says, including the two platforms the
   client named. Nothing here is a new claim.

   NO SVG. The rule and its ticks are borders on grid children, so the labels
   and the marks they hang off share one grid and cannot drift apart at any
   width. The rule draws itself left to right once on entry with a scaleX
   transform, which is one composited property; the ticks and labels follow it
   along. Then it stops. Under `prefers-reduced-motion` it is simply drawn.
   ========================================================================== */

/* Above the line: lifted from "The lines we hold" and the stage account. */
const PEOPLE = [
  "What a story should teach",
  "How a character behaves",
  "What is appropriate for the children watching",
  "Every learning objective and activity",
];

/* Below it: the two platforms the client named, and only what they are named
   for. The page says both sit inside a human-led workflow. */
const TOOLS = [
  { name: "Runway", does: "Elements of visual production and animation" },
  { name: "ElevenLabs", does: "Elements of audio and voice production" },
];

export function TheLine() {
  return (
    <Settle className="theline">
      <div className="theline__side theline__side--people">
        <span>People decide</span>
      </div>

      <ol className="theline__above">
        {PEOPLE.map((p, i) => (
          <li key={p} style={{ "--i": i } as React.CSSProperties}>
            <p>{p}</p>
            <span className="theline__tick" aria-hidden="true" />
          </li>
        ))}
      </ol>

      <div className="theline__rule" aria-hidden="true">
        <span />
      </div>

      <ol className="theline__below">
        {TOOLS.map((t, i) => (
          <li key={t.name} style={{ "--i": i } as React.CSSProperties}>
            <span className="theline__tick" aria-hidden="true" />
            <p>
              <strong>{t.name}</strong>
              {t.does}
            </p>
          </li>
        ))}
      </ol>

      <div className="theline__side theline__side--tools">
        <span>Tools assist</span>
      </div>
    </Settle>
  );
}
