import type { HeroSet, SetContext } from "./types";

/* Placeholder while SET C is built. It renders an empty room rather than
   throwing, so the preview route is navigable from the first deploy. */
export async function soundstageSet(_ctx: SetContext): Promise<HeroSet> {
  return { dispose() {} };
}
