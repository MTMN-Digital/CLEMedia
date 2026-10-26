import { useId, useRef, useEffect } from "react";

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
  /** Which mark. `lockup` is the whole logo, `word` is the felted FAMILY
   *  MEDIA line on its own frame, the rest are the single glyphs. */
  mark?: "e" | "l" | "lockup" | "word" | "c";
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

/* `w` and `h` are the art's own pixels, so the <img> reserves the right box
   and nothing shifts while it loads. The letters are square frames with the
   object small inside them, which is what the hanging row's negative margins
   exist to undo. */
/* WEBP, NOT PNG, since 2026-10-26. The lockup shipped as a 325KB RGBA PNG
   with a 739KB 16-bit height map beside it, on every page that carries the
   footer: a megabyte of decorative felt. The colour art is WebP at q88 and
   the height map is LOSSLESS WebP at the art's own pixel size rather than
   twice it, which is 1,505KB of marks down to 109KB with the relief intact.
   The height map stays lossless on purpose: it is a surface, not a picture,
   and blocking artefacts in it read as dents in the wool. */
const ART: Record<string, { w: number; height: string; colour: string; h: number }> = {
  /* The whole logo. The four cut-outs are positioned on one shared 591px
     canvas, so compositing them reproduces the original lockup exactly:
     three animals on their ropes with the felted word under them. Built by
     hand once rather than reassembled in CSS, because the geometry is in the
     art and anything that re-derives it in a layout gets it slightly wrong. */
  lockup: { colour: "/brand/mark-lockup.webp", height: "/brand/depth/mark-lockup-height.webp", w: 589, h: 591 },
  word: { colour: "/brand/mark-word.webp", height: "/brand/depth/mark-word-height.webp", w: 591, h: 591 },
  c: { colour: "/brand/mark-c.webp", height: "/brand/depth/mark-c-height.webp", w: 591, h: 591 },
  l: { colour: "/brand/mark-l.webp", height: "/brand/depth/mark-l-height.webp", w: 591, h: 591 },
  e: { colour: "/brand/mark-e.webp", height: "/brand/depth/mark-e-height.webp", w: 591, h: 591 },
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

  /* The lamp starts off the left shoulder and ends off the right, passing
     overhead at the midpoint, which is when the mark is centred. A row of
     marks shares one lamp by shifting the sweep with each mark's position. */
  const shift = -phase * travel;

  /* NO FRAMER-MOTION, since 2026-10-26. This component was the library's
     only consumer in the whole site, for `useScroll` and two `useTransform`
     ramps, and it cost 56KB over the wire on every page. The same two ramps
     are twelve lines of rect arithmetic, read on a passive scroll listener,
     coalesced to one write per frame, and only while the mark is on screen.

     ponytail: one listener per mark on the page, which is at most six of
     them and they share the frame. A shared scroll broker if that ever
     stops being true. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /* The resting pose, which is what a crawler, a screenshot and a reader
       who asked for stillness all see. It has to be a good pose on its own. */
    for (const l of lights.current) {
      l?.setAttribute("x", String(0.26 + shift));
      l?.setAttribute("y", "-0.22");
    }
    if (still || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let seen = false;
    const write = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      /* The whole time the mark is on screen: entering at the bottom is 0,
         leaving at the top is 1, so the swing is paced to the mark's own
         travel rather than to the page's. */
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      const x = 0.5 - travel + shift + p * 2 * travel;
      const y = -0.5 + (1 - Math.abs(p * 2 - 1)) * 0.32;
      for (const l of lights.current) {
        l?.setAttribute("x", String(x));
        l?.setAttribute("y", String(y));
      }
    };
    const tick = () => {
      if (seen && !frame) frame = requestAnimationFrame(write);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      tick();
    });
    io.observe(el);
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [shift, travel]);

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

      <img className="rk-relief__art" src={art.colour} width={art.w} height={art.h} alt="" decoding="async" />
      <img
        className="rk-relief__lit"
        src={art.height}
        width={art.w}
        height={art.h}
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
