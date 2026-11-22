import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { ELSEWHERE_ITEMS } from "@/components/contact/lists";

/* Extra editable blocks for the "contact" page (Run 3). */
const CONTACT = "src/pages/Contact.tsx";

export const CMS: BlockDef[] = [
  line("contact", "The form", "form.to", "Line at the head of the form saying who the message goes to", `${CONTACT}: To row`),
  line("contact", "The form", "route.partnership.short", "Choice 1 on the form: short name", `${CONTACT}: route chips`),
  line("contact", "The form", "route.partnership.blurb", "Choice 1 on the form: line shown when it is picked", `${CONTACT}: route blurb`),
  line("contact", "The form", "route.educator.short", "Choice 2 on the form: short name", `${CONTACT}: route chips`),
  line("contact", "The form", "route.educator.blurb", "Choice 2 on the form: line shown when it is picked", `${CONTACT}: route blurb`),
  line("contact", "The form", "route.press.short", "Choice 3 on the form: short name", `${CONTACT}: route chips`),
  line("contact", "The form", "route.press.blurb", "Choice 3 on the form: line shown when it is picked", `${CONTACT}: route blurb`),
  line("contact", "The form", "route.general.short", "Choice 4 on the form: short name", `${CONTACT}: route chips`),
  line("contact", "The form", "route.general.blurb", "Choice 4 on the form: line shown when it is picked", `${CONTACT}: route blurb`),
  line("contact", "The form", "form.subject.label", "Small label before the subject line the team will see", `${CONTACT}: subject label`),
  para("contact", "The form", "form.privacy", "Note under the form about how the address is used", `${CONTACT}: privacy note`),
  line("contact", "The form", "sent.eyebrow", "Small label on the thank-you screen after sending", `${CONTACT}: sent state`),
  line("contact", "The form", "sent.heading", "Heading on the thank-you screen after sending", `${CONTACT}: sent state`),
  para("contact", "The form", "sent.lead", "Sentence above the copy of the message on the thank-you screen", `${CONTACT}: sent state`),
  line("contact", "The form", "sent.home", "First button on the thank-you screen", `${CONTACT}: sent state`),
  line("contact", "The form", "sent.team", "Second button on the thank-you screen", `${CONTACT}: sent state`),
  line("contact", "The form", "form.to.label", "Label before the addressee at the head of the form", `${CONTACT}: To row`),
  line("contact", "The form", "form.registered.label", "Label before the registered company details", `${CONTACT}: registered details`),
  line("contact", "The form", "form.email.label", "Label before the email address at the foot of the form", `${CONTACT}: email row`),
  line("contact", "The form", "form.privacy.link", "Wording of the link to the privacy policy", `${CONTACT}: registered details link`),
  line("contact", "Who reads it", "readers.link", "Link under the five readers", `${CONTACT}: readers link`),
  list(
    "contact", "Answered elsewhere", "else.items", "The rows pointing readers to other pages", `${CONTACT}: ELSEWHERE_ITEMS`,
    "row",
    [
      { name: "who", label: "Who it is for", kind: "line" },
      { name: "title", label: "Where it goes", kind: "line" },
      { name: "line", label: "What they will find", kind: "paragraph" },
    ],
    ELSEWHERE_ITEMS,
    { min: 1, max: 6 },
  ),
];
