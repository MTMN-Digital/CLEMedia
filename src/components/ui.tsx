import type { ReactNode, ElementType } from "react";
import { Link } from "react-router-dom";

/* ---------------------------------------------------------------------------
   Primitives.

   Thin by design. Everything visual lives in src/styles/index.css, which ports
   M.ind's system reskinned to the show's palette. These components only decide
   WHICH surface a piece of content wears, and enforce the two rules that are
   easiest to break: a card is lighter than the ground with an ink hairline, and
   Calistoga never appears below 40px.
--------------------------------------------------------------------------- */

type Width = "default" | "wide" | "text" | "measure";

/* ONE LEFT EDGE FOR THE WHOLE SITE, 2026-10-24.

   These used to be four independently centred boxes, so a narrower section was
   centred in the viewport rather than aligned to anything. Measured at 1440:
   the header and footer run at the 1560 cap and start their content at x=32,
   while every `default` section started at x=240. Two hundred and eight pixels
   of mismatch, on nine sections across six pages, and /story alternated between
   the two FIVE times down its length. That is the "weirdly confined to a
   central column" complaint, and it was never about the measure of the text: a
   62ch paragraph is the right measure. It was about the box around it floating
   free of the page.

   So the shell is now always the wide one, always the same gutter, and the
   width names only cap the content INSIDE it, left aligned. A narrow section
   now reads as an indented column of a page rather than as a separate page.

   `className` lands on the inner box, which is the content box and what every
   call site was already styling. */
const WIDTHS: Record<Width, string> = {
  measure: "max-w-[64ch]",
  text: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-full",
};

export function Container({
  children,
  width = "default",
  className = "",
}: {
  className?: string;
  width?: Width;
  children: ReactNode;
}) {
  /* 1560px, the house content cap. Raised from 1248 on 2026-10-02: on a 1905px
     screen the old cap left a third of the viewport empty on each side and the
     page read as a column floating in the middle of a monitor. */
  return (
    <div className="mx-auto w-full max-w-[97.5rem] px-5 sm:px-8">
      <div className={`${WIDTHS[width]} ${className}`}>{children}</div>
    </div>
  );
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
  as?: "div" | "section" | "footer";
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
  /* TIGHTENED ONE STEP, 2026-10-13. Measured on the home page at 1440 the gaps
     between blocks were running 224 to 272 pixels, which reads as a page that
     has been pulled apart rather than one that breathes. `normal` came down
     from 112 to 88 a side and `open` from 160 to 128, so the ordinary gap is
     now 176 and the widest 216. The house spec asks for about 100 a side, so
     this lands on it rather than under it. `tight` did not move: thirty-odd
     sections lean on it to butt against a neighbour, and changing it would
     have moved every one of them for no reason anybody asked for.

     `close` is the fifth step, and it exists because the contract above says a
     fifth step is a contract gap rather than a className. A ShowFrame is a
     picture with a caption and nothing else, so it needs a seam, not a margin:
     at `tight` each frame paid 80 a side on top of its neighbour's 112, which
     put 192 pixels of air around a 459 pixel ribbon and made it read as an
     interruption. At `close` the same frame costs 120. */
  const TOP = { normal: "pt-16 sm:pt-20 lg:pt-22", tight: "pt-14 sm:pt-16 lg:pt-20",
                close: "pt-6 sm:pt-7 lg:pt-8",
                open: "pt-20 sm:pt-26 lg:pt-32", none: "" } as const;
  const BOTTOM = { normal: "pb-16 sm:pb-20 lg:pb-22", tight: "pb-14 sm:pb-16 lg:pb-20",
                   close: "pb-6 sm:pb-7 lg:pb-8",
                   open: "pb-20 sm:pb-26 lg:pb-32", none: "" } as const;
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
export function Kicker({ children, className = "" }: { className?: string; children: ReactNode }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Lead({ children, className = "" }: { className?: string; children: ReactNode }) {
  /* No `text-body`. `html` already sets exactly that colour, so naming it here
     changed nothing on paper and made the component unusable on any dark band:
     a Lead on the bench measured 1.68:1. Pages worked around it by hand
     rolling `t-lead` instead of using the primitive, which is how a shared
     component quietly stops being shared. */
  /* The cap is a DEFAULT, not a floor. Eleven call sites passed a max-w of
     their own next to this one; two utilities setting the same property are
     resolved by the order Tailwind emits them, not by the order they are
     written, so each of those measures was a coin toss. */
  const cap = /\bmax-w-/.test(className) ? "" : "max-w-[58ch]";
  return <p className={`t-lead ${cap} ${className}`}>{children}</p>;
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
type Step = "open" | "close" | "none" | "tight" | "normal";

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
  to?: string;
  children: ReactNode;
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
  open: boolean;
  children: ReactNode;
  id: string;
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

