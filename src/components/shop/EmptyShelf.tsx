import type { CSSProperties } from "react";
import { Stage, useRoomEntry } from "@/components/render";
import { PrintedSheet } from "@/components/shop/PrintedSheet";
import { POSE, azimuthFor } from "@/components/shop/Shelf";

/* ============================================================================
   The empty shelf.

   Nothing is on sale, so this is the shelf with nothing on it but the format:
   one blank specimen sheet per kind of thing being prepared, standing on the
   same ledge and under the same lamp as the shelf that will hold the real
   products. A blank sheet claims no title, price, count or artwork, because
   none exists. A cream tag at each foot names the kind, and the sentence that
   says what each kind is sits under the room, on paper, where reading belongs.

   Decoration only: the sheets are hidden from assistive tech, and the kinds
   are read from the list under the room.
   ========================================================================== */

export interface ShelfKind {
  kind: string;
  line: string;
}

/* Width and the three sheet variants differ so the row is not a shop display. */
const WIDTH = ["88%", "100%", "80%"];
const VARIANT = [
  { staple: true, stack: true, holes: true },
  { staple: false, stack: false, holes: false },
  { staple: false, stack: true, holes: true },
];

export function EmptyShelf({ kinds }: { kinds: ShelfKind[] }) {
  const { ref, armed, lit } = useRoomEntry();

  return (
    <div>
      <div
        ref={ref}
        className={`rk-studio rk-board ${armed ? "is-armed" : ""} ${lit ? "is-in" : ""}`}
      >
        <span className="rk-rake" aria-hidden="true" />

        <div className="rk-head" aria-hidden="true">
          <span>Downloads</span>
          <span className="rk-head-rule" />
          <span className="rk-head-meta">Nothing on sale yet</span>
        </div>

        <ul aria-hidden="true" className="rk-bench">
          {kinds.map((k, i) => {
            const pose = POSE[i % POSE.length];
            const v = VARIANT[i % VARIANT.length];
            return (
              <li key={k.kind} className="rk-item" style={{ "--i": i } as CSSProperties}>
                <div className="rk-plate">
                  <div className="mx-auto" style={{ width: WIDTH[i % WIDTH.length] }}>
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
                      <PrintedSheet staple={v.staple} stack={v.stack} holes={v.holes} />
                    </Stage>
                  </div>
                  <span className="rk-tag">
                    <span className="rk-tag-title">{k.kind}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-3">
        {kinds.map((k) => (
          <li key={k.kind}>
            <p className="text-[17px] font-semibold text-ink">{k.kind}</p>
            <p className="mt-1.5 max-w-[34ch] text-[15px] leading-[1.6] text-body">{k.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
