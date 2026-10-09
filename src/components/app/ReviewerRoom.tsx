import type { CSSProperties } from "react";
import { Figure } from "@/components/Figure";
import { Stage, useRoomEntry } from "@/components/render";
import type { AssetKey } from "@/lib/brand";

/* The three reviewers mounted on the wall the way /contact mounts its five:
   each print on its own ledge, the caption printed ON the cream mount, and
   one lamp whose azimuth is read from the portrait's column. */

export type Reviewer = { name: string; role: string; asset: AssetKey };

/* Three across at every width: .rk-corr__people--row in render.css keeps the
   wide room from dropping to two, so a portrait's column is always
   i % COLUMNS and the lamp reads it from there. */
const COLUMNS = 3;
const LIGHT = [-26, -6, 16];

export function ReviewerRoom({ people }: { people: Reviewer[] }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div
      ref={ref}
      className={`rk-studio ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />

      <div className="rk-head" aria-hidden="true">
        <span>Reviewers</span>
        <span className="rk-head-rule" />
        <span className="rk-head-meta">CLÉ Family Media</span>
      </div>

      <div className="rk-item" style={{ "--i": 0 } as CSSProperties}>
        <ul
          className="rk-corr__people rk-corr__people--row mx-auto max-w-[44rem]"
        >
          {people.map((p, i) => (
            <li key={p.name}>
              <Stage
                seated
                ground="ledge"
                light={LIGHT[i % COLUMNS]}
                tilt={5.2 + (i % 3) * 0.8}
                turn={i % 2 ? 1.4 : -1.4}
                roll={i % 2 ? 0.3 : -0.35}
                depth={0.46 + (i % 2) * 0.12}
              >
                <div className="rk-mat">
                  <div className="rk-pic">
                    <Figure
                      asset={p.asset}
                      rounded="rounded-none"
                      className="aspect-square"
                      sizes="(min-width: 1024px) 220px, 30vw"
                    />
                    <span className="rk-light" aria-hidden="true" />
                  </div>
                  <div className="rk-corr__caption">
                    <p className="rk-corr__name">{p.name}</p>
                    <p className="rk-corr__role">{p.role}</p>
                  </div>
                </div>
              </Stage>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
