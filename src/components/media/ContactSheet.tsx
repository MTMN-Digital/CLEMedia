import { type PressFile, humanSize } from "./press";

/* ============================================================================
   The contact sheet: one row of the press kit's art, a mono label in the
   left column and a flush grid of files beside it.

   No cards, no radius, no shadow. Each file is a download link wrapping its
   thumbnail at real aspect on a 1.5px rule box, with the file's title and its
   size printed under it in mono so nobody has to open a file to find out
   what it is. The lift on hover is 2px and lives in kit.css.
   ========================================================================== */

function sizeLine(f: PressFile) {
  return (
    <>
      {f.width} × {f.height} · {f.format}
      {f.duration && <> · {f.duration}</>}
      {/* The weight drops at phone width, where the caption has the room
          for the size and the format and nothing more. */}
      <span className="hidden sm:inline"> · {humanSize(f.bytes)}</span>
    </>
  );
}

export function ContactRow({ label, files }: { label: string; files: PressFile[] }) {
  return (
    <div className="grid gap-x-8 gap-y-3 border-t-[1.5px] border-rule py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:py-4">
      <dt className="font-mono text-[14px] uppercase leading-[1.7] tracking-[0.1em] text-muted">{label}</dt>
      <dd>
        {/* Three across on a phone (about 110px), four across beside the
            label from `sm` (about 140px at 1440 in the sheet column). */}
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {files.map((f) => (
            <li key={f.id}>
              <a href={f.file} download={f.download} className="kit-thumb block min-h-[44px]">
                <span
                  className="block border-[1.5px] border-edge"
                  style={{ aspectRatio: `${f.thumb.width} / ${f.thumb.height}` }}
                >
                  <picture>
                    {f.thumb.webp && <source type="image/webp" srcSet={f.thumb.webp} />}
                    <img
                      src={f.thumb.src}
                      width={f.thumb.width}
                      height={f.thumb.height}
                      alt={f.alt}
                      loading="lazy"
                      decoding="async"
                      className="block h-full w-full object-contain"
                    />
                  </picture>
                </span>
                <span className="mt-2 block font-mono text-[13px] leading-[1.5] text-ink">{f.title}.</span>
                <span className="mt-0.5 block font-mono text-[13px] leading-[1.5] tracking-[0.02em] text-muted tnum">
                  {sizeLine(f)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
