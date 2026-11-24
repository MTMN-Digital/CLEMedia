import { lazy, type LazyExoticComponent, type ComponentType } from "react";

/* Every panel's chunk loader, so the shell can fetch them all once the
   console is open and switching sections never waits on the network. */
const loaders: (() => Promise<unknown>)[] = [];
function load<T extends ComponentType<object>>(f: () => Promise<{ default: T }>): LazyExoticComponent<T> {
  loaders.push(f);
  return lazy(f);
}
export function preloadPanels() {
  for (const f of loaders) f().catch(() => {});
}
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
  key: "app" | "journal" | "inbox" | "media" | "quotes" | "enquiries" | "shop" | "pages" | "contacts" | "people" | "episodes" | "links";
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
    key: "inbox",
    label: "Inbox",
    blurb: "Enquiries, sign-ups and orders, everything that arrives by email",
    path: "/admin/inbox",
    file: "src/components/admin/inbox/InboxPanel.tsx",
    exportName: "InboxPanel",
    Component: load(() => import("@/components/admin/inbox/InboxPanel").then((m) => ({ default: m.InboxPanel }))),
    count: async () => {
      const c = await countRows("enquiries", { handled: false });
      return c == null ? null : c ? { text: `${c} new`, tone: "alert" } : { text: "Nothing new", tone: "off" };
    },
  },
  {
    key: "contacts",
    label: "People",
    blurb: "Everyone who has enquired, signed up or bought",
    path: "/admin/contacts",
    file: "src/components/admin/contacts/ContactsPanel.tsx",
    exportName: "ContactsPanel",
    Component: load(() => import("@/components/admin/contacts/ContactsPanel").then((m) => ({ default: m.ContactsPanel }))),
  },
  {
    key: "pages",
    label: "Pages and photos",
    blurb: "Headlines, words and pictures on every page",
    path: "/admin/pages",
    file: "src/components/admin/pages/PagesPanel.tsx",
    exportName: "PagesPanel",
    Component: load(() => import("@/components/admin/pages/PagesPanel").then((m) => ({ default: m.PagesPanel }))),
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
    Component: load(() => import("@/components/admin/journal/JournalPanel").then((m) => ({ default: m.JournalPanel }))),
    count: async () => {
      const [pub, draft] = await Promise.all([countRows("posts", { status: "published" }), countRows("posts", { status: "draft" })]);
      if (pub == null) return null;
      return { text: `${pub} published${draft ? `, ${n(draft, "draft", "drafts")}` : ""}`, tone: "off" };
    },
  },
  {
    key: "people",
    label: "Team and experts",
    blurb: "Profiles, photos, bios and running order",
    path: "/admin/people",
    file: "src/components/admin/people/PeoplePanel.tsx",
    exportName: "PeoplePanel",
    Component: load(() => import("@/components/admin/people/PeoplePanel").then((m) => ({ default: m.PeoplePanel }))),
  },
  {
    key: "episodes",
    label: "Episodes",
    blurb: "Titles, thumbnails and YouTube links",
    path: "/admin/episodes",
    file: "src/components/admin/episodes/EpisodesPanel.tsx",
    exportName: "EpisodesPanel",
    Component: load(() => import("@/components/admin/episodes/EpisodesPanel").then((m) => ({ default: m.EpisodesPanel }))),
    count: async () => {
      const c = await countRows("episodes", { visible: true });
      return c == null ? null : { text: `${n(c, "episode", "episodes")} shown`, tone: "off" };
    },
  },
  {
    key: "quotes",
    label: "Quotes",
    blurb: "Parent and educator quotations on the home page",
    path: "/admin/quotes",
    file: "src/components/admin/quotes/QuotesPanel.tsx",
    exportName: "QuotesPanel",
    Component: load(() => import("@/components/admin/quotes/QuotesPanel").then((m) => ({ default: m.QuotesPanel }))),
  },
  {
    key: "media",
    label: "Media and podcast",
    blurb: "Press, interviews and podcast appearances",
    path: "/admin/media",
    file: "src/components/admin/media/MediaPanel.tsx",
    exportName: "MediaPanel",
    Component: load(() => import("@/components/admin/media/MediaPanel").then((m) => ({ default: m.MediaPanel }))),
  },
  {
    key: "shop",
    label: "Shop",
    blurb: "Products, prices, files and orders",
    path: "/admin/shop",
    file: "src/components/admin/shop/ShopPanel.tsx",
    exportName: "ShopPanel",
    Component: load(() => import("@/components/admin/shop/ShopPanel").then((m) => ({ default: m.ShopPanel }))),
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
    Component: load(() => import("@/components/admin/app/AppPanel").then((m) => ({ default: m.AppPanel }))),
  },
  {
    key: "links",
    label: "Links and settings",
    blurb: "Social accounts and other site links",
    path: "/admin/links",
    file: "src/components/admin/links/LinksPanel.tsx",
    exportName: "LinksPanel",
    Component: load(() => import("@/components/admin/links/LinksPanel").then((m) => ({ default: m.LinksPanel }))),
  },
  {
    key: "enquiries",
    label: "Enquiries",
    blurb: "Messages from the contact page",
    path: "/admin/enquiries",
    file: "src/components/admin/enquiries/EnquiriesPanel.tsx",
    exportName: "EnquiriesPanel",
    Component: load(() => import("@/components/admin/enquiries/EnquiriesPanel").then((m) => ({ default: m.EnquiriesPanel }))),
    count: async () => {
      const c = await countRows("enquiries", { handled: false });
      return c == null ? null : c ? { text: `${c} new`, tone: "alert" } : { text: "Nothing new", tone: "off" };
    },
  },
];
