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

   This is the page the rest of the site funnels toward, and the earlier
   version was a form in a box under a heading. It carried none of the
   credibility the other pages build and told the sender nothing about where
   their words went.

   So the page now does four things, in order. It asks what the message is
   about, as a rail of four routes rather than a stack of cards. It shows, live,
   the message as the team will receive it (the receipt, the device this page
   owns), built from the same rules as api/contact.ts. It routes the four
   audiences this site is written for to the page that already answers them,
   including the parents the form is not really for. And it puts the faces of
   the people on the other side of the form under all of it.

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
   fieldset sits OUTSIDE the <form> exactly as before, so FormData carries the
   same five fields in the same order and `route` is spread in by hand.
   ========================================================================== */

const ROUTES: { id: RouteId; label: string; blurb: string }[] = [
  {
    id: "partnership",
    label: "Partnerships and distribution",
    blurb: "Studios, broadcasters, distributors, licensing and investment.",
  },
  {
    id: "educator",
    label: "Educators and case studies",
    blurb: "Early years settings, schools and anyone using the activities with children.",
  },
  {
    id: "press",
    label: "Press",
    blurb: "Interviews, podcast bookings and media requests.",
  },
  {
    id: "general",
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

const ALSO: { name: string; role: string; remit: string; asset?: AssetKey }[] = [
  {
    name: "Mansi",
    role: "Production Coordination",
    remit: "Holds the schedule together, so that a note raised at one review stage reaches the people who have to act on it.",
  },
  {
    name: "David Toth",
    role: "Strategic Advisor",
    asset: "person.david",
    remit: "Shapes platform strategy and the low-stimulation media framework that connects screen time to real-world creativity, nature and offline play.",
  },
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

/* What is true about the handling, read off api/contact.ts. Each line maps to
   a line of code there; nothing is a promise about people or time. */
const HANDLING = [
  "The type you choose becomes the subject line, so a partnership enquiry is marked as one before anyone opens it.",
  "Your address is set as the reply-to on the notification, so a reply comes back to you directly.",
  "A hidden field catches automated submissions. There is no captcha to solve.",
  "We store what you send so we can reply to it, and use it for nothing else.",
];

const EMPTY: Draft = { name: "", email: "", organisation: "", message: "" };

/* An underline rather than a box. The form sits on the paper itself, which is
   what stops it reading as a widget dropped into the page. 17px so no mobile
   browser zooms on focus. Focus thickens the rule to red; the global outline
   is kept off here only because a 2px red rule is the stronger signal on a
   field that has no other edge. */
const FIELD =
  "block w-full rounded-none border-0 border-b border-rule bg-transparent px-0 py-3 text-[17px] text-ink " +
  "placeholder:text-muted focus:border-red focus:shadow-[0_1px_0_0_var(--color-red)] focus:outline-none";
const LABEL = "block text-[14px] font-semibold text-ink";

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

      {/* ═══ 1. THE ASK, AND THE ROUTE RAIL.
          The heading and the four routes share one section so the first
          decision the sender makes is part of the opening statement, and a
          selected route is shown by a red rule along the top of its column.
          Outside the <form> on purpose: see the header comment. ═══ */}
      <Section pad={["normal", "none"]}>
        <Container width="wide">
          <Settle>
            <Kicker>Contact</Kicker>
            <h1 className="t-display mt-5 max-w-[14ch]">Write to the people who make it</h1>
            <Lead className="mt-6 max-w-[52ch]">
              Studios, distributors, investors, educators and press. Choose what this is about,
              and the message arrives marked as that, with the company that makes the series.
            </Lead>
          </Settle>

          <fieldset className="mt-14 sm:mt-16">
            <legend className="sr-only">What is this about?</legend>
            <Settle className="grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
              {ROUTES.map((r) => {
                const on = route === r.id;
                return (
                  <label
                    key={r.id}
                    className={`hairline group relative flex cursor-pointer flex-col gap-3 py-6 pr-4 transition-shadow duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-red ${
                      on ? "shadow-[inset_0_2px_0_0_var(--color-red)]" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="route"
                      value={r.id}
                      checked={on}
                      onChange={() => setRoute(r.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors duration-300 ${
                          on ? "border-red bg-red" : "border-muted group-hover:border-body"
                        }`}
                      />
                      <span className={`text-[16px] font-semibold ${on ? "text-ink" : "text-body"}`}>
                        {r.label}
                      </span>
                    </span>
                    <span className="t-sm leading-relaxed text-body">{r.blurb}</span>
                  </label>
                );
              })}
            </Settle>
          </fieldset>
        </Container>
      </Section>

      {/* ═══ 2. THE LETTER AND THE RECEIPT.
          Form on the left, directly on the paper. The receipt on the right
          updates as the sender types and stays in view on a desktop. On a
          phone it follows the form, as a summary of what was written. ═══ */}
      <Section pad={["tight", "normal"]} labelledBy="form-h">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 xl:gap-28">
            <div>
              <h2 id="form-h" className="sr-only">Your message</h2>
              {sent ? (
                <Settle>
                  <div role="status" className="max-w-[48ch]">
                    <p className="eyebrow">Sent</p>
                    <p className="t-h2 mt-4 font-display">Thank you. It has reached us.</p>
                    <p className="t-lead mt-5 text-body">
                      Thanks, we will come back to you. The receipt on this page shows what was
                      sent, with the subject line the team sees.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button to="/">Back to the home page<IconArrow size={16} /></Button>
                      <Button to="/team" variant="quiet">Meet the team</Button>
                    </div>
                  </div>
                </Settle>
              ) : (
                <form className="max-w-[60ch]" onSubmit={submit}>
                  <p className="t-sm text-body">
                    Sending as:{" "}
                    <strong className="font-semibold text-ink">
                      {ROUTES.find((r) => r.id === route)?.label}
                    </strong>
                  </p>

                  {/* Honeypot, no CAPTCHA, which would cost us accessibility. */}
                  <div aria-hidden="true" className="absolute left-[-9999px]">
                    <label htmlFor="company-website">Leave this empty</label>
                    <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-x-10">
                    <div>
                      <label htmlFor="name" className={LABEL}>Name</label>
                      <input
                        id="name" name="name" required autoComplete="name"
                        value={draft.name} onChange={set("name")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={LABEL}>Email</label>
                      <input
                        id="email" name="email" type="email" required autoComplete="email"
                        value={draft.email} onChange={set("email")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label htmlFor="organisation" className={LABEL}>
                      Organisation <span className="font-normal text-body">(optional)</span>
                    </label>
                    <input
                      id="organisation" name="organisation" autoComplete="organization"
                      value={draft.organisation} onChange={set("organisation")}
                      className={FIELD}
                    />
                  </div>

                  <div className="mt-8">
                    <label htmlFor="message" className={LABEL}>Message</label>
                    <textarea
                      id="message" name="message" rows={6} required
                      value={draft.message} onChange={set("message")}
                      className={`${FIELD} resize-y leading-[1.6]`}
                    />
                  </div>

                  {error && (
                    <p role="alert" className="t-sm mt-6 font-medium text-red-deep">{error}</p>
                  )}

                  <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Button type="submit" disabled={busy}>
                      {busy ? "Sending" : "Send message"}<IconMail size={16} />
                    </Button>
                    <p className="t-sm text-body">Name, email and message are required.</p>
                  </div>
                </form>
              )}
            </div>

            <div>
              <div className="lg:sticky lg:top-24">
                <Settle>
                  <Receipt route={route} draft={draft} sent={sent} />
                  <ul className="mt-7 space-y-3">
                    {HANDLING.map((line) => (
                      <li key={line} className="flex gap-3 t-sm leading-relaxed text-body">
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Settle>
              </div>
            </div>
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

      {/* ═══ 4. THE OTHER SIDE OF THE FORM.
          The five people named on every episode's review stages in one row of
          faces, then the two who are on the team in a different capacity, each
          in a hairline row with their remit. The whole site argues "made by
          named people", so the page where a stranger writes to the company
          should show them, and the lead over each group has to be true of
          everyone under it. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="people-h">
        <Container width="wide">
          <div className="hairline pt-14 sm:pt-16">
            <Settle className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <h2 id="people-h" className="t-h2 max-w-[18ch]">Who is on the other side</h2>
              <Lead className="lg:pb-1">
                Not a shared inbox with a logo over it. First, the five people named on the review
                stages of every episode.
              </Lead>
            </Settle>

            <Settle
              as="ul"
              className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
            >
              {FACES.map((p) => (
                <li key={p.name}>
                  <div className="w-[clamp(72px,100%,124px)]">
                    <Figure asset={p.asset} rounded="rounded-[var(--radius-md)]" className="aspect-square" sizes="124px" />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink">{p.name}</h3>
                  <p className="eyebrow eyebrow-sm mt-1.5  leading-snug">{p.role}</p>
                </li>
              ))}
            </Settle>

            <Settle as="ul" className="mt-12">
              {ALSO.map((p) => (
                <li
                  key={p.name}
                  className="hairline grid gap-y-3 py-7 sm:grid-cols-[72px_minmax(0,16rem)_minmax(0,1fr)] sm:items-start sm:gap-x-8"
                >
                  {/* No portrait, no frame: the identity moves into the
                      portrait's place and the remit stays on its own axis,
                      the /team rule. */}
                  {p.asset && (
                    <div className="w-[72px]">
                      <Figure asset={p.asset} rounded="rounded-[var(--radius-md)]" className="aspect-square" sizes="72px" />
                    </div>
                  )}
                  <div className={p.asset ? "" : "sm:col-span-2"}>
                    <h3 className="text-[15px] font-semibold leading-snug text-ink">{p.name}</h3>
                    <p className="eyebrow eyebrow-sm mt-1.5  leading-snug">{p.role}</p>
                  </div>
                  <p className="t-body max-w-[58ch] text-body">{p.remit}</p>
                </li>
              ))}
            </Settle>

            <Settle className="mt-10">
              <TextLink to="/team">Read who each of them is<IconArrow size={15} /></TextLink>
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
