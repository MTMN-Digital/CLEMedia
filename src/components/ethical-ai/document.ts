/* The facts of the Responsible AI position as a document: when its wording
   was last set, and the two facts a document has that a speech does not.

   REVISED is the day the wording was last written: the position text in
   stations.ts was rewritten from the client's review document of 22 October
   on 2026-10-24. The page prints it under the label "Wording last revised"
   (components/doc/dates.ts) so it can never read as the date the position
   was adopted. Change a clause, change this constant in the same edit. Never
   a live date.

   ADOPTED and APPROVED_BY are NEEDED FROM CLIENT (CONTENT-NEEDED.md). While
   they are null their status rows do not render: an empty "Approved by" on a
   trust document is worse than none. There is no version constant on
   purpose; a version number is invented until the client asks for one. */
export const REVISED = "2026-10-24";

export const ADOPTED: string | null = null;

export const APPROVED_BY: string | null = null;
