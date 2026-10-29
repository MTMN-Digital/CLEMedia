import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Momentum-smoothed scrolling.
 *
 * Driving the five reference sites headless found this on three of them, and
 * it was the single thing separating them from a well-built ordinary page:
 * award sites do not use native scroll. Nothing else reads as expensive until
 * this is in place.
 *
 * Two non-negotiables:
 *
 * 1. It must yield to scroll it did not originate. Keyboard PageDown, Home,
 *    End, anchor links and scrollbar drags all have to work, or this is an
 *    accessibility failure rather than a rough edge. Lenis handles wheel and
 *    touch and leaves the rest to the platform, which is why the library is
 *    used here instead of a hand-rolled rAF loop.
 * 2. It switches off entirely under prefers-reduced-motion. A smoothed scroll
 *    is vestibular motion the visitor did not ask for.
 *
 * `duration` is deliberately short. This brand argues that children's media is
 * too slow to respond and too eager to hold attention, so the scroll should
 * feel weighted, not floaty.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  /* Lenis is started from an effect rather than by wrapping the tree in
     <ReactLenis>. The wrapper could only be added after an effect had read the
     motion preference, and swapping a fragment for it changed the element
     type above the whole page: React unmounted and remounted every node on
     every first load, which on a prerendered page threw away the HTML the
     browser had already painted. Nothing on the site reads Lenis's context. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    const sync = () => {
      if (mq.matches) {
        lenis?.destroy();
        lenis = null;
      } else if (!lenis) {
        lenis = new Lenis({
          autoRaf: true,
          duration: 0.9,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          // Touch devices already have momentum from the platform, and
          // doubling it reads as lag on a phone.
          syncTouch: false,
        });
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
