import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { HangingMarks } from "@/components/render";
import { Settle } from "@/components/Settle";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconExternal, IconMail } from "@/components/icons";
import { Receipt, type Draft, type RouteId } from "@/components/contact/Receipt";
import { SITE } from "@/lib/site";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   Contact.

   REBUILT 2026-10-09. The page before this one failed at the only job it has.
   The fields were a label with a hairline under it, sitting on clay, so a
   stranger could not see where to type; the four enquiry types were four
   full-width columns of body copy; and the right half of the band was a live
   preview of the notification email, which looked like a second form and
   competed with the real one. The client's verdict was "borderline unusable",
   and it was right.

   So this page is deliberately conventional, and it is the one page on the
   site where that is the correct answer. One form, in one column, at a
   readable measure, with boxes you can see and a question at the top that is
   four pills rather than four sections. Everything inventive the page used to
   do before the send now happens after it.

   THE RECEIPT IS DEMOTED, NOT DROPPED. Showing a sender the exact notification
   the team receives is a good idea in the wrong place: nobody needs it while
   they are still writing. It now appears once the message has gone, where it
   is a confirmation of what was sent rather than a rehearsal of it.

   THE FOUR AUDIENCES, 2026-10-06. The site is written for investors and
   partners, broadcasters and distributors, educators and schools, and parents,
   and a contact page is where all four arrive at once. The alternative to one
   form with a dropdown is not a second form: it is saying plainly which page
   answers which reader, and letting most of them leave without writing
   anything. That is section 3, and it is why the parents' row sends people off
   this site entirely, to the show.

   What it deliberately does not say: how fast a reply comes, who answers which
   route, a phone number, office hours. None of that has been supplied, and a
   contact page that invents it is the one place a lie gets found out. The
   registered company details have their slot on the closing band and are
   visibly empty for the same reason, which is the pattern
   src/components/ethical-ai/CaseStudy.tsx set.

   Functional contract, unchanged: POST /api/contact with
   { route, company_website, name, email, organisation, message }. The route
   radios now sit INSIDE the form, so FormData carries `route` itself; the
   explicit spread stays because it is the same value and the server contract
   should not depend on which of the two wrote it.
   ========================================================================== */

/* `short` is what the pill carries and `label` is what the subject line and
   the confirmation say. A pill wide enough for "Partnerships and distribution"
   stops being a pill. */
const ROUTES: { id: RouteId; short: string; label: string; blurb: string }[] = [
  {
    id: "partnership",
    short: "Partnerships",
    label: "Partnerships and distribution",
    blurb: "Studios, broadcasters, distributors, licensing and investment.",
  },
  {
    id: "educator",
    short: "Educators",
    label: "Educators and case studies",
    blurb: "Early years settings, schools and anyone using the activities with children.",
  },
  {
    id: "press",
    short: "Press",
    label: "Press",
    blurb: "Interviews, podcast bookings and media requests.",
  },
  {
    id: "general",
    short: "General",
    label: "General enquiry",
    blurb: "Anything else about the company, the series or the work.",
  },
];

/* Names, roles and portraits as the client supplied them 2026-10-01. No route
   is assigned to a person here because nothing supplied says who reads what;
   this is the company the message is addressed to, no more.

   Two groups, because the lead over the first one has to be true of everyone
   under it. The five faces are the people named on the review stages of every
   episode. Mansi and David sit in their own rows beneath with their remit
   stated in /team's words: she coordinates production and is named on no
   stage, he is an advisor and /team deliberately places him outside the six
   stages.

   Mansi has no portrait and gets no tile, no initial and no frame, which is
   the /team rule: an empty frame on a page about named people reads as a
   missing person. Her row is simply a different shape. */
const FACES: { name: string; role: string; asset: AssetKey }[] = [
  { name: "Conor Sexton", role: "Founder and CEO", asset: "person.conor" },
  { name: "Alan Compton", role: "Creative Director", asset: "person.alan" },
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula" },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia" },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie" },
];

/* The four audiences the site is written for, each sent to the page that
   already answers them. Every destination is a real page of this site or the
   show's own; nothing here is a form, and nothing claims what the reader will
   find beyond what that page actually carries. */
const ELSEWHERE: { who: string; title: string; line: string; to?: string; href?: string }[] = [
  {
    who: "Investors and partners",
    title: "Our story",
    line: "Conor Sexton on what he saw, what he could not find, and what it took to build the alternative.",
    to: "/story",
  },
  {
    who: "Broadcasters and distributors",
    title: "The team and the advisors",
    line: "Who makes each episode, and who is answerable at each stage of the review.",
    to: "/team",
  },
  {
    who: "Educators and schools",
    title: "Responsible AI",
    line: "The six stages an episode passes through, and where AI is and is not used in making one.",
    to: "/ethical-ai",
  },
  {
    who: "Parents",
    title: "The show's own site",
    line: "Episodes, characters and the family activities all live there rather than here.",
    href: SITE.showUrl,
  },
];

const EMPTY: Draft = { name: "", email: "", organisation: "", message: "" };

