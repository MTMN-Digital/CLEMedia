import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import { countRows } from "@/lib/admin";
import type { PillTone } from "@/components/admin/kit";

/* ============================================================================
   The console's sections. FROZEN for the 2026-10-27-admin shards.

   Each panel is its own lazy chunk, mounted by Admin.tsx at
   /admin/<key>/*. Inside, a panel may use nested <Routes> with RELATIVE
   paths ("" / "new" / ":id"), and links within it are absolute
   ("/admin/shop/new") so they read plainly.

   The order here is the order in the nav and on the home view.
   ========================================================================== */

export interface PanelCount {
  text: string;
  tone: PillTone;
}

export interface PanelDef {
  key: "links" | "enquiries" | "app" | "pages" | "journal" | "shop" | "media" | "people";
  label: string;
  blurb: string;
  /** Route, always /admin/<key>. */
  path: string;
  /** For the contract: the file and export the shard delivers. */
  file: string;
  exportName: string;
  Component: LazyExoticComponent<ComponentType>;
  /** A short honest figure for the home tile, or null to show none. */
  count?: () => Promise<PanelCount | null>;
}

const n = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;

export const PANELS: PanelDef[] = [
  {
    key: "pages",
    label: "Pages and photos",
    blurb: "Headlines, words and pictures on every page",
    path: "/admin/pages",
    file: "src/components/admin/pages/PagesPanel.tsx",
    exportName: "PagesPanel",
    Component: lazy(() => import("@/components/admin/pages/PagesPanel").then((m) => ({ default: m.PagesPanel }))),
    count: async () => {
      const c = await countRows("content_blocks");
      return c ? { text: `${n(c, "change", "changes")} from the original`, tone: "off" } : null;
    },
  },
  {
    key: "journal",
    label: "Journal",
    blurb: "Write, schedule and publish posts",
    path: "/admin/journal",
    file: "src/components/admin/journal/JournalPanel.tsx",
    exportName: "JournalPanel",
    Component: lazy(() => import("@/components/admin/journal/JournalPanel").then((m) => ({ default: m.JournalPanel }))),
    count: async () => {
      const [pub, draft] = await Promise.all([countRows("posts", { status: "published" }), countRows("posts", { status: "draft" })]);
      if (pub == null) return null;
      return { text: `${pub} published${draft ? `, ${n(draft, "draft", "drafts")}` : ""}`, tone: "off" };
    },
  },
  {
    key: "people",
    label: "Team and advisers",
    blurb: "Profiles, photos, bios and running order",
    path: "/admin/people",
    file: "src/components/admin/people/PeoplePanel.tsx",
    exportName: "PeoplePanel",
    Component: lazy(() => import("@/components/admin/people/PeoplePanel").then((m) => ({ default: m.PeoplePanel }))),
  },
  {
    key: "media",
    label: "Media and podcast",
    blurb: "Press, interviews and podcast appearances",
    path: "/admin/media",
    file: "src/components/admin/media/MediaPanel.tsx",
    exportName: "MediaPanel",
    Component: lazy(() => import("@/components/admin/media/MediaPanel").then((m) => ({ default: m.MediaPanel }))),
  },
  {
    key: "shop",
    label: "Shop",
    blurb: "Products, prices, files and orders",
    path: "/admin/shop",
    file: "src/components/admin/shop/ShopPanel.tsx",
    exportName: "ShopPanel",
    Component: lazy(() => import("@/components/admin/shop/ShopPanel").then((m) => ({ default: m.ShopPanel }))),
    count: async () => {
      const on = await countRows("products", { active: true });
      return on == null ? null : { text: `${n(on, "product", "products")} on sale`, tone: on ? "ok" : "off" };
    },
  },
  {
    key: "app",
    label: "App",
    blurb: "The launch switch and the store links",
    path: "/admin/app",
    file: "src/components/admin/app/AppPanel.tsx",
    exportName: "AppPanel",
    Component: lazy(() => import("@/components/admin/app/AppPanel").then((m) => ({ default: m.AppPanel }))),
  },
  {
    key: "links",
    label: "Links and settings",
    blurb: "Social accounts and other site links",
    path: "/admin/links",
    file: "src/components/admin/links/LinksPanel.tsx",
    exportName: "LinksPanel",
    Component: lazy(() => import("@/components/admin/links/LinksPanel").then((m) => ({ default: m.LinksPanel }))),
  },
  {
    key: "enquiries",
    label: "Enquiries",
    blurb: "Messages from the contact page",
    path: "/admin/enquiries",
    file: "src/components/admin/enquiries/EnquiriesPanel.tsx",
    exportName: "EnquiriesPanel",
    Component: lazy(() => import("@/components/admin/enquiries/EnquiriesPanel").then((m) => ({ default: m.EnquiriesPanel }))),
    count: async () => {
      const c = await countRows("enquiries", { handled: false });
      return c == null ? null : c ? { text: `${c} new`, tone: "alert" } : { text: "Nothing new", tone: "off" };
    },
  },
];
