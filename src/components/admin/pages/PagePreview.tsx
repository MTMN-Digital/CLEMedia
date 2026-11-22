import { useState, useRef, useEffect, useCallback } from "react";
import { Segmented } from "@/components/admin/kit";

/* ============================================================================
   The real page, live, inside the editor. Click any word or picture you can
   change and the editor opens it; focus a field and the page scrolls to it.
   Things edited in another section (team, episodes, products...) get a
   dotted outline and say where they live.

   HOW IT FINDS THINGS. Page and admin share an origin, so the frame's document
   is readable. Each block's current wording is matched against the page's
   elements by normalised text (stars stripped, whitespace collapsed, case
   folded), taking the deepest match; picture slots match by bundled file name
   or uploaded URL. Blocks that only live in attributes stay field-only.
   ponytail: text matching, not instrumented markup. Repeated identical wording
   outlines the first match; add data attributes from useBlock if that matters.

   The page renders at a real window size, 1440 x 900 on desktop and 390 x 844
   on a phone, scaled to fit, and scrolls inside that window like the real
   thing.
   ========================================================================== */

export interface PreviewTarget {
  key: string;
  kind: "text" | "image";
  /** Text blocks: the wording as shown (one entry per paragraph). */
  texts: string[];
  /** Picture blocks: substrings to find in an img src (bundled base, uploaded URL). */
  srcs: string[];
}

/** Something on the page that is edited in another section of the admin. */
export interface PreviewSource {
  texts: string[];
  id: string;
}

const norm = (s: string) =>
  s
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const STYLE = `
[data-cms-key],[data-cms-src]{cursor:pointer!important;transition:outline-color .15s ease, background-color .15s ease;outline:2px dashed transparent;outline-offset:4px;border-radius:4px}
body[data-cms-hover] [data-cms-key]{outline-color:rgba(36,80,143,.32)}
body[data-cms-hover] [data-cms-src]{outline:2px dotted rgba(245,177,61,.75)}
[data-cms-key]:hover{outline:2px solid #24508F!important;background-color:rgba(36,80,143,.06)}
[data-cms-src]:hover{outline:2px solid #F2A007!important;background-color:rgba(245,177,61,.10)}
[data-cms-on]{outline:3px solid #FFB9BB!important;outline-offset:4px;background-color:rgba(255,185,187,.14)}
`;

const SIZE = { desk: { w: 1440, h: 900 }, phone: { w: 390, h: 844 } } as const;

