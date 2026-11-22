import { type BlockDef, line } from "@/lib/blockdefs";

/* Extra editable blocks for the "journal" page (Run 3). The four strands are
   categories (Journal section of the admin) and the four rules already have
   blocks, so what is added is the status rows and the published heading. */
const J = "src/pages/Journal.tsx";

export const CMS: BlockDef[] = [
  line("journal", "Masthead", "status.first.label", "Status row label: first piece", `${J}: status row`),
  line("journal", "Masthead", "status.first.value", "Status row answer: first piece", `${J}: status row`),
  line("journal", "Masthead", "status.cadence.label", "Status row label: how often", `${J}: status row`),
  line("journal", "Masthead", "status.cost.label", "Status row label: cost", `${J}: status row`),
  line("journal", "Masthead", "status.cost.value", "Status row answer: cost", `${J}: status row`),
  line("journal", "Masthead", "status.published.label", "Status row label: pieces published", `${J}: status row`),
  line("journal", "Published pieces", "published.heading", "Small heading over the published pieces, once there are some", `${J}: h2#published-h`),
];
