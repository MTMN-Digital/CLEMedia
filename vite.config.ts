import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
