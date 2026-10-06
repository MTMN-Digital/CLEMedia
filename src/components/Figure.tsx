import { ASSETS, type AssetKey } from "@/lib/brand";
import { AssetPlaceholder } from "@/components/AssetPlaceholder";

interface Props {
  asset: AssetKey;
  className?: string;
  rounded?: string;
  tone?: "clay" | "cream";
  /** Override the ratio used by the placeholder. Real images use their own. */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  /** Stretch to the host column and crop, for a full-bleed band. */
  fill?: boolean;
  /** Where the crop favours, for a band that must keep its subject. */
  position?: string;
}

/**
 * Renders a real brand image when one has been supplied, and a labelled
 * placeholder when it has not.
 *
 * Serving order is AVIF, then WebP, then the original. Width and height are
 * always set so nothing shifts as images load, and everything below the fold
 * is lazy.
 */
export function Figure({
  asset,
  className = "",
  rounded = "rounded-[var(--radius-lg)]",
  tone = "clay",
  ratio,
  priority = false,
  fill = false,
  position,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: Props) {
  const a = ASSETS[asset];


  if (!a.base) {
    return (
      <AssetPlaceholder
        label={a.label}
        source="Photography"
        ratio={fill ? undefined : (ratio ?? `${a.width}/${a.height}`)}
        tone={tone}
        rounded={rounded}
        className={`${fill ? "h-full w-full" : ""} ${className}`}
      />
    );
  }

  const ext = a.fallback ?? "jpg";
  return (
    <picture className={fill ? "block h-full w-full" : undefined}>
      {!a.noAvif && (
        <source
          type="image/avif"
          srcSet={`${a.base}.avif 1x, ${a.base}@2x.avif 2x`}
          sizes={sizes}
        />
      )}
      <source
        type="image/webp"
        srcSet={`${a.base}.webp 1x, ${a.base}@2x.webp 2x`}
        sizes={sizes}
      />
      <img
        src={`${a.base}.${ext}`}
        srcSet={`${a.base}.${ext} 1x, ${a.base}@2x.${ext} 2x`}
        sizes={sizes}
        alt={a.alt}
        width={a.width}
        height={a.height}
        /* Eager, even for images far down the page, and the reason is not
           laziness about performance.

           This site drives its scroll with Lenis, and under it the browser's
           own "is this nearly on screen" heuristic does not reliably fire:
           measured on the home page, wheel-scrolling the whole document left
           images with an empty currentSrc that never resolved, while the same
           page with prefers-reduced-motion, which switches Lenis off, loaded
           every one. A reader on a laptop simply saw a gap where a photograph
           should be. An IntersectionObserver that flipped the attribute was
           tried first and did not catch every case either.

           A broken image is a worse bug than a few hundred kilobytes, so the
           attribute goes and the priority hint does the work instead: the one
           image a page actually leads with is high, everything else is low,
           and the browser queues them behind the things that matter. */
        loading="eager"
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "low"}
        style={position ? { objectPosition: position } : undefined}
        className={`${fill ? "h-full w-full" : "h-auto w-full"} object-cover ${rounded} ${className}`}
      />
    </picture>
  );
}
