import { useEffect, useRef } from "react";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";

/* ============================================================================
   The hero, as one still.

   WHAT THIS REPLACED, and why. For several days this was a real-time WebGL
   scene: the garden miniature on a studio sweep, a camera pushing through it
   on scroll, scanned plants instanced by the thousand, a shadow map and six
   render passes a frame. It was rejected repeatedly, and the last version of
   it was also laggy, which is the part that settled the argument. Fifteen
   hundred alpha-tested instances and a 2048 shadow map on a full-viewport
   canvas is not something to put in front of a parent on a phone. And tuning
   a picture by nudging constants and re-rendering is a bad way to art-direct
   a shot: it took five rounds just to get the headline legible.

   So the room becomes a photograph, rendered once, offline, at whatever
   quality we like, and the page simply shows it. The browser decodes an image
   instead of rendering a scene, so this cannot be laggy, there is no WebGL
   path to fall back from, and the look is locked in a build artefact that
   cannot regress between releases.

   WHAT IS STILL LIVE. Only the mark, which stays as its own layers in the DOM
   rather than being baked into the plate: it is the brand asset, it has to be
   crisp at any pixel ratio, it carries the alt text, and keeping it separate
   means the room behind it can be re-rendered without touching it.

   UNTIL THE RENDERED PLATE LANDS the room is drawn in CSS: one lit pool
   falling into a corner, and a floor under it. That is meant to be a decent
   hero in its own right rather than a placeholder, because the render is a
   job measured in hours and the site has to look right in the meantime.
   ========================================================================== */

export function HeroShot() {
  const mark = useRef<HTMLDivElement>(null);

  /* The one piece of motion left. The mark lags the page by a few pixels as
     it scrolls away, which reads as an object standing in front of the room
     rather than printed on it. Everything else is still, and this is the
     whole of the hero's JavaScript. */
  useEffect(() => {
    const el = mark.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      el.style.transform = `translate3d(0, ${(y * 0.08).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="shot-still" aria-label="CLÉ Family Media">
      <div ref={mark} className="shot-mark">
        <HeroMark sizes="(min-width: 1280px) 620px, 64vw" />
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
        <p className="t-lead hero-lead mx-auto mt-5 max-w-[46ch]">
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
    </section>
  );
}
