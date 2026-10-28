/* ============================================================================
   The shop's editable copy, keyed by block key (src/lib/blocks.ts,
   blocksFor("shop")). Each string is the page's own text, character for
   character, and is what the three shop routes render when no content_blocks
   row overrides it. Plain strings: no starred clause, no accent markup.

   The catalogue facts are not here. The count of packs and the price come
   from the product rows; the book counts come from src/lib/books.ts, which
   /app prints identically, so the two pages cannot disagree.

   Rewritten 2026-10-28 for the catalogue (docs/SUBPAGE-PLANS-2026-10-28.md,
   "## shop"). Retired keys: hero.eyebrow_sub, hero.aside, hero.title,
   refuse.heading, refuse.lead, terms.heading, free.heading, free.lead.
   ========================================================================== */
export const COPY: Record<string, string> = {
  /* /shop, the shelf label and the h1. */
  "shelf.label": "Shop",
  "shelf.title": "Episode packs",

  /* Under the shelf: the catalogue's one descriptive sentence. The book
     counts and the illustrator's credit follow it from src/lib/books.ts. */
  "credit.lead":
    "One pack for each episode of The Pawsitive Pugs & Pals®, as PDFs to print at home or in a classroom.",

  /* The footnote strip and the disclosure under it. */
  "terms.line":
    "No account, no email gate, no mailing list. One card payment, through Stripe, and a download link that works for 24 hours and five downloads. Save the file when it arrives.",
  "terms.toggle": "Every line here is a thing the code does or does not do",

  /* The shelf's honest states. */
  "empty.line": "The first six packs go on sale shortly, one for each episode.",
  "failed.lead": "That is a fault at our end, not a statement about what is on sale.",
  "failed.line": "Reload the page, and if it keeps happening tell us and we will look at it.",

  /* The closing line and its two links. */
  "close.line":
    "The episodes are free to watch, and the show's own site carries free colouring pages. The interactive activities are in PupsPlayer™.",
  "close.show": "Free activities on the show's site",

  /* /shop/:slug */
  "product.samples.heading": "Three pages from the pack",
  "product.samples.credit": "Activity and colouring pages designed and illustrated by Victoria Buchkova.",
  "product.shelf.link": "Everything else on the shelf",
  "product.free.line":
    "Free activities live on the show's own site, and the interactive ones are part of PupsPlayer™.",
  "product.docket.foot":
    "Save the file as soon as it downloads. There is no account here, so there is nowhere to come back to it, and the link stops working after a day.",
  "product.wrong.line": "Something wrong with a download: send us the receipt Stripe emailed you and we will put it right.",

  /* /download/:token, the one closing line on every state. */
  "download.close.line": "The episodes behind these pages are free to watch on the show's site.",
  "download.close.link": "The show's own site",
};
