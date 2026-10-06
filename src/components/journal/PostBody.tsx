import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/* ============================================================================
   The prose renderer.

   `posts.body` is a plain text column and the admin panel is a textarea, so
   what arrives here is whatever Conor typed. This turns a small, familiar
   subset of Markdown into the site's own type: headings, a pull quote, lists,
   a rule, links, emphasis and an image.

   WHY NOT dangerouslySetInnerHTML AND A RICH TEXT EDITOR. Two reasons, and
   the second is the real one. Rendering stored HTML puts an injection path
   through the public site for the sake of a convenience in an admin panel one
   person uses. And a rich text editor hands the author control of type: the
   pasted 11px Times, the stray colour, the three different heading sizes.
   Here the author controls structure and the site controls appearance, which
   is why every future post will look like it belongs to this site.

   Everything is escaped by construction: nothing in this file ever builds a
   DOM node from a string, so a post body containing <script> renders as the
   characters a reader typed.

   THE MEASURE. The column is set at 67 characters by the page, which is in
   the 65 to 70 a line of body type wants. Only the pull quote and a figure
   break it, and they break it by a little, so the reader's eye never has to
   find a new left edge for long.
   ========================================================================== */

type Block =
  | { kind: "p"; text: string }
  | { kind: "h2" | "h3"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "rule" }
  | { kind: "img"; src: string; alt: string };

const IMG = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const BULLET = /^[-*]\s+(.*)$/;
const NUMBER = /^\d+[.)]\s+(.*)$/;

/** Markdown subset, block level. Unknown syntax is left as literal text
 *  rather than dropped: losing a sentence is worse than printing a stray
 *  character, because only one of the two is visible to the person who typed
 *  it. */
export function parseBody(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ kind: "rule" });
      i += 1;
      continue;
    }
    const img = line.match(IMG);
    if (img) {
      blocks.push({ kind: "img", alt: img[1], src: img[2] });
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ kind: "h3", text: line.slice(4) });
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ kind: "h2", text: line.slice(3) });
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      /* A post's own title is rendered by the page, so a top level heading in
         the body is a section heading, not a second H1. */
      blocks.push({ kind: "h2", text: line.slice(2) });
      i += 1;
      continue;
    }
    if (line.startsWith(">")) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        parts.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "quote", text: parts.join(" ").trim() });
      continue;
    }
    if (BULLET.test(line) || NUMBER.test(line)) {
      const ordered = !BULLET.test(line);
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = ordered ? t.match(NUMBER) : t.match(BULLET);
        if (!m) break;
        items.push(m[1]);
        i += 1;
      }
      blocks.push({ kind: ordered ? "ol" : "ul", items });
      continue;
    }

    /* A paragraph runs to the next blank line. Single newlines inside it are
       soft wraps in the textarea, not line breaks the reader asked for. */
    const parts: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i].trim())) {
      parts.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ kind: "p", text: parts.join(" ") });
  }

  return blocks;
}

function isBlockStart(line: string): boolean {
  return (
    line.startsWith("#") ||
    line.startsWith(">") ||
    BULLET.test(line) ||
    NUMBER.test(line) ||
    IMG.test(line) ||
    /^(-{3,}|\*{3,}|_{3,})$/.test(line)
  );
}

/* Inline: a link, bold, or emphasis. One pass, one regex, so the order the
   author wrote them in is the order they render in. */
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = new RegExp(INLINE.source, "g");
  let last = 0;
  let n = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [full, linkText, href, bold, star, under] = m;
    const k = `${key}-${n}`;
    if (linkText && href) {
      out.push(
        href.startsWith("/") ? (
          <Link key={k} to={href} className="link-draw font-semibold text-red-deep">
            {linkText}
          </Link>
        ) : (
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw font-semibold text-red-deep"
          >
            {linkText}
          </a>
        )
      );
    } else if (bold) {
      out.push(
        <strong key={k} className="font-semibold text-ink">
          {bold}
        </strong>
      );
    } else {
      out.push(<em key={k}>{star ?? under}</em>);
    }
    last = m.index + full.length;
    n += 1;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function PostBody({ body, className = "" }: { body: string; className?: string }) {
  const blocks = parseBody(body);

  return (
    <div className={`text-[17.5px] leading-[1.75] text-body ${className}`}>
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.kind) {
          case "h2":
            return (
              <h2
                key={key}
                className="t-h2 mb-4 mt-12 first:mt-0 sm:mb-5 sm:mt-16"
              >
                {inline(b.text, key)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} className="mb-3 mt-10 text-[1.25rem] font-bold text-ink first:mt-0 sm:mt-12">
                {inline(b.text, key)}
              </h3>
            );
          case "quote":
            /* The same pull quote the founder's story uses: two rules and the
               display face, with the marks hung in the margin. Not a box with
               a coloured left edge. */
            return (
              <blockquote key={key} className="my-10 border-y border-rule py-8 sm:-mx-6 sm:my-14 sm:px-6 sm:py-10">
                <p className="max-w-[26ch] pl-[0.45em] font-display text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] leading-[1.18] text-ink [text-indent:-0.45em]">
                  <span className="text-red-deep" aria-hidden="true">
                    &ldquo;
                  </span>
                  {inline(b.text, key)}
                  <span className="text-red-deep" aria-hidden="true">
                    &rdquo;
                  </span>
                </p>
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="my-6 space-y-3">
                {b.items.map((it, j) => (
                  <li key={`${key}-${j}`} className="relative pl-6">
                    <span
                      className="absolute left-0 top-[0.72em] h-[6px] w-[6px] rounded-full bg-[var(--color-red)]"
                      aria-hidden="true"
                    />
                    {inline(it, `${key}-${j}`)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="my-6 space-y-3">
                {b.items.map((it, j) => (
                  <li key={`${key}-${j}`} className="relative pl-9">
                    <span
                      className="tnum absolute left-0 top-[0.2em] font-mono text-[13px] text-muted"
                      aria-hidden="true"
                    >
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    {inline(it, `${key}-${j}`)}
                  </li>
                ))}
              </ol>
            );
          case "rule":
            return <hr key={key} className="my-10 border-0 border-t border-rule sm:my-14" />;
          case "img":
            return (
              <figure key={key} className="my-10 sm:-mx-6 sm:my-14">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-[var(--radius-md)]"
                />
                {b.alt && (
                  <figcaption className="mt-3 font-mono text-[12px] leading-[1.6] text-muted">
                    {b.alt}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return (
              <p key={key} className="mt-6 first:mt-0">
                {inline(b.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
