import type { CSSProperties, ElementType, ReactNode } from "react";
import "./render.css";

/* ============================================================================
   Stage: a lit space for one object to stand in.

   The site's flatness is not a colour problem, it is a lighting problem. A
   card with a hairline and a soft shadow is a sheet on a page; an object
   reads as present when it has a position in a space, a light falling on it
   from somewhere in particular, a shadow that belongs to that light, and a
   surface it is standing on. Stage supplies those four things around any
   child and nothing else.

   GEOMETRY. One light, described by an azimuth: 0 is straight above, negative
   is from the left, positive from the right. The cast shadow runs the other
   way, further and softer the deeper the object sits off the wall. The object
   leans back by `tilt` about its own foot, which is how a board stands on a
   ledge, and may turn by `turn` toward or away from the camera. All of it is
   CSS 3D on one element and a couple of box-shadows, so it costs nothing the
   page was not already paying for a card.

   MOTION. None of its own. The lift on hover and focus is a single variable,
   --lift, which this component sets on its own hover only when `lift` is on
   and which any ancestor may set instead (the studio wall sets it from the
   link, so hovering the label lifts the plate). Under reduced motion and
   without JS the stage renders its still pose, which is the one a crawler
   and a screenshot see, so the still pose is the one that has to be right.
   ========================================================================== */

export interface StageProps {
  children: ReactNode;
  /** Light azimuth in degrees. 0 is overhead, negative from the left. */
  light?: number;
  /** Lean back about the foot, in degrees. A board on a ledge is 5 to 8. */
  tilt?: number;
  /** Turn about the vertical axis, in degrees. Positive turns the right edge away. */
  turn?: number;
  /** Rotation in the picture plane, in degrees. Hand-placed is well under 1. */
  roll?: number;
  /** How far off the wall the object sits, 0 to 1. Drives shadow reach and softness. */
  depth?: number;
  /** The object stands on a surface at its foot: contact pool, shadow stops at the foot. */
  seated?: boolean;
  /** Draw a ledge under the object. Implies `seated`. */
  ground?: "ledge" | "none";
  /** Paint the wall panel behind the object. */
  backdrop?: boolean;
  /** Paint the raking light on the backdrop. Needs `backdrop`. */
  rake?: boolean;
  /** Lift on the stage's own hover and focus-within. Off by default. */
  lift?: boolean;
  /** Corner radius of the object, as a CSS length. Defaults to --radius-md. */
  radius?: string;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The CSS variables a light and a depth resolve to. Exported so a parent
 *  laying out several stages under one lamp can derive per-object values. */
export function stageVars({
  light = -32,
  tilt = 6,
  turn = 0,
  roll = 0,
  depth = 0.5,
  seated = false,
  radius,
}: Pick<StageProps, "light" | "tilt" | "turn" | "roll" | "depth" | "seated" | "radius">): CSSProperties {
  const az = clamp(light, -80, 80);
  const rad = (az * Math.PI) / 180;
  const d = clamp(depth, 0, 1);
  /* Reach of the shadow grows with depth; a seated object's shadow falls
     mostly sideways because the surface it stands on takes the rest. */
  const dist = 12 + d * 30;
  const sx = -Math.sin(rad) * dist;
  const sy = Math.cos(rad) * dist * (seated ? 0.45 : 1);
  const blur = 14 + d * 30;
  const cast = 42 - d * 10;
  const lx = 50 + Math.sin(rad) * 55;
  const vars: Record<string, string> = {
    "--az": `${az}deg`,
    "--tilt": `${tilt}deg`,
    "--turn": `${turn}deg`,
    "--roll": `${roll}deg`,
    "--sx": `${sx.toFixed(2)}px`,
    "--sy": `${sy.toFixed(2)}px`,
    "--blur": `${blur.toFixed(1)}px`,
    "--cast": `${cast.toFixed(1)}%`,
    "--lx": `${lx.toFixed(1)}%`,
  };
  if (radius) vars["--rk-radius"] = radius;
  return vars as CSSProperties;
}

export function Stage({
  children,
  light = -32,
  tilt = 6,
  turn = 0,
  roll = 0,
  depth = 0.5,
  seated = false,
  ground = "none",
  backdrop = false,
  rake = false,
  lift = false,
  radius,
  className = "",
  style,
  as: Tag = "div",
}: StageProps) {
  const sits = seated || ground === "ledge";
  const vars = stageVars({ light, tilt, turn, roll, depth, seated: sits, radius });

  return (
    <Tag
      className={`rk-stage ${className}`}
      style={{ ...vars, ...style }}
      data-backdrop={backdrop ? "" : undefined}
      data-seated={sits ? "" : undefined}
      data-ground={ground === "ledge" ? "ledge" : undefined}
      data-lift={lift ? "" : undefined}
    >
      {backdrop && rake && <span className="rk-rake" aria-hidden="true" />}
      <div className="rk-scene">
        {sits && <span className="rk-contact" aria-hidden="true" />}
        <div className="rk-object">
          <span className="rk-cast" aria-hidden="true" />
          <div className="rk-body">{children}</div>
        </div>
      </div>
      {ground === "ledge" && <span className="rk-ledge" aria-hidden="true" />}
    </Tag>
  );
}
