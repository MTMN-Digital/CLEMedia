import { useCallback, useState, type FormEvent } from "react";
import { Seo, organizationJsonLd } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { HeroShot } from "@/components/home/HeroShot";
import { Wipe } from "@/components/Wipe";
import { type Episode } from "@/components/home/EpisodeSlate";
import { FilmStrip } from "@/components/home/FilmStrip";
import { MissionVideo } from "@/components/MissionVideo";
import { Stage } from "@/components/render/Stage";
import { ReviewGateScene } from "@/components/home/ReviewGateScene";
import {
  Button, Container, Kicker, Lead, Section,
  SectionHeading, TextLink,
} from "@/components/ui";
import { IconArrow, IconMail } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   THE RULE THIS PAGE WAS REBUILT ON.

   Five real images exist in public/brand/: the felted CLÉ mark, the felted
   Pawsitive Pugs wordmark, the hen and pugs, the tree swing, the bluebells.
   An earlier version of this page used NONE of them, and rendered nine empty
   placeholder frames instead, including a placeholder for the felted wordmark
   that is already in the repo. That is why the page read as a blank sheet.

   So: the artwork is the content. It is used large and full bleed, because
   that is how pawsitivepugs.com carries its own pages. And an empty frame is
   never rendered on this page. Where an asset is missing, the section is built
   from what exists instead, and the gap is listed in CONTENT-NEEDED.md.
   ========================================================================== */

const STAGES = [
  { n: "01", title: "Watch", body: "An episode, together. Calm stories paced for how young children actually take things in, with nothing autoplaying into something nobody chose." },
  { n: "02", title: "Play", body: "A pause for a movement or breathing prompt, so the episode becomes something a child does rather than only sees." },
  { n: "03", title: "Learn", body: "A printable or an educator-designed activity afterwards, moving the learning off the screen entirely." },
];

/* Titles and synopses are the show's own, from its site. Runtime, age range and
   theme are not known and are not invented. */
/* Episode numbers, titles and runtimes are the REAL ones, read off the felted
   title slates and the YouTube metadata, not off the show site's section
   ordering, which lists them in a different sequence. The Strawberry is 002 and
   Chicken Vision is 003; the show site implies the reverse. Runtimes are the
   actual durations. */
const EPISODES: Episode[] = [
  { n: "001", title: "The Feather", runtime: "9:16", asset: "slate.ep1",
    href: "https://www.youtube.com/watch?v=duMH0f12JM0",
    line: "A drifting feather leads Finn and Fia on a garden adventure where slowing down helps them discover the hidden beauty of the tiny world around them." },
  { n: "002", title: "The Strawberry", runtime: "11:10", asset: "slate.ep2",
    href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0",
    line: "After a rainy night in the garden, Finn and Fia help a tiny field mouse reach a strawberry just out of reach." },
  { n: "003", title: "Chicken Vision", runtime: "10:41", asset: "slate.ep3",
    href: "https://www.youtube.com/watch?v=CpgIzsn500Q",
    line: "Finn and Fia meet a hen who sees the garden differently, and discover the world can look magical in many different ways." },
  { n: "004", title: "The Cuckoo's Incredible Journey", runtime: "9:58", asset: "slate.ep4",
    href: "https://www.youtube.com/watch?v=yHYYBpMfE6M",
    line: "Finn and Fia go on a new adventure and meet a cuckoo who has travelled a very long way to get back to the garden." },
];

/* Portraits arrived 2026-10-01 with the client's bios, so the names finally
   have faces against them, which on a page whose whole argument is "made by
   named people" is the single most useful image on it.

   Names and titles follow that handoff: Alan rather than Al, Lydia Harding
   rather than Lydia Sexton, Kirstie without the surname the earlier draft gave
   her. Paula's book is Full STEAM Ahead; an earlier draft credited her with
   Síolta in Practice, which the client's own biography does not.

   Six here, not the whole company: Mansi's handoff carried no photograph or
   biography, so she is on /team in full rather than as the one blank tile in a
   row of faces. The link under this grid is what carries the reader to her. */
