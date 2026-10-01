import type { ReactNode } from "react";
import { Figure } from "@/components/Figure";
import type { AssetKey } from "@/lib/brand";

/**
 * Illustrative graphics, drawn here rather than sourced.
 *
 * The brand kit holds no photography, and both stock and generated imagery are
 * ruled out on this site, so visual interest has to come from drawing. These
 * are built from the brand palette and the show's own motifs (paws, bluebells,
 * felted roundness) so they read as one family rather than decoration bought
 * in.
 *
 * Everything here is aria-hidden. None of it carries meaning a reader would
 * miss, and all of it sits beside real text.
 */

/* ── Decorative motifs ─────────────────────────────────────────────────── */

export function PawPrint({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <ellipse cx="16" cy="21" rx="7.5" ry="6.5" fill="currentColor" />
      <ellipse cx="7.5" cy="13" rx="3.4" ry="4.2" fill="currentColor" transform="rotate(-18 7.5 13)" />
      <ellipse cx="13.2" cy="8.4" rx="3.2" ry="4.1" fill="currentColor" transform="rotate(-7 13.2 8.4)" />
      <ellipse cx="19.4" cy="8.4" rx="3.2" ry="4.1" fill="currentColor" transform="rotate(7 19.4 8.4)" />
      <ellipse cx="25" cy="13" rx="3.4" ry="4.2" fill="currentColor" transform="rotate(18 25 13)" />
    </svg>
  );
}

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

/** Soft torn-paper divider between sections. */
export function WaveDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true"
      className={`block h-8 w-full sm:h-12 ${flip ? "rotate-180" : ""} ${className}`}>
      <path
        d="M0 26 C 160 6, 300 40, 460 28 S 760 4, 920 22 S 1240 44, 1440 20 L1440 48 L0 48 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Responsible AI: the centrepiece ───────────────────────────────────── */

function PersonGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  );
}

function ToolGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h2.4l2-5 3 10 2.6-7 2 4H21" />
    </svg>
  );
}

interface Node {
  label: string;
  who: string;
  kind: "person" | "tool" | "gate";
  /* Portraits, supplied 2026-10-01. A stage that names a person now shows that
     person: on the page whose whole claim is that a human is accountable at
     each step, a generic head-and-shoulders glyph was arguing the opposite. */
  faces?: AssetKey[];
}

const FLOW: Node[] = [
  { label: "Concept and story", who: "Conor and Alan", kind: "person", faces: ["person.conor", "person.alan"] },
  { label: "Script and direction", who: "Alan", kind: "person", faces: ["person.alan"] },
  { label: "Visual and voice production", who: "Runway · ElevenLabs", kind: "tool" },
  { label: "Educational review", who: "Paula Walshe PhD", kind: "person", faces: ["person.paula"] },
  { label: "Parent and early years review", who: "Lydia and Kirstie", kind: "person", faces: ["person.lydia", "person.kirstie"] },
  { label: "Final approval", who: "The team", kind: "gate" },
];

/** Up to two portraits, overlapped, at the size the glyph they replace used. */
function Faces({ assets }: { assets: AssetKey[] }) {
  return (
    <span className="flex shrink-0 items-center -space-x-2.5">
      {assets.slice(0, 2).map((a) => (
        <span key={a} className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-[var(--color-raised)]">
          <Figure asset={a} rounded="rounded-full" className="aspect-square" sizes="40px" />
        </span>
      ))}
    </span>
  );
}

/**
 * The shape of the argument, drawn: people at both ends, the tool in the
 * middle, and a gate at the finish that can send the work back. The returning
 * arrow is the whole point of the diagram, so it is the one element that keeps
 * moving.
 */
