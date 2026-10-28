import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The CMS block registry. FROZEN for the 2026-10-27-admin shards.

   Every editable slot on every public page: which page, which key, what to
   call it for an editor who is not technical, and what kind of value it
   holds. The Pages panel builds its editor from this list, and the page
   components read the same keys through useBlock / useImageBlock.

   DEFAULTS ARE NOT STORED HERE. The page source is the default (see
   src/lib/content.ts). Each page keeps its editable copy in ONE exported
   object, `COPY` (keyed by block key, holding the current text character for
   character), and reads it as
     useBlock("story", "hero.aside", COPY["hero.aside"])
   so an empty content_blocks table renders the page exactly as it is today.
   `loadDefaults(page)` below imports that object lazily, which is how the
   Pages panel shows the original wording beside the live value without a
   second copy of any sentence.

   `source` tells the wiring shard where the default lives. `emphasis` marks a
   headline whose accent clause is written between *stars* (see emphasis() in
   content.ts); the default must carry the stars around the same words the
   page wraps in <em> or <Underline>.
   ========================================================================== */

export type PageId =
  | "media"
  | "app"
  | "story"
  | "privacy"
  | "terms"
  | "journal"
  | "shop"
  | "404"
  | "contact"
  | "case-study"
  | "ethical-ai"
  | "home"
  | "team"
  | "cookies";

/** line: one line of plain text. paragraph: several lines; for `multi`
 *  blocks, paragraphs are separated by a blank line. image: { url, alt }. */
export type BlockKind = "image" | "paragraph" | "line";

/** Which shard wires a page's blocks into the page component. */
export type WiredBy = "media-app-links" | "cms-wiring" | "shop";

export interface BlockDef {
  page: PageId;
  key: string;
  /** What the editor sees. Plain words: where it is on the page and what it is. */
  label: string;
  kind: BlockKind;
  /** Can never be saved empty. Every text block is required; images are not. */
  required: boolean;
  /** Group heading in the editor, in page order. */
  section: string;
  /** The accent clause is written between *stars*. */
  emphasis?: boolean;
  /** Several paragraphs, separated by a blank line (splitParagraphs()). */
  multi?: boolean;
  /** Image blocks: the bundled asset that shows until an upload replaces it. */
  asset?: AssetKey;
  /** Where the default lives, for the wiring shard. Not shown to editors. */
  source: string;
}

export interface PageDef {
  id: PageId;
  label: string;
  /** The public route, for "View the page". */
  path: string;
  wiredBy: WiredBy;
}

export const PAGES: PageDef[] = [
  { id: "home", label: "Home", path: "/", wiredBy: "cms-wiring" },
  { id: "story", label: "Our story", path: "/story", wiredBy: "cms-wiring" },
  { id: "team", label: "Our team", path: "/team", wiredBy: "cms-wiring" },
  { id: "ethical-ai", label: "Responsible AI", path: "/ethical-ai", wiredBy: "cms-wiring" },
  { id: "case-study", label: "Case study", path: "/case-study", wiredBy: "cms-wiring" },
  { id: "journal", label: "Journal (front page)", path: "/journal", wiredBy: "cms-wiring" },
  { id: "app", label: "App", path: "/app", wiredBy: "media-app-links" },
  { id: "media", label: "Press kit", path: "/media", wiredBy: "media-app-links" },
  { id: "shop", label: "Shop", path: "/shop", wiredBy: "shop" },
  { id: "contact", label: "Get in touch", path: "/contact", wiredBy: "cms-wiring" },
  { id: "privacy", label: "Privacy policy", path: "/privacy", wiredBy: "cms-wiring" },
  { id: "terms", label: "Terms", path: "/terms", wiredBy: "cms-wiring" },
  { id: "cookies", label: "Cookie policy", path: "/cookies", wiredBy: "cms-wiring" },
  { id: "404", label: "Page not found", path: "/this-page-does-not-exist", wiredBy: "cms-wiring" },
];

/* ─── Builders, to keep the table below readable ─────────────────────────── */

