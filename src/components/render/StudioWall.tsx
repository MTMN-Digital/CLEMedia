import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Figure } from "@/components/Figure";
import type { AssetKey } from "@/lib/brand";
import { Stage } from "@/components/render/Stage";
import "./render.css";

/* ============================================================================
   The studio wall.

   The four episode title plates as what they are in the building that made
   them: mounted boards standing on a bench in the art department, leaning
   back against the wall under one lamp. Not a grid of thumbnails. A grid
   positions things; a bench is where somebody stood them.

   WHAT MAKES IT READ AS A ROOM, in order of how much each does:
     the lean      every board stands on its foot and leans a few degrees
                   back, each a little differently, with a slight turn toward
                   the camera at the ends of the bench
     the light     one lamp, up and to the left. The plate under it is the
                   brightest; each one further along carries a little more
                   shade, and every shadow runs away from the same point
     the shadows   a cast shadow on the wall that stops where the board meets
                   the shelf, and a contact pool on the shelf itself
     the bench     a ledge with a lit top face and a deeper front face, its
                   own shadow on the wall beneath it. One shelf per plate on
                   a phone, one long bench across four on a desktop
     the label     a card on the shelf in front of each board carrying the
                   episode number, title and runtime. It stays on the shelf
                   when the board is picked up

   Picking one up is the only interaction: hover or focus lifts the board a
   few millimetres toward the camera, its shadow lengthens and softens, the
   pool under it fades. Under reduced motion the room is simply still.

   Everything written on it is real: the four plates are the show's own
   artwork, the numbers, titles and runtimes are the episodes' own, and the
   links go to the episodes themselves.
   ========================================================================== */

export interface WallEpisode {
  n: string;
  title: string;
  asset: AssetKey;
  href: string;
  /** Real values only. Absent until measured. */
  runtime?: string;
}

/* The real four, as published. Structurally compatible with Home.tsx's
   `Episode`, so the page may pass its own EPISODES instead. */
export const STUDIO_EPISODES: WallEpisode[] = [
  { n: "001", title: "The Feather", runtime: "9:16", asset: "slate.ep1",
    href: "https://www.youtube.com/watch?v=duMH0f12JM0" },
  { n: "002", title: "The Strawberry", runtime: "11:10", asset: "slate.ep2",
    href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0" },
  { n: "003", title: "Chicken Vision", runtime: "10:41", asset: "slate.ep3",
    href: "https://www.youtube.com/watch?v=CpgIzsn500Q" },
  { n: "004", title: "The Cuckoo's Incredible Journey", runtime: "9:58", asset: "slate.ep4",
    href: "https://www.youtube.com/watch?v=yHYYBpMfE6M" },
];

/* How each board stands. Hand-placed, so none of the four match: the lean,
   the small turn toward the centre of the bench, and a fraction of roll. The
   depth alternates so neighbours sit at different distances from the wall,
   which is what puts air between them. */
const POSE = [
  { tilt: 6.5, turn: -2.4, roll: -0.35, depth: 0.58 },
  { tilt: 5.0, turn: -0.8, roll: 0.3, depth: 0.4 },
  { tilt: 7.2, turn: 0.8, roll: -0.2, depth: 0.62 },
  { tilt: 5.6, turn: 2.4, roll: 0.4, depth: 0.44 },
];

/* The lamp sits up and left of the bench. Each plate's light azimuth is the
   angle from the lamp to that plate, so the shadows fan away from one point
   rather than all running parallel. */
const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(i: number, count: number) {
  const x = (i + 0.5) / count;
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

/* One settle, armed only when JS runs and motion is allowed. The same shape
   as Settle, kept local to the render kit because Settle's own transform
   would fight the 3D transform on the plates. Exported because the review
   board stands its slips in the same room and has to come up with the same
   light. */
export function useRoomEntry() {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState(false);

  useLayoutEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof IntersectionObserver !== "undefined") setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setLit(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return { ref, armed, lit };
}

function readableRuntime(rt: string) {
  const [m, s] = rt.split(":");
  if (!m || s === undefined) return rt;
  return `${Number(m)} minutes ${Number(s)} seconds`;
}

export function StudioWall({
  episodes = STUDIO_EPISODES,
  label = "Title slates",
  meta,
  flush = false,
  reveal = true,
  className = "",
}: {
  episodes?: WallEpisode[];
  /** The print on the picture rail. Pass null to drop the rail. */
  label?: string | null;
  /** The right-hand print on the rail. Defaults to the episode count. */
  meta?: string;
  /** Edge to edge: no corner radius, for use as a band outside a Container. */
  flush?: boolean;
  /** The entry settle. Turn off if a parent already reveals this block. */
  reveal?: boolean;
  className?: string;
}) {
  const { ref, armed, lit } = useRoomEntry();
  const count = episodes.length;
  const rail = meta ?? `Series 01 · ${count} episodes`;

  return (
    <div
      ref={ref}
      className={`rk-studio ${reveal && armed ? "is-armed" : ""} ${lit ? "is-in" : ""} ${className}`}
      data-flush={flush ? "" : undefined}
    >
      <span className="rk-rake" aria-hidden="true" />

      {label && (
        <div className="rk-head" aria-hidden="true">
          <span>{label}</span>
          <span className="rk-head-rule" />
          <span className="rk-head-meta tnum">{rail}</span>
        </div>
      )}

      <ul className="rk-bench" aria-label="Episode title slates">
        {episodes.map((ep, i) => {
          const pose = POSE[i % POSE.length];
          /* Distance from the lamp, as shade on the plate: none under it,
             a little more on each plate along the bench. */
          const dim = `${(i * 4).toFixed(0)}%`;
          const name = [
            `Episode ${ep.n}, ${ep.title}`,
            ep.runtime ? readableRuntime(ep.runtime) : null,
            "Watch on YouTube, opens in a new tab",
          ]
            .filter(Boolean)
            .join(". ");
          return (
            <li
              key={ep.n}
              className="rk-item"
              style={{ "--i": i, "--dim": dim } as CSSProperties}
            >
              <a
                href={ep.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="rk-plate"
              >
                <Stage
                  seated
                  light={azimuthFor(i, count)}
                  tilt={pose.tilt}
                  turn={pose.turn}
                  roll={pose.roll}
                  depth={pose.depth}
                >
                  <div className="rk-mat">
                    <div className="rk-pic">
                      <Figure
                        asset={ep.asset}
                        rounded="rounded-none"
                        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                      />
                      <span className="rk-light" aria-hidden="true" />
                    </div>
                  </div>
                </Stage>

                <span className="rk-tag">
                  <span className="rk-tag-no tnum">{ep.n}</span>
                  <span className="rk-tag-title">{ep.title}</span>
                  {ep.runtime && <span className="rk-tag-rt tnum">{ep.runtime}</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