export default function Contact() {
  const [route, setRoute] = useState<RouteId>("partnership");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Draft>(k: K) {
    return (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route, ...Object.fromEntries(fd) }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error ?? "Could not send your message. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not send your message. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact and partnerships"
        description="Get in touch with CLÉ Family Media about partnership, distribution and investment, press enquiries, or anything else."
        path="/contact"
      />

      {/* ═══ 1. THE ASK AND THE FORM, in one band.
          Two columns on a desktop: what this page is on the left, the form on
          the right, and the left column holds while the form scrolls past it.
          Centring the sheet under a left-aligned heading left a third of the
          band empty beside it and read as a widget dropped onto the page.
          The faces are here rather than in a section of their own further
          down: "who reads this" is a thing to know BEFORE writing, and the
          version that sat at the foot of the page was a second copy of a
          strip /team already owns. ═══ */}
      <Section pad={["normal", "normal"]} labelledBy="form-h">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
            <Settle className="lg:sticky lg:top-28 lg:self-start">
              <Kicker>Contact</Kicker>
              <h1 className="t-display mt-5 max-w-[13ch]">Write to the people who make it</h1>
              <Lead className="mt-6 max-w-[42ch]">
                Studios, distributors, investors, educators and press. Choose what this is about,
                and the message arrives marked as that, with the company that makes the series.
              </Lead>

              <div className="mt-10 border-t border-rule pt-8">
                <p className="eyebrow">Who it reaches</p>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {FACES.map((p) => (
                    <li key={p.name} className="w-[clamp(56px,16%,68px)]">
                      <Figure
                        asset={p.asset}
                        rounded="rounded-[var(--radius-sm)]"
                        className="aspect-square"
                        sizes="68px"
                      />
                    </li>
                  ))}
                </ul>
                <p className="t-body mt-5 max-w-[42ch] text-body">
                  Not a shared inbox with a logo over it. These are the five people named on the
                  review stages of every episode.
                </p>
                <p className="mt-5">
                  <TextLink to="/team">Read who each of them is<IconArrow size={15} /></TextLink>
                </p>
              </div>
            </Settle>

            <Settle>
              <h2 id="form-h" className="sr-only">Your message</h2>

              {sent ? (
                <div role="status">
                  <p className="eyebrow">Sent</p>
                  <p className="t-h2 mt-4 font-display">Thank you. It has reached us.</p>
                  <p className="t-lead mt-5 text-body">
                    This is the message as the team has it, with the subject line they see.
                  </p>
                  <Receipt className="mt-8" route={route} draft={draft} sent />
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button to="/">Back to the home page<IconArrow size={16} /></Button>
                    <Button to="/team" variant="quiet">Meet the team</Button>
                  </div>
                </div>
              ) : (
                <form className="card card-still rounded-[var(--radius-lg)] px-5 py-8 sm:px-10 sm:py-10" onSubmit={submit}>
                  <fieldset>
                    <legend className="field-label">What is this about?</legend>
                    <div className="flex flex-wrap gap-2.5">
                      {ROUTES.map((r) => (
                        <label key={r.id} className="chip" data-on={route === r.id ? "" : undefined}>
                          <input
                            type="radio"
                            name="route"
                            value={r.id}
                            checked={route === r.id}
                            onChange={() => setRoute(r.id)}
                            className="sr-only"
                          />
                          {r.short}
                        </label>
                      ))}
                    </div>
                    <p className="t-sm mt-3 text-body">
                      {ROUTES.find((r) => r.id === route)?.blurb}
                    </p>
                  </fieldset>

                  {/* Honeypot, no CAPTCHA, which would cost us accessibility. */}
                  <div aria-hidden="true" className="absolute left-[-9999px]">
                    <label htmlFor="company-website">Leave this empty</label>
                    <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-x-6">
                    <div>
                      <label htmlFor="name" className="field-label">Name</label>
                      <input
                        id="name" name="name" required autoComplete="name"
                        value={draft.name} onChange={set("name")}
                        className="field-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">Email</label>
                      <input
                        id="email" name="email" type="email" required autoComplete="email"
                        value={draft.email} onChange={set("email")}
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="organisation" className="field-label">
                      Organisation <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="organisation" name="organisation" autoComplete="organization"
                      value={draft.organisation} onChange={set("organisation")}
                      className="field-input"
                    />
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="field-label">Message</label>
                    <textarea
                      id="message" name="message" rows={8} required
                      value={draft.message} onChange={set("message")}
                      className="field-textarea"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="t-sm mt-6 font-medium text-red-deep">{error}</p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Button type="submit" disabled={busy}>
                      {busy ? "Sending" : "Send message"}<IconMail size={16} />
                    </Button>
                    <p className="t-sm text-body">Name, email and message are required.</p>
                  </div>

                  {/* One line, not four bullets of implementation detail. The
                      page where an investor writes to the company is not the
                      place to explain the honeypot. */}
                  <p className="t-sm mt-7 border-t border-rule pt-5 text-body">
                    Your address is set as the reply-to, so a reply comes straight back to you.
                    We store what you send so we can answer it, and use it for nothing else.
                  </p>
                </form>
              )}
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 3. THE READERS WHO SHOULD NOT BE WRITING A LETTER.
          Four audiences, four destinations, as hairline rows across the full
          width. Rows rather than cards on purpose: four boxes with four little
          icons is the shape this whole pass exists to remove, and an index is
          what a reader scanning for their own description actually wants. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="else-h">
        <Container width="wide">
          <div className="hairline pt-14 sm:pt-16">
            <Settle className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <h2 id="else-h" className="t-h2 max-w-[18ch]">What the site already sets out</h2>
              <Lead className="lg:pb-1">
                Some of this is answered better by a page than by us. Who is asking, and where it
                is written down.
              </Lead>
            </Settle>

            <Settle as="ul" className="mt-10">
              {ELSEWHERE.map((e) => {
                const icon = e.href ? <IconExternal size={16} /> : <IconArrow size={16} />;
                const inner = (
                  <>
                    <span className="eyebrow eyebrow-sm  leading-snug">{e.who}</span>
                    {/* The arrow rides with the title on a phone and moves to
                        the far edge of the row on a desktop. A single arrow in
                        the last column dropped onto a line of its own once the
                        grid collapsed, which looked like a stray glyph. */}
                    <span className="flex items-start justify-between gap-5">
                      <span className="text-[17px] font-semibold text-ink">{e.title}</span>
                      <span className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-red-deep sm:hidden">
                        {icon}
                      </span>
                    </span>
                    <span className="t-body max-w-[54ch] text-body">{e.line}</span>
                    <span className="mt-1 hidden shrink-0 text-muted transition-colors group-hover:text-red-deep sm:block sm:justify-self-end">
                      {icon}
                    </span>
                  </>
                );
                const cls =
                  "group grid items-start gap-x-10 gap-y-2 py-6 sm:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)_minmax(0,1fr)_auto] sm:py-7";
                return (
                  /* No closing rule under the last row: the people section
                     opens with its own, and two hairlines 130px apart read as
                     a mistake rather than as a frame. */
                  <li key={e.who} className="hairline">
                    {e.to ? (
                      <Link to={e.to} className={cls}>{inner}</Link>
                    ) : (
                      <a href={e.href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 5. WHO THE LETTER IS ADDRESSED TO, the one deep band.
          The page ends on the formal identity of the company, because the
          reader it is written for is doing diligence and a name with no
          company behind it is the gap they notice. The show cross-link used to
          close the page here; it has moved up into section 3, where the
          audience it is for is actually named, and this band carries what a
          letter needs instead: who it goes to, and what is not yet published.

          The registered details are EMPTY ON PURPOSE. Nobody has supplied a
          company number or a registered office, the privacy policy promises
          both, and inventing either on the page that invites investors to
          write would be the worst place on this site to be caught out. Logged
          in CONTENT-NEEDED.md. ═══ */}
      <Section deep labelledBy="company-h">
        <Container width="wide">
          <Settle className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
            <div>
              <h2 id="company-h" className="t-h2 max-w-[16ch]">The company you are writing to</h2>
              <p className="t-lead mt-6 max-w-[48ch] opacity-85">
                An Irish company that makes one series, with the people who make it named on every
                stage of it.
              </p>

              <dl className="mt-10 border-t border-white/20">
                <div className="grid gap-y-1.5 border-b border-white/20 py-5 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] sm:gap-x-10">
                  <dt className="eyebrow eyebrow-sm ">Company</dt>
                  <dd className="text-[16px] font-semibold">CLÉ Family Media</dd>
                </div>
                <div className="grid gap-y-1.5 border-b border-white/20 py-5 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] sm:gap-x-10">
                  <dt className="eyebrow eyebrow-sm ">Trade marks</dt>
                  <dd className="t-body opacity-90">
                    <em>The Pawsitive Pugs &amp; Pals</em>&reg; and PupsPlayer&trade;, both of CLÉ
                    Family Media.
                  </dd>
                </div>
                <div className="grid gap-y-1.5 border-b border-white/20 py-5 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] sm:gap-x-10">
                  <dt className="eyebrow eyebrow-sm ">Registered details</dt>
                  <dd className="t-body opacity-90">
                    The company number and registered office are not published yet. They go here,
                    and at the foot of the{" "}
                    <TextLink to="/privacy">privacy policy</TextLink>,
                    as soon as registration is confirmed.
                  </dd>
                </div>
              </dl>
            </div>

            {/* The mark, LIT rather than framed.
                
                This was a flat cut-out in a card, with a comment explaining
                that a cut-out on a navy field loses what makes the object
                worth showing. True of a flat one. The height map that was
                generated for this mark and never used puts the relief back,
                and the lamp crosses it as the band comes up the screen, so
                the wool catches the light the way the real object does. */}
            {/* Pulled up so the ropes leave the top of the band rather than
                beginning in mid air, which is the difference between objects
                hung from the ceiling and objects floating. */}
            <div className="-mt-6 lg:-mt-24 lg:justify-self-end">
              <HangingMarks size={228} />
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
