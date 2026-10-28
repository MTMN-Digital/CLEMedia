import { Link } from "react-router-dom";
import { Settle } from "@/components/Settle";
import { Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   "The documents": the shelf at the foot of every document page.

   The site plan puts the Responsible AI position first in this index so it
   keeps the company of the legal documents. One component on all four routes,
   so the four shelves can never disagree. The one in hand is marked, not
   linked.
   ========================================================================== */

export type DocumentId = "privacy" | "ethical-ai" | "cookies" | "terms";

export const DOCUMENTS: { id: DocumentId; description: string; title: string; path: string }[] = [
  {
    id: "ethical-ai",
    path: "/ethical-ai",
    title: "Responsible AI",
    description: "How CLÉ Family Media uses Runway and ElevenLabs inside a human-led production process.",
  },
  { id: "privacy", path: "/privacy", title: "Privacy policy", description: "How CLÉ Family Media handles personal data." },
  {
    id: "terms",
    path: "/terms",
    title: "Terms",
    description: "The terms covering use of this site and the sale of digital goods.",
  },
  { id: "cookies", path: "/cookies", title: "Cookie policy", description: "What this site stores in your browser and why." },
];

export function DocumentsShelf({ current }: { current: DocumentId }) {
  return (
    <Section pad={["none", "normal"]} labelledBy="shelf-h">
      <Container width="wide">
        <div className="hairline pt-12 sm:pt-14">
          <h2 id="shelf-h" className="t-h2 max-w-[20ch]">
            The documents
          </h2>

          <Settle as="ul" className="mt-8">
            {DOCUMENTS.map((o) => {
              const here = o.id === current;
              const inner = (
                <>
                  <span className="flex items-start justify-between gap-5">
                    <span className="text-[17px] font-semibold text-ink">{o.title}</span>
                    {!here && (
                      <span className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-red-deep sm:hidden">
                        <IconArrow size={15} />
                      </span>
                    )}
                  </span>
                  <span className="t-body max-w-[52ch] text-body">{o.description}</span>
                  <span className="hidden items-center gap-2 font-mono text-[14.5px] text-muted sm:flex sm:justify-end">
                    {here ? (
                      "You are reading this"
                    ) : (
                      <span className="transition-colors group-hover:text-red-deep">
                        <IconArrow size={15} />
                      </span>
                    )}
                  </span>
                  {here && <span className="font-mono text-[14.5px] text-muted sm:hidden">You are reading this</span>}
                </>
              );
              const cls =
                "grid items-start gap-x-10 gap-y-2 py-6 sm:grid-cols-[minmax(0,0.5fr)_minmax(0,1.1fr)_minmax(0,0.3fr)] sm:py-7";
              return (
                <li key={o.id} className="hairline last:border-b-[1.5px] last:border-rule">
                  {here ? (
                    <div className={cls} aria-current="page">
                      {inner}
                    </div>
                  ) : (
                    <Link to={o.path} className={`${cls} group`}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </Settle>

          <p className="t-body mt-9 max-w-[58ch] text-body">
            Anything in these documents you want put differently, or a question about what we hold:{" "}
            <TextLink to="/contact">write to us</TextLink>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
