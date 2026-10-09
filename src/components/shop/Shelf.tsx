import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Stage, useRoomEntry } from "@/components/render";
import type { Product } from "@/lib/types";
import { PrintedSheet } from "@/components/shop/PrintedSheet";
import { formatPrice } from "@/components/shop/catalogue";

/* ============================================================================
   The lit shelf: the shop's products standing on a ledge in a .rk-studio room,
   the same furniture as the review board on /team (StageSequence.tsx).

   One lamp, up and left of the shelf. Each object's azimuth is the angle from
   that lamp to its COLUMN, so a second row is lit the same way as the first.
   Poses are hand-placed so no two neighbours match.

   The price printed on a tag is the one the database returned. Nothing here
   states a price of its own.
   ========================================================================== */

export const POSE = [
  { tilt: 6.4, turn: -2.0, roll: -0.35, depth: 0.58 },
  { tilt: 5.0, turn: -0.4, roll: 0.3, depth: 0.42 },
  { tilt: 7.1, turn: 1.8, roll: -0.2, depth: 0.62 },
  { tilt: 5.5, turn: -1.5, roll: 0.4, depth: 0.46 },
  { tilt: 6.7, turn: 0.6, roll: -0.3, depth: 0.55 },
  { tilt: 4.9, turn: 2.1, roll: 0.2, depth: 0.4 },
];

const LAMP_X = -0.6;
const LAMP_H = 2.2;
export function azimuthFor(column: number, columns: number) {
  const x = (column + 0.5) / columns;
  return (Math.atan2(x - LAMP_X, LAMP_H) * 180) / Math.PI - 52;
}

export function Shelf({ products }: { products: Product[] }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div
      ref={ref}
      className={`rk-studio rk-board ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
    >
      <span className="rk-rake" aria-hidden="true" />

      <div className="rk-head" aria-hidden="true">
        <span>Downloads</span>
        <span className="rk-head-rule" />
        <span className="rk-head-meta">One file each</span>
      </div>

      <ul className="rk-bench">
        {products.map((p, i) => {
          const pose = POSE[i % POSE.length];
          return (
            <li key={p.id} className="rk-item" style={{ "--i": i } as CSSProperties}>
              <Link to={`/shop/${p.slug}`} className="rk-plate">
                <div className="mx-auto" style={{ width: i % 2 ? "84%" : "92%" }}>
                  <Stage
                    seated
                    light={azimuthFor(i % 3, 3)}
                    tilt={pose.tilt}
                    turn={pose.turn}
                    roll={pose.roll}
                    depth={pose.depth}
                    radius="3px"
                    className="[container-type:inline-size]"
                  >
                    {p.thumbnail ? (
                      <div className="rk-mat">
                        <div className="rk-pic aspect-[1/1.3]">
                          <img
                            src={p.thumbnail}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                          <span className="rk-light" aria-hidden="true" />
                        </div>
                      </div>
                    ) : (
                      <PrintedSheet />
                    )}
                  </Stage>
                </div>
                <span className="rk-tag">
                  <span className="rk-tag-title">{p.title}</span>
                  <span className="rk-tag-title tnum">{formatPrice(p.price_cents, p.currency)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
