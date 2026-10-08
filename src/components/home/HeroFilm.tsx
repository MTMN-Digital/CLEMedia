import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal, IconRestart } from "@/components/icons";
import { SITE } from "@/lib/site";
import { pickRendition } from "@/components/MissionVideo";

/* ============================================================================
   The hero: the mission film, full bleed.

   WHAT REPLACED WHAT. This was a rendered studio set for several days, a
   photographed garden on a cyc with a camera that orbited as you scrolled.
   The client's own people asked for the film instead, the way consulting.ie
   and m.ind.coach open. The Blender scene is still in the repo and still
   renders; nothing on the site loads it.

   HOW IT PLAYS. Muted, looping, from the poster, because a film that starts
   talking at a visitor is the opposite of this company's argument. Sound is
   one press away, top right. Pressing it starts the film AGAIN from the
   beginning and stops the loop: this is a narrated piece with a first line,
   not wallpaper, so dropping somebody into the middle of Conor's sentence
   with the sound suddenly on would be worse than not offering sound at all.
   A restart sits bottom right for when somebody wants it from the top again.

   ACCESSIBILITY. Content that moves for more than five seconds and starts on
   its own needs a mechanism to stop it (WCAG 2.2.2), and the brief commits to
   AA. The client asked for one visible pill, so the pause is the film itself:
   it is focusable and labelled, and a click or a key press stops and starts
   it. Nothing extra is drawn, and the requirement is still met. The captions
   track carries the narration when the sound is on (1.2.2), and
   `prefers-reduced-motion` means it never starts by itself: poster, controls,
   and the visitor decides.

   The copy sits bottom left over a scrim rather than beside the film. Type on
   a moving picture is only readable if the picture is darkened under it, and
   the scrim is measured, not guessed: see `.film-scrim` in index.css.
   ========================================================================== */

