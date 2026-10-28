import type { ReactNode } from "react";
import { Seo } from "@/components/Seo";
import { RealDogs } from "@/components/story/RealDogs";
import { Figure } from "@/components/Figure";
import { Settle } from "@/components/Settle";
import { MissionVideo } from "@/components/MissionVideo";
import { ClosingLine } from "@/components/ClosingLine";
import { Container, Section, TextLink } from "@/components/ui";
import { DrawnRule } from "@/components/draw/kit";
import { Watermark } from "@/components/draw/Mark";
import { IconExternal, IconArrow } from "@/components/icons";
import { SITE } from "@/lib/site";
import { useTeam } from "@/components/team/useTeam";
import { splitParagraphs, useBlock, useImageBlock } from "@/lib/content";
import { COPY } from "@/components/story/copy";

/* ============================================================================
   The founder's story: a letter, signed.

   WHAT THIS PAGE IS. A letter from Conor Sexton to someone weighing up the
   company: an investor, a broadcaster, an educator, a parent. It is in his
   voice, first person, and it answers one question, which is whether there
   is a real person and a real reason behind the name.

   THE KIND OF PAGE DECIDES THE SHAPE, 2026-10-28. The page opens the way a
   letter opens (the writer, where he is writing from, the first sentence) and
   closes the way one closes (a name, then a postscript). Everything between
   is one continuous measure of his prose that only breaks for things he is
   showing you: the garden the show is set in, the characters that came out
   of it, and the two real dogs they were named after.

   No frame, no ground, no scrim, no claim. The first screen is a photograph
   of a man on paper and the first sentence of his own letter in the subpage
   headline size; the picture is beside the type, not behind it. There is one
   surface from the header to the footer, because the voice does not change.

   WHAT LEFT. The scrimmed garden with the headline on it, the "Our story"
   eyebrow and the aside, the pill pair, the margin headings and the 1.5px
   margin rule, the full-width pull quote (it repeated paragraph two word for
   word), the sunken well and the "short version" ledger (the letter read a
   second time as a CV), the four-face strip (the team page owns faces), the
   wall ground under the film, and the navy band with its three rows (every
   one of its links is inside the letter now). Nothing of his prose was cut:
   a sentence that had been lifted into a heading went back where it came
   from.

   THE GRID. One column template, repeated by every block of the letter so
   the prose always shares one left edge:

     xl  30rem portrait and margin | 38rem letter | the rest (objects)
     lg  18rem margin              | the letter and its objects
     under 1024, one column

   Column one carries the portrait and nothing else for the length of the
   page. That is the left margin of a letter. It never carries labels, notes
   or links.

   EVERY FACT HERE IS THE CLIENT'S. The dateline carries no year until the
   client gives one; the P.S. states the film's length as measured (ffprobe,
   63.85 s); nothing on the page says who narrates the film.
   ========================================================================== */

/* The column template for the letter, from 2026-10-28. The letter runs from
   the container's own left edge, the portrait's edge, at lead size in a wide
   measure; the right column holds side notes (the characters frame) and
   pictures span both. The client found the earlier narrow letter column,
   set in from the left with pictures hanging off it, looked off centre. */
const GRID = "grid lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)] lg:gap-x-16";
/* The opening only: the portrait, then the dateline and headline beside it. */
const OPEN_GRID = "grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[30rem_minmax(0,1fr)]";
/* The letter: column one, running text at lead size. */
const PROSE = "space-y-6 t-lead text-body";
/* A plate inside the letter: both columns, the container's full width. */
const PLATE = "lg:col-span-2";

/* A provenance line under a picture. Mono, 13px, `text-body` rather than
   muted (muted is the floor of AA on the lightest paper). Right-aligned from
   lg; on a phone a right-aligned caption hangs off the picture it belongs
   to, so it sits left. */
function Caption({ children, className = "" }: { className?: string; children: ReactNode }) {
  return (
    <figcaption className={`mt-3 max-w-[60ch] font-mono text-[13px] leading-[1.6] tracking-[0.02em] text-body lg:ml-auto lg:text-right ${className}`}>
      {children}
    </figcaption>
  );
}

