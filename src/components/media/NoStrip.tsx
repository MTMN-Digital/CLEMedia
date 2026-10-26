import "@/components/draw/draw.css";
import "./nostrip.css";

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

/* 6 slots at 52 wide with 10 between them is 362, which is the viewBox: the
   first version used 720 (then 724) and the sixth slot hung off the right
   edge, where `.ink`'s `overflow: visible` happily drew it outside the box.

   AUTHORED AT HALF SCALE ON PURPOSE. The strip renders at 724px (capped in
   nostrip.css, see there for why), so 362 units across is 2.0 CSS pixels
   per unit, which is what the graphite in InkDefs needs: the 2 unit shelf is
   4 device pixels, the 1.4 unit slot outline is 2.8. At the old 724 units it
   was 1.0 per unit and the tooth had no room inside the line. The rendered
   slot is still 104 by 56 pixels. Stroke widths come from the kit in user
   units and were NOT halved; that is the point. */
const SLOTS = 6;
const SLOT_W = 52;
const SLOT_H = 28;
const GAP = 10;
const VB_W = SLOTS * SLOT_W + (SLOTS - 1) * GAP;

export function NoStrip() {
  return (
    <figure className="nostrip">
      <svg
        className="ink"
        viewBox={`0 0 ${VB_W} 54`}
        role="img"
        aria-label="A publication logo strip with six empty slots, because no publication has written about the company yet."
      >
        {Array.from({ length: SLOTS }, (_, i) => {
          const x = i * (SLOT_W + GAP);
          return (
            <g key={i} className="ink-in" style={{ "--d": `${0.15 + i * 0.1}s` } as React.CSSProperties}>
              <rect x={x} y="9" width={SLOT_W} height={SLOT_H} rx="2" className="ink-fill" />
              {/* The dash array is in user units too, so it was halved with
                  the geometry ("5 6" became "2.5 3") or the dashes would have
                  doubled on the page. The gap then went up a little: round
                  caps are stroke units, and a 1.4 unit cap now covers twice
                  the device pixels, so a straight halving closed the gap to
                  about 3px and the outline read as nearly solid. Not an
                  `.ink-draw` path, so the attribute is honoured. */}
              <rect
                x={x} y="9" width={SLOT_W} height={SLOT_H} rx="2"
                className="ink-line ink-thin"
                strokeDasharray="2.4 3.6"
              />
            </g>
          );
        })}
        {/* Drawn last, the full width: the slots are empty but the shelf they
            sit on is real. */}
        <path
          pathLength="1"
          d={`M0 48 H ${VB_W}`}
          className="ink-line ink-draw"
          style={{ "--d": "0.85s", "--dur": "0.9s" } as React.CSSProperties}
        />
      </svg>

      <figcaption className="nostrip__cap ink-note">
        Six slots, and nothing to put in them yet. The first piece to run takes the first one.
      </figcaption>
    </figure>
  );
}
