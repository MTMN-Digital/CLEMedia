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
   the whole image, smaller. It sits in the standard column, which is 960
   pixels of content at desktop, so the squarest of them is 720 tall and the
   two 2:1 series frames are 480. Nothing is cropped at any width on any
   screen, because the box is the picture's own shape and there is nothing for
   `object-cover` to do.

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

  return (
    <Section as="div" pad="tight">
      <Container>
        <Wipe>
          <figure>
            <Figure
              asset={asset}
              /* Only the placeholder reads this. A real image carries its own
                 width and height attributes, so the box is already the
                 picture's shape and nothing crops. */
              ratio={`${a.width}/${a.height}`}
              priority={priority}
              sizes="(min-width: 1024px) 960px, 100vw"
            />
            <figcaption className="mt-3.5 font-mono text-[12px] leading-[1.65] tracking-[0.02em] text-muted">
              {caption}
            </figcaption>
          </figure>
        </Wipe>
      </Container>
    </Section>
  );
}
