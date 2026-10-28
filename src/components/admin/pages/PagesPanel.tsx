import { useMemo, useState, useEffect } from "react";
import { useParams, Routes, Route, Link } from "react-router-dom";
import {
  TextArea,
  useSaveState,
  AdminButton,
  SaveBar,
  Notice,
  PageHeader,
  useConfirm,
  StatusPill,
  ImageUpload,
  type ImageValue,
  EmptyState,
} from "@/components/admin/kit";
import { saveBlock, resetBlock, useLoad, listRows, listBlocks, type Result, type ContentBlock, IMAGE_RULES } from "@/lib/admin";
import { loadDefaults, type PageId, type PageDef, type BlockDef, PAGES, blocksFor, sectionsFor, blockValueError } from "@/lib/blocks";
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
      <Route index element={<PageList />} />
      <Route path=":page" element={<PageEditor />} />
    </Routes>
  );
}

/* ─── The list of pages ──────────────────────────────────────────────────── */

function PageList() {
  const changes = useLoad(() => listRows("content_blocks", { columns: "id, page, section_key" }), []);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const row of changes.data ?? []) out[row.page] = (out[row.page] ?? 0) + 1;
    return out;
  }, [changes.data]);

  /* A plain list, not a table, from 2026-10-28: on a phone the table became
     one tall card per page saying "As written" and "View the page" every
     time. Each row is the page's name and, only when it has some, a count of
     changes; the page itself has the "View the page" button. */
  return (
    <>
      <PageHeader
        title="Pages and photos"
        intro="Choose a page to change its words or pictures. What you save shows on the site straight away."
      />
      {changes.error && (
        <div className="mb-4">
          <Notice tone="error">Could not check which pages have changes. {changes.error}</Notice>
        </div>
      )}
      <ul className="pg-list adm-card">
        {PAGES.map((p) => {
          const n = counts[p.id] ?? 0;
          return (
            <li key={p.id}>
              <Link to={`/admin/pages/${p.id}`} className="pg-list__row">
                <span className="pg-list__name">{p.label}</span>
                {n > 0 && <StatusPill tone="warn">{n} {n === 1 ? "change" : "changes"}</StatusPill>}
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="pg-list__go">
                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ─── One page ───────────────────────────────────────────────────────────── */

type Draft = string | ImageValue | null;
type Loaded = { rows: Record<string, ContentBlock>; defaults: Record<string, string> };

function liveValue(def: BlockDef, row: ContentBlock | undefined, defaults: Record<string, string>): Draft {
  if (def.kind === "image") return row ? { url: row.value.url ?? "", alt: row.value.alt ?? "" } : null;
  if (row && row.value.text && row.value.text.trim()) return row.value.text;
  return defaults[def.key] ?? "";
}

function same(a: Draft, b: Draft): boolean {
  if (typeof a === "string" || typeof b === "string") return a === b;
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
  const pageDef = PAGES.find((p) => p.id === pageParam);

  if (!pageDef) {
    return (
      <>
        <PageHeader back={{ to: "/admin/pages", label: "All pages" }} title="That page does not exist" />
        <EmptyState title="There is no page by that name to edit." body="Choose one from the list of pages." />
      </>
    );
  }
  return <PageForm pageDef={pageDef} />;
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
    return blockValueError(def, def.kind === "image" ? (d as ImageValue | null) ?? { url: "", alt: "" } : String(d ?? ""));
  };

  const dirtyDefs = blocks.filter(isDirty);
  const setDraft = (key: string, v: Draft) => setDrafts((d) => ({ ...d, [key]: v }));

  async function writeBlock(def: BlockDef): Promise<string | { error: string }> {
    const d = draftOf(def);
    const r =
      def.kind === "image"
        ? await saveBlock(page, def.key, "image", { url: (d as ImageValue).url, alt: (d as ImageValue).alt.trim() })
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
    return def.kind === "image" ? "Original picture put back" : "Reset to the original wording";
  }

  async function resetOne(def: BlockDef) {
    const ok = await confirm({
      title: `Put "${def.label}" back to the original?`,
      body:
        def.kind === "image"
          ? "The picture you uploaded will stop showing on the site and the original picture shows instead."
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
  const view = (
    <a href={pageDef.path} target="_blank" rel="noreferrer" className="btn btn-quiet">
      View the page
    </a>
  );

  return (
    <>
      <PageHeader
        back={{ to: "/admin/pages", label: "All pages" }}
        title={pageDef.label}
        intro={
          changed
            ? `${changed} of ${blocks.length} blocks ${changed === 1 ? "has" : "have"} been changed from the original. Change any words or pictures, then press Save changes at the bottom.`
            : "Nothing on this page has been changed yet. Change any words or pictures, then press Save changes at the bottom."
        }
        actions={view}
      />

      {loaded.loading && !loaded.data && (
        <p className="adm-muted" role="status">
          Loading...
        </p>
      )}
      {loaded.error && (
        <div className="adm-stack">
          <Notice tone="error">Could not load this page's words. {loaded.error}</Notice>
          <AdminButton variant="quiet" onClick={loaded.reload}>
            Try again
          </AdminButton>
        </div>
      )}

      {loaded.data &&
        sections.map((s) => (
          <section key={s.section} className="pg-section" aria-labelledby={`pg-${s.section.replace(/\W+/g, "-")}`}>
            <h2 className="adm-h2" id={`pg-${s.section.replace(/\W+/g, "-")}`}>
              {s.section}
            </h2>
            {s.blocks.map((def) => (
              <BlockCard
                key={def.key}
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
            ))}
          </section>
        ))}

      {loaded.data && (
        <SaveBar status={save.status} dirty={dirtyDefs.length > 0} onSave={saveAll} saveLabel="Save changes" disabled={dirtyDefs.length === 0} />
      )}
    </>
  );
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
    def.kind === "image"
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
  const showOriginal = def.kind !== "image" && (changed || dirty) && original !== undefined && original !== text;
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
  else state = <span className="adm-muted">{def.kind === "image" ? "The original picture" : "As originally written"}</span>;

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
              {def.kind === "image" ? "Put the original picture back" : "Reset to the original wording"}
            </AdminButton>
          )}
        </div>
      </div>
    </div>
  );
}
