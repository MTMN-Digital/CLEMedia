import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Button, Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PostBody } from "@/components/journal/PostBody";
import { STRANDS, formatDate, usePost } from "@/components/journal/data";
import { SITE } from "@/lib/site";
import type { Category, Post } from "@/lib/types";

/* ============================================================================
   The post template.

   Every piece ever published on this site renders through this file, so it is
   worth more than the thirty nine lines it used to be. What was here before
   was the "post not found" state and a comment saying the real thing would be
   built when the CMS was connected.

   THE LAYOUT IS THE FOUNDER'S STORY'S. One margin on the left carrying what a
   skimmer wants (the strand, the date, who wrote it, the way back) and one
   column of prose on the right at a 67 character measure, which is inside the
   65 to 70 a line of body type is comfortable at. The margin is sticky on
   desktop, so the piece's identity stays beside the paragraph being read. The
   header sits on the same grid as the body, so the margin rule runs the full
   height of the page rather than starting halfway down it.

   WHAT THE PAGE WILL NOT DO is invent a reading time, a related piece, an
   author it was not given or a date it was not given. A post with no author
   simply has no byline. The entire margin is built from columns that exist in
   `posts`, and src/components/journal/PostBody.tsx renders `body` without ever
   handing a string to the DOM as HTML.
   ========================================================================== */

export default function JournalPost() {
  const { slug } = useParams();
  const { state, post, category, siblings } = usePost(slug);

  if (state === "loading") {
    return (
      <Section>
        <Container>
          <BackRail />
          <p className="mt-10 font-mono text-[12px] uppercase tracking-[0.16em] text-muted" aria-busy="true">
            Fetching this piece
          </p>
        </Container>
      </Section>
    );
  }

  if (state === "missing" || !post) return <Missing slug={slug} />;

  return <Article post={post} category={category} siblings={siblings} />;
}

/* ----------------------------------------------------------------------------
   The grid. Shared by the header and the body so they sit on one margin.
---------------------------------------------------------------------------- */
function Spread({ margin, children }: { margin: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-24">
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function BackRail() {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-rule pb-5">
      <TextLink to="/journal" className="!text-[13px] uppercase tracking-[0.14em]">
        <IconArrow size={14} className="rotate-180" />
        The journal
      </TextLink>
      <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted sm:block">
        CL&Eacute; Family Media
      </span>
    </div>
  );
}

function MarginItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="eyebrow !text-[11px]">{label}</dt>
      <dd className="mt-1.5 text-[14.5px] leading-[1.5] text-ink">{value}</dd>
    </div>
  );
}

