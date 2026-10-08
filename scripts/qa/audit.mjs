/* Whole-site audit: screenshots, contrast, and horizontal overflow.
 *
 * Run against a built preview:
 *   npx vite build && npx vite preview --port 5371 --strictPort &
 *   node scripts/qa/audit.mjs --port 5371 --out /tmp/audit
 *   node scripts/qa/audit.mjs --port 5371 --out /tmp/audit --width 390 --height 844
 *   node scripts/qa/audit.mjs --port 5371 --only story
 *
 * THIS LIVES IN THE REPO ON PURPOSE. Three separate versions of it were
 * written in a temp directory, each one re-learning the same four traps, and
 * then the directory was cleared and all of it went. The traps are the
 * valuable part, so they are written down here:
 *
 * 1. A fullPage screenshot of this site is a lie. Every section is revealed by
 *    an IntersectionObserver, and a fullPage capture resizes the viewport
 *    under those observers: a correct page photographs as thousands of pixels
 *    of empty cream. The fix is to walk the page in viewport steps and stitch.
 * 2. Sticky elements print again at every step. Stitched captures grew a
 *    second navigation bar every 900 pixels, and a sticky margin column made
 *    a heading on /story appear twice when the DOM had one. Everything sticky
 *    is unstuck for the capture.
 * 3. Reveals are 0.7s transitions that only start when a section first
 *    intersects, so a stop has to outlast them, and a section revealed at the
 *    seam between two stops can be missed entirely. Every reveal is forced to
 *    its finished state before the walk rather than waited for.
 * 4. Contrast cannot be computed from styles on this site. `.wall` and
 *    `.deep` paint with the `background` shorthand, so their computed
 *    `background-color` is transparent, and walking up the tree for a colour
 *    sails past them to the page default. That reported muted text on a dark
 *    band as 5.9:1 when it is 4.44:1: a FALSE PASS. Contrast is measured off
 *    painted pixels by scripts/qa/contrast.py instead.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire("/home/david/Documents/GitHub/internal/M.ind/node_modules/playwright/package.json");
const { chromium } = require("playwright");
const HERE = dirname(fileURLToPath(import.meta.url));

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const PORT = arg("port", "5371");
const OUT = arg("out", "/tmp/audit");
const W = Number(arg("width", 1440));
const H = Number(arg("height", 900));
const ONLY = arg("only", null);
/* Does this thing still fail? A contrast tool that reports zero is worthless
   unless it can be shown to catch a real failure, and four successive versions
   of this one reported numbers that were wrong in four different ways. With
   --calibrate the page gets two extra lines on flat cream paper, one at 3.0:1
   and one at 7.0:1 by hand calculation, and the run asserts it finds the first
   and not the second. Run it after touching contrast.py. */
const CALIBRATE = process.argv.includes("--calibrate");
const CAL = { fail: "CALIBRATION 3.0 to 1", pass: "CALIBRATION 7.0 to 1" };

const PAGES = [
  ["/", "home"], ["/story", "story"], ["/team", "team"], ["/ethical-ai", "ethical-ai"],
  ["/journal", "journal"], ["/app", "app"], ["/media", "media"], ["/shop", "shop"],
  ["/contact", "contact"], ["/privacy", "privacy"], ["/terms", "terms"],
  ["/cookies", "cookies"], ["/nope", "404"],
];

/* The three dynamic routes render their empty state without data, so their real
   state was never measured. `--stub` fulfils the Supabase REST calls in the
   browser with obviously synthetic rows, so the fixture lives here and can
   never reach the repo. The copy says so in its own text, because a fixture
   that reads like content eventually gets believed. */
const STUB = process.argv.includes("--stub");
for (const spec of (arg("also", "") || "").split(",").filter(Boolean)) {
  const [path, name] = spec.split("|");
  PAGES.push([path, name || path.replace(/\W+/g, "-").replace(/^-|-$/g, "")]);
}

const FIX_POST = {
  id: "fix-post", title: "QA fixture piece, not real content", slug: "qa-fixture",
  category_id: "fix-cat",
  excerpt: "A synthetic row served only to the contrast and overflow sweep.",
  body: "Synthetic body paragraph one, long enough to set a real measure across the column and give the sampler a run of body text to read.\n\nSynthetic body paragraph two, so the spread has more than one block in it.",
  hero_image: null, hero_alt: null, status: "published",
  published_at: "2026-01-01T09:00:00Z", author: "QA fixture",
};
const FIX_CAT = { id: "fix-cat", name: "Research", slug: "research", description: "Synthetic strand row.", sort_order: 1 };
const FIX_PRODUCT = {
  id: "fix-prod", title: "QA fixture printable, not a real product", slug: "qa-fixture",
  description: "Synthetic description paragraph one.\n\nSynthetic description paragraph two.",
  price_cents: 350, currency: "eur", thumbnail: null, file_path: "fixture.pdf", active: true,
};

