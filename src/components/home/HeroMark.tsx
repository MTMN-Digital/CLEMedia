/* ============================================================================
   The mark, as five objects rather than one picture.

   WHY. Rotating a flat PNG in 3D does not make it three dimensional, it makes
   it a sheet of paper turning: every part of the artwork keeps exactly the
   same relationship to every other part, so the eye reads a bent image instead
   of a thing with depth. The first build of this hero did that, and it looked
   like what it was.

   WHAT THIS IS INSTEAD. The artwork is cut into the five objects it actually
   contains, each kept exactly as drawn, and each hung at a different distance
   from the wall. Turning the group now moves them past each other: the lion
   crosses in front of the caterpillar, the wordmark swings further than the
   letters above it, the strings lag behind. That is parallax, and parallax is
   what the eye reads as depth. Nothing is redrawn, re-rendered or invented:
   stacked flat, the five layers are pixel for pixel the original mark.

   HOW THE CUT WAS MADE. The letters touch, so a straight slice would run
   through the lion's mane. Each cut is a seam: the lowest-cost vertical path
   through the artwork's own alpha, free to wander, so it follows the gap
   between two felted objects. The layers are feathered by a few pixels and
   overlap, so no cut edge is ever exposed when they separate.

   DEPTHS. Each letter keeps its own string, because a string and the object it
   holds are one object: the first cut put all three strings on a layer of
   their own, and as soon as the group turned they slid off the letters they
   were supposed to be holding. The wordmark sits furthest forward because in
   the original it crosses in front of the letters' feet.
   ========================================================================== */

interface Layer {
  /** File stem under /brand. */
  name: string;
  /** Distance from the wall, in px of the stage's own perspective space. */
  z: number;
  alt: string;
}

/* Only one layer carries the alt text: to a reader not looking at the screen
   this is one logo, not five pictures. The rest are decorative by definition,
   because they are fragments of it. */
const LAYERS: Layer[] = [
  { name: "mark-c", z: 0, alt: "" },
  { name: "mark-e", z: 10, alt: "" },
  { name: "mark-l", z: 26, alt: "" },
  { name: "mark-word", z: 48, alt: "CLÉ Family Media, the letters formed from needle-felted animals" },
];

export function HeroMark({ sizes = "(min-width: 1280px) 680px, 46vw" }: { sizes?: string }) {
  return (
    <div className="hero-layers">
      {LAYERS.map((l) => (
        <picture key={l.name} className="hero-layer" style={{ "--z": `${l.z}px` } as React.CSSProperties}>
          <source type="image/webp" srcSet={`/brand/${l.name}.webp 1x, /brand/${l.name}@2x.webp 2x`} sizes={sizes} />
          <img
            src={`/brand/${l.name}.png`}
            srcSet={`/brand/${l.name}.png 1x, /brand/${l.name}@2x.png 2x`}
            sizes={sizes}
            alt={l.alt}
            width={591}
            height={592}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      ))}
    </div>
  );
}
