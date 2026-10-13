import { Settle } from "@/components/Settle";
import { TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";

/* ============================================================================
   Get in touch, split by who is asking.

   WHY IT CHANGED. From the client's creative director's revision of the home
   page, 2026-10-13. The band this replaces was one heading, one paragraph and
   one button addressed to nobody in particular, on a site whose brief puts
   investors and partners at the top of the audience list and broadcasters
   second. Naming the three readers is worth more than a general invitation,
   because the one that matters most now arrives knowing exactly which of the
   three he is.

   NOTHING WAS CUT. The paragraph that used to carry this band is the lead
   above the three columns, word for word.

   THREE LINKS TO ONE PAGE, DELIBERATELY. All three go to /contact, which has
   one form and five named people behind it. Anchors into a page that has no
   sections to anchor to would be three links that all scroll to the top and
   look broken; the word in the column is the wayfinding, and the form asks
   who you are.

   ON PAPER. The deck puts it on tan and so does this. The site spends its one
   deep band on the close, which is now the sign-up directly above the footer.
   ========================================================================== */

const ROUTES = [
  {
    who: "Broadcasters and platforms",
    line: "If you are interested in licensing, broadcasting or streaming the series.",
  },
  {
    who: "Schools and early-years settings",
    line: "If you would like to use our episodes and learning resources with your children.",
  },
  {
    who: "Press",
    line: "If you are writing about children's media, screen time or AI in production.",
  },
];

export function GetInTouch({ headingId }: { headingId: string }) {
  return (
    <>
      <Settle className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h2 id={headingId} className="t-display mt-6 max-w-[12ch]">
            Contact CLÉ Family Media.
          </h2>
        </div>
        <p className="t-lead lg:pb-1">
          We are open to conversations with studios, distribution partners, educators and press. If
          you are assessing the company, we would rather answer your questions directly.
        </p>
      </Settle>

      <Settle className="hairline mt-14 grid gap-x-12 gap-y-10 pt-10 md:grid-cols-3 lg:mt-20 lg:gap-x-16">
        {ROUTES.map((r) => (
          <div key={r.who}>
            <h3 className="t-h3 max-w-[16ch]">{r.who}</h3>
            <p className="t-body mt-4 max-w-[34ch]">{r.line}</p>
            <p className="mt-6">
              <TextLink to="/contact">
                Get in touch<IconArrow size={15} />
              </TextLink>
            </p>
          </div>
        ))}
      </Settle>
    </>
  );
}
