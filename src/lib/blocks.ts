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
  { id: "media", label: "Press and appearances", path: "/media", wiredBy: "media-app-links" },
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

/** The four corners every inner page opens with (PageHero). */
function hero(page: PageId, file: string, opts: { aside?: boolean; title?: boolean; emphasis?: boolean; sub?: boolean; eyebrow?: boolean }): BlockDef[] {
  const out: BlockDef[] = [];
  const S = "Top of the page";
  if (opts.eyebrow) out.push(line(page, S, "hero.eyebrow", "Small label, top left", `${file}: PageHero eyebrow, the text before <span>`));
  if (opts.sub) out.push(line(page, S, "hero.eyebrow_sub", "Second line of the small label", `${file}: PageHero eyebrow, the <span> text`));
  if (opts.aside) out.push(line(page, S, "hero.aside", "Short note, top right", `${file}: PageHero aside`));
  if (opts.title !== false)
    out.push(line(page, S, "hero.title", "Main headline", `${file}: PageHero title`, opts.emphasis === false ? {} : { emphasis: true }));
  return out;
}

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
  line(page, "Top of the page", "title", "Document title", `${LEGAL}: DOCS.${page}.title`),
  para(page, "Top of the page", "intro", "Opening paragraph", `${LEGAL}: DOCS.${page}.intro`),
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

  /* Our story */
  ...hero("story", STORY, { eyebrow: true, sub: true, aside: true }),
  image("story", "Top of the page", "hero.image", "Photograph behind the headline", "story.garden", `${STORY}: PageHero asset`),
  line("story", "How it started", "saw.heading", "Headline", `${STORY}: h2#saw-h`),
  line("story", "Education from the outset", "parent.heading", "Headline", `${STORY}: h2#parent-h`),
  line("story", "Conor's background", "here.heading", "Headline", `${STORY}: h2#here-h`),
  line("story", "The people who build it", "build.heading", "Headline", `${STORY}: h2#build-h`),
  line("story", "The mission film", "film.heading", "Headline", `${STORY}: h2#film-h`),
  line("story", "Where to watch", "reach.heading", "Headline", `${STORY}: h2#reach-h`),
  line("story", "Working with us", "next.heading", "Headline", `${STORY}: h2#next-h`),
  para("story", "Working with us", "next.lead", "Paragraph", `${STORY}: p.t-lead after h2#next-h`),

  /* Our team. The opening is not a PageHero but uses its classes. */
  line("team", "Top of the page", "hero.eyebrow", "Small label, top left", `${TEAM}: p.page-hero__eyebrow, text before <span>`),
  line("team", "Top of the page", "hero.eyebrow_sub", "Second line of the small label", `${TEAM}: p.page-hero__eyebrow <span>`),
  line("team", "Top of the page", "hero.aside", "Short note, top right", `${TEAM}: p.page-hero__aside`),
  line("team", "Top of the page", "hero.title", "Main headline", `${TEAM}: h1#team-h`),
  para("team", "Top of the page", "hero.lead", "Paragraph under the headline", `${TEAM}: p.team-open__lead`),
  line("team", "How the work goes round", "dossier.heading", "Headline", `${TEAM}: h2#dossier-h`),
  line("team", "The people", "people.heading", "Headline", `${TEAM}: h2#people-h`),
  line("team", "Closing band", "cta.heading", "Headline", `${TEAM}: h2#team-cta-h`),
  para("team", "Closing band", "cta.lead", "Paragraph", `${TEAM}: p.t-lead after h2#team-cta-h`),

  /* Responsible AI */
  ...hero("ethical-ai", EAI, { eyebrow: true, sub: true, aside: true }),
  line("ethical-ai", "Who decides", "line.heading", "Headline", `${EAI}: h2#line-h`),
  para("ethical-ai", "Who decides", "line.lead", "Paragraph", `${EAI}: p.t-lead beside h2#line-h`),
  line("ethical-ai", "The lines we hold", "lines.heading", "Headline", `${EAI}: h2#lines-h`),
  line("ethical-ai", "Questions", "faq.heading", "Headline", `${EAI}: h2#faq-h`),
  line("ethical-ai", "Our commitment", "commit.heading", "Headline", `${EAI}: h2#commit-h`),
  para("ethical-ai", "Our commitment", "commit.lead", "Paragraph", `${EAI}: p.t-lead after h2#commit-h`),

  /* Case study. The aside follows STUDY_OPEN and is not editable. */
  ...hero("case-study", CS, { eyebrow: true, sub: true }),
  image("case-study", "Top of the page", "hero.image", "Picture behind the headline", "slate.ep3", `${CS}: PageHero asset`),
  line("case-study", "What we are asking", "ask.heading", "Headline", `${CS}: h2#ask-h`),
  line("case-study", "The two routes", "route.heading", "Headline", `${CS}: h2#route-h`),
  line("case-study", "The materials", "mat.heading", "Headline", `${CS}: h2#mat-h`),
  line("case-study", "The questionnaire", "q.heading", "Headline", `${CS}: h2#q-h`),
  line("case-study", "Where it stands", "out.heading", "Headline", `${CS}: h2#out-h`),
  line("case-study", "Your answers", "data.heading", "Headline", `${CS}: h2#data-h`),

  /* Journal front page. The aside counts posts and is not editable. */
  ...hero("journal", JOURNAL, { eyebrow: true, sub: true }),
  line("journal", "Why it exists", "why.heading", "Headline", `${JOURNAL}: h2#why-h`),
  line("journal", "The strands", "strands.heading", "Headline", `${JOURNAL}: h2#strands-h`),
  line("journal", "Standing rules", "rules.heading", "Headline", `${JOURNAL}: h2#rules-h`),

  /* App */
  ...hero("app", APP, { aside: true }),
  image("app", "Top of the page", "hero.image", "Picture behind the headline", "home.characters", `${APP}: PageHero asset`),
  line("app", "The walkthrough", "walk.heading", "Headline", `${APP}: h2#walk-h`),
  line("app", "Activities", "stages.heading", "Headline", `${APP}: h2#stages-h`),
  line("app", "Who checks it", "check.heading", "Headline", `${APP}: h2#check-h`),
  line("app", "Where it stands", "next.heading", "Headline", `${APP}: h2#next-h`),

  /* Press and appearances */
  ...hero("media", MEDIA, { eyebrow: true, sub: true, aside: true, title: false }),
  line("media", "Top of the page", "hero.title_booked", "Main headline, before any appearance is listed", `${MEDIA}: PageHero title when there are no media_items`, { emphasis: true }),
  line("media", "Top of the page", "hero.title_listing", "Main headline, once appearances are listed", `${MEDIA}: PageHero title when media_items has rows`, { emphasis: true }),
  image("media", "Top of the page", "hero.image", "Picture behind the headline", "show.meadow", `${MEDIA}: PageHero asset`),
  line("media", "The title cards", "stills.heading", "Headline", `${MEDIA}: h2#stills-h`),
  line("media", "Appearances", "index.heading", "Headline", `${MEDIA}: h2#index-h`),
  line("media", "Subjects", "subjects.heading", "Headline", `${MEDIA}: h2#subjects-h`),
  line("media", "Notes to editors", "notes.heading", "Headline", `${MEDIA}: h2#notes-h`),
  line("media", "For journalists", "press.heading", "Headline", `${MEDIA}: h2#press-h`),
  para("media", "For journalists", "press.lead", "Paragraph", `${MEDIA}: p.t-lead after h2#press-h`),

  /* Shop */
  ...hero("shop", SHOP, { sub: true, aside: true }),
  line("shop", "How buying works", "refuse.heading", "Headline", `${SHOP}: h2#refuse-h`),
  para("shop", "How buying works", "refuse.lead", "Paragraph", `${SHOP}: p.t-lead after h2#refuse-h`),
  line("shop", "The download", "terms.heading", "Headline", `${SHOP}: h2#terms-h`),
  line("shop", "Free things", "free.heading", "Headline", `${SHOP}: h2#free-h`),
  para("shop", "Free things", "free.lead", "Paragraph", `${SHOP}: p.t-lead after h2#free-h`),

  /* Get in touch */
  ...hero("contact", CONTACT, { eyebrow: true, sub: true, aside: true }),
  line("contact", "Who reads it", "readers.heading", "Headline", `${CONTACT}: h2 "Who reads what you send"`),
  line("contact", "Other pages", "else.heading", "Headline", `${CONTACT}: h2#else-h`),

  /* Legal. Whole sections, so a solicitor's correction is one edit. */
  ...legal("privacy", ["Who we are", "What we collect", "Why we collect it", "Legal basis", "Who we share it with", "How long we keep it", "Your rights", "Changes to this policy"]),
  ...legal("terms", ["Using this site", "Buying a digital product", "Licence and permitted use", "Refunds and withdrawal", "Intellectual property", "Liability", "Governing law"]),
  ...legal("cookies", ["What we use", "Payments", "Analytics", "Managing cookies"]),

  /* Page not found */
  ...hero("404", NF, { sub: true, aside: true }),
  line("404", "Where to go", "routes.heading", "Headline", `${NF}: h2#nf-routes-h`),
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
