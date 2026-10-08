import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import { Button, Container } from "@/components/ui";
import { PreviewChrome } from "./PreviewChrome";
import { SITE } from "@/lib/site";

/** A, Garden Light. Photography leads. Full-bleed imagery, type set over image,
 *  generous air, minimal chrome. Sections breathe; the pictures carry the feeling. */
export default function PreviewA() {
  return (
    <PreviewChrome letter="A" name="Garden Light" note="Photography led · full-bleed · generous white space">
      {/* Full-bleed hero with type over image */}
      <section className="relative">
        <AssetPlaceholder label="Full-bleed garden hero, landscape, high resolution" ratio="16/9" className="!border-0 min-h-[70vh]" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-12 sm:pb-16">
            <div className="max-w-[20ch] bg-paper/92 p-7 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-deep">
                Watch, Play, Learn
              </p>
              <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
                Made at a child's pace
              </h1>
            </div>
          </Container>
        </div>
      </section>

      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <p className="font-display text-[clamp(1.5rem,3vw,2.1rem)] leading-snug text-ink">
            CLÉ Family Media makes calm, purposeful content for young children, and for the parents
            watching alongside them.
          </p>
          <div className="space-y-5 font-body">
            <p>
              Most children's media is built to hold attention rather than earn it. We make the other
              kind: slower, warmer, with an educational spine and a production process we're willing
              to show you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button to="/story">The founders' story</Button>
              <Button href={SITE.showUrl} variant="quiet">The show site</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Alternating full-bleed image / text */}
      {["Watch", "Play", "Learn"].map((step, i) => (
        <section key={step} className={`grid items-center lg:grid-cols-2 ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
          <AssetPlaceholder label={`${step}, supporting photograph`} ratio="4/3" className="!border-0" tone={i % 2 ? "cream" : "clay"} />
          <div className="px-6 py-14 sm:px-12 lg:px-16 lg:[direction:ltr]">
            <p className="font-display text-[15px] text-deep">0{i + 1}</p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">{step}</h2>
            <p className="mt-4 max-w-[38ch] leading-relaxed">
              {step === "Watch" && "Calm, purposeful animation, paced for how young children actually take things in."}
              {step === "Play" && "Interactive follow-on that turns a story into something a child does, not only sees."}
              {step === "Learn" && "An educational spine built with early-years specialists, not bolted on afterwards."}
            </p>
          </div>
        </section>
      ))}

      <section className="bg-cream py-20">
        <Container>
          <div className="max-w-[46ch]">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">Working with us</h2>
            <p className="mt-4 text-[17px] leading-relaxed">
              Open to conversations with investors, broadcasters, distributors and educational partners.
            </p>
            <Button to="/contact" className="mt-7">Partnership enquiries</Button>
          </div>
        </Container>
      </section>
    </PreviewChrome>
  );
}
