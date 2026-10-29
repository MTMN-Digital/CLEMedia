import { type ReactNode, useRef } from "react";
import { Seo } from "@/components/Seo";
import { Container, Section } from "@/components/ui";
import { splitParagraphs, useBlock } from "@/lib/content";
import {
  DocStatus,
  DocFoot,
  DocPublisher,
  longDate,
  DocSheet,
  REVISED_LABEL,
  DocContents,
  DocumentsShelf,
  useActiveSection,
  DocClause,
} from "@/components/doc";
import "@/components/legal/legal.css";

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
   signature, and it is the folder these three things actually live in. The
   shell itself (tabs, sheet, rail, clause, foot, shelf) is the document kit in
   components/doc, shared with the Responsible AI position so the four
   documents on the site cannot drift apart.

   THE OPENING, 2026-10-28. The page IS the folder. The only thing above the
   tabs is the header; the document's own title block is printed on the sheet,
   in the document's own two-column grid, so the cover and the clauses share
   one set of column lines. The left column carries the publisher and two
   status rows (the wording's revision date and the governing law, both true
   in this file); the right column carries the name, the intro and who the
   trader is. No panel, no scrim, no status word: these are published terms
   (David, 2026-10-13) and the draft notice came out then. No version number
   either: the company has not numbered its documents and the site must not
   number them for it.

   THE COMPANY DETAILS, CLOSED 2026-10-13. The registered name, number and
   office now head every one of the three documents, taken from the signed
   proposal CFM-02. See `COMPANY` below.

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

/* Keyed by document. The three routes render this same component at the same
   point in the tree, so without the key React would carry one instance from
   /privacy to /terms, and the two documents resolve a different number of
   blocks: a hook count that changed between renders. A fresh instance per
   document keeps the count constant for the life of each, and the remount is
   also what replays the sheet's settle when a tab is switched. */
export default function Legal({ doc }: { doc: DocId }) {
  return <Document key={doc} doc={doc} />;
}

function Document({ doc }: { doc: DocId }) {
  const d = DOCS[doc];
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

  /* Which section the reader is in: a mark in the index, nothing more. */
  const active = useActiveSection(body, doc);

  const revised = longDate(DRAFTED);
  const contents = sections.map((s, i) => ({ id: `s${i + 1}`, n: String(i + 1), label: s.h }));

  return (
    <>
      <Seo title={title} description={d.description} path={`/${doc}`} />

      {/* ═══ 1. THE DOCUMENT.
          Header, 40px of paper, then the tabs and the sheet, flush with the
          left gutter of the 1560 shell. 70rem, not the 5xl container and not
          the wide one: this is the width at which the index, the measure and
          the margin are all the size they should be. Flush left, because the
          sheet is the document the page is about and the air is on the
          right, which is where a document keeps its margin. ═══ */}
      <Section pad={["none", "normal"]}>
        <Container width="wide">
          <div className="legal-sheet pt-6 sm:pt-10">
            <DocSheet
              navLabel="Legal documents"
              width="legal"
              tabs={ORDER.map((id) => ({ label: DOCS[id].tab, to: `/${id}`, current: id === doc }))}
            >
              {/* ─── The title block: the cover of the document, on the
                  document's own column lines.

                  At `lg` the left column is the publisher and the two status
                  rows and the right column is the name, the intro and the
                  trader; the two wrappers are real blocks. On a phone the
                  wrappers dissolve (`contents`) and the five pieces take the
                  cover's reading order instead: publisher, name, intro,
                  status rows, trader. One DOM, two orders. ─── */}
              <div className="legal-title flex flex-col lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20">
                <div className="contents lg:block">
                  <div className="order-1">
                    <DocPublisher>CL&Eacute; Family Media</DocPublisher>
                  </div>
                  {/* Plain ruled rows, no leader: the leader is the journal's.
                      Both facts are true in this file: the date is DRAFTED,
                      the law is the clause at "Governing law". */}
                  <DocStatus
                    className="order-4 mt-7 lg:mt-5"
                    rows={[
                      { label: REVISED_LABEL, value: revised },
                      { label: "Governing law", value: "Ireland" },
                    ]}
                  />
                </div>

                <div className="contents lg:block">
                  {/* The document's name, which is the one heading on the site
                      allowed to be a label: a reader checking a company wants
                      "Terms", not a sentence about terms. */}
                  <h1 className="t-h1 order-2 mt-4 max-w-[14ch] lg:mt-0">{title}</h1>
                  <p className="t-lead order-3 mt-6 max-w-[56ch] text-ink">{intro}</p>

                  {/* Who the trader is, between its two rules, ruled the same
                      1.5px as the status rows so the cover is one weight of
                      line end to end. The rules are `lg` only: stacked on a
                      phone, the status rows above and the contents below
                      already rule it, and its own pair printed every line
                      twice. */}
                  <div className="order-5 border-rule pt-6 lg:mt-9 lg:border-y-[1.5px] lg:py-5">
                    <p className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
                      Who you are dealing with
                    </p>
                    <p className="t-body mt-2.5 max-w-[60ch] text-ink">
                      {COMPANY.legal}, registered in Ireland, company number {COMPANY.cro}. Registered
                      office: {COMPANY.office}. Trading as CL&Eacute; Family Media.
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── The rail and the clauses, under one rule across the full
                  inner width of the sheet. The first clause's own top padding
                  is pulled back so its heading sits level with the rail's
                  "Contents" label at `lg`; on a phone the same pull cancels
                  the grid gap under the contents disclosure, leaving the
                  clause's own padding as the space between the two. ─── */}
              <div className="mt-8 border-rule sm:mt-12 lg:border-t-[1.5px] lg:pt-12">
                <div className="grid gap-9 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20">
                  <DocContents
                    items={contents}
                    active={active}
                    summary={`${sections.length} sections`}
                    id="legal-contents"
                  />

                  <div ref={body} className="-mt-9 max-w-[68ch] sm:-mt-11">
                    {sections.map((s, i) => (
                      <DocClause key={i} id={`s${i + 1}`} n={String(i + 1)} title={s.h}>
                        {marked[i].map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </DocClause>
                    ))}

                    <DocFoot title={title} revised={revised} />
                  </div>
                </div>
              </div>
            </DocSheet>
          </div>
        </Container>
      </Section>

      {/* ═══ 2. THE SHELF.
          The four documents on the site, the Responsible AI position first,
          the one in hand marked rather than linked. Its closing sentence and
          the footer are the page's ending; there is no band. ═══ */}
      <DocumentsShelf current={doc} />
    </>
  );
}
