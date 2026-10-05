import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { HeroShot } from "@/components/home/HeroShot";
import { Container, Section } from "@/components/ui";
import type { SetFactory } from "@/components/home/hero3d/sets/types";

/* ============================================================================
   The three hero directions, side by side on the real deploy.

   Each is the same shot, the same camera move and the same words; the only
   thing that changes is the room. That is deliberate. Comparing three
   different moves AND three different rooms at once answers neither question,
   and the move is already settled: a push-in through a space, nothing
   rotating. What is being chosen here is the space.
   ========================================================================== */

const SETS: Record<string, { name: string; blurb: string; load: () => Promise<SetFactory> }> = {
  a: {
    name: "A. Working studio",
    blurb:
      "The room the thing was shot in. A cyclorama cove, a lighting rig overhead with its lamps, a flag, a C-stand and cable on the floor. The kit is in shot rather than hidden.",
    load: () => import("@/components/home/hero3d/sets/studio").then((m) => m.studioSet),
  },
  b: {
    name: "B. Garden miniature",
    blurb:
      "The show's own world built as a physical miniature: moss, bluebells, the cottage far off and soft. Shot shallow, the way a tabletop set is shot.",
    load: () => import("@/components/home/hero3d/sets/garden").then((m) => m.gardenSet),
  },
  c: {
    name: "C. The garden, on the studio floor",
    blurb:
      "Both at once, and the most honest of the three: the miniature garden standing on the sweep, with the rig over it and the stands around it. A made thing being made.",
    load: () => import("@/components/home/hero3d/sets/soundstage").then((m) => m.soundstageSet),
  },
};

export default function HeroPreview() {
  const { which = "a" } = useParams();
  const entry = SETS[which] ?? SETS.a;
  const load = useCallback(() => entry.load(), [entry]);

  return (
    <>
      <Seo path={`/preview/hero/${which}`} title={`Hero ${which.toUpperCase()}`} description="Hero direction preview." noIndex />
      <HeroShot key={which} set={load} name={entry.name} />
      <Section labelledBy="pv-h">
        <Container>
          <h2 id="pv-h" className="t-h2 max-w-[20ch]">{entry.name}</h2>
          <p className="t-body mt-5 max-w-[62ch] text-body">{entry.blurb}</p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-deep">
            {Object.keys(SETS).map((k) => (
              <a key={k} href={`/preview/hero/${k}`} className="mr-5 underline underline-offset-4">
                Hero {k.toUpperCase()}
              </a>
            ))}
          </p>
        </Container>
      </Section>
    </>
  );
}
