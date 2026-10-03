
/**
 * Illustrative graphics, drawn here rather than sourced.
 *
 * Built from the brand palette and the show's own motifs so they read as one
 * family rather than decoration bought in. Everything here is aria-hidden:
 * none of it carries meaning a reader would miss, and all of it sits beside
 * real text.
 *
 * CUT BACK 2026-10-03. This file used to carry PawPrint, WaveDivider,
 * HumanLedDiagram, EthicsOrbit and four Route illustrations. None had an
 * importer left once the pages were rebuilt, and two of them were actively
 * dangerous to leave lying about:
 *
 *   HumanLedDiagram held its own copy of the six review stages, and it was
 *   WRONG. It dropped "Quality and suitability" and promoted the tool step to
 *   a peer stage, so the file disagreed with the client's own account of how
 *   an episode is made. A stale second copy of a fact this site is built on is
 *   worse than no copy.
 *
 *   HumanLedDiagram and EthicsOrbit both animated forever, and EthicsOrbit used
 *   gradients. Both are against the house rules the rest of the site follows.
 *
 * The six stages now live in exactly two places: ProductionLine on the
 * Responsible AI page, which owns the full account, and the home page's review
 * section, which carries the titles and the names only.
 */

export function Bluebell({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 40 64" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20 62V20" />
      <path d="M20 26c-6 0-9-3-10-8 5-1 9 2 10 8z" fill="currentColor" fillOpacity="0.16" />
      <path d="M20 34c6 0 9-3 10-8-5-1-9 2-10 8z" fill="currentColor" fillOpacity="0.16" />
      <g fill="currentColor" fillOpacity="0.28">
        <path d="M13 12c0-3.6 2.4-6 5-6s5 2.4 5 6c0 3.2-2 6-5 7.4C15 18 13 15.2 13 12z" />
      </g>
      <path d="M13 12c0-3.6 2.4-6 5-6s5 2.4 5 6c0 3.2-2 6-5 7.4C15 18 13 15.2 13 12z" />
      <path d="M28 20c0-2.8 1.9-4.7 3.9-4.7s3.9 1.9 3.9 4.7c0 2.5-1.6 4.7-3.9 5.8-2.3-1.1-3.9-3.3-3.9-5.8z"
        fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

/** A loose scattering of paws, used as a very quiet section watermark. */
export function PawTrail({ className = "" }: { className?: string }) {
  const paws = [
    { x: 4, y: 58, r: -22, s: 0.7 }, { x: 22, y: 30, r: 8, s: 0.9 },
    { x: 44, y: 62, r: -12, s: 0.62 }, { x: 66, y: 26, r: 18, s: 0.85 },
    { x: 86, y: 58, r: -6, s: 0.72 },
  ];
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {paws.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})`} opacity={0.5 + i * 0.06}>
          <ellipse cx="0" cy="4" rx="5" ry="4.3" fill="currentColor" />
          <ellipse cx="-5.4" cy="-1.4" rx="2.2" ry="2.8" fill="currentColor" />
          <ellipse cx="-1.8" cy="-4.6" rx="2.1" ry="2.7" fill="currentColor" />
          <ellipse cx="2.2" cy="-4.6" rx="2.1" ry="2.7" fill="currentColor" />
          <ellipse cx="5.8" cy="-1.4" rx="2.2" ry="2.8" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
