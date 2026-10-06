import type { ReactNode } from "react";
import { Stage } from "@/components/render";

/* ============================================================================
   The printed sheet.

   The shop sells one thing: paper. Not an app, not a membership, not a
   library you log into. A file you print and put on the table. So the object
   this page is built around is a sheet of paper, drawn in CSS and lit by the
   render kit's Stage: a stack standing on a bench, stapled at the corner,
   punched for a folder, trimmed, folded, with a dot-to-dot waiting on it.

   WHY DRAWN AND NOT PHOTOGRAPHED. There are no products yet, and the brand
   kit holds no photography at all. A stock photograph of a child colouring
   would break two hard rules in the brief at once. A drawing of paper claims
   nothing about a product that does not exist: it describes the format, which
   is the one thing that is true before the first file is uploaded.

   TWO THINGS I TRIED THAT DID NOT WORK.

   Flat first: the sheet drawn with one box-shadow. That is a rectangle on a
   page, not an object in a room. It only reads as paper with the Stage under
   it: one light, a cast shadow that stops at the foot, a contact pool on the
   bench, and two sheets behind the first so the edge has something to be an
   edge against.

   Then with Stage's `backdrop` painting a wall behind it. On a page this warm
   the wall came out as a muddy grey-brown slab with rounded corners, which
   reads as an image that failed to load, and the annotations in the margin
   lost their contrast the moment they crossed onto it. So there is no wall:
   the stack stands on its bench on the page's own clay, which is lighter than
   the paper's shadow and darker than the paper, and that is all the depth it
   needs. The punch holes therefore carry the GROUND, not a wall.
   ========================================================================== */

/* A punch hole is a hole: you see the ground through it, a shade deeper for
   the thickness of the stack. */
const HOLE = "color-mix(in srgb, var(--color-paper-3) 82%, var(--color-ink))";

export interface PrintedSheetProps {
  /** What is printed on the sheet. Defaults to the blank specimen. */
  children?: ReactNode;
  /** Three punch holes down the left edge. */
  holes?: boolean;
  /** A staple through the top-left corner, which is what makes it a booklet. */
  staple?: boolean;
  /** A second and third sheet behind the first. */
  stack?: boolean;
  className?: string;
}

/* A dot-to-dot, which is a real thing on a real activity sheet and the one
   drawn mark here that a child would recognise. Twelve dots round an ellipse,
   placed by angle so the ring is even at any size. Numbers are deliberately
   absent: at this scale they would be illegible, and a sheet with unreadable
   type printed on it is the thing that makes a render look fake. */
const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 33 };
});

/** The blank specimen: a sheet with nothing on it but the things every
 *  printable has. A cut line, a shape to join up, a fold, and ruled lines. */
