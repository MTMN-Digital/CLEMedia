import type { SVGProps } from "react";

/**
 * Hand-authored line icons, 24x24 on a 1.6 stroke, inheriting currentColor.
 *
 * Drawn here rather than pulled from a library so the weight matches
 * Montserrat and the corner radii match the rest of the system. They carry no
 * meaning on their own, so every one is aria-hidden and sits beside a label.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ── The model ─────────────────────────────────────────────────────────── */

export const IconWatch = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="4.5" width="19" height="13" rx="3" />
    <path d="M8 21h8M12 17.5V21" />
    <path d="M10.4 8.8v4.4l3.8-2.2z" />
  </Svg>
);

export const IconPlay = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.5 3.5h3a2 2 0 0 1 2 2v1.2a1.3 1.3 0 0 0 2 1.1 1.8 1.8 0 0 1 2.6 1.6v3.1a2 2 0 0 1-2 2h-1.3a1.3 1.3 0 0 0-1.1 2 1.8 1.8 0 0 1-1.6 2.6h-3.1a2 2 0 0 1-2-2v-1.3a1.3 1.3 0 0 0-2-1.1 1.8 1.8 0 0 1-2.6-1.6v-3.1a2 2 0 0 1 2-2h1.2a1.3 1.3 0 0 0 1.1-2 1.8 1.8 0 0 1 1.6-2.5z" />
  </Svg>
);

export const IconLearn = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.5V11" />
    <path d="M12 11c0-3 2-5.5 5-6 .4 3.3-1.6 6.2-5 6z" />
    <path d="M12 14.5c-2.6 0-4.6-2-4.2-4.8 2.4.4 4.2 2.4 4.2 4.8z" />
    <path d="M6 20.5h12" />
  </Svg>
);

/* ── Values ────────────────────────────────────────────────────────────── */

export const IconParents = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.5s-6.8-4.2-8.2-8.3A4.3 4.3 0 0 1 12 8.6a4.3 4.3 0 0 1 8.2 3.6C18.8 16.3 12 20.5 12 20.5z" />
    <circle cx="12" cy="12.6" r="1.6" />
  </Svg>
);

export const IconHuman = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8 20 6v5.7c0 4.6-3.3 8.3-8 9.5-4.7-1.2-8-4.9-8-9.5V6z" />
    <path d="M8.8 11.9l2.2 2.3 4.2-4.4" />
  </Svg>
);

export const IconResearch = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 2.8v5.6L4.9 17a2.4 2.4 0 0 0 2.1 3.6h10a2.4 2.4 0 0 0 2.1-3.6l-4.6-8.6V2.8" />
    <path d="M8.4 2.8h7.2" />
    <path d="M7.2 14.6h9.6" />
  </Svg>
);

/* ── Actions ───────────────────────────────────────────────────────────── */

export const IconArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Svg>
);

/** A circular arrow: play the film again from the start. */
export const IconRestart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4.2V10h-5.8" />
  </Svg>
);

export const IconExternal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10" />
    <path d="M19.5 4.5 11 13" />
    <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
  </Svg>
);

export const IconDownload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 17v1.5A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2V17" />
  </Svg>
);

export const IconMail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
    <path d="m3.6 7.4 7.3 5a2 2 0 0 0 2.2 0l7.3-5" />
  </Svg>
);

export const IconBell = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6z" />
    <path d="M13.7 19a2 2 0 0 1-3.4 0" />
  </Svg>
);

/* ── Content types ─────────────────────────────────────────────────────── */

export const IconMic = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="2.8" width="6" height="11" rx="3" />
    <path d="M5.5 11.2a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.7v3.5M9 21.2h6" />
  </Svg>
);

export const IconPress = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5.5h12a1 1 0 0 1 1 1v12a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2v-12a1 1 0 0 1 1-1z" />
    <path d="M17 9.5h2a1 1 0 0 1 1 1v8" />
    <path d="M6.5 9h7M6.5 12.5h7M6.5 16h4" />
  </Svg>
);

export const IconInterview = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 12.5a7 7 0 0 1-7 7H9l-4.5 2.2 1-4.2a7 7 0 0 1 7.5-10.4" />
    <path d="M14.5 2.8h6v6" />
    <path d="M20.5 2.8 13 10.3" />
  </Svg>
);

export const IconPrint = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 8.5V3.8h10V8.5" />
    <rect x="3" y="8.5" width="18" height="7.5" rx="2" />
    <path d="M7 14h10v6.2H7z" />
  </Svg>
);

export const IconDevice = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.8" />
    <path d="M10.8 5.4h2.4" />
    <path d="M10 18.6h4" />
  </Svg>
);

export const IconCard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
    <path d="M2.8 9.6h18.4" />
    <path d="M6.5 14.5h3.5" />
  </Svg>
);

export const IconLock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="2.4" />
    <path d="M8 10V7.4a4 4 0 0 1 8 0V10" />
    <path d="M12 14v2.6" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m7.8 12.3 2.8 2.8 5.6-6" />
  </Svg>
);

export const IconNoAds = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.6 5.6 18.4 18.4" />
  </Svg>
);

export const IconHands = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="8.5" cy="7.8" r="3" />
    <circle cx="16" cy="9.5" r="2.4" />
    <path d="M3 20.2a5.5 5.5 0 0 1 11 0" />
    <path d="M15 14.8a4.6 4.6 0 0 1 6 4.4" />
  </Svg>
);

export const IconQuote = (p: IconProps) => (
  <Svg {...p} strokeWidth={1.4}>
    <path d="M9.2 6.5C6.3 7.8 4.5 10.3 4.5 13.4c0 2.4 1.4 4.1 3.4 4.1 1.8 0 3.1-1.3 3.1-3 0-1.8-1.2-3-2.9-3h-.5c.2-1.6 1.3-3 3-3.9z" />
    <path d="M19 6.5c-2.9 1.3-4.7 3.8-4.7 6.9 0 2.4 1.4 4.1 3.4 4.1 1.8 0 3.1-1.3 3.1-3 0-1.8-1.2-3-2.9-3h-.5c.2-1.6 1.3-3 3-3.9z" />
  </Svg>
);

export const IconCalendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.4" />
    <path d="M3.5 9.8h17M8.5 3v4M15.5 3v4" />
  </Svg>
);
