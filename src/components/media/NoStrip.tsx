import "@/components/draw/draw.css";

/* ============================================================================
   The logo strip that is not there.

   The line beside this is the best thing on the page: "No logo strip of
   publications that have not written about us, and no quote nobody said."
   Saying it is good. Showing the empty slots is better, because every press
   page on the internet has this strip full of marks the company has no right
   to, and a reader recognises the shape before they read a word of it.

   So the strip is drawn, at the size a real one would be, and it is empty.
   Six slots with nothing in them, on a rule that is real. Nothing is
   invented: there is no coverage yet, which is exactly what the index above
   this one already says.

   IT IS NOT THE SHOP'S STRUCK CHECKOUT AGAIN. That drawing strikes OUT things
   the company refuses to ask for. This one leaves slots standing EMPTY and
   waiting, because these are not refused, they are simply not earned yet. One
   is a policy, the other is a date.

   The slots arrive left to right, the shelf draws under them, and it stops.
   ========================================================================== */

/* 6 slots at 104 wide with 20 between them is 724, which is the viewBox: the
   first version used 720 and the sixth slot hung off the right edge, where
   `.ink`'s `overflow: visible` happily drew it outside the box. */
const SLOTS = 6;

export function NoStrip() {
  return (
    <figure className="nostrip">
      <svg
        className="ink"
        viewBox="0 0 724 108"
        role="img"
        aria-label="A publication logo strip with six empty slots, because no publication has written about the company yet."
      >
        {Array.from({ length: SLOTS }, (_, i) => {
          const w = 104;
          const gap = 20;
          const x = i * (w + gap);
          return (
            <g key={i} className="ink-in" style={{ "--d": `${0.15 + i * 0.1}s` } as React.CSSProperties}>
              <rect x={x} y="18" width={w} height="56" rx="4" className="ink-fill" />
              <rect
                x={x} y="18" width={w} height="56" rx="4"
                className="ink-line ink-thin"
                strokeDasharray="5 6"
              />
            </g>
          );
        })}
        {/* Drawn last, the full width: the slots are empty but the shelf they
            sit on is real. */}
        <path
          pathLength="1"
          d="M0 96 H 724"
          className="ink-line ink-draw"
          style={{ "--d": "0.85s", "--dur": "0.9s" } as React.CSSProperties}
        />
      </svg>

      <figcaption className="nostrip__cap ink-label">
        Six slots, and nothing to put in them yet. The first piece to run takes the first one.
      </figcaption>
    </figure>
  );
}
