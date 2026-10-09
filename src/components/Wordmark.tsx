import { Relief } from "@/components/render";

/**
 * The CLÉ Family Media lockup. Their actual logo.
 *
 * WHAT THIS REPLACED, 2026-10-09. A typographic stand-in: the name in
 * Calistoga beside "F A M I L Y   M E D I A" tracked out to 0.3em, written
 * when the brand audit concluded that the kit holds no vector mark. The audit
 * was right about the vector and wrong about the consequence. The company has
 * a logo and everyone involved knows exactly what it looks like: three
 * needle-felted animals on ropes spelling CLÉ, with FAMILY MEDIA felted
 * underneath. Setting their name in a different typeface and spacing the
 * second line out until it filled the width is not a stand-in for that, it is
 * a different company's logo. The client's word for it was "awful".
 *
 * The art for it was in `public/brand/` the whole time, in four pieces cut
 * free of the background: mark-c, mark-l, mark-e and mark-word. All four sit
 * on one shared 591px canvas, so they composite straight back into the
 * original lockup; `public/brand/mark-lockup.png` and its height map are that
 * composite, built once by hand. `Relief` then lights it off the 16 bit
 * height map with the same lamp every other object on this site stands under,
 * so the wool reads as wool on the navy rather than as a pasted cut-out.
 *
 * Still a stand-in for ONE thing: a favicon and any use under about 110px,
 * where three animals on ropes stop being legible. That needs the vector, and
 * it is QUESTIONS.md #21.
 */

export function Wordmark({
  className = "",
  /** Width of the lockup. Under ~110px the animals stop reading. */
  size = 168,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Relief
      mark="lockup"
      size={size}
      depth={2.6}
      travel={0.4}
      className={className}
      alt="CLÉ Family Media"
    />
  );
}
