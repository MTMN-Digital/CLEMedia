import { Settle } from "@/components/Settle";

/* ============================================================================
   The checkout nobody has to fill in.

   WHY. "What this shop does not ask you for" was five rows of title plus a
   fifty word paragraph plus a file path: the densest block on the page, on a
   site the client said had "so many words, and blocks of words". The five
   rows are still there underneath, in full, with their file paths. This sits
   above them and draws what they add up to.

   WHAT IT DRAWS. The thing this shop refuses IS a form. Almost every
   printable for a four year old costs an account, an address and a mailing
   list subscription, so the honest picture of this one is that checkout with
   nearly every field struck out, and the single field that remains. The
   struck fields are the five refusals, named in the page's own words; the one
   that stays is the one Stripe genuinely needs.

   Nothing here is a new claim. Every field is a line the page already makes
   and the code already backs.

   The strikes draw themselves left to right, one after another, and stop. A
   line being drawn THROUGH something is the one motion that means "removed",
   which is why this is worth animating at all.
   ========================================================================== */

const STRUCK = [
  "Create an account",
  "Choose a password",
  "Email address, to continue",
  "Add me to the mailing list",
  "Start a subscription",
];

export function NotAsked() {
  return (
    <Settle className="notasked" aria-label="The fields this shop does not ask for">
      <p className="notasked__head">A usual checkout</p>
      <ol className="notasked__fields">
        {STRUCK.map((f, i) => (
          <li key={f} style={{ "--i": i } as React.CSSProperties}>
            <span className="notasked__label">{f}</span>
            <span className="notasked__box" aria-hidden="true" />
            <span className="notasked__strike" aria-hidden="true" />
          </li>
        ))}
        <li className="notasked__kept">
          <span className="notasked__label">Card details</span>
          <span className="notasked__box notasked__box--live" aria-hidden="true" />
        </li>
      </ol>
      <p className="notasked__foot">
        Taken by Stripe on its own page. We never see it, and we never ask for the rest.
      </p>
    </Settle>
  );
}
