import type { ReactNode } from "react";
import { REVISED_LABEL } from "./dates";

/**
 * One numbered clause. The `<section id>` is what useActiveSection reads and
 * what the contents rail links to, so `id` must match the ContentsItem.
 *
 * The number is a mono mark in the margin at `sm` and up and moves inline
 * before the heading on a phone. Mono margin numerals are a document-only
 * device (cross-site rule 3): only /ethical-ai and the legal pages mount this.
 *
 * Body type is 17px / 1.64 (`.t-body`) for all four documents. The legal
 * shell used to set 16px, under the client's "too small" floor.
 */
export function DocClause({
  id,
  n,
  title,
  children,
  className = "",
}: {
  id: string;
  n: string;
  /** A noun phrase naming what the clause holds, never a claim. */
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-28 pt-9 sm:pt-11 ${className}`}>
      <div className="grid gap-x-5 sm:grid-cols-[2rem_minmax(0,1fr)]">
        <p aria-hidden="true" className="tnum hidden font-mono text-[14px] leading-[2.4] text-muted sm:block">
          {n}
        </p>
        <div>
          <h2 id={`${id}-h`} className="t-h3 font-sans font-bold tracking-[-0.01em]">
            <span
              aria-hidden="true"
              className="tnum mr-2 font-mono text-[14px] font-normal tracking-normal text-muted sm:hidden"
            >
              {n}
            </span>
            {title}
          </h2>
          <div className="t-body mt-4 space-y-4 text-body">{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * A sub-clause (2.1, 4.3, 5.6) inside a DocClause body. Numbered inline in
 * mono, the title one step under `.t-h3` in sans bold. Not a `<section>`, so
 * the contents rail's active mark stays on the parent clause.
 */
export function DocSubClause({
  n,
  title,
  children,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  n: string;
}) {
  return (
    <div className={`border-t-[1.5px] border-rule pt-5 ${className}`}>
      <h3 className="font-sans text-[1.25rem] font-bold leading-snug text-ink">
        <span className="tnum mr-2.5 font-mono text-[14px] font-normal text-muted">{n}</span>
        {title}
      </h3>
      <div className="t-body mt-3 space-y-3 text-body">{children}</div>
    </div>
  );
}

/** The document's foot line, under the last clause: "Privacy policy.
 *  Wording last revised 24 October 2026." Never "Draft", never a version. */
export function DocFoot({ title, revised }: { revised: string; title: string }) {
  return (
    <p className="mt-12 border-t-[1.5px] border-rule pt-5 font-mono text-[14.5px] text-muted">
      {title}. {REVISED_LABEL} <span className="tnum">{revised}</span>.
    </p>
  );
}
