import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, NavLink } from "react-router-dom";
import { SITE, NAV, FOOTER_GROUPS } from "@/lib/site";
import type { NavEntry } from "@/lib/site";
import { Wordmark } from "@/components/Wordmark";
import navMark from "@/assets/brand/cle-nav.webp";
import { IconMail, IconExternal } from "@/components/icons";
import { TextLink, Container } from "@/components/ui";
import { SmoothScroll } from "@/components/SmoothScroll";
import { InkDefs } from "@/components/draw/InkDefs";
import { landing } from "@/lib/landing";

function ShowSiteLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={SITE.showUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`items-center gap-1.5 ${className}`}
    >
      Visit the show site
      <IconExternal size={13} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/* ============================================================================
   The one grouped item in the header.

   A CLICK MENU, NOT A HOVER ONE. A hover menu has no equivalent on a touch
   screen, opens by accident on the way to the link beside it, and gives a
   keyboard nothing to open. This opens on click, closes on Escape, on an
   outside click and on arrival at a new page, and reports its state through
   `aria-expanded`, so a pointer, a thumb and a keyboard all drive the same
   control.

   IT KNOWS WHEN YOU ARE INSIDE IT. The trigger takes the active colour when
   the current route is one of its own, which is the thing a grouped item
   usually loses: on a flat bar the page you are on is underlined, and in a
   menu it disappears behind a word that never changes.
   ========================================================================== */
