import type { ReactNode } from "react";

/* ============================================================================
   An empty slot, stated as one.

   Mirrors how /shop treats an empty shelf and how /media treats an empty press
   strip: the gap is drawn and labelled rather than filled. A dashed outline
   says "not here yet" without the page claiming anything exists. Every slot on
   /case-study is a thing the client has not supplied, and each one is listed
   in the build report for CONTENT-NEEDED.md.

   The label is plain text in the body colour, not dimmed with opacity, so it
   keeps its contrast on both the paper and the well.
   ========================================================================== */

export function Slot({
  title,
  coming,
  children,
}: {
  title: string;
  /** One plain line on what is coming. */
  coming: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[rgba(74,53,42,0.55)] px-5 py-5 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-body">Not supplied yet</p>
      <h3 className="t-h3 mt-3">{title}</h3>
      <p className="t-body mt-2 max-w-[48ch] text-body">{coming}</p>
      {children}
    </div>
  );
}
