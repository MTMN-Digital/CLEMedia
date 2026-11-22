import { useMemo, useState, useEffect } from "react";
import { useParams, Routes, Route, Link } from "react-router-dom";
import {
  TextArea,
  useConfirm,
  AdminButton,
  type ImageValue,
  TextInput,
  PageHeader,
  Notice,
  StatusPill,
  ImageUpload,
  MoveButtons,
  SaveBar,
  EmptyState,
  useSaveState,
} from "@/components/admin/kit";
import { type PreviewTarget, PagePreview, type PreviewSource } from "./PagePreview";
import { getSetting, useLoad, type ContentBlock, listBlocks, type Result, listRows, resetBlock, IMAGE_RULES, saveBlock } from "@/lib/admin";
import { TEAM, ADVISORS } from "@/components/team/people";
import { EPISODES } from "@/lib/episodes";
import { LINKS_DEFAULT, COMPANY_DEFAULT } from "@/lib/site";
import { blocksFor, loadDefaults, sectionsFor, type ListItem, type BlockDef, type PageDef, PAGES, type PageId, blockValueError } from "@/lib/blocks";
import { ASSETS } from "@/lib/brand";
import "./pages.css";

/* ============================================================================
   Pages and photos: the CMS editor.

   The registry in @/lib/blocks says what is editable on every page and what
   to call it. The page's own source is the original wording (loadDefaults),
   and a content_blocks row is a change from it. Saving writes a row; "Reset
   to the original wording" deletes it. An empty required block can never be
   saved, so a slip of the thumb cannot blank a headline on the site.
   ========================================================================== */

export function PagesPanel() {
  return (
    <Routes>
      <Route index element={<PageEditor />} />
      <Route path=":page" element={<PageEditor />} />
    </Routes>
  );
}

/* ─── The site's own menu, copied down the right of the editor ──────────── */

const MENU: { label?: string; ids: PageId[] }[] = [
  { ids: ["home"] },
  { label: "About", ids: ["story", "team", "ethical-ai"] },
  { ids: ["case-study", "journal", "app", "shop", "contact"] },
  { label: "Also on the site", ids: ["media", "privacy", "terms", "cookies", "404"] },
];

