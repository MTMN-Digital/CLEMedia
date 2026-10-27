import type { ReactNode } from "react";
import { Notice, EmptyState } from "./basics";

export interface Column<T> {
  /** Stable key for React. */
  key: string;
  /** Header text, and the small label above the value on a phone. */
  label: string;
  render: (row: T) => ReactNode;
  /** On a phone, this column becomes the card's title (no label above it). One per table. */
  primary?: boolean;
  /** Hide on a phone, for detail the card does not need. */
  hideOnPhone?: boolean;
  /** Right-aligned tabular figures (prices, counts, dates). */
  numeric?: boolean;
}

/**
 * A table on a desk, a stack of cards on a phone (under 720px). Handles its
 * own loading, error and empty states so every list in the console says the
 * same thing in the same way.
 *
 * `onRowClick` makes the whole row open the item; put a real link or button
 * in the primary column too, so keyboard users can reach it.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  onRowClick,
  loading,
  error,
  empty,
  caption,
}: {
  rows: T[] | null;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: string | null;
  /** Shown when there are no rows. */
  empty: { body?: ReactNode; title: string; action?: ReactNode };
  /** Read by screen readers only. */
  caption?: string;
}) {
  if (error) return <Notice tone="error">{error}</Notice>;
  if (loading && !rows) return <p className="adm-muted" role="status">Loading...</p>;
  if (!rows || rows.length === 0) return <EmptyState {...empty} />;
  return (
    <table className="adm-table">
      {caption && <caption className="adm-sr">{caption}</caption>}
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col" style={c.numeric ? { textAlign: "right" } : undefined}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={rowKey(r)}
            data-clickable={onRowClick ? "true" : undefined}
            onClick={
              onRowClick
                ? (e) => {
                    // A click on a control inside the row does its own thing.
                    if ((e.target as HTMLElement).closest("a,button,input,select,textarea,label")) return;
                    onRowClick(r);
                  }
                : undefined
            }
          >
            {columns.map((c) => (
              <td
                key={c.key}
                data-label={c.label}
                data-primary={c.primary ? "true" : undefined}
                data-hide-phone={c.hideOnPhone ? "true" : undefined}
                className={c.numeric ? "adm-num" : undefined}
                style={c.numeric ? { textAlign: "right" } : undefined}
              >
                {c.render(r)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
