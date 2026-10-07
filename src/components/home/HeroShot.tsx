import { useEffect, useRef } from "react";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero: a set, in two planes.

   THE SHAPE OF IT. The reader lands on a small raised garden standing on a
   painted cyc in a dark studio, photographed from a high tripod tilted down at
   it, with the felted mark hanging over the garden from above the frame. The
   first scroll holds the page: the set tilts down onto the garden and pushes
   in, the garden growing faster than the room because it is nearer, while the
   mark settles on its ropes and the headline, the lead and the buttons slide
   in beside it on the lit floor. Then it is still, and the page carries on.

   WHY A PHOTOGRAPH AND NOT A RENDERER. This hero was a live WebGL scene for
   several days. It was rejected repeatedly and the last version was laggy,
   which is what settled it: a thousand alpha-tested plants and a shadow map on
   a full-viewport canvas is not something to put in front of a parent on a
   phone. So the set is rendered once in Cycles and cut into two depth planes,
   and scaling two images at different rates is done by the compositor: no
   renderer runs, nothing is uploaded per frame, and the quality ceiling is a
   path tracer rather than sixteen milliseconds.

   WHAT EACH PLANE DOES. Both planes take the same tilt, so the garden never
   slides against the floor it stands on. The room barely grows because it is
   a room; the garden grows three times as much. That difference in rate IS
   the depth; one rate would be a zoom.

   THE MARK stays in the DOM rather than being baked into the plate: it is the
   brand asset, it has to be crisp at any pixel ratio, it carries the alt
   text, and it is locked to the viewport while the set moves under it, which
   is what a thing hung from the grid in front of the lens does.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 1.2;
/** Where the move has finished, as a fraction of the eased hold.
 *
 *  Everything used to arrive exactly as the pin let go, so the push in stopped
 *  and the page started scrolling in the same frame: the handover read as a
 *  lurch. Finishing early leaves a stretch at the end where the frame is
 *  settled and still before the page carries it away. The ease already has
 *  zero velocity at the end, so this does not need to be far from 1: at 0.85
 *  the set was frozen for the last third of the scroll, measured, which is a
 *  dead stretch, not a settle. */
const SETTLE_AT = 0.96;
/** Where in the move the words start arriving, and where they have landed. */
const WORDS_IN = 0.3;
const WORDS_SET = 0.88;

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
      /* The move begins when the screen STARTS sticking, not when the pin's top
         passes the viewport top. The screen sticks at `top: var(--header-h)`,
         so it latches as soon as the pin's top reaches that line, which is
         `host.offsetTop - headerH` in scroll terms, and it lets go exactly
         `span` later. Measuring from `host.offsetTop` ran the whole animation
         one header height late: the last of it played after the hero had
         already come unstuck and was sliding up the page. */
      const header = document.querySelector("header");
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const start = host.offsetTop - headerH;
      const raw = span > 0 ? clamp01((window.scrollY - start) / span) : 1;
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
        {/* Two planes, not three. `back` is opaque and carries the studio, the
            cyc and everything standing on the floor; `mid` is the garden, cut
            out of the same photograph with alpha, and it is the only thing
            that moves against the room. A third plane held litter on the floor
            and had to go: anything resting on a floor that travels at a
            different rate slides off its own shadow. */}
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
