import { useState, type FormEvent } from "react";
import { Seo } from "@/components/Seo";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import {
  PupsPlayerWalkthrough,
  type AppEpisode,
} from "@/components/app/PupsPlayerWalkthrough";
import { Button, Card, Container, Kicker, Lead, Section, SectionHeading, TextLink } from "@/components/ui";
import { IconArrow, IconBell, IconExternal } from "@/components/icons";
import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   PupsPlayer, before it exists.

   The job of this page is to make an unreleased product feel real and
   considered to somebody deciding whether to back it or carry it, without a
   screenshot, because there is none. The earlier page tried to do that with
   six icon cards and three grey placeholder frames where the product should
   have been, which is a worse argument than no picture at all.

   So the product is drawn. `PupsPlayerWalkthrough` is the app's interface in
   HTML and CSS inside a tablet frame, carrying the four real episode plates and
   their real runtimes, and a reader can step it through Watch, Play and Learn.
   That is the page's one signature device and everything else here is in
   service of it: what the app will do, who checks what goes into it, where it
   stands, and how to hear when it lands.

   Nothing is claimed that the page did not already claim. No launch date, no
   store links, no price, no device requirements, no numbers. Where a fact is
   missing the page says so rather than filling the gap.
   ========================================================================== */

/** Flipped at launch. Store links stay null until the client supplies them, and
 *  a null link renders nothing: no badge placeholders. */
const APP_LAUNCHED = false;
const STORE_LINKS: { label: string; href: string | null }[] = [
  { label: "App Store", href: null },
  { label: "Google Play", href: null },
];

/* Episode numbers, titles and runtimes are the real ones, read off the felted
   title slates and the YouTube metadata. Same source as the home page. */
const EPISODES: AppEpisode[] = [
  { n: "001", title: "The Feather", runtime: "9:16", asset: "slate.ep1", href: "https://www.youtube.com/watch?v=duMH0f12JM0" },
  { n: "002", title: "The Strawberry", runtime: "11:10", asset: "slate.ep2", href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0" },
  { n: "003", title: "Chicken Vision", runtime: "10:41", asset: "slate.ep3", href: "https://www.youtube.com/watch?v=CpgIzsn500Q" },
  { n: "004", title: "The Cuckoo's Incredible Journey", runtime: "9:58", asset: "slate.ep4", href: "https://www.youtube.com/watch?v=yHYYBpMfE6M" },
];

/* The six commitments, carried over from the previous page word for word in
   substance. They were the page's own claims about the plan and they stay its
   only claims: nothing has been added. Grouped by where each one lands, on
   the screen or off it, because that split is the model. */
const ON_SCREEN = [
  {
    title: "Every episode, ad free",
    body: "The full run of The Pawsitive Pugs & Pals in one place, with nothing competing for a child's attention around it. No autoplay into something nobody chose.",
  },
  {
    title: "Play that follows the story",
    body: "Each episode has activities built from what just happened in it, so the play reinforces the idea rather than sitting beside it as a separate game.",
  },
  {
    title: "Built for small hands",
    body: "Large targets, simple navigation and no dark patterns. A young child can find their way around it, and cannot accidentally find their way out of it.",
  },
];
const OFF_SCREEN = [
  {
    title: "Printables for the table",
    body: "Colouring, puzzles and activity sheets to print and take away from the screen, because not all of this should happen on one.",
  },
  {
    title: "Parents stay in control",
    body: "Clear settings, no surprise purchases inside the app, and no advertising to children anywhere in it.",
  },
  {
    title: "Grounded in the learning",
    body: "Every activity maps back to the early years objective behind its episode, reviewed by the same people who review the episodes.",
  },
];

/* The people who check what goes into the app, as the client supplied them.
   The same three review stages the episodes pass: educational review, and
   parent and early years review. */
const REVIEWERS: { name: string; role: string; line: string; asset: AssetKey }[] = [
  { name: "Paula Walshe PhD", role: "Education Director", asset: "person.paula", line: "Reviews the learning intent of each episode and the offline activities that follow it, against early years practice." },
  { name: "Lydia Harding", role: "Executive Producer", asset: "person.lydia", line: "Reads script and production from a parent's point of view, and from a child's." },
  { name: "Kirstie", role: "Child Development Consultant", asset: "person.kirstie", line: "Thirty years in childcare and early education. Checks that what is made is age-appropriate." },
];

/* Posts to /api/contact with route "notify", unchanged from the previous page.
   Only the presentation moved, into the deep band. */
function NotifyForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "notify", email }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error ?? "Could not sign you up. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not sign you up. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p role="status" className="t-body mt-6">
        Thanks. We will email you once, when it is live, and not for anything else.
      </p>
    );
  }

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
      <div className="flex-1">
        <label htmlFor="notify-email" className="sr-only">Email address</label>
        <input
          id="notify-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[16px] text-white placeholder:text-white/60"
        />
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Signing up" : "Notify me"}<IconBell size={16} /></Button>
      {error && <p role="alert" className="t-sm sm:basis-full">{error}</p>}
    </form>
  );
}

