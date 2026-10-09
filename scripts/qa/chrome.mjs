import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Where Chromium actually is, today.
 *
 * All four QA scripts used to hardcode
 * `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`. On 2026-10-09
 * something upgraded the browser pack: 1243 was deleted, 1248 appeared, and
 * every script in this directory died with "executable doesn't exist" on a
 * repo where nothing had changed. The borrowed Playwright (M.ind's, 1.63.0)
 * still asks for 1243, so its own `executablePath()` is wrong too.
 *
 * So: take Playwright's answer when it exists on disk, otherwise take the
 * highest-numbered pack that does. A newer Chromium than the library expects
 * is fine for what these scripts do, which is load a page, scroll it and
 * screenshot it.
 *
 * ponytail: highest number wins, no version negotiation. If a future pack ever
 * breaks the CDP calls these scripts make, pin it here.
 */
const ROOT = join(process.env.HOME || "", ".cache", "ms-playwright");

export function chromePath(chromium) {
  const asked = chromium.executablePath();
  if (asked && existsSync(asked)) return asked;

  const packs = readdirSync(ROOT)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
  for (const pack of packs.reverse()) {
    const exe = join(ROOT, pack, "chrome-linux64", "chrome");
    if (existsSync(exe)) return exe;
  }
  throw new Error(`no chromium found under ${ROOT} (playwright asked for ${asked})`);
}
