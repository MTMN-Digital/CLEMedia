import { useEffect, useRef } from "react";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero: a multiplane.

   THE SHAPE OF IT. The reader lands on the mark hanging in a room, seen from
   low down with the garden close to the lens. The first scroll holds the page
   and pushes in: the planes scale and rise at different rates, which is a
   camera move, the mark grows and tilts on its strings, and the headline, the
   lead and the buttons arrive to the right of centre. Then it settles and the
   page carries on.

   WHY A MULTIPLANE AND NOT A RENDERER. This hero was a live WebGL scene for
   several days. It was rejected repeatedly and the last version was laggy,
   which is what settled it: fifteen hundred alpha-tested instances and a
   shadow map on a full-viewport canvas is not something to put in front of a
   parent on a phone. So the room is a photograph, rendered once in Cycles,
   and cut into depth planes. Scaling three images at different rates is the
   oldest trick in animation and the browser does it on the compositor: no
   renderer runs, nothing is uploaded per frame, and the quality ceiling is a
   path tracer rather than sixteen milliseconds.

   WHAT EACH PLANE DOES. The room barely moves because it is a room. The bed
   moves more, and it is scaled about the line where its board meets the paper,
   so it grows out of the floor rather than sliding across it. That difference
   in rate IS the depth; one rate would be a zoom.

   THE MARK stays in the DOM rather than being baked into the plate: it is the
   brand asset, it has to be crisp at any pixel ratio, it carries the alt
   text, and it is the one thing that tilts.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 1.0;
/** Where the move has finished, as a fraction of the hold.
 *
 *  Everything used to arrive exactly as the pin let go, so the push in stopped
 *  and the page started scrolling in the same frame: the handover read as a
 *  lurch. Finishing at 0.85 leaves a short stretch at the end where the frame
 *  is simply settled and still, and the page then carries it away. */
const SETTLE_AT = 0.85;
/** Where in the move the words start arriving, and where they have landed. */
const WORDS_IN = 0.45;
const WORDS_SET = 0.9;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** Smootherstep: zero velocity at both ends, so the move neither jumps off
    the first frame nor stops dead against the end of the hold. */
function ease(p: number) {
  const t = clamp01(p);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function HeroShot() {
  const pin = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = pin.current;
    const inner = screen.current;
    if (!host || !inner) return;

    const measureHeader = () => {
      const header = document.querySelector("header");
      host.style.setProperty("--header-h", `${header ? Math.round(header.getBoundingClientRect().height) : 0}px`);
    };

    let frame = 0;
    const read = () => {
      frame = 0;
      const span = host.offsetHeight - inner.offsetHeight;
      /* No travel means the hero is not pinned: the phone layout and the
         reduced-motion layout both collapse the pin to the height of one
         screen. In that case the correct state is the SETTLED one, not the
         opening one. Reading 0 here wrote `--p: 0` and `--w: 0` as inline
         styles, which beat the stylesheet rules that set them to 1, and the
         headline, the lead and both buttons rendered at opacity 0: laid out at
         the right coordinates, and invisible. */
      const raw = span > 0 ? clamp01((window.scrollY - host.offsetTop) / span) : 1;
      const p = ease(raw);
      inner.style.setProperty("--p", p.toFixed(4));
      /* The set's own progress, which reaches 1 before the pin releases. */
      inner.style.setProperty("--s", clamp01(p / SETTLE_AT).toFixed(4));
      inner.style.setProperty("--w", clamp01((p - WORDS_IN) / (WORDS_SET - WORDS_IN)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onResize = () => {
      measureHeader();
      onScroll();
    };

    measureHeader();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={pin} className="shot-pin" style={{ height: `calc(100svh + ${TRAVEL * 100}svh)` }}>
      <div ref={screen} className="shot-screen">
        {/* Two planes, not three. `back` is opaque and carries the room, the
            paper and everything standing on it; `mid` is the bed, cut out of
            the same photograph with alpha, and it is the only thing that moves
            against the room. A third plane held the spill on the floor and had
            to go: litter resting on a floor that travels at a different rate
            slides off its own shadow. */}
        <div aria-hidden="true" className="plane plane-back" />
        <div aria-hidden="true" className="plane plane-mid" />

        <div className="shot-mark">
          <HeroMark sizes="(min-width: 1280px) 760px, 76vw" />
        </div>

        <div className="shot-copy">
          <h1 className="hero-head">
            <span aria-hidden="true" className="hero-head-shadow">
              Watch. Play. Learn.
            </span>
            <span className="hero-head-face">
              Watch. <span className="hero-head-2">Play.</span> Learn.
            </span>
          </h1>
          <p className="t-lead hero-lead mt-4 max-w-[42ch]">
            Calm stories for young children, and the activities that take them off the screen
            afterwards.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
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

        <span aria-hidden="true" className="shot-cue">
          <span className="hero-cue-rule" />
          Scroll
        </span>
      </div>
    </div>
  );
}
