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

export function SectionHeading({
  kicker,
  title,
  lead,
  id,
  size = "h2",
  align = "start",
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  size?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
}) {
  const H = (size === "h1" ? "h1" : "h2") as ElementType;
  const centred = align === "center";
  return (
    <div className={`${centred ? "mx-auto text-center" : ""} ${className}`}>
      {kicker && <Kicker className="mb-4">{kicker}</Kicker>}
      <H id={id} className={`t-${size} ${centred ? "mx-auto" : ""} max-w-[22ch]`}>
        {title}
      </H>
      {lead && <Lead className={`mt-5 ${centred ? "mx-auto" : ""}`}>{lead}</Lead>}
    </div>
  );
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

/** Sits inside a card. Warmer and darker than it, never another sheet of white. */
export function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tile rounded-[var(--radius-md)] ${className}`}>{children}</div>;
}

/** Sits below the ground. Note: muted and red are AA-large only on this fill,
 *  so body copy in a well uses --color-body or --color-ink. */
export function Well({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`well rounded-[var(--radius-lg)] ${className}`}>{children}</div>;
}

/** Deprecated alias kept so the not-yet-rewritten pages compile. */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  variant?: string;
  tone?: string;
}) {
  return <Card className={className}>{children}</Card>;
}

/* ---------------------------------------------------------------------------
   The people card.

   An arch, which is the shape pawsitivepugs.com already uses for a person on
   its creative-team section. The one silhouette worth carrying over.
--------------------------------------------------------------------------- */

export interface ArchPerson {
  name: string;
  role: string;
  body?: ReactNode;
  portrait?: ReactNode;
}

export function ArchCard({ person, className = "" }: { person: ArchPerson; className?: string }) {
  return (
    <article
      className={`card flex h-full flex-col items-center px-6 pb-8 pt-6 text-center ${className}`}
      style={{ borderRadius: "9999px 9999px var(--radius-md) var(--radius-md)" }}
    >
      {person.portrait && (
        <div className="well aspect-square w-[76%] overflow-hidden rounded-full">{person.portrait}</div>
      )}
      <h3 className="t-h3 mt-6">{person.name}</h3>
      <p className="eyebrow eyebrow-sm mt-2.5 ">{person.role}</p>
      {person.body && <p className="t-sm mt-4 max-w-[34ch] leading-relaxed text-body">{person.body}</p>}
    </article>
  );
}

/* ---------------------------------------------------------------------------
   The rail. Hairline rows: stage, the person answerable, what happens there.
--------------------------------------------------------------------------- */

export interface RailItem {
  index?: string;
  title: string;
  attribution?: string;
  body: ReactNode;
}

export function Rail({ items, className = "" }: { items: RailItem[]; className?: string }) {
  const cols = items.some((i) => i.attribution)
    ? "md:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)]"
    : "md:grid-cols-[3rem_minmax(0,0.4fr)_minmax(0,1.6fr)]";
  return (
    <ol className={className}>
      {items.map((it) => (
        <li key={it.title} className={`hairline grid grid-cols-1 items-start gap-x-8 gap-y-2 py-7 ${cols}`}>
          {it.index && <span className="tnum font-mono text-[13px] text-muted" aria-hidden="true">{it.index}</span>}
          <div>
            <h3 className="t-h3">{it.title}</h3>
            {it.attribution && <p className="eyebrow eyebrow-sm mt-2 ">{it.attribution}</p>}
          </div>
          <div className="t-body text-body">{it.body}</div>
        </li>
      ))}
    </ol>
  );
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
   *  and the buy button. It was two different sets of inline `!px-* !py-*
   *  !text-*` escapes that did not agree with each other. */
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

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="well rounded-[var(--radius-lg)] px-6 py-12 text-center">
      <p className="t-h3 font-display">{title}</p>
      <p className="t-sm mx-auto mt-3 max-w-[46ch] text-body">{body}</p>
    </div>
  );
}

/** Deprecated, from the chassis pass. */
export function Capsule({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Card className={className}>{children}</Card>;
}
