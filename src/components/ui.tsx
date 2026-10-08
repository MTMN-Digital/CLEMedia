import type { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";

/* ---------------------------------------------------------------------------
   Primitives.

   Thin by design. Everything visual lives in src/styles/index.css, which ports
   M.ind's system reskinned to the show's palette. These components only decide
   WHICH surface a piece of content wears, and enforce the two rules that are
   easiest to break: a card is lighter than the ground with an ink hairline, and
   Calistoga never appears below 40px.
--------------------------------------------------------------------------- */

type Width = "measure" | "text" | "default" | "wide";

const WIDTHS: Record<Width, string> = {
  measure: "mx-auto w-full max-w-[64ch]",
  text: "mx-auto w-full max-w-3xl",
  default: "mx-auto w-full max-w-5xl",
  /* 1560px, the house content cap. Raised from 1248 on 2026-10-02: on a 1905px
     screen the old cap left a third of the viewport empty on each side and the
     page read as a column floating in the middle of a monitor. Text measures
     are set per block and did not move, so nothing got harder to read. */
  wide: "mx-auto w-full max-w-[97.5rem]",
};

export function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  return <div className={`${WIDTHS[width]} px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  deep = false,
  className = "",
  as: Tag = "section",
  labelledBy,
  pad = "normal",
}: {
  children: ReactNode;
  /** The one navy band per page. */
  deep?: boolean;
  className?: string;
  as?: "section" | "div" | "footer";
  labelledBy?: string;
  /** The spacing contract. Every page used to reach for `!py-*` instead: there
   *  were eleven of those across five pages and no two agreed, which is why
   *  the rhythm wandered from page to page. Four named steps, and anything
   *  that needs a fifth is a contract gap, not a className. */
  pad?: Step | [Step, Step];
}) {
  /* A pair when the two sides differ, which is how a section says "I butt
     against the one next to me". Sixteen inline `!pt-`/`!pb-` escapes were
     doing this, no two alike. */
  const TOP = { normal: "pt-20 sm:pt-24 lg:pt-28", tight: "pt-14 sm:pt-16 lg:pt-20",
                open: "pt-24 sm:pt-32 lg:pt-40", none: "" } as const;
  const BOTTOM = { normal: "pb-20 sm:pb-24 lg:pb-28", tight: "pb-14 sm:pb-16 lg:pb-20",
                   open: "pb-24 sm:pb-32 lg:pb-40", none: "" } as const;
  const [top, bottom] = Array.isArray(pad) ? pad : [pad, pad];
  return (
    <Tag aria-labelledby={labelledBy} className={`${deep ? "deep" : ""} ${TOP[top]} ${BOTTOM[bottom]} ${className}`}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------------------
   Type.
--------------------------------------------------------------------------- */

/** Mono, tracked, uppercase. Never numbered, never a marketing line. */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-lead max-w-[58ch] text-body ${className}`}>{children}</p>;
}

/* ---------------------------------------------------------------------------
   Surfaces.
--------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`card rounded-[var(--radius-lg)] ${className}`}>{children}</Tag>;
}

/* ---------------------------------------------------------------------------
   Actions.
--------------------------------------------------------------------------- */

/** The four steps of the spacing contract. */
type Step = "normal" | "tight" | "open" | "none";

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  /* Two names, because there are two treatments. There used to be five, and
     `secondary`, `light` and `outline` all silently rendered as `quiet`, so a
     page asking for one of them got something other than it named and nobody
     could see the difference. */
  variant?: "primary" | "quiet";
  /** A bigger primary for a page whose whole job is one action: the download
   *  and the buy button. It was two different sets of inline
   *  `!px-* !py-* !text-*` escapes that did not agree with each other. */
  size?: "normal" | "large";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Button({
  children, to, href, variant = "primary", size = "normal", type = "button", onClick, disabled,
  className = "",
}: ButtonProps) {
  const big = size === "large" ? "px-8 py-5 text-[17px]" : "";
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-quiet"} ${big} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href)
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function TextLink({
  children, to, href, className = "",
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  className?: string;
}) {
  const cls = `link-draw inline-flex items-center gap-1.5 text-[15px] font-semibold text-red-deep ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
}

/* ----------------------------------------------------------------------------
   The house disclosure panel.

   grid-rows 0fr to 1fr, so the height animates without anything measuring it.
   Closed, it is out of the accessibility tree AND out of the tab order: the
   two hand-written copies on the site each had one of those halves and not the
   other, which is exactly the kind of thing that stops being noticed once it
   is written twice.

   The button that controls it stays with the page. One of them is a question
   inside a heading, the other is a labelled bar carrying a section count, and
   a prop that covers both would be longer than either.
   -------------------------------------------------------------------------- */
export function DisclosurePanel({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className={`overflow-hidden ${open ? "visible" : "invisible"}`}>{children}</div>
    </div>
  );
}