const PEOPLE: { name: string; role: string; line: string; asset?: AssetKey }[] = [
  { name: "Conor Sexton", role: "Founder and CEO", asset: "person.conor", line: "Sets each episode's concept and story alongside Alan, and leads strategy and partnerships." },
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula", line: "Lectures in early childhood education at SETU Carlow and wrote Full STEAM Ahead. Reviews learning intent against early years practice." },
  { name: "Alan Compton", role: "Creative Director", asset: "person.alan", line: "Writes and directs. The look, the performances and the pace of an episode are his call." },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia", line: "Reads script and production from a parent's point of view, and from a child's, before anything is released." },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie", line: "Thirty years in childcare and early education, and a qualified SNA. Checks that what is made is age-appropriate." },
  { name: "David Toth", role: "Strategic Advisor", asset: "person.david", line: "Two decades advising Nickelodeon, LEGO and BBC Kids on content quality and platform safety. Shapes platform strategy here." },
];

function NotifyForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "notify", email }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error ?? "Could not sign you up. Please try again.");
      } else setSent(true);
    } catch { setError("Could not sign you up. Please check your connection."); }
    finally { setBusy(false); }
  }

  if (sent) return <p role="status" className="t-sm mt-6">Thank you. We will be in touch when there is something worth sending.</p>;

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
      <div className="flex-1">
        <label htmlFor="notify-email" className="sr-only">Email address</label>
        <input
          id="notify-email" name="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
          className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[16px] text-white placeholder:text-white/50"
        />
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Signing up" : "Sign up"}<IconMail size={16} /></Button>
      {error && <p role="alert" className="t-sm sm:basis-full">{error}</p>}
    </form>
  );
}