function Article({
  post,
  category,
  siblings,
}: {
  post: Post;
  category: Category | null;
  siblings: Post[];
}) {
  const date = formatDate(post.published_at);
  const strand = category?.name ?? null;
  const description =
    post.excerpt ?? `A piece from Notes from the studio, the journal of ${SITE.name}.`;

  /* Article JSON-LD, built only from columns that have a value. An absent
     author or date is absent from the markup rather than guessed at. */
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    url: `${SITE.url}/journal/${post.slug}`,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
    ...(post.hero_image ? { image: post.hero_image } : {}),
    ...(strand ? { articleSection: strand } : {}),
  };

  const margin = (
    <>
      <dl className="space-y-5">
        {strand && <MarginItem label="Strand" value={strand} />}
        {date && <MarginItem label="Published" value={<span className="tnum">{date}</span>} />}
        {post.author && <MarginItem label="Written by" value={post.author} />}
      </dl>
      <div className="mt-8 hidden lg:block">
        <TextLink to="/journal" className="!text-[14px]">
          <IconArrow size={14} className="rotate-180" />
          All pieces
        </TextLink>
      </div>
    </>
  );

  return (
    <>
      <Seo
        title={post.title}
        description={description}
        path={`/journal/${post.slug}`}
        type="article"
        image={post.hero_image ?? undefined}
        jsonLd={jsonLd}
      />

      {/* ═══ THE HEAD. The title takes the hero face and the full prose
          column, with the standfirst under it and the byline on a rule, the
          way a feature opens. ═══ */}
      {/* The reading pages sit in the DEFAULT container, not the wide one. On
          a 1440 screen a 67 character measure plus a 13rem margin inside the
          1560px cap left the right third of the frame as empty paper, which is
          exactly the fault the rest of this pass is fixing. The piece is a
          block of a fixed size, so it is centred as one. */}
      <Section className="!pb-0">
        <Container>
          <BackRail />
          <Settle className="mt-10 sm:mt-14">
            <Spread
              margin={
                strand ? (
                  <p className="eyebrow">{strand}</p>
                ) : (
                  <span className="hidden lg:block" aria-hidden="true" />
                )
              }
            >
              <h1 className="max-w-[20ch] font-hero text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.02em] text-ink">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="t-lead mt-7 max-w-[56ch] text-body">{post.excerpt}</p>
              )}
              {/* No byline rule under the standfirst. It carried the author and
                  the date, which the margin two centimetres to its left already
                  carries, and on a phone the two landed one after the other. */}
            </Spread>
          </Settle>
        </Container>
      </Section>

      {/* ═══ THE IMAGE, if the piece has one. Edge to edge: a photograph set
          inside a 67 character column is a thumbnail. `hero_alt` is the
          caption as well as the alternative text, because a caption a reader
          can see is worth more than one only a screen reader hears. ═══ */}
      {post.hero_image && (
        <Section className="!py-0" as="div">
          <Wipe className="mt-12 sm:mt-16">
            <figure>
              <img
                src={post.hero_image}
                alt={post.hero_alt ?? ""}
                className="h-[clamp(240px,42vw,620px)] w-full object-cover"
                loading="eager"
                decoding="async"
              />
              {post.hero_alt && (
                <Container>
                  <figcaption className="pt-4 font-mono text-[12px] leading-[1.65] text-muted">
                    {post.hero_alt}
                  </figcaption>
                </Container>
              )}
            </figure>
          </Wipe>
        </Section>
      )}

      {/* ═══ THE PIECE. ═══ */}
      <Section className="!pt-14 sm:!pt-16">
        <Container>
          <Spread margin={margin}>
            {post.body ? (
              <PostBody body={post.body} className="max-w-[67ch]" />
            ) : (
              <p className="max-w-[67ch] text-[17.5px] leading-[1.75] text-body">
                {post.excerpt ?? "This piece has no body text yet."}
              </p>
            )}

            <div className="mt-12 border-t border-rule pt-6 sm:mt-16">
              <TextLink to="/journal">
                <IconArrow size={15} className="rotate-180" />
                Back to the journal
              </TextLink>
            </div>
          </Spread>
        </Container>
      </Section>

      {/* ═══ THE REST OF THE STRAND. Rows, and only when the strand actually
          holds something else. An empty "related pieces" heading is worse
          than no heading. ═══ */}
      {siblings.length > 0 && (
        <Section className="!pt-0" labelledBy="more-h">
          <Container>
            <h2 id="more-h" className="t-h2">
              More in {strand ?? "the journal"}
            </h2>
            <Settle as="ol" className="mt-8 border-t border-rule">
              {siblings.map((s) => (
                <li key={s.id} className="border-b border-rule">
                  <Link
                    to={`/journal/${s.slug}`}
                    className="group grid gap-x-10 gap-y-2 py-6 sm:py-7 lg:grid-cols-[10rem_minmax(0,1fr)_2rem]"
                  >
                    <span className="tnum font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
                      {formatDate(s.published_at) ?? ""}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[clamp(1.2rem,1.05rem+0.7vw,1.6rem)] leading-[1.16] text-ink">
                        {s.title}
                      </span>
                      {s.excerpt && (
                        <span className="t-body mt-2 block max-w-[62ch] text-body">{s.excerpt}</span>
                      )}
                    </span>
                    <span className="hidden self-center text-muted transition-colors group-hover:text-red-deep lg:block">
                      <IconArrow size={18} />
                    </span>
                  </Link>
                </li>
              ))}
            </Settle>
          </Container>
        </Section>
      )}

      <Close />
    </>
  );
}

/* The close, on the one deep band this page spends. Two routes out and
   nothing else: a piece that has been read to the end has earned a quiet
   ending rather than a subscription form. */
function Close() {
  return (
    <Section deep>
      <Container width="wide">
        <Settle className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow">Notes from the studio</p>
            <h2 className="t-h2 mt-5 max-w-[16ch]">The journal of CL&Eacute; Family Media</h2>
          </div>
          <div>
            <p className="t-body max-w-[46ch] opacity-85">
              Four strands: the research, how the work is made, writing for parents, and the
              business of building this company in Ireland.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/journal">
                Every piece
                <IconArrow size={16} />
              </Button>
              <Button to="/contact" variant="quiet">
                Suggest a subject
              </Button>
            </div>
          </div>
        </Settle>
      </Container>
    </Section>
  );
}

/* The slug resolved to nothing. Kept short, kept honest, and it keeps the
   template's own chrome so a reader who followed a dead link still lands
   somewhere that looks like the journal. */
function Missing({ slug }: { slug?: string }) {
  return (
    <>
      <Seo
        title="Piece not found"
        description="This journal piece could not be found."
        path={`/journal/${slug ?? ""}`}
        noIndex
      />
      <Section>
        <Container>
          <BackRail />
          {/* The dead end carries the contents of the journal beside it. With
              nothing published, this is the state a reader reaches from any
              /journal/<slug>, and a page that only says "not found" wastes the
              one thing it could usefully do, which is say what will be here. */}
          <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-16">
            <Settle className="max-w-[52ch]">
              <h1 className="font-hero text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] font-normal leading-[1.04] tracking-[-0.02em] text-ink">
                We couldn&rsquo;t find that piece
              </h1>
              <p className="t-lead mt-6 text-body">
                It may have been unpublished, or the link may be wrong. The journal index has
                everything that is live, and the four strands it will fill up with.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/journal">
                  Back to the journal
                  <IconArrow size={16} />
                </Button>
                <Button to="/" variant="quiet">
                  Home
                </Button>
              </div>
            </Settle>

            <div className="lg:pt-3">
              <p className="eyebrow">The four strands</p>
              <ul className="mt-4 border-t border-rule">
                {STRANDS.map((s) => (
                  <li
                    key={s.slug}
                    className="flex items-baseline justify-between gap-4 border-b border-rule py-3.5"
                  >
                    <span className="text-[15px] font-semibold text-ink">{s.name}</span>
                    <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                      In preparation
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
