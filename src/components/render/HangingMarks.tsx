import { Relief } from "@/components/render/Relief";
import "./render.css";

/* ============================================================================
   The three letters, hanging.

   WHAT THESE ARE. C, L and É are needle-felted animals on ropes: a
   caterpillar, a lion and an elephant, made by hand and photographed hanging.
   The art has the rope running up to the top edge of each frame, which means
   the frames were drawn to be hung from something, and nothing on this site
   ever hung them. They were cropped free of their ropes for the nav and
   otherwise unused.

   WHY IT IS THE ONE CHARACTER MODULE. The brief puts the characters firmly in
   the supporting cast on this site, which sells the company rather than the
   show, and allows them "one dedicated module". This is it, and it is on the
   page where somebody has just read who the company is.

   THE MOTION, and what it says. Objects on ropes move. They arrive by being
   hung, swing, and come to rest, so the entrance is a drop that damps rather
   than a fade: the sentence it speaks is "these are real things somebody made
   and put up", which no fade-up says. The rest is almost nothing, a degree of
   drift at three different periods so the row never locks into a pattern a
   reader can see repeating.

   ONE LAMP, NOT THREE. Each letter takes a `phase` from its position in the
   row, so the single light crossing the band reaches them in turn.

   Pure CSS keyframes on transform only, so the sway costs no main thread and
   collapses to a still, well-composed row under `prefers-reduced-motion`.
   ========================================================================== */

type Letter = "c" | "l" | "e";

const HUNG: { k: Letter; drop: number; period: number; lean: number }[] = [
  /* `drop` hangs each letter at its own length, because three objects on
     ropes cut to the same length is a shop display, not a studio. */
  { k: "c", drop: 0, period: 7.2, lean: 1.1 },
  { k: "l", drop: 9, period: 8.6, lean: -0.8 },
  { k: "e", drop: 3, period: 6.4, lean: 0.95 },
];

export function HangingMarks({
  size = 200,
  className = "",
  alt = "The CLÉ mark: a felted caterpillar, lion and elephant, each hanging from a rope",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <div
      className={`rk-hang ${className}`}
      role="img"
      aria-label={alt}
      /* In px off the frame size, not a percentage: a percentage gap resolves
         against the flex container, which has no width of its own here, so the
         row collapsed sideways into the column next to it. */
      style={
        {
          "--rk-hang-gap": `${-Math.round(size * 0.3)}px`,
          /* The row's ceiling on a wide screen. Below it the three share
             whatever the column gives them. */
          "--rk-hang-max": `${Math.round(size * 2.2)}px`,
        } as React.CSSProperties
      }
    >
      {HUNG.map((h, i) => (
        <div
          key={h.k}
          className="rk-hang__line"
          style={
            {
              "--drop": `${h.drop}px`,
              "--period": `${h.period}s`,
              "--lean": `${h.lean}deg`,
              /* The entrance is staggered down the row, left to right, so they
                 read as having been hung one after another. */
              "--delay": `${i * 0.14}s`,
            } as React.CSSProperties
          }
        >
          <Relief
            mark={h.k}
            fluid
            depth={3.2}
            /* -1, 0, 1 across the row: one lamp, three positions under it. */
            phase={i - 1}
            travel={0.5}
          />
        </div>
      ))}
    </div>
  );
}
