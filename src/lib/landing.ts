/**
 * Whether what the reader is looking at came from HTML the build prerendered
 * (scripts/prerender.mjs): true from the first load until the first
 * client-side navigation.
 *
 * It exists for the reveals. Settle and Wipe hide a group and then play it in,
 * which is right for a page React builds from nothing. On a prerendered page
 * the group has already been painted from the HTML, so arming it would flash
 * content away and fade it back. Anything on screen at that moment is left as
 * painted; everything below the fold still plays when it is scrolled to.
 */
export const landing = {
  prerendered: typeof document !== "undefined" && !!document.getElementById("root")?.firstElementChild,
};

/** True for an element the reader can already see in prerendered HTML. */
export function alreadyPainted(el: Element | null): boolean {
  return landing.prerendered && !!el && el.getBoundingClientRect().top < window.innerHeight;
}
