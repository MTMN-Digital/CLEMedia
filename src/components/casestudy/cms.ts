import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { IRELAND_THEMES, ENGLAND_THEMES, APART, STEP_BODIES, FOR_STUDY, ANSWERS } from "./lists";

/* Extra editable blocks for the "case-study" page, owned by this page's folder.
   blocks.ts appends them to the registry. */
const CS = "src/pages/CaseStudy.tsx";
const P = "case-study" as const;

export const CMS: BlockDef[] = [
  line(P, "Opening", "head.eyebrow", "Small label above the page title", `${CS}: mono line`),
  line(P, "The four steps", "step2.caption", "Caption under the episode picture in step 2", `${CS}: figcaption`),
  line(P, "The four steps", "step2.link", "Text of the watch link in step 2", `${CS}: TextLink`),
  line(P, "The questionnaire", "q.status", "Status line under the questionnaire text", `${CS}: FactRows`),
  line(P, "Your answers", "data.privacy", "Text of the link to the privacy policy", `${CS}: TextLink`),
  line(P, "Opening", "facts.status.label", "Label of the Status row (used in the key facts and the questionnaire)", `${CS}: FactRows`),
  line(P, "Opening", "facts.opens.label", "Label of the Opens row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.opens", "Text of the Opens row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.routes.label", "Label of the Routes row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.routes", "Text of the Routes row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.episode.label", "Label of the Episode row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.materials.label", "Label of the Materials row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.materials", "Text of the Materials row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.questionnaire.label", "Label of the Questionnaire row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.questionnaire", "Text of the Questionnaire row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.results.label", "Label of the Results row in the key facts beside the drawing", `${CS}: FactRows`),
  line(P, "Opening", "facts.results", "Text of the Results row in the key facts beside the drawing", `${CS}: FactRows`),
  para(P, "The route", "route.ireland.summary", "Sentence about Aistear when Ireland is chosen", `${CS}: RoutePanel`),
  line(P, "The route", "route.ireland.themes.label", "Heading above the Aistear themes", `${CS}: RoutePanel`),
  list(P, "The route", "route.ireland.themes", "The Aistear themes", `${CS}: RoutePanel`, "theme",
    [{ name: "theme", label: "Theme", kind: "line" }], IRELAND_THEMES, { max: 12 }),
  para(P, "The route", "route.england.summary", "Sentence about the EYFS when England is chosen", `${CS}: RoutePanel`),
  line(P, "The route", "route.england.themes.label", "Heading above the EYFS areas of learning", `${CS}: RoutePanel`),
  list(P, "The route", "route.england.themes", "The EYFS areas of learning", `${CS}: RoutePanel`, "area of learning",
    [{ name: "theme", label: "Area", kind: "line" }], ENGLAND_THEMES, { max: 12 }),
  list(P, "The four steps", "steps.bodies", "The sentence under each of the four steps, in order", `${CS}: STEP_BODIES`, "step sentence",
    [{ name: "body", label: "Sentence", kind: "paragraph" }], STEP_BODIES, { min: 4, max: 4 }),
  list(P, "To be published", "pub.items", "What will be published for the study", `${CS}: FOR_STUDY`, "item",
    [{ name: "label", label: "Item", kind: "line" }, { name: "value", label: "Where it stands", kind: "paragraph" }], FOR_STUDY, { max: 16 }),
  list(P, "To be published", "out.items", "What is kept apart from the study", `${CS}: APART`, "item",
    [{ name: "label", label: "Item", kind: "line" }, { name: "value", label: "Where it stands", kind: "paragraph" }], APART, { max: 6 }),
  list(P, "Your answers", "data.items", "How answers are handled", `${CS}: ANSWERS`, "question and answer",
    [{ name: "k", label: "Question", kind: "line" }, { name: "v", label: "Answer", kind: "paragraph" }], ANSWERS, { max: 10 }),
];
