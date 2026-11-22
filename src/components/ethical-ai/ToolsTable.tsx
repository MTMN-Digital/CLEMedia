import { TOOL_PLACEMENT } from "./stations";
import { useList, useBlock } from "@/lib/content";
import { COPY } from "./copy";
import { TOOL_ITEMS } from "./lists";

/* ============================================================================
   The tools, as a table: clause 3 of the Responsible AI position.

   The only table on the page. One row per platform the client named; every
   cell is the company's own wording from `PLATFORMS` and the first appendix
   answer: what the tool is used for, and what happens before release.

   THREE COLUMNS UNTIL THE CLIENT CONFIRMS THE PLACEMENT. A fourth, "Where on
   the line", renders only when `TOOL_PLACEMENT` holds Conor's sentence
   (stations.ts). Until then nothing on the page attaches a phase number to
   the tools; Figure 1 draws them at one point and clause 2 restates the
   drawing, which is as far as a dated document may go.

   ON A PHONE the table does not scroll sideways. Under 640px each row
   becomes a stack of labelled lines (pos.css, `.pos-table`): the column head
   is printed before each cell from its `data-label`, in the same mono as
   the heads, over the 17px value.
   ========================================================================== */

export function ToolsTable() {
  const rows = useList("ethical-ai", "tools.items", TOOL_ITEMS);
  const hTool = useBlock("ethical-ai", "table.tool", COPY["table.tool"]);
  const hUsed = useBlock("ethical-ai", "table.used", COPY["table.used"]);
  const hBefore = useBlock("ethical-ai", "table.before", COPY["table.before"]);
  const placed = TOOL_PLACEMENT !== null && TOOL_PLACEMENT.trim() !== "";
  return (
    <table className="pos-table w-full border-t-[1.5px] border-rule text-left">
      <thead>
        <tr>
          <th scope="col">{hTool}</th>
          <th scope="col">{hUsed}</th>
          <th scope="col">{hBefore}</th>
          {placed && <th scope="col">Where on the line</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((c, i) => (
          <tr key={i}>
            <th scope="row" data-label={hTool}>
              {c.name}
            </th>
            <td data-label={hUsed}>{c.used}</td>
            <td data-label={hBefore}>{c.before}</td>
            {placed && <td data-label="Where on the line">{TOOL_PLACEMENT}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
