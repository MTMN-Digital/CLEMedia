import { type BlockDef, line } from "@/lib/blockdefs";

const TEAM = "src/pages/Team.tsx";
const REG = "src/components/teampage/Register.tsx";

/* Extra editable blocks for the "team" page, owned by this page's folder.
   blocks.ts appends them to the registry. Build them with line, para, image
   and list from @/lib/blockdefs; see .parallel/portal/CONTRACT.md, Run 3. */
export const CMS: BlockDef[] = [
  line("team", "The people", "register.phases", "Word before the five phase names", `${TEAM}: register key, bold word`),
  line("team", "The people", "register.account", "Words before the Responsible AI link in that line", `${TEAM}: register key line`),
  line("team", "The people", "register.account_link", "Text of the Responsible AI link in that line", `${TEAM}: register key link`),
  line("team", "The people", "register.takes_part", "Label above the phases a person is in", `${REG}: roll call label`),
  line("team", "The people", "register.not_in", "Label for a person who is in none of the phases", `${REG}: roll call label`),
  line("team", "The people", "register.every", "Words for a person in every phase", `${REG}: roll call summary`),
  line("team", "The people", "register.every_but", "Words before the missing phase, for a person in all but one", `${REG}: roll call summary`),
  line("team", "The people", "register.more", "Words before a first name on the button that opens a biography", `${REG}: biography button`),
  line("team", "The people", "register.less", "Button that closes a biography", `${REG}: biography button`),
];
