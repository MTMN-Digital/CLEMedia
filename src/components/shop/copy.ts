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
    "The episodes are free to watch, and the show's own site carries free colouring pages. The interactive activities are in The Pawsitive Pugs & Pals® app.",
  "close.show": "Free activities on the show's site",

  /* /shop/:slug */
  "product.samples.heading": "Three pages from the pack",
  "product.samples.credit": "Activity and colouring pages designed and illustrated by Victoria Buchkova.",
  "product.shelf.link": "Everything else on the shelf",
  "product.free.line":
    "Free activities live on the show's own site, and the interactive ones are part of The Pawsitive Pugs & Pals® app.",
  "product.docket.foot":
    "Save the file as soon as it downloads. There is no account here, so there is nowhere to come back to it, and the link stops working after a day.",
  "product.wrong.line": "Something wrong with a download: send us the receipt Stripe emailed you and we will put it right.",

  /* Shelf status row, before the count arrives and after a failure. */
  "status.loading": "Loading the shelf",
  "status.failed": "Could not load the shelf",

  /* /shop/:slug, the decision column and the terms. */
  "product.crumb": "Shop",
  "product.cover.caption": "Cover of the activity book.",
  "product.cancelled": "Checkout was cancelled and nothing was charged. The file is still here whenever you want it.",
  "product.folder.label": "In the folder",
  "product.ack": "I understand the download starts straight away, and that once it does I lose the right to cancel.",
  "product.buy.note": "Card payment is handled by Stripe. You are not asked to make an account, and buying never puts you on a mailing list.",
  "product.samples.swipe": "3 pages, swipe",
  "product.docket.label": "What a purchase is",
  "product.contact.link": "Get in touch",

  /* /shop/:slug, loading, failed and not-found states. */
  "product.loading": "Fetching this file",
  "product.failed.kicker": "Could not load",
  "product.failed.title": "We could not load this one",
  "product.failed.lead": "Something went wrong at our end, not yours. Reload the page, and if it keeps happening tell us and we will look at it.",
  "product.retry": "Try again",
  "product.back": "Back to the shop",
  "product.empty.kicker": "Not on sale",
  "product.empty.title": "That one is not on the shelf",
  "product.empty.lead": "Either the link is wrong, or the file has been taken off sale. Nothing was charged, and if you already bought it your download link still works for its full 24 hours.",
  "product.empty.shop": "See what is on sale",
  "product.empty.contact": "Get in touch",
  "product.nocover": "No artwork has been uploaded for this file yet.",

  /* /download/:token, every state. */
  "download.paid.kicker": "Payment received",
  "download.kicker": "Download",
  "download.loading.title": "Getting your file ready",
  "download.loading.lead": "One moment. Do not close this page.",
  "download.ready.lead": "Save it to your device now. There is no account here, so this page is the only place the file lives for you.",
  "download.ready.pdf": "The file opens in a new tab. If your browser asks where to put it, anywhere you will find it again is the right answer.",
  "download.ready.zip": "The file is a zip folder with the PDFs inside. If your browser asks where to put it, anywhere you will find it again is the right answer, and opening the folder unpacks the books and sheets.",
  "download.back": "Back to the shop",
  "download.wrong": "Something wrong with it",
  "download.ready.docket.label": "Your download",
  "download.ready.account.k": "Account created",
  "download.ready.account.v": "none",
  "download.ready.docket.foot": "Stripe has emailed you its own receipt for the payment. We did not create an account and we have not added you to anything.",
  "download.pending.title": "Thank you. Your payment went through.",
  "download.pending.receipt": "Send us your receipt",
  "download.pending.lead": "Your download link is not on this page. Send us the receipt Stripe has just emailed you and we will put the file straight into your hands.",
  "download.pending.note": "This is the one step in the shop that is not automatic yet, and we would rather say so than leave you looking at a page that says nothing.",
  "download.pending.docket.label": "What you bought",
  "download.pending.docket.foot": "Nothing about this purchase puts you on a mailing list. Your address sits with Stripe, for its receipt.",
  "download.error.not_found.title": "We couldn't find that download",
  "download.error.not_found.body": "The link may be wrong or incomplete. Check the link in your Stripe receipt, or get in touch and we will sort it out.",
  "download.error.expired.title": "This link has expired",
  "download.error.expired.body": "Download links are valid for 24 hours. Get in touch with your receipt and we will issue a new one.",
  "download.error.exhausted.title": "This link has been used up",
  "download.error.exhausted.body": "Each link allows five downloads. Get in touch with your receipt and we will issue a new one.",
  "download.error.server_error.title": "Something went wrong",
  "download.error.server_error.body": "That is on us, not you. Try again in a moment, and if it keeps happening let us know.",
  "download.retry": "Try again",
  "download.contact": "Get in touch",
  "download.error.docket.label": "If you get in touch",
  "download.error.docket.foot": "That is enough to find the purchase and issue a new link. We hold no account for you, so the receipt is the record, and it is worth keeping.",

  /* /download/:token, the one closing line on every state. */
  "download.close.line": "The episodes behind these pages are free to watch on the show's site.",
  "download.close.link": "The show's own site",
};
