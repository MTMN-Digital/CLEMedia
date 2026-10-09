import type { CSSProperties } from "react";
import { Stage, useRoomEntry } from "@/components/render";
import { APP_LAUNCHED } from "@/lib/site";

/* Watch, Play and Learn as three slips standing on one shelf under one lamp,
   the way the review board stands its six. Mirrors team/StageSequence.tsx:
   hand-placed poses, and each slip's light azimuth computed from its COLUMN
   so the shadows fan away from a single point. */

export type BoardSlip = {
  n: string;
  title: string;
  line: string;
  items: { title: string; body: string }[];
};

const POSE = [
  { tilt: 6.0, turn: -2.0, roll: -0.3, depth: 0.55 },
  { tilt: 4.8, turn: -0.4, roll: 0.25, depth: 0.42 },
  { tilt: 6.8, turn: 1.8, roll: -0.2, depth: 0.58 },
];

const LAMP_X = -0.6;
const LAMP_H = 2.2;
function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / columns;
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

export function StageBoard({ slips }: { slips: BoardSlip[] }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div
      ref={ref}
      className={`rk-studio rk-board ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />

      <div className="rk-head" aria-hidden="true">
        <span>Watch, Play, Learn</span>
        <span className="rk-head-rule" />
        <span className="rk-head-meta">{APP_LAUNCHED ? "Available now" : "Planned, not yet available"}</span>
      </div>

      <ol className="rk-bench">
        {slips.map((s, i) => {
          const pose = POSE[i % POSE.length];
          return (
            <li key={s.n} className="rk-item" style={{ "--i": i } as CSSProperties}>
              <div className="rk-plate">
                <Stage
                  seated
                  light={azimuthFor(i % 3, 3)}
                  tilt={pose.tilt}
                  turn={pose.turn}
                  roll={pose.roll}
                  depth={pose.depth}
                  radius="var(--radius-md)"
                >
                  <article className="rk-slip">
                    <p className="rk-slip__no tnum">
                      <span className="sr-only">Stage </span>{s.n}
                    </p>
                    <h3 className="rk-slip__title">{s.title}</h3>
                    <p className="rk-slip__check">{s.line}</p>
                    <ul className="rk-slip__who">
                      {s.items.map((it) => (
                        <li key={it.title} className="mt-4 first:mt-0">
                          <p className="font-semibold text-ink">{it.title}</p>
                          <p className="mt-1 text-[0.9375rem] leading-[1.6] text-body">{it.body}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Stage>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
