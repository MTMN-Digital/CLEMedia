import { useCallback, useEffect, useRef } from "react";
import { HeroMark3D } from "@/components/home/HeroMark3D";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero, as a photographed set.

   The mark is four felted objects hanging on strings. On every other page of
   this site it behaves like an image. Here it hangs in a room: a paper sweep
   behind it, a lamp up and to the left, a floor under it, the garden's leaves
   between the lamp and the paper and between the camera and the objects. The
   page holds still while the reader's first scroll pans the camera a little,
   so the objects turn on their strings and everything in the room slides at
   its own rate. Then the hold releases and the page carries on.

   WHAT MAKES IT A ROOM RATHER THAN A BACKDROP. Four things, each a separate
   layer of the markup below:

   1. Tonal range. The sweep runs from a lit pool of paper to a corner three
      stops deeper than anything else on the page. A single band of cream is
      a web page background; a lamp with a falloff is a set.
   2. A floor. The sweep curves into a floor at about the objects' feet, the
      objects throw a flattened shadow across it, and the headline stands on
      it and throws its own. Nothing here floats.
   3. A foreground. Blurred leaves cross the near corners of the frame, nearer
      the camera than the objects, and they pan the furthest when the camera
      moves. Every photograph of a set has something in front of the subject.
   4. Three rates of pan. The sweep moves a little, the objects more, the
      leaves most. One rate is a slide; three rates are depth.

   The garden is in the set as light and as foliage: leaf shadow dappling the
   paper (a gobo, light through foliage), and the real leaves in the near
   corners. Not as a photograph behind the sweep, which would put a second
   picture behind the first.

   WHY IT IS DONE IN JS AND NOT IN CSS. Scroll-driven animation timelines are
   not available everywhere this has to run, Lenis owns the scroll position
   anyway, and the whole thing is two numbers written to custom properties
   once a frame. The transforms are pure CSS, so if JS never runs the markup's
   resting values are what render.

   THE WEBGL PATH. On a wide screen with WebGL and no reduced-motion
   preference, HeroMark3D fades a canvas in over the layered mark in which the
   same four objects are relief surfaces under a real lamp, so the turn
   relights them (see hero3d/). It takes the eased --turn through `subscribe`
   and reports `onLive`, and the `.is-3d` class hands the rotation over to the
   canvas. The set, the shadows, the leaves and the words do not care which
   path is drawing the objects.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 0.8;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** Smootherstep: zero velocity at both ends, so the camera neither jumps off
    the mark nor stops dead at the end of the hold. */
