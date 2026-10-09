import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { NAV, SITE } from "@/lib/site";
import { Wordmark } from "@/components/Wordmark";
import navMark from "@/assets/brand/cle-nav.webp";
import { IconExternal, IconMail } from "@/components/icons";
import { Container, TextLink } from "@/components/ui";
import { SmoothScroll } from "@/components/SmoothScroll";

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

/**
 * A warm sheet the page scrolls under. Opaque enough that the nav is always
 * ink on clay, because a header is the one surface that must never let what is
 * beneath it read through. The show site has no persistent header at all; a
 * company site needs one, and this is the least it can weigh.
 */
function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-rule)] bg-[rgba(245,236,217,0.94)] backdrop-blur-[14px]">
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
            {NAV.map((item) => (
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
            ))}
          </ul>
        </nav>

        <ShowSiteLink
          className="hidden shrink-0 rounded-[var(--radius-pill)] border px-4 py-2.5 font-body text-[13px] font-bold text-ink transition-colors hover:border-ink lg:inline-flex"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={open ? "mobile-nav" : undefined}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border text-ink lg:hidden"
          style={{ borderColor: "var(--color-rule)" }}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <div aria-hidden="true" className="hairline" />

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-b border-[var(--color-rule)] bg-[rgba(245,236,217,0.97)] lg:hidden">
          <Container width="wide">
            <ul className="pb-3">
              {NAV.map((item) => (
                <li key={item.to} className="hairline">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block py-3.5 font-body text-[16px] font-medium ${isActive ? "text-red-deep" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
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
 * company is. Everything a reader might click sits opposite it in two tight
 * groups: where to go on this site, and the two places that are not this site.
 */
function Footer() {
  return (
    /* The ropes run off the top of the band rather than beginning in mid air,
       which is the difference between an object hung from the ceiling and an
       object floating. Clipped, so they stop at the band and do not reach up
       into whatever section the page happens to end on. */
    <footer className="deep overflow-hidden">
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
            <p className="mt-7 max-w-[32ch] font-body text-[14.5px] leading-relaxed opacity-80">
              Calm, purposeful edutainment for young children, built on research and made by people.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-10 lg:pt-16">
            <nav aria-label="Footer">
              <p className="eyebrow">This site</p>
              {/* Two columns of a single list, not two headed sections. Seven
                  links in one tall column was most of the old footer's
                  height, and splitting them under invented headings would be
                  inventing an information architecture for a footer. */}
              <ul className="mt-5 grid grid-cols-2 gap-x-10 gap-y-2.5">
                {NAV.map((i) => (
                  <li key={i.to}>
                    <Link to={i.to} className="link-draw font-body text-[14.5px] opacity-90 hover:opacity-100">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-5 space-y-4">
                <li>
                  <ShowSiteLink className="link-draw inline-flex font-body text-[14.5px] font-bold" />
                  <p className="mt-1.5 max-w-[26ch] font-body text-[13.5px] leading-relaxed opacity-75">
                    Episodes, characters and activities.
                  </p>
                </li>
                <li>
                  <TextLink to="/contact">
                    <IconMail size={15} />
                    Partnership enquiries
                  </TextLink>
                  <p className="mt-1.5 max-w-[26ch] font-body text-[13.5px] leading-relaxed opacity-75">
                    Distribution, investment and press.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline mt-12 flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[12.5px] opacity-65">
            © {new Date().getFullYear()} CLÉ Family Media. The Pawsitive Pugs &amp; Pals® and
            PupsPlayer™ are trade marks of CLÉ Family Media.
          </p>
          <ul className="flex gap-6">
            {[
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
              ["/cookies", "Cookies"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="font-body text-[12.5px] opacity-65 hover:opacity-100">
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
    main.current?.focus();
  }, [pathname]);

  return (
    <SmoothScroll>
    {/* The paper tooth. Fixed, multiply, above everything and inert. */}
    <div className="grain" aria-hidden="true" />
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
