import type { ReactNode } from "react";
import "./shop.css";

export type TileTone = "plain" | "blue" | "green" | "amber";

/** A row of tinted figure tiles: a short label, a big figure, one short line. */
export function Tiles({ label, items }: { items: { label: string; meta?: ReactNode; value: ReactNode; tone?: TileTone }[]; label: string }) {
  return (
    <div className="shop-tiles" role="group" aria-label={label}>
      {items.map((t) => (
        <div key={t.label} className="shop-tile" data-tone={t.tone ?? "plain"}>
          <span className="shop-tile__label">{t.label}</span>
          <b className="shop-tile__fig">{t.value}</b>
          <span className="shop-tile__meta">{t.meta ?? "\u00a0"}</span>
        </div>
      ))}
    </div>
  );
}