const line = (page: PageId, section: string, key: string, label: string, source: string, extra: Partial<BlockDef> = {}): BlockDef => ({
  page, key, label, kind: "line", required: true, section, source, ...extra,
});
const para = (page: PageId, section: string, key: string, label: string, source: string, extra: Partial<BlockDef> = {}): BlockDef => ({
  page, key, label, kind: "paragraph", required: true, section, source, ...extra,
});
const image = (page: PageId, section: string, key: string, label: string, asset: AssetKey, source: string): BlockDef => ({
  page, key, label, kind: "image", required: false, section, asset, source,
});

/* ─── The registry ───────────────────────────────────────────────────────── */

const HOME = "src/pages/Home.tsx";
const STORY = "src/pages/Story.tsx";
const TEAM = "src/pages/Team.tsx";
const EAI = "src/pages/EthicalAi.tsx";
const CS = "src/pages/CaseStudy.tsx";
const JOURNAL = "src/pages/Journal.tsx";
const CONTACT = "src/pages/Contact.tsx";
const NF = "src/pages/NotFound.tsx";
const APP = "src/pages/AppPage.tsx";
const MEDIA = "src/pages/Media.tsx";
const SHOP = "src/pages/Shop.tsx";
const LEGAL = "src/pages/Legal.tsx";

const legal = (page: "cookies" | "privacy" | "terms", sections: string[]): BlockDef[] => [
  line(page, "Top of the page", "title", "Document name (printed on the sheet and in the browser tab)", `${LEGAL}: DOCS.${page}.title`),
  para(page, "Top of the page", "intro", "Opening summary under the document name", `${LEGAL}: DOCS.${page}.intro`),
  ...sections.flatMap((h, i) => [
    line(page, `Section ${i + 1}: ${h}`, `section.${i + 1}.heading`, "Section heading", `${LEGAL}: DOCS.${page}.sections[${i}].h`),
    para(page, `Section ${i + 1}: ${h}`, `section.${i + 1}.body`, "Section text", `${LEGAL}: DOCS.${page}.sections[${i}].p joined with "\\n\\n"`, { multi: true }),
  ]),
];

