interface Props {
  /** What belongs here, in plain words. Shown on the block. */
  label: string;
  /**
   * The CONTENT-NEEDED.md row this traces to.
   * Deliberately NOT named `ref`: React reserves that, and a string value is
   * treated as a legacy string ref, which throws and unmounts the tree.
   */
  source?: string;
  /** CSS aspect-ratio, for example "16/9". */
  ratio?: string;
  className?: string;
  tone?: "clay" | "cream";
  rounded?: string;
}

/**
 * A stand-in for an image that has not been supplied yet.
 *
 * Every image on this site has to be real: the brand kit contains no
 * photographs, and both stock and generated imagery are ruled out. These
 * blocks hold the exact dimensions of the real asset so that dropping it in
 * later changes no layout.
 *
 * Loud on purpose. A subtle placeholder is one that ships.
 */
export function AssetPlaceholder({
  label,
  source,
  ratio,
  className = "",
  tone = "clay",
  rounded = "rounded-[var(--radius-lg)]",
}: Props) {
  const fill = tone === "clay" ? "bg-paper-3" : "bg-raised";
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}. This image has not been supplied yet.`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      className={`${fill} ${rounded} relative flex max-w-full items-center justify-center overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #1A1614 0 1px, transparent 1px 11px)" }}
      />
      <div className="relative mx-4 max-w-[28ch] px-5 py-4 text-center">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70">
          Image needed
        </p>
        <p className="mt-2 font-body text-[13.5px] font-semibold leading-snug text-ink">{label}</p>
        {source && (
          <p className="mt-1.5 font-body text-[10px] uppercase tracking-[0.14em] text-ink/55">{source}</p>
        )}
      </div>
    </div>
  );
}
