import type { ReactNode } from "react";

/* ============================================================================
   Glance primitives: data drawn as objects, read at a glance. A figure is a
   big tabular number with a one to four word label; a share is a ring; a run
   of days is bars; a set of items is a strip of dots. Words stay short.
   Styles in admin.css under "Glance". Colour carries status only.
   ========================================================================== */

export type GlanceTone = "brand" | "warn" | "info" | "alert" | "off" | "ok";

/** A big figure with a short label. `sub` is one short line under it. */
export function Stat({ label, value, sub, tone = "off", children }: { value: ReactNode; sub?: ReactNode; children?: ReactNode; tone?: GlanceTone; label: string }) {
  return (
    <div className="gl-stat" data-tone={tone}>
      <span className="gl-stat__label">{label}</span>
      <span className="gl-stat__value">{value}</span>
      {sub && <span className="gl-stat__sub">{sub}</span>}
      {children}
    </div>
  );
}

/** A ring filling towards `max`. The figure sits in the middle. */
export function Ring({ value, max, size = 96, tone = "brand", label, children }: { size?: number; max: number; children?: ReactNode; label: string; value: number; tone?: GlanceTone }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const share = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className="gl-ring" data-tone={tone} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="gl-ring__track" />
        <circle cx="50" cy="50" r={r} className="gl-ring__fill" strokeDasharray={`${c * share} ${c}`} transform="rotate(-90 50 50)" />
      </svg>
      <span className="gl-ring__mid">{children ?? value}</span>
    </div>
  );
}

/** One bar per value, oldest on the left. `labels` are for screen readers and the title tooltip. */
export function Bars({ values, labels, height = 56, tone = "brand", label }: { labels?: string[]; tone?: GlanceTone; label: string; height?: number; values: number[] }) {
  const top = Math.max(1, ...values);
  return (
    <div className="gl-bars" data-tone={tone} style={{ height }} role="img" aria-label={label}>
      {values.map((v, i) => (
        <span key={i} className="gl-bars__bar" data-zero={v === 0 || undefined} style={{ height: `${Math.max(v === 0 ? 4 : 12, (v / top) * 100)}%` }} title={labels?.[i] ? `${labels[i]}: ${v}` : String(v)} />
      ))}
    </div>
  );
}

/** One dot per item. Use for "how many, and which are still open". */
export function DotStrip({ dots, label, max = 40 }: { dots: { key: string; title?: string; tone: GlanceTone }[]; label: string; max?: number }) {
  const shown = dots.slice(0, max);
  return (
    <div className="gl-dots" role="img" aria-label={label}>
      {shown.map((d) => (
        <span key={d.key} className="gl-dots__dot" data-tone={d.tone} title={d.title} />
      ))}
      {dots.length > max && <span className="gl-dots__more">+{dots.length - max}</span>}
    </div>
  );
}

const TINTS = ["#F6E3E3", "#E4ECE2", "#E2E8F3", "#F3EAD9", "#ECE4F3", "#E0EEF0"];

/** Initials in a circle, tinted by the address so a person keeps one colour. */
export function Avatar({ name, email, size = 36 }: { name: string | null; email: string | null; size?: number }) {
  const src = (name || email || "?").trim();
  const parts = name ? name.split(/\s+/).filter(Boolean) : [src.split("@")[0]];
  const initials = ((parts[0]?.[0] ?? "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  let h = 0;
  for (const ch of email || src) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (
    <span className="gl-avatar" style={{ width: size, height: size, background: TINTS[h % TINTS.length], fontSize: size * 0.38 }} aria-hidden="true">
      {initials}
    </span>
  );
}

/** A small tinted tag: "Enquiry", "Sign-up", "Order", a route name. */
export function Tag({ tone = "off", children }: { tone?: GlanceTone; children: ReactNode }) {
  return (
    <span className="gl-tag" data-tone={tone}>
      {children}
    </span>
  );
}

/** A white surface with an optional short title and a corner action. */
export function GlanceCard({ title, action, children, className = "" }: { action?: ReactNode; title?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`gl-card ${className}`}>
      {(title || action) && (
        <header className="gl-card__head">
          {title && <h2 className="gl-card__title">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
