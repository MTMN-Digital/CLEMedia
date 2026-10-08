import { useEffect, useRef, useState } from "react";

/* ============================================================================
   The mission film.

   THE CLIENT'S BRIEF, in his words: play it muted, let the visitor click for
   sound, and serve it "as high as we can, auto scale based on device and
   connection". That is three separate decisions, and this component makes
   each of them once:

   WHICH FILE. Three renditions ship, 1080p at 15 MB, 720p at 7 MB and 480p
   at 3 MB. A <source media=""> list can answer the screen but not the line,
   and the Network Information API can answer the line but is not a media
   query, so the choice is made in script before the element is given a src
   and never changed afterwards: swapping mid-play would restart the film.
   Save-Data, or a connection the browser itself calls 2g, takes the 480p
   whatever the screen is. Nobody on a metered phone needs 15 MB of us.

   WHEN IT PLAYS. Muted, on entering the viewport, and paused on leaving it,
   so a film nobody is looking at is not decoding. Autoplay is a request, not
   a guarantee: a browser may refuse it, and the refusal is caught and left
   alone, because the controls are there and the poster is there and a film
   the visitor has to press play on is a perfectly good outcome.

   SOUND. A film that starts talking at someone is the opposite of this
   company's whole argument, so it starts muted and says so, and one press
   turns the sound on. After that the native controls own it.

   ACCESSIBILITY. The native controls are always present, which is what gives
   a keyboard user a way to stop something that started on its own (WCAG
   2.2.2), and the captions track is a real transcript of the narration, not
   a placeholder (1.2.2). prefers-reduced-motion means no autoplay at all:
   poster, controls, and the visitor decides.
   ========================================================================== */

type Rendition = { src: string; width: number };

const RENDITIONS: Record<"high" | "mid" | "low", Rendition> = {
  high: { src: "/video/mission-1080.mp4", width: 1920 },
  mid: { src: "/video/mission-720.mp4", width: 1280 },
  low: { src: "/video/mission-480.mp4", width: 854 },
};

/** Chosen once, before the element has a src. See the note above.
 *  Exported because the hero film makes the identical decision and there is
 *  no sense in two copies of it drifting apart. */
export function pickRendition(): Rendition {
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return RENDITIONS.low;
  if (conn?.effectiveType && /^(slow-)?2g$/.test(conn.effectiveType)) return RENDITIONS.low;
  if (conn?.effectiveType === "3g") return RENDITIONS.mid;

  /* The real question is how many pixels the player will occupy, which is the
     CSS width of its column times the device ratio, not the window width. The
     column is capped by the layout, so the window is a fair proxy, but the
     ratio is capped at 2: a 3x phone does not need a 1080p file to fill a
     390pt column. */
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  /* The player fills a wide container, so it occupies roughly the window less
     its gutters. The thresholds are the points at which the next rendition
     down would be upscaled: 720p is 1280 wide, so above about 1350 CSS pixels
     of window the 1080p file is the one that lands pixel for pixel. */
  const px = window.innerWidth * 0.95 * dpr;
  if (px >= 1280) return RENDITIONS.high;
  if (px >= 854) return RENDITIONS.mid;
  return RENDITIONS.low;
}

export function MissionVideo({
  className = "",
  /** The home page shows it as one beat among many; Story gives it the page. */
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Rendition | null>(null);
  const [muted, setMuted] = useState(true);

  /* The src is set from an effect rather than at render so the choice is made
     against the real window, once, and so a server-rendered build of this page
     would never bake one visitor's connection into the markup. */
  useEffect(() => setSource(pickRendition()), []);

  useEffect(() => {
    const el = video.current;
    if (!el || !source) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    /* Paused when it leaves, so scrolling past does not leave a film decoding
       behind the visitor. Only resumed if it was this observer that paused it:
       once someone has taken the controls, scrolling must not override them. */
    let ours = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.paused && (ours || el.currentTime === 0)) {
            el.play().then(() => { ours = true; }, () => { /* refused, poster stands */ });
          }
        } else if (!el.paused) {
          el.pause();
          ours = true;
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [source]);

  function turnSoundOn() {
    const el = video.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    if (el.paused) el.play().catch(() => { /* the controls are right there */ });
  }

  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-sunken ${className}`}>
      <video
        ref={video}
        className="block aspect-[1920/1068] w-full"
        poster="/video/mission-poster.jpg"
        preload={eager ? "metadata" : "none"}
        playsInline
        muted
        controls
        /* Without this a phone may take the film full screen the moment it
           autoplays, which is not what a muted background beat should do. */
        disablePictureInPicture={false}
        src={source?.src}
        width={source?.width}
        height={source ? Math.round((source.width * 1068) / 1920) : undefined}
      >
        <track kind="captions" srcLang="en" label="English" src="/video/mission.en.vtt" default />
      </video>

      {muted && (
        <button
          type="button"
          onClick={turnSoundOn}
          className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-cream uppercase backdrop-blur-sm transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <SpeakerOff />
          Sound on
        </button>
      )}
    </div>
  );
}

function SpeakerOff() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8.5 2.5 4.8 5.5H2.5v5h2.3l3.7 3V2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="m11.5 6 3 4m0-4-3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
