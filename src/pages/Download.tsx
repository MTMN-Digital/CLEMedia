import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Button, Container, Kicker, Lead, Section, TextLink } from "@/components/ui";
import { IconArrow, IconDownload, IconExternal } from "@/components/icons";
import { Docket } from "@/components/shop/Docket";
import { SITE } from "@/lib/site";

/* ============================================================================
   The download page, rebuilt 2026-10-06.

   This is the last thing the company does in a transaction, and the shop's
   whole argument is that it asks for nothing: no account, no email gate, no
   list. The cost of that argument lands here, on one screen. There is nowhere
   to come back to, so this page has to be calm, certain and impossible to
   misread, and the file has to be the largest thing on it.

   WHAT CHANGED. The terms used to sit in a tinted box with a coloured left
   border, below the fold of the sentence, in the same voice as everything
   else. They are now a docket: the same object the shop shows BEFORE a
   purchase, with the figures filled in. A buyer who read /shop recognises
   the receipt, which is the point of using one document for both.

   The expiry is now stated as a time, not as "24 hours". The API has always
   returned `expiresAt` and this page threw it away, so a buyer had to work
   out when their link died from when they thought they had paid.

   THE FUNCTIONAL CONTRACT IS UNTOUCHED. GET /api/download?token=… , the same
   four error codes, the same single signed URL, which the browser never keeps
   and which the server counts only once it has been issued.

   ONE THING THIS PAGE CANNOT DO. Stripe's success_url is /download/pending,
   carrying a session_id, and nothing maps a session_id to a download token:
   api/download.ts reads tokens only. So `pending` is handled as its own state
   and says plainly what to do, rather than rendering "We couldn't find that
   download" at somebody who has just paid. Logged in CONTENT-NEEDED.md under
   Shop and media: it needs an API change, which is not this page's to make.
   ========================================================================== */

type ErrorCode = "not_found" | "expired" | "exhausted" | "server_error";

type State =
  | { k: "loading" }
  | { k: "pending" }
  | { k: "ready"; url: string; title: string; used: number; allowed: number; expiresAt?: string }
  | { k: "error"; code: ErrorCode };

const MESSAGES = {
  not_found: {
    h: "We couldn't find that download",
    p: "The link may be wrong or incomplete. Check the link in your Stripe receipt, or get in touch and we will sort it out.",
  },
  expired: {
    h: "This link has expired",
    p: "Download links are valid for 24 hours. Get in touch with your receipt and we will issue a new one.",
  },
  exhausted: {
    h: "This link has been used up",
    p: "Each link allows five downloads. Get in touch with your receipt and we will issue a new one.",
  },
  server_error: {
    h: "Something went wrong",
    p: "That is on us, not you. Try again in a moment, and if it keeps happening let us know.",
  },
} as const;

function code_of(v: unknown): ErrorCode {
  return v === "not_found" || v === "expired" || v === "exhausted" ? v : "server_error";
}

/** "7 October, 14:30". Absolute, in the reader's own time zone: a buyer
 *  should not have to count 24 hours from a moment they have to remember. */
