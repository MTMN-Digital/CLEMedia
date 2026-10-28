import { TOOL_PLACEMENT, PLATFORMS } from "./stations";

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

/* The two cells per tool, in the words PLATFORMS and the first appendix
   answer already use. Runway's "before release" cell is the position's own
   sentence about every output (the second refusal in DO_NOT). */
const CELLS: Record<string, { before: string; used: string }> = {
  Runway: {
    used: "Elements of visual production and animation, to the script and direction set by the team.",
    before: "Directed, reviewed and approved by the team.",
  },
  ElevenLabs: {
    used: "Elements of audio and voice production.",
    before: "Reviewed for quality and suitability before release.",
  },
};

export function ToolsTable() {
  const placed = TOOL_PLACEMENT !== null && TOOL_PLACEMENT.trim() !== "";
  return (
    <table className="pos-table w-full border-t-[1.5px] border-rule text-left">
      <thead>
        <tr>
          <th scope="col">Tool</th>
          <th scope="col">Used for</th>
          <th scope="col">Before release</th>
          {placed && <th scope="col">Where on the line</th>}
        </tr>
      </thead>
      <tbody>
        {PLATFORMS.map((p) => {
          const c = CELLS[p.name] ?? { used: p.body, before: "" };
          return (
            <tr key={p.name}>
              <th scope="row" data-label="Tool">
                {p.name}
              </th>
              <td data-label="Used for">{c.used}</td>
              <td data-label="Before release">{c.before}</td>
              {placed && <td data-label="Where on the line">{TOOL_PLACEMENT}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
