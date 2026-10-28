import { type FormEvent, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Figure } from "@/components/Figure";
import { Button, Section, TextLink, Container } from "@/components/ui";
import { Watermark } from "@/components/draw/Mark";
import { IconExternal, IconArrow, IconMail } from "@/components/icons";
import { type Draft, type RouteId, Receipt, subjectFor } from "@/components/contact/Receipt";
import { SITE } from "@/lib/site";
import { useTeam } from "@/components/team/useTeam";
import { useBlock } from "@/lib/content";
import { COPY } from "@/components/contact/copy";
import "@/components/contact/sheet.css";

/* ============================================================================
   Contact. A form.

   REBUILT TWICE ON 2026-10-09, OPENED AGAIN ON 2026-10-27, AND MADE A FORM
   ON 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, "## contact").

   THE FIRST PASS fixed the usability. The fields were a label with a hairline
   under it, sitting on clay, so a stranger could not see where to type; the
   four enquiry types were four full-width columns of body copy; and the right
   half of the band was a live preview of the notification email, which looked
   like a second form and competed with the real one. Boxes you can see, four
   pills, and the receipt moved to after the send.

   THE SECOND PASS answered the client's verdict on the first, that it worked
   and that it "isn't unique in any way and it doesn't relate to CLÉ". It made
   the page a lit room from the render kit, with the five people named on
   every episode's review mounted on the wall and the sheet standing in front
   of them.

   THE THIRD PASS took the room down and put the home hero's dark panel over
   the form: identifier top left, audience top right, a claim in the hero face
   bottom left. The client rejected that formula on every subpage, and on a
   phone it put a black box and two mono lines before the first field.

   THE FOURTH PASS, this one, opens on the form. There is no panel, no
   picture, no corner copy, no display face, no pill pair. A title row (the
   nav label as the h1, one sentence beside it on the sheet's own grid), then
   the sheet, with the five readers beside it. The page is a sheet of paper
   with boxes on it, and it opens as one.

   THE FACES ARE BACK, SMALL. The cross-site rule puts portraits on three
   pages only: /team at scale, /story for Conor, and here at thumbnail. The
   five who read what is sent are a ruled list with an 88px face each, in the
   order people.ts gives them, read through useTeam() so a title changed in
   the admin changes here. The form is first in the markup, so on a phone it
   is first on the page and the faces follow it.

   THE SUBJECT LINE IS THE PAGE'S ONE DEVICE. Under the route chips, one mono
   line says what the team will receive: "Arrives as  educator enquiry from
   Mairead". It is subjectFor()'s output, which mirrors notify() in
   api/contact.ts, printed exactly as the API sends it, lower case and all.
   The page never re-cases it; if the casing is ever to change, it changes in
   api/contact.ts and Receipt.tsx together. The full receipt still appears
   only after the send.

   THE SHEET DOES NOT LEAN, still. A form cannot: a rotated ancestor blurs the
   text in every field and moves the caret and the native autofill panel off
   the control they belong to. The sheet is a raised card on the paper and
   stays square and flat (src/components/contact/sheet.css). The page's one
   entrance is the Settle around the title row and the grid, whose rest state
   clears its transform.

   THE ADDRESSEE IS AT THE HEAD OF THE SHEET, where a letter puts it: "To:
   CLÉ Family Media, an Irish company." The registered details stay at the
   foot. Both are plain ruled rows with no dotted leader, which belongs to the
   documents, the shop docket and the journal.

   What it deliberately does not say: how fast a reply comes, who answers which
   route, a phone number, office hours, a date. None of that has been supplied,
   and a contact page that invents it is the one place a lie gets found out.
   The registered office is kept to the legal pages for the same reason.

   Functional contract, unchanged: POST /api/contact with
   { route, company_website, name, email, organisation, message }. The route
   radios sit INSIDE the form, so FormData carries `route` itself; the
   explicit spread stays because it is the same value and the server contract
   should not depend on which of the two wrote it. A `?route=` query
   preselects the chip on mount, so a footer word lands with that word chosen.
   ========================================================================== */

/* `short` is what the pill carries and `label` is what the confirmation says.
   A pill wide enough for "Partnerships and distribution" stops being a pill. */
