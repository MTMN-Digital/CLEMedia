import type { ReactNode } from "react";
import { Figure } from "@/components/Figure";
import { Section } from "@/components/ui";
import { Wipe } from "@/components/Wipe";
import { ASSETS, type AssetKey } from "@/lib/brand";

/* ============================================================================
   A frame from the series, shown whole.

   WHAT WAS WRONG, measured 2026-10-13. All five of these were edge-to-edge
   bands with a hand-tuned pixel height (`h-[clamp(220px,34vw,460px)]` and four
   variants), `object-cover`, and a focal point to steer the crop. The heights
   were chosen for the band's proportions on the page and had nothing to do
   with the pictures going in them, so the pictures were sliced: at 1440 the
   five bands showed 57 to 65 percent of their frame, and at 1920 only 43 to 48
   percent. On the meadow that cut in half the leaf the whole composition
   stands on and pushed Finn and Fia against the top edge. On the snail it took
   the antennae and the end of the trail.

   WHY NOT JUST A TALLER BAND. Because the geometry does not allow it. A
   full-bleed image can only show all of itself when the band is
   `viewport / ratio` tall, so the 4:3 garden frame on a 1920 monitor would
   want 1440 pixels, more than a screen. Raising the cap fixed the laptops and
   left the big monitors cropped.

   SO THE FRAME STOPPED BEING A BAND. David's call: not full bleed, rounded,
   the whole image. Nothing is cropped at any width on any screen, because the
   box is the picture's own shape and there is nothing for `object-cover` to do.

   HOW BIG, settled 2026-10-13 after two passes. The brief was "the largest we
   can make them without disrupting the flow of the pages, or losing bits of
   them", and those two limits point at different measurements:

   - Losing bits of them is already solved: the picture sets its own box.
   - Disrupting the flow is a HEIGHT problem, not a width one. A frame taller
     than the window stops being a beat in the page and becomes a wall you
     scroll through with nothing either side of it for context.

   So height is the limit and width follows each frame's own shape. `max-height`
   is in `vh` because the thing being protected is the reader's window, not a
   number somebody picked: on a short laptop the frames come down with it. The
   first attempt put every frame in the standard 960 column, which made the 2:1
   series frames 480 tall and far too small, because a fixed width punishes
   exactly the frames that are widest and shortest.

   Measured, not estimated. At 1440x900 the two series frames reach the column
   cap at 1376x688, and the squarer ones stop on height: 1224x765 for the
   chicken and pugs, 1148x765 for the garden, 1020x765 for the bluebells. At
   1920x1080 they go to 1496x748, 1469x918, 1377x918 and 1224x918. On a 1366x768
   laptop they come down to 1302x651 and 653 tall, which is the point of using
   vh. Every one is bigger than the 960 column gave, the worst case (the
   bluebells, the squarest) fills exactly one window including its caption, and
   the band under it is still visible at the bottom of the screen.

   `w-fit` on the figure, not just the image: when a frame stops on height it is
   narrower than the column, and a figure that stayed full width would leave its
   caption stranded out to the left of the picture it captions.

   IT ALSO TAKES TWO GRADIENTS OFF THE SITE. Three of these carried a caption
   over the image on a black-to-transparent scrim. A caption under a plate
   needs no scrim, so the scrims went with the bands.

   THE CAPTION IS NOT DECORATION. Every one of these is a frame from an
   animation, not a photograph, and a company whose Responsible AI page turns
   on being straight about how the work is made does not put an uncaptioned
   rendered image on its home page. The caption is required, not optional,
   which is why it is a parameter and not a flag.
   ========================================================================== */

export function ShowFrame({
  asset,
  caption,
  priority = false,
}: {
  asset: AssetKey;
  /** Always says it is a frame. See the note above. */
  caption: ReactNode;
  /** Set on the one frame a page leads with, and nowhere else. */
  priority?: boolean;
}) {
  const a = ASSETS[asset];

  /* HUNG LIKE THE HERO, from 2026-10-27. The client rates the hero as the
     best thing on the site, and these plates were floating in a pale gap with
     their caption below the fold. They now take the hero's own frame: the
     same gutter, the same radius, and the caption in the bottom left corner
     over a scrim, the way the hero carries its copy. The frames are 2:1, so
     at the hero's width they still show whole on a laptop. On a phone the
     caption drops back under the picture, where it has room to be read. */
  return (
    <Section as="div" pad="close" className="show-frame">
      <Wipe>
        <figure
          className="show-frame__fig"
          style={{ width: `min(100%, calc(92vh * ${a.width} / ${a.height}))` }}
        >
          <div className="show-frame__pic">
            <Figure
              asset={asset}
              ratio={`${a.width}/${a.height}`}
              priority={priority}
              rounded="rounded-none"
              sizes="100vw"
            />
          </div>
          <figcaption className="show-frame__cap">{caption}</figcaption>
        </figure>
      </Wipe>
    </Section>
  );
}
