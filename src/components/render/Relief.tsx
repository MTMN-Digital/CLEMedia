import { useEffect, useId, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

/* ============================================================================
   Relief: the felted mark, lit by a lamp that moves.

   WHY THIS EXISTS. `scripts/make-depth-maps.py` generated a 16 bit height map
   and an OpenGL normal map for every mark in the wordmark, and said in its own
   header that the strength knob is there to make the surface "react more
   strongly to a moving light". Nothing ever read them. The marks shipped as
   flat PNGs, which is a photograph of felt rather than felt.

   HOW IT WORKS, and why there is no WebGL here. An SVG lighting filter builds
   its surface from the ALPHA of its input, so the height map's grey is moved
   into alpha by a colour matrix and `feDiffuseLighting` then shades it from a
   point light we can move. `feSpecularLighting` adds the sheen that tells you
   wool is wool. The lit pass is masked to the mark's own alpha and blended
   back over the colour art, so the result is the real artwork with real
   relief, not an approximation of it.

   THE LAMP IS THE PAGE'S LAMP. Its default position matches `Stage`'s default
   azimuth, so a mark lit by this and a board standing on a Stage are lit from
   the same place in the same room. Moving it is what gives the surface life:
   as the section travels up the viewport the lamp swings across, and the wool
   catches it.

   NO REACT STATE PER FRAME. The scroll position is a motion value and the
   light's x and y are written straight onto the SVG elements, so the lamp
   moves without the component rendering again.
   ========================================================================== */

export interface ReliefProps {
  /** Which mark. `word` is the full lockup, the letters are the single glyphs. */
  mark?: "word" | "c" | "l" | "e";
  /** Intended rendered size in px. A ceiling, not a floor. */
  size?: number;
  /** Take the width of whatever is laying this out instead of `size`. */
  fluid?: boolean;
  /** How far the lamp swings as the mark crosses the viewport, 0 to 1 of width. */
  travel?: number;
  /** Relief strength. The felt is shallow: 2 to 5 reads, past 8 it is plastic. */
  depth?: number;
  /** Lamp colour. Defaults to the warm paper light the rest of the room uses. */
  lamp?: string;
  /**
   * Where this mark sits under a SHARED lamp, -1 at the left of the row to 1
   * at the right. A row of marks each lit by its own identical sweep reads as
   * a row of separate lights; shifting the sweep by position makes one lamp
   * cross them in turn, which is the whole difference between a group of
   * objects and a shelf of them.
   */
  phase?: number;
  className?: string;
  /** Decorative by default. Give it a label when the mark IS the content. */
  alt?: string;
}

const ART: Record<string, { colour: string; height: string }> = {
  word: { colour: "/brand/mark-word.png", height: "/brand/depth/mark-word-height.png" },
  c: { colour: "/brand/mark-c.png", height: "/brand/depth/mark-c-height.png" },
  l: { colour: "/brand/mark-l.png", height: "/brand/depth/mark-l-height.png" },
  e: { colour: "/brand/mark-e.png", height: "/brand/depth/mark-e-height.png" },
};

export function Relief({
  mark = "word",
  size = 320,
  fluid = false,
  travel = 0.55,
  depth = 3.4,
  lamp = "#fff6e4",
  phase = 0,
  className = "",
  alt = "",
}: ReliefProps) {
  const art = ART[mark] ?? ART.word;
  const uid = useId().replace(/:/g, "");
  const host = useRef<HTMLDivElement>(null);
  const lights = useRef<SVGFEPointLightElement[]>([]);
  const still = useReducedMotion();

  /* `offset: ["start end", "end start"]` is the whole time the mark is on
     screen, so the swing is paced to the mark's own travel rather than to the
     page's. */
  const { scrollYProgress } = useScroll({ target: host, offset: ["start end", "end start"] });

  /* The lamp starts off the left shoulder and ends off the right, passing
     overhead at the midpoint, which is when the mark is centred. */
  const shift = -phase * travel;
  const lx = useTransform(scrollYProgress, [0, 1], [0.5 - travel + shift, 0.5 + travel + shift]);
  const ly = useTransform(scrollYProgress, [0, 0.5, 1], [-0.5, -0.18, -0.5]);

  useMotionValueEvent(lx, "change", (v) => {
    if (still) return;
    for (const l of lights.current) l?.setAttribute("x", String(v));
  });
  useMotionValueEvent(ly, "change", (v) => {
    if (still) return;
    for (const l of lights.current) l?.setAttribute("y", String(v));
  });

  /* The resting pose, which is what a crawler, a screenshot and a reader who
     asked for stillness all see. It has to be a good pose on its own. */
  useEffect(() => {
    for (const l of lights.current) {
      l?.setAttribute("x", String(0.26 + shift));
      l?.setAttribute("y", "-0.22");
    }
  }, [shift]);

  const z = 0.62;

  return (
    <div
      ref={host}
      className={`rk-relief ${className}`}
      /* `size` is the intended size, not a floor: the art shrinks with the
         column on a phone and the lighting follows it. `fluid` hands the width
         to the layout entirely, which is how a row of marks shares a column. */
      style={fluid ? undefined : { width: size, maxWidth: "100%" }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="rk-relief__defs">
        <filter
          id={`relief-${uid}`}
          x="0"
          y="0"
          width="100%"
          height="100%"
          /* Fractions of the box, not pixels. With pixel coordinates the lamp
             was tied to one rendered size, so the art could not be allowed to
             shrink on a phone without the light sliding off it. */
          primitiveUnits="objectBoundingBox"
        >
          {/* Grey into alpha: a lighting filter reads its surface from alpha. */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"
            result="bump"
          />
          <feDiffuseLighting
            in="bump"
            surfaceScale={depth}
            diffuseConstant="1.05"
            lightingColor={lamp}
            result="diffuse"
          >
            <fePointLight
              ref={(el) => {
                if (el) lights.current[0] = el;
              }}
              z={z}
            />
          </feDiffuseLighting>
          <feSpecularLighting
            in="bump"
            surfaceScale={depth}
            specularConstant="0.5"
            specularExponent="24"
            lightingColor="#ffffff"
            result="spec"
          >
            <fePointLight
              ref={(el) => {
                if (el) lights.current[1] = el;
              }}
              z={z}
            />
          </feSpecularLighting>
          <feComposite in="spec" in2="diffuse" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </svg>

      <img className="rk-relief__art" src={art.colour} width={size} height={size} alt="" decoding="async" />
      <img
        className="rk-relief__lit"
        src={art.height}
        width={size}
        height={size}
        alt=""
        decoding="async"
        style={{
          filter: `url(#relief-${uid})`,
          maskImage: `url(${art.colour})`,
          WebkitMaskImage: `url(${art.colour})`,
        }}
      />
    </div>
  );
}
