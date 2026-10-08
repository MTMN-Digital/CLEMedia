/* Contrast for the hero copy, which sits over a moving picture.
 *
 * Run against a built preview, like the audit:
 *   node scripts/qa/hero.mjs --port 5371
 *
 * WHY THIS IS SEPARATE, and why it is not the same check it used to be. The
 * hero was a pinned, scroll-driven set; audit.mjs skips anything pinned,
 * because a pinned section photographs differently in every stitch slice, so
 * the hero needed its own single-frame check. The hero is now the mission
 * film, full bleed, with the headline over it.
 *
 * That is a harder problem, not an easier one. audit.mjs would measure the
 * copy against whatever frame the film happened to be showing at the moment
 * of capture, and pass or fail on luck: the film opens on a dark wood and runs
 * through a sunrise that is very nearly white. A single sample is worthless.
 *
 * So this seeks the film to a spread of timestamps, photographs each one, and
 * runs every sample through the same pixel sampler the site audit uses. The
 * verdict is the WORST frame, because a headline that is unreadable for two
 * seconds of a looping film is unreadable.
 *
 * It exits non-zero on a failure, so it can gate a deploy.
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
const OUT = arg("out", "/tmp/hero-qa");
const W = Number(arg("width", 1440));
const H = Number(arg("height", 900));
/** Where in the film to look, as fractions of its duration. */
const STOPS = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/home/david/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(2500);

/* Same reason as the sweep: measure the resting frame, never a reveal that is
   still in flight. The hero's own entrance is staggered. */
await page.evaluate(() => {
  const settle = document.createElement("style");
  settle.textContent =
    "*,*::before,*::after{transition-duration:0s !important;transition-delay:0s !important;" +
    "animation-duration:0s !important;animation-delay:0s !important;animation-iteration-count:1 !important}";
  document.head.appendChild(settle);
});
await page.waitForTimeout(120);

const ready = await page.evaluate(async () => {
  const v = document.querySelector(".film-media");
  if (!v) return { ok: false, why: "no .film-media in the hero" };
  if (!v.duration || Number.isNaN(v.duration)) {
    await new Promise((r) => {
      if (v.readyState >= 1) return r();
      v.addEventListener("loadedmetadata", r, { once: true });
      setTimeout(r, 6000);
    });
  }
  v.pause();
  return { ok: Boolean(v.duration), duration: v.duration || 0 };
});
if (!ready.ok) {
  console.log(`hero: ${ready.why || "the film never reported a duration"}`);
  await browser.close();
  process.exit(1);
}

/* Measured once: the copy does not move between frames, only the picture
   under it does. Colours are resolved by the browser, never parsed here,
   because Tailwind emits oklab() and a regex over the numbers turns
   `text-white/90` into pure red. See contrast.py. */
const items = await page.evaluate(() => {
  const cx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const resolve = (css) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = css;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const ownsText = (el) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
  const out = [];
  document.querySelectorAll(".film-copy span, .film-copy p, .film-copy a, .film-btn").forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!text || !ownsText(el)) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return;
    /* Folded into the colour, never used as a skip test. `< 0.95 return`
       dropped the hero's own `opacity: 0.75` eyebrow, which is 3.66:1 on the
       mobile paper ground, and reported the hero clean for it. */
    let opacity = 1;
    for (let p = el; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
    if (opacity < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 10 || r.height < 8) return;
    out.push({
      x: Math.round(r.left), y: Math.round(r.top),
      w: Math.round(r.width), h: Math.round(r.height),
      rgba: (([r, g, b, a]) => [r, g, b, a * opacity])(resolve(cs.color)),
      px: Math.round(parseFloat(cs.fontSize)),
      bold: parseInt(cs.fontWeight) >= 700, t: text.slice(0, 36),
    });
  });
  return out;
});

const worst = new Map();
for (const f of STOPS) {
  const at = +(ready.duration * f).toFixed(2);
  await page.evaluate(async (t) => {
    const v = document.querySelector(".film-media");
    v.currentTime = t;
    await new Promise((r) => {
      v.addEventListener("seeked", r, { once: true });
      setTimeout(r, 3000);
    });
  }, at);
  await page.waitForTimeout(260);

  const shot = join(OUT, `hero-${f}.png`);
  await page.screenshot({ path: shot, animations: "disabled" });
  writeFileSync(shot.replace(/\.png$/, ".json"), JSON.stringify(items));
  const found = execFileSync("python3", [join(HERE, "contrast.py"), shot]).toString().trim();
  unlinkSync(shot.replace(/\.png$/, ".json"));
  if (found) for (const line of found.split("\n")) {
    const key = line.slice(line.indexOf('"'));
    const ratio = parseFloat(line.trim());
    if (!worst.has(key) || ratio < worst.get(key).ratio) worst.set(key, { ratio, line, at });
  }
}
await browser.close();

console.log(`hero: ${items.length} text elements, measured across ${STOPS.length} frames of the film`);
if (worst.size) {
  for (const { line, at } of worst.values()) console.log(`${line}   (worst at ${at}s)`);
  console.log(`\nhero contrast failures: ${worst.size}`);
  process.exitCode = 1;
} else {
  console.log("hero contrast failures: 0");
}
