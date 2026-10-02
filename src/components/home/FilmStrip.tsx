import { useCallback, useEffect, useRef, useState } from "react";
import { EpisodeSlate, type Episode } from "@/components/home/EpisodeSlate";

/* ============================================================================
   The filmstrip.

   The page was a vertical stack of identically shaped sections, so the series
   now runs sideways. A filmstrip is not a decoration borrowed from somewhere
   else: perforated stock IS the trade, so the chrome states what the studio
   does before a word is read.

   Interaction, in order of how most people will use it:
     trackpad / touch  native horizontal scroll, nothing intercepted
     drag              pointer drag, with a click guard so a drag never
                       triggers the link underneath
     buttons           one slate per press
     keyboard          the slates are links, so Tab moves through them and the
                       browser scrolls the rail to follow focus

   Deliberately NOT hijacked: the vertical wheel. Lenis owns vertical scroll,
   and a rail that steals the wheel traps the reader inside it on the way down
   the page. Shift and wheel still scrolls horizontally, because that is the
   platform's own gesture.
   ========================================================================== */

export function FilmStrip({ episodes }: { episodes: Episode[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const readEdges = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    readEdges();
    const el = rail.current;
    if (!el) return;
    el.addEventListener("scroll", readEdges, { passive: true });
    window.addEventListener("resize", readEdges);
    return () => {
      el.removeEventListener("scroll", readEdges);
      window.removeEventListener("resize", readEdges);
    };
  }, [readEdges]);

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const by = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: by * dir, behavior: "smooth" });
  };

  /* Drag to scroll. `moved` is the click guard: without it, releasing a drag
     over a slate opens the episode. */
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = rail.current;
    if (!el || e.pointerType === "touch") return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = rail.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = rail.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.down = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current.moved = 0;
  };

  return (
    /* --gutter lives on the root, not on the band: the count and the arrows sit
       above the stock and need the same inset as the slates inside it. */
    <div className="filmstrip-root relative">
      {/* Controls sit with the count, not floating over the art. The right
          gutter is theirs alone: the strip below bleeds off the page edge, and
          a button hard against that edge reads as clipped. */}
      <div className="filmstrip-head mb-6 flex items-center gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-deep">
          {episodes.length} episodes
        </p>
        <span className="h-px flex-1 bg-[var(--color-rule)]" aria-hidden="true" />
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d)}
              disabled={d === -1 ? atStart : atEnd}
              aria-label={d === -1 ? "Previous episodes" : "Next episodes"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-rule)] text-ink transition-opacity disabled:opacity-30"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d={d === -1 ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
                  fill="none" stroke="currentColor" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="filmstrip-band relative overflow-hidden">
        {/* Top margin of the stock: sprocket holes, then the edge print and the
            frame ticks that make it read as a length of film rather than a dark
            rectangle with holes punched in it. */}
        <span className="sprockets sprockets-top" aria-hidden="true" />
        <div className="filmstrip-head flex items-center gap-5 pb-1 pt-2" aria-hidden="true">
          {/* The full edge print is 56 characters at 0.34em tracking, which is
              wider than a phone. Hidden rather than wrapped: film margin print
              runs on one line or it is not film margin print. */}
          <span className="edge-print hidden whitespace-nowrap font-mono uppercase sm:inline">
            CLÉ FAMILY MEDIA · THE PAWSITIVE PUGS &amp; PALS · SERIES 01
          </span>
          <span className="edge-print whitespace-nowrap font-mono uppercase sm:hidden">
            CLÉ FAMILY MEDIA
          </span>
          <span className="frame-ticks h-3 flex-1" />
          <span className="edge-print whitespace-nowrap font-mono">001 / 004</span>
        </div>

        <ul
          ref={rail}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="filmstrip-rail flex gap-6 overflow-x-auto overscroll-x-contain py-7"
        >
          {episodes.map((ep, i) => (
            <li
              key={ep.n}
              className="w-[78vw] shrink-0 sm:w-[54vw] lg:w-[30rem]"
              /* Each slate sits a fraction off true, the way a physical thing
                 placed by hand does. Alternating so the rail is not a comb. */
              style={{ transform: `rotate(${i % 2 ? 0.7 : -0.6}deg)` }}
            >
              <EpisodeSlate ep={ep} />
            </li>
          ))}
        </ul>

        <div className="filmstrip-head flex items-center gap-5 pb-2 pt-1" aria-hidden="true">
          <span className="frame-ticks h-3 flex-1" />
          <span className="edge-print whitespace-nowrap font-mono uppercase">Drag or scroll sideways</span>
        </div>
        <span className="sprockets sprockets-bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
