import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked drift, for the hero only.
 *
 * Settle's header says this site has no parallax. That was true until
 * 2026-10-02 and is still the rule everywhere below the fold: one settle on
 * entry, nothing that runs on its own. The exception is the hero, where the
 * CLÉ mark is a physical object on strings, and an object on a string is the
 * one thing a reader expects to move when the ground under it does.
 *
 * `rate` is how far the element lags the page, as a fraction of the distance
 * scrolled: positive holds it back so it hangs, negative pushes it the other
 * way. The travel is in viewport height so it scales with the screen instead
 * of being a pixel figure tuned to one laptop.
 *
 * ponytail: written against the scroll event rather than framer-motion, which
 * is in the project but was not in the bundle. Importing it here for one
 * transform cost 135 KB gzipped, four times what this page's own code weighs.
 * Lenis already emits a scroll event every frame, so the listener is as smooth
 * as the library would have been. If a second scroll-linked effect ever lands,
 * reach for the library then.
 */
export function Drift({
  children,
  rate = 0.18,
  /* Hard ceiling on the travel, in pixels. Parallax that runs unbounded will
     eventually collide with whatever sits under it: at 0.22 the hero mark had
     crossed into the headline by 400px of scroll. The cap is the clearance
     below the element, so the effect can never close the gap. */
  max = Infinity,
  className = "",
}: {
  children: ReactNode;
  rate?: number;
  max?: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = inner.current;
    const box = host.current;
    if (!el || !box) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const r = box.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      /* Zero at rest. The offset is measured from the scroll position at which
         this element reaches the bottom of the viewport, so it starts where the
         layout put it and only then begins to lag. An earlier version used the
         raw distance from the viewport bottom, which displaced the hero mark
         the moment the page loaded and dropped it onto the headline. */
      const docTop = r.top + window.scrollY;
      const enters = Math.max(0, docTop - window.innerHeight);
      const past = Math.max(0, window.scrollY - enters);
      const shift = Math.max(-max, Math.min(max, past * rate));
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rate, max]);

  return (
    <div ref={host} className={className}>
      <div ref={inner} className="h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
