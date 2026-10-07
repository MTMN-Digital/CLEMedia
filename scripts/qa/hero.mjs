/* Contrast for the hero, which the whole-site audit cannot reach.
 *
 * Run against a built preview, like the audit:
 *   node scripts/qa/hero.mjs --port 5371
 *
 * WHY THIS IS SEPARATE. audit.mjs walks the page in viewport steps and stitches
 * the slices, and it skips anything inside `.shot-pin`, because a pinned
 * section is one sticky screen whose state changes with scroll: successive
 * slices photograph the same box in different states and stack them. So the
 * hero, which is the first thing anyone sees and the only place on the site
 * where type sits on a photograph, was the one surface with no automated
 * check. It was measured by hand instead, with coordinates typed in from
 * looking at a screenshot, and those went stale the moment the layout moved.
 *
 * What this does: scrolls the hero to its settled state, reads the real
 * rectangles and resolved colours out of the DOM, photographs that one frame,
 * and hands both to the same sampler the site audit uses. One frame, so no
 * stitching, so no trap.
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

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/home/david/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 40000 });
await page.waitForTimeout(2200);

/* JUST BEFORE the end of the move, not past it.
 *
 * This was `+ 60` past the release point, on the assumption that the hero
 * stays stuck for the whole pin. It does not: the sticky screen stops sticking
 * once the pin's bottom reaches the viewport bottom, so 60px later the hero has
 * slid up by 60px and the section below is showing. That is not merely an odd
 * screenshot. The copy slides up with it, and text measured where it overlaps
 * the next section is measured against the wrong ground entirely.
 *
 * So: stop a few pixels short, then ASSERT the hero is still pinned, and fail
 * loudly rather than quietly reporting a number from the wrong frame. */
const settled = await page.evaluate(() => {
  const pin = document.querySelector(".shot-pin");
  const screen = document.querySelector(".shot-screen");
  if (!pin || !screen) return { ok: false, why: "no .shot-pin or .shot-screen" };
  /* The screen latches at `top: var(--header-h)`, so it starts sticking when
     the pin's top reaches that line and releases exactly `span` later. The
     header height cancels out of the release point, which is why adding
     `pin.offsetTop` to it overshot by a whole header. */
  const header = document.querySelector("header");
  const headerH = header ? header.getBoundingClientRect().height : 0;
  const span = pin.offsetHeight - screen.offsetHeight;
  window.scrollTo(0, pin.offsetTop - headerH + span - 8);
  return { ok: true };
});
if (!settled.ok) {
  console.log(`hero: ${settled.why}`);
  process.exit(1);
}
await page.waitForTimeout(1100);

const pinned = await page.evaluate(() => {
  const screen = document.querySelector(".shot-screen");
  const top = Math.round(screen.getBoundingClientRect().top);
  const header = document.querySelector("header");
  const want = header ? Math.round(header.getBoundingClientRect().height) : 0;
  const p = screen.style.getPropertyValue("--p");
  return { top, want, p: Number(p || 0) };
});
if (Math.abs(pinned.top - pinned.want) > 4) {
  console.log(
    `hero: NOT the settled frame. The screen sits at top ${pinned.top} but the ` +
    `header is ${pinned.want} tall, so the hero has already come unstuck and ` +
    `every sample would be taken against the wrong ground.`,
  );
  process.exit(1);
}
if (pinned.p < 0.97) {
  console.log(`hero: the move has not finished, --p is ${pinned.p}`);
  process.exit(1);
}

const items = await page.evaluate(() => {
  const cx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  /* Resolved by the browser, never parsed: Tailwind emits oklab() and a regex
     over the numbers turns `text-white/90` into pure red. See contrast.py. */
  const resolve = (css) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = css;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const out = [];
  /* Not "elements with no children": the headline holds "Watch." and "Learn."
     as direct text either side of a span, and each button holds its label next
     to an svg. Both were skipped by that rule, which left this check reporting
     two elements and a clean pass while the headline went unmeasured. The test
     is whether the element has text of its OWN. */
  const ownsText = (el) =>
    Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
  document.querySelectorAll(".shot-copy span, .shot-copy p, .shot-copy a, .shot-cue").forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!text || !ownsText(el)) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return;
    let opacity = 1;
    for (let p = el; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
    if (opacity < 0.95) return;
    const r = el.getBoundingClientRect();
    if (r.width < 10 || r.height < 8) return;
    out.push({
      x: Math.round(r.left), y: Math.round(r.top),
      w: Math.round(r.width), h: Math.round(r.height),
      rgba: resolve(cs.color), px: Math.round(parseFloat(cs.fontSize)),
      bold: parseInt(cs.fontWeight) >= 700, t: text.slice(0, 36),
    });
  });
  return out;
});

const shot = join(OUT, "hero.png");
await page.screenshot({ path: shot, animations: "disabled" });
writeFileSync(shot.replace(/\.png$/, ".json"), JSON.stringify(items));
await browser.close();

const found = execFileSync("python3", [join(HERE, "contrast.py"), shot]).toString().trim();
unlinkSync(shot.replace(/\.png$/, ".json"));

console.log(`hero: ${items.length} text elements measured on the settled frame`);
if (found) {
  console.log(found);
  console.log(`\nhero contrast failures: ${found.split("\n").length}`);
  process.exitCode = 1;
} else {
  console.log("hero contrast failures: 0");
}
