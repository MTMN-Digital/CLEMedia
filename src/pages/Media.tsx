import { type ReactNode, useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Container, Section, TextLink } from "@/components/ui";
import { IconExternal, IconArrow } from "@/components/icons";
import { useTeam } from "@/components/team/useTeam";
import { SITE, APP_LAUNCHED } from "@/lib/site";
import { useSetting, useBlock } from "@/lib/content";
import type { AppSetting, MediaItem } from "@/lib/types";
import { PRESS_PORTRAITS, ART, sheetDate, UPDATED } from "@/components/media/press";
import { ContactRow } from "@/components/media/ContactSheet";
import { CopyFacts } from "@/components/media/CopyFacts";
import "@/components/media/kit.css";

/* ============================================================================
   The press kit, rebuilt 2026-10-28 as one typeset sheet.

   WHO READS IT. A journalist or a producer with a deadline, occasionally an
   analyst doing a background check. They need, in two minutes, the company's
   correct name and registration, the founder's name and title, the series
   name with its marks, what has been released, a file they can print or
   embed, and a route to a person who will answer.

   WHAT IT IS. The press sheet itself: one listing on paper in five labelled
   groups (Facts, Spellings and marks, Art for download, Appearances, Press
   route) that a reader goes down and copies from. The art is a contact sheet
   inside the listing, every file with its pixel size, format and weight
   printed under it. Nothing on the page is a claim; every line is a fact
   already published on this site, and each fact points at the page it came
   from.

   WHAT IT IS NOT. A document: no numbered margin, no contents rail, no
   version. The two documents (/ethical-ai, /privacy) own those. And not the
   home hero: no picture behind the title, no headline sentence, no pills, no
   scrim. The title is the company's name and the first screen is the facts.

   WHAT WENT, 2026-10-28. The scrimmed meadow frame with "A UK podcast
   appearance is booked for December" at headline size (one booking with no
   show, date or link is a row, not a sentence); the bench of six slates
   (the show site's object, and its heading was a provenance claim the
   repository cannot stand behind); the four subjects (their links now sit
   on the facts they belong to); the navy band with a button.

   Entries come from `media_items`, which Conor fills from the admin panel.
   The moment a row exists it takes over from the standing rows below.
   ========================================================================== */

/* The words Conor can change from the admin panel. Each entry is the page's
   own wording today; the page renders it unless a saved block replaces it.
   `notes.heading` and `index.heading` no longer render anywhere: they stay
   so a row saved against them survives until the registry retires them. */
export const COPY: Record<string, string> = {
  "kit.title": "CLÉ Family Media",
  "kit.intro":
    "For anyone writing about the company or the series. Everything on this sheet is already published on this site, so a quote can be checked against the page it points to. Larger files and anything not here come through the press route.",
  "art.intro":
    "Every file is at the resolution this site uses, which is web resolution, and its size is printed so nobody has to open it to find out. Each caption says what the file is. Larger files on request through the press route.",
  "people.note": "Portraits are available through the press route.",
  "press.lead":
    "Interview requests, artwork and anything you need checked before you file go through the press route on the contact page. It reaches the team directly.",
  "index.heading": "Appearances, as they are booked.",
  "notes.heading": "Spellings, names and facts, checked before you file.",
};

/* The player's state. APP_LAUNCHED in src/lib/site.ts is the value the page
   is built with; the `app` settings row, which the admin panel writes, takes
   over once it arrives. Both /app and this page read the same row. */
const APP_DEFAULT: AppSetting = { launched: APP_LAUNCHED, target_window: null, app_store_url: null, play_store_url: null };

type FactLink = { label: string; to?: string; href?: string };

interface Fact {
  label: string;
  /** The plain value, which is also what "Copy the facts" writes. */
  value: string;
  /** The page the fact is published on. */
  link?: FactLink;
}

/* The lines a journalist copies. Every value is already on the site: the
   company details on /privacy, the founder on /story, the series and the
   episodes on the show's own site, the player on /app, the imagery on
   /ethical-ai. */
