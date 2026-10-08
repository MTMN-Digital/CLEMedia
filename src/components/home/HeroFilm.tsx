import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { IconArrow, IconExternal } from "@/components/icons";
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

   ACCESSIBILITY, and why there are two controls rather than one. Content that
   moves for more than five seconds and starts on its own needs a way to stop
   it (WCAG 2.2.2), and sound needs its own control; a single "unmute" button
   answers neither properly. So there is a play/pause and a sound toggle, both
   real buttons, both keyboard reachable, both labelled with what they will do
   next. The captions track carries the narration for when the sound is on
   (1.2.2), and `prefers-reduced-motion` means it never starts by itself:
   poster, controls, and the visitor decides.

   The copy sits bottom left over a scrim rather than beside the film. Type on
   a moving picture is only readable if the picture is darkened under it, and
   the scrim is measured, not guessed: see `.film-scrim` in index.css.
   ========================================================================== */

export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);

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

    /* Chosen once, before the element has a src: swapping it later restarts
       the film. Same decision the in-page player makes. */
    el.src = pickRendition().src;
    showCaptions(el, false);

    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) return;

    /* Autoplay is a request, not a guarantee. A refusal is fine and is left
       alone: the poster is there, the controls are there, and a film somebody
       presses play on is a perfectly good outcome. */
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  /* A film nobody is looking at should not be decoding. */
  useEffect(() => {
    const el = video.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (playing) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playing]);

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
      <video
        ref={video}
        className="film-media"
        poster="/video/mission-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        /* Not `aria-hidden`: it is the content of the hero, not decoration. */
        aria-label="The CLÉ Family Media mission film"
      >
        {/* Not `default`: a default track is SHOWING from the first frame, so
            the narration printed itself across the hero while the film was
            still muted, straight over the headline. It is turned on with the
            sound and off with it, below. */}
        <track kind="captions" src="/video/mission.en.vtt" srcLang="en" label="English" />
      </video>

      <span aria-hidden="true" className="film-scrim" />

      <div className="film-controls">
        <button type="button" onClick={togglePlay} className="film-btn">
          {playing ? "Pause" : "Play"}
          <span className="sr-only"> the mission film</span>
        </button>
        <button type="button" onClick={toggleSound} className="film-btn">
          {sound ? "Mute" : "Sound on"}
          <span className="sr-only">
            {sound ? " for the mission film" : ", and play the mission film from the start"}
          </span>
        </button>
      </div>

      <div className="film-copy">
        <h1 id="hero-h" className="hero-head">
          <span className="hero-head-face">
            Watch. <span className="hero-head-2">Play.</span> Learn.
          </span>
        </h1>
        <p className="t-lead film-lead mt-4 max-w-[42ch]">
          Calm stories for young children, and the activities that take them off the screen
          afterwards.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
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
    </section>
  );
}
