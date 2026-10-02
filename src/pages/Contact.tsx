import { useState, type FormEvent } from "react";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Button, Card, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
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

   So the page now does three things, in order. It asks what the message is
   about, as a rail of four routes rather than a stack of cards. It shows, live,
   the message as the team will receive it (the receipt, the device this page
   owns), built from the same rules as api/contact.ts. And it puts the faces of
   the people on the other side of the form under it.

   What it deliberately does not say: how fast a reply comes, who answers which
   route, a phone number, an address, office hours. None of that has been
   supplied, and a contact page that invents it is the one place a lie gets
   found out.

   Functional contract, unchanged: POST /api/contact with
   { route, company_website, name, email, organisation, message }. The route
   fieldset sits OUTSIDE the <form> exactly as before, so FormData carries the
   same five fields in the same order and `route` is spread in by hand.
   ========================================================================== */

const ROUTES: { id: RouteId; label: string; blurb: string }[] = [
  {
    id: "partnership",
    label: "Partnerships and distribution",
    blurb: "Studios, broadcasters, distributors, licensing and investment. The route we watch most closely.",
  },
  {
    id: "educator",
    label: "Educators and case studies",
    blurb: "Early years settings, schools and anyone interested in taking part in a case study.",
  },
  {
    id: "press",
    label: "Press",
    blurb: "Interviews, podcast bookings, media requests and the press pack.",
  },
  {
    id: "general",
    label: "General enquiry",
    blurb: "Anything else about the company, the series or the work.",
  },
];

/* Names, roles and portraits as the client supplied them 2026-10-01. No route
   is assigned to a person here because nothing supplied says who reads what;
   this is the company the message is addressed to, no more. Mansi has no
   portrait, so she gets an initial on a well, the same treatment /team uses,
   and never an empty frame. */
const PEOPLE: { name: string; role: string; asset?: AssetKey }[] = [
  { name: "Conor Sexton", role: "Founder and CEO", asset: "person.conor" },
  { name: "Alan Compton", role: "Creative Director", asset: "person.alan" },
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula" },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia" },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie" },
  { name: "Mansi", role: "Production Coordination" },
  { name: "David Toth", role: "Strategic Advisor", asset: "person.david" },
];

/* What is true about the handling, read off api/contact.ts. Each line maps to
   a line of code there; nothing is a promise about people or time. */
const HANDLING = [
  "The type you choose becomes the subject line, so a partnership enquiry is marked as one before anyone opens it.",
  "Your address is set as the reply-to on the notification, so a reply comes back to you directly.",
  "A hidden field catches automated submissions. There is no captcha to solve.",
  "We use what you send here to reply to you, and nothing else.",
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
      <Section className="!pb-0">
        <Container width="wide">
          <Settle>
            <Kicker>Contact</Kicker>
            <h1 className="t-h1 mt-5 max-w-[16ch]">Write to the people who make it</h1>
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
      <Section className="!pt-14 sm:!pt-16" labelledBy="form-h">
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

      {/* ═══ 3. THE OTHER SIDE OF THE FORM.
          Seven people in one row, portraits where they exist. The whole site
          argues "made by named people", so the page where a stranger writes
          to the company should show them. ═══ */}
      <Section className="!pt-0" labelledBy="people-h">
        <Container width="wide">
          <div className="hairline pt-14 sm:pt-16">
            <Settle className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <h2 id="people-h" className="t-h2 max-w-[18ch]">Who is on the other side</h2>
              <Lead className="lg:pb-1">
                The people whose names go on every episode, and whose company you are writing to.
              </Lead>
            </Settle>

            <Settle
              as="ul"
              className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 lg:grid-cols-7"
            >
              {PEOPLE.map((p) => (
                <li key={p.name}>
                  <div className="w-[clamp(72px,100%,124px)]">
                    {p.asset ? (
                      <Figure asset={p.asset} rounded="rounded-full" className="aspect-square" sizes="124px" />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="well flex aspect-square items-center justify-center rounded-full font-display text-[40px] text-body"
                      >
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink">{p.name}</h3>
                  <p className="eyebrow mt-1.5 !text-[10.5px] leading-snug">{p.role}</p>
                </li>
              ))}
            </Settle>

            <Settle className="mt-10">
              <TextLink to="/team">Read who each of them is<IconArrow size={15} /></TextLink>
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 4. THE SHOW, the one deep band.
          A parent who lands here is probably looking for the episodes, which
          live on the show's own site. The felted wordmark is a photograph of a
          real object, so it is framed as on the home page rather than cut out. ═══ */}
      <Section deep labelledBy="show-h">
        <Container width="wide">
          <Settle className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div>
              <h2 id="show-h" className="t-h2 max-w-[16ch]">Looking for the show itself?</h2>
              <p className="t-lead mt-6 max-w-[46ch] opacity-85">
                Episodes, characters and activities for children live on the show's own site. This
                site is the company behind it.
              </p>
              <div className="mt-9">
                <Button href={SITE.showUrl} variant="quiet" className="!border-raised/35 !text-raised hover:!border-raised/70">
                  Visit pawsitivepugs.com<IconExternal size={15} />
                </Button>
              </div>
            </div>
            <div className="w-[clamp(220px,60%,360px)] lg:justify-self-end">
              <Card className="tilt-b overflow-hidden p-2">
                <Figure asset="brand.show" rounded="rounded-[var(--radius-md)]" sizes="360px" />
              </Card>
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