export const BLOCKS: BlockDef[] = [
  /* Home. The "Watch. Play. Learn." headline animates word by word and is
     the brand line, so it is not editable. */
  line("home", "Top of the page", "hero.cta_primary", "First button", "src/components/home/HeroFilm.tsx: first <Button> label"),
  line("home", "Top of the page", "hero.cta_secondary", "Second button", "src/components/home/HeroFilm.tsx: second <Button> label"),
  line("home", "What we believe", "thesis.heading", "Large headline", `${HOME}: h2#thesis-h`),
  line("home", "What we believe", "thesis.pull", "Red line under the headline", `${HOME}: p after h2#thesis-h; the <Underline accent> words between *stars*`, { emphasis: true }),
  para("home", "What we believe", "thesis.lead_1", "First paragraph", `${HOME}: first p.t-lead after the thesis`),
  para("home", "What we believe", "thesis.lead_2", "Second paragraph", `${HOME}: second p.t-lead after the thesis`),
  line("home", "How an episode works", "model.heading", "Headline", `${HOME}: h2#model-h`),
  line("home", "The research", "evidence.heading", "Headline", "src/components/home/Evidence.tsx: h2"),
  line("home", "The series", "series.heading", "Headline", `${HOME}: h2#series-h`),
  para("home", "The series", "series.lead", "Paragraph", `${HOME}: <Lead> after h2#series-h`),
  line("home", "How we use AI", "ai.heading", "Large headline", `${HOME}: h2#ai-h; the <Underline v={2}> words between *stars*`, { emphasis: true }),
  para("home", "How we use AI", "ai.pull", "Large quote", `${HOME}: font-display p beside the drawn bracket`),
  line("home", "How we use AI", "ai.cta", "Button", `${HOME}: <Button to="/ethical-ai"> label`),
  line("home", "Updates sign-up", "updates.heading", "Headline", `${HOME}: h2#updates-h`),
  para("home", "Updates sign-up", "updates.body", "Paragraph", `${HOME}: p after h2#updates-h`),

  /* Our story: a letter from Conor, signed. */
  para("story", "Top of the letter", "hero.eyebrow_sub", "Name, title and place under the portrait (one per line)", `${STORY}: dateline beside the portrait`),
  line("story", "Top of the letter", "hero.title", "Main headline (first sentence of the letter)", `${STORY}: h1`),
  image("story", "Top of the letter", "hero.image", "Conor's portrait", "person.conor", `${STORY}: letter portrait`),
  para("story", "Top of the letter", "letter.open", "Rest of the opening paragraph", `${STORY}: first paragraph after the h1`),
  para("story", "How it started", "letter.saw", "How it started (paragraphs 2 to 4)", `${STORY}: letter paragraphs 2 to 4`, { multi: true }),
  line("story", "How it started", "garden.caption", "Caption under the garden picture", `${STORY}: garden figcaption`, { required: false }),
  para("story", "Conor's background", "letter.here", "Conor's background (paragraphs 5 to 8)", `${STORY}: letter paragraphs 5 to 8`, { multi: true }),
  para("story", "The people who build it", "letter.people", "The people who build it", `${STORY}: letter paragraph on the team`),
  para("story", "The people who build it", "letter.build", "The series and the studio (the first paragraph shows before the Finn and Fia picture)", `${STORY}: letter paragraphs on the series`, { multi: true }),
  line("story", "The people who build it", "build.link", "Link to how an episode is made", `${STORY}: TextLink to /ethical-ai`),
  line("story", "The people who build it", "characters.caption", "Caption under Finn and Fia", `${STORY}: characters figcaption`, { required: false }),
  para("story", "Where families find us", "letter.reach", "Where families find us", `${STORY}: letter paragraphs on reach`, { multi: true }),
  line("story", "Where families find us", "reach.show_link", "Link to the show's site", `${STORY}: TextLink to SITE.showUrl`),
  line("story", "Where families find us", "reach.app_link", "Link to PupsPlayer", `${STORY}: TextLink to /app`),
  para("story", "Sign-off", "next.lead", "Invitation to get in touch", `${STORY}: last paragraph of the letter`),
  line("story", "Sign-off", "next.link", "Contact link", `${STORY}: TextLink to /contact`),
  line("story", "Sign-off", "sign.name", "Signature name", `${STORY}: signature`),
  line("story", "Sign-off", "sign.role", "Role under the signature", `${STORY}: signature role`),
  line("story", "The mission film", "film.ps", "P.S. line above the film", `${STORY}: P.S. before MissionVideo`),
  para("story", "The mission film", "film.note", "Note under the film about sound and captions", `${STORY}: note under MissionVideo`, { required: false }),
  line("story", "Closing", "close.line", "Closing sentence", `${STORY}: ClosingLine`),
  line("story", "Closing", "close.link", "Closing link to the team page", `${STORY}: ClosingLine link`),

  /* Our team: faces, then the register. */
  line("team", "Top of the page", "hero.title", "Page title", `${TEAM}: h1`),
  line("team", "The people", "register.heading", "Heading over the biographies", `${TEAM}: register h2`),
  para("team", "The people", "register.key", "Sentence after the five phase names, before the Responsible AI link", `${TEAM}: register key line`, { required: false }),
  line("team", "Adviser", "adviser.heading", "Heading over the adviser", `${TEAM}: adviser h2`),
  para("team", "Adviser", "adviser.lead", "Note under the adviser heading", `${TEAM}: adviser sentence`),
  para("team", "Closing", "close.lead", "Closing sentence at the foot of the page", `${TEAM}: ClosingLine`),
  line("team", "Closing", "close.link", "Text of the closing link to the Responsible AI page", `${TEAM}: ClosingLine link`),

  /* Responsible AI: the position statement. */
  line("ethical-ai", "Title block", "title", "Document name (the big heading)", `${EAI}: h1`),
  line("ethical-ai", "Title block", "hero.title", "One-sentence summary under the heading", `${EAI}: p.t-lead under the h1`),
  line("ethical-ai", "Title block", "applies.value", "Applies to (status row)", `${EAI}: DocStatus "Applies to"`),
  line("ethical-ai", "Title block", "hero.aside", "Tools named (status row)", `${EAI}: DocStatus "Tools named"`),
  line("ethical-ai", "Figure 1", "line.heading", "Figure 1 caption, first sentence", `${EAI}: Figure 1 caption`),
  line("ethical-ai", "Figure 1", "figure.caption", "Figure 1 caption, second sentence", `${EAI}: Figure 1 caption`, { required: false }),
  line("ethical-ai", "1 Position", "clause.1.heading", "Clause 1 heading", `${EAI}: DocClause s1`),
  para("ethical-ai", "1 Position", "line.lead", "Clause 1, first paragraph (the position)", `${EAI}: clause 1`),
  para("ethical-ai", "1 Position", "position.second", "Clause 1, second paragraph (handmade and AI-generated)", `${EAI}: clause 1`),
  para("ethical-ai", "1 Position", "position.third", "Clause 1, third paragraph (what this document covers)", `${EAI}: clause 1`, { required: false }),
  line("ethical-ai", "2 How an episode is made", "clause.2.heading", "Clause 2 heading", `${EAI}: DocClause s2`),
  para("ethical-ai", "2 How an episode is made", "made.lead", "Clause 2 opening sentence", `${EAI}: clause 2`),
  para("ethical-ai", "2 How an episode is made", "return.body", "Sub-clause 2.6, The return", `${EAI}: DocSubClause 2.6`),
  line("ethical-ai", "2 How an episode is made", "reviews.line", "Sentence before the team link (end of clause 2)", `${EAI}: clause 2 team line`, { required: false }),
  line("ethical-ai", "3 The tools", "clause.3.heading", "Clause 3 heading", `${EAI}: DocClause s3`),
  para("ethical-ai", "3 The tools", "tools.note", "Paragraph under the tools table", `${EAI}: clause 3`),
  line("ethical-ai", "4 What a tool is never used for", "clause.4.heading", "Clause 4 heading", `${EAI}: DocClause s4`),
  line("ethical-ai", "5 Six commitments", "clause.5.heading", "Clause 5 heading", `${EAI}: DocClause s5`),
  line("ethical-ai", "6 Review of this position", "clause.6.heading", "Clause 6 heading", `${EAI}: DocClause s6`),
  line("ethical-ai", "6 Review of this position", "commit.heading", "Clause 6 opening sentence", `${EAI}: clause 6`),
  para("ethical-ai", "6 Review of this position", "commit.lead", "Clause 6 first paragraph (what we keep reviewing)", `${EAI}: clause 6`),
  para("ethical-ai", "6 Review of this position", "review.body", "Clause 6 second paragraph (if something does not satisfy you)", `${EAI}: clause 6`),
  line("ethical-ai", "6 Review of this position", "review.link", "Closing link text (goes to the contact page)", `${EAI}: clause 6 TextLink`),
  line("ethical-ai", "Appendix A", "appendix.heading", "Appendix heading", `${EAI}: DocClause appendix-a`),

  /* Case study: the protocol sheet. The status rows follow STUDY_OPEN and are not editable. */
  line("case-study", "Opening", "hero.title", "Page title", `${CS}: h1`),
  para("case-study", "Opening", "hero.lead", "Opening paragraph under the title", `${CS}: p.t-lead`),
  para("case-study", "Opening", "status.foot", "Note under the status rows", `${CS}: note under FactRows`),
  line("case-study", "The route", "route.label", "Label for the route row", `${CS}: SheetRow label`),
  para("case-study", "The route", "route.heading", "Paragraph explaining the two routes (Aistear and EYFS)", `${CS}: route row`),
  line("case-study", "Who it is for", "who.label", "Label for the 'who it is for' row", `${CS}: SheetRow label`),
  line("case-study", "Who it is for", "ask.heading", "Who the study is for, in one line", `${CS}: who row`),
  para("case-study", "Who it is for", "ask.body", "Note on age range, settings and time needed", `${CS}: who row`),
  line("case-study", "The four steps", "steps.label", "Label for the steps row", `${CS}: SheetRow label`),
  line("case-study", "The four steps", "step.1.title", "Step 1 title", `${CS}: steps row`),
  line("case-study", "The four steps", "step.2.title", "Step 2 title", `${CS}: steps row`),
  line("case-study", "The four steps", "step.3.title", "Step 3 title", `${CS}: steps row`),
  line("case-study", "The four steps", "step.4.title", "Step 4 title", `${CS}: steps row`),
  para("case-study", "The four steps", "steps.watch", "Note on watching the episode first", `${CS}: steps row`, { required: false }),
  line("case-study", "To be published", "pub.label", "Label for the 'to be published' row", `${CS}: SheetRow label`),
  line("case-study", "To be published", "pub.study", "Heading over what is published for the study", `${CS}: publication row`),
  line("case-study", "To be published", "out.heading", "Heading over what is kept apart from the study", `${CS}: publication row`),
  line("case-study", "The questionnaire", "q.label", "Label for the questionnaire row", `${CS}: SheetRow label`),
  para("case-study", "The questionnaire", "q.body", "What the questionnaire asks, and when to fill it in", `${CS}: questionnaire row`),
  line("case-study", "Your answers", "data.heading", "Heading for the section on how answers are handled", `${CS}: data h2`),
  para("case-study", "Your answers", "data.lead", "Note that the study opens only after the participant information is published", `${CS}: data paragraph`),
  line("case-study", "Closing", "close.line", "Closing sentence at the foot of the page", `${CS}: ClosingLine`),
  line("case-study", "Closing", "close.link", "Text of the closing link (goes to Responsible AI)", `${CS}: ClosingLine link`),

  /* Journal front page: a contents page. Post counts are not editable. */
  line("journal", "Masthead", "hero.title", "Page title, the journal's name", `${JOURNAL}: h1`),
  line("journal", "Masthead", "hero.eyebrow", "Small capitals line under the title (who publishes it)", `${JOURNAL}: mono line under the h1`),
  line("journal", "Masthead", "status.cadence", "Status row: how often pieces will come", `${JOURNAL}: Cadence status row`),
  para("journal", "Masthead", "intro.lead", "Opening paragraph beside the title", `${JOURNAL}: p.t-lead`),
  line("journal", "Masthead", "intro.line", "Line that introduces the list of strands", `${JOURNAL}: line above the contents`),
  line("journal", "How this journal is run", "rules.title", "Heading at the foot: How this journal is run", `${JOURNAL}: h2#rules-h`),
  para("journal", "How this journal is run", "rules.why", "Why the journal exists", `${JOURNAL}: colophon paragraph`),
  para("journal", "How this journal is run", "rules.heading", "Paragraph introducing the four rules", `${JOURNAL}: colophon paragraph`),
  line("journal", "How this journal is run", "rules.1.title", "Rule 1 name", `${JOURNAL}: rules dl`),
  para("journal", "How this journal is run", "rules.1.line", "Rule 1 wording", `${JOURNAL}: rules dl`),
  line("journal", "How this journal is run", "rules.1.link", "Rule 1 link text (goes to Responsible AI)", `${JOURNAL}: rules dl`),
  line("journal", "How this journal is run", "rules.2.title", "Rule 2 name", `${JOURNAL}: rules dl`),
  para("journal", "How this journal is run", "rules.2.line", "Rule 2 wording", `${JOURNAL}: rules dl`),
  line("journal", "How this journal is run", "rules.3.title", "Rule 3 name", `${JOURNAL}: rules dl`),
  para("journal", "How this journal is run", "rules.3.line", "Rule 3 wording", `${JOURNAL}: rules dl`),
  line("journal", "How this journal is run", "rules.4.title", "Rule 4 name", `${JOURNAL}: rules dl`),
  para("journal", "How this journal is run", "rules.4.line", "Rule 4 wording", `${JOURNAL}: rules dl`),
  line("journal", "How this journal is run", "rules.4.link", "Rule 4 link text (goes to Get in touch)", `${JOURNAL}: rules dl`),

  /* App: the product sheet. */
  line("app", "Top of the page", "device.name", "Product name, the big headline (the ™ is added automatically)", `${APP}: h1`),
  para("app", "Top of the page", "device.lead", "One-sentence description under the name (the show title is set in italics automatically)", `${APP}: p.t-lead`),
  { page: "app", key: "device.capture", label: "Real screenshot of the app, shown inside the drawn tablet (replaces the drawing and removes the 'Drawn from the plan' note)", kind: "image", required: false, section: "Top of the page", source: `${APP}: PupsPlayerWalkthrough capture` },
  line("app", "Status", "status.holds", "Status table: what the app holds", `${APP}: FactRows HOLDS`),
  line("app", "Status", "status.for", "Status table: who it is for", `${APP}: FactRows FOR`),
  line("app", "What is in it", "contents.heading", "Heading of the 'What is in it' section", `${APP}: h2`),
  line("app", "What is in it", "watch.footnote", "Small line under the six episode tiles", `${APP}: Watch row`),
  line("app", "What is in it", "play.subhead", "Small label above the list of planned games", `${APP}: Play row`),
  line("app", "What is in it", "learn.away_caption", "Caption beside the 'activities away from the screen' page", `${APP}: Learn row`),
  para("app", "What is in it", "learn.note", "Note under the sample pages about where the books are sold or included", `${APP}: Learn row`),
  line("app", "What it will not do", "walls.heading", "Heading of the 'What it will not do' section", `${APP}: h2`),
  line("app", "What it will not do", "walls.lead", "Sentence under the 'What it will not do' heading", `${APP}: p.t-lead`),
  para("app", "Who checks it", "check.line", "Sentence about who checks the activities (above the 'full review sequence' link)", `${APP}: check paragraph`),
  line("app", "Hear when it lands", "next.heading", "Heading of the email sign-up", `${APP}: h2`),
  line("app", "Hear when it lands", "next.lead", "Sentence under the sign-up heading", `${APP}: sign-up line`),
  para("app", "Hear when it lands", "next.note", "Status note beside the sign-up (in development, not yet tested)", `${APP}: status note`),
  line("app", "Closing", "close.line", "Closing sentence at the foot of the page, above the shop and show-site links", `${APP}: closing sentence`),

  /* Press kit. Fact rows, spellings and file captions are facts kept in the page. */
  line("media", "Top of the page", "kit.title", "Page title (the company name)", `${MEDIA}: h1`),
  para("media", "Top of the page", "kit.intro", "Opening paragraph under the title", `${MEDIA}: intro paragraph`),
  para("media", "Art for download", "art.intro", "The line above the files", `${MEDIA}: art intro`),
  line("media", "Art for download", "people.note", "The note under the list of people", `${MEDIA}: People row note`),
  para("media", "Press route", "press.lead", "The Enquiries paragraph", `${MEDIA}: Enquiries row`),

  /* Shop: the catalogue, the product page and the download page. */
  line("shop", "The shelf", "shelf.label", "Small label above the shop headline", `${SHOP}: mono label`),
  line("shop", "The shelf", "shelf.title", "Shop headline", `${SHOP}: h1`),
  para("shop", "The shelf", "credit.lead", "One sentence under the shelf saying what the packs are", `${SHOP}: credit line`),
  para("shop", "How buying works", "terms.line", "How buying works, the short strip under the shelf", `${SHOP}: terms strip`),
  line("shop", "How buying works", "terms.toggle", "Wording on the open and close control under the buying strip", `${SHOP}: terms toggle`),
  line("shop", "When nothing shows", "empty.line", "Message shown when nothing is on sale", `${SHOP}: empty state`),
  line("shop", "When nothing shows", "failed.lead", "First line shown when the shop cannot load", `${SHOP}: failed state`),
  line("shop", "When nothing shows", "failed.line", "Second line shown when the shop cannot load", `${SHOP}: failed state`),
  para("shop", "Closing", "close.line", "Closing sentence at the foot of the shop", `${SHOP}: ClosingLine`),
  line("shop", "Closing", "close.show", "Closing link to the show's free activities", `${SHOP}: ClosingLine link`),
  line("shop", "Product page", "product.samples.heading", "Heading over the three sample pages", "src/pages/ShopProduct.tsx: samples heading"),
  line("shop", "Product page", "product.samples.credit", "Illustrator credit under the sample pages", "src/pages/ShopProduct.tsx: samples credit"),
  line("shop", "Product page", "product.shelf.link", "Link back to the shelf", "src/pages/ShopProduct.tsx: shelf link"),
  para("shop", "Product page", "product.free.line", "Sentence about free activities", "src/pages/ShopProduct.tsx: free line"),
  para("shop", "Product page", "product.docket.foot", "Note under the purchase terms about saving the file", "src/pages/ShopProduct.tsx: docket foot"),
  line("shop", "Product page", "product.wrong.line", "What to do if a download goes wrong", "src/pages/ShopProduct.tsx: wrong line"),
  line("shop", "Download page", "download.close.line", "Closing sentence", "src/pages/Download.tsx: closing line"),
  line("shop", "Download page", "download.close.link", "Closing link to the show's site", "src/pages/Download.tsx: closing link"),

  /* Get in touch: the form. Form controls and route blurbs are not editable. */
  line("contact", "Top of the page", "title", "Page title", `${CONTACT}: h1`),
  para("contact", "Top of the page", "lead", "Sentence beside the title, who the page is for", `${CONTACT}: p.t-lead`),
  line("contact", "Who reads it", "readers.heading", "Heading over the five readers", `${CONTACT}: readers h2`),
  para("contact", "Who reads it", "readers.note", "Line under the five readers", `${CONTACT}: readers note`, { required: false }),
  line("contact", "Answered elsewhere", "else.heading", "Heading over the other-pages list", `${CONTACT}: h2#else-h`),
  line("contact", "Answered elsewhere", "else.line", "Small line beside that heading", `${CONTACT}: line beside h2#else-h`, { required: false }),

  /* Legal. Whole sections, so a solicitor's correction is one edit. */
  ...legal("privacy", ["Who we are", "What we collect", "Why we collect it", "Legal basis", "Who we share it with", "How long we keep it", "Your rights", "Changes to this policy"]),
  ...legal("terms", ["Using this site", "Buying a digital product", "Licence and permitted use", "Refunds and withdrawal", "Intellectual property", "Liability", "Governing law"]),
  ...legal("cookies", ["What we use", "Payments", "Analytics", "Managing cookies"]),

  /* Page not found */
  line("404", "Top of the page", "hero.eyebrow_sub", "Status line after '404 ·' at the top", `${NF}: status line`),
  line("404", "Top of the page", "hero.title", "Headline", `${NF}: h1`),
  line("404", "Top of the page", "routes.heading", "First sentence of the paragraph under the headline", `${NF}: lead paragraph`),
  line("404", "Top of the page", "hero.aside", "Second sentence of the paragraph under the headline", `${NF}: lead paragraph`),
];

