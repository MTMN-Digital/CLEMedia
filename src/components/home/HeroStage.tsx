import { useEffect, useRef } from "react";
import { Figure } from "@/components/Figure";
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

     0.00 - 0.34  the object, square on, centred, held at rest
     0.34 - 0.72  it turns on its strings and walks left; its shadow lengthens
                  and softens as it goes; the headline arrives in the space it
                  vacates
     0.72 - 1.00  the garden rises behind it and the scroll cue retires

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
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 1.6;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** Progress within a sub-range of the overall timeline, eased. */
function beat(p: number, from: number, to: number) {
  const t = clamp01((p - from) / (to - from));
  /* The house curve: fast out of the gate, settling, never overshooting. */
  return 1 - Math.pow(1 - t, 3);
}

export function HeroStage() {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

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

      const turn = beat(p, 0.34, 0.72);
      const rise = beat(p, 0.72, 1);

      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--turn", turn.toFixed(4));
      el.style.setProperty("--rise", rise.toFixed(4));
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
              <Figure
                asset="brand.cle"
                priority
                rounded="rounded-none"
                sizes="(min-width: 1280px) 680px, 46vw"
              />
              {/* The light moving across the face as it turns. */}
              <span aria-hidden="true" className="hero-sheen" />
            </div>
          </div>

          <div className="hero-words">
            <h1 className="t-display max-w-[14ch]">Children's media made by people</h1>
            <p className="t-lead mt-6 max-w-[42ch] text-body">
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