function SiteMenu({ current, changed }: { current: PageId; changed: Record<string, number> }) {
  return (
    <nav className="pg-menu" aria-label="Pages of the website">
      {MENU.map((g, n) => (
        <div key={n} className="pg-menu__group">
          {g.label && <p className="pg-menu__label">{g.label}</p>}
          {g.ids.map((id) => {
            const p = PAGES.find((x) => x.id === id);
            if (!p) return null;
            return (
              <Link key={id} to={`/admin/pages/${id}`} className="pg-menu__link" aria-current={id === current ? "page" : undefined}>
                <span>{p.label.replace(" (front page)", "")}</span>
                {changed[id] ? <b title={`${changed[id]} changed`}>{changed[id]}</b> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/* ─── Things on a page that are edited in another section ────────────────── */

const SOURCES: Record<string, { label: string; path: string; what: string }> = {
  people: { label: "Team and experts", path: "/admin/people", what: "Names, titles, photos and bios of the team, advisers and experts." },
  episodes: { label: "Episodes", path: "/admin/episodes", what: "Episode titles, thumbnails, running times and YouTube links." },
  products: { label: "Shop", path: "/admin/shop", what: "Products, prices, covers and whether they are on sale." },
  posts: { label: "Journal", path: "/admin/journal", what: "Journal posts and their strands." },
  media: { label: "Media and podcast", path: "/admin/media", what: "Press articles, podcasts, interviews and videos." },
  quotes: { label: "Quotes", path: "/admin/quotes", what: "Quotations from parents, educators and schools." },
  links: { label: "Links and settings", path: "/admin/links", what: "The public email address, social accounts and company details." },
};

function useSources() {
  return useLoad(async (): Promise<Result<PreviewSource[]>> => {
    const [people, eps, prods, posts, media, quotes, links] = await Promise.all([
      listRows("people", { columns: "name, role" }),
      listRows("episodes", { columns: "title" }),
      listRows("products", { columns: "title" }),
      listRows("posts", { columns: "title" }),
      listRows("media_items", { columns: "title" }),
      getSetting("quotes"),
      getSetting("links"),
    ]);
    const names = people.data?.length ? people.data : [...TEAM, ...ADVISORS];
    const out: PreviewSource[] = [
      { id: "people", texts: names.flatMap((m) => [m.name, m.role]) },
      { id: "episodes", texts: (eps.data?.length ? eps.data : EPISODES).map((e) => e.title) },
      { id: "products", texts: (prods.data ?? []).map((p) => p.title) },
      { id: "posts", texts: (posts.data ?? []).map((p) => p.title) },
      { id: "media", texts: (media.data ?? []).map((m) => m.title) },
      { id: "quotes", texts: (quotes.data?.items ?? []).flatMap((q) => [q.words, q.from]) },
      { id: "links", texts: [links.data?.email ?? LINKS_DEFAULT.email ?? "", COMPANY_DEFAULT.legal] },
    ];
    return { data: out.map((x) => ({ ...x, texts: x.texts.filter((t): t is string => Boolean(t && t.trim())) })), error: null };
  }, []);
}

/* ─── One page ───────────────────────────────────────────────────────────── */

type Draft = string | ImageValue | ListItem[] | null;
type Loaded = { rows: Record<string, ContentBlock>; defaults: Record<string, string> };

function liveValue(def: BlockDef, row: ContentBlock | undefined, defaults: Record<string, string>): Draft {
  if (def.kind === "image") return row ? { url: row.value.url ?? "", alt: row.value.alt ?? "" } : null;
  if (def.kind === "list") return row?.value.items?.length ? row.value.items : (def.items ?? []);
  if (row && row.value.text && row.value.text.trim()) return row.value.text;
  return defaults[def.key] ?? "";
}

function same(a: Draft, b: Draft): boolean {
  if (typeof a === "string" || typeof b === "string") return a === b;
  if (Array.isArray(a) || Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
  if (a === null || b === null) return a === b;
  return a.url === b.url && a.alt === b.alt;
}

function originalImage(def: BlockDef): { src: string; label: string; alt: string } | null {
  const a = def.asset ? ASSETS[def.asset] : null;
  if (!a) return null;
  return { src: a.base ? `${a.base}.${a.fallback ?? "jpg"}` : "", alt: a.alt, label: a.label };
}

function PageEditor() {
  const { page: pageParam } = useParams();
  const pageDef = PAGES.find((p) => p.id === (pageParam ?? "home"));

  if (!pageDef) {
    return (
      <>
        <PageHeader back={{ to: "/admin/pages", label: "All pages" }} title="That page does not exist" />
        <EmptyState title="There is no page by that name to edit." body="Choose one from the list of pages." />
      </>
    );
  }
  return <PageForm key={pageDef.id} pageDef={pageDef} />;
}

function PageForm({ pageDef }: { pageDef: PageDef }) {
  const page: PageId = pageDef.id;
  const blocks = useMemo(() => blocksFor(page), [page]);
  const sections = useMemo(() => sectionsFor(page), [page]);
  const confirm = useConfirm();
  const save = useSaveState();

  const loaded = useLoad(async (): Promise<Result<Loaded>> => {
    const r = await listBlocks(page);
    if (r.error !== null) return r;
    const rows: Record<string, ContentBlock> = {};
    for (const row of r.data) rows[row.section_key] = row;
    return { data: { rows, defaults: await loadDefaults(page) }, error: null };
  }, [page]);

  const [rows, setRows] = useState<Record<string, ContentBlock>>({});
  const [defaults, setDefaults] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded.data) return;
    setRows(loaded.data.rows);
    setDefaults(loaded.data.defaults);
    const next: Record<string, Draft> = {};
    for (const def of blocks) next[def.key] = liveValue(def, loaded.data.rows[def.key], loaded.data.defaults);
    setDrafts(next);
    save.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded.data, blocks]);

  const live = (def: BlockDef) => liveValue(def, rows[def.key], defaults);
  const draftOf = (def: BlockDef): Draft => (def.key in drafts ? drafts[def.key] : live(def));
  const isDirty = (def: BlockDef) => !same(draftOf(def), live(def));
  /** A removed picture on a changed block is a reset, not a save. */
  const isRemoval = (def: BlockDef) => def.kind === "image" && draftOf(def) === null && Boolean(rows[def.key]);
  const fieldError = (def: BlockDef): string | null => {
    if (!isDirty(def) || isRemoval(def)) return null;
    const d = draftOf(def);
    if (def.kind === "list") return blockValueError(def, (d as ListItem[] | null) ?? []);
    return blockValueError(def, def.kind === "image" ? (d as ImageValue | null) ?? { url: "", alt: "" } : String(d ?? ""));
  };

  const dirtyDefs = blocks.filter(isDirty);

  /* The visual side: what each block looks like on the page right now. */
  const [selected, setSelected] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const targets = useMemo<PreviewTarget[]>(
    () =>
      blocks.map((def) => {
        const v = liveValue(def, rows[def.key], defaults);
        if (def.kind === "image") {
          const a = def.asset ? ASSETS[def.asset] : null;
          return { key: def.key, kind: "image", texts: [], srcs: [a?.base ?? "", (v as ImageValue | null)?.url ?? ""].filter(Boolean) };
        }
        if (def.kind === "list") {
          const texts = ((v as ListItem[] | null) ?? []).flatMap((it) => Object.values(it).flatMap((t) => [t, ...t.split(/\n\s*\n/)])).map((x) => x.trim()).filter(Boolean);
          return { key: def.key, kind: "text", texts, srcs: [] };
        }
        const text = String(v ?? "");
        const paras = text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
        return { key: def.key, kind: "text", texts: [text, ...paras], srcs: [] };
      }),
    [blocks, rows, defaults],
  );
  const [source, setSource] = useState<string | null>(null);
  const pick = (key: string) => {
    setSource(null);
    setSelected(key);
  };
  const pickSource = (id: string) => {
    setSelected(null);
    setSource(id);
  };
  const sources = useSources();
  const allChanges = useLoad(() => listRows("content_blocks", { columns: "page, section_key" }), [reloadKey]);
  const changedBy = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of allChanges.data ?? []) m[r.page] = (m[r.page] ?? 0) + 1;
    return m;
  }, [allChanges.data]);
  const setDraft = (key: string, v: Draft) => setDrafts((d) => ({ ...d, [key]: v }));

  async function writeBlock(def: BlockDef): Promise<string | { error: string }> {
    const d = draftOf(def);
    const r =
      def.kind === "image"
        ? await saveBlock(page, def.key, "image", { url: (d as ImageValue).url, alt: (d as ImageValue).alt.trim() })
        : def.kind === "list"
          ? await saveBlock(page, def.key, "text", { items: cleanItems(def, (d as ListItem[] | null) ?? []) })
          : await saveBlock(page, def.key, "text", { text: String(d ?? "").trim() });
    if (r.error !== null) return { error: r.error };
    setRows((s) => ({ ...s, [def.key]: r.data }));
    setDraft(def.key, liveValue(def, r.data, defaults));
    return "Saved";
  }

  async function removeBlock(def: BlockDef): Promise<string | { error: string }> {
    const r = await resetBlock(page, def.key);
    if (r.error !== null) return { error: r.error };
    setRows((s) => {
      const next = { ...s };
      delete next[def.key];
      return next;
    });
    setDraft(def.key, liveValue(def, undefined, defaults));
    return def.kind === "image" ? "Original picture put back" : def.kind === "list" ? "Original list put back" : "Reset to the original wording";
  }

  async function resetOne(def: BlockDef) {
    const ok = await confirm({
      title: `Put "${def.label}" back to the original?`,
      body:
        def.kind === "image"
          ? "The picture you uploaded will stop showing on the site and the original picture shows instead."
          : def.kind === "list"
          ? "Your saved list will be removed and the page shows its original items again."
          : "The wording you saved will be removed and the page shows the original wording again.",
      confirmLabel: "Reset to the original",
    });
    if (!ok) return;
    setBusyKey(def.key);
    await save.run(() => removeBlock(def));
    setBusyKey(null);
  }

  async function saveAll() {
    if (dirtyDefs.length === 0) return;
    const bad = dirtyDefs.find((def) => fieldError(def));
    if (bad) return save.fail(`"${bad.label}" cannot be saved yet. ${fieldError(bad)}`);
    const removals = dirtyDefs.filter(isRemoval);
    if (removals.length) {
      const ok = await confirm({
        title: removals.length === 1 ? "Put one picture back to the original?" : `Put ${removals.length} pictures back to the original?`,
        body: "The pictures you removed will show the original again. Everything else you changed is saved as well.",
        confirmLabel: "Save changes",
      });
      if (!ok) return;
    }
    await save.run(async () => {
      setTimeout(() => setReloadKey((k) => k + 1), 600);
      let n = 0;
      for (const def of dirtyDefs) {
        const r = isRemoval(def) ? await removeBlock(def) : await writeBlock(def);
        if (typeof r !== "string") return { error: n ? `${n} of your changes saved, then something went wrong. ${r.error}` : r.error };
        n++;
      }
      return `Saved ${n} ${n === 1 ? "change" : "changes"}`;
    });
  }

  const changed = Object.keys(rows).filter((k) => blocks.some((b) => b.key === k)).length;
  const sel = selected ? blocks.find((b) => b.key === selected) ?? null : null;
  const src = source ? SOURCES[source] : null;

  const card = (def: BlockDef) => (
    <div key={def.key} id={`blk-${def.key}`} className="pg-block-wrap">
      <BlockCard
        page={page}
        def={def}
        draft={draftOf(def)}
        original={defaults[def.key]}
        changed={Boolean(rows[def.key])}
        dirty={isDirty(def)}
        removal={isRemoval(def)}
        error={fieldError(def)}
        busy={busyKey === def.key}
        saving={save.saving}
        onChange={(v) => setDraft(def.key, v)}
        onReset={() => resetOne(def)}
        onUndo={() => setDraft(def.key, live(def))}
      />
    </div>
  );

  return (
    <div className="pg-editor">
      <div className="pg-editor__page">
        <div className="pg-editor__head">
          <h1>{pageDef.label}</h1>
          <span className="pg-editor__meta">{changed ? `${changed} changed from the original` : "As originally written"}</span>
          <a href={pageDef.path} target="_blank" rel="noreferrer" className="btn btn-sm pg-editor__open">
            Open the page
          </a>
        </div>
        {loaded.error && (
          <div className="adm-stack mb-3">
            <Notice tone="error">Could not load this page's words. {loaded.error}</Notice>
            <AdminButton variant="quiet" onClick={loaded.reload}>Try again</AdminButton>
          </div>
        )}
        <PagePreview path={pageDef.path} targets={targets} sources={sources.data ?? []} selected={selected} onPick={pick} onPickSource={pickSource} reloadKey={reloadKey} />
      </div>

      <aside className="pg-editor__side" aria-label="Editing">
        {!(sel || src) && <SiteMenu current={page} changed={changedBy} />}

        <section className="pg-editor__panel" aria-live="polite">
          {loaded.loading && !loaded.data && <p className="adm-muted" role="status">Loading...</p>}
          {loaded.data && sel && (
            <>
              <div className="pg-editor__panelhead">
                <span>{sectionOf(sections, sel.key)}</span>
                <button type="button" className="pg-x" onClick={() => setSelected(null)} aria-label="Close">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>
              {card(sel)}
            </>
          )}
          {src && (
            <div className="pg-src">
              <p className="pg-src__tag">Edited elsewhere</p>
              <h2>{src.label}</h2>
              <p>{src.what} Change it there and this page follows.</p>
              <Link to={src.path} className="btn btn-primary">Go to {src.label}</Link>
              <button type="button" className="adm-linkbtn" onClick={() => setSource(null)}>Back</button>
            </div>
          )}
          {loaded.data && !sel && !src && (
            <div className="pg-hint">
              <b>Click anything outlined on the page</b>
              <span>Solid outline: change it here. Dotted: it comes from another section, and clicking it shows where.</span>
            </div>
          )}
        </section>

        {(sel || src) && <SiteMenu current={page} changed={changedBy} />}

        {loaded.data && (
          <details className="pg-all">
            <summary>Everything on this page <b>{blocks.length}</b></summary>
            <ul>
              {blocks.map((def) => (
                <li key={def.key}>
                  <button type="button" className="pg-all__item" aria-current={def.key === selected || undefined} onClick={() => pick(def.key)}>
                    <span>{def.label}</span>
                    {isDirty(def) ? <i data-s="dirty">Not saved</i> : rows[def.key] ? <i data-s="changed">Changed</i> : null}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </aside>

      {loaded.data && (
        <SaveBar status={save.status} dirty={dirtyDefs.length > 0} onSave={saveAll} saveLabel={dirtyDefs.length > 1 ? `Save ${dirtyDefs.length} changes` : "Save changes"} disabled={dirtyDefs.length === 0} />
      )}
    </div>
  );
}

/** Trimmed fields, in the registry's field order, nothing else stored. */
function cleanItems(def: BlockDef, items: ListItem[]): ListItem[] {
  return items.map((it) => Object.fromEntries((def.fields ?? []).map((f) => [f.name, (it[f.name] ?? "").trim()])));
}

function sectionOf(sections: { blocks: BlockDef[]; section: string }[], key: string) {
  return sections.find((s) => s.blocks.some((b) => b.key === key))?.section ?? "";
}

/* ─── One block ──────────────────────────────────────────────────────────── */

function BlockCard({
  page,
  def,
  draft,
  original,
  changed,
  dirty,
  removal,
  error,
  busy,
  saving,
  onChange,
  onReset,
  onUndo,
}: {
  page: PageId;
  def: BlockDef;
  draft: Draft;
  /** The page's own wording, or undefined when this copy of the site has not exported it yet. */
  original: string | undefined;
  changed: boolean;
  dirty: boolean;
  removal: boolean;
  error: string | null;
  busy: boolean;
  saving: boolean;
  onChange: (v: Draft) => void;
  onReset: () => void;
  /** Puts the field back to what is saved, without touching the site. */
  onUndo: () => void;
}) {
  const hint =
    def.kind === "image" || def.kind === "list"
      ? undefined
      : [
          def.multi ? "Leave a blank line between paragraphs." : null,
          def.emphasis ? "Put *stars* around the words to highlight." : null,
          original === undefined ? "The original wording is not available in this copy of the site yet." : null,
        ]
          .filter(Boolean)
          .join(" ") || undefined;

  const text = typeof draft === "string" ? draft : "";
  const rows = Math.min(14, Math.max(3, Math.ceil(text.length / 70) + (text.match(/\n/g)?.length ?? 0) + 1));
  const showOriginal = def.kind !== "image" && def.kind !== "list" && (changed || dirty) && original !== undefined && original !== text;
  const asset = def.kind === "image" ? originalImage(def) : null;

  let field;
  if (def.kind === "image") {
    field = (
      <ImageUpload
        label={def.label}
        value={draft as ImageValue | null}
        onChange={onChange}
        folder={`pages/${page}`}
        hint={asset && !asset.src ? `${asset.label}. ${IMAGE_RULES.label}.` : undefined}
        defaultPreview={asset?.src ? { src: asset.src, alt: asset.alt } : undefined}
        error={error}
      />
    );
  } else if (def.kind === "list") {
    field = <ListEditor def={def} items={(draft as ListItem[] | null) ?? []} onChange={onChange} error={error} />;
  } else if (def.kind === "paragraph") {
    field = <TextArea label={def.label} value={text} onChange={onChange} rows={rows} hint={hint} error={error} />;
  } else {
    /* A box that grows with the line, so a long headline is read whole
       while it is edited. Still one line: a return becomes a space. */
    field = (
      <TextArea
        label={def.label}
        value={text}
        onChange={(v) => onChange(v.replace(/\s*\n+\s*/g, " "))}
        rows={Math.min(4, Math.max(1, Math.ceil(text.length / 60)))}
        hint={hint}
        error={error}
      />
    );
  }

  let state;
  if (dirty) state = <StatusPill tone="alert">{removal ? "Picture removed, not saved yet" : "Not saved yet"}</StatusPill>;
  else if (changed) state = <StatusPill tone="warn">Changed from the original</StatusPill>;
  else state = <span className="adm-muted">{def.kind === "image" ? "The original picture" : def.kind === "list" ? "The original list" : "As originally written"}</span>;

  return (
    <div className="adm-card pg-block">
      {field}
      {showOriginal && (
        <p className="pg-original">
          <strong>Original wording</strong>
          {original}
        </p>
      )}
      {def.kind === "image" && changed && asset?.src && (
        <p className="pg-original">
          <strong>Original picture</strong>
          {asset.alt}
          <img className="pg-original__img" src={asset.src} alt="" />
        </p>
      )}
      <div className="pg-block__foot">
        {state}
        <div className="pg-block__actions">
          {dirty && (
            <AdminButton variant="quiet" size="sm" onClick={onUndo} disabled={busy || saving}>
              Undo
            </AdminButton>
          )}
          {changed && !removal && (
            <AdminButton variant="danger" size="sm" onClick={onReset} busy={busy} busyLabel="Resetting" disabled={saving}>
              {def.kind === "image" ? "Put the original picture back" : def.kind === "list" ? "Put the original list back" : "Reset to the original wording"}
            </AdminButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── A list: add, remove, reorder ──────────────────────────────────────── */

function ListEditor({ def, items, onChange, error }: { def: BlockDef; items: ListItem[]; onChange: (v: ListItem[]) => void; error: string | null }) {
  const fields = def.fields ?? [];
  const what = def.itemLabel ?? "item";
  const Name = `${what[0].toUpperCase()}${what.slice(1)}`;
  const max = def.max ?? 30;
  const min = def.min ?? 1;
  const set = (i: number, name: string, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [name]: v } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <fieldset className="pg-list">
      <legend>{def.label}</legend>
      <ol className="pg-list__items">
        {items.map((it, i) => (
          <li key={i} className="pg-list__item">
            <div className="pg-list__head">
              <b>
                {Name} {i + 1}
              </b>
              <MoveButtons label={`${Name} ${i + 1}`} first={i === 0} last={i === items.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
            </div>
            {fields.map((f) =>
              f.kind === "paragraph" ? (
                <TextArea key={f.name} label={f.label} value={it[f.name] ?? ""} onChange={(v) => set(i, f.name, v)} rows={Math.min(8, Math.max(2, Math.ceil((it[f.name] ?? "").length / 60)))} />
              ) : (
                <TextInput key={f.name} label={f.label} value={it[f.name] ?? ""} onChange={(v) => set(i, f.name, v)} />
              ),
            )}
            <div>
              <AdminButton variant="danger" size="sm" onClick={() => onChange(items.filter((_, j) => j !== i))} disabled={items.length <= min}>
                Remove {what} {i + 1}
              </AdminButton>
            </div>
          </li>
        ))}
      </ol>
      {error && <Notice tone="error">{error}</Notice>}
      <AdminButton variant="quiet" size="sm" onClick={() => onChange([...items, Object.fromEntries(fields.map((f) => [f.name, ""]))])} disabled={items.length >= max}>
        Add a {what}
      </AdminButton>
    </fieldset>
  );
}
