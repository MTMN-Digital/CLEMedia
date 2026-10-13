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

/* The header. Two labels changed on 2026-10-13 to the creative director's own
   wording, which is better: "About us" says what the page is where "Team" said
   what is on it, and "Get in touch" is an invitation where "Contact" is a
   filing category.

   THREE OF HIS LABELS ARE NOT HERE, and it is not an oversight. "Our approach",
   "The series" and "Learning resources" have no page behind them anywhere in
   his deck; in it they are groupings, and two of them read as links down his
   own home page. They are used in the footer, where a grouping belongs. If any
   of the three should become a real page, that is a sitemap decision and it is
   Conor's. QUESTIONS.md #35. */
export const NAV = [
  { to: "/story", label: "Our story" },
  { to: "/team", label: "About us" },
  { to: "/ethical-ai", label: "Responsible AI" },
  { to: "/journal", label: "Journal" },
  { to: "/app", label: "App" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Get in touch" },
] as const;

/* The footer, grouped the way the creative director's deck groups it:
   Explore / Company / Work with us, plus the two places that are not this
   site. It is deliberately NOT derived from NAV. The header's job is to list
   the pages; this one's is to sort them by what the reader came for, which is
   an editorial judgement and has to be written down rather than generated.

   It also gives /media a way in. "Press and appearances" was reachable from
   nothing but a link inside /contact. */
export const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { to: "/story", label: "Our story" },
      { to: "/app", label: "Learning resources" },
      { to: "/shop", label: "Shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/team", label: "About us" },
      { to: "/ethical-ai", label: "How we use AI" },
      { to: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { to: "/contact", label: "Broadcasters" },
      { to: "/contact", label: "Schools" },
      { to: "/media", label: "Press" },
    ],
  },
] as const;