function factsFor(launched: boolean): Fact[] {
  return [
    { label: "Company", value: "CLÉ Family Media, an Irish children's media company. Watch, Play, Learn." },
    {
      label: "Registered",
      value:
        "CLE Family Media 25 Limited, registered in Ireland, company number 820427. Registered office: Curraghs, Liscarroll, Mallow, Co. Cork, P51 K2T9.",
      link: { label: "Privacy policy", to: "/privacy" },
    },
    { label: "Founder", value: "Conor Sexton, Founder and CEO.", link: { label: "Our story", to: "/story" } },
    {
      label: "Series",
      value: "The Pawsitive Pugs & Pals®, an animated series for children aged three to five.",
      link: { label: "The show's own site", href: SITE.showUrl },
    },
    { label: "Characters", value: "Finn, the fawn pug. Fia, the black pug." },
    {
      label: "Episodes",
      value:
        "Series one. Four released and free to watch: The Feather (9:16), The Strawberry (11:10), Chicken Vision (10:41), The Cuckoo (9:58). Two further titles, Colour Quest and Fluffy Clouds, not yet released.",
      link: { label: "The show's own site", href: SITE.showUrl },
    },
    { label: "Where to watch", value: "The show's own site, pawsitivepugs.com." },
    {
      label: "Player",
      value: `${SITE.playerName}™, ${launched ? "released." : "in development, not released."}`,
      link: { label: "App", to: "/app" },
    },
    /* The honest form of the row pulled on 2026-10-08: no claim either way,
       and it points at the page that names the tools. The client's own
       provenance wording replaces it when it arrives (CONTENT-NEEDED). */
    {
      label: "Imagery",
      value:
        "The series is animated. How imagery and voice are produced, and which tools are used where, is set out on the Responsible AI page.",
      link: { label: "Responsible AI", to: "/ethical-ai" },
    },
  ];
}

interface Spelling {
  label: string;
  value: string;
  /** A mono line under the value, for the one row that waits on the client. */
  pending?: string;
}

/* The mistakes the company does not want in print. The glyphs are real
   characters and are described in words beside them, so a reader on a system
   that drops a mark still gets it right. */
const SPELLINGS: Spelling[] = [
  {
    label: "The company",
    value: "CLÉ Family Media, with the É, is the trading name. The registered company is CLE Family Media 25 Limited, without it.",
  },
  { label: "The series", value: "The Pawsitive Pugs & Pals®, with the ampersand and the registered mark on first use." },
  { label: "The player", value: "PupsPlayer™, one word, capital P twice, with the trade mark on first use." },
  { label: "The founder", value: "Conor Sexton. Founder and CEO." },
  { label: "The dogs", value: "Finn and Fia. Finn is the fawn pug, Fia the black pug." },
  /* episodes.ts carries "The Cuckoo" on the client's instruction; the video
     it links to is titled "The Cuckoo's Incredible Journey". Which one the
     press should print is the client's to say, so the row carries the
     short title and the mark until then. */
  { label: "Episode four", value: "The Cuckoo.", pending: "Title for print: to be confirmed" },
];

interface Standing {
  when: string;
  what: string;
  detail: string;
  /** The fields the client has not supplied yet, printed as missing. */
  missing?: string;
  pending?: boolean;
}

/* The standing rows, used until `media_items` has anything in it. The
   booking is the client's own fact and is stated exactly as given: a UK
   podcast, in December, with more expected around the launch. No show name,
   no date, no host, because none has been supplied. */
function standingFor(launched: boolean): Standing[] {
  return [
    {
      when: "December",
      what: "A UK podcast appearance",
      detail: "Booked. Show, episode and link to follow.",
      missing: "Show · Date · Link: to be confirmed",
    },
    {
      when: "To be confirmed",
      what: `More around the ${SITE.playerName}™ launch`,
      detail: launched
        ? `Further appearances are expected as ${SITE.playerName}™ reaches more families.`
        : `Further appearances are expected as ${SITE.playerName}™ launches.`,
      pending: true,
    },
  ];
}

type Load = "empty" | "failed" | "ready" | "loading";

