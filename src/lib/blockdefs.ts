import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   Block types and the builders page registries use. Split out of blocks.ts
   so each page's own cms.ts can build its blocks without a circular import:
   blocks.ts imports every cms.ts, and cms.ts imports only this file.
   ========================================================================== */

export type PageId =
  | "media"
  | "app"
  | "story"
  | "privacy"
  | "terms"
  | "journal"
  | "shop"
  | "404"
  | "contact"
  | "case-study"
  | "ethical-ai"
  | "home"
  | "team"
  | "cookies";

/** line: one line of plain text. paragraph: several lines; for `multi`
 *  blocks, paragraphs are separated by a blank line. image: { url, alt }. */
export type BlockKind = "line" | "paragraph" | "list" | "image";

/** Which shard wires a page's blocks into the page component. */
export type WiredBy = "media-app-links" | "cms-wiring" | "shop";

export interface BlockDef {
  page: PageId;
  key: string;
  /** What the editor sees. Plain words: where it is on the page and what it is. */
  label: string;
  kind: BlockKind;
  /** Can never be saved empty. Every text block is required; images are not. */
  required: boolean;
  /** Group heading in the editor, in page order. */
  section: string;
  /** The accent clause is written between *stars*. */
  emphasis?: boolean;
  /** Several paragraphs, separated by a blank line (splitParagraphs()). */
  multi?: boolean;
  /** Image blocks: the bundled asset that shows until an upload replaces it. */
  asset?: AssetKey;
  /** Where the default lives, for the wiring shard. Not shown to editors. */
  source: string;
  /** List blocks: the fields every item has, in the order the editor shows them. */
  fields?: ListField[];
  /** List blocks: the page's own items, the default until a list is saved. */
  items?: ListItem[];
  /** List blocks: what one item is called, for "Add a question". Lower case. */
  itemLabel?: string;
  /** List blocks: fewest and most items allowed (default 1 and 30). */
  min?: number;
  max?: number;
}

/** One field of a list item. `line` is one line, `paragraph` several. */
export interface ListField {
  name: string;
  label: string;
  kind: "line" | "paragraph";
  /** Can be left empty. Fields are required unless this is set. */
  optional?: boolean;
}

/** One item of a list block: field name to text. */
export type ListItem = Record<string, string>;

export interface PageDef {
  id: PageId;
  label: string;
  /** The public route, for "View the page". */
  path: string;
  wiredBy: WiredBy;
}

/* ─── Builders ─── */

export const line = (page: PageId, section: string, key: string, label: string, source: string, extra: Partial<BlockDef> = {}): BlockDef => ({
  page, key, label, kind: "line", required: true, section, source, ...extra,
});
export const para = (page: PageId, section: string, key: string, label: string, source: string, extra: Partial<BlockDef> = {}): BlockDef => ({
  page, key, label, kind: "paragraph", required: true, section, source, ...extra,
});
export const image = (page: PageId, section: string, key: string, label: string, asset: AssetKey, source: string): BlockDef => ({
  page, key, label, kind: "image", required: false, section, asset, source,
});
/** An editable list: add, remove and reorder items, each with the same fields. */
export const list = (
  page: PageId,
  section: string,
  key: string,
  label: string,
  source: string,
  itemLabel: string,
  fields: ListField[],
  items: ListItem[],
  extra: Partial<BlockDef> = {},
): BlockDef => ({ page, key, label, kind: "list", required: true, section, source, itemLabel, fields, items, ...extra });
