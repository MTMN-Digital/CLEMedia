import { useState, useEffect, useRef } from "react";

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

/* TWO FILES PER RENDITION, and this is not a nicety.

   The film shipped as H.264 video with AAC audio, which is what everything
   plays, except that "everything" is not true on Linux. Chromium's open
   source build carries no proprietary codecs, and the browsers built on it
   that do not license them separately, Opera among them, cannot decode this
   film at all. Reproduced on 2026-10-11 by driving the installed Opera
   directly: `canPlayType('video/mp4; codecs="avc1.640028"')` returns the
   empty string, the element reports error code 4 with
   `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`, and `play()` rejects with
   `NotSupportedError`. It is not an autoplay policy, which is what it looks
   like from the outside: the poster sits there and the controls do nothing,
   because there is no decoder, so a click cannot help either.

   VP9 and Opus in a WebM container are royalty free and are in every
   Chromium build including those ones, so each rendition ships twice and the
   browser takes the first it can decode. The mp4 is listed FIRST on purpose:
   where both will play, H.264 is far more likely to hit a hardware decoder,
   which on a laptop is the difference between a warm fan and a quiet one. */
type Rendition = { width: number; webm: string; mp4: string };

const RENDITIONS: Record<"mid" | "high" | "low" | "max", Rendition> = {
  /* From the 4K master, 2026-10-27, for the hero on a high density laptop
     or a big monitor, where 1080p is still being stretched. */
  max: { mp4: "/video/mission-1440.mp4", webm: "/video/mission-1440.webm", width: 2560 },
  high: { mp4: "/video/mission-1080.mp4", webm: "/video/mission-1080.webm", width: 1920 },
  mid: { mp4: "/video/mission-720.mp4", webm: "/video/mission-720.webm", width: 1280 },
  low: { mp4: "/video/mission-480.mp4", webm: "/video/mission-480.webm", width: 854 },
};

/** Chosen once, before the element has a src. See the note above.
 *  Exported because the hero film makes the identical decision and there is
 *  no sense in two copies of it drifting apart. */
/* MEASURED 2026-10-26, and this is the single heaviest thing on the site.
   Home and Story each pulled 16.3MB of film on first load, because the
   chooser asked the WINDOW how wide the player is. On Story the player sits
   in a column about half that, and on the home hero the film runs behind a
   dark scrim with the headline over it, where 720p is indistinguishable.
   So the caller now says how wide the thing actually is. The hero used to cap
   itself one step down; the client found 720p visibly soft full-bleed, so
   since 2026-10-27 it takes 1080p behind an opening splash instead. Re-encoding was tried first and is not the answer:
   the film is grainy enough that AV1 at CRF 45 still landed at 7.9MB, no
   better than the h264 720p that already exists. */
export function pickRendition(cssWidth?: number, cap?: "low" | "mid"): Rendition {
  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
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
  const px = (cssWidth || window.innerWidth * 0.95) * dpr;
  if (px >= 2200 && !cap) return RENDITIONS.max;
  if (px >= 1280 && !cap) return RENDITIONS.high;
  if (px >= 854 && cap !== "low") return RENDITIONS.mid;
  return RENDITIONS.low;
}

export function MissionVideo({
  className = "",
  /** The home page shows it as one beat among many; Story gives it the page. */
  eager = false,
}: {
  eager?: boolean;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<Rendition | null>(null);
  const [muted, setMuted] = useState(true);

  /* The src is set from an effect rather than at render so the choice is made
     against the real window, once, and so a server-rendered build of this page
     would never bake one visitor's connection into the markup. */
  /* The player's own width, not the window's: this one sits in a column. */
  useEffect(() => {
    setSource(pickRendition(video.current?.getBoundingClientRect().width));
  }, []);

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
        /* With the source, not in the markup: as an attribute in the
           prerendered HTML the 128KB poster was fetched alongside the first
           paint of a page whose film is several screens down. */
        poster={source ? "/video/mission-poster.webp" : undefined}
        preload={eager ? "metadata" : "none"}
        playsInline
        muted
        controls
        /* Without this a phone may take the film full screen the moment it
           autoplays, which is not what a muted background beat should do. */
        disablePictureInPicture={false}
        /* KEYED ON THE CHOSEN FILE, which forces React to build a fresh
           element once the rendition is known. `<source>` children are read
           when the element is parsed and are NOT re-scanned when they change,
           unlike a `src` attribute, so without this the element would keep
           the empty source list it was created with and never load anything.
           The alternative is calling `load()` from an effect; a fresh element
           is one line and also puts the sources in place at parse time, which
           is what Safari wants. */
        key={source?.mp4}
        width={source?.width}
        height={source ? Math.round((source.width * 1068) / 1920) : undefined}
      >
        {source && <source src={source.mp4} type="video/mp4" />}
        {source && <source src={source.webm} type="video/webm" />}
        <track kind="captions" srcLang="en" label="English" src="/video/mission.en.vtt" default />
      </video>

      {muted && (
        <button
          type="button"
          onClick={turnSoundOn}
          className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 font-mono text-[14px] tracking-[0.12em] text-raised uppercase backdrop-blur-sm transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raised"
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
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="m11.5 6 3 4m0-4-3 4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}