async function installStubs(page) {
  await page.route("**/rest/v1/**", async (route) => {
    const u = new URL(route.request().url());
    const table = u.pathname.split("/rest/v1/")[1]?.split("?")[0];
    /* supabase-js does not expose maybeSingle in the Accept header through the
       interceptor, so the shape is read off the query instead: every list query
       here carries `order`, every single-row one does not. */
    const one = !u.searchParams.has("order");
    const row = table === "products" ? FIX_PRODUCT : table === "categories" ? FIX_CAT : FIX_POST;
    const body = one ? row : table === "posts" ? [FIX_POST, { ...FIX_POST, id: "fix-2", slug: "qa-fixture-2", title: "Second QA fixture piece" }] : [row];
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.route("**/auth/v1/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page.route("**/api/download**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://example.invalid/fixture.pdf",
        title: "QA fixture printable, not a real product",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        downloadsUsed: 1,
        downloadsAllowed: 5,
      }),
    }),
  );
}

/* Headless Chromium renders WebGL through SwiftShader, which Chrome flags as a
   major performance caveat. Production refuses that, rightly, so the flag is
   stripped in the page for the capture only. */
const UNCAVEAT = `const o=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,a){if(a&&"failIfMajorPerformanceCaveat" in a)a={...a,failIfMajorPerformanceCaveat:false};return o.call(this,t,a)};`;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  executablePath: "/home/david/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});

let broken = 0;
let overflow = 0;
let contrast = 0;
const calibration = [];

