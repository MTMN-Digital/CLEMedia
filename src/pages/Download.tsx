import { type ReactNode, useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Lead, Section, TextLink, Container, Kicker, Button } from "@/components/ui";
import { IconDownload, IconArrow } from "@/components/icons";
import { ClosingLine } from "@/components/ClosingLine";
import { Docket } from "@/components/shop/Docket";
import { fileFormat, formatLabel } from "@/components/shop/catalogue";
import { COPY } from "@/components/shop/copy";
import { useBlock } from "@/lib/content";
import { SITE } from "@/lib/site";

/* ============================================================================
   The download page, rebuilt 2026-10-06, made a receipt on 2026-10-28
   (docs/SUBPAGE-PLANS-2026-10-28.md, "## shop", 4.4).

   This is the last thing the company does in a transaction, and the shop's
   whole argument is that it asks for nothing: no account, no email gate, no
   list. The cost of that argument lands here, on one screen. There is nowhere
   to come back to, so this page has to be calm, certain and impossible to
   misread, and the file has to be the largest thing on it.

   TYPE ONLY. Every state opens on a status line, the state's sentence as a
   plain h1, and in the ready state the download button directly under it,
   before anything else. Then the two-column body: the sentence and what to
   do on the left, the docket on the right, which is the same object the
   product page showed before the purchase, with the figures filled in. A
   buyer who read /shop/:slug recognises the receipt.

   The expiry is stated as a time, not as "24 hours". The API returns
   `expiresAt`; the label is the only date on the page and it is the link's
   own.

   THE FUNCTIONAL CONTRACT IS UNTOUCHED. GET /api/download?token=… , the same
   four error codes, the same single signed URL, which the browser never keeps
   and which the server counts only once it has been issued. The six-try poll
   for a webhook that has not written the order yet is as it was.

   ONE THING THIS PAGE CANNOT DO. Stripe's success_url is /download/pending,
   carrying a session_id; where nothing maps it to a token the `pending`
   state says plainly what to do, rather than rendering "We couldn't find
   that download" at somebody who has just paid.

   THE CLOSE. The navy band that used to end this page is gone from every
   subpage; its one fact survives as the closing line, with the show site as
   the one link.
   ========================================================================== */

type ErrorCode = "exhausted" | "server_error" | "not_found" | "expired";

type State =
  | { k: "loading" }
  | { k: "pending" }
  | { url: string; used: number; expiresAt?: string; k: "ready"; allowed: number; title: string }
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

/* The two column body every settled state shares: the sentence and what to
   do on the left, the docket on the right. */
const BODY_GRID = "grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 xl:gap-28";

/** The opening of every state: a status, the sentence as a plain h1, and
 *  the state's action directly under it. Type only. */