/* ─── Where each page's COPY lives ───────────────────────────────────────
   The owning shard creates or fills the module and keeps every key of that
   page's blocks in it. Image blocks have no entry (their default is `asset`).
   Loose typing on purpose: a page module that has not exported COPY yet
   yields {} rather than a type error. */
type Copy = Record<string, string>;
const pick = (m: unknown, name = "COPY"): Copy => ((m as Record<string, unknown>)[name] as Copy | undefined) ?? {};

const DEFAULTS: Record<PageId, () => Promise<Copy>> = {
  home: () => import("@/components/home/copy").then((m) => pick(m)),
  story: () => import("@/components/story/copy").then((m) => pick(m)),
  team: () => import("@/components/teampage/copy").then((m) => pick(m)),
  "ethical-ai": () => import("@/components/ethical-ai/copy").then((m) => pick(m)),
  "case-study": () => import("@/components/casestudy/copy").then((m) => pick(m)),
  contact: () => import("@/components/contact/copy").then((m) => pick(m)),
  journal: () => import("@/pages/Journal").then((m) => pick(m)),
  "404": () => import("@/pages/NotFound").then((m) => pick(m)),
  privacy: () => import("@/pages/Legal").then((m) => (pick(m, "LEGAL_COPY") as unknown as Record<string, Copy>).privacy ?? {}),
  terms: () => import("@/pages/Legal").then((m) => (pick(m, "LEGAL_COPY") as unknown as Record<string, Copy>).terms ?? {}),
  cookies: () => import("@/pages/Legal").then((m) => (pick(m, "LEGAL_COPY") as unknown as Record<string, Copy>).cookies ?? {}),
  app: () => import("@/pages/AppPage").then((m) => pick(m)),
  media: () => import("@/pages/Media").then((m) => pick(m)),
  shop: () => import("@/components/shop/copy").then((m) => pick(m)),
};

