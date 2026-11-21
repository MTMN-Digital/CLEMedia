import { useState, useRef, useEffect, useCallback } from "react";
import { Segmented } from "@/components/admin/kit";

/* ============================================================================
   The real page, live, inside the editor: click any word or picture you can
   change and the editor jumps to its field; focus a field and the page
   scrolls to it and outlines it.

   HOW IT FINDS THINGS. The page and the admin share an origin, so the frame's
   document is readable. Every block's current text is matched against the
   page's elements by normalised text content (stars stripped, whitespace
   collapsed, case folded), taking the deepest element that matches; a picture
   slot is matched by its bundled file name or its uploaded URL. Blocks that
   only live in attributes (meta descriptions, alt text) find no element and
   stay field-only.
   ponytail: text matching, not instrumented markup. A block whose wording is
   repeated verbatim elsewhere on the page outlines the first match; add
   data attributes from useBlock if that ever matters.

   The page renders at a real desktop (1280) or phone (390) width and is
   scaled to fit the column, so it looks exactly like the site.
   ========================================================================== */

export interface PreviewTarget {
  key: string;
  kind: "text" | "image";
  /** Text blocks: the wording as shown (one entry per paragraph). */
  texts: string[];
  /** Picture blocks: substrings to find in an img src (bundled base, uploaded URL). */
  srcs: string[];
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
[data-cms-key]{cursor:pointer!important;transition:outline-color .15s ease, background-color .15s ease;outline:2px dashed transparent;outline-offset:4px;border-radius:4px}
body[data-cms-hover] [data-cms-key]{outline-color:rgba(36,80,143,.28)}
[data-cms-key]:hover{outline:2px solid #24508F!important;background-color:rgba(36,80,143,.06)}
[data-cms-on]{outline:3px solid #FFB9BB!important;outline-offset:4px;background-color:rgba(255,185,187,.14)}
`;

const DESK = 1280;
const PHONE = 390;

export function PagePreview({
  path,
  targets,
  selected,
  onPick,
  reloadKey,
}: {
  path: string;
  targets: PreviewTarget[];
  selected: string | null;
  onPick: (key: string) => void;
  /** Bump to reload the page, e.g. after a save. */
  reloadKey: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<"desk" | "phone">("desk");
  const [scale, setScale] = useState(0.6);
  const [found, setFound] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const targetsRef = useRef(targets);
  targetsRef.current = targets;
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  const width = device === "desk" ? DESK : PHONE;

  /* Fit the chosen width into the column. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const doc = () => frame.current?.contentDocument ?? null;

  /** Tag every element that shows an editable block. */
  const map = useCallback(() => {
    const d = doc();
    if (!d?.body) return;
    d.querySelectorAll("[data-cms-key]").forEach((el) => el.removeAttribute("data-cms-key"));
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
    let hits = 0;
    for (const t of targetsRef.current) {
      if (t.kind === "image") {
        const img = [...d.images].find((im) => t.srcs.some((s) => s && (im.currentSrc.includes(s) || im.src.includes(s) || im.srcset.includes(s))));
        const host = img;
        if (host) {
          host.setAttribute("data-cms-key", t.key);
          hits++;
        }
        continue;
      }
      let hit = false;
      for (const text of t.texts) {
        const els = byText.get(norm(text));
        if (!els?.length) continue;
        const el = els.reduce((a, b) => (depth(b) > depth(a) ? b : a));
        if (!el.hasAttribute("data-cms-key")) el.setAttribute("data-cms-key", t.key);
        hit = true;
      }
      if (hit) hits++;
    }
    setFound(hits);
  }, []);

  /* On every load: style, listeners, mapping (again once the page settles). */
  const onLoad = useCallback(() => {
    const d = doc();
    if (!d) return;
    const st = d.createElement("style");
    st.textContent = STYLE;
    d.head.appendChild(st);
    d.addEventListener(
      "click",
      (e) => {
        const el = (e.target as Element | null)?.closest("[data-cms-key]");
        /* Nothing on the page navigates inside the editor. */
        if ((e.target as Element | null)?.closest("a,button,form") || el) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (el) pickRef.current(el.getAttribute("data-cms-key")!);
      },
      true,
    );
    map();
    const w = frame.current?.contentWindow;
    w?.setTimeout(map, 900);
    w?.setTimeout(map, 2500);
    let t = 0;
    const mo = new MutationObserver(() => {
      w?.clearTimeout(t);
      t = w?.setTimeout(map, 400) ?? 0;
    });
    mo.observe(d.body, { childList: true, subtree: true, characterData: true });
  }, [map]);

  /* Re-map when the field values change (a save reloads; typing does not). */
  useEffect(() => {
    map();
  }, [targets, map]);

  useEffect(() => {
    const d = doc();
    if (!d?.body) return;
    if (showAll) d.body.setAttribute("data-cms-hover", "");
    else d.body.removeAttribute("data-cms-hover");
  }, [showAll, found]);

  /* Outline the selected block and bring it into view. */
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
        <Segmented<"desk" | "phone">
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
        <span className="pg-prev__count">{found} on this page</span>
      </div>
      <div className="pg-prev__box" ref={box} data-device={device}>
        <div className="pg-prev__frame" style={{ width: width * scale }}>
          <iframe
            key={`${path}-${reloadKey}`}
            ref={frame}
            src={path}
            title="The page, click to edit"
            onLoad={onLoad}
            style={{ width, height: `calc(${100 / scale}% )`, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}