function ease(p: number) {
  const t = clamp01(p);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/* A leaf, drawn once and placed by <use>. The shape is deliberately plain: at
   the blur these are seen through, a midrib or a serration would be invisible
   anyway, and a plain leaf reads as a leaf where a detailed one reads as a
   clip-art leaf. Tip at the origin, stem to the right. */
const LEAF = "M0 0Q44-24 100 0Q44 24 0 0ZM100 0l26 4";

/** A spray of leaves. `places` is [x, y, rotation, scale] in a box 1000 wide
    and `depth` tall, fitted inside the layer it sits in (so on a phone the
    leaves scale down with the frame rather than covering it) and pinned to
    `edge`. */
function Leaves({
  className,
  places,
  edge,
  depth,
}: {
  className: string;
  places: [number, number, number, number][];
  edge: "top" | "bottom";
  depth: number;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 1000 ${depth}`}
      preserveAspectRatio={edge === "top" ? "xMidYMin meet" : "xMidYMax meet"}
      aria-hidden="true"
    >
      {places.map(([x, y, r, s], i) => (
        <path key={i} d={LEAF} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
      ))}
    </svg>
  );
}

/* The foliage between the lamp and the paper: its shadow falls across the top
   of the sweep, soft, as dappled light does. Kept out of the pool the objects
   hang in, so the lit paper behind them stays clean. */
const GOBO: [number, number, number, number][] = [
  [-30, 30, 22, 2.4],
  [90, 110, -16, 2.1],
  [170, -20, 48, 2.3],
  [60, 230, 8, 1.8],
  [300, 60, 70, 1.7],
  [250, 190, -30, 1.6],
  [640, -30, 24, 2.2],
  [760, 70, -20, 2.0],
  [880, 160, 36, 2.3],
  [960, 10, 62, 2.0],
  [1000, 290, -8, 2.1],
  [820, 300, 14, 1.6],
];
/* The foliage between the camera and the objects: a few leaves in the two
   lower corners, nearest the lens and out of focus, fanning in from off
   frame. In a box 1000 by 300 that sits across the bottom of the frame, so
   the centre is clear and nothing ever crosses the objects or the words. */
const NEAR: [number, number, number, number][] = [
  [-30, 320, -30, 3.0],
  [40, 370, -54, 2.6],
  [-70, 260, -12, 2.2],
  [1030, 330, 210, 2.8],
  [980, 380, 236, 2.4],
  [1070, 260, 194, 2.0],
];

export function HeroStage() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  /* The eased turn, for the WebGL mark. One listener, no state: the value
     changes every scrolled frame and must never re-render the hero. */
  const turnListener = useRef<((turn: number) => void) | null>(null);
  const lastTurn = useRef(0);
  const subscribe = useCallback((fn: (turn: number) => void) => {
    turnListener.current = fn;
    fn(lastTurn.current);
    return () => {
      if (turnListener.current === fn) turnListener.current = null;
    };
  }, []);
  const onLive = useCallback((live: boolean) => {
    stage.current?.classList.toggle("is-3d", live);
  }, []);

  useEffect(() => {
    const host = section.current;
    const el = stage.current;
    if (!host || !el) return;

    /* The header is sticky but still takes its height out of the flow, so a
       stage of exactly one viewport runs that far past the bottom of the
       screen. Measured rather than hard coded: the header grows when the nav
       wraps. Measured under reduced motion too: the still frame is still one
       screen tall. */
    const header = document.querySelector("header");
    const setHeaderHeight = () => {
      el.style.setProperty("--header-h", `${header?.offsetHeight ?? 0}px`);
    };
    setHeaderHeight();
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      /* The pinned range is everything above the point where the sticky child
         stops sticking, which is the section's height minus one screen. */
      const span = Math.max(1, host.offsetHeight - window.innerHeight);
      const p = clamp01(-r.top / span);
      const turn = ease(p);

      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--turn", turn.toFixed(4));

      lastTurn.current = turn;
      turnListener.current?.(turn);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onResize = () => {
      setHeaderHeight();
      onScroll();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={section} className="hero-pin" style={{ height: `calc(100vh + ${TRAVEL * 100}vh)` }}>
      <div ref={stage} className="hero-stage">
        {/* The set. Furthest from the camera, so it pans the least. */}
        <div aria-hidden="true" className="hero-set">
          <span className="hero-set-wall" />
          <Leaves className="hero-set-gobo" places={GOBO} edge="top" depth={600} />
          <span className="hero-set-floor" />
          <span className="hero-set-beam" />
          <span className="hero-set-haze" />
        </div>

        <div className="hero-inner">
          {/* The objects and what they throw. The two shadows are the mark's
              own alpha flattened to black: one down the wall behind, away
              from the lamp, and one laid flat across the floor beneath. They
              live inside the figure so they travel with it at every size. */}
          <div className="hero-figure">
            <div aria-hidden="true" className="hero-shadow hero-shadow-wall">
              <HeroMark shadow />
            </div>
            <div aria-hidden="true" className="hero-shadow hero-shadow-floor">
              <HeroMark shadow />
            </div>
            <div className="hero-object">
              <div className="hero-mark">
                <HeroMark3D subscribe={subscribe} onLive={onLive} />
                {/* The light moving across the face as it turns, for the CSS
                    path only; the canvas lights the wool itself. */}
                <span aria-hidden="true" className="hero-sheen" />
              </div>
            </div>
          </div>

          {/* The words stand on the floor in front of the objects, under the
              same lamp, so the headline throws a shadow the same way the
              objects do. They do not pan: they are the one thing on the
              screen the reader is reading. */}
          <div className="hero-words">
            <h1 className="hero-head">
              <span aria-hidden="true" className="hero-head-shadow">
                Watch. Play. Learn.
              </span>
              <span className="hero-head-face">
                Watch. <span className="hero-head-2">Play.</span> Learn.
              </span>
            </h1>
            <p className="t-lead hero-lead mx-auto mt-6 max-w-[46ch]">
              Calm stories for young children, and the activities that take them off the screen
              afterwards.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button to="/ethical-ai">
                How we make it
                <IconArrow size={16} />
              </Button>
              <Button href={SITE.showUrl} variant="quiet">
                Visit the show
                <IconExternal size={15} />
              </Button>
            </div>
          </div>
        </div>

        {/* Nearest the camera, out of focus, and it pans the most. */}
        <div aria-hidden="true" className="hero-near">
          <Leaves className="hero-near-leaves" places={NEAR} edge="bottom" depth={300} />
        </div>

        <span aria-hidden="true" className="hero-cue">
          <span className="hero-cue-rule" />
          Scroll
        </span>
      </div>
    </div>
  );
}
