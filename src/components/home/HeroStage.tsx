import { useCallback, useEffect, useRef } from "react";
import { HeroMark3D } from "@/components/home/HeroMark3D";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero, held.

   The mark is a felted object hanging on strings. Everywhere else on this site
   it behaves like an image. Here it behaves like a thing in a room: the page
   holds still while the reader's first scroll turns it, so the right edge goes
   away from them and the left comes forward, the shadow swings with it, and
   the light moves across its face. Then the hold releases and the page carries
   on as normal.

   THREE BEATS, across the pinned range:

   ONE MOVE, across 0.8 of a screen: the object turns on its strings, right
   edge going away from the reader, and travels left across the type. The words
   do not move. They are in front of it the whole way, so the mark passing
   behind them is the only thing that changes.

   WHY IT IS DONE IN JS AND NOT IN CSS. Scroll-driven animation timelines are
   not available everywhere this has to run, Lenis owns the scroll position
   anyway, and the whole thing is four numbers written to CSS custom properties
   once a frame. The transforms themselves are pure CSS, so if JS never runs,
   the element keeps the resting values written in the markup.

   WHY THE PIN IS SAFE HERE. Scroll hijacking is usually a sin: the page stops
   obeying the reader. This does not take the scroll away, it spends it. The
   bar is one screen of travel, the content under it is not hidden behind the
   animation, and `prefers-reduced-motion` drops the whole mechanism and renders
   a plain, finished hero with no hold at all.

   THE WEBGL PATH. On a wide screen with WebGL and no reduced-motion
   preference, HeroMark3D fades a canvas in over the layered mark in which
   the same four objects are relief surfaces under a real lamp, so the turn
   relights them (see hero3d/). It takes the same eased --turn through
   `subscribe`, and reports `onLive` so this stage can hand the rotation over
   to the canvas: the `.is-3d` class on the stage drops the CSS rotateY, the
   fake sheen and the flat layers' shadows. Everything else, the walk left,
   the words, the garden, the cue, is untouched by which path is drawing.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen.

    0.8, down from 1.6. The hold was spending nearly two screens of the
    reader's scroll on one move, which reads as the page refusing to go rather
    than as an animation. */
const TRAVEL = 0.8;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** One continuous ease across the whole hold.

    The first build split the timeline into beats, so nothing moved at all for
    the first third and then everything started at once. From a reader's seat
    that is a dead zone followed by a lurch. There is one move now, it begins
    on the first pixel of scroll, and it eases the whole way. */
function ease(p: number) {
  const t = clamp01(p);
  /* Smootherstep: zero velocity at both ends, so it neither jumps off the mark
     nor stops dead at the end of the hold. */
  return t * t * t * (t * (t * 6 - 15) + 10);
}

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
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const host = section.current;
    const el = stage.current;
    if (!host || !el) return;

    /* The header is sticky but still takes its height out of the flow, so a
       stage of exactly one viewport runs that far past the bottom of the
       screen and takes the scroll cue with it. Measure it rather than hard
       coding 74px, because the header grows when the nav wraps. */
    const header = document.querySelector("header");
    const setHeaderHeight = () => {
      el.style.setProperty("--header-h", `${header?.offsetHeight ?? 0}px`);
    };
    setHeaderHeight();

    let frame = 0;
    const apply = () => {
      frame = 0;
      const r = host.getBoundingClientRect();
      /* The pinned range is everything above the point where the sticky child
         stops sticking, which is the section's height minus one screen. */
      const span = Math.max(1, host.offsetHeight - window.innerHeight);
      const p = clamp01(-r.top / span);

      const turn = ease(p);
      const rise = turn;

      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--turn", turn.toFixed(4));
      el.style.setProperty("--rise", rise.toFixed(4));

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
        {/* The room. A soft key from the upper left, and a floor the object can
            throw a shadow onto, both drawn rather than photographed. */}
        <span aria-hidden="true" className="hero-key" />
        <span aria-hidden="true" className="hero-floor" />

        <div className="hero-inner">
          <div className="hero-object">
            {/* The cast shadow is a separate element because a drop-shadow
                filter follows the object's alpha exactly, and a shadow thrown
                onto a wall several feet behind it does not keep its shape. */}
            <span aria-hidden="true" className="hero-cast" />
            <div className="hero-mark">
              <HeroMark3D subscribe={subscribe} onLive={onLive} />
              {/* The light moving across the face as it turns, for the CSS
                  path only; the canvas lights the wool itself. */}
              <span aria-hidden="true" className="hero-sheen" />
            </div>
          </div>

          {/* The headline sits BEHIND the mark, not beside it.

              The canvas has an alpha channel, so the wool occludes the words
              per pixel: at rest the lion stands over "Play." and as the group
              turns and walks left it uncovers it. That is the hero being one
              object rather than a picture next to a paragraph, and it costs
              nothing, because the occlusion is just the alpha that was always
              there. The reading order in the DOM is still headline first. */}
          <div className="hero-words">
            <h1 className="hero-head">
              <span>Watch.</span>
              <span className="hero-head-2">Play.</span>
              <span>Learn.</span>
            </h1>
            <p className="t-lead mt-7 max-w-[32ch] text-body">
              Calm stories for young children, and the activities that take them off the screen
              afterwards.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
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

        <span aria-hidden="true" className="hero-cue">
          <span className="hero-cue-rule" />
          Scroll
        </span>
      </div>
    </div>
  );
}
