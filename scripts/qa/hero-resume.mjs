/**
 * Does the hero film come back when you scroll away and return?
 *
 * It did not. The IntersectionObserver paused the element on exit, the
 * element's own `pause` event set `playing` to false, and the effect that
 * depended on `playing` re-subscribed with false captured, so the branch that
 * resumes the film could never run again. Scroll past the hero once and the
 * film was dead until it was clicked.
 *
 * Nothing in the contrast sweep or the frame sampler could see that: both
 * measure a still hero. This scrolls.
 *
 *   node scripts/qa/hero-resume.mjs --port 4318
 */
import { createRequire } from "node:module";
const require = createRequire("/home/david/Documents/GitHub/internal/M.ind/node_modules/playwright/package.json");
const { chromium } = require("playwright");

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const PORT = arg("port", "4318");

const browser = await chromium.launch({
  headless: true,
  executablePath: "/home/david/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

const read = () => page.evaluate(() => {
  const v = document.querySelector("video");
  return v ? { paused: v.paused, t: Number(v.currentTime.toFixed(2)) } : null;
});

const start = await read();
if (!start) {
  console.log("FAIL no <video> in the hero");
  await browser.close();
  process.exit(1);
}
if (start.paused) {
  console.log(`FAIL the film is not playing at rest (paused=${start.paused})`);
  await browser.close();
  process.exit(1);
}

// Away, far enough for the 0.15 threshold to drop it, then back.
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
const away = await read();

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1800);
const back = await read();
const after = await (async () => {
  await page.waitForTimeout(1200);
  return read();
})();

const resumed = !back.paused && after.t > back.t;
console.log(`at rest: playing t=${start.t}`);
console.log(`scrolled away: paused=${away.paused}`);
console.log(`returned: paused=${back.paused} t=${back.t} -> ${after.t}`);
console.log(resumed ? "PASS the film resumes" : "FAIL the film does not resume after a scroll away");
await browser.close();
process.exit(resumed ? 0 : 1);
