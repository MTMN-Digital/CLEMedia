import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/* ============================================================================
   The document shell: a sheet of card with tabs on its top edge.

   Shared by the two kinds of page the subpage plan calls documents: the three
   legal policies (/privacy, /terms, /cookies) and the Responsible AI position
   (/ethical-ai). By the cross-site rules the tab, the card sheet, the contents
   rail and the mono clause numerals belong to these four routes and nothing
   else, so nothing outside them imports from components/doc except
   DocumentsShelf (which is only mounted on these four routes too).

   Extracted from the legal shell as built, unchanged in look: 2px tab edges,
   the raised tab in the sheet's own colour, 44px targets, `.card-stock`.
   ========================================================================== */

export interface DocTab {
  label: string;
  /** Route the tab links to. A tab with no `to` is a label, not a link. */
  to?: string;
  /** The document in hand: raised into the sheet. */
  current?: boolean;
}

export function DocSheet({
  tabs,
  navLabel = "Documents",
  width = "legal",
  className = "",
  children,
}: {
  tabs: DocTab[];
  /** aria-label for the tab row when it holds links. */
  navLabel?: string;
  /** "legal": 70rem, flush left (the legal set). "wide": 86rem, centred, the
   *  width ProductionFlat was tuned for (/ethical-ai). */
  width?: "legal" | "wide";
  className?: string;
  children: ReactNode;
}) {
  const box = width === "wide" ? "mx-auto max-w-[86rem]" : "max-w-[70rem]";
  const linked = tabs.some((t) => t.to);
  const row = (
    <>
      {tabs.map((t) => {
        const cls = `flex min-h-[44px] items-center rounded-t-[7px] border-2 border-b-0 px-4 font-mono text-[14.5px] uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-colors ${
          t.current
            ? "border-raised bg-raised pb-0.5 text-ink"
            : "mt-1 border-sunken bg-sunken text-body hover:text-ink"
        }`;
        return t.to ? (
          <Link key={t.label} to={t.to} aria-current={t.current ? "page" : undefined} className={cls}>
            {t.label}
          </Link>
        ) : (
          <span key={t.label} className={cls}>
            {t.label}
          </span>
        );
      })}
    </>
  );
  return (
    <div className={`relative ${box} ${className}`}>
      {linked ? (
        <nav aria-label={navLabel} className="flex gap-1 pl-5 sm:pl-7">
          {row}
        </nav>
      ) : (
        <div className="flex gap-1 pl-5 sm:pl-7">{row}</div>
      )}
      <div className="card-stock px-5 py-9 sm:px-8 sm:py-11 lg:px-14 lg:py-16">{children}</div>
    </div>
  );
}

/**
 * The body grid inside the sheet: the contents rail on the left, the clauses
 * on the right in a 68ch column. The title block may use the same grid so the
 * cover and the clauses share one set of column lines (the legal plan does).
 */
export const DOC_GRID = "grid gap-9 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20";

/** The mono publisher line at the head of every title block. */
export function DocPublisher({ children = "CLÉ Family Media" }: { children?: ReactNode }) {
  return <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">{children}</p>;
}
