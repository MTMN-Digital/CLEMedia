import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Settle } from "@/components/Settle";
import type { Product } from "@/lib/types";
import { Cover } from "@/components/shop/Cover";
import { fileFormat, formatLabel, paragraphs, formatPrice } from "@/components/shop/catalogue";
import { packFor, coverFor } from "@/components/shop/samples";
import { Stage } from "@/components/render";
import { PACKS } from "@/lib/books";

/* ============================================================================
   The shelf: the shop's products as covers on the bench, one per episode in
   the admin's running order, each the same size at the true A4 landscape
   proportion of the file the buyer prints. The item is the link; there is no
   button, no chip, no badge, because the episode's own title and motif on
   the cover do the differentiating.

   Rebuilt 2026-10-28 from the lit studio shelf (rk-studio, lamp poses, the
   "Downloads / One file each" head), which drew six slabs at six angles over
   an empty catalogue. The price on a tag is the one the database returned;
   the book count comes from the episode's pack (src/lib/books.ts) or, for a
   row that names no episode, from the lines of its description's first
   paragraph, one line per book; and when neither can count, the tag names
   the format instead.
   ========================================================================== */

/* Measured, not guessed: 432px at 1440, 448px at 1000, the column less 40px
   below that. "100vw" on a phone tipped a 412px screen into the 1440px file,
   and the first cover is the page's largest paint. */
const SIZES = "(min-width: 900px) 450px, calc(100vw - 40px)";

/** "3 books", or "zip of PDFs" when nothing on the row counts books. */
export function bookCount(p: Product): string {
  const pack = packFor(p);
  if (pack) return `${pack.books} books`;
  const lines = (paragraphs(p.description)[0] ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) return `${lines.length} books`;
  return formatLabel(fileFormat(p.file_path));
}

export function Shelf({ products }: { products: Product[] }) {
  return (
    <Settle as="ul" className="cat-shelf">
      {products.map((p, i) => (
        <li key={p.id} style={{ "--i": i } as CSSProperties}>
          <Link to={`/shop/${p.slug}`} className="cat-item">
            <Cover product={p} sizes={SIZES} priority={i < 3} />
            <span className="cat-tag">
              <span className="cat-tag-title">{p.title}</span>
              <span className="cat-tag-meta">
                {formatPrice(p.price_cents, p.currency)} · {bookCount(p)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </Settle>
  );
}

/** The six episode packs as covers, unlinked and tagged "Coming soon", for a
 *  catalogue with nothing published (or one that did not answer). The books
 *  are finished and in hand, so the shelf shows them rather than an empty
 *  page; nothing here takes a price or a payment.
 *
 *  `pending` is the loading state: the same covers and titles with the line
 *  under them blank. The covers are bundled, so they are in the prerendered
 *  HTML and paint with the page instead of after the database answers; the
 *  first of them is this page's largest paint. */
export function ShelfComing({ pending = false }: { pending?: boolean }) {
  return (
    <Settle as="ul" className="cat-shelf">
      {PACKS.map((pack, i) => {
        const pic = coverFor(pack);
        return (
          <li key={pack.episode} style={{ "--i": i } as CSSProperties}>
            <div className="cat-item">
              <Stage seated tilt={0} turn={0} roll={0} depth={0.35} radius="2px">
                <span className="cat-cover">
                  <picture>
                    <source type="image/webp" srcSet={`${pic.webp} ${pic.width}w, ${pic.webp2x} ${pic.width * 2}w`} sizes={SIZES} />
                    <img
                      src={pic.jpg}
                      srcSet={`${pic.jpg} ${pic.width}w, ${pic.jpg2x} ${pic.width * 2}w`}
                      sizes={SIZES}
                      width={pic.width}
                      height={pic.height}
                      alt={pic.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      {...(i === 0 ? { fetchpriority: "high" } : {})}
                    />
                  </picture>
                </span>
              </Stage>
              <span className="cat-tag">
                <span className="cat-tag-title">{pack.title}</span>
                {/* A non-breaking space while pending, so the tag keeps its
                    height and nothing moves when the line arrives. */}
                <span className="cat-tag-meta">{pending ? "\u00a0" : `Coming soon · ${pack.books} books`}</span>
              </span>
            </div>
          </li>
        );
      })}
    </Settle>
  );
}