function expiryLabel(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function Download() {
  const { token } = useParams();
  const [state, setState] = useState<State>({ k: "loading" });
  /* Bounded: six retries two seconds apart, then the pending screen. An
     unbounded poll on a payment page is a page that never stops asking. */
  const tries = useRef(0);

  const fetchLink = useCallback(async () => {
    if (!token) {
      setState({ k: "error", code: "not_found" });
      return;
    }
    /* Two ways in. The ordinary one is a download token in the path. The other
       is the redirect Stripe performs the instant a payment succeeds, which
       lands on /download/pending carrying a session id: api/download.ts now
       resolves that to the same order, so somebody who has just paid reaches
       their file instead of a page telling them to go and find a receipt. */
    const session = token === "pending" ? new URLSearchParams(window.location.search).get("session_id") : null;
    if (token === "pending" && !session) {
      setState({ k: "pending" });
      return;
    }
    const query = session
      ? `session_id=${encodeURIComponent(session)}`
      : `token=${encodeURIComponent(token)}`;
    setState({ k: "loading" });
    try {
      const r = await fetch(`/api/download?${query}`);
      const d = await r.json();
      /* The webhook that writes the order is asynchronous and the buyer's
         redirect regularly beats it, so a 202 means "paid, not written yet".
         Retried a few times a couple of seconds apart, then left on the
         pending screen, which tells them what to do rather than spinning. */
      if (r.status === 202 || d.error === "pending") {
        if (tries.current < 6) {
          tries.current += 1;
          window.setTimeout(() => void fetchLink(), 2000);
          setState({ k: "loading" });
        } else {
          setState({ k: "pending" });
        }
        return;
      }
      if (!r.ok) {
        const code: ErrorCode = code_of(d.error);
        setState({ k: "error", code });
        return;
      }
      setState({
        k: "ready",
        url: d.url,
        title: d.title,
        used: d.downloadsUsed,
        allowed: d.downloadsAllowed,
        expiresAt: d.expiresAt,
      });
    } catch {
      setState({ k: "error", code: "server_error" });
    }
  }, [token]);

  useEffect(() => {
    void fetchLink();
  }, [fetchLink]);

  return (
    <>
      <Seo title="Your download" description="Download your purchase." path={`/download/${token ?? ""}`} noIndex />

      <Section pad={["normal", "tight"]}>
        <Container width="wide">
          {state.k === "loading" && (
            <div className="max-w-[46ch]" role="status" aria-live="polite">
              <Kicker>Payment received</Kicker>
              <h1 className="t-h1 mt-6">Getting your file ready</h1>
              <p className="t-lead mt-6 text-body">One moment. Do not close this page.</p>
            </div>
          )}

          {/* ─── The file. Two columns: the action on the left at the size it
              deserves, the terms on the right as the same docket the shop
              showed before the purchase. ─── */}
          {state.k === "ready" && (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 xl:gap-28">
              <div>
                <Kicker>Payment received</Kicker>
                <h1 className="t-display mt-6 max-w-[16ch]">{state.title} is ready.</h1>

                <Lead className="mt-7 max-w-[44ch]">
                  Save it to your device now. There is no account here, so this page is the only
                  place the file lives for you.
                </Lead>

                <div className="mt-10">
                  <Button href={state.url} size="large">
                    Download {state.title}
                    <IconDownload size={19} />
                  </Button>
                </div>

                <p className="mt-6 max-w-[46ch] text-[15.5px] leading-[1.7] text-body">
                  The file opens in a new tab. If your browser asks where to put it, anywhere you
                  will find it again is the right answer.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-rule pt-7">
                  <TextLink to="/shop">
                    Back to the shop
                    <IconArrow size={15} />
                  </TextLink>
                  <TextLink to="/contact">
                    Something wrong with it
                    <IconArrow size={15} />
                  </TextLink>
                </div>
              </div>

              <div className="lg:pt-2">
                <Docket
                  label="Your download"
                  rows={[
                    { k: "File", v: state.title },
                    { k: "Format", v: "PDF" },
                    ...(expiryLabel(state.expiresAt)
                      ? [{ k: "Link works until", v: expiryLabel(state.expiresAt) as string, strong: true }]
                      : [{ k: "Link works for", v: "24 hours", strong: true }]),
                    { k: "Downloads used", v: `${state.used} of ${state.allowed}`, strong: true },
                    { k: "Account created", v: "none" },
                  ]}
                  foot={
                    <>
                      Stripe has emailed you its own receipt for the payment. We did not create an
                      account and we have not added you to anything.
                    </>
                  }
                />
              </div>
            </div>
          )}

          {/* ─── Paid, but the link has not reached this page. ─── */}
          {state.k === "pending" && (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 xl:gap-28">
              <div>
                <Kicker>Payment received</Kicker>
                <h1 className="t-display mt-6 max-w-[14ch]">Thank you. Your payment went through.</h1>
                <Lead className="mt-7 max-w-[46ch]">
                  Your download link is not on this page. Send us the receipt Stripe has just
                  emailed you and we will put the file straight into your hands.
                </Lead>
                <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.7] text-body">
                  This is the one step in the shop that is not automatic yet, and we would rather
                  say so than leave you looking at a page that says nothing.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button to="/contact">
                    Send us your receipt
                    <IconArrow size={16} />
                  </Button>
                  <Button to="/shop" variant="quiet">
                    Back to the shop
                  </Button>
                </div>
              </div>

              <div className="lg:pt-2">
                <Docket
                  label="What you bought"
                  rows={[
                    { k: "Payment", v: "taken by Stripe" },
                    { k: "Receipt", v: "emailed by Stripe" },
                    { k: "Format", v: "PDF" },
                    { k: "Account created", v: "none" },
                  ]}
                  foot={
                    <>
                      Nothing about this purchase puts you on a mailing list. Your address sits with
                      Stripe, for its receipt.
                    </>
                  }
                />
              </div>
            </div>
          )}

          {/* ─── The three ways a link can fail, plus the server fault. ─── */}
          {state.k === "error" && (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 xl:gap-28">
              <div role="alert">
                <Kicker>Download</Kicker>
                <h1 className="t-display mt-6 max-w-[16ch]">{MESSAGES[state.code].h}</h1>
                <Lead className="mt-7 max-w-[46ch]">{MESSAGES[state.code].p}</Lead>
                <div className="mt-9 flex flex-wrap gap-3">
                  {state.code === "server_error" && (
                    <Button onClick={() => void fetchLink()}>Try again</Button>
                  )}
                  <Button to="/contact" variant={state.code === "server_error" ? "quiet" : "primary"}>
                    Get in touch
                    <IconArrow size={16} />
                  </Button>
                  <Button to="/shop" variant="quiet">
                    Back to the shop
                  </Button>
                </div>
              </div>

              {/* An error page that only apologises leaves the reader to guess
                  what to send. These three are exactly what the orders table
                  is searched by, so the list is the real one. */}
              <div className="lg:pt-2">
                <Docket
                  label="If you get in touch"
                  rows={[
                    { k: "Send the receipt", v: "from Stripe" },
                    { k: "Or the address", v: "you paid with" },
                    { k: "And the day", v: "you bought it" },
                  ]}
                  foot={
                    <>
                      That is enough to find the purchase and issue a new link. We hold no account
                      for you, so the receipt is the record, and it is worth keeping.
                    </>
                  }
                />
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* ═══ The quiet close. The same on every state: what the company is,
          and where the rest of it lives. A transaction page that ends in a
          dead end is the last impression a buyer takes away. ═══ */}
      <Section deep>
        <Container width="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="t-h2 max-w-[18ch]">While it prints</h2>
              <p className="t-lead mt-6 max-w-[48ch] opacity-85">
                The episodes behind these sheets are free to watch, and the show's own site carries
                the activities that go with them.
              </p>
            </div>
            <div>
              <Button href={SITE.showUrl}>
                Visit the show site
                <IconExternal size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