/** Where each page's COPY is exported from, for the contract and the gate. */
export const COPY_MODULES: Record<PageId, string> = {
  home: "src/components/home/copy.ts (COPY)",
  story: "src/components/story/copy.ts (COPY)",
  team: "src/components/teampage/copy.ts (COPY)",
  "ethical-ai": "src/components/ethical-ai/copy.ts (COPY)",
  "case-study": "src/components/casestudy/copy.ts (COPY)",
  contact: "src/components/contact/copy.ts (COPY)",
  journal: "src/pages/Journal.tsx (export const COPY)",
  "404": "src/pages/NotFound.tsx (export const COPY)",
  privacy: "src/pages/Legal.tsx (export const LEGAL_COPY, .privacy)",
  terms: "src/pages/Legal.tsx (export const LEGAL_COPY, .terms)",
  cookies: "src/pages/Legal.tsx (export const LEGAL_COPY, .cookies)",
  app: "src/pages/AppPage.tsx (export const COPY)",
  media: "src/pages/Media.tsx (export const COPY)",
  shop: "src/components/shop/copy.ts (COPY)",
};

/** The original wording for every text block on a page, keyed by block key.
 *  Never throws: a failed import yields {}. */
export async function loadDefaults(page: PageId): Promise<Copy> {
  try {
    return await DEFAULTS[page]();
  } catch {
    return {};
  }
}

