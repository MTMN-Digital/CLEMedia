/**
 * One element, captured, for judging a design change by eye.
 *
 *   node scripts/qa/shot.mjs <url> <selector> <out.png> [width]
 *
 * It forces the reveal classes on before it shoots, because every staged
 * object on this site starts life hidden and a screenshot of the pre-reveal
 * state is a photograph of nothing.
 */
import { createRequire } from "node:module";
const require = createRequire("/home/david/Documents/GitHub/internal/M.ind/node_modules/playwright/package.json");
const { chromium } = require("playwright");
import { chromePath } from "./chrome.mjs";
const [url, sel, out, w] = [process.argv[2], process.argv[3], process.argv[4], Number(process.argv[5] || 1440)];
const b = await chromium.launch({ headless: true, executablePath: chromePath(chromium) });
const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto(url, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1200);
await p.evaluate(() => document.querySelectorAll(".settle,.wipe,.is-armed").forEach((e) => e.classList.add("is-in")));
const loc = p.locator(sel).first();
const box = await loc.boundingBox();
if (!box) { console.log("NOT FOUND", sel); await b.close(); process.exit(1); }
await p.evaluate((y) => window.scrollTo(0, y), Math.max(0, box.y - 180));
await p.waitForTimeout(2600);
await loc.screenshot({ path: out });
console.log("ok", out, JSON.stringify(box));
await b.close();