/**
 * The press index and an explicit load state. The standing rows are a written
 * fallback and are correct in every state; any COUNT or "nothing yet" claim
 * waits for a confirmed answer.
 */
function useMediaItems(): { load: Load; items: MediaItem[] | null } {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [load, setLoad] = useState<Load>("loading");

  useEffect(() => {
    let live = true;
    (async () => {
      // Dynamic, like the shop's catalogue: the Supabase client stays out of
      // the bundle every other page downloads.
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) return live && setLoad("failed");
      const { data, error } = await supabase
        .from("media_items")
        .select("id, title, outlet, published_on, description, thumbnail, link, embed_url, sort_order")
        .order("published_on", { ascending: false, nullsFirst: false })
        .order("sort_order", { ascending: true });
      if (!live) return;
      if (error) return setLoad("failed");
      if (data?.length) {
        setItems(data as MediaItem[]);
        setLoad("ready");
      } else {
        setLoad("empty");
      }
    })().catch(() => {
      if (live) setLoad("failed");
    });
    return () => {
      live = false;
    };
  }, []);

  return { items, load };
}

function monthYear(iso: string | null): string {
  if (!iso) return "Undated";
  /* A date-only value is read as year and month directly, so no timezone can
     move it into the previous month. */
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (m) {
    const month = Number(m[2]);
    if (month >= 1 && month <= 12) {
      return new Intl.DateTimeFormat("en-IE", { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(Number(m[1]), month - 1, 1)),
      );
    }
    return "Undated";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Undated";
  return new Intl.DateTimeFormat("en-IE", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

type Entry = { when: string; missing?: string; status: string; key: string; body: string; title: string };

/* ---------------------------------------------------------------------------
   The sheet's own small parts. Plain ruled rows: a 1.5px rule between rows,
   nothing between dt and dd, no leader, no numeral.
--------------------------------------------------------------------------- */

const DT = "font-mono text-[14px] uppercase leading-[1.7] tracking-[0.1em] text-muted";
/* `text-pretty`: the base sheet balances every dd, which on a fact row
   leaves the value wrapped short and ragged. */
const DD = "text-pretty text-[17px] leading-[1.6] text-ink";
const MONO_NOTE = "font-mono text-[13px] uppercase leading-[1.6] tracking-[0.12em] text-muted";
/* Each row carries its rule above it, so the group's own rule closes the
   last row and no two rules ever sit together. 14px of padding on a phone,
   16px from `sm`. */
/* `border-rule`, not `rule-soft`: the soft rule measures 2.02:1 on this paper
   in lines.mjs and the floor is 3:1. */
const ROW = "grid gap-x-8 gap-y-1 border-t-[1.5px] border-rule py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:py-4";

function Row({ label, children }: { children: ReactNode; label: string }) {
  return (
    <div className={ROW}>
      <dt className={DT}>{label}</dt>
      <dd className={DD}>{children}</dd>
    </div>
  );
}

/* A group of the sheet: a rule, a mono label, the rows. Mono labels alone,
   no numerals; the numerals belong to the documents. */
function Group({ id, label, children }: { children: ReactNode; id: string; label: string }) {
  return (
    <section aria-labelledby={id} className="border-t-[1.5px] border-rule pt-6 pb-6 sm:pt-7">
      <h2 id={id} className="font-mono text-[14px] uppercase tracking-[0.14em] text-muted">
        {label}
      </h2>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

function FactLinkOut({ link }: { link: FactLink }) {
  return link.to ? (
    <TextLink to={link.to} className="ml-2 align-baseline">
      {link.label}
      <IconArrow size={14} />
    </TextLink>
  ) : (
    <TextLink href={link.href} className="ml-2 align-baseline">
      {link.label}
      <IconExternal size={13} />
    </TextLink>
  );
}

function NameList({ people }: { people: { name: string; role: string }[] }) {
  return (
    <ul>
      {people.map((p) => (
        <li key={p.name} className="flex flex-wrap items-baseline gap-x-3 py-0.5">
          <span className="text-[17px] leading-[1.5] text-ink">{p.name}</span>
          <span className="font-mono text-[13px] uppercase leading-[1.6] tracking-[0.1em] text-muted">{p.role}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Media() {
  const { items, load } = useMediaItems();
  const { launched } = useSetting("app", APP_DEFAULT);
  const { team, advisors } = useTeam();

  /* The editable words, read in one place so the hooks run in the same
     order on every render. */
  const title = useBlock("media", "kit.title", COPY["kit.title"]);
  const intro = useBlock("media", "kit.intro", COPY["kit.intro"]);
  const artIntro = useBlock("media", "art.intro", COPY["art.intro"]);
  const peopleNote = useBlock("media", "people.note", COPY["people.note"]);
  const pressLead = useBlock("media", "press.lead", COPY["press.lead"]);

  const facts = factsFor(launched);
  const factsText = facts.map((f) => `${f.label}: ${f.value}`).join("\n");

  /* Names and roles only, Conor first, from the same list /team and /contact
     read. Mansi has no portrait and is not listed. Thumbnails arrive only
     when PRESS_PORTRAITS is set after the sitters' consent; until then the
     row renders no `people/*` path at all. */
  const people = [...team, ...advisors].flatMap((m) => (m.asset || m.photo ? [{ name: m.name, role: m.role }] : []));
  /* The same five /contact lists as the readers of the press route. */
  const readers = team.flatMap((m) => (m.asset || m.photo ? [{ name: m.name, role: m.role }] : [])).slice(0, 5);

  const entries: Entry[] = items
    ? items.map((m) => ({
        key: String(m.id),
        when: monthYear(m.published_on),
        title: m.outlet ? `${m.outlet}: ${m.title}` : m.title,
        body: m.description ?? "",
        status: "Published",
      }))
    : standingFor(launched).map((s) => ({
        key: s.what,
        when: s.when,
        title: s.what,
        body: s.detail,
        status: s.pending ? "Expected" : "Booked",
        missing: s.missing,
      }));

  const status =
    load === "ready" && items
      ? `${items.length} ${items.length === 1 ? "entry" : "entries"}`
      : load === "empty"
        ? "Nothing published yet"
        : load === "failed"
          ? "The index could not be loaded"
          : "Loading the index";

  return (
    <>
      <Seo
        title="Press kit"
        description="Facts, spellings, art for download and the press route for anyone writing about CLÉ Family Media or The Pawsitive Pugs & Pals."
        path="/media"
      />

      {/* One surface, paper, from the header to the footer. The title block
          holds at the left; the sheet is the page. */}
      <Section pad="none" className="pt-8 pb-10 sm:pt-12 lg:pt-[4.5rem]">
        <Container width="wide">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-24">
            {/* ═══ THE TITLE BLOCK. The company's name is the title. Not a
                sentence, not a claim. Links, not buttons. ═══ */}
            <Settle className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow eyebrow-sm">Press kit</p>
              <h1 className="t-h1 mt-3 max-w-[12ch] sm:mt-4">{title}</h1>
              <p className={`${MONO_NOTE} mt-4 tnum sm:mt-5`}>Sheet updated {sheetDate(UPDATED)}</p>
              <p className="mt-5 max-w-[44ch] text-[17px] leading-[1.65] text-body sm:mt-6">{intro}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-7">
                <TextLink to="/contact?route=press">
                  Press enquiries
                  <IconArrow size={15} />
                </TextLink>
                <TextLink href={SITE.showUrl}>
                  The show's own site
                  <IconExternal size={14} />
                </TextLink>
              </div>
            </Settle>

            {/* ═══ THE SHEET. Five groups, each a rule, a mono label and
                plain ruled rows. ═══ */}
            <Settle>
              {/* FACTS: the lines a journalist copies. Each one with a page
                  behind it carries the link to that page. */}
              <Group id="kit-facts" label="Facts">
                <dl>
                  {facts.map((f) => (
                    <Row key={f.label} label={f.label}>
                      {f.value}
                      {f.link && <FactLinkOut link={f.link} />}
                    </Row>
                  ))}
                </dl>
                <div className="mt-5">
                  <CopyFacts text={factsText} />
                </div>
              </Group>

              {/* SPELLINGS AND MARKS: the mistakes the company does not want
                  in print. */}
              <Group id="kit-spellings" label="Spellings and marks">
                <dl>
                  {SPELLINGS.map((s) => (
                    <Row key={s.label} label={s.label}>
                      {s.value}
                      {s.pending && <span className={`${MONO_NOTE} mt-1 block`}>{s.pending}</span>}
                    </Row>
                  ))}
                </dl>
              </Group>

              {/* ART FOR DOWNLOAD: the contact sheet, and the only place on
                  this page a show frame appears, small, with a caption that
                  says what it is. */}
              <Group id="kit-art" label="Art for download">
                <p className="max-w-[62ch] text-[17px] leading-[1.65] text-body">{artIntro}</p>
                <dl className="mt-5">
                  {ART.map((row) => (
                    <ContactRow key={row.label} label={row.label} files={row.files} />
                  ))}
                  {/* People: names and roles, no portraits. The sitters have
                      not been asked whether their photographs may be offered
                      for reuse. PRESS_PORTRAITS is the switch, by hand, after
                      written consent. */}
                  {!PRESS_PORTRAITS && (
                    <Row label="People">
                      <NameList people={people} />
                      <p className="mt-3 text-[17px] leading-[1.6] text-body">{peopleNote}</p>
                    </Row>
                  )}
                </dl>
              </Group>

              {/* APPEARANCES: the index with its load state kept exactly as
                  built, because a failed load must never read as "nothing
                  has run". */}
              <Group id="kit-appearances" label="Appearances">
                <p className={MONO_NOTE} role="status">
                  {status}
                </p>
                <dl className="mt-4">
                  {entries.map((e) => (
                    <div key={e.key} className={ROW}>
                      <dt className={DT}>{e.when}</dt>
                      <dd className="grid gap-x-8 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div>
                          <p className="text-[17px] font-semibold leading-[1.4] text-ink">{e.title}</p>
                          {e.body && <p className="mt-1 max-w-[58ch] text-[17px] leading-[1.6] text-body">{e.body}</p>}
                          {e.missing && <p className={`${MONO_NOTE} mt-2`}>{e.missing}</p>}
                        </div>
                        <p className="font-mono text-[14px] uppercase leading-[1.7] tracking-[0.14em] text-muted sm:text-right">
                          {e.status}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* The links sit under the rows rather than inside one, so a
                    row stays one scannable entry. */}
                {items && items.some((m) => m.link) && (
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    {items.filter((m) => m.link).map((m) => (
                      <li key={m.id}>
                        <TextLink href={m.link as string}>
                          Open {m.title}
                          <IconExternal size={14} />
                        </TextLink>
                      </li>
                    ))}
                  </ul>
                )}

                {load === "failed" && (
                  <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.65] text-body">
                    The index could not be loaded just now, so the standing entries above are what is
                    known. Please try again shortly, or ask through the press route.
                  </p>
                )}
                {load === "empty" && (
                  <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.65] text-body">
                    No coverage has run yet, so there is none on this page. The first piece to run
                    takes the next place on the shelf, with its outlet, its date and a link to the
                    original.
                  </p>
                )}
              </Group>

              {/* PRESS ROUTE: a person. */}
              <Group id="kit-route" label="Press route">
                <dl>
                  <Row label="Enquiries">
                    <span className="block max-w-[58ch]">{pressLead}</span>
                    <span className="mt-3 block">
                      <TextLink to="/contact?route=press">
                        Press enquiries
                        <IconArrow size={15} />
                      </TextLink>
                    </span>
                  </Row>
                  <Row label="Who reads it">
                    <NameList people={readers} />
                  </Row>
                </dl>
              </Group>

              {/* The sheet ends as a sheet does. */}
              <p className="hairline mt-2 pt-6 font-mono text-[14.5px] uppercase tracking-[0.2em] text-muted">Ends</p>
            </Settle>
          </div>
        </Container>
      </Section>
    </>
  );
}
