import type { ReactNode } from "react";
import { TextLink } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";

/**
 * How a subpage ends: one line and one link, then the footer. Never a navy
 * band, never a button pair (site plan section 5, "Closings").
 *
 * Internal links take `to`, the show site and other outside links take
 * `href` and get the external mark.
 */
export function ClosingLine({
  children,
  link,
  rule = false,
  className = "",
}: {
  /** The one sentence. Comes from COPY via useBlock on the page. */
  children: ReactNode;
  link: { label: ReactNode; to?: string; href?: string };
  /** A 1.5px rule above, for a page whose last block is not prose. */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div className={`${rule ? "hairline pt-8" : ""} ${className}`}>
      <p className="t-lead max-w-[56ch] text-ink">{children}</p>
      <p className="mt-3">
        {link.to ? (
          <TextLink to={link.to}>
            {link.label}
            <IconArrow size={15} />
          </TextLink>
        ) : (
          <TextLink href={link.href}>
            {link.label}
            <IconExternal size={14} />
          </TextLink>
        )}
      </p>
    </div>
  );
}
