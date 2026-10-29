import { useState, type ElementType, useLayoutEffect, type ReactNode, useEffect, useRef } from "react";
import { alreadyPainted } from "@/lib/landing";

/**
 * The only motion on this site.
 *
 * A group settles once on entry: 8px of travel, 0.7s, a 60ms stagger between
 * direct children. Nothing else moves. No parallax, no pinning, no ambient
 * loops, nothing that runs on its own.
 *
 * The stagger runs on the children, so it only engages when there is more than
 * one of them. With a single child, or with raw text, the whole group settles
 * as one unit instead: staggering a group of one is just a delay.
 *
 * That restraint is the brief, not a preference. This company's argument is
 * that children's media is too fast, too bright and designed to hold
 * attention. A site for them that drifts and pins and shimmers would be
 * contradicting its own case in the medium making it.
 *
 * The hidden state sits behind `.is-armed`, which only JS adds, and arming
 * happens in useLayoutEffect so it cannot outlive a failure to run. No JS, no
 * IntersectionObserver, reduced motion and crawlers all get finished content.
 */
export function Settle({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const [stagger, setStagger] = useState(false);

  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof IntersectionObserver !== "undefined" && !alreadyPainted(ref.current)) setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children);
    kids.forEach((c, i) => {
      const h = c as HTMLElement;
      if (!h.style.getPropertyValue("--i")) h.style.setProperty("--i", String(i));
    });
    setStagger(kids.length > 1);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <Tag
      ref={ref}
      className={`settle ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""} ${
        stagger ? "has-stagger" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
