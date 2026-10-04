import { useEffect, useRef } from "react";
import { HeroMark } from "@/components/home/HeroMark";

/* ============================================================================
   The mark in WebGL, over the mark in CSS.

   WHY. The layered CSS hero separates four flat pictures in Z, and flat
   pictures never relight: turn them under a lamp and the shading on them
   does not move, so the eye reads panes of glass. The client said "there is
   no 3d affect there", and he was right. This mounts a canvas over those same
   four layers in which each one is a real relief surface lit by a real lamp
   (see hero3d/scene.ts and hero3d/shaders.ts), so the turn moves the light
   across the wool.

   THE FALLBACK IS THE BASELINE. The CSS hero underneath is always rendered,
   always loaded first, and always carries the accessible name. The canvas is
   an enhancement that fades in over it once a frame has been drawn, and it
   fades out again if the browser takes the WebGL context away. No WebGL, a
   software renderer, a phone or tablet below 1024px, or prefers-reduced-motion
   never load three.js at all: the dynamic import is behind those checks, so
   the main bundle does not pay for it either.

   WHAT THIS COMPONENT DOES NOT DO. It does not know about scroll. HeroStage
   owns the timeline and hands this a subscribe function for the eased turn;
   this hands HeroStage a flag for when the canvas is live so the stage can
   switch its CSS over (no rotate on the mark, layers hidden, sheen off).
   ========================================================================== */

export interface HeroMark3DProps {
  /** Register for the eased turn, 0 at rest to 1 at full turn. Fires at once
      with the current value. Returns the unsubscribe. */
  subscribe: (fn: (turn: number) => void) => () => void;
  /** The canvas has taken over (true) or handed back to CSS (false). */
  onLive: (live: boolean) => void;
}

type SceneModule = typeof import("./hero3d/scene");

function webgl2Available() {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function HeroMark3D({ subscribe, onLive }: HeroMark3DProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el || typeof window.matchMedia !== "function") return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    let scene: import("./hero3d/scene").HeroScene | null = null;
    let unsubscribe: (() => void) | null = null;
    let building = false;
    let cancelled = false;
    /* Once the context has been lost, or WebGL has refused us, we do not
       try again in this page's lifetime. The CSS hero is a fine hero. */
    let refused = false;
    let idle = 0;

    const teardown = (unmounting: boolean) => {
      unsubscribe?.();
      unsubscribe = null;
      scene?.dispose();
      scene = null;
      if (!unmounting) onLive(false);
    };

    const build = async () => {
      if (building || scene || refused) return;
      building = true;
      try {
        if (!webgl2Available()) {
          refused = true;
          return;
        }
        const mod: SceneModule = await import("./hero3d/scene");
        if (cancelled || !wide.matches || reduced.matches) return;
        const built = await mod.createHeroScene(el, {
          onLost: () => {
            refused = true;
            teardown(false);
          },
        });
        if (cancelled || !wide.matches || reduced.matches) {
          built.dispose();
          return;
        }
        scene = built;
        unsubscribe = subscribe((turn) => built.setTurn(turn));
        onLive(true);
      } catch {
        /* Context refused, a texture failed, or the shader did not compile:
           the CSS hero stays, and nothing is reported to the reader. */
        refused = true;
      } finally {
        building = false;
      }
    };

    const evaluate = () => {
      const wanted = wide.matches && !reduced.matches && !saveData;
      if (wanted && !scene) {
        /* Not before the fallback has painted. The logo PNGs are the LCP
           candidate and three.js must not compete with them for the wire. */
        cancelIdle();
        const w = window as Window & {
          requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        };
        idle = w.requestIdleCallback
          ? w.requestIdleCallback(() => void build(), { timeout: 1500 })
          : window.setTimeout(() => void build(), 400);
      } else if (!wanted && scene) {
        teardown(false);
      }
    };
    const cancelIdle = () => {
      if (!idle) return;
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      idle = 0;
    };

    evaluate();
    wide.addEventListener("change", evaluate);
    reduced.addEventListener("change", evaluate);
    return () => {
      cancelled = true;
      cancelIdle();
      wide.removeEventListener("change", evaluate);
      reduced.removeEventListener("change", evaluate);
      teardown(true);
    };
  }, [subscribe, onLive]);

  return (
    <div className="hero-3d">
      {/* The CSS hero, and the only thing here a screen reader meets. */}
      <HeroMark />
      {/* Decorative: the picture a sighted reader sees once WebGL is up. */}
      <canvas ref={canvas} className="hero-3d-canvas" aria-hidden="true" role="presentation" />
    </div>
  );
}