function NavGroup({ label, items }: { items: readonly { to: string; label: string }[]; label: string }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const box = useRef<HTMLDivElement>(null);
  const inside = items.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 font-body text-[14.5px] font-medium transition-colors ${
          inside ? "text-red-deep" : "hover:text-ink"
        }`}
      >
        {label}
        <svg
          width="10" height="7" viewBox="0 0 10 7" aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1.5L5 5.5L9 1.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        /* Raised paper on the bar's own cream, with the room's shadow under
           it. Not glass: the header is the one surface on this site that must
           never let what is beneath it read through. */
        <ul
          className="absolute left-0 top-[calc(100%+0.85rem)] z-20 min-w-[13rem] rounded-[var(--radius-sm)] border-[1.5px] bg-raised py-1.5 shadow-[0_12px_28px_-12px_rgba(60,50,28,0.3)]"
          style={{ borderColor: "var(--color-edge)" }}
        >
          {items.map((i) => (
            <li key={i.to}>
              <NavLink
                to={i.to}
                className={({ isActive }) =>
                  `block px-4 py-2.5 font-body text-[14.5px] ${isActive ? "text-red-deep" : "text-body hover:text-ink"}`
                }
              >
                {i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * A warm sheet the page scrolls under. Opaque enough that the nav is always
 * ink on clay, because a header is the one surface that must never let what is
 * beneath it read through. The show site has no persistent header at all; a
 * company site needs one, and this is the least it can weigh.
 */
function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const bar = useRef<HTMLElement>(null);
  /* Two states, not one. `over` is the header floating on the hero film with
     cream type; `solid` is the cream bar with its hairline. They are not
     opposites: at the top of an ordinary page the header is neither, which is
     the "softer until you scroll" half of this. */
  const [over, setOver] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  /* MEASURED FROM THE FILM, not from a scroll offset. A threshold in pixels
     would have to know the hero's height, which is `100svh` minus a gutter
     and therefore different on every device and different again when a mobile
     browser's address bar collapses. Asking the element where its bottom edge
     is costs one `getBoundingClientRect` per frame of scrolling and is right
     by construction. A page with no film falls back to the 8px test, which is
     all an ordinary page needs to know. */
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const h = bar.current?.getBoundingClientRect().height ?? 76;
      const film = document.querySelector(".film-hero");
      /* Under 820 the hero puts its copy on paper below the picture and the
         header would be cream type on cream. Same breakpoint as the stylesheet. */
      const wide = window.matchMedia("(min-width: 821px)").matches;
      if (film && wide) {
        /* THREE HEADER HEIGHTS, not one. The obvious test is whether any film
           is left under the bar, and it is wrong: the hero's headline and its
           lead sit at the BOTTOM of the picture, so as the film scrolls up
           they climb into the navigation, and for about two hundred pixels of
           scroll there was cream hero copy and cream nav links printed over
           each other. Handing the bar its cream back while the last sliver of
           film is still passing is the lesser of the two, and the sliver is
           dark, so the slab the client objected to never reappears. */
        const onFilm = film.getBoundingClientRect().bottom > h * 3;
        setOver(onFilm);
        setSolid(!onFilm);
      } else {
        setOver(false);
        setSolid(window.scrollY > 8);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    /* And once more after paint: on a route change into the hero the film is
       not in the DOM yet when this effect runs. */
    const first = requestAnimationFrame(read);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* An open menu panel is opaque cream, so the bar above it has to be too. */
  const isOver = over && !open;
  const isSolid = solid || open;

  return (
    <header
      ref={bar}
      className={`site-header ${isSolid ? "is-solid" : ""} ${isOver ? "is-over" : ""}`}
    >
      <Container width="wide" className="flex items-center gap-6 py-4">
        {/* The felted mark itself, cropped to the three characters: no ropes
            above them and no FAMILY MEDIA below, because at header height the
            wordmark under the characters would be illegible mush. The company
            name is carried by the link's accessible name instead, so a screen
            reader and a search engine both still get it. */}
        <Link to="/" className="shrink-0" aria-label={`${SITE.name}, home`}>
          <img
            src={navMark}
            alt=""
            width={420}
            height={176}
            className="h-[46px] w-auto sm:h-[56px]"
          />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {(NAV as readonly NavEntry[]).map((item) =>
              "items" in item ? (
                <li key={item.label}>
                  <NavGroup label={item.label} items={item.items} />
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `link-draw font-body text-[14.5px] font-medium transition-colors ${
                        isActive ? "text-red-deep" : "hover:text-ink"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <ShowSiteLink
          className="hidden shrink-0 rounded-[var(--radius-pill)] border-[1.5px] px-4 py-2.5 font-body text-[14px] font-bold text-ink transition-colors hover:border-ink lg:inline-flex"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={open ? "mobile-nav" : undefined}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border-[1.5px] text-ink lg:hidden"
          style={{ borderColor: "var(--color-edge)" }}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      {isSolid && <div aria-hidden="true" className="hairline" />}

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-b-[1.5px] border-[var(--color-rule)] bg-[rgba(245,236,217,0.97)] lg:hidden">
          <Container width="wide">
            <ul className="pb-3">
              {(NAV as readonly NavEntry[]).flatMap((item) =>
                "items" in item
                  ? item.items.map((i) => (
                      <li key={i.to} className="hairline">
                        <NavLink
                          to={i.to}
                          className={({ isActive }) =>
                            `block py-3.5 font-body text-[16px] font-medium ${isActive ? "text-red-deep" : ""}`
                          }
                        >
                          {i.label}
                        </NavLink>
                      </li>
                    ))
                  : [
                      <li key={item.to} className="hairline">
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `block py-3.5 font-body text-[16px] font-medium ${isActive ? "text-red-deep" : ""}`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </li>,
                    ],
              )}
              <li className="py-4">
                <ShowSiteLink className="link-draw inline-flex font-body text-[16px] font-bold text-red-deep" />
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}

/**
 * The page closes on the show's navy, which carries white at 11.9:1 and is the
 * most grown-up colour the brand owns. One deep band per page, and this is it.
 *
 * REBUILT 2026-10-09. It was the default four-column footer: a typographic
 * stand-in lockup with the second line tracked out to 0.3em, then three
 * equal columns of headed links spread across the rest of the width. Two
 * problems, and the client named both. The mark was not their mark, and the
 * whole thing was spaced out: four columns of two or three items each is a
 * grid built to fill a width rather than to hold what is in it.
 *
 * So it is two parts now. The real lockup hangs at the left on its own ropes,
 * from the top edge of the band, with the one sentence that says what the
 * company is. Everything a reader might click sits opposite it in tight
 * groups rather than spread across the width.
 *
 * REGROUPED 2026-10-13, from the creative director's revision of the home
 * page. He asks for four headed columns, which is the footer this one
 * replaced and which his own client sent back. What is worth having is his
 * GROUPING, not his grid: a reader does not want an alphabet of pages, they
 * want the one their job is in. So the right pole now carries Explore,
 * Company, Work with us and the two places that are not this site, still as
 * a tight wrapped flex at the end of the band rather than four columns
 * stretched over 1560px, and the real felted lockup stays where it is.
 *
 * It is no longer generated from NAV. See FOOTER_GROUPS in lib/site.ts.
 */
function Footer() {
  return (
    /* The ropes run off the top of the band rather than beginning in mid air,
       which is the difference between an object hung from the ceiling and an
       object floating. Clipped, so they stop at the band and do not reach up
       into whatever section the page happens to end on. */
    <footer className="deep deep--wash overflow-hidden">
      <Container width="wide" className="pb-14 lg:pb-16">
        {/* Two poles, not four columns. The lockup and the sentence that says
            what the company is at one end, everything clickable at the other,
            and the width between them left alone. A four-column grid across
            1560px was spreading nine links and two sentences over the whole
            monitor, which is what "spaced out" means. */}
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div>
            {/* Hung from the top edge of the band: the ropes in the art run
                to the top of their frame, and the footer's own padding is
                where they start. Clipped by the band, so they do not reach up
                into whatever section the page ends on. */}
            <Wordmark size={176} className="-mt-9 lg:-mt-11" />
            <p className="mt-7 max-w-[32ch] font-body text-[14.5px] leading-relaxed opacity-95">
              Calm, purposeful edutainment for young children, built on research and made by people.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-10 lg:pt-16">
            {/* The headings are no longer invented: they are the client's
                own, out of his deck. That is the difference between this and
                the four columns that were sent back. */}
            {FOOTER_GROUPS.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <p className="eyebrow">{g.title}</p>
                {/* `space-y-4` on a phone, `space-y-2.5` once there is a
                    pointer. A 14.5px link sets a 22px high box, and at 10px
                    apart two of them are 32px centre to centre, which is
                    inside the 24px WCAG 2.2 target spacing a thumb needs.
                    Spacing rather than padding because `.link-draw` paints
                    its rule at the bottom of the padding box, so padding
                    drops the underline off the word. */}
                <ul className="mt-5 space-y-4 sm:space-y-2.5">
                  {g.links.map((i) => (
                    <li key={i.label}>
                      <Link to={i.to} className="link-draw font-body text-[14.5px] opacity-90 hover:opacity-100">
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-5 space-y-4">
                <li>
                  <ShowSiteLink className="link-draw inline-flex font-body text-[14.5px] font-bold" />
                  <p className="mt-1.5 max-w-[26ch] font-body text-[15px] leading-relaxed opacity-95">
                    Episodes, characters and activities.
                  </p>
                </li>
                <li>
                  <TextLink to="/contact">
                    <IconMail size={15} />
                    Partnership enquiries
                  </TextLink>
                  <p className="mt-1.5 max-w-[26ch] font-body text-[15px] leading-relaxed opacity-95">
                    Distribution, investment and press.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline mt-12 flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[14px] opacity-90">
            © {new Date().getFullYear()} CLÉ Family Media. The Pawsitive Pugs &amp; Pals® and
            PupsPlayer™ are trade marks of CLÉ Family Media.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
              ["/cookies", "Cookies"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="font-body text-[14px] opacity-90 hover:opacity-100">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    /* Move focus to the new page.
     *
     * A router swaps the document under the user without a navigation, so the
     * link that was focused is removed and focus falls back to the body: a
     * keyboard user lands at the top of a page with nothing focused, and a
     * screen reader is told nothing happened at all. Focusing `<main>`, which
     * is already `tabIndex={-1}` for the skip link, puts the next Tab in the
     * new content and gives the page a thing to announce.
     *
     * Not on first paint, where focus is already where the browser put it and
     * stealing it would skip past the skip link. */
    if (first.current) {
      first.current = false;
      return;
    }
    landing.prerendered = false;
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <SmoothScroll>
    {/* The paper tooth. Fixed, multiply, above everything and inert. */}
    <div className="grain" aria-hidden="true" />
    {/* The hand's wobble filter, mounted once. Every .ink svg on every page
        references it by id, so it has to be in the tree before any of them. */}
    <InkDefs />
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-pill)] focus:bg-ink focus:px-5 focus:py-2.5 focus:font-body focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      {/* flex-1 pushes the footer to the bottom on short pages (legal, 404). */}
      <main id="main" ref={main} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      </div>
    </SmoothScroll>
  );
}
