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

/* The header. Labels follow the creative director's own wording from
   2026-10-13 where it is better: "Get in touch" is an invitation where
   "Contact" is a filing category. His "About us" held until 2026-10-24, when
   the pair moved into a menu and "Our team" became the clearer of the two
   inside it, with the menu itself carrying the "About".

   THREE OF HIS LABELS ARE NOT HERE, and it is not an oversight. "Our approach",
   "The series" and "Learning resources" have no page behind them anywhere in
   his deck; in it they are groupings, and two of them read as links down his
   own home page. They are used in the footer, where a grouping belongs. If any
   of the three should become a real page, that is a sitemap decision and it is
   Conor's. QUESTIONS.md #35. */
/* The header. One group and four links, from 2026-10-24.

   WHY A GROUP AT ALL. It was seven flat links, which is one more than a 14.5px
   bar holds comfortably and two more than it reads as a menu rather than a
   list. The four pages about who the company is and how it works belong
   together and now sit together, which also gives the case study a way in from
   the top of the page instead of only from the footer.

   THE ALTERNATIVE WAS MERGING /story AND /team into one page, which is what
   David asked about. Measured before answering: 7,969px and 6,346px at 1440,
   10,717px and 11,111px at 390. Merged that is about twenty-five phone
   screens, nearly double the longest page on the site, and most of /team is
   seven full biographies that cannot be cut. So the pages stay and the menu
   does the joining. */
export const NAV = [
  {
    label: "About",
    items: [
      { to: "/story", label: "Our story" },
      { to: "/team", label: "Our team" },
      { to: "/ethical-ai", label: "Responsible AI" },
      { to: "/case-study", label: "Case study" },
    ],
  },
  { to: "/journal", label: "Journal" },
  { to: "/app", label: "App" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Get in touch" },
] as const;

export type NavItem = { to: string; label: string };
export type NavEntry = NavItem | { items: readonly NavItem[]; label: string };

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
      /* Not in the header, deliberately. The header is already seven items
         and the study has not opened: see STUDY_OPEN in
         components/casestudy/config.ts. It goes up top when it opens. */
      { to: "/case-study", label: "Case study" },
      { to: "/shop", label: "Shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/team", label: "Our team" },
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
