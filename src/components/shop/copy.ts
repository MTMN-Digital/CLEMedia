/* ============================================================================
   The shop page's editable copy, keyed by block key (src/lib/blocks.ts,
   blocksFor("shop")). Each string is the page's own text, character for
   character, and is what /shop renders when no content_blocks row overrides
   it. The headline's accent clause sits between *stars*, which emphasis()
   turns back into the <em> the page used to write by hand.

   One line here was corrected on 2026-10-27 rather than copied: the small
   label under "Shop" used to read "Printable PDFs". The first products are
   episode packs, each a zip folder of PDFs, so the label now says what is on
   the shelf without naming a format that is only true of what is inside.
   ========================================================================== */
export const COPY: Record<string, string> = {
  "hero.eyebrow_sub": "Printable packs",
  "hero.aside": "Buy a file, download it, print it as often as you like.",
  "hero.title": "Things you print and put *on the table.*",
  "refuse.heading": "A card payment, and nothing else.",
  "refuse.lead":
    "A printable for a four year old usually costs an email address. This one costs whatever the file costs.",
  "terms.heading": "The link works for 24 hours and five downloads.",
  "free.heading": "Most of it costs nothing",
  "free.lead":
    "The episodes are free to watch and the show's own site carries family activities. The shop is for the things worth printing.",
};
