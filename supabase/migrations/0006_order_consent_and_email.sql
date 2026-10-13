-- Two columns the shop needed before it could take real money.
--
-- payer_email
--
-- The webhook stored the session id, the product and the token, and nothing
-- that identifies the buyer. Stripe collects an email for its own receipt, so
-- the address exists; it simply was not kept. A customer who closes the tab
-- before saving the PDF, or who comes back on day two, could not be found at
-- all: there is no account on this site, the download token is the only
-- handle on the order, and it lives in an email Stripe sent, not in anything
-- we can search. Keeping the address makes recovery a database lookup instead
-- of an apology.
--
-- Not a mailing list. The brief is explicit that a purchase never signs
-- anyone up for anything, and nothing reads this column except a human
-- looking for one specific lost order.
--
-- withdrawal_consent_at
--
-- Article 16(m) of the Consumer Rights Directive takes the right of
-- withdrawal away from digital content supplied immediately ONLY where the
-- consumer gave prior express consent and acknowledged losing the right. The
-- terms page already said the right ends once the download begins, which is
-- the correct rule and not the required step: a sentence in a policy is not
-- consent, and the trader is the one who has to be able to show it was given.
--
-- The timestamp is written by the server when the checkout session is
-- created, never taken from the browser, and the session cannot be created
-- without it. So an order either carries a consent time or does not exist.
alter table public.orders
  add column if not exists payer_email          text,
  add column if not exists withdrawal_consent_at timestamptz;

-- Finding one lost order by the address the buyer used. Not unique: the same
-- person may buy more than one printable.
create index if not exists orders_payer_email_idx on public.orders (payer_email);

-- No policy changes. `orders` has no public policy at all and this adds
-- personal data to a table that was already admin-read-only, written solely
-- by the webhook through the service role.