export function PagePreview({
  path,
  targets,
  sources,
  selected,
  onPick,
  onPickSource,
  reloadKey,
}: {
  path: string;
  targets: PreviewTarget[];
  sources: PreviewSource[];
  selected: string | null;
  onPick: (key: string) => void;
  onPickSource: (id: string) => void;
  /** Bump to reload the page, e.g. after a save. */
  reloadKey: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<keyof typeof SIZE>("desk");
  const [scale, setScale] = useState(0.6);
  const [found, setFound] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const targetsRef = useRef(targets);
  targetsRef.current = targets;
  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;
  const pickRef = useRef({ onPick, onPickSource });
  pickRef.current = { onPick, onPickSource };

  const { w, h } = SIZE[device];

  /* Fit the window into the box: by width on desktop, by height for a phone. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / w, el.clientHeight / h, 1));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);

  const doc = () => frame.current?.contentDocument ?? null;

  const map = useCallback(() => {
    const d = doc();
    if (!d?.body) return;
    d.querySelectorAll("[data-cms-key],[data-cms-src]").forEach((el) => {
      el.removeAttribute("data-cms-key");
      el.removeAttribute("data-cms-src");
    });
    const byText = new Map<string, Element[]>();
    d.body.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,button,span,em,strong,blockquote,figcaption,dt,dd,label,small,div").forEach((el) => {
      const t = norm(el.textContent ?? "");
      if (t.length < 2 || t.length > 2000) return;
      const list = byText.get(t);
      if (list) list.push(el);
      else byText.set(t, [el]);
    });
    const depth = (el: Element) => {
      let n = 0;
      for (let p: Element | null = el; p; p = p.parentElement) n++;
      return n;
    };
    const deepest = (els: Element[]) => els.reduce((a, b) => (depth(b) > depth(a) ? b : a));
    let hits = 0;
    for (const t of targetsRef.current) {
      if (t.kind === "image") {
        const img = [...d.images].find((im) => t.srcs.some((s) => s && (im.currentSrc.includes(s) || im.src.includes(s) || im.srcset.includes(s))));
        if (img) {
          img.setAttribute("data-cms-key", t.key);
          hits++;
        }
        continue;
      }
      let hit = false;
      for (const text of t.texts) {
        const els = byText.get(norm(text));
        if (!els?.length) continue;
        const el = deepest(els);
        if (!el.hasAttribute("data-cms-key")) el.setAttribute("data-cms-key", t.key);
        hit = true;
      }
      if (hit) hits++;
    }
    /* Things from other sections. Never over something already editable here. */
    for (const s of sourcesRef.current) {
      for (const text of s.texts) {
        const els = byText.get(norm(text));
        if (!els?.length) continue;
        for (const el of els) {
          if (el.closest("[data-cms-key]") || el.querySelector("[data-cms-src]")) continue;
          if (!els.some((o) => o !== el && el.contains(o))) el.setAttribute("data-cms-src", s.id);
        }
      }
    }
    setFound(hits);
  }, []);

  const onLoad = useCallback(() => {
    const d = doc();
    if (!d) return;
    const st = d.createElement("style");
    st.textContent = STYLE;
    d.head.appendChild(st);
    d.addEventListener(
      "click",
      (e) => {
        const t = e.target as Element | null;
        const el = t?.closest("[data-cms-key]");
        const src = t?.closest("[data-cms-src]");
        /* Nothing on the page navigates inside the editor. */
        if (t?.closest("a,button,form") || el || src) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (el) pickRef.current.onPick(el.getAttribute("data-cms-key")!);
        else if (src) pickRef.current.onPickSource(src.getAttribute("data-cms-src")!);
      },
      true,
    );
    map();
    const win = frame.current?.contentWindow;
    win?.setTimeout(map, 900);
    win?.setTimeout(map, 2500);
    let t = 0;
    const mo = new MutationObserver(() => {
      win?.clearTimeout(t);
      t = win?.setTimeout(map, 400) ?? 0;
    });
    mo.observe(d.body, { childList: true, subtree: true, characterData: true });
  }, [map]);

  useEffect(() => {
    map();
  }, [targets, sources, map]);

  useEffect(() => {
    const d = doc();
    if (!d?.body) return;
    if (showAll) d.body.setAttribute("data-cms-hover", "");
    else d.body.removeAttribute("data-cms-hover");
  }, [showAll, found]);

  useEffect(() => {
    const d = doc();
    if (!d) return;
    d.querySelectorAll("[data-cms-on]").forEach((el) => el.removeAttribute("data-cms-on"));
    if (!selected) return;
    const el = d.querySelector(`[data-cms-key="${CSS.escape(selected)}"]`);
    if (el) {
      el.setAttribute("data-cms-on", "");
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [selected, found]);

  return (
    <div className="pg-prev">
      <div className="pg-prev__bar">
        <Segmented<keyof typeof SIZE>
          label="Preview size"
          hideLabel
          value={device}
          onChange={setDevice}
          options={[
            { value: "desk", label: "Desktop" },
            { value: "phone", label: "Phone" },
          ]}
        />
        <label className="pg-prev__toggle">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show what I can edit
        </label>
        <span className="pg-prev__key">
          <i data-k="edit" /> Edit here <i data-k="src" /> Edited elsewhere
        </span>
      </div>
      <div className="pg-prev__box" ref={box} data-device={device}>
        <div className="pg-prev__frame" style={{ width: w * scale, height: h * scale }}>
          <iframe
            key={`${path}-${reloadKey}-${device}`}
            ref={frame}
            src={path}
            title="The page, click to edit"
            onLoad={onLoad}
            style={{ width: w, height: h, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}
