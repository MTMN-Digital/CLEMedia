import { useState, useEffect, useRef } from "react";
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
   talking at a visitor is the opposite of this company's argument. Three
   controls sit top right: sound, captions, and a restart.

   EACH CONTROL DOES ONE THING. Sound toggles `muted` and nothing else.
   It used to seek back to zero and turn the loop off as well, on the
   reasoning that this is a narrated piece with a first line rather than
   wallpaper. The client overruled that on 2026-10-11 and the overrule is
   right: a button labelled "Sound on" that silently discards the forty
   seconds you have already watched is not the button it claims to be, and
   the film loops anyway, so the first line comes round again by itself. The
   restart is there for anyone who actually wants the top.

   ACCESSIBILITY. Content that moves for more than five seconds and starts on
   its own needs a mechanism to stop it (WCAG 2.2.2), and the brief commits to
   AA. The client asked for one visible pill, so the pause is the film itself:
   it is focusable and labelled, and a click or a key press stops and starts
   it. Captions (1.2.2) are a real transcript of the narration on their own
   toggle, drawn by this component rather than by the browser so they can be
   put somewhere the headline is not. `prefers-reduced-motion` means the film
   never starts by itself: poster, controls, and the visitor decides.

   The copy sits bottom left over a scrim rather than beside the film. Type on
   a moving picture is only readable if the picture is darkened under it, and
   the scrim is measured, not guessed: see `.film-scrim` in index.css.
   ========================================================================== */

