import { para, list, line, type BlockDef } from "@/lib/blockdefs";
import { DOG_ROWS } from "./copy";

const STORY = "src/components/story/RealDogs.tsx";

/* Extra editable blocks for the "story" page, owned by this page's folder.
   blocks.ts appends them to the registry. Build them with line, para, image
   and list from @/lib/blockdefs; see .parallel/portal/CONTRACT.md, Run 3. */
export const CMS: BlockDef[] = [
  line("story", "The real Finn and Fia", "dogs.heading", "Heading over the photographs of the real dogs", `${STORY}: h2`),
  list(
    "story", "The real Finn and Fia", "dogs.rows", "Names under the two rows of photographs (first row, then second row)",
    `${STORY}: row figcaptions`, "name", [{ name: "name", label: "Name under the row", kind: "line" }], DOG_ROWS, { min: 2, max: 2 },
  ),
  para("story", "The real Finn and Fia", "dogs.note", "Note under the photographs", `${STORY}: closing note`),
];