export function HumanLedDiagram() {
  return (
    <div className="relative">
      <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FLOW.map((n, i) => {
          const tone =
            n.kind === "tool"
              ? "bg-pups/45 text-ink"
              : n.kind === "gate"
                ? "bg-red/10 text-ink"
                : "bg-white/70 text-ink";
          const ring =
            n.kind === "tool"
              ? "ring-1 ring-inset ring-[#7FB8D6]/50"
              : n.kind === "gate"
                ? "ring-1 ring-inset ring-red/35"
                : "hairline-ring";
          return (
            <li
              key={n.label}
              className={`relative overflow-hidden rounded-[var(--radius-lg)] p-5 backdrop-blur-sm ${tone} ${ring}`}
              style={{ animation: `node-in 620ms var(--ease-house) both ${i * 90}ms` }}
            >
              <div className="flex items-start gap-3">
                {n.faces ? (
                  <Faces assets={n.faces} />
                ) : (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${
                      n.kind === "tool" ? "bg-white/70 text-[#2C6E8F]" : "bg-red/10 text-red-deep"
                    }`}
                  >
                    {n.kind === "tool" ? <ToolGlyph /> : <PersonGlyph size={22} />}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {n.kind === "tool" ? "Tool assists" : n.kind === "gate" ? "Gate" : "Person decides"}
                  </p>
                  <h3 className="mt-1 font-body text-[15px] font-semibold leading-snug text-ink">
                    {n.label}
                  </h3>
                  <p className="mt-0.5 font-body text-[13px] text-body">{n.who}</p>
                </div>
              </div>

              {n.kind === "gate" && (
                <div className="mt-4 flex items-center gap-2 border-t border-red/20 pt-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                    className="shrink-0 text-red-deep" aria-hidden="true"
                    style={{ animation: "gate-turn 3.2s var(--ease-house) infinite" }}>
                    <path d="M3 10a7 7 0 0 1 12-5l4 3" />
                    <path d="M19 3v5h-5" />
                    <path d="M21 14a7 7 0 0 1-12 5l-4-3" />
                    <path d="M5 21v-5h5" />
                  </svg>
                  <p className="font-body text-[12.5px] font-medium text-red-deep">
                    A review can send the work back. A release can wait.
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Hero motif for the Responsible AI page: a small tool orbit held inside a
 * larger human ring. The ring is unbroken; the orbit is dashed and moving.
 */
export function EthicsOrbit({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="orbit-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A32E32" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#BC9E86" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="orbit-core" cx="0.42" cy="0.36" r="0.7">
          <stop offset="0%" stopColor="#E6D4BC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#BC9E86" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="160" r="128" fill="url(#orbit-core)" opacity="0.5" />
      <circle cx="160" cy="160" r="128" stroke="url(#orbit-ring)" strokeWidth="2.4" />
      <circle cx="160" cy="160" r="104" stroke="#8E2428" strokeOpacity="0.22" strokeWidth="1.2" />

      <g style={{ transformOrigin: "160px 160px", animation: "orbit-spin 26s linear infinite" }}>
        <circle cx="160" cy="160" r="70" stroke="#2C6E8F" strokeOpacity="0.5" strokeWidth="2"
          strokeDasharray="7 11" strokeLinecap="round" />
        <circle cx="160" cy="90" r="13" fill="#B5E2F6" stroke="#2C6E8F" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 160 + 128 * Math.cos(rad);
        const y = 160 + 128 * Math.sin(rad);
        return (
          <g key={deg}>
            <circle cx={x} cy={y} r="15" fill="#FFFFFF" stroke="#A32E32" strokeOpacity="0.35" strokeWidth="1.6"
              style={{ animation: `pip-pulse 3.6s var(--ease-house) ${i * 0.42}s infinite` }} />
            <g transform={`translate(${x - 8} ${y - 8}) scale(0.67)`} stroke="#8E2428" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" fill="none">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
            </g>
          </g>
        );
      })}

      <circle cx="160" cy="160" r="30" fill="#FFFFFF" fillOpacity="0.85" stroke="#A32E32" strokeOpacity="0.3" strokeWidth="1.6" />
      <g transform="translate(146 146)" stroke="#8E2428" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M14 2.5 24 6.5v7c0 5.6-4 10.1-10 11.6-6-1.5-10-6-10-11.6v-7z" transform="translate(-0.5 0) scale(0.85)" />
        <path d="M9 12.5l2.4 2.5 4.8-5" transform="translate(0 1) scale(0.9)" />
      </g>
    </svg>
  );
}

/* ── Contact route illustrations ───────────────────────────────────────── */

function RouteFrame({ children, tint }: { children: ReactNode; tint: string }) {
  return (
    <svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden="true" fill="none">
      <rect x="0.5" y="0.5" width="119" height="87" rx="14" fill={tint} />
      {children}
    </svg>
  );
}

export function RoutePartnership() {
  return (
    <RouteFrame tint="rgba(230,212,188,0.55)">
      <g stroke="#8E2428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M30 56a12 12 0 0 1 24 0" />
        <circle cx="42" cy="36" r="8" />
        <path d="M66 56a12 12 0 0 1 24 0" />
        <circle cx="78" cy="36" r="8" />
      </g>
      <path d="M54 66h12" stroke="#A32E32" strokeWidth="2.4" strokeLinecap="round"
        style={{ animation: "link-draw 2.8s var(--ease-house) infinite" }} />
      <circle cx="60" cy="22" r="3" fill="#A32E32" opacity="0.5" />
    </RouteFrame>
  );
}

export function RouteEducator() {
  return (
    <RouteFrame tint="rgba(181,226,246,0.42)">
      <g stroke="#2C6E8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M60 26 86 38 60 50 34 38z" />
        <path d="M44 44v14c0 4 7.2 7 16 7s16-3 16-7V44" />
        <path d="M86 38v13" />
      </g>
      <circle cx="86" cy="55" r="3.4" fill="#2C6E8F" opacity="0.6"
        style={{ animation: "pip-pulse 3s var(--ease-house) infinite" }} />
    </RouteFrame>
  );
}

export function RoutePress() {
  return (
    <RouteFrame tint="rgba(188,158,134,0.4)">
      <g stroke="#8E2428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="32" y="28" width="46" height="36" rx="4" />
        <path d="M78 38h8a2 2 0 0 1 2 2v20" />
        <path d="M39 37h22M39 45h22M39 53h14" />
      </g>
      <circle cx="88" cy="64" r="3.2" fill="#A32E32" opacity="0.55" />
    </RouteFrame>
  );
}

export function RouteGeneral() {
  return (
    <RouteFrame tint="rgba(230,212,188,0.45)">
      <g stroke="#8E2428" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="30" y="30" width="60" height="38" rx="7" />
        <path d="M33 36l24 16a6 6 0 0 0 6 0l24-16" />
      </g>
      <circle cx="60" cy="20" r="2.6" fill="#A32E32" opacity="0.45"
        style={{ animation: "pip-pulse 3.4s var(--ease-house) 0.4s infinite" }} />
    </RouteFrame>
  );
}
