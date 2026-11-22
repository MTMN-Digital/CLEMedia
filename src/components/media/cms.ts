import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { SPELLINGS, ART_LABELS, FACTS } from "./items";

/* Extra editable blocks for the "media" page, owned by this page's folder.
   blocks.ts appends them to the registry. Defaults live in Media.tsx (COPY)
   and items.ts. See .parallel/portal/CONTRACT.md, Run 3. */
const MEDIA = "src/pages/Media.tsx";

export const CMS: BlockDef[] = [
  line("media", "Top of the page", "kit.eyebrow", "Small label above the page title", `${MEDIA}: eyebrow`),
  line("media", "Top of the page", "kit.updated", "The words before the date under the title (the date itself is set in code)", `${MEDIA}: sheet updated line`),
  line("media", "Top of the page", "kit.link_press", "Link to the press enquiry form (used under the opening paragraph and again in the press route)", `${MEDIA}: title block links`),
  line("media", "Top of the page", "kit.link_show", "Link under the opening paragraph to the show's own site", `${MEDIA}: title block links`),

  line("media", "Facts", "facts.heading", "Heading of the first group", `${MEDIA}: Group Facts`),
  list("media", "Facts", "facts.items", "The facts a journalist copies (label, wording, link text). The registered company row and the app row are filled in automatically", `${MEDIA}: factsFor`, "fact", [
    { name: "label", label: "Label", kind: "line" },
    { name: "value", label: "Wording", kind: "paragraph" },
    { name: "link", label: "Link text (leave empty for none)", kind: "line", optional: true },
  ], FACTS, { min: 7, max: 7 }),
  line("media", "Facts", "facts.label_registered", "Label of the registered company row (its wording is filled in automatically)", `${MEDIA}: factsFor`),
  line("media", "Facts", "facts.link_privacy", "Link text on the registered company row", `${MEDIA}: factsFor`),
  line("media", "Facts", "facts.label_player", "Label of the app row (its wording is filled in automatically)", `${MEDIA}: factsFor`),
  line("media", "Facts", "facts.link_app", "Link text on the app row", `${MEDIA}: factsFor`),
  line("media", "Facts", "facts.copy", "Button that copies all the facts", `${MEDIA}: CopyFacts`),
  line("media", "Facts", "facts.copied", "What that button says for a moment after it is pressed", `${MEDIA}: CopyFacts`),

  line("media", "Spellings and marks", "spellings.heading", "Heading of the spellings group", `${MEDIA}: Group Spellings`),
  list("media", "Spellings and marks", "spellings.items", "Spellings the company wants kept in print", `${MEDIA}: SPELLINGS`, "spelling", [
    { name: "label", label: "Label", kind: "line" },
    { name: "value", label: "Wording", kind: "paragraph" },
    { name: "pending", label: "Small note under it (leave empty for none)", kind: "line", optional: true },
  ], SPELLINGS, { max: 10 }),

  line("media", "Art for download", "art.heading", "Heading of the art group", `${MEDIA}: Group Art`),
  list("media", "Art for download", "art.labels", "The four row names beside the downloadable files, in page order", `${MEDIA}: ART`, "row name", [
    { name: "label", label: "Row name", kind: "line" },
  ], ART_LABELS, { min: 4, max: 4 }),
  line("media", "Art for download", "people.label", "Row name for the list of people", `${MEDIA}: People row`),

  line("media", "Appearances", "appearances.heading", "Heading of the appearances group", `${MEDIA}: Group Appearances`),
  para("media", "Appearances", "appearances.failed", "Note shown if the list of appearances cannot be loaded", `${MEDIA}: load failed note`),
  para("media", "Appearances", "appearances.empty", "Note shown while no coverage has been added", `${MEDIA}: load empty note`),

  line("media", "Appearances", "appearances.status_empty", "Status line above the list when no coverage has been added", `${MEDIA}: status line`),
  line("media", "Appearances", "appearances.status_failed", "Status line above the list when it cannot be loaded", `${MEDIA}: status line`),
  line("media", "Appearances", "appearances.status_loading", "Status line above the list while it loads", `${MEDIA}: status line`),
  line("media", "Appearances", "appearances.tag_booked", "Small tag at the right of a booked appearance", `${MEDIA}: entry tag`),
  line("media", "Appearances", "appearances.tag_expected", "Small tag at the right of an expected appearance", `${MEDIA}: entry tag`),
  line("media", "Appearances", "appearances.tag_published", "Small tag at the right of a published appearance", `${MEDIA}: entry tag`),
  line("media", "Appearances", "appearances.open", "The word before a coverage title in its link ('Open ...')", `${MEDIA}: coverage links`),

  line("media", "Press route", "route.heading", "Heading of the press route group", `${MEDIA}: Group Press route`),
  line("media", "Press route", "route.label_enquiries", "Row name for the enquiries paragraph", `${MEDIA}: Enquiries row`),
  line("media", "Press route", "route.label_readers", "Row name for the list of who reads enquiries", `${MEDIA}: Who reads it row`),
  line("media", "Press route", "ends.line", "The last word at the foot of the sheet", `${MEDIA}: Ends`),
];
