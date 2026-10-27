/* Non-text contrast: every rule, border and drawn stroke on the site.
 *
 *   node scripts/qa/lines.mjs --port 5191 [--only home] [--width 1440]
 *
 * WHY THIS EXISTS. audit.mjs measures TEXT against painted pixels and nothing
 * else, so every hairline, card edge, dashed panel, form field and drawn
 * stroke on this site was unmeasured. WCAG 2.1 1.4.11 wants 3:1 on any
 * graphical object you need in order to understand the content, and a divider
 * that is pure decoration is exempt from that, but a 1px line nobody can see
 * is a design fault whether or not a standard names it. This prints the
 * number so the argument can stop being about taste.
 *
 * HOW IT MEASURES. The colour is resolved by the browser (getComputedStyle
 * turns `color-mix()` and `currentColor` into rgb, which no amount of parsing
 * here would do correctly), and the BACKDROP is read from painted pixels,
 * because this site's surfaces paint with the `background` shorthand and a
 * walk up the tree for a colour sails straight past `.wall` and `.deep`. The
 * same trap is written up at the head of audit.mjs.
 *
 * ONE SAMPLE PER GROUP. Identical lines are grouped by their signature
 * (colour, width, style, the surface they sit on), because a page with 180
 * hairlines has about eight distinct ones, and 180 screenshots to learn eight
 * numbers is a waste of a minute and a half.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire("/home/david/Documents/GitHub/internal/iacchus/node_modules/playwright/package.json");
const { chromium } = require("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const PORT = arg("port", "5191");
const W = Number(arg("width", 1440));
const H = Number(arg("height", 900));
const OUT = arg("out", "/tmp/lines");
const ONLY = arg("only", null);

const ROUTES = [
  "", "story", "team", "ethical-ai", "case-study", "journal", "app",
  "media", "shop", "contact", "privacy", "terms", "cookies", "nope",
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });

const rows = [];

for (const route of ROUTES) {
  const name = route || "home";
  if (ONLY && name !== ONLY) continue;
  await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  /* Reveals gate the drawn kit, and a stroke held at opacity 0 measures as
     the ground. Finish every one of them before looking. */
  await page.addStyleTag({
    content: `*,*::before,*::after{transition:none!important;animation:none!important}
      .settle,.wipe,.ink,.ink-line,.ink-draw,.ink-in,[class*="is-armed"] *{opacity:1!important;transform:none!important;stroke-dashoffset:0!important}`,
  });
  /* Unstick, for the same reason audit.mjs does: a sticky header's recorded
     box is stale the moment the sweep scrolls, so every line in it was being
     sampled from wherever the page happened to be painting instead. */
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.position === "sticky" || cs.position === "fixed") el.style.position = "static";
    }
  });
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));

  const groups = await page.evaluate(() => {
    const seen = new Map();
    const push = (sig, rec) => { if (!seen.has(sig)) seen.set(sig, rec); };

    /* The surface an element stands on, by class rather than by colour: it is
       what the CSS keys off, so it is what a fix has to key off too. */
    const surfaceOf = (el) => {
      for (let p = el; p; p = p.parentElement) {
        for (const c of ["deep", "bench", "grove", "wall", "well"]) {
          if (p.classList && p.classList.contains(c)) return c;
        }
      }
      return "paper";
    };
    /* Icon scale, not rule scale. A 10px square's border cannot be told from
       its own interior by a 28px clip, and a drawing made of little marks is
       not what 1.4.11 means by a graphical object you need in order to
       understand the content. Measured separately by eye if it matters. */
    const bigEnough = (el) => {
      const r = el.getBoundingClientRect();
      return r.width >= 24 && r.height >= 24;
    };
    const vis = (el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      /* A disabled control is explicitly outside 1.4.11, and this site dims
         the filmstrip's back arrow to 30% at the start of the rail, which is
         correct and was being reported as a 1.01:1 failure. */
      if (el.closest("[disabled],[aria-disabled='true']")) return false;
      for (let p = el; p; p = p.parentElement) if (Number(getComputedStyle(p).opacity) < 0.05) return false;
      return true;
    };
    const onScreenRect = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 4 && r.height < 4) return null;
      return r;
    };

    /* 1. Borders. Each of the four edges is its own line. */
    for (const el of document.querySelectorAll("*")) {
      if (!(el instanceof HTMLElement) || !vis(el) || !bigEnough(el)) continue;
      const cs = getComputedStyle(el);
      const r = onScreenRect(el);
      if (!r) continue;
      for (const side of ["Top", "Right", "Bottom", "Left"]) {
        const w = parseFloat(cs[`border${side}Width`]);
        const style = cs[`border${side}Style`];
        if (!w || style === "none" || style === "hidden") continue;
        const col = cs[`border${side}Color`];
        if (/rgba?\([^)]*,\s*0\)$/.test(col)) continue;
        const horiz = side === "Top" || side === "Bottom";
        push(`b|${col}|${w}|${style}|${surfaceOf(el)}|${horiz}`, {
          kind: `border-${side.toLowerCase()}`, colour: col, width: w, style,
          surface: surfaceOf(el), horiz,
          x: r.left + window.scrollX + (side === "Right" ? r.width : 0),
          y: r.top + window.scrollY + (side === "Bottom" ? r.height : 0),
          len: horiz ? r.width : r.height,
          sel: el.tagName.toLowerCase() + "." + String(el.className).slice(0, 40),
        });
      }
      /* 2. A short flat block used AS a rule. */
      const bg = cs.backgroundColor;
      const thin = (r.height <= 3 && r.width > 12) || (r.width <= 3 && r.height > 12);
      if (thin && !/rgba?\([^)]*,\s*0\)$/.test(bg) && bg !== "rgba(0, 0, 0, 0)") {
        const horiz = r.height <= 3;
        push(`g|${bg}|${horiz ? r.height : r.width}|${surfaceOf(el)}`, {
          kind: "block-rule", colour: bg, width: horiz ? r.height : r.width, style: "solid",
          surface: surfaceOf(el), horiz,
          x: r.left + window.scrollX, y: r.top + window.scrollY,
          len: horiz ? r.width : r.height,
          sel: el.tagName.toLowerCase() + "." + String(el.className).slice(0, 40),
        });
      }
    }

    /* 3. SVG strokes. The drawn kit is all of these. The rendered weight is
       the stroke-width through the element's own transform, except where
       `non-scaling-stroke` deliberately takes it out of that space, which is
       exactly what the kit uses to stretch one path to any box. */
    for (const el of document.querySelectorAll("svg path, svg line, svg rect, svg circle, svg polyline")) {
      if (!vis(el) || !bigEnough(el)) continue;
      const cs = getComputedStyle(el);
      const stroke = cs.stroke;
      if (!stroke || stroke === "none" || /rgba?\([^)]*,\s*0\)$/.test(stroke)) continue;
      const r = onScreenRect(el);
      if (!r) continue;
      let w = parseFloat(cs.strokeWidth) || 1;
      if (cs.vectorEffect !== "non-scaling-stroke") {
        const ctm = el.getScreenCTM && el.getScreenCTM();
        if (ctm) w *= Math.sqrt(Math.abs(ctm.a * ctm.d - ctm.b * ctm.c)) / (window.devicePixelRatio || 1) * (window.devicePixelRatio || 1);
        /* getScreenCTM is already in CSS pixels, so the dpr terms cancel; the
           round trip is left visible rather than silently dropped. */
      }
      const op = Number(cs.strokeOpacity || 1) * Number(cs.opacity || 1);
      const host = el.closest("svg");
      push(`s|${stroke}|${w.toFixed(2)}|${op.toFixed(2)}|${surfaceOf(el)}|${String(host && host.className.baseVal).slice(0, 24)}`, {
        kind: "svg-stroke", colour: stroke, width: w, style: `opacity ${op.toFixed(2)}`,
        surface: surfaceOf(el), horiz: r.width >= r.height, strokeOpacity: op,
        x: r.left + window.scrollX, y: r.top + window.scrollY,
        len: Math.max(r.width, r.height),
        sel: (String((host && host.className.baseVal) || "svg") + " in " +
             String((host && host.parentElement && host.parentElement.className) || "?")).slice(0, 44),
      });
    }
    return [...seen.values()];
  });

  /* Sample the painted pixels: scroll each group's instance into view, clip a
     band across the line, and let the Python side find the stroke and its
     ground. One screenshot per group. */
  for (const [i, g] of groups.entries()) {
    const pad = 14;
    /* A route whose own JS navigates (a redirect, a lazy chunk that swaps the
       tree) destroys the execution context mid-sweep and took the whole run
       down with it. One group is not worth a run, so a lost context costs
       that group and the page is reloaded for the next one. */
    let clip;
    try {
      clip = await page.evaluate(({ g, pad }) => {
        document.documentElement.style.scrollBehavior = "auto";
        const target = Math.max(0, g.y - window.innerHeight / 2);
        window.scrollTo(0, target);
        const top = g.y - window.scrollY;
        const left = g.x - window.scrollX;
        /* CENTRED ON THE EDGE. Sampling from the corner meant that on
           anything with a radius the clip was all curve and no line, which
           reported an ink border on paper, 14:1, as 1.01:1. */
        const len = Math.min(g.len, 180);
        const mid = g.horiz ? left + g.len / 2 : top + g.len / 2;
        const box = g.horiz
          ? { x: Math.max(0, mid - len / 2), y: top - pad, width: Math.max(8, len), height: pad * 2 }
          : { x: left - pad, y: Math.max(0, mid - len / 2), width: pad * 2, height: Math.max(8, len) };
        /* Too small to read: a 6px square's border cannot be separated from
           its own interior by a 28px clip. Unknown, not failing. */
        if (g.len < 14) return null;
        if (box.y < 0 || box.x < 0) return null;
        if (box.y + box.height > window.innerHeight || box.x + box.width > window.innerWidth) return null;
        return box;
      }, { g, pad });
      if (!clip) continue;
      await page.evaluate(() => new Promise((r) => setTimeout(r, 90)));
      const shot = join(OUT, `${name}-${i}.png`);
      await page.screenshot({ path: shot, clip, scale: "device" });
      rows.push({ page: name, shot, ...g });
    } catch (err) {
      process.stderr.write(`  ${name} group ${i} lost: ${String(err).split("\n")[0]}\n`);
      await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: "load", timeout: 60000 }).catch(() => {});
    }
  }
}

await browser.close();

writeFileSync(join(OUT, "lines.json"), JSON.stringify(rows, null, 1));
const report = execFileSync("python3", ["-I", join(HERE, "lines.py"), join(OUT, "lines.json")], {
  encoding: "utf-8",
});
process.stdout.write(report);
