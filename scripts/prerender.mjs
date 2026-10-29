/* Writes each fixed page as real HTML after `vite build`, so a phone paints the
 * page from the first response instead of waiting for the JavaScript to build
 * it. React then takes the markup over in place (hydrateRoot in main.tsx).
 *
 *   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
 *
 * Uses React's own server renderer, not a browser, so the Vercel build needs
 * nothing extra installed.
 *
 * What the HTML holds is the page's first render: the copy shipped in the
 * source and the loading state of anything read from the database. The CMS
 * text and the database rows still arrive in the browser exactly as before.
 *
 * NOT PRERENDERED: home (the hero film picks its file from the screen size
 * while rendering), journal posts and products (slugs live in the database),
 * /download, /admin and the 404. They keep the empty shell, now at /spa.html (served as /spa),
 * which vercel.json rewrites everything else to.
 *
 * ponytail: the route list is by hand, like ROUTE_PAGES in vite.config.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";

process.env.NODE_ENV = "production";

const ROUTES = ["/story", "/team", "/ethical-ai", "/case-study", "/journal", "/app", "/media", "/shop", "/contact", "/privacy", "/terms", "/cookies"];

const dist = new URL("../dist/", import.meta.url);
const template = readFileSync(new URL("index.html", dist), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("dist/index.html has no empty #root to fill");
writeFileSync(new URL("spa.html", dist), template);

const { render } = await import(new URL("../dist-ssr/entry-server.js", import.meta.url).href);

/* The route map routePreload (vite.config.ts) wrote into the template. A
   prerendered page has no use for the script that reads it: its markup needs
   its own stylesheet BEFORE first paint, so that goes in as an ordinary,
   render-blocking link.

   Its JavaScript gets NO preloads, and Vite's own modulepreloads come out too.
   The page is already painted from the HTML, so the code is only needed to
   take it over, and preloading 100KB of it in the head made it compete with
   the stylesheet and fonts the first paint does need: measured on /story,
   mobile Lighthouse 92 with them, 96 without. */
const loader = template.match(/<script>\(function\(\)\{var m=(\{.*?\});.*?<\/script>/);
if (!loader) throw new Error("dist/index.html has no route-preload map");
const chunks = JSON.parse(loader[1]);

for (const route of ROUTES) {
  const { html, head } = await render(route);
  if (!html) throw new Error(`${route} rendered nothing`);
  const tags = (chunks[route.slice(1)] ?? [])
    .filter((f) => f.endsWith(".css"))
    .map((f) => `<link rel="stylesheet" crossorigin href="/${f}">`)
    .join("");
  let page = template
    .replace(loader[0], tags)
    .replace(/<link rel="modulepreload"[^>]*>\s*/g, "")
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (head.includes("<title")) page = page.replace(/<title>[^<]*<\/title>/, "");
  page = page.replace("</head>", `${head}</head>`);
  // contact.html, not contact/index.html: Vercel's cleanUrls serves the
  // first at /contact, and the directory form 404s or redirects there.
  writeFileSync(new URL(`.${route}.html`, dist), page);
  console.log(`prerendered ${route} (${Math.round(page.length / 1024)} KB)`);
}
