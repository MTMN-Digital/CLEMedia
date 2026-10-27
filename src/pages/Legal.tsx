import { type ReactNode, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { PageHero } from "@/components/PageHero";
import { TextLink, Container, DisclosurePanel, Section } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { splitParagraphs, useBlock } from "@/lib/content";

/* ============================================================================
   The three legal documents: /privacy, /terms, /cookies.

   A parent who opens the privacy policy of a children's media company is
   exactly the reader this site is trying to convince, and an investor's
   diligence reaches these pages too. So they are typeset as documents rather
   than left as a stack of paragraphs in a 68ch column with no way to find
   anything.

   WHAT CHANGED IS THE SETTING, NOT A WORD OF THE TEXT. Every clause below is
   byte for byte what it was. Nothing was added, nothing was softened, nothing
   was reordered. The work here is numbering the sections, giving each one an
   anchor, putting an index beside them, marking the terms the documents use in
   a defined sense, and dating the thing honestly.

   THE DATE. It used to read `new Date()`, so the page announced it had been
   updated on whatever day the reader happened to open it. That is a false
   statement on a document whose whole value is being accurate, and it would
   have been a bad one to leave on a GDPR page. The date now comes from the
   document: DRAFTED is the day the wording was last written (commit 1dae1cc,
   2026-09-20; everything since has been presentation). Change a clause, change
   that constant in the same edit.

   THE SHEET. The three documents are one set, so they are drawn as one: a
   sheet of card with three tabs, the one you are reading raised into the
   paper of the sheet and the other two sitting behind it. That is the page's
   signature, and it is the folder these three things actually live in.

   THE OPENING, 2026-10-27. The title used to stand at the left edge of the
   paper over a grey lead, with the document's facts in a small list hard
   right. It now opens the way every page opens, in the hero's frame: the
   plain panel on the deeper paper, the company and the draft status in the
   top left corner, the date and the jurisdiction in the top right, and the
   document's name in the bottom left at the hero's scale. The name stays the
   name ("Privacy policy", not a claim): on a legal page, saying what the
   document is beats saying what it says. The one-line summary that used to
   be the lead is the first line of the sheet instead, where it introduces
   the clauses it summarises.

   THE COMPANY DETAILS, CLOSED 2026-10-13. The registered name, number and
   office now head every one of the three documents, taken from the signed
   proposal CFM-02. See `COMPANY` below. The draft notice that used to sit in
   that slot came out in the same edit, on David's instruction: these are
   published terms now, and the exposure sits with CLÉ and MTMN rather than
   with a solicitor who has not seen them.

   STILL OPEN: a public email address. The documents send every request
   through /contact, which works, but a privacy policy that names no address
   for a data request is thinner than it should be, and the safeguarding
   address does not exist either. Both are logged in CONTENT-NEEDED.md.
   ========================================================================== */

type DocId = "cookies" | "privacy" | "terms";

interface Doc {
  title: string;
  /** The short name on the tab and in the document shelf. */
  tab: string;
  description: string;
  intro: string;
  /** Terms this document uses in a defined sense. The FIRST occurrence of each
   *  is marked where it stands, which is how a printed policy does it. Nothing
   *  is glossed: a definition would be new legal text. */
  defined: string[];
  sections: { h: string; p: string[] }[];
}

/** The day the wording was last written. Not today, and never a live date. */
const DRAFTED = "2026-10-24";

/* The trader's identity, from the signed proposal CFM-02 and nowhere else.
   Not guessed, not looked up, not reconstructed from the brand name: these are
   the words in the contract both companies put their names to.

   WHY IT IS ON THE PAGE. The privacy policy named itself the data controller
   and then promised the registration details "at the foot of this page once
   registration details are confirmed", which is a policy pointing at a blank.
   Article 6 of the Consumer Rights Directive wants a trading name, a
   geographic address and an identity before a consumer buys anything, and the
   shop takes money for digital files.

   WHY THERE IS NO VAT LINE. CLÉ's VAT position is not in the proposal and the
   brief is explicit that VAT on digital goods belongs to the client and their
   accountant. An absent VAT number says nothing; a guessed one is a false
   statement on a legal page.

   WHY NOT IN THE GLOBAL FOOTER. David's call, 2026-10-13: the registered
   office is a family home, it satisfies the Directive where the law actually
   looks, and it does not need to sit on all thirteen pages to do that. */
const COMPANY = {
  legal: "CLE Family Media 25 Limited",
  cro: "820427",
  office: "Curraghs, Liscarroll, Mallow, Co. Cork, P51 K2T9",
};

const ORDER: DocId[] = ["privacy", "terms", "cookies"];

/**
 * The three policies as published. They were drafted here, not by a solicitor,
 * and David's instruction on 2026-10-13 was to publish them as they stand
 * rather than carry a draft notice to launch. An Irish company selling digital
 * goods into the EU has obligations these summarise; a solicitor reading them
 * later may want more, and the place to change the wording is this object.
 */
const DOCS: Record<DocId, Doc> = {
  privacy: {
    title: "Privacy policy",
    tab: "Privacy",
    description: "How CLÉ Family Media handles personal data.",
    intro:
      "We collect as little as we can get away with, we tell you what we have, and we do not sell any of it. This policy explains the detail.",
    defined: [
      "data controller",
      "legitimate interest",
      "legal obligation",
      "GDPR",
      "Irish Data Protection Commission",
    ],
    sections: [
      { h: "Who we are", p: [
        "CLE Family Media 25 Limited, trading as CLÉ Family Media, is the data controller for this website. Our company number and registered office are set out at the head of this document. You can reach us through the contact page for any question about your data.",
      ]},
      { h: "What we collect", p: [
        "If you send us an enquiry, we collect your name, email address, any organisation you give us and the content of your message. If you ask to be told when the app launches, we collect your email address and nothing else.",
        "If you buy a printable, Stripe handles your payment and collects your email for its own receipt. We never see or store your card details. We store a record of the purchase, a download token so we can deliver the file you paid for, the email address you gave Stripe, and the time you confirmed you understood the download starts immediately.",
        "We keep that email address for one reason: your download link lives for 24 hours and there is no account here, so if you lose it, the address you paid with is the only way we can find your order and send it again. Nothing else reads it, and it is never used to contact you otherwise.",
        "The educator questionnaire for our cross-border case study is not open yet. When it opens it will collect your answers about using an episode with a group of children, the country route you chose, and an email address only if you give us one so we can send you the findings. It will not collect anything about an individual child, and it will not record your IP address. Full participant information will be published on that page before it opens, and nothing on it can be submitted until then.",
        "We do not ask anyone to create an account, and we do not knowingly collect personal data from children.",
      ]},
      { h: "Why we collect it", p: [
        "Enquiry details are used to reply to you. Launch notifications are used to send you one email at launch. Purchase records are used to deliver your file and to keep proper accounts. Case study answers are used to understand how the episodes and the offline activities work in real settings, and are reported only in aggregate.",
        "We do not use any of it for advertising, we do not build profiles, and buying something from us does not add you to a mailing list.",
      ]},
      { h: "Legal basis", p: [
        "We rely on legitimate interest to answer enquiries you send us, consent for launch notifications, contract for delivering a purchase, and legal obligation for keeping financial records. Taking part in the case study is entirely voluntary and we will rely on your consent, which you can withdraw.",
      ]},
      { h: "Who we share it with", p: [
        "Our hosting and database providers, our payment processor and our email delivery provider, each only to the extent needed to run the site. We do not sell or rent personal data to anyone, for any purpose.",
      ]},
      { h: "How long we keep it", p: [
        "Enquiries are kept while the conversation is live and for a reasonable period afterwards. Purchase records are kept as long as accounting rules require. Launch notification addresses are deleted once the launch email has been sent. How long case study answers are kept will be stated in the participant information before the study opens.",
      ]},
      { h: "Your rights", p: [
        "Under the GDPR you can ask us for a copy of your data, ask us to correct or delete it, object to how we use it, or ask us to restrict that use. Contact us and we will action it. If you are not satisfied you can complain to the Irish Data Protection Commission.",
      ]},
      { h: "Changes to this policy", p: [
        "If this policy changes we will update this page and change the date below. Material changes will be flagged clearly rather than slipped in.",
      ]},
    ],
  },
  terms: {
    title: "Terms",
    tab: "Terms",
    description: "The terms covering use of this site and the sale of digital goods.",
    intro:
      "Short version: use the site sensibly, what you buy is for your own family or classroom, and we will deal with you fairly if something goes wrong.",
    defined: ["Printables", "right of withdrawal", "statutory rights"],
    sections: [
      { h: "Using this site", p: [
        "You are welcome to read, link to and share anything on this site. You may not copy it wholesale and present it as your own, or use it to train a model without asking us first.",
      ]},
      { h: "Buying a digital product", p: [
        "Prices are shown in euro and include any applicable tax. Payment is handled by Stripe. You do not need an account. When your payment succeeds you get a download link valid for twenty four hours and up to five downloads, so please save the file somewhere safe.",
      ]},
      { h: "Licence and permitted use", p: [
        "Printables are licensed for personal, family, classroom or childcare setting use. You may print as many copies as that use needs. You may not resell them, redistribute the files, or include them in a paid product of your own.",
      ]},
      { h: "Refunds and withdrawal", p: [
        "Digital downloads are supplied immediately. Before you pay, the product page asks you to confirm you understand the download starts straight away and that you lose the right to cancel once it does, and checkout will not open until you have. That is what EU consumer rules require us to ask, and it is why the right of withdrawal does not apply afterwards.",
        "That said, if a file is faulty, wrong, or will not open, contact us and we will fix it or refund you.",
      ]},
      { h: "Intellectual property", p: [
        "The Pawsitive Pugs & Pals®, PupsPlayer™, the characters, artwork and all content on this site belong to CLÉ Family Media unless stated otherwise.",
      ]},
      { h: "Liability", p: [
        "We take care over this site and its products, but we provide them as they are. Nothing in these terms limits liability for death, personal injury or fraud, or affects your statutory rights as a consumer.",
      ]},
      { h: "Governing law", p: [
        "These terms are governed by the law of Ireland, and the Irish courts have jurisdiction over any dispute arising from them.",
      ]},
    ],
  },
  cookies: {
    title: "Cookie policy",
    tab: "Cookies",
    description: "What this site stores in your browser and why.",
    intro:
      "This site is deliberately light on tracking. There is no advertising network here and nothing following you around the internet afterwards.",
    defined: ["Strictly necessary storage", "cookieless", "consent banner"],
    sections: [
      { h: "What we use", p: [
        "Strictly necessary storage only, for things like keeping an administrator signed in and remembering a choice you made on a form. These are required for the site to work and cannot be switched off.",
      ]},
      { h: "Payments", p: [
        "When you buy something, Stripe sets its own cookies to process the payment and prevent fraud. Those are governed by Stripe's privacy policy.",
      ]},
      /* Present tense removed. This said "We measure how the site is used in
         aggregate", and nothing in this application measures anything: there
         is no analytics package, no script and no endpoint. A privacy notice
         that claims a collection which does not happen is as wrong as one that
         hides a collection that does, and it is the easier of the two to
         check. The commitment stays; only the claim to be doing it already
         goes. */
      { h: "Analytics", p: [
        "We do not measure how the site is used. There is no analytics on this site at all, so there is nothing to tell you about and nothing to consent to.",
        "If that changes, the tool will be a privacy first, cookieless one that collects no personal data, this page will change before it is switched on, and a consent banner will appear with it if one is needed.",
      ]},
      { h: "Managing cookies", p: [
        "You can clear or block cookies in your browser settings at any time. Blocking the strictly necessary ones may stop parts of the site working, but nothing on the public site depends on them.",
      ]},
    ],
  },
};

/* ----------------------------------------------------------------------------
   EDITABLE FROM THE ADMIN, 2026-10-27.

   Each document's wording is a set of blocks (src/lib/blocks.ts): the title,
   the intro, and a heading and a body per numbered section, the body being
   the section's paragraphs separated by a blank line. The defaults are
   DERIVED from DOCS above rather than typed again, so the object the Pages
   panel shows as "the original" cannot drift from the clauses as published.
   A solicitor's correction is one edit in the admin; the wording here stays
   the fallback the page renders when nothing has been saved.
---------------------------------------------------------------------------- */
function copyFor(d: Doc): Record<string, string> {
  const out: Record<string, string> = { title: d.title, intro: d.intro };
  d.sections.forEach((s, i) => {
    out[`section.${i + 1}.heading`] = s.h;
    out[`section.${i + 1}.body`] = s.p.join("\n\n");
  });
  return out;
}

export const LEGAL_COPY: Record<DocId, Record<string, string>> = {
  privacy: copyFor(DOCS.privacy),
  terms: copyFor(DOCS.terms),
  cookies: copyFor(DOCS.cookies),
};

/* The ISO date is read as UTC, so the formatted day cannot slip backwards for a
   reader west of Greenwich. */
function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const DFN =
  "font-semibold not-italic text-ink underline decoration-dotted decoration-muted/45 underline-offset-[5px]";

/**
 * Marks the first occurrence of each defined term, in document order.
 *
 * The clause text is never edited to carry a marker: the terms are listed
 * separately and matched here, so a solicitor's revision can be pasted straight
 * over a paragraph without carrying any of this file's markup with it.
 */
function markTerms(text: string, terms: string[], used: Set<string>): ReactNode {
  let best: { term: string; at: number } | null = null;
  for (const t of terms) {
    if (used.has(t)) continue;
    const at = text.indexOf(t);
    if (at >= 0 && (best === null || at < best.at)) best = { term: t, at };
  }
  if (!best) return text;
  used.add(best.term);
  return (
    <>
      {text.slice(0, best.at)}
      <dfn className={DFN}>{best.term}</dfn>
      {markTerms(text.slice(best.at + best.term.length), terms, used)}
    </>
  );
}

/* ----------------------------------------------------------------------------
   The index.

   Shared by the sticky rail on a desktop and the disclosure on a phone, so the
   two can never drift apart. `active` is the section the reader is in; it is
   only ever a mark, never a scroll or a transform.
---------------------------------------------------------------------------- */
function Contents({
  sections,
  active,
  onPick,
}: {
  active: string;
  sections: { h: string }[];
  onPick?: () => void;
}) {
  return (
    <ol>
      {sections.map((s, i) => {
        const id = `s${i + 1}`;
        const on = active === id;
        return (
          <li key={s.h} className={`border-l-2 pl-3 ${on ? "border-red" : "border-transparent"}`}>
            <a
              href={`#${id}`}
              onClick={onPick}
              aria-current={on ? "true" : undefined}
              className={`grid grid-cols-[1.35rem_minmax(0,1fr)] items-baseline gap-x-2 py-[0.3rem] text-[15px] leading-snug transition-colors ${
                on ? "font-semibold text-ink" : "text-body hover:text-ink"
              }`}
            >
              <span className={`tnum font-mono text-[13.5px] ${on ? "text-red-deep" : "text-muted"}`}>
                {i + 1}
              </span>
              <span>{s.h}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** The contents list on a phone, behind the shared `DisclosurePanel`. The
 *  closed panel holds real links, so being out of the tab order matters here. */
function MobileContents({ sections, active }: { sections: { h: string }[]; active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y-[1.5px] border-rule lg:hidden">
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="legal-contents"
          className="flex w-full items-center justify-between gap-4 py-3.5 text-left font-mono text-[14.5px] uppercase tracking-[0.14em] text-ink"
        >
          Contents
          <span className="flex items-center gap-3">
            <span className="tnum text-muted">{sections.length} sections</span>
            <span
              aria-hidden="true"
              className={`text-red-deep transition-transform duration-300 ease-out ${open ? "rotate-90" : ""}`}
            >
              <IconArrow size={15} />
            </span>
          </span>
        </button>
      </div>
      <DisclosurePanel id="legal-contents" open={open}>
        <div className="pb-4">
          <Contents sections={sections} active={active} />
        </div>
      </DisclosurePanel>
    </div>
  );
}

/* Keyed by document. The three routes render this same component at the same
   point in the tree, so without the key React would carry one instance from
   /privacy to /terms, and the two documents resolve a different number of
   blocks: a hook count that changed between renders. A fresh instance per
   document keeps the count constant for the life of each. */
export default function Legal({ doc }: { doc: DocId }) {
  return <Document key={doc} doc={doc} />;
}

function Document({ doc }: { doc: DocId }) {
  const d = DOCS[doc];
  const [active, setActive] = useState("");
  const body = useRef<HTMLDivElement>(null);

  /* The wording, resolved block by block: the published clause until a row
     saved in the admin replaces it. The section loop runs the same number
     of times on every render of this instance (see the key above). */
  const copy = LEGAL_COPY[doc];
  const title = useBlock(doc, "title", copy.title);
  const intro = useBlock(doc, "intro", copy.intro);
  const sections = d.sections.map((_, i) => {
    const n = i + 1;
    return {
      h: useBlock(doc, `section.${n}.heading`, copy[`section.${n}.heading`]),
      p: splitParagraphs(useBlock(doc, `section.${n}.body`, copy[`section.${n}.body`])),
    };
  });

  /* One Set per render, walked in document order, so a term is marked at its
     first appearance in the document and nowhere else. */
  const used = new Set<string>();
  const marked = sections.map((s) => s.p.map((p) => markTerms(p, d.defined, used)));

  /* Which section the reader is in. A mark in the index, nothing more: no
     scrolling is driven from here and nothing moves, so there is nothing for
     reduced motion to switch off.

     Read on scroll, not through an IntersectionObserver. The observer version
     of this was wrong twice: a band one fifth of the viewport tall contains no
     section for most of a long document, so the callback simply never fires
     while the reader moves through a section, and after a jump to the top it
     fires with everything leaving and nothing entering, which left the mark
     stuck on the last section the reader had reached. Eight getBoundingClientRect
     calls once per animation frame is cheaper than being wrong. */
  useEffect(() => {
    const host = body.current;
    if (!host) return;
    const secs = Array.from(host.querySelectorAll<HTMLElement>("section[id]"));
    if (!secs.length) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.28;
      let current = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= line) current = s;
      setActive(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [doc]);

  const updated = longDate(DRAFTED);

  return (
    <>
      <Seo title={title} description={d.description} path={`/${doc}`} />

      {/* ═══ 1. THE HEAD, in the hero's frame.
          The plain panel on the deeper paper: the document has no picture to
          stand on, and a policy should open quietly. The corners carry what
          the old facts list carried, word for word: who published it and its
          status top left, when and under which law top right. The h1 is the
          document's name, which is the one heading on the site allowed to be
          a label: a reader checking a company wants "Terms", not a sentence
          about terms. No actions: the document is the action. ═══ */}
      <PageHero
        id="legal-h"
        size="short"
        tone="wall"
        eyebrow={
          <>
            CL&Eacute; Family Media<span>Draft</span>
          </>
        }
        aside={
          /* Inline pairs, not a two-column grid: the aside is right aligned
             in the frame and left aligned once the panel collapses on a
             phone, and inline text follows that without knowing about it. */
          <dl>
            <div>
              <dt className="inline">Last updated</dt>{" "}
              <dd className="tnum inline whitespace-nowrap">{updated}</dd>
            </div>
            <div>
              <dt className="inline">Jurisdiction:</dt> <dd className="inline">Ireland</dd>
            </div>
          </dl>
        }
        title={title}
      />

      {/* ═══ 2. THE DOCUMENT.
          A sheet of card with three tabs. The sheet sits in the default
          container, not the wide one: the index and a 68ch measure are all
          that belongs on it, and padding either side of a document is how a
          document is meant to look. ═══ */}
      <Section pad={["tight", "normal"]}>
        <Container width="wide">
          {/* 70rem, not the 5xl container and not the wide one. A 64rem sheet
              under a 97rem header read as a column dropped into the middle of
              a monitor; at the full width the document would have a 400px
              right margin of nothing. This is the width at which the index,
              the measure and the margin are all the size they should be.

              Flush left, not centred: centred, its left edge landed 130px
              inside the title above it and the two read as unrelated objects.
              Aligned, the sheet is the document the page is about and the air
              is on the right, which is where a document keeps its margin. */}
          <div className="relative max-w-[70rem] pt-10 sm:pt-12">
            <nav aria-label="Legal documents" className="flex gap-1 pl-5 sm:pl-7">
              {ORDER.map((id) => {
                const on = id === doc;
                return (
                  <Link
                    key={id}
                    to={`/${id}`}
                    aria-current={on ? "page" : undefined}
                    /* A 2px edge on three sides, the house's control edge; the
                       raised tab's edge is the sheet's own colour so it reads
                       as part of the card rather than as a box on it. 44px
                       tall, so each is a thumb's target on a phone. */
                    className={`flex min-h-[44px] items-center rounded-t-[7px] border-2 border-b-0 px-4 font-mono text-[14.5px] uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-colors ${
                      on
                        ? "border-raised bg-raised pb-0.5 text-ink"
                        : "mt-1 border-sunken bg-sunken text-body hover:text-ink"
                    }`}
                  >
                    {DOCS[id].tab}
                  </Link>
                );
              })}
            </nav>

            <div className="card-stock px-5 py-9 sm:px-8 sm:py-11 lg:px-14 lg:py-16">
              <div className="grid gap-9 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20">
                {/* The index. Sticky beside the document on a desktop, a
                    disclosure above it on a phone, where a sticky rail would
                    eat the screen the document needs. */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="hidden font-mono text-[14px] uppercase tracking-[0.14em] text-muted lg:block">
                    Contents
                  </p>
                  <div className="mt-4 hidden lg:block">
                    <Contents sections={sections} active={active} />
                  </div>

                  <MobileContents sections={sections} active={active} />
                </div>

                <div ref={body} className="max-w-[68ch]">
                  {/* The document's own summary, the line that used to be the
                      lead under the title. It is the first line of the sheet
                      because it is the sheet's own first line: the short
                      version of the clauses under it, in ink at the reading
                      lead so it reads as the document's voice rather than as
                      a caption on it. Verbatim. */}
                  <p className="t-lead mb-9 max-w-[56ch] text-ink sm:mb-11">{intro}</p>

                  {/* Who the trader is, in the slot where the draft stamp
                      stood until 2026-10-13. Same stamp, not a box: the
                      house's own anti-pattern is the card with a coloured left
                      edge, and this is a fact about the document rather than a
                      warning about it. */}
                  <div className="border-y-[1.5px] border-rule py-5">
                    <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
                      Who you are dealing with
                    </p>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-ink">
                      {COMPANY.legal}, registered in Ireland, company number {COMPANY.cro}.
                      Registered office: {COMPANY.office}. Trading as CL&Eacute; Family Media.
                    </p>
                  </div>

                  {sections.map((s, i) => (
                    <section
                      key={i}
                      id={`s${i + 1}`}
                      className="scroll-mt-28 pt-9 sm:pt-11"
                      aria-labelledby={`s${i + 1}-h`}
                    >
                      {/* An h2 inside a document, set at the scale's sub-head
                          (`.t-h3`, 30px at 1440) rather than the literal 18px
                          it used to be, so the clause heads sit on the same
                          scale as every other heading on the site. The
                          number beside it stays mono at 14px: it is a mark in
                          the margin, not a heading. */}
                      <div className="grid gap-x-5 sm:grid-cols-[2rem_minmax(0,1fr)]">
                        <p aria-hidden="true" className="tnum hidden font-mono text-[14px] leading-[2.4] text-muted sm:block">
                          {i + 1}
                        </p>
                        <div>
                          <h2 id={`s${i + 1}-h`} className="t-h3 font-sans font-bold tracking-[-0.01em]">
                            <span aria-hidden="true" className="tnum mr-2 font-mono text-[14px] font-normal tracking-normal text-muted sm:hidden">
                              {i + 1}
                            </span>
                            {s.h}
                          </h2>
                          <div className="mt-4 space-y-4 text-[16px] leading-[1.72] text-body">
                            {marked[i].map((para, j) => (
                              <p key={j}>{para}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}

                  <p className="mt-12 border-t-[1.5px] border-rule pt-5 font-mono text-[14.5px] text-muted">
                    {title}. Last updated {updated}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ 3. THE SHELF, full width again.
          The three documents are one set and a reader checking a company
          usually wants more than the one they landed on. Hairline rows, the
          one in hand marked rather than linked. "The documents" stays as the
          heading: a shelf of the three legal documents is literally that, and
          this page's exemption from the claim-as-heading rule covers it. ═══ */}
      <Section pad={["none", "normal"]} labelledBy="shelf-h">
        <Container width="wide">
          <div className="hairline pt-12 sm:pt-14">
            <h2 id="shelf-h" className="t-h2 max-w-[20ch]">The documents</h2>

            <Settle as="ul" className="mt-8">
              {ORDER.map((id) => {
                const o = DOCS[id];
                const here = id === doc;
                const inner = (
                  <>
                    {/* The marker rides with the title on a phone, where the
                        third column has collapsed under it. */}
                    <span className="flex items-start justify-between gap-5">
                      <span className="text-[17px] font-semibold text-ink">{o.title}</span>
                      {!here && (
                        <span className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-red-deep sm:hidden">
                          <IconArrow size={15} />
                        </span>
                      )}
                    </span>
                    <span className="t-body max-w-[52ch] text-body">{o.description}</span>
                    <span className="hidden items-center gap-2 font-mono text-[14.5px] text-muted sm:flex sm:justify-end">
                      {here ? (
                        "You are reading this"
                      ) : (
                        <span className="transition-colors group-hover:text-red-deep">
                          <IconArrow size={15} />
                        </span>
                      )}
                    </span>
                    {here && (
                      <span className="font-mono text-[14.5px] text-muted sm:hidden">
                        You are reading this
                      </span>
                    )}
                  </>
                );
                const cls =
                  "grid items-start gap-x-10 gap-y-2 py-6 sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1.1fr)_minmax(0,0.3fr)] sm:py-7";
                return (
                  <li key={id} className="hairline last:border-b-[1.5px] last:border-rule">
                    {here ? (
                      <div className={cls}>{inner}</div>
                    ) : (
                      <Link to={`/${id}`} className={`${cls} group`}>{inner}</Link>
                    )}
                  </li>
                );
              })}
            </Settle>

            <p className="mt-9 max-w-[58ch] text-[15px] leading-relaxed text-body">
              Anything in these documents you want put differently, or a question about what we
              hold:{" "}
              <TextLink to="/contact">write to us</TextLink>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