function Commitments({ heading, items }: { heading: string; items: { title: string; body: string }[] }) {
  return (
    <div>
      <p className="eyebrow !text-[11px] pb-4">{heading}</p>
      <ul>
        {items.map((it) => (
          <li key={it.title} className="hairline py-6">
            <h3 className="t-h3">{it.title}</h3>
            <p className="t-body mt-2.5 text-body">{it.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppPage() {
  const liveLinks = STORE_LINKS.filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <>
      <Seo
        title={APP_LAUNCHED ? "PupsPlayer app" : "PupsPlayer app, in development"}
        description="PupsPlayer™ from CLÉ Family Media holds the Watch, Play, Learn model in one place: ad-free episodes of The Pawsitive Pugs & Pals, the movement or breathing prompt that follows each one, and the printable activities underneath. In development."
        path="/app"
      />

      {/* ═══ 1. WHAT IT IS, and the drawn product. The headline sits at the
          top in its own measure and the device takes the full width under it,
          with the three stages beside it driving the screen. ═══ */}
      <Section labelledBy="app-h" className="!pb-16 sm:!pb-20">
        <Container width="wide">
          <Settle>
            <Kicker>{APP_LAUNCHED ? "PupsPlayer™" : "PupsPlayer™ · In development"}</Kicker>
            <h1 id="app-h" className="t-display mt-6 max-w-[16ch]">Watch, play and learn in one place</h1>
            <Lead className="mt-6 max-w-[56ch]">
              PupsPlayer™ will hold the whole Watch, Play, Learn model: ad-free episodes of{" "}
              <em>The Pawsitive Pugs &amp; Pals</em>®, the movement or breathing prompt that follows
              each one, and the printable activities underneath.
              {APP_LAUNCHED
                ? ""
                : " It is in development and not yet available. Everything drawn below is the plan, not a screenshot."}
            </Lead>
            {APP_LAUNCHED && liveLinks.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {liveLinks.map((l) => (
                  <Button key={l.label} href={l.href}>{l.label}<IconExternal size={15} /></Button>
                ))}
              </div>
            ) : (
              <div className="mt-8">
                {/* A plain anchor, not TextLink: TextLink opens an href in a
                    new tab, and this one only goes down the page. */}
                <a
                  href="#notify"
                  className="link-draw inline-flex items-center gap-1.5 text-[15px] font-semibold text-red-deep"
                >
                  Hear when it lands<IconArrow size={15} />
                </a>
              </div>
            )}
          </Settle>
        </Container>

        <Container width="wide" className="mt-14 sm:mt-16">
          <Wipe>
            <PupsPlayerWalkthrough episodes={EPISODES} />
          </Wipe>
        </Container>
      </Section>

      {/* ═══ 2. WHAT IT WILL DO. The six planned commitments, split by where
          each one lands, with the four released episodes beside them because
          that is what the library holds on day one. ═══ */}
      <Section labelledBy="will-h">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Settle>
              <SectionHeading
                id="will-h"
                title="What it will do"
                lead="Planned features. Each one is what we are building towards rather than something you can use today."
              />
              <Card className="card-still mt-10 px-6 py-2 sm:px-8">
                <p className="eyebrow !text-[11px] pt-5">Released so far</p>
                <ul className="mt-2">
                  {EPISODES.map((ep) => (
                    <li key={ep.n} className="hairline">
                      <a
                        href={ep.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline gap-4 py-4"
                      >
                        <span className="tnum font-mono text-[12px] tracking-[0.14em] text-red-deep">{ep.n}</span>
                        <span className="t-body font-semibold text-ink group-hover:text-red-deep">{ep.title}</span>
                        <span className="tnum ml-auto shrink-0 font-mono text-[12px] text-muted">{ep.runtime}</span>
                        <span className="shrink-0 text-muted" aria-hidden="true"><IconExternal size={13} /></span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="t-sm hairline py-5 text-body">
                  Four episodes, on the show's YouTube channel now. Nine to eleven minutes each.
                </p>
              </Card>
            </Settle>

            <Settle className="grid gap-10 sm:grid-cols-2 sm:gap-12">
              <Commitments heading="On the screen" items={ON_SCREEN} />
              <Commitments heading="Off the screen" items={OFF_SCREEN} />
            </Settle>
          </div>
        </Container>
      </Section>

      {/* ═══ 3. WHO CHECKS IT. Narrow, one card. The activities in the app go
          through the same named review as the episodes, so the three people
          who do that review are the credibility here, with their real faces. ═══ */}
      <Section labelledBy="check-h">
        <Container width="text">
          <Settle>
            <Card className="card-still p-7 sm:p-10">
              <div className="flex items-center">
                {REVIEWERS.map((p, i) => (
                  <div
                    key={p.name}
                    className={`w-[64px] shrink-0 overflow-hidden rounded-full ring-4 ring-raised sm:w-[76px] ${i ? "-ml-4" : ""}`}
                  >
                    <Figure asset={p.asset} rounded="rounded-full" className="aspect-square" sizes="76px" />
                  </div>
                ))}
              </div>
              <h2 id="check-h" className="t-h2 mt-7 max-w-[20ch]">
                Checked by the people who check the episodes
              </h2>
              <p className="t-body mt-5 text-body">
                Every activity in the app maps back to the early years objective behind its episode
                and passes the same review the episode does: educational review, then parent and
                early years review. Nothing is generated and published automatically.
              </p>
              <ul className="mt-7 grid gap-5 sm:grid-cols-3">
                {REVIEWERS.map((p) => (
                  <li key={p.name}>
                    <h3 className="t-sm">{p.name}</h3>
                    <p className="eyebrow mt-1 !text-[11px]">{p.role}</p>
                    <p className="t-sm mt-2 leading-relaxed text-body">{p.line}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <TextLink to="/ethical-ai">The full review sequence<IconArrow size={15} /></TextLink>
              </div>
            </Card>
          </Settle>
        </Container>
      </Section>

      {/* ═══ 4. WHERE IT STANDS, and how to hear. The one deep band. The
          ledger says plainly what is and is not known, which on a pre-launch
          page is the honest version of a launch date. ═══ */}
      <div id="notify" className="scroll-mt-24">
      <Section deep labelledBy="next-h">
        <Container width="wide">
          <Settle className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
            <div>
              <h2 id="next-h" className="t-h2 max-w-[16ch]">Where it stands</h2>
              <dl className="mt-8 max-w-[52ch]">
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Status</dt>
                  <dd className="t-body">{APP_LAUNCHED ? "Available now" : "In development"}</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Stores</dt>
                  <dd className="t-body">
                    {liveLinks.length > 0
                      ? liveLinks.map((l) => l.label).join(" and ")
                      : "Not yet listed. Links will appear here once they are confirmed."}
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-white/15 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-70">Until then</dt>
                  <dd className="t-body">The four released episodes are on YouTube, linked above.</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="t-h3">Hear when it lands</h3>
              <p className="t-body mt-3 max-w-[40ch] opacity-80">
                One email when it is available. No list, no marketing, and we do not share it with
                anyone.
              </p>
              <NotifyForm />
            </div>
          </Settle>
        </Container>
      </Section>
      </div>
    </>
  );
}
