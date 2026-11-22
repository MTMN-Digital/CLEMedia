import { line, list, type BlockDef } from "@/lib/blockdefs";
import {
  REFUSAL_ITEMS,
  QUESTION_ITEMS,
  FOR_ITEMS,
  LINE_TOOL_ITEMS,
  COMMITMENT_ITEMS,
  PEOPLE_ITEMS,
  TOOL_ITEMS,
  PHASE_ITEMS,
} from "./lists";

/* Extra editable blocks for the "ethical-ai" page, owned by this page's folder.
   blocks.ts appends them to the registry. Run 3: small labels as lines, the
   repeated sets as lists. Defaults live in copy.ts and lists.ts. */
const P = "ethical-ai" as const;
const EAI = "src/pages/EthicalAi.tsx";
const DIR = "src/components/ethical-ai";

export const CMS: BlockDef[] = [
  line(P, "Title block", "tab.label", "Label on the tab at the top of the sheet", `${EAI}: DocSheet tab`),
  line(P, "Title block", "status.applies", "Status row label for who it applies to", `${EAI}: DocStatus label`),
  line(P, "Title block", "status.tools", "Status row label for the tools named", `${EAI}: DocStatus label`),
  line(P, "Title block", "status.adopted", "Status row label for the adoption date", `${EAI}: DocStatus label`),
  line(P, "Title block", "status.approved", "Status row label for who approved it", `${EAI}: DocStatus label`),
  line(P, "Figure 1", "figure.label", "Word before the Figure 1 caption", `${EAI}: figcaption`),
  line(P, "Figure 1", "key.person", "Key under Figure 1, first entry", `${EAI}: figure key`),
  line(P, "Figure 1", "key.tool", "Key under Figure 1, second entry", `${EAI}: figure key`),
  line(P, "Figure 1", "key.signoff", "Key under Figure 1, third entry", `${EAI}: figure key`),
  line(P, "Figure 1", "figure.return", "Words inside the loop of the drawing (wide screens)", `${DIR}/ProductionFlat.tsx: p.pline__return`),
  list(
    P, "2 How an episode is made", "phases.items",
    "The five phases and the tools step, in the order of the drawing (2.1 to 2.5)",
    `${DIR}/stations.ts: STATIONS`, "step",
    [
      { name: "title", label: "Step name", kind: "line" },
      { name: "who", label: "Who does it", kind: "line" },
      { name: "body", label: "What happens", kind: "paragraph" },
    ],
    PHASE_ITEMS, { min: 6, max: 6 },
  ),
  line(P, "2 How an episode is made", "return.title", "Sub-clause 2.6 heading", `${EAI}: DocSubClause 2.6`),
  line(P, "2 How an episode is made", "reviews.title", "Sub-clause 2.7 heading", `${EAI}: DocSubClause 2.7`),
  list(
    P, "2 How an episode is made", "for.items",
    "What the reviews are for, by audience (2.7)",
    `${DIR}/ForTheChild.tsx: FOR`, "audience",
    [
      { name: "who", label: "Who it is for", kind: "line" },
      { name: "line", label: "What we do for them", kind: "paragraph" },
    ],
    FOR_ITEMS, { min: 1, max: 6 },
  ),
  line(P, "2 How an episode is made", "team.link", "Link to the team page (end of clause 2)", `${EAI}: TextLink to /team`),
  line(P, "3 The tools", "table.tool", "Tools table, first column heading", `${DIR}/ToolsTable.tsx: th`),
  line(P, "3 The tools", "table.used", "Tools table, second column heading", `${DIR}/ToolsTable.tsx: th`),
  line(P, "3 The tools", "table.before", "Tools table, third column heading", `${DIR}/ToolsTable.tsx: th`),
  list(
    P, "3 The tools", "tools.items",
    "The tools table, one row per tool",
    `${DIR}/ToolsTable.tsx: CELLS`, "tool",
    [
      { name: "name", label: "Tool name", kind: "line" },
      { name: "used", label: "Used for", kind: "paragraph" },
      { name: "before", label: "Before release", kind: "paragraph" },
    ],
    TOOL_ITEMS, { min: 1, max: 4 },
  ),
  line(P, "4 What a tool is never used for", "line.people", "Label for the row of things only people decide", `${DIR}/TheLineTable.tsx: dt`),
  list(
    P, "4 What a tool is never used for", "people.items",
    "Things only people decide (above the red line)",
    `${DIR}/TheLineTable.tsx: PEOPLE`, "item",
    [{ name: "text", label: "What people decide", kind: "line" }],
    PEOPLE_ITEMS, { min: 1, max: 8 },
  ),
  line(P, "4 What a tool is never used for", "line.tools", "Label for the row of tools (below the red line)", `${DIR}/TheLineTable.tsx: dt`),
  list(
    P, "4 What a tool is never used for", "line.tools.items",
    "Tools and what they are named for (below the red line)",
    `${DIR}/TheLineTable.tsx: TOOLS`, "tool",
    [
      { name: "name", label: "Tool name", kind: "line" },
      { name: "does", label: "What it is named for", kind: "line" },
    ],
    LINE_TOOL_ITEMS, { min: 1, max: 4 },
  ),
  list(
    P, "4 What a tool is never used for", "refusals.items",
    "The things a tool never does (4.1, 4.2, 4.3)",
    "src/components/ethical-ai/stations.ts: DO_NOT", "refusal",
    [{ name: "text", label: "What a tool never does", kind: "paragraph" }],
    REFUSAL_ITEMS, { min: 1, max: 8 },
  ),
  list(
    P, "5 Six commitments", "commitments.items",
    "The commitments (5.1 onward)",
    `${EAI}: LINES`, "commitment",
    [
      { name: "title", label: "Commitment", kind: "line" },
      { name: "body", label: "What it means", kind: "paragraph" },
    ],
    COMMITMENT_ITEMS, { min: 1, max: 10 },
  ),
  list(
    P, "Appendix A", "questions.items",
    "Questions people ask, with answers",
    `${EAI}: QUESTIONS`, "question",
    [
      { name: "q", label: "Question", kind: "line" },
      { name: "a", label: "Answer", kind: "paragraph" },
    ],
    QUESTION_ITEMS, { min: 1, max: 12 },
  ),
];
