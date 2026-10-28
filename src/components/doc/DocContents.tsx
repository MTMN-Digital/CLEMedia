import { useState } from "react";
import { DisclosurePanel } from "@/components/ui";
import { IconArrow } from "@/components/icons";

export interface ContentsItem {
  /** The anchor: the `id` of the clause's `<section>` (see DocClause). */
  id: string;
  /** The mark in the margin: "1", "2", "A". */
  n: string;
  label: string;
}

/**
 * The index. Shared by the sticky rail on a desktop and the disclosure on a
 * phone, so the two can never drift apart. `active` is the section the reader
 * is in (useActiveSection); it is only ever a mark, never a scroll.
 */
export function ContentsList({
  items,
  active,
  onPick,
}: {
  active: string;
  onPick?: () => void;
  items: ContentsItem[];
}) {
  return (
    <ol>
      {items.map((s) => {
        const on = active === s.id;
        return (
          <li key={s.id} className={`border-l-2 pl-3 ${on ? "border-red" : "border-transparent"}`}>
            <a
              href={`#${s.id}`}
              onClick={onPick}
              aria-current={on ? "true" : undefined}
              className={`grid grid-cols-[1.35rem_minmax(0,1fr)] items-baseline gap-x-2 py-[0.3rem] text-[16px] leading-snug transition-colors ${
                on ? "font-semibold text-ink" : "text-body hover:text-ink"
              }`}
            >
              <span className={`tnum font-mono text-[13.5px] ${on ? "text-red-deep" : "text-muted"}`}>{s.n}</span>
              <span>{s.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The contents column of a document: "CONTENTS" over the list, sticky beside
 * the clauses at `lg`, and a closed disclosure on a phone (where a sticky rail
 * would eat the screen the document needs). Place it as the first child of
 * DOC_GRID.
 *
 * `summary` is the count the phone bar prints: "8 sections",
 * "6 clauses, 1 appendix".
 */
export function DocContents({
  items,
  active,
  summary,
  id = "doc-contents",
}: {
  items: ContentsItem[];
  active: string;
  summary: string;
  /** DOM id of the phone panel; unique per page. */
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="hidden font-mono text-[14px] uppercase tracking-[0.14em] text-muted lg:block">Contents</p>
      <div className="mt-4 hidden lg:block">
        <ContentsList items={items} active={active} />
      </div>

      <div className="border-y-[1.5px] border-rule lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-[44px] w-full items-center justify-between gap-4 py-3.5 text-left font-mono text-[14.5px] uppercase tracking-[0.14em] text-ink"
        >
          Contents
          <span className="flex items-center gap-3">
            <span className="tnum text-muted">{summary}</span>
            <span
              aria-hidden="true"
              className={`text-red-deep transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
            >
              <IconArrow size={15} />
            </span>
          </span>
        </button>
        <DisclosurePanel id={id} open={open}>
          <div className="pb-4">
            <ContentsList items={items} active={active} onPick={() => setOpen(false)} />
          </div>
        </DisclosurePanel>
      </div>
    </div>
  );
}
