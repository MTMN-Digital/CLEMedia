/**
 * The hand's one SVG filter, mounted once for the whole site.
 *
 * Every stroke in `components/draw` is authored on exact geometry, because
 * exact geometry is what a person can edit six months from now. Exact
 * geometry is also why the drawings read as an icon set: a perfect 2px
 * stroke with a perfect radius is the one thing no hand produces.
 *
 * So the wobble is added at paint time rather than baked into the paths. One
 * turbulence field, one displacement, applied to the whole svg at once by
 * `.ink-hand`. The source stays clean, the output stops looking machined,
 * and a drawing that needs more or less of it changes one number here.
 *
 * THE NUMBERS ARE LOAD-BEARING, and they were tuned by eye against the
 * widest drawing on the site (the production line on /ethical-ai, 1100 user
 * units across) and the smallest (the 48-unit stage marks in the team
 * cards). `baseFrequency` is the wavelength: at 0.009 the line bows in one
 * long curve, at 0.03 it stops bending and starts breaking into dashes.
 * `scale` is how far a point may move, in user units, so 2.6 is a little
 * over one stroke width.
 *
 * ONE ARTEFACT, KNOWN AND ACCEPTED. On a path that runs dead straight for
 * several hundred units the displacement crosses a steep part of the noise
 * and the line takes a visible half-pixel step rather than a bend. It is
 * invisible at 1x on an object and faintly visible on a long rule. A drawing
 * whose whole point is a ruled straight line takes `.ink--exact` instead of
 * being tuned around, because every number that hides the step on a 1100-unit
 * rule also flattens the wobble out of a 48-unit mark.
 *
 * The filter region is widened to -8%/116%: a displacement map clips at the
 * default 110% box, and the first version sheared the ends off every stroke
 * that ran to the edge of its viewBox.
 */
export function InkDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <filter
          id="ink-hand"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