/** Every block on one page, in registry (page) order. */
export function blocksFor(page: PageId): BlockDef[] {
  return BLOCKS.filter((b) => b.page === page);
}

/** One block, or undefined. */
export function findBlock(page: PageId, key: string): BlockDef | undefined {
  return BLOCKS.find((b) => b.page === page && b.key === key);
}

/** A page's blocks grouped by `section`, in first-appearance order. */
export function sectionsFor(page: PageId): { blocks: BlockDef[]; section: string }[] {
  const out: { blocks: BlockDef[]; section: string }[] = [];
  for (const b of blocksFor(page)) {
    const last = out[out.length - 1];
    if (last && last.section === b.section) last.blocks.push(b);
    else out.push({ section: b.section, blocks: [b] });
  }
  return out;
}

/** The text that makes a block invalid to save, or null. */
export function blockValueError(def: BlockDef, value: string | { url: string; alt: string }): string | null {
  if (def.kind === "image") {
    const v = value as { url: string; alt: string };
    if (!v.url) return "Choose an image first.";
    if (!v.alt.trim()) return "Describe the image before saving.";
    return null;
  }
  const t = String(value);
  if (def.required && !t.trim()) return "This cannot be empty. Use \"Reset to the original wording\" to go back to how it was.";
  if (def.emphasis && (t.match(/\*/g)?.length ?? 0) % 2 === 1) return "A star is missing. Wrap the words to highlight in a pair of stars, *like this*.";
  return null;
}
