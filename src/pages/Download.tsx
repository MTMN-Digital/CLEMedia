import { type ReactNode, useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Lead, Section, TextLink, Container, Kicker, Button } from "@/components/ui";
import { IconDownload, IconArrow } from "@/components/icons";
import { ClosingLine } from "@/components/ClosingLine";
import { Docket } from "@/components/shop/Docket";
import { fileFormat, formatLabel } from "@/components/shop/catalogue";
import { COPY } from "@/components/shop/copy";
import { PENDING_ROWS, ERROR_ROWS } from "@/components/shop/lists";
import { useList, useBlock } from "@/lib/content";
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

const ERROR_CODES: ErrorCode[] = ["not_found", "expired", "exhausted", "server_error"];

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
  const t = (k: string) => useBlock("shop", k, COPY[k]);
  const paid = t("download.paid.kicker");
  const errKicker = t("download.kicker");
  const loadingTitle = t("download.loading.title");
  const loadingLead = t("download.loading.lead");
  const readyLead = t("download.ready.lead");
  const readyPdf = t("download.ready.pdf");
  const readyZip = t("download.ready.zip");
  const back = t("download.back");
  const wrong = t("download.wrong");
  const readyLabel = t("download.ready.docket.label");
  const accountK = t("download.ready.account.k");
  const accountV = t("download.ready.account.v");
  const readyFoot = t("download.ready.docket.foot");
  const pendingTitle = t("download.pending.title");
  const pendingReceipt = t("download.pending.receipt");
  const pendingLead = t("download.pending.lead");
  const pendingNote = t("download.pending.note");
  const pendingLabel = t("download.pending.docket.label");
  const pendingFoot = t("download.pending.docket.foot");
  const retry = t("download.retry");
  const contact = t("download.contact");
  const errLabel = t("download.error.docket.label");
  const errFoot = t("download.error.docket.foot");
  const pendingRows = useList("shop", "download.pending.rows", PENDING_ROWS);
  const errorRows = useList("shop", "download.error.rows", ERROR_ROWS);
  const messages = Object.fromEntries(
    ERROR_CODES.map((c) => [c, { h: t(`download.error.${c}.title`), p: t(`download.error.${c}.body`) }]),
  ) as Record<ErrorCode, { h: string; p: string }>;

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
          <Head kicker={paid} title={loadingTitle} />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <Lead className="max-w-[44ch]">{loadingLead}</Lead>
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
            kicker={paid}
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
                    {readyLead}
                  </Lead>

                  <p className="t-body mt-6 max-w-[46ch] text-body">
                    {fileFormat(state.url) === "pdf" ? readyPdf : readyZip}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t-[1.5px] border-rule pt-7">
                    <TextLink to="/shop">
                      {back}
                      <IconArrow size={15} />
                    </TextLink>
                    <TextLink to="/contact">
                      {wrong}
                      <IconArrow size={15} />
                    </TextLink>
                  </div>
                </div>

                <div className="lg:pt-2">
                  <Docket
                    label={readyLabel}
                    rows={[
                      { k: "File", v: state.title },
                      { k: "Format", v: formatLabel(fileFormat(state.url)) },
                      ...(expiryLabel(state.expiresAt)
                        ? [{ k: "Link works until", v: expiryLabel(state.expiresAt) as string, strong: true }]
                        : [{ k: "Link works for", v: "24 hours", strong: true }]),
                      { k: "Downloads used", v: `${state.used} of ${state.allowed}`, strong: true },
                      { k: accountK, v: accountV },
                    ]}
                    foot={<>{readyFoot}</>}
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
            kicker={paid}
            title={pendingTitle}
            actions={
              <>
                <Button to="/contact">
                  {pendingReceipt}
                  <IconArrow size={16} />
                </Button>
                <Button to="/shop" variant="quiet">
                  {back}
                </Button>
              </>
            }
          />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <div className={BODY_GRID}>
                <div>
                  <Lead className="max-w-[46ch]">
                    {pendingLead}
                  </Lead>
                  <p className="t-body mt-6 max-w-[46ch] text-body">
                    {pendingNote}
                  </p>
                </div>

                <div className="lg:pt-2">
                  <Docket
                    label={pendingLabel}
                    rows={pendingRows}
                    foot={<>{pendingFoot}</>}
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
            kicker={errKicker}
            title={messages[state.code].h}
            actions={
              state.code === "server_error" ? (
                <>
                  <Button onClick={() => void fetchLink()}>{retry}</Button>
                  <Button to="/contact" variant="quiet">
                    {contact}
                    <IconArrow size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/contact">
                    {contact}
                    <IconArrow size={16} />
                  </Button>
                  <Button to="/shop" variant="quiet">
                    {back}
                  </Button>
                </>
              )
            }
          />
          <Section pad={["close", "normal"]}>
            <Container width="wide">
              <div className={BODY_GRID}>
                <div role="alert">
                  <Lead className="max-w-[46ch]">{messages[state.code].p}</Lead>
                  {state.code === "server_error" && (
                    <p className="mt-7">
                      <TextLink to="/shop">
                        {back}
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
                    label={errLabel}
                    rows={errorRows}
                    foot={<>{errFoot}</>}
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
