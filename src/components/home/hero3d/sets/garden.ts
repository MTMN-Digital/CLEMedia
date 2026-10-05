import type { HeroSet, SetContext } from "./types";

/* Placeholder while SET B is built. It renders an empty room rather than
   throwing, so the preview route is navigable from the first deploy. */
export async function gardenSet(_ctx: SetContext): Promise<HeroSet> {
  return { dispose() {} };
}
