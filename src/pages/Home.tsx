import { useState, type FormEvent } from "react";
import { Seo, organizationJsonLd } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { type Episode } from "@/components/home/EpisodeSlate";
import { FilmStrip } from "@/components/home/FilmStrip";
import { ReviewGateScene } from "@/components/home/ReviewGateScene";
import {
  Button, Card, Container, Kicker, Lead, Section,
  SectionHeading, TextLink,
} from "@/components/ui";
import { IconArrow, IconExternal, IconMail } from "@/components/icons";
import { SITE } from "@/lib/site";
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
  return (
    <>
      <Seo
        title="Home"
        description="CLÉ Family Media makes calm, purposeful children's media. Watch, Play, Learn: stories built to move a child off the screen and into play, made by a named team who each review every episode before it is released."
        path="/"
        jsonLd={organizationJsonLd}
      />

      {/* ═══ 1. HERO. The mark carries it, but placed rather than centred:
          it sits in the left column at real size against the headline, with
          the garden as a framed object beside them, not a full-bleed band.
          The previous version stacked a centred logo, a headline, two buttons
          and then a big picture, which is the most conventional shape there
          is. ═══ */}
      {/* pt-0: the mark hangs on strings that run off its top edge, so they have
          to meet the header rather than start in mid air. */}
      <Section className="!pt-0">
        <Container width="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <Settle>
              {/* The width lives on the wrapper, not on the Figure. Figure puts
                  `w-full` on its own <img>, and Tailwind resolves a conflict
                  between two width utilities by stylesheet order, not by the
                  order they appear in the class attribute, so a `w-[clamp(...)]`
                  passed in as className loses and the mark renders full column. */}
              <div className="w-[clamp(190px,24vw,280px)]">
                <Figure
                  asset="brand.cle"
                  priority
                  rounded="rounded-none"
                  className="drop-shadow-[0_18px_28px_rgba(74,53,42,0.18)]"
                  sizes="280px"
                />
              </div>
              <h1 className="t-display mt-10 max-w-[13ch]">Children's media made by people</h1>
              <Lead className="mt-7">
                Calm stories for young children, and the activities that take them off the screen
                afterwards. Every episode is reviewed by a named person before it is released.
              </Lead>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button to="/ethical-ai">How we make it<IconArrow size={16} /></Button>
                <Button href={SITE.showUrl} variant="quiet">Visit the show<IconExternal size={15} /></Button>
              </div>
            </Settle>

            <Settle className="lg:pl-6">
              <Card className="tilt-b overflow-hidden p-2.5">
                <Figure
                  asset="home.hero"
                  rounded="rounded-[var(--radius-md)]"
                  sizes="(min-width: 1024px) 44vw, 92vw"
                />
              </Card>
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 2. THESIS ═══ */}
      <Section labelledBy="thesis-h">
        <Container width="text">
          <Settle>
            <Kicker>What we believe</Kicker>
            <h2 id="thesis-h" className="t-h1 mt-6">
              We are not going to tell anyone their child watches too much television.
            </h2>
            <div className="t-lead mt-8 space-y-6 text-body">
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
              <p className="text-ink">
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
              <Card className="tilt-a mt-10 overflow-hidden p-2.5">
                <Figure
                  asset="story.garden"
                  rounded="rounded-[var(--radius-md)]"
                  sizes="(min-width: 1024px) 34vw, 92vw"
                />
              </Card>
            </Settle>

            <Settle className="grid gap-5 sm:grid-cols-3 lg:self-start">
              {STAGES.map((st) => (
                <Card key={st.n} className="flex h-full flex-col p-7">
                  <span className="tnum font-mono text-[13px] tracking-[0.16em] text-red-deep">{st.n}</span>
                  <h3 className="t-h3 mt-4 font-display">{st.title}</h3>
                  <p className="t-body mt-3 text-slate">{st.body}</p>
                </Card>
              ))}
            </Settle>
          </div>
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
              <div className="w-[clamp(220px,26vw,330px)]">
                <Card className="tilt-b overflow-hidden p-2">
                  <Figure
                    asset="brand.show"
                    rounded="rounded-[var(--radius-md)]"
                    sizes="330px"
                  />
                </Card>
              </div>
              <h2 id="series-h" className="t-h2 mt-9 max-w-[16ch]">Our first original series</h2>
            </div>
            <Lead className="lg:pb-2">
              Finn, the fawn pug, and Fia, the black pug, in a garden that rewards slowing down.
              Four episodes released so far, nine to eleven minutes each.
            </Lead>
          </Wipe>
        </Container>

        <div className="rail-bleed mt-14">
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
          <Settle className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE.map((p) => (
              <Card key={p.name} className="flex h-full flex-col p-6">
                {/* Width on the wrapper: Figure's own w-full beats a w-* passed
                    into className, which is a Tailwind ordering trap. */}
                {p.asset && (
                  <div className="w-[84px]">
                    <Figure asset={p.asset} rounded="rounded-full" className="aspect-square" sizes="84px" />
                  </div>
                )}
                <h3 className="t-h3 mt-5">{p.name}</h3>
                <p className="eyebrow mt-2 !text-[11px]">{p.role}</p>
                <p className="t-body mt-3 text-body">{p.line}</p>
              </Card>
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
            <Card className="p-8 sm:p-10">
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
            </Card>
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
