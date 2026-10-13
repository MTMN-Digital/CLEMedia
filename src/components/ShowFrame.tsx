import type { ReactNode } from "react";
import { Figure } from "@/components/Figure";
import { Container, Section } from "@/components/ui";
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
  bleed = false,
}: {
  asset: AssetKey;
  /** Always says it is a frame. See the note above. */
  caption: ReactNode;
  /** Set on the one frame a page leads with, and nowhere else. */
  priority?: boolean;
  /**
   * Edge to edge, square corners, caption in the column underneath.
   *
   * Only for a frame cut wide enough that full width is still a band and not a
   * screen: the bluebells is 2:1, so it is 720 tall on a 1440 window. A 4:3
   * frame must never take this, because at full width it would want more
   * height than the viewport has, which is the whole reason these stopped
   * being bands in the first place. Nothing is cropped here either; the
   * picture was cut to its shape once, on export.
   */
  bleed?: boolean;
}) {
  const a = ASSETS[asset];

  if (bleed) {
    return (
      <Section as="div" pad="tight">
        <Wipe>
          <figure>
            <Figure
              asset={asset}
              ratio={`${a.width}/${a.height}`}
              rounded="rounded-none"
              priority={priority}
              sizes="100vw"
            />
            {/* The caption comes back into the column, so it lines up with the
                body copy above and below rather than hanging off the screen
                edge. No scrim over the picture: that was a gradient. */}
            <Container width="wide">
              <figcaption className="mt-3.5 max-w-[68ch] font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-muted">
                {caption}
              </figcaption>
            </Container>
          </figure>
        </Wipe>
      </Section>
    );
  }

  return (
    <Section as="div" pad="tight">
      <Container width="wide">
        <Wipe>
          {/* The figure, not the image, carries the width, and it is the lesser
              of the column and whatever the height limit allows this shape.
              Stated as a width rather than as `max-height` on the image for one
              reason: `height: auto` never scales a picture ABOVE its own pixel
              size, so on a 1920 monitor the garden and the chicken stopped dead
              at 1200 and 1280, their 1x widths, leaving 120 pixels of room
              unused. This way the box is sized first and the 2x file fills it.

              Sizing the figure also keeps the caption under the picture's own
              left edge when a frame is narrower than the column. */}
          <figure
            className="mx-auto"
            style={{ width: `min(100%, calc(85vh * ${a.width} / ${a.height}))` }}
          >
            <Figure
              asset={asset}
              /* Only the placeholder reads this. A real image carries its own
                 width and height attributes, so the box is already the
                 picture's shape and nothing crops. */
              ratio={`${a.width}/${a.height}`}
              priority={priority}
              sizes="(min-width: 1024px) 1376px, 100vw"
            />
            <figcaption className="mt-3.5 max-w-[68ch] font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-muted">
              {caption}
            </figcaption>
          </figure>
        </Wipe>
      </Container>
    </Section>
  );
}