for (const [path, name] of PAGES) {
  if (ONLY && ONLY !== name) continue;
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.addInitScript(UNCAVEAT);
  if (STUB) await installStubs(page);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));

  try {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      document.querySelectorAll(".settle, .wipe, .is-armed").forEach((e) => e.classList.add("is-in"));
      document.querySelectorAll("*").forEach((e) => {
        if (getComputedStyle(e).position === "sticky") e.style.position = "static";
      });
      document.querySelectorAll("video").forEach((v) => v.pause());
    });
    if (CALIBRATE) {
      await page.evaluate((cal) => {
        const box = document.createElement("div");
        box.style.cssText = "background:#f6f0e2;padding:40px;font:16px/2 system-ui";
        box.innerHTML =
          `<p style="color:#8a8a8a">${cal.fail}</p><p style="color:#505050">${cal.pass}</p>`;
        document.body.insertBefore(box, document.body.firstChild);
      }, CAL);
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 1200));
    });

    const info = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      over: document.documentElement.scrollWidth - window.innerWidth,
      guilty: (() => {
        if (document.documentElement.scrollWidth - window.innerWidth <= 1) return [];
        const out = [];
        document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > window.innerWidth + 1) {
            out.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`);
          }
        });
        return out.slice(0, 3);
      })(),
    }));

    /* Text boxes are collected in document coordinates so the Python side can
       find each one in the tall capture. */
    const items = await page.evaluate(() => {
      const out = [];
      /* Colour is resolved by the browser, never parsed here or in Python.
         Tailwind v4 emits `text-white/90` as
         `oklab(0.999994 0.0000455 0.0000200 / 0.9)`, and a regex that takes
         the first three numbers and scales them by 255 turns that into pure
         RED, which is what the previous version of this measured. Canvas
         accepts any CSS Color 4 string and ImageData is unpremultiplied, so
         one fill on a cleared pixel gives straight RGBA for anything. */
      const cx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      /* Clipped-away text must not be measured. The app page carries three
         device screens stacked in one `overflow-hidden` frame and translated
         sideways, so two of them are invisible but still report a perfectly
         good rect. Measuring those sampled whatever the page happens to paint
         at coordinates the text never reaches, and called a cream label on a
         red button 1.13:1 against a cream it is nowhere near. */
      /* Opacity has to be accumulated up the tree, not read off the element.
         The app page switches the three device screens with `opacity-0` on
         their wrapper, and every label inside an invisible screen still
         computes its own opacity as 1. Measuring those read a cream button
         label against the cream of the screen that is actually showing. */
      const shown = (el) => {
        let o = 1;
        for (let p = el; p; p = p.parentElement) o *= Number(getComputedStyle(p).opacity);
        return o > 0.95;
      };
      const visibleRect = (el) => {
        let r = el.getBoundingClientRect();
        for (let p = el.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p);
          if (o.overflow === "visible" && o.overflowX === "visible" && o.overflowY === "visible") continue;
          const c = p.getBoundingClientRect();
          const left = Math.max(r.left, c.left), right = Math.min(r.right, c.right);
          const top = Math.max(r.top, c.top), bottom = Math.min(r.bottom, c.bottom);
          if (right - left < r.width * 0.9 || bottom - top < r.height * 0.9) return null;
          r = new DOMRect(left, top, right - left, bottom - top);
        }
        return r;
      };
      const resolve = (css) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = "#000";
        cx.fillStyle = css;
        cx.fillRect(0, 0, 1, 1);
        const d = cx.getImageData(0, 0, 1, 1).data;
        /* fillStyle silently keeps its previous value on a string it cannot
           parse, so the #000 above is the tell: opaque black for text that is
           not black means the resolve failed and the sample is dropped. */
        return [d[0], d[1], d[2], d[3] / 255];
      };
      document.querySelectorAll("p,a,span,li,dt,dd,h1,h2,h3,h4,button,label,figcaption,th,td,em,strong").forEach((el) => {
        const text = (el.textContent || "").trim();
        if (!text || el.children.length > 0) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || !shown(el)) return;
        const r = visibleRect(el);
        if (!r || r.width < 10 || r.height < 8) return;
        /* A pinned section cannot be stitched: it is one sticky screen whose
           state changes with scroll, so successive slices photograph the same
           box in different states and stack them. Text inside one is measured
           by hand against a single settled frame instead. */
        if (el.closest(".shot-pin")) return;
        out.push({
          x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY),
          w: Math.round(r.width), h: Math.round(r.height), rgba: resolve(cs.color),
          px: Math.round(parseFloat(cs.fontSize)), bold: parseInt(cs.fontWeight) >= 700,
          t: text.slice(0, 36),
        });
      });
      return out;
    });

    /* Stitched from viewport-sized slices, never by resizing the viewport to
       the page height. Resizing re-lays-out the page: a `100svh` hero becomes
       a 9,000px hero, every element below it moves, and the text boxes
       measured at the real size then point at the wrong pixels. That produced
       49 contrast "failures" that were simply samples taken from the middle of
       the hero photograph. */
    const shot = join(OUT, `${name}.png`);
    const slices = [];
    for (let y = 0, i = 0; y < info.height; y += H, i++) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(220);
      const slice = join(OUT, `.${name}-${String(i).padStart(2, "0")}.png`);
      await page.screenshot({ path: slice, animations: "disabled", timeout: 90000 });
      slices.push(slice);
    }
    execFileSync("python3", [join(HERE, "stitch.py"), shot, String(info.height), String(H), ...slices]);
    for (const f of slices) unlinkSync(f);
    await page.evaluate(() => window.scrollTo(0, 0));

    const meta = shot.replace(/\.png$/, ".json");
    writeFileSync(meta, JSON.stringify(items));
    /* The meta is kept, not deleted: a surprising contrast number is checked
       by cropping the capture at these coordinates, and without the file there
       is nothing to crop against. */
    const found = execFileSync("python3", [join(HERE, "contrast.py"), shot]).toString().trim();

    const bits = [`${name} h=${info.height}`];
    if (info.over > 1) { overflow++; bits.push(`OVERFLOW ${info.over}px :: ${info.guilty.join(" | ")}`); }
    if (errors.length) bits.push(`ERR: ${errors[0]}`);
    console.log(bits.join("  "));
    if (found) {
      contrast += found.split("\n").length;
      calibration.push(...found.split("\n"));
      console.log(found);
    }
  } catch (e) {
    console.log(`${name} FAILED ${String(e).slice(0, 90)}`);
    broken += 1;
  }
  await page.close();
}

console.log(`\noverflow: ${overflow}   contrast failures: ${contrast}   pages that never loaded: ${broken}`);
/* A page that never loaded is measured as zero findings, so a wrong --port used
   to print a clean sweep. Nothing green may come out of nothing read. */
if (broken > 0 || overflow > 0 || contrast > 0) process.exitCode = 1;
await browser.close();

if (CALIBRATE) {
  const caught = calibration.filter((l) => l.includes(CAL.fail)).length;
  const wrong = calibration.filter((l) => l.includes(CAL.pass)).length;
  console.log(
    caught > 0 && wrong === 0
      ? "calibration ok: the 3.0:1 line was caught, the 7.0:1 line was not"
      : `CALIBRATION FAILED: caught 3.0:1 ${caught} times, flagged 7.0:1 ${wrong} times`,
  );
  if (!(caught > 0 && wrong === 0)) process.exitCode = 1;
}
