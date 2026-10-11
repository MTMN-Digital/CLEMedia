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
 * `.ink` itself. The source stays clean, the output stops looking machined,
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
          id="ink-hand-1oas022"
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
            result="bent"
          />

          {/* THE TOOTH. A second, much finer noise, turned into an alpha mask
              and composited INTO the bent stroke, so the ink is eaten away in
              speckles the way graphite sits on the raised grain of paper and
              misses the troughs.

              `baseFrequency` here is a grain size, not a wavelength: at 0.8 a
              cell is 1.25 user units, comfortably inside a 2 unit stroke, so
              the tooth eats the EDGE of a line rather than punching holes
              through the middle of it. Three octaves, because one octave is a
              regular dither and reads as a screen pattern.

              The colour matrix is the whole trick. It throws away colour and
              builds an alpha from the noise's own alpha: `-3.2 * A + 2.7`
              maps the noise, which clusters around 0.5, onto a value that
              clamps to 1 across most of the stroke and dips below 0 only at
              the grainiest points. Raising the 2.7 puts ink back; lowering it
              eats more. Four settings were photographed side by side at a
              560px render before this one was picked: at a gentler erosion
              the line is simply soft, and at a stronger one the washes go
              dirty and a red accent stroke dissolves into dotted pink.

              THIS NEEDS ABOUT FOUR DEVICE PIXELS OF STROKE TO READ. Below
              that there is no room inside the line for a grain cell and the
              result is noise, not graphite, which is the whole reason the
              drawings were grown. A drawing that genuinely cannot be grown
              takes `.ink--fine` below instead. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            seed="19"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 -3.2 2.7"
            result="tooth"
          />
          <feComposite in="bent" in2="tooth" operator="in" />
        </filter>

        {/* THE SAME HAND WITHOUT THE TOOTH, for a drawing that is small by
            necessity rather than by choice: a float in a margin bounded by
            the prose measure, a mark inside a card. The graphite needs room
            to sit in and these have none, so they take the wobble and stop
            there. Used through `.ink--fine`. Keeping the wobble is the point:
            a small drawing that is perfectly straight while everything around
            it is hand drawn is more obviously wrong than one without tooth. */}
        <filter
          id="ink-fine"
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
