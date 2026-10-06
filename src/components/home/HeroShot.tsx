import { useEffect, useRef, useState } from "react";
import { HeroMark } from "@/components/home/HeroMark";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
import { SITE } from "@/lib/site";
import type { SetFactory } from "@/components/home/hero3d/sets/types";

/* ============================================================================
   The hero, rebuilt as one shot.

   The frame a reader lands on is the mark alone, hanging in a room, lit. The
   first scroll holds the page and pushes the camera in through that room: the
   near things sweep across the lens, the floor opens, the mark grows and
   rises in the frame, and the headline and buttons arrive in the space the
   move has made. Then the hold releases.

   THE ROOM IS IN THE SCENE. That is the whole difference from the three
   earlier attempts. The canvas is the full frame, not a box the size of the
   logo, and the floor, the wall, the lamps and whatever crosses the lens are
   objects in the same three.js scene at real depths. A camera move through
   real depths is read as a camera move; a camera move with a flat backdrop
   behind it is read as a picture being enlarged, which is what kept coming
   back wrong.

   WITHOUT WEBGL, or with reduced motion, there is no move at all: the flat
   mark sits in the middle of the frame with the words under it, which is a
   perfectly good hero and is also exactly what the markup renders before any
   script runs.
   ========================================================================== */

/** Length of the hold, in viewport heights, on top of the sticky screen. */
const TRAVEL = 0.95;
/** Where in the move the words start arriving, and where they have landed. */
const WORDS_IN = 0.42;
const WORDS_SET = 0.88;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
/** Smootherstep: zero velocity at both ends, so the camera neither jumps off
    the mark nor stops dead against the end of the hold. */
function ease(p: number) {
  const t = clamp01(p);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function HeroShot({
  set,
  /** Named in the preview chrome so three of these can be told apart. */
  name,
}: {
  set: () => Promise<SetFactory>;
  name?: string;
}) {
  const pin = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  /* Set as soon as we know the scene will never run: no WebGL, a refused
     context, a shader that would not compile, or a reader who has asked for
     reduced motion. The hero then stops being a pinned camera move and
     becomes a finished still, with its words already in place. Without this
     the page's first frame is the mark alone on a blank field and the
     headline, the lead and both buttons are invisible until somebody
     scrolls, which is how it shipped and how it looked. */
  const [flat, setFlat] = useState(false);

  /* The scroll, written to custom properties every frame and handed to the
     scene. One source of progress for the CSS and the GL, so the words can
     never drift out of step with the move that is supposed to be making room
     for them. */
  const progress = useRef(0);
  const apply = useRef<(p: number) => void>(() => {});

  useEffect(() => {
    const host = pin.current;
    const inner = screen.current;
    if (!host || !inner) return;

    const measureHeader = () => {
      const header = document.querySelector("header");
      const h = header ? Math.round(header.getBoundingClientRect().height) : 0;
      host.style.setProperty("--header-h", `${h}px`);
    };
    measureHeader();

    let frame = 0;
    const read = () => {
      frame = 0;
      const span = host.offsetHeight - inner.offsetHeight;
      const p = span > 0 ? clamp01((window.scrollY - host.offsetTop) / span) : 0;
      progress.current = p;
      const e = ease(p);
      const words = clamp01((e - WORDS_IN) / (WORDS_SET - WORDS_IN));
      inner.style.setProperty("--p", e.toFixed(4));
      inner.style.setProperty("--w", words.toFixed(4));
      apply.current(e);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onResize = () => {
      measureHeader();
      onScroll();
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setFlat(true);
      return;
    }

    let cancelled = false;
    let stage: { setProgress(p: number): void; dispose(): void } | null = null;

    (async () => {
      try {
        const [{ createHeroStage }, factory] = await Promise.all([
          import("@/components/home/hero3d/stage"),
          set(),
        ]);
        if (cancelled) return;
        stage = await createHeroStage(el, {
          set: factory,
          onLost: () => setLive(false),
        });
        if (cancelled) {
          stage.dispose();
          return;
        }
        apply.current = (p) => stage?.setProgress(p);
        stage.setProgress(ease(progress.current));
        setLive(true);
      } catch (err) {
        /* No WebGL, no shader, no context: the flat mark is already on the
           screen and stays there, and the hero becomes its static self. */
        if (!cancelled) {
          setFlat(true);
          console.warn("hero3d: staying flat", err);
        }
      }
    })();

    return () => {
      cancelled = true;
      apply.current = () => {};
      stage?.dispose();
    };
  }, [set]);

  return (
    <div ref={pin} className={`shot-pin${flat ? " is-flat" : ""}`} style={{ height: `calc(100svh + ${TRAVEL * 100}svh)` }}>
      <div ref={screen} className={`shot-screen${live ? " is-live" : ""}${flat ? " is-flat" : ""}`}>
        <canvas ref={canvas} className="shot-canvas" aria-hidden="true" />

        {/* The mark as flat layers, which is what renders before the scene is
            built and what stays if it never is. It is the accessible copy of
            the object either way: the canvas carries no alt text. */}
        <div className="shot-flat">
          <HeroMark sizes="(min-width: 1280px) 620px, 48vw" />
        </div>

        <div className="shot-words">
          <h1 className="hero-head">
            <span aria-hidden="true" className="hero-head-shadow">
              Watch. Play. Learn.
            </span>
            <span className="hero-head-face">
              Watch. <span className="hero-head-2">Play.</span> Learn.
            </span>
          </h1>
          <p className="t-lead hero-lead mx-auto mt-6 max-w-[46ch]">
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

        <span aria-hidden="true" className="shot-cue">
          <span className="hero-cue-rule" />
          Scroll
        </span>

        {name && (
          <span aria-hidden="true" className="shot-tag">
            {name}
          </span>
        )}
      </div>
    </div>
  );
}
