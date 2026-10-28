/* The team page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("team", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. The
   people themselves come from src/components/team/people.ts and the admin's
   Team panel, not from here.

   REBUILT AS A REGISTER, 2026-10-28 (docs/SUBPAGE-PLANS-2026-10-28.md, team).
   The corner labels, the aside, the board heading, the display claim over the
   biographies and the closing band's heading are gone with the blocks that
   carried them. What is left is the label, the register's head, the adviser note and the
   closing line. The paragraph beside the title and the one under the
   register's head were cut on 2026-10-28 at the client's request. */
export const COPY: Record<string, string> = {
  "hero.title": "Team and advisers",
  "register.heading": "In their own words",
  "register.key":
    "A script goes round three or four times; the cut goes round until everyone is happy.",
  "adviser.heading": "Adviser",
  "adviser.lead": "Advisers are not employees. Each is described only as they have approved it.",
  "close.lead":
    "How an episode is written, reviewed and made, and where AI is and is not used, is set out in full on the Responsible AI page.",
  "close.link": "Responsible AI",
};