function Specimen() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col justify-between p-[7%] pl-[14%]">
      {/* The title band: two rules with the space between them left empty. A
          printable that does not exist has no title, so none is drawn. */}
      <div>
        <div className="h-px w-full bg-[var(--color-rule)]" />
        <div className="mt-[14%] h-px w-[58%] bg-[var(--color-rule-soft)]" />
      </div>

      {/* The cut-out, with the dot-to-dot inside it. */}
      <div
        className="relative mx-auto aspect-[4/3.2] w-[78%] rounded-[6px]"
        style={{ border: "1px dashed color-mix(in srgb, var(--color-body) 32%, transparent)" }}
      >
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: "clamp(2.5px, 1.4cqw, 6px)",
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background: "color-mix(in srgb, var(--color-body) 62%, transparent)",
            }}
          />
        ))}
      </div>

      {/* The fold, then four ruled lines. */}
      <div>
        <div
          className="h-px w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--color-rule) 0 7px, transparent 7px 13px)",
          }}
        />
        <div className="mt-[11%] space-y-[8%]">
          {[100, 100, 100, 68].map((w, i) => (
            <div key={i} className="h-px bg-[var(--color-rule-soft)]" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrintedSheet({
  children,
  holes = true,
  staple = true,
  stack = true,
  className = "",
}: PrintedSheetProps) {
  return (
    <div className={`relative aspect-[1/1.33] w-full ${className}`}>
      {/* The sheets underneath. Offset a little further each time and a shade
          deeper, so the stack has a thickness rather than a drop shadow. */}
      {stack && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[3px] border border-rule"
            style={{
              transform: "translate(2.6%, 2.1%) rotate(1deg)",
              background: "color-mix(in srgb, var(--color-raised) 84%, var(--color-sunken))",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[3px] border border-rule"
            style={{
              transform: "translate(1.3%, 1%) rotate(0.45deg)",
              background: "color-mix(in srgb, var(--color-raised) 93%, var(--color-sunken))",
            }}
          />
        </>
      )}

      {/* The top sheet. Corners stay near-sharp: paper is not rounded. */}
      <div
        className="relative h-full overflow-hidden rounded-[3px] border border-rule bg-raised"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.9), inset -14px 0 26px -22px rgba(74,53,42,0.55)",
        }}
      >
        {children ?? <Specimen />}

        {holes && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[5%] flex flex-col justify-center gap-[17%]"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  /* Container units off the stage, floored and capped: a hole
                     that scales with the sheet but never closes on a phone. */
                  width: "clamp(7px, 3.4cqw, 15px)",
                  aspectRatio: "1",
                  background: HOLE,
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.75)",
                }}
              />
            ))}
          </span>
        )}
      </div>

      {/* The staple, crossing the corner above everything else, with its own
          small shadow so it sits ON the paper rather than in it. Thin and
          long it read as a scratch, so it is short, thick enough to catch the
          light, and it crosses the corner at 45 degrees the way a stapled
          booklet is actually stapled. */}
      {staple && (
        <span
          aria-hidden="true"
          className="absolute left-[4%] top-[3%] rotate-[-45deg]"
          style={{ width: "clamp(18px, 11%, 40px)" }}
        >
          <span
            className="block rounded-[1px]"
            style={{
              height: "clamp(3px, 0.9cqw, 5px)",
              background: "linear-gradient(to bottom, #d6d0c5 0%, #a9a194 45%, #857d70 70%, #6b6459 100%)",
              boxShadow: "0 1px 2px rgba(74,53,42,0.45)",
            }}
          />
        </span>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
   The bench: the stack standing in the lit stage, with the parts of it named
   in the margin. The callouts only appear where there is room for a label to
   sit clear of the object and point at it, which is 1280px and up; under that
   the object stands on its own and the page says the same things in prose.
---------------------------------------------------------------------------- */

/** Half the sheet's own width. The callouts hang off the edges of the bench
 *  box and their leaders run from the label to this line, so a rule always
 *  ends at the paper instead of stopping in mid-air, whatever the column is
 *  doing around it. */
const HALF_SHEET = "190px";

interface Callout {
  label: string;
  /** Vertical position within the bench box. */
  top: string;
  /** Which edge the label hangs from. The leader runs toward the sheet. */
  side: "left" | "right";
}

const CALLOUTS: Callout[] = [
  { label: "Stapled fold", top: "3%", side: "left" },
  { label: "Punch holes", top: "42%", side: "left" },
  { label: "Trim edge", top: "15%", side: "right" },
  { label: "Cut line", top: "50%", side: "right" },
];

export function SheetBench({
  children,
  caption,
  annotate = true,
  className = "",
}: {
  children?: ReactNode;
  caption?: ReactNode;
  annotate?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[640px]">
        <div className="mx-auto w-full max-w-[min(100%,380px)]">
          <Stage
            ground="ledge"
            light={-34}
            tilt={7.5}
            turn={-1.8}
            roll={-0.6}
            depth={0.6}
            radius="3px"
            className="[container-type:inline-size]"
          >
            <PrintedSheet>{children}</PrintedSheet>
          </Stage>
        </div>

        {annotate && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
            {CALLOUTS.map((c) => (
              <span
                key={c.label}
                className="absolute flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted"
                style={{
                  top: c.top,
                  left: c.side === "left" ? 0 : undefined,
                  right: c.side === "right" ? 0 : undefined,
                  width: `calc(50% - ${HALF_SHEET} + 10px)`,
                }}
              >
                {/* The leader runs from the label to the paper, so it is
                    ordered after the label on the left and before it on the
                    right. */}
                <span className="h-px min-w-3 flex-1 bg-rule" style={{ order: c.side === "right" ? -1 : 1 }} />
                <span className="whitespace-nowrap">{c.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {caption && (
        <p className="mx-auto mt-6 max-w-[46ch] text-center font-mono text-[12px] leading-[1.65] text-muted">
          {caption}
        </p>
      )}
    </div>
  );
}
