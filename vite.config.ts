import { fileURLToPath, URL } from "node:url";
import { type Plugin, defineConfig } from "vite";
import type { OutputChunk } from "rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Every route but home is a lazy chunk, so a visitor landing on /contact used
   to wait for the main bundle to download and run before the browser even
   learned Contact's chunk existed: two round trips in series before the first
   paint of the page they asked for. This writes a tiny map of route to chunk
   files into the HTML, and an inline script fetches the landing route's chunk
   alongside the main bundle instead of after it.

   ponytail: the route-to-page list repeats App.tsx's routes by hand. A route
   missing here still works, it just loads the old, slower way. */
const ROUTE_PAGES: Record<string, string> = {
  story: "Story", team: "Team", "ethical-ai": "EthicalAi", "case-study": "CaseStudy",
  journal: "Journal", "journal/*": "JournalPost", app: "AppPage", media: "Media",
  shop: "Shop", "shop/*": "ShopProduct", contact: "Contact", "download/*": "Download",
  privacy: "Legal", terms: "Legal", cookies: "Legal",
};

function routePreload(): Plugin {
  return {
    name: "route-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        const files = (page: string) => {
          const entry = Object.values(bundle).find(
            (c): c is OutputChunk => c.type === "chunk" && c.isDynamicEntry && !!c.facadeModuleId?.endsWith(`/src/pages/${page}.tsx`),
          );
          if (!entry) return null;
          const out = new Set<string>();
          const walk = (c: OutputChunk) => {
            if (out.has(c.fileName)) return;
            out.add(c.fileName);
            c.viteMetadata?.importedCss.forEach((f) => out.add(f));
            c.imports.forEach((f) => {
              const dep = bundle[f];
              if (dep?.type === "chunk") walk(dep);
            });
          };
          walk(entry);
          return [...out];
        };
        const map: Record<string, string[]> = {};
        for (const [route, page] of Object.entries(ROUTE_PAGES)) {
          const f = files(page);
          if (f) map[route] = f;
        }
        const script = `<script>(function(){var m=${JSON.stringify(map)};var s=location.pathname.split("/").filter(Boolean);var f=m[s[0]+(s.length>1?"/*":"")];if(!f)return;f.forEach(function(h){var l=document.createElement("link");if(/\\.css$/.test(h)){l.rel="stylesheet"}else{l.rel="modulepreload";l.crossOrigin=""}l.href="/"+h;document.head.appendChild(l)})})()</script>`;
        return html.replace("</title>", `</title>\n    ${script}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routePreload()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Shared runtime gets its own chunk. Without this, Rollup folds React
          // and the router into the "admin" chunk below (its first importer),
          // and every public page then preloads the admin chunk and Supabase.
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run|react-helmet-async)\//.test(id)) return "vendor";
          // The public CMS read layer and Vite's preload helper are shared with
          // the admin too; left alone they land in the admin chunk as well.
          if (id.includes("vite/preload-helper")) return "vendor";
          if (id.includes("/src/lib/content.ts")) return "content";
          // Keep the admin panel out of the public bundle.
          if (id.includes("/src/pages/admin/")) return "admin";
          if (id.includes("node_modules/@supabase") || id.includes("/src/lib/supabase.ts")) return "supabase";
        },
      },
    },
  },
});