export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);

  /* A film nobody is looking at should not be decoding.

     THE OBSERVER MUST NOT RESTART A FILM THE VIEWER STOPPED. Its `pause()`
     fires the same `pause` event a viewer's press does, so the two cannot be
     told apart after the fact. The flag therefore records the one thing only
     the viewer can do: press the control. A ref, not state, so the observer
     is installed once and never reads a stale value.

     It is the viewer's intent that is tracked, not the observer's, because
     the observer is no longer the only reason the film can be sitting
     paused. A browser that refused the autoplay leaves it paused too, and
     that one SHOULD start when it scrolls into view, which the old
     `stoppedByScroll` flag could never allow because it had never run. */
  const viewerPaused = useRef(false);

  /* Decided once, before the first paint, so the element is COMPLETE in the
     markup: source, autoplay and muted all present when the browser first
     sees it. Setting the source in an effect and calling play() afterwards
     works in Chrome and does not work in Safari, which wants the attributes
     at parse time. */
  const [start] = useState(() => ({
    /* Both files, not one. See the note in MissionVideo: on Linux, Chromium
       based browsers that do not license H.264 cannot decode the mp4 at all,
       and the symptom is indistinguishable from a blocked autoplay. */
    rendition: pickRendition(),
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

    /* And a third, when there is finally something to play.

       The two attempts above both happen on mount, which on a cold load is
       before a single frame has been decoded, and a browser is entitled to
       refuse a play() on an element with no data. Nothing then ever asked
       again: the poster sat there for the rest of the visit and the film
       looked broken rather than refused. `canplay` fires the moment the
       element could start, so this is the first attempt that is made at a
       time the browser can say yes to.

       It is guarded by `viewerPaused` so a film somebody deliberately stopped
       is not restarted by its own buffering, and it is harmless when the film
       is already running, because then it is not paused. */
    const retry = () => {
      if (start.autoplay && el.paused && !viewerPaused.current) el.play().catch(() => {});
    };
    el.addEventListener("canplay", retry);

    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
      el.removeEventListener("canplay", retry);
    };
  }, [start.autoplay]);

  /* Paused while it is off screen. The flag it reads is at the top of the
     component, because the mount effect above reads it too. */
  useEffect(() => {
    const el = video.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (start.autoplay && el.paused && !viewerPaused.current) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start.autoplay]);

  const togglePlay = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      viewerPaused.current = false;
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      viewerPaused.current = true;
      el.pause();
      setPlaying(false);
    }
  };


  const restart = () => {
    const el = video.current;
    if (!el) return;
    viewerPaused.current = false;
    el.currentTime = 0;
    el.play().then(() => setPlaying(true)).catch(() => {});
  };

  /* THE CAPTIONS ARE DRAWN BY US, NOT BY THE BROWSER.

     The track is real and stays real; what changes is who paints it. A
     native cue is placed by the browser in its own text track region, at the
     bottom centre of the video, and that is exactly where this hero puts its
     headline: "Watch. Play. Learn." sits bottom left and the supporting
     paragraph bottom right, so a browser painted caption lands on top of
     both. `::cue` can colour and size a cue but cannot move it, and the
     property that can (`::-webkit-media-text-track-container`) is one
     vendor's private API.

     So the track is held at `hidden`, which still fires `cuechange` and still
     exposes the text to assistive technology, and the active cue is rendered
     into an ordinary element this stylesheet can place. The caption is then
     just type on the page: it inherits the type scale, it wraps on the
     measure we choose, and it sits where we put it.

     `hidden` and not `disabled` is the load bearing part. `disabled` stops
     the cues being parsed at all and `cuechange` never fires. */
  const [captions, setCaptions] = useState(false);
  const [cue, setCue] = useState("");
  useEffect(() => {
    const el = video.current;
    const track = el?.textTracks?.[0];
    if (!track) return;
    track.mode = "hidden";
    const read = () => {
      const active = track.activeCues;
      setCue(
        active && active.length
          ? Array.from(active)
              .map((c) => (c as VTTCue).text)
              .join(" ")
          : "",
      );
    };
    read();
    track.addEventListener("cuechange", read);
    return () => track.removeEventListener("cuechange", read);
  }, []);

  /* A VOLUME CONTROL, AND NOTHING ELSE.

     This used to jump the film back to zero and stop the loop whenever the
     sound came on, on the argument that a narrated piece has a first line and
     dropping somebody into the middle of a sentence is worse than offering no
     sound at all. The client overruled it on 2026-10-11, and he is right about
     the thing I had not weighed: a control labelled "Sound on" that silently
     throws away the forty seconds you just watched is not the control it says
     it is. The film is already a loop; the first line comes round again.

     So it toggles `muted` and stops. Playback position, play state and the
     loop are all left exactly where they were, in both directions. */
  const toggleSound = () => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setSound(!el.muted);
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
        {/* The mp4 first, so a browser that can decode both takes the one
            more likely to reach a hardware decoder. Listed as `<source>`
            children rather than a `src` attribute so a browser without the
            proprietary codecs falls through to the WebM instead of failing
            the element. Both are known before the first render, so they are
            in the markup at parse time and nothing has to call `load()`. */}
        <source src={start.rendition.mp4} type="video/mp4" />
        <source src={start.rendition.webm} type="video/webm" />

        {/* Not `default`: a default track is SHOWING from the first frame, so
            the narration printed itself across the hero while the film was
            still muted, straight over the headline. It is turned on with the
            sound and off with it, below. */}
        <track kind="captions" src="/video/mission.en.vtt" srcLang="en" label="English" />
      </video>

      <span aria-hidden="true" className="film-scrim" />

      {/* Inside the stage, so it is over the PICTURE at every width. On a
          phone the copy block leaves the picture and sits on paper below it,
          and a caption that followed it there would be captioning nothing. */}
      {captions && cue && (
        <p className="film-cc">{cue}</p>
      )}

        </div>

      {/* The copy sits in the FOUR CORNERS of the frame rather than clustered
          in one of them. Measured off consulting.ie, which is the reference
          the client gave: an identifier top left, a positioning line top
          right, the headline bottom left at about 59px on a 1440 screen, and
          the supporting paragraph with its buttons bottom right, right
          aligned. Clustering it all bottom left, which is what this was,
          leaves three quarters of the picture doing nothing. */}
      <div className="film-copy">
        {/* AGES, NOT THE COUNTRY, from 2026-10-13. The creative director's
            revision marks the hero "children's edutainment · ages 3 to 5",
            and he is right about which of the two a broadcaster scanning this
            frame needs: Ireland is on the About page, in the footer and in the
            schema, and the age band is the first thing anyone commissioning
            children's media asks. */}
        <p className="film-eyebrow">
          Children&rsquo;s edutainment
          <span>Ages 3 to 5</span>
        </p>

        <div className="film-aside">
          <p className="film-note">Built on research. Made by people.</p>
          <div className="film-controls">
            <button type="button" onClick={toggleSound} className="film-btn">
              {sound ? "Mute" : "Sound on"}
              <span className="sr-only"> for the mission film</span>
            </button>
            <button
              type="button"
              onClick={() => setCaptions((v) => !v)}
              className="film-btn"
              aria-pressed={captions}
            >
              CC
              <span className="sr-only">
                {captions ? ", hide the captions" : ", show the captions"}
              </span>
            </button>
            <button type="button" onClick={restart} className="film-restart">
              <IconRestart size={16} />
              <span className="sr-only">Play the mission film again from the start</span>
            </button>
          </div>
        </div>

        {/* THE THREE WORDS ARRIVE IN ORDER, because they ARE an order: watch,
            then play, then learn is the company's whole model, and a headline
            that states a sequence and appears all at once throws that away.

            Each word rises and settles on the house easing, a tenth of a
            second apart. It runs once, on load, and it is the page's one
            orchestrated entrance. CSS, not a motion library: the words carry
            their own index and the stagger is a `calc` on the delay, so there
            is no inline opacity for a screenshot to catch mid-flight and the
            whole thing collapses to the final frame under reduced motion. */}
        <h1 id="hero-h" className="hero-head film-head">
          <span className="hero-head-face words-in">
            <span className="word" style={{ "--w": 0 } as React.CSSProperties}>
              Watch.
            </span>{" "}
            <span className="hero-head-2 word" style={{ "--w": 1 } as React.CSSProperties}>
              Play.
            </span>{" "}
            <span className="word" style={{ "--w": 2 } as React.CSSProperties}>
              Learn.
            </span>
          </span>
        </h1>

        <div className="film-support">
          {/* THE COMPANY, PLAINLY, from the creative director's revision. The
              line this replaces described the work ("calm stories for young
              children, and the activities that take them off the screen
              afterwards") and never said what CLÉ is. The deck's whole thesis
              is that this site should be less about the first show and more
              about the company, and the hero is where that starts. The
              headline above still carries the model. */}
          <p className="film-lead">
            CL&Eacute; Family Media is a children&rsquo;s production company led by specialists in
            early childhood education and child development. We make calm, educational series for
            ages 3 to 5, with play and learning materials for home and the classroom.
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
