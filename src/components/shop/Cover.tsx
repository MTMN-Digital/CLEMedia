import { Stage } from "@/components/render";
import type { Product } from "@/lib/types";
import { packFor, type Picture, coverFor } from "@/components/shop/samples";

/* ============================================================================
   One cover, lying flat on a surface.

   The artwork is the row's own `thumbnail` when the admin has uploaded one;
   otherwise the Cover-1 render for the episode the row names (samples.ts);
   otherwise nothing, and the caller decides what to say. It sits on a
   `Stage seated` with a flat pose, which supplies only the contact shadow at
   the foot: a print lying on a shelf, not a board leaning at an angle.
   ========================================================================== */

export function coverPicture(p: Product): Picture | { src: string; alt: string } | null {
  if (p.thumbnail) return { src: p.thumbnail, alt: p.thumbnail_alt?.trim() || `The cover of ${p.title}` };
  const pack = packFor(p);
  return pack ? coverFor(pack) : null;
}

export function Cover({
  product,
  sizes,
  priority = false,
  className = "",
}: {
  product: Product;
  /** The `sizes` attribute for the responsive cover. */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const pic = coverPicture(product);
  const loading = priority ? "eager" : "lazy";
  return (
    <Stage seated tilt={0} turn={0} roll={0} depth={0.35} radius="2px" className={className}>
      <span className="cat-cover">
        {pic && "webp" in pic ? (
          <picture>
            <source type="image/webp" srcSet={`${pic.webp} ${pic.width}w, ${pic.webp2x} ${pic.width * 2}w`} sizes={sizes} />
            <img
              src={pic.jpg}
              srcSet={`${pic.jpg} ${pic.width}w, ${pic.jpg2x} ${pic.width * 2}w`}
              sizes={sizes}
              width={pic.width}
              height={pic.height}
              alt={pic.alt}
              loading={loading}
              decoding="async"
            />
          </picture>
        ) : pic ? (
          <img src={pic.src} alt={pic.alt} loading={loading} decoding="async" />
        ) : null}
      </span>
    </Stage>
  );
}