/* The registered and trade marks set as superscripts, so an editor can type
   the mark as a character and the page still sets it the way the rest of
   the site does. Built from React elements, never HTML. */
function Marks({ text }: { text: string }) {
  const parts = text.split(/([®™])/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "®" || part === "™" ? (
          <sup key={i} className="text-[0.7em]">{part}</sup>
        ) : (
          part
        ),
      )}
    </>
  );
}

/* The show's title inside running text is a titled work, so it is <cite>,
   italic in the body face and the body colour. The split is on the name as
   site.ts spells it, so an edited paragraph keeps the treatment as long as
   it keeps the spelling. */
function WithCite({ text }: { text: string }) {
  const parts = text.split(SITE.showName);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <cite className="italic text-inherit">{SITE.showName}</cite>}
          {part}
        </span>
      ))}
    </>
  );
}

export function Story() {
  /* Conor's portrait, read through useTeam() so a photo changed in the
     admin's Team panel changes here too. The story page's own image block
     wins over it when one is saved. */
  const { team } = useTeam();
  const conor = team.find((m) => m.name === "Conor Sexton");

  /* EDITABLE FROM THE ADMIN. Every string below is the page's own wording
     (components/story/copy.ts) until a content_blocks row replaces it, so
     with nothing saved the letter reads exactly as written. Hooks are called
     unconditionally, the same number of times on every render. The headline
     is rendered as plain text: nothing on this page sets a clause apart. */
  const dateline = useBlock("story", "hero.eyebrow_sub", COPY["hero.eyebrow_sub"]);
  const heroTitle = useBlock("story", "hero.title", COPY["hero.title"]);
  const heroImage = useImageBlock("story", "hero.image");
  const letterOpen = useBlock("story", "letter.open", COPY["letter.open"]);
  const letterSaw = splitParagraphs(useBlock("story", "letter.saw", COPY["letter.saw"]));
  const gardenCaption = useBlock("story", "garden.caption", COPY["garden.caption"]);
  const letterHere = splitParagraphs(useBlock("story", "letter.here", COPY["letter.here"]));
  const letterPeople = useBlock("story", "letter.people", COPY["letter.people"]);
  const letterBuild = splitParagraphs(useBlock("story", "letter.build", COPY["letter.build"]));
  const buildLink = useBlock("story", "build.link", COPY["build.link"]);
  const charactersCaption = useBlock("story", "characters.caption", COPY["characters.caption"]);
  const letterReach = splitParagraphs(useBlock("story", "letter.reach", COPY["letter.reach"]));
  const showLink = useBlock("story", "reach.show_link", COPY["reach.show_link"]);
  const appLink = useBlock("story", "reach.app_link", COPY["reach.app_link"]);
  const nextLead = useBlock("story", "next.lead", COPY["next.lead"]);
  const nextLink = useBlock("story", "next.link", COPY["next.link"]);
  const signName = useBlock("story", "sign.name", COPY["sign.name"]);
  const signRole = useBlock("story", "sign.role", COPY["sign.role"]);
  const filmPs = useBlock("story", "film.ps", COPY["film.ps"]);
  const filmNote = useBlock("story", "film.note", COPY["film.note"]);
  const closeLine = useBlock("story", "close.line", COPY["close.line"]);
  const closeLink = useBlock("story", "close.link", COPY["close.link"]);

  /* One line per row: name, title, place. The year joins the place line only
     when the client supplies it in the admin; the page sets no date. */
  const datelineLines = dateline.split(/\s*\n\s*/).map((l) => l.trim()).filter(Boolean);

  return (
    <>
      <Seo
        title="Our story"
        description="Conor Sexton on why he founded CLÉ Family Media: the media young children encounter, becoming a parent, and building a practical alternative with creative and education specialists."
        path="/story"
      />

      {/* ═══ THE LETTER, from the opening to the characters. One section, one
          surface. ═══ */}
      <Section labelledBy="story-h" pad={["normal", "tight"]} className="mk-host">
        {/* A leaf at watermark strength behind the letter, from 2026-10-28:
            the client asked for the drawings a little more often. */}
        <Watermark shape="leaf" at="right" />
        <Container width="wide">
          {/* THE OPENING: the writer, where he is writing from, the first
              sentence. The page's one entrance: portrait, dateline, headline
              and first paragraph settle in that order.

              At xl the portrait is 480px square in column one and the name
              block and headline sit beside it; the letter starts below, at
              the portrait's left edge. At 390 the portrait is 152px and
              shares a row with the dateline, so the headline is reached in
              one screen: stacking a full-width portrait over three mono
              lines over a six-line headline would push the first paragraph
              past 1,100px. */}
          <Settle className={`${OPEN_GRID} grid-cols-[152px_minmax(0,1fr)] gap-x-5 sm:grid-cols-[12rem_minmax(0,1fr)]`}>
            <div className="self-start lg:row-span-3">
              <Figure
                asset="person.conor"
                override={heroImage ?? conor?.photo ?? null}
                rounded="rounded-[var(--radius-md)]"
                className="aspect-square"
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 288px, (min-width: 640px) 192px, 152px"
                priority
              />
            </div>
            {/* The dateline. Plain mono lines, as a letter has: not a label
                over the page, and not status rows. */}
            <p className="self-center font-mono text-[14px] uppercase leading-[1.7] tracking-[0.02em] text-body lg:col-start-2 lg:self-start">
              {datelineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </p>
            {/* Sentence one of the letter, verbatim. A fact, not a claim.
                Plain text: never passed through an emphasis helper. */}
            <h1 id="story-h" className="t-h1 col-span-2 mt-10 max-w-[24ch] lg:col-span-1 lg:col-start-2">
              {heroTitle}
            </h1>
          </Settle>

          {/* MOVEMENT ONE: what he saw. Continuous prose, no headings, no
              margin rule. The paragraph gap carries across the block edge so
              the letter never breaks its own rhythm. */}
          <Settle className={`${GRID} mt-14 lg:mt-20`}>
            <div className={PROSE}>
              <p>{letterOpen}</p>
              {letterSaw.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Settle>

          {/* THE GARDEN, inside the letter. The measure breaks for the first
              time: the frame spans the full container. Content with a caption that
              says what it is; it is never behind type. Centre 45 per cent
              keeps both pugs on the grass in frame. */}
          <Settle className={`${GRID} my-10 sm:my-12`}>
            <figure className={PLATE}>
              <Figure
                asset="story.garden"
                rounded="rounded-[var(--radius-md)]"
                position="center 45%"
                sizes="(min-width: 1440px) 1376px, 100vw"
              />
              <Caption><Marks text={gardenCaption} /></Caption>
            </figure>
          </Settle>

          {/* MOVEMENT TWO: how he got here. Four paragraphs, as written. The
              ledger that used to restate them as a CV is gone; every one of
              its facts is in these paragraphs. */}
          <Settle className={GRID}>
            <div className={PROSE}>
              {letterHere.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Settle>

          {/* MOVEMENT THREE: the people, and the characters. Paragraph nine
              names the people; the frame of the characters stands beside the
              paragraph that names Finn and Fia, laid straight, not tilted: a
              frame laid straight beside prose reads as an enclosure. From lg it
              sits in the right column beside paragraphs 10 and 11 (rows 1
              and 2); under lg it falls in flow between them. */}
          <Settle className={`${GRID} mt-5`}>
            <div className={PROSE}>
              <p>{letterPeople}</p>
            </div>
          </Settle>
          <Settle className={`${GRID} mt-5`}>
            <div className={PROSE}>
              {letterBuild.slice(0, 1).map((p, i) => <p key={i}><WithCite text={p} /></p>)}
            </div>
            {/* No card around it: the card's picture border measures under
                3:1 on paper, and the garden above sits on the paper without
                one, so this frame does the same. */}
            <figure className="mt-8 max-w-[22rem] self-start lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0">
              <Figure asset="home.characters" rounded="rounded-[var(--radius-md)]" sizes="352px" />
              <Caption>{charactersCaption}</Caption>
            </figure>
            <div className={`${PROSE} mt-8 lg:mt-6`}>
              {letterBuild.slice(1).map((p, i) => <p key={i}><WithCite text={p} /></p>)}
              <p className="pt-1">
                <TextLink to="/ethical-ai">{buildLink}<IconArrow size={15} /></TextLink>
              </p>
            </div>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE ENCLOSURE. The eight photographs of the real Finn and Fia,
          straight after the drawn pair. The one time the page leaves the
          letter's own columns, and the one place on the site where real
          photography stands at scale. Asked for by the client on 2026-10-24;
          see components/story/RealDogs.tsx for the framing. ═══ */}
      <Section labelledBy="dogs-h" pad="tight">
        <Container width="wide">
          <RealDogs headingId="dogs-h" />
        </Container>
      </Section>

      {/* ═══ THE LETTER, continued: how it reaches you, the signature, the
          postscript, the closing line. Same surface, same columns. ═══ */}
      <Section as="div" pad={["tight", "normal"]}>
        <Container width="wide">
          {/* MOVEMENT FOUR. The two routes out sit in the measure as an
              inline list, and the last paragraph carries the one invitation
              in his own words, followed by its link. */}
          <Settle className={GRID}>
            <div className={PROSE}>
              {letterReach.map((p, i) => <p key={i}>{p}</p>)}
              <ul className="flex flex-wrap gap-x-10 gap-y-3 pt-1">
                <li>
                  <TextLink href={SITE.showUrl}>{showLink}<IconExternal size={14} /></TextLink>
                </li>
                <li>
                  {/* One span: TextLink is an inline-flex with a gap, and a
                      bare <sup> beside the name would float off the word. */}
                  <TextLink to="/app">
                    <span><Marks text={appLink} /></span>
                    <IconArrow size={15} />
                  </TextLink>
                </li>
              </ul>
              <p className="pt-3">{nextLead}</p>
              <p>
                <TextLink to="/contact">{nextLink}<IconArrow size={15} /></TextLink>
              </p>
            </div>
          </Settle>

          {/* THE SIGNATURE. A short rule, a typeset name, a mono line. Not a
              script face and not a drawn signature: a typeset name is how a
              company letter is signed. The felted "Made in Ireland" badge
              belongs in the right column beside the name once the client
              supplies it as a PNG; until then the column is empty, with no
              stand-in. */}
          <Settle className={`${GRID} mt-14`}>
            <div>
              <DrawnRule v={1} className="max-w-[10rem]" />
              {/* A <p>, not an h2 (a heading here would be out of order), so
                  the display face is set on the element: .t-h2 carries only
                  size, leading and tracking; Calistoga comes from the h1, h2
                  rule, which a <p> never reaches. */}
              <p className="t-h2 mt-6 font-display text-ink">{signName}</p>
              <p className="mt-2 font-mono text-[14px] uppercase leading-[1.7] tracking-[0.02em] text-body">{signRole}</p>
            </div>
          </Settle>

          {/* THE POSTSCRIPT. The film, on paper like everything else, with
              one mono line above it and the credit under it. No heading: the
              page says nothing about who is speaking until the client
              confirms the narration. The length is as measured on the file
              (63.85 s). */}
          <Settle className={`${GRID} mt-16`}>
            <figure className={PLATE} aria-label="The mission film">
              <p className="font-mono text-[14px] leading-[1.7] tracking-[0.02em] text-body">{filmPs}</p>
              <MissionVideo className="mt-4" />
              <Caption>{filmNote}</Caption>
            </figure>
          </Settle>

          {/* THE CLOSING LINE. One sentence and one link, story to team, then
              the footer. */}
          <Settle className={`${GRID} mt-16`}>
            <ClosingLine link={{ to: "/team", label: closeLink }}>
              {closeLine}
            </ClosingLine>
          </Settle>
        </Container>
      </Section>
    </>
  );
}

/* App.tsx lazy-loads the default; the named export is the one the admin run's
   registry checks for. Same component. */
export default Story;