const ROUTES: { label: string; blurb: string; short: string; id: RouteId }[] = [
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

function parseRoute(v: string | null): RouteId | null {
  return ROUTES.some((r) => r.id === v) ? (v as RouteId) : null;
}

/* The four audiences the site is written for, each sent to the page that
   already answers them. Every destination is a real page of this site or the
   show's own; nothing here is a form, and nothing claims what the reader will
   find beyond what that page actually carries. */
const ELSEWHERE: { line: string; title: string; who: string; href?: string; to?: string }[] = [
  {
    who: "Investors and partners",
    title: "Our story",
    line: "Conor Sexton on what he saw, what he could not find, and what it took to build the alternative.",
    to: "/story",
  },
  {
    who: "Broadcasters and distributors",
    title: "The team and the advisors",
    line: "Who makes each episode, and what each of them does.",
    to: "/team",
  },
  {
    who: "Educators and schools",
    title: "Responsible AI",
    line: "The five phases an episode goes through, and where AI is and is not used in making one.",
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

/* The blank on the subject line before a name arrives: a 10ch underscore
   run, as the plan sets it. */
const BLANK = "__________";

export default function Contact() {
  const [params] = useSearchParams();
  const [route, setRoute] = useState<RouteId>(() => parseRoute(params.get("route")) ?? "partnership");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* A footer word clicked while already on this page changes the query but
     not the mount, so the chip follows the query too. Anything that is not
     one of the four ids is ignored. */
  const wanted = parseRoute(params.get("route"));
  useEffect(() => {
    if (wanted) setRoute(wanted);
  }, [wanted]);

  /* The five named on the review stages of every episode: the members with
     a portrait, in people.ts order (see the note in that file on why the
     portrait is the marker). Read through useTeam() so a title changed in
     the admin changes here. */
  const { team } = useTeam();
  const readers = team.filter((m) => m.asset || m.photo).slice(0, 5);

  /* EDITABLE FROM THE ADMIN: the page's own wording
     (components/contact/copy.ts) until a content_blocks row replaces it. */
  const title = useBlock("contact", "title", COPY["title"]);
  const lead = useBlock("contact", "lead", COPY["lead"]);
  const readersHeading = useBlock("contact", "readers.heading", COPY["readers.heading"]);
  const readersNote = useBlock("contact", "readers.note", COPY["readers.note"]);
  const elseHeading = useBlock("contact", "else.heading", COPY["else.heading"]);
  const elseLine = useBlock("contact", "else.line", COPY["else.line"]);

  const subject = subjectFor(route, draft);

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

      {/* ═══ 1. THE TITLE ROW AND THE SHEET. One grid from the first pixel:
          the title row and the sheet row share the 40rem left column and the
          same gutter, so the h1 and the sheet share a left edge, and the lead
          and the readers column share the right column's edge. One Settle
          around both rows: the title lands first, the sheet and the readers
          60ms after. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="contact-h" className="mk-host pt-8 lg:pt-14">
        <Watermark shape="leaf" at="right" />
        <Container width="wide">
          <Settle>
            <div className="grid gap-y-5 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:items-end lg:gap-x-16 xl:gap-x-24">
              <h1 id="contact-h" className="t-h1">{title}</h1>
              <p className="t-lead max-w-[44ch] text-body">{lead}</p>
            </div>

            <div className="mt-8 grid gap-y-12 lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24">
              <div>
                <h2 id="form-h" className="sr-only">Your message</h2>

                {sent ? (
                  <div className="contact-sheet" role="status">
                    <p className="eyebrow">Sent</p>
                    <p className="t-h2 mt-4 font-display">Thank you. It has reached us.</p>
                    <p className="t-lead mt-5 text-body">
                      This is the message as the team has it, with the subject line they see.
                    </p>
                    <Receipt className="contact-receipt mt-8" route={route} draft={draft} sent />
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Button to="/">Back to the home page<IconArrow size={16} /></Button>
                      <Button to="/team" variant="quiet">Meet the team</Button>
                    </div>
                  </div>
                ) : (
                  <form className="contact-sheet" onSubmit={submit} aria-labelledby="form-h">
                    {/* The addressee, where a letter puts it: at the head of
                        the sheet. A plain ruled row, no leader. */}
                    <dl className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-[1.5px] border-rule pb-5">
                      <dt className="field-label !mb-0 text-[15px]">To</dt>
                      <dd className="t-body text-ink">CLÉ Family Media, an Irish company</dd>
                    </dl>

                    <fieldset className="mt-7">
                      <legend className="field-label">What is this about?</legend>
                      <div className="form-chips">
                        {ROUTES.map((r) => (
                          <label key={r.id} className="chip min-h-11" data-on={route === r.id ? "" : undefined}>
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

                    {/* The subject line, composing itself. subjectFor() is the
                        rule api/contact.ts applies, printed verbatim: the
                        route word is lower case because the API sends it
                        lower case. Not a box, not a card, not a heading. */}
                    <p className="form-subject mt-4" aria-live="polite">
                      <span className="form-subject__label">Arrives as</span>
                      <span className="form-subject__line">
                        {subject.lead}{" "}
                        <span className="form-subject__from" data-empty={subject.from ? undefined : ""}>
                          {subject.from || BLANK}
                        </span>
                      </span>
                    </p>

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
                    <p className="t-sm mt-7 border-t-[1.5px] border-rule pt-5 text-body">
                      Your address is set as the reply-to, so a reply comes straight back to you.
                      We store what you send so we can answer it, and use it for nothing else.
                    </p>

                    {/* The registered details. The registered office is NOT
                        repeated here: legal pages only, because it is a family
                        home; the entity and the number are not the address,
                        and naming them is what a reader of this page wants. */}
                    <dl className="mt-7 border-t-[1.5px] border-rule pt-5 text-[15px] leading-relaxed text-body">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="font-semibold text-ink">Registered details:</dt>
                        <dd>
                          CLE Family Media 25 Limited, registered in Ireland, company number
                          820427. The registered office is at the head of the{" "}
                          <TextLink to="/privacy">privacy policy</TextLink>.
                        </dd>
                      </div>
                    </dl>
                  </form>
                )}
              </div>

              {/* ═══ 2. WHO READS WHAT YOU SEND. "The people who make it" as a
                  list a sender can verify: five faces at thumbnail, name and
                  role stacked, hairline rows. Held in view beside the sheet
                  on a wide screen; after it on a phone. Capped, because at
                  the content cap the column runs to 800px. ═══ */}
              <div className="lg:sticky lg:top-28 lg:max-w-[36rem] lg:self-start">
                <h2 className="t-h3 max-w-[16ch]">{readersHeading}</h2>
                <ul className="mt-6">
                  {readers.map((m) => (
                    <li
                      key={m.name}
                      className="flex items-center gap-5 border-t-[1.5px] border-rule py-3 lg:py-4"
                    >
                      <div className="form-face">
                        <Figure
                          asset={m.asset ?? "person.conor"}
                          override={m.photo ?? null}
                          sizes="88px"
                          rounded="rounded-none"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[17px] font-semibold leading-snug text-ink">{m.name}</p>
                        <p className="mt-1 font-mono text-[13px] uppercase leading-[1.45] tracking-[0.12em] text-body">
                          {m.role}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="max-w-[44ch] border-t-[1.5px] border-rule pt-5 text-[15px] leading-[1.6] text-ink">
                  {readersNote}{" "}
                  <TextLink to="/team">Read who each of them is<IconArrow size={15} /></TextLink>
                </p>
              </div>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. ANSWERED ELSEWHERE. The readers who came to read, not write,
          sent to the page that already answers them. A label over a list,
          not a sentence in display type. Four audiences, four destinations,
          as hairline rows across the full width: an index is what a reader
          scanning for their own description wants. The page ends on this
          list; the footer is its closing. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="else-h">
        <Container width="wide">
          <div className="hairline pt-14 sm:pt-16">
            <Settle className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <h2 id="else-h" className="t-h3">{elseHeading}</h2>
              <p className="t-sm text-body">{elseLine}</p>
            </Settle>

            <Settle as="ul" className="mt-8">
              {ELSEWHERE.map((e) => {
                const icon = e.href ? <IconExternal size={16} /> : <IconArrow size={16} />;
                const inner = (
                  <>
                    <span className="eyebrow eyebrow-sm leading-snug">{e.who}</span>
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
                  /* No closing rule under the last row: the footer opens with
                     its own, and two hairlines 130px apart read as a mistake
                     rather than as a frame. */
                  <li key={e.who} className="hairline">
                    {e.to ? (
                      <Link to={e.to} className={cls}>{inner}</Link>
                    ) : (
                      <a href={e.href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                );
              })}
            </Settle>
          </div>
        </Container>
      </Section>
    </>
  );
}
