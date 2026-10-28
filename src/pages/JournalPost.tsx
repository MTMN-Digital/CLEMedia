import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Settle } from "@/components/Settle";
import { Wipe } from "@/components/Wipe";
import { Container, Section, TextLink } from "@/components/ui";
import { IconArrow } from "@/components/icons";
import { PostBody } from "@/components/journal/PostBody";
import { Contents, type ContentsRow } from "@/components/journal/Contents";
import { formatDate, usePost, useJournal, resolveStrands } from "@/components/journal/data";
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

   THE TITLE IS THE FIRST THING AT READING SCALE, 2026-10-28. Above it only
   the running head: the way back to "Notes from the studio" on the left and
   the publisher on the right, on one rule. The title is set in .t-h1 (the
   subpage headline size), not the home display face. The page ends on "More
   in {strand}" when the strand holds something else, otherwise on the back
   link under the body: one line, one link, then the footer. The NOT-FOUND
   state is the same running head, a plain h1, two text links and the live
   contents of the journal, so a dead link still shows what will be here.

   CORRECTIONS ARE INLINE. A correction is a paragraph in `body` that begins
   "Correction, {date}." and PostBody renders it like any other paragraph,
   which keeps it on the piece and says what changed. No column, no strike.
   ========================================================================== */

export default function JournalPost() {
  const { slug } = useParams();
  const { state, post, category, siblings } = usePost(slug);

  if (state === "loading") {
    return (
      <Section>
        <Container>
          <BackRail />
          <p className="mt-10 font-mono text-[14.5px] uppercase tracking-[0.16em] text-muted" aria-busy="true">
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
function Spread({ margin, children }: { children: ReactNode; margin: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-24">
      <div className="lg:sticky lg:top-28 lg:self-start">{margin}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* A 44px tap box on a text link, without moving the line it sits on. */
const TAP = "py-2.5 -my-2.5";

function BackRail() {
  return (
    <div className="flex items-center justify-between gap-6 border-b-[1.5px] border-rule pb-5">
      <TextLink to="/journal" className={`${TAP} uppercase tracking-[0.14em]`}>
        <IconArrow size={14} className="rotate-180" />
        Notes from the studio
      </TextLink>
      <span className="hidden font-mono text-[14px] uppercase tracking-[0.18em] text-muted sm:block">
        CL&Eacute; Family Media
      </span>
    </div>
  );
}

function MarginItem({ label, value }: { value: ReactNode; label: string }) {
  return (
    <div>
      <dt className="eyebrow eyebrow-sm">{label}</dt>
      <dd className="mt-1.5 text-[14.5px] leading-[1.5] text-ink">{value}</dd>
    </div>
  );
}

function Article({
  post,
  category,
  siblings,
}: {
  siblings: Post[];
  post: Post;
  category: Category | null;
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
    <dl className="space-y-5">
      {strand && <MarginItem label="Strand" value={strand} />}
      {date && <MarginItem label="Published" value={<span className="tnum">{date}</span>} />}
      {post.author && <MarginItem label="Written by" value={post.author} />}
    </dl>
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

      {/* ═══ THE HEAD. The running head, then the title in the full prose
          column with the standfirst under it. ═══ */}
      {/* The reading pages sit in the DEFAULT container, not the wide one. On
          a 1440 screen a 67 character measure plus a 13rem margin inside the
          1560px cap left the right third of the frame as empty paper, which is
          exactly the fault the rest of this pass is fixing. The piece is a
          block of a fixed size, so it is centred as one. */}
      <Section pad={["normal", "none"]}>
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
              <h1 className="t-h1 max-w-[22ch]">{post.title}</h1>
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
        <Section pad="none" as="div">
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
                  <figcaption className="pt-4 font-mono text-[14.5px] leading-[1.65] text-muted">
                    {post.hero_alt}
                  </figcaption>
                </Container>
              )}
            </figure>
          </Wipe>
        </Section>
      )}

      {/* ═══ THE PIECE. ═══ */}
      <Section pad={["tight", "normal"]}>
        <Container>
          <Spread margin={margin}>
            {post.body ? (
              <PostBody body={post.body} className="max-w-[67ch]" />
            ) : (
              <p className="max-w-[67ch] t-prose text-body">
                {post.excerpt ?? "This piece has no body text yet."}
              </p>
            )}

            <div className="mt-12 border-t-[1.5px] border-rule pt-6 sm:mt-16">
              <TextLink to="/journal" className={TAP}>
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
        <Section pad={["none", "normal"]} labelledBy="more-h">
          <Container>
            <h2 id="more-h" className="t-h2">
              More in {strand ?? "the journal"}
            </h2>
            <Settle as="ol" className="mt-8 border-t-[1.5px] border-rule">
              {siblings.map((s) => (
                <li key={s.id} className="border-b-[1.5px] border-rule">
                  <Link
                    to={`/journal/${s.slug}`}
                    className="group grid gap-x-10 gap-y-2 py-6 sm:py-7 lg:grid-cols-[10rem_minmax(0,1fr)_2rem]"
                  >
                    <span className="tnum font-mono text-[14.5px] uppercase tracking-[0.14em] text-muted">
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

    </>
  );
}

/* The slug resolved to nothing. Kept short and honest: the running head,
   a plain h1, two ways out, then the contents of the journal under a rule.
   With nothing published this is the state every /journal/<slug> reaches,
   and a page that only says "not found" wastes the one thing it could do,
   which is show what will be here. The contents is the SAME component as
   the index, with counts from the CMS, not a second drawing of the list. */
function Missing({ slug }: { slug?: string }) {
  const { posts, categories } = useJournal();
  const rows: ContentsRow[] = resolveStrands(categories).map((s) => ({
    slug: s.slug,
    name: s.name,
    blurb: s.blurb,
    count: s.id ? posts.filter((p) => p.category_id === s.id).length : 0,
  }));

  return (
    <>
      <Seo
        title="Piece not found"
        description="This journal piece could not be found."
        path={`/journal/${slug ?? ""}`}
        noIndex
      />
      <Section pad={["normal", "normal"]}>
        <Container>
          <BackRail />
          <Settle className="mt-10 sm:mt-14">
            <h1 className="t-h1 max-w-[16ch]">We couldn&rsquo;t find that piece</h1>
            <p className="t-body mt-6 max-w-[48ch] text-body">
              It may have been unpublished, or the link may be wrong.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              <TextLink to="/journal" className={TAP}>
                <IconArrow size={15} className="rotate-180" />
                Back to the journal
              </TextLink>
              <TextLink to="/" className={TAP}>
                Home
              </TextLink>
            </div>
          </Settle>

          <div className="mt-14 sm:mt-20">
            <Contents rows={rows} />
          </div>
        </Container>
      </Section>
    </>
  );
}
