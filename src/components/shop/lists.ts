/* Repeated items on the shop pages. The same arrays are the defaults of the
   list blocks in cms.ts and what the pages render until a list is saved. */

/** The five promises behind the disclosure on /shop. `where` is the file
 *  that keeps the promise. */
export const REFUSAL_ITEMS: { body: string; where: string; title: string }[] = [
  {
    title: "No account",
    body: "There is nothing to sign up to and no password to forget. Nothing on this site has a login except the admin panel the team writes from.",
    where: "no auth on the public site",
  },
  {
    title: "No email gate",
    body: "Stripe asks for an address so it can send you its own receipt. We never ask for one, and your file does not wait behind it. We do keep the address Stripe collected, because your link lasts a day and it is the only way to find your order if you lose it.",
    where: "api/stripe-webhook.ts stores it on the order",
  },
  {
    title: "No mailing list",
    body: "Buying something here never adds you to one. There is no list to be added to, so there is nothing to unsubscribe from later.",
    where: "nothing in api/ reads that address",
  },
  {
    title: "One payment",
    body: "Each file is bought once and kept. Nothing renews, nothing is a trial, and there is no subscription to remember to cancel.",
    where: "Stripe mode: payment",
  },
  {
    title: "One thing to watch",
    body: "Your download link works for 24 hours and up to five downloads. That is the only thing we ask you to pay attention to: save the file when it arrives.",
    where: "api/download.ts",
  },
];

/** The terms on the product page's docket, after the Format row (which is
 *  read from the stored file). Which rows are bold is matched by index. */
export const TERM_ITEMS: { k: string; v: string }[] = [
  { k: "Pay by card", v: "Stripe" },
  { k: "Delivery", v: "straight away" },
  { k: "Link valid for", v: "24 hours" },
  { k: "Downloads allowed", v: "5" },
  { k: "Account created", v: "none" },
  { k: "Right to cancel", v: "ends on download" },
];
export const TERM_STRONG = [2, 3, 5];

/** The rows of the docket on /download/:token when the link has not arrived. */
export const PENDING_ROWS: { k: string; v: string }[] = [
  { k: "Payment", v: "taken by Stripe" },
  { k: "Receipt", v: "emailed by Stripe" },
  { k: "Account created", v: "none" },
];

/** The rows of the docket on /download/:token when a link fails. */
export const ERROR_ROWS: { k: string; v: string }[] = [
  { k: "Send the receipt", v: "from Stripe" },
  { k: "Or the address", v: "you paid with" },
  { k: "And the day", v: "you bought it" },
];
