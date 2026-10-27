/**
 * Every text size and every line weight on one page, counted.
 *
 *   node scripts/qa/sizes.mjs <url> [width]
 *
 * Text: visible elements with their own text, grouped by computed size.
 * Lines: borders, <hr> and SVG strokes, grouped by painted width.
 */
import { createRequire } from "node:module";
const require = createRequire("/home/david/Documents/GitHub/internal/iacchus/node_modules/playwright/package.json");
const { chromium } = require("playwright");
import { chromePath } from "./chrome.mjs";
const [url, w] = [process.argv[2], Number(process.argv[3] || 1440)];
const b = await chromium.launch({ headless: true, executablePath: chromePath(chromium) });
const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(1500);
await p.evaluate(() => document.querySelectorAll(".settle,.wipe,.is-armed").forEach((e) => e.classList.add("is-in")));
const out = await p.evaluate(() => {
  const text = {}, lines = {};
  const add = (o, k, s) => ((o[k] ||= []).length < 6 && o[k].push(s), (o[k].n = (o[k].n || 0) + 1));
  const name = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  for (const e of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden" || !e.getClientRects().length) continue;
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own && !e.closest(".sr-only")) add(text, cs.fontSize, name(e) + ' "' + e.textContent.trim().slice(0, 30) + '"');
    for (const s of ["Top", "Bottom", "Left", "Right"]) {
      const bw = parseFloat(cs["border" + s + "Width"]);
      if (bw > 0 && cs["border" + s + "Style"] !== "none") add(lines, "border " + bw + "px", name(e));
    }
    if (e instanceof SVGElement && cs.stroke !== "none" && parseFloat(cs.strokeWidth) > 0) {
      const svg = e.ownerSVGElement, vb = svg?.viewBox?.baseVal, r = svg?.getBoundingClientRect();
      const k = vb && vb.width ? r.width / vb.width : 1;
      add(lines, "stroke " + (parseFloat(cs.strokeWidth) * k).toFixed(2) + "px", name(svg?.parentElement || e));
    }
  }
  return { text, lines };
});
const sort = (o) => Object.entries(o).sort((a, b) => parseFloat(a[0].replace(/[a-z ]/g, "")) - parseFloat(b[0].replace(/[a-z ]/g, "")));
console.log("TEXT"); for (const [k, v] of sort(out.text)) console.log(k.padEnd(10), String(v.n).padStart(4), v.slice(0, 4).join(" | "));
console.log("LINES"); for (const [k, v] of sort(out.lines)) console.log(k.padEnd(18), String(v.n).padStart(4), [...new Set(v)].slice(0, 4).join(" | "));
await b.close();
