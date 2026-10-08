import { AssetPlaceholder } from "@/components/AssetPlaceholder";
import { Button, Container } from "@/components/ui";
import { PreviewChrome } from "./PreviewChrome";
import { SITE } from "@/lib/site";

/** C, Corporate Warm. Type-first, tight editorial grid, rules instead of cards,
 *  colour rationed to accent, photography in disciplined framed blocks.
 *  Closest to the m.ind.coach reference and the direction this build defaults to. */
export default function PreviewC() {
  return (
    <PreviewChrome letter="C" name="Corporate Warm" note="Type-first · tight grid · colour as accent · DEFAULT">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-deep">
              Edutainment · Watch, Play, Learn
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.1rem,5.2vw,3.9rem)] leading-[1.06] text-ink">
              The company behind <span className="text-red-deep">The Pawsitive Pugs &amp; Pals</span>
              <span className="align-super text-[0.38em]">®</span>
            </h1>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-relaxed">
              An Irish children's media company making calm, purposeful content for young children,
              and for the parents watching alongside them. Built on research, made by people.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/story">The founders' story</Button>
              <Button href={SITE.showUrl} variant="quiet">Visit the show site</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AssetPlaceholder label="Framed photograph, founders or the garden" ratio="4/5" />
          </div>
        </div>
      </Container>

      {/* Rules, not cards */}
      <Container>
        <div className="border-t border-hairline">
          {[
            ["The problem", "Most children's media is built to hold attention rather than earn it. Parents get volume, not judgement."],
            ["The model", "Watch, Play, Learn: three parts that work together, not a show with activities attached."],
            ["The process", "AI assists production inside a human-led pipeline. It never authors what a child is told."],
          ].map(([t, b], i) => (
            <div key={t} className="grid gap-3 border-b border-hairline py-8 sm:grid-cols-12 sm:gap-8">
              <p className="font-display text-[14px] text-clay sm:col-span-1">0{i + 1}</p>
              <h2 className="font-display text-[1.45rem] leading-snug text-ink sm:col-span-4">{t}</h2>
              <p className="max-w-[52ch] leading-relaxed sm:col-span-7">{b}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {["Founders", "The studio", "The process"].map((t) => (
            <figure key={t}>
              <AssetPlaceholder label={`${t}, framed photograph`} ratio="3/4" tone="cream" />
              <figcaption className="mt-2.5 text-[12.5px] uppercase tracking-wider text-deep">{t}</figcaption>
            </figure>
          ))}
        </div>
      </Container>

      <section className="border-t border-hairline bg-cream py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] text-ink lg:col-span-5">
              Working with CLÉ Family Media
            </h2>
            <div className="lg:col-span-7">
              <p className="max-w-[52ch] text-[17px] leading-relaxed">
                Open to conversations with investors, broadcasters, distributors and educational
                partners. If you're assessing the company, we'd rather answer your questions directly.
              </p>
              <Button to="/contact" className="mt-7">Partnership enquiries</Button>
            </div>
          </div>
        </Container>
      </section>
    </PreviewChrome>
  );
}
