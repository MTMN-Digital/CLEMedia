// Playwright helpers for the 2026-10-27-admin shards. LOCAL STACK ONLY.
//
//   import { launch, adminPage, signIn, env } from "/home/david/Documents/GitHub/clients/cle-media/.parallel/admin/pw.mjs";
//   const browser = await launch();
//   const page = await adminPage(browser, { width: 390, base: "http://127.0.0.1:5500" });
//   await page.goto("http://127.0.0.1:5500/admin/shop");
//   await page.screenshot({ path: "<scratchpad>/shop-390.png" });
//   await browser.close();
//
// Playwright is borrowed from another repo, as scripts/qa/audit.mjs does.
// Screenshots go to your session scratchpad, never into the repo.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromePath } from "../../scripts/qa/chrome.mjs";

const require = createRequire("/home/david/Documents/GitHub/internal/iacchus/node_modules/playwright/package.json");
const { chromium } = require("playwright");

export const env = Object.fromEntries(
  readFileSync(new URL("./local.env", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);

export function launch() {
  return chromium.launch({ executablePath: chromePath(chromium) });
}

/** Signs in on /admin and waits for the console home. */
export async function signIn(page, base = "http://127.0.0.1:5500") {
  await page.goto(`${base}/admin`);
  await page.getByLabel("Email").fill(env.ADMIN_EMAIL);
  await page.getByLabel("Password").fill(env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("heading", { name: "Edit the site" }).waitFor({ timeout: 15000 });
  // supabase-js writes the session a moment after the console appears; wait
  // for it so a page.goto() straight after this stays signed in.
  await page.waitForFunction(() => Object.keys(localStorage).some((k) => k.endsWith("-auth-token")), null, { timeout: 10000 });
}

/** A new page at `width` (390 = phone), signed in, collecting console errors on page.errors. */
export async function adminPage(browser, { width = 390, height = 844, base = "http://127.0.0.1:5500" } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.errors = [];
  page.on("console", (m) => m.type() === "error" && page.errors.push(m.text()));
  page.on("pageerror", (e) => page.errors.push(e.message));
  await signIn(page, base);
  return page;
}