export default function Home() {
  /* The set is a dynamic import so three.js stays out of the main bundle, and
     it is memoised so a re-render never rebuilds the scene. */
  const heroSet = useCallback(
    () => import("@/components/home/hero3d/sets/soundstage").then((m) => m.soundstageSet),
    [],
  );

  return (
    <>
      <Seo
        title="Home"
        description="CLÉ Family Media makes calm, purposeful children's media. Watch, Play, Learn: stories built to move a child off the screen and into play, made by a named team who each review every episode before it is released."
        path="/"
        jsonLd={organizationJsonLd}
      />

      {/* ═══ 1. HERO. One shot: the mark hangs over a miniature of the show's
          garden, built on a board that visibly ends, standing on a studio
          sweep with a rig over it. The first scroll holds the page and pushes
          the camera in through that room, and the words arrive in the band the
          move opens. The room is in the same WebGL scene as the mark, which is
          the whole point: a camera move past a flat backdrop reads as a
          picture being enlarged, and five earlier versions of this hero were
          rejected for exactly that. See HeroShot and hero3d/. ═══ */}
      <HeroShot set={heroSet} />

      {/* The garden, edge to edge, as the horizon the rest of the page sits
          under. It does not drift: one thing moving against a fixed ground is
          an object, two things moving against each other is a scroll effect. */}
      <div className="h-[clamp(260px,44vw,620px)] overflow-hidden">
        <Figure
          asset="home.hero"
          fill
          rounded="rounded-none"
          position="center 46%"
          priority
          sizes="100vw"
        />
      </div>

      {/* ═══ 2. THESIS. The first change of room. The page has been one flat
          clay surface up to here; the argument that the company is different
          from the market is the right place to put the reader somewhere
          physically different, so it runs edge to edge on a wall a stop deeper
          than the paper, under the same lamp as the rest of the room. ═══ */}
      <Section labelledBy="thesis-h" className="wall">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <Kicker>What we believe</Kicker>
              <h2 id="thesis-h" className="t-h1 mt-6 max-w-[16ch]">
                We are not going to tell anyone their child watches too much television.
              </h2>
            </div>
            <div className="t-lead space-y-6 lg:pt-16">
              <p>
                The gap we saw is narrower than that. Not enough content made at a child's pace,
                with genuine educational intent, and with a clear account of who made it and who
                checked it.
              </p>
              <p>
                Much of what fills the market is fast and loud, built around how long a child keeps
                watching rather than what they take away from it. Attention is what gets measured,
                so attention is what gets designed for.
              </p>
              <p className="border-l-2 border-[var(--color-red)] pl-5 font-display text-[clamp(1.125rem,0.95rem+0.6vw,1.4rem)] leading-snug text-ink">
                We would rather make the episode the beginning of the thing than the whole of it.
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 3. THE MODEL. Three across, not a pinned stack. A sticky stack
          spends the reader's scroll to deliver its content, and three cards of
          two lines each do not earn 186vh of it. ═══ */}
      <Section labelledBy="model-h">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Settle>
              <SectionHeading
                id="model-h"
                kicker="The model"
                title="One episode, three stages"
                lead="Designed to move a child from the screen into play and conversation, rather than to hold them in front of it."
              />
              {/* The garden is a print standing on the bench, not a picture in
                  a frame: same lamp, same ledge, same room as the show wordmark
                  further down the page. */}
              <div className="mt-10">
                <Stage backdrop rake ground="ledge" tilt={5} depth={0.55} light={-30}>
                  <Figure
                    asset="story.garden"
                    rounded="rounded-[var(--radius-sm)]"
                    sizes="(min-width: 1024px) 34vw, 92vw"
                  />
                </Stage>
              </div>
            </Settle>

            {/* Three across on tablet, stacked again on desktop. Three short cards
                side by side next to a tall photograph left the bottom right of a
                wide screen empty; stacked, the column runs the height of the
                image beside it. */}
            <Settle className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-6 lg:self-center">
              {STAGES.map((st) => (
                /* An index card with its number on the tab, rather than a
                   rounded rectangle with the number printed inside it. */
                <div
                  key={st.n}
                  className="card-stock flex h-full flex-col p-7 pt-8 lg:grid lg:grid-cols-[minmax(0,14ch)_minmax(0,1fr)] lg:items-baseline lg:gap-10 lg:p-8 lg:pt-9"
                >
                  <span className="card-tab tnum" aria-hidden="true">{st.n}</span>
                  <h3 className="t-h3 font-display">{st.title}</h3>
                  <p className="t-body mt-3 text-body lg:mt-0">{st.body}</p>
                </div>
              ))}
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 3b. THE FILM. Conor's own statement of the mission, in his
          voice. It sits here and not under the hero because a visitor who has
          not yet read what this company believes has no reason to give it a
          minute; by this point they have read it, and the film is the person
          behind it saying the same thing. It starts muted with its controls
          showing, and one press turns the sound on. ═══ */}
      <Section labelledBy="film-h">
        <Container width="wide">
          <Wipe className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Kicker>In his own words</Kicker>
              <h2 id="film-h" className="t-h2 mt-4 max-w-[14ch]">The mission, said out loud</h2>
            </div>
            <Lead className="lg:pb-2">
              A minute on what we are making and who we are making it for. Captioned, and silent
              until you ask for sound.
            </Lead>
          </Wipe>
          <Settle className="mt-12">
            <MissionVideo />
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. THE SERIES. A filmstrip, because perforated stock IS the
          trade. The felted show wordmark is a photograph of a real object on a
          lit felt backdrop, so it cannot be knocked out the way the CLE mark
          was. It is framed instead, the same treatment the hero gives the
          garden, which reads as a placed object rather than a pasted tile.

          The strip then runs off the right edge of the page. Boxed inside the
          container it stopped dead at a hard vertical edge mid-slate, which
          reads as a clipping bug rather than as film continuing. ═══ */}
      <Section labelledBy="series-h">
        <Container width="wide">
          <Wipe className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:gap-16">
            <div>
              {/* The felted wordmark is a photograph of a real object, so it
                  is staged rather than framed: leaned back on the ledge under
                  the same lamp as the plates below it. */}
              <div className="w-[clamp(240px,30vw,400px)]">
                <Stage backdrop rake ground="ledge" tilt={5} depth={0.6} light={-28}>
                  <Figure asset="brand.show" rounded="rounded-[var(--radius-sm)]" sizes="400px" />
                </Stage>
              </div>
              <h2 id="series-h" className="t-h2 mt-9 max-w-[16ch]">Our first original series</h2>
            </div>
            <Lead className="lg:pb-2">
              Finn, the fawn pug, and Fia, the black pug, in a garden that rewards slowing down.
              Four episodes released so far, nine to eleven minutes each.
            </Lead>
          </Wipe>
        </Container>

        {/* The filmstrip stays: perforated stock IS the trade, and the rail
            running off both edges is the one piece of this page that already
            read as authored. The studio wall render built alongside it is kept
            in src/components/render for a page that needs a still, lit set of
            objects; it is not mounted here, because the same four plates
            cannot stand twice on one page. */}
        <div className="mt-14">
          <FilmStrip episodes={EPISODES} />
        </div>
      </Section>

      {/* ═══ 5. WHO CHECKS IT ═══ */}
      <Section labelledBy="gates-h">
        <Container width="wide"><ReviewGateScene /></Container>
      </Section>

      {/* ═══ 6. THE PEOPLE. Names and what each one checks. No empty portrait
          frames: Paula is listed second because she is the credential that
          survives a search. ═══ */}
      <Section labelledBy="people-h">
        <Container width="wide">
          <Settle>
            <SectionHeading
              id="people-h"
              kicker="The people behind it"
              title="Named, and answerable"
              lead="Every person here appears in the production and review sequence, not only on an about page."
            />
          </Settle>
          {/* The casting wall. Six prints standing on the bench under the same
              lamp, each one leaning a little differently because a hand put it
              there. Square, not circular: a circular crop is an avatar, and an
              avatar is a user interface. These are photographs of people who
              are answerable for something. */}
          <Settle className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE.map((p, i) => (
              <article key={p.name} className="flex h-full flex-col">
                {p.asset && (
                  <Stage
                    seated
                    lift
                    tilt={4 + (i % 3)}
                    turn={i % 2 ? -2.5 : 2}
                    roll={i % 2 ? 0.5 : -0.6}
                    depth={0.4 + (i % 3) * 0.08}
                    light={-30}
                    radius="var(--radius-sm)"
                    className="w-[clamp(140px,22vw,176px)]"
                  >
                    <Figure asset={p.asset} rounded="rounded-[var(--radius-sm)]" className="aspect-square" sizes="176px" />
                  </Stage>
                )}
                <h3 className="t-h3 mt-7">{p.name}</h3>
                <p className="eyebrow mt-2 !text-[11px]">{p.role}</p>
                <p className="t-body mt-3 max-w-[38ch] text-body">{p.line}</p>
              </article>
            ))}
          </Settle>
          <Settle className="mt-9">
            <TextLink to="/team">The full team and advisory board<IconArrow size={15} /></TextLink>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 7. THE AI POSITION ═══ */}
      <Section labelledBy="ai-h">
        <Container width="wide">
          <Settle className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <SectionHeading
              id="ai-h"
              kicker="Responsible AI"
              title="AI is a production tool. People remain responsible for the work."
            />
            <div className="card-stock p-8 pt-9 sm:p-10 sm:pt-11">
              <span className="card-tab" aria-hidden="true">POSITION</span>
              <div className="t-body space-y-5 text-body">
                <p>
                  Our creative and educational decisions are made by people. In final production we
                  use Runway for visual production and ElevenLabs for voice production. Our team
                  directs, reviews and approves the work before publication.
                </p>
                <p className="text-ink">
                  Calling this work handmade would be untrue. Calling it AI-generated would erase
                  the people who actually make the decisions.
                </p>
                <p>Nothing is generated and published automatically.</p>
              </div>
              <div className="mt-7">
                <TextLink to="/ethical-ai">Read the full position<IconArrow size={15} /></TextLink>
              </div>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 8. CONTACT, the one deep band ═══ */}
      <Section deep labelledBy="cta-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <h2 id="cta-h" className="t-h2 max-w-[16ch]">Working with CLÉ Family Media</h2>
              <p className="t-lead mt-6 max-w-[46ch] opacity-85">
                We are open to conversations with studios, distribution partners, educators and
                press. If you are assessing the company, we would rather answer your questions
                directly.
              </p>
              <div className="mt-9"><Button to="/contact">Send an enquiry<IconArrow size={16} /></Button></div>
            </div>
            <div>
              <h3 className="t-h3">Occasional updates</h3>
              <p className="t-body mt-3 max-w-[40ch] opacity-80">
                Production notes and company news, for adults. Infrequent, and easy to leave.
              </p>
              <NotifyForm />
            </div>
          </Settle>
        </Container>
      </Section>
    </>
  );
}
