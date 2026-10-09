/** Single source of truth for cross-site links and company details. */
/**
 * `??` only falls back on null/undefined, so an env var that is present but
 * empty (easy to do in the Vercel dashboard) survives it and renders href="",
 * which silently reloads the current page instead of navigating. Treat blank
 * as unset.
 */
function envUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const SITE = {
  name: "CLÉ Family Media",
  showName: "The Pawsitive Pugs & Pals",
  playerName: "PupsPlayer",
  url: envUrl(import.meta.env.VITE_SITE_URL, "https://clefamilymedia.com"),
  /** Fixed destination. Not env-driven: the show site is not going to move,
   *  and an unset variable must never silently break the cross-link. */
  showUrl: "https://www.pawsitivepugs.com",
  tagline: "Watch, Play, Learn.",
} as const;

/** Flipped at launch. /app and /media both read this one flag, so every line
 *  that describes PupsPlayer's state changes together. */
export const APP_LAUNCHED = false;

export const NAV = [
  { to: "/story", label: "Our story" },
  { to: "/team", label: "Team" },
  { to: "/ethical-ai", label: "Responsible AI" },
  { to: "/journal", label: "Journal" },
  { to: "/app", label: "App" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;
