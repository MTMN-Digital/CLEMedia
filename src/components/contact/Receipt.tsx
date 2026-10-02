import type { ReactNode } from "react";
import { Card } from "@/components/ui";

/* ============================================================================
   The receipt.

   The one device this page owns. It renders, live, the message exactly as the
   notification in api/contact.ts composes it: the same subject line rule
   (a partnership enquiry is titled as one, every other route is titled by its
   name), the same field order, the same "Not given" and "(no message)" fills.

   It exists because a contact form is the one place a company site asks the
   reader to trust it with something, and almost every one of them gives
   nothing back about where the words go. This shows them. Nothing here is a
   promise about speed or who answers; it is only what the code already does.

   If the API changes its subject or body format, change `subjectFor` and the
   rows below to match. The page's honesty depends on them agreeing.
   ========================================================================== */

export type RouteId = "partnership" | "educator" | "press" | "general";

export interface Draft {
  name: string;
  email: string;
  organisation: string;
  message: string;
}

/** Mirrors `notify()` in api/contact.ts. */
export function subjectFor(route: RouteId, d: Draft): { lead: string; from: string } {
  const lead = route === "partnership" ? "Partnership enquiry from" : `${route} enquiry from`;
  return { lead, from: d.name.trim() || d.email.trim() };
}

function Slot({ children, empty }: { children: string; empty: string }) {
  return children.trim()
    ? <span className="text-ink">{children}</span>
    : <span className="text-muted">{empty}</span>;
}

export function Receipt({
  route,
  draft,
  sent,
  className = "",
}: {
  route: RouteId;
  draft: Draft;
  sent: boolean;
  className?: string;
}) {
  const subj = subjectFor(route, draft);
  const rows: { k: string; v: ReactNode }[] = [
    { k: "Type", v: <span className="text-ink">{route}</span> },
    { k: "Name", v: <Slot empty="Not given">{draft.name}</Slot> },
    { k: "Email", v: <Slot empty="your address">{draft.email}</Slot> },
    { k: "Organisation", v: <Slot empty="Not given">{draft.organisation}</Slot> },
  ];

  return (
    <Card className={`card-still overflow-hidden ${className}`} as="aside">
      {/* The header strip is a tile, a step warmer than the sheet, so the
          receipt reads as a printed note rather than another white card. */}
      <div className="tile flex items-center justify-between gap-4 rounded-none border-x-0 border-t-0 px-6 py-4">
        <p className="eyebrow">{sent ? "What was sent" : "What lands with the team"}</p>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />
      </div>

      <div className="px-6 py-6 font-mono text-[13px] leading-[1.75] text-body sm:px-7">
        <p className="break-words">
          <span className="text-muted">Subject: </span>
          <span className="text-ink">{subj.lead} </span>
          {subj.from
            ? <span className="text-ink">{subj.from}</span>
            : <span className="text-muted">your name</span>}
        </p>
        <p className="break-words">
          <span className="text-muted">Reply-to: </span>
          <Slot empty="the address you give">{draft.email}</Slot>
        </p>

        <dl className="hairline mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 pt-5">
          {rows.map((r) => (
            <div key={r.k} className="contents">
              <dt className="text-muted">{r.k}:</dt>
              <dd className="break-words">{r.v}</dd>
            </div>
          ))}
        </dl>

        <p className="hairline mt-5 max-h-[14em] overflow-hidden whitespace-pre-wrap break-words pt-5 [mask-image:linear-gradient(to_bottom,black_78%,transparent)]">
          {draft.message.trim()
            ? <span className="text-ink">{draft.message}</span>
            : <span className="text-muted">(no message)</span>}
        </p>
      </div>
    </Card>
  );
}
