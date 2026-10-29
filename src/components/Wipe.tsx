import { useState, type ElementType, useLayoutEffect, type ReactNode, useEffect, useRef } from "react";
import { alreadyPainted } from "@/lib/landing";

/**
 * The house reveal: a clip-path wipe, unmasking content from its bottom edge.
 *
 * Replaces the fade-up, which the reference-site probe identified as the tell
 * that separates an assembled page from an authored one.
 *
 * The observer sits on the WRAPPER, never on the clipped child. An element
 * clipped to zero height by its own clip-path reports `intersectionRatio: 0`
 * forever, so it can never trigger its own reveal. That bug costs an afternoon
 * if you meet it fresh.
 *
 * Arming happens in useLayoutEffect and only from JS, so the clipped state can
 * never outlive a failure to run.
 */
export function Wipe({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const wrap = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof IntersectionObserver !== "undefined" && !alreadyPainted(wrap.current)) setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = wrap.current;
    if (!el) return;
    Array.from(el.children).forEach((c, i) => {
      const h = c as HTMLElement;
      if (!h.style.getPropertyValue("--i")) h.style.setProperty("--i", String(i));
    });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <Tag ref={wrap} className={`wipe ${armed ? "is-armed" : ""} ${shown ? "is-in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
