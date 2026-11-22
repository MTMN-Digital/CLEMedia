import { line, list, type BlockDef } from "@/lib/blockdefs";
import { ROUTE_ITEMS } from "@/components/notfound/lists";

/* Extra editable blocks for the "404" page (Run 3). */
const NF = "src/pages/NotFound.tsx";

export const CMS: BlockDef[] = [
  line("404", "The reel", "frame.label", "Small label inside the empty film frame", `${NF}: MissingFrame label`),
  list(
    "404", "The routes back", "routes.items", "The ways back from the page, one line each", `${NF}: ROUTE_ITEMS`,
    "way back",
    [
      { name: "title", label: "Where it goes", kind: "line" },
      { name: "line", label: "What is there", kind: "line" },
    ],
    ROUTE_ITEMS,
    { min: 1, max: 6 },
  ),
];