function Head({ kicker, title, actions }: { title: string; kicker: string; actions?: ReactNode }) {
  return (
    <Section labelledBy="download-h" pad={["normal", "close"]}>
      <Container width="wide">
        <Kicker className="eyebrow-sm">{kicker}</Kicker>
        <h1 id="download-h" className="t-h1 mt-6 max-w-[20ch]">{title}</h1>
        {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
      </Container>
    </Section>
  );
}

export default function Download() {
  const { token } = useParams();
  const [state, setState] = useState<State>({ k: "loading" });
  /* Bounded: six retries two seconds apart, then the pending screen. An
     unbounded poll on a payment page is a page that never stops asking. */
  const tries = useRef(0);
  const closeLine = useBlock("shop", "download.close.line", COPY["download.close.line"]);
  const closeLink = useBlock("shop", "download.close.link", COPY["download.close.link"]);

  const fetchLink = useCallback(async () => {
    if (!token) {
      setState({ k: "error", code: "not_found" });
      return;
    }
    /* Two ways in. The ordinary one is a download token in the path. The other
       is the redirect Stripe performs the instant a payment succeeds, which
       lands on /download/pending carrying a session id: api/download.ts
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

      {/* ─── Getting the link. Announced, because the state changes under the
          reader without anything being clicked. ─── */}
      {state.k === "loading" && (
        <div role="status" aria-live="polite">
          <Head kicker="Payment received" title="Getting your file ready" />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <Lead className="max-w-[44ch]">One moment. Do not close this page.</Lead>
            </Container>
          </Section>
        </div>
      )}

      {/* ─── The file. The download button is the first thing under the
          headline on every screen. Then the one sentence that matters, and
          the terms on the right as the same docket the product page showed
          before the purchase. ─── */}
      {state.k === "ready" && (
        <>
          <Head
            kicker="Payment received"
            title={`${state.title} is ready.`}
            actions={
              <Button href={state.url} size="large" className="w-full justify-center sm:w-auto">
                Download {state.title}
                <IconDownload size={19} />
              </Button>
            }
          />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <div className={BODY_GRID}>
                <div>
                  <Lead className="max-w-[44ch]">
                    Save it to your device now. There is no account here, so this page is the only
                    place the file lives for you.
                  </Lead>

                  <p className="t-body mt-6 max-w-[46ch] text-body">
                    {fileFormat(state.url) === "pdf"
                      ? "The file opens in a new tab. If your browser asks where to put it, anywhere you will find it again is the right answer."
                      : "The file is a zip folder with the PDFs inside. If your browser asks where to put it, anywhere you will find it again is the right answer, and opening the folder unpacks the books and sheets."}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t-[1.5px] border-rule pt-7">
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
                      { k: "Format", v: formatLabel(fileFormat(state.url)) },
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
            </Container>
          </Section>
        </>
      )}

      {/* ─── Paid, but the link has not reached this page. ─── */}
      {state.k === "pending" && (
        <>
          <Head
            kicker="Payment received"
            title="Thank you. Your payment went through."
            actions={
              <>
                <Button to="/contact">
                  Send us your receipt
                  <IconArrow size={16} />
                </Button>
                <Button to="/shop" variant="quiet">
                  Back to the shop
                </Button>
              </>
            }
          />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <div className={BODY_GRID}>
                <div>
                  <Lead className="max-w-[46ch]">
                    Your download link is not on this page. Send us the receipt Stripe has just
                    emailed you and we will put the file straight into your hands.
                  </Lead>
                  <p className="t-body mt-6 max-w-[46ch] text-body">
                    This is the one step in the shop that is not automatic yet, and we would rather
                    say so than leave you looking at a page that says nothing.
                  </p>
                </div>

                <div className="lg:pt-2">
                  <Docket
                    label="What you bought"
                    rows={[
                      { k: "Payment", v: "taken by Stripe" },
                      { k: "Receipt", v: "emailed by Stripe" },
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
            </Container>
          </Section>
        </>
      )}

      {/* ─── The three ways a link can fail, plus the server fault. The
          server fault keeps "Try again" and "Get in touch" as its actions
          and puts the shop link under the message; the other three keep the
          shop as their second action. ─── */}
      {state.k === "error" && (
        <>
          <Head
            kicker="Download"
            title={MESSAGES[state.code].h}
            actions={
              state.code === "server_error" ? (
                <>
                  <Button onClick={() => void fetchLink()}>Try again</Button>
                  <Button to="/contact" variant="quiet">
                    Get in touch
                    <IconArrow size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/contact">
                    Get in touch
                    <IconArrow size={16} />
                  </Button>
                  <Button to="/shop" variant="quiet">
                    Back to the shop
                  </Button>
                </>
              )
            }
          />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <div className={BODY_GRID}>
                <div role="alert">
                  <Lead className="max-w-[46ch]">{MESSAGES[state.code].p}</Lead>
                  {state.code === "server_error" && (
                    <p className="mt-7">
                      <TextLink to="/shop">
                        Back to the shop
                        <IconArrow size={15} />
                      </TextLink>
                    </p>
                  )}
                </div>

                {/* An error page that only apologises leaves the reader to
                    guess what to send. These three are exactly what the
                    orders table is searched by, so the list is the real one. */}
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
            </Container>
          </Section>
        </>
      )}

      {/* ═══ The close, the same on every state: one line and one link, then
          the footer. ═══ */}
      <Section as="div" pad={["tight", "open"]}>
        <Container width="wide">
          <ClosingLine rule link={{ href: SITE.showUrl, label: closeLink }}>
            {closeLine}
          </ClosingLine>
        </Container>
      </Section>
    </>
  );
}
