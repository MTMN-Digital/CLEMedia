import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

/* Small shared pieces: buttons, page header, status pills, notices, empty
   states and the up/down reorder control. */

export type ButtonVariant = "quiet" | "danger" | "primary" | "danger-solid";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  quiet: "btn btn-quiet",
  danger: "btn btn-danger",
  "danger-solid": "btn btn-danger-solid",
};

export interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  /** Shows this label and disables the button while true, e.g. "Saving". */
  busy?: boolean;
  busyLabel?: string;
}

/** The site's own buttons, sized for a thumb. type="button" unless given. */
export function AdminButton({ variant = "primary", size = "md", busy, busyLabel, className = "", children, disabled, type, ...rest }: AdminButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={`${VARIANT[variant]} ${size === "sm" ? "btn-sm" : ""} ${className}`}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...rest}
    >
      {busy && busyLabel ? busyLabel : children}
    </button>
  );
}

/** A router link styled as a button. */
export function AdminLinkButton({ to, variant = "quiet", size = "md", children, className = "" }: { className?: string; to: string; variant?: ButtonVariant; size?: "md" | "sm"; children: ReactNode }) {
  return (
    <Link to={to} className={`${VARIANT[variant]} ${size === "sm" ? "btn-sm" : ""} ${className}`}>
      {children}
    </Link>
  );
}

/**
 * The top of every panel view. `back` renders a "Back to ..." link above the
 * title. `actions` sits on the right on a desk and wraps under on a phone.
 */
export function PageHeader({ title, intro, actions, back }: { back?: { to: string; label: string }; actions?: ReactNode; intro?: ReactNode; title: ReactNode }) {
  return (
    <header className="adm-head">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="adm-head__back">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {actions && <div className="adm-head__actions">{actions}</div>}
    </header>
  );
}

export type PillTone = "alert" | "ok" | "warn" | "off";

/** A short state word: "Published", "Draft", "Hidden", "New". */
export function StatusPill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  return <span className={`adm-pill adm-pill--${tone}`}>{children}</span>;
}

/** An inline message. `error` is announced to screen readers. */
export function Notice({ tone = "info", children }: { tone?: "error" | "ok" | "info"; children: ReactNode }) {
  return (
    <div className={`adm-notice adm-notice--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <div>{children}</div>
    </div>
  );
}

/** What a list says when it has nothing in it, with the one useful action. */
export function EmptyState({ title, body, action }: { body?: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="adm-empty">
      <strong>{title}</strong>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

/**
 * Up and down buttons for running order. Drag is unreliable one-handed on a
 * phone; two 40px buttons are not. `label` names the item for screen readers.
 */
export function MoveButtons({ label, onUp, onDown, first, last, disabled }: { onDown: () => void; onUp: () => void; first: boolean; last: boolean; disabled?: boolean; label: string }) {
  return (
    <span className="adm-move">
      <button type="button" onClick={onUp} disabled={first || disabled} aria-label={`Move ${label} up`}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 10l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={onDown} disabled={last || disabled} aria-label={`Move ${label} down`}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </span>
  );
}

/** Move one id up or down in a list of ids. Pure. Pair with reorderRows(). */
export function moveId(ids: string[], id: string, dir: -1 | 1): string[] {
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return ids;
  const next = ids.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
