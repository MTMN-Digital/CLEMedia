import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import { Button, Container } from "@/components/ui";
import { PreviewChrome } from "./PreviewChrome";
import { SITE } from "@/lib/site";

/** B, Watercolour Studio. Crafted and illustrative. Paper ground, soft washes
 *  between sections, torn edges, type-led hero on a painted backdrop. */

/* Paper grain + wash, drawn in CSS rather than shipped as an image so it costs
   nothing and scales. No gradients used as decoration, these are textures. */
const paper: React.CSSProperties = {
  backgroundColor: "#FBF7F0",
  backgroundImage:
    "radial-gradient(circle at 18% 22%, rgba(188,158,134,0.18) 0 38%, transparent 60%)," +
    "radial-gradient(circle at 82% 8%, rgba(181,226,246,0.20) 0 30%, transparent 55%)," +
    "radial-gradient(circle at 60% 88%, rgba(230,212,188,0.34) 0 42%, transparent 65%)",
};

function TornRule() {
  return (
    <svg viewBox="0 0 1200 22" preserveAspectRatio="none" className="block h-5 w-full text-cream" aria-hidden="true">
      <path
        d="M0 12 Q 60 4 120 11 T 240 12 T 360 8 T 480 14 T 600 9 T 720 13 T 840 7 T 960 13 T 1080 9 T 1200 12 L1200 22 L0 22 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function PreviewB() {
  return (
    <PreviewChrome letter="B" name="Watercolour Studio" note="Illustrative · paper texture · washes between sections">
      <div style={paper}>
        <Container className="py-24 sm:py-32">
          <div className="mx-auto max-w-[34ch] text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-deep">
              Watch · Play · Learn
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.06] text-ink">
              Made by hand, made by people
            </h1>
            <p className="mx-auto mt-6 max-w-[42ch] text-[17px] leading-relaxed text-slate">
              CLÉ Family Media is a small Irish studio making calm, purposeful content for young
              children, and being honest about how it is made.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/story">Our story</Button>
              <Button href={SITE.showUrl} variant="quiet">The show</Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-[240px] opacity-90">
            <AssetPlaceholder label="Painted character accent, small, supporting" ratio="1/1" tone="cream" className="!border-0" />
          </div>
        </Container>
      </div>

      <TornRule />

      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-[62ch] text-center">
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] text-ink">
              Most children's media is built to hold attention, not to earn it
            </h2>
            <p className="mt-5 leading-relaxed text-slate">
              Parents are handed an enormous amount of content and very little help judging any of
              it. We make the slower kind, with an educational spine and a process we'll show you.
            </p>
          </div>
        </Container>
      </section>

      <div className="rotate-180"><TornRule /></div>

      <div style={paper}>
        <Container className="py-20">
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              ["Watch", "Calm animation, paced for how young children take things in."],
              ["Play", "Interactive follow-on: something a child does, not only sees."],
              ["Learn", "An educational spine, built with specialists from the start."],
            ].map(([step, body], i) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-5 max-w-[120px]">
                  <AssetPlaceholder label={`${step} icon`} ratio="1/1" tone="cream" className="!border-0 rounded-full" />
                </div>
                <p className="font-display text-[13px] text-deep">0{i + 1}</p>
                <h3 className="mt-1 font-display text-[1.4rem] text-ink">{step}</h3>
                <p className="mx-auto mt-2.5 max-w-[26ch] text-[14.5px] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <TornRule />

      <section className="bg-cream py-20">
        <Container>
          <div className="mx-auto max-w-[44ch] text-center">
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] text-ink">Working with us</h2>
            <p className="mt-4 leading-relaxed">
              Investors, broadcasters, distributors and educational partners. We would rather answer
              your questions directly.
            </p>
            <Button to="/contact" className="mt-7">Get in touch</Button>
          </div>
        </Container>
      </section>
    </PreviewChrome>
  );
}
