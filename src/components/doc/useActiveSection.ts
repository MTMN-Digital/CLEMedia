import { type RefObject, useEffect, useState } from "react";

/**
 * Which `section[id]` inside `host` the reader is in. A mark for the contents
 * rail, nothing more: nothing scrolls and nothing moves, so there is nothing
 * for reduced motion to switch off.
 *
 * Read on scroll, not through an IntersectionObserver. The observer version
 * of this (on the legal pages) was wrong twice: a band one fifth of the
 * viewport tall contains no section for most of a long document, so the
 * callback never fired while the reader moved through a section, and after a
 * jump to the top it fired with everything leaving and nothing entering.
 * A handful of getBoundingClientRect calls once per frame is cheaper than
 * being wrong.
 *
 * `key` re-reads the sections when the document changes (the legal routes
 * remount per document, but a page may also swap its body in place).
 */
export function useActiveSection(host: RefObject<HTMLElement | null>, key?: unknown): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const secs = Array.from(el.querySelectorAll<HTMLElement>("section[id]"));
    if (!secs.length) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.28;
      let current = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= line) current = s;
      setActive(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [host, key]);

  return active;
}