export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);

  /* Decided once, before the first paint, so the element is COMPLETE in the
     markup: source, autoplay and muted all present when the browser first
     sees it. Setting the source in an effect and calling play() afterwards
     works in Chrome and does not work in Safari, which wants the attributes
     at parse time. */
  const [start] = useState(() => ({
    src: pickRendition().src,
    /* Never start by itself for a reader who asked for stillness. */
    autoplay: !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  }));

  /* The film is sized to the screen under the sticky header, so something has
     to tell the CSS how tall that header is. The old pinned hero measured it;
     with that gone the stylesheet was falling back to a hardcoded 76px, which
     is right until the day the header changes. */
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const set = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(header.getBoundingClientRect().height)}px`,
      );
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    showCaptions(el, false);

    /* React sets `muted` as a PROPERTY and never writes the attribute, and
       Safari and Firefox both decide whether a film may autoplay by looking
       at the attribute. This is the whole reason the hero was not playing for
       the client while it played here: Chromium is happy with the property,
       so every test passed. */
    el.setAttribute("muted", "");

    /* Keep the label honest however it started or stopped, including when the
       browser refuses to autoplay at all. */
    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    sync();

    /* A second attempt, for the browsers that ignore the attribute but allow
       a scripted play on a muted element. A refusal is fine and is left
       alone: the poster is there, the controls are there, and a film somebody
       presses play on is a perfectly good outcome. */
    if (start.autoplay) el.play().catch(() => {});

    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
    };
  }, [start.autoplay]);

  /* A film nobody is looking at should not be decoding.

     THE OBSERVER MUST REMEMBER THAT IT WAS THE ONE WHO PAUSED. Its `pause()`
     fires the same `pause` event a viewer's press does, which set `playing`
     to false; the effect then re-ran with that false captured, and scrolling
     back to the hero left the film stopped for good. A ref, not state, so
     the observer is installed once and never reads a stale value. */
  const stoppedByScroll = useRef(false);
  useEffect(() => {
    const el = video.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (stoppedByScroll.current) {
            stoppedByScroll.current = false;
            el.play().catch(() => {});
          }
        } else if (!el.paused) {
          /* Only a film that was actually running is resumed. One the viewer
             stopped stays stopped. */
          stoppedByScroll.current = true;
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  /** Captions follow the sound: on when you can hear it, off when you cannot. */
  const showCaptions = (el: HTMLVideoElement, on: boolean) => {
    const track = el.textTracks?.[0];
    if (track) track.mode = on ? "showing" : "hidden";
  };

  const restart = () => {
    const el = video.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().then(() => setPlaying(true)).catch(() => {});
  };

  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    if (el.muted) {
      /* From the top, and once only. See the note above. */
      el.muted = false;
      el.loop = false;
      el.currentTime = 0;
      el.play().then(() => setPlaying(true)).catch(() => {});
      showCaptions(el, true);
      setSound(true);
    } else {
      el.muted = true;
      el.loop = true;
      showCaptions(el, false);
      setSound(false);
    }
  };

  return (
    <section className="film-hero" aria-labelledby="hero-h">
      <div className="film-frame">
        {/* The stage is the picture and the things that sit on the picture.
            The copy is a sibling, not a child, because on a phone it leaves
            the picture and sits under it on paper. Without this the restart
            button had to be positioned from viewport maths and ended up
            hanging off the bottom edge of the film. */}
        <div className="film-stage">
      <video
        ref={video}
        className="film-media"
        src={start.src}
        poster="/video/mission-poster.jpg"
        autoPlay={start.autoplay}
        muted
        loop
        playsInline
        preload="auto"
        /* Not `aria-hidden`: it is the content of the hero, not decoration. */
        /* Focusable and labelled, so the film is its own pause control: see
           the accessibility note above. */
        tabIndex={0}
        role="button"
        aria-label={`${playing ? "Pause" : "Play"} the CLÉ Family Media mission film`}
        onClick={togglePlay}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            togglePlay();
          }
        }}
      >
        {/* Not `default`: a default track is SHOWING from the first frame, so
            the narration printed itself across the hero while the film was
            still muted, straight over the headline. It is turned on with the
            sound and off with it, below. */}
        <track kind="captions" src="/video/mission.en.vtt" srcLang="en" label="English" />
      </video>

      <span aria-hidden="true" className="film-scrim" />

        </div>

      {/* The copy sits in the FOUR CORNERS of the frame rather than clustered
          in one of them. Measured off consulting.ie, which is the reference
          the client gave: an identifier top left, a positioning line top
          right, the headline bottom left at about 59px on a 1440 screen, and
          the supporting paragraph with its buttons bottom right, right
          aligned. Clustering it all bottom left, which is what this was,
          leaves three quarters of the picture doing nothing. */}
      <div className="film-copy">
        <p className="film-eyebrow">
          Children&rsquo;s edutainment
          <span>Ireland</span>
        </p>

        <div className="film-aside">
          <p className="film-note">Built on research. Made by people.</p>
          <div className="film-controls">
            <button type="button" onClick={toggleSound} className="film-btn">
              {sound ? "Mute" : "Sound on"}
              <span className="sr-only">
                {sound ? " for the mission film" : ", and play the mission film from the start"}
              </span>
            </button>
            <button type="button" onClick={restart} className="film-restart">
              <IconRestart size={16} />
              <span className="sr-only">Play the mission film again from the start</span>
            </button>
          </div>
        </div>

        <h1 id="hero-h" className="hero-head film-head">
          <span className="hero-head-face">
            Watch. <span className="hero-head-2">Play.</span> Learn.
          </span>
        </h1>

        <div className="film-support">
          <p className="film-lead">
            Calm stories for young children, and the activities that take them off the screen
            afterwards.
          </p>
          <div className="film-actions">
            <Button to="/ethical-ai">
              How we make it
              <IconArrow size={16} />
            </Button>
            <Button href={SITE.showUrl} variant="quiet">
              Visit the show
              <IconExternal size={15} />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
