import { LOGOS } from "@/lib/brand";

/* The PupsPlayer mark is a flat single-colour SVG filled with currentColor, so
   it is applied as a mask over the current text colour rather than loaded as
   an image, which would render it black. The brand blue is 1.3:1 on paper and
   is never used as a fill for the mark on this site; navy is the agreed
   stand-in, and it is the same navy as the device's top bar, so the sheet and
   the product read as one document.

   Lifted out of the walkthrough on 2026-10-28 so the page's title block and
   the device's top bar draw the one mark. */
export function PupsMark({ className = "" }: { className?: string }) {
  if (!LOGOS.pupsPlayer) return null;
  const url = `url(${LOGOS.pupsPlayer})`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
