import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRow, getRow, countRows, insertRow, type MediaRow, updateRow, useLoad } from "@/lib/admin";
import {
  useConfirm,
  AdminButton,
  imageError,
  useToast,
  Select,
  useSaveState,
  ImageUpload,
  TextArea,
  TextInput,
  PageHeader,
  SaveBar,
  type ImageValue,
  Notice,
} from "@/components/admin/kit";
import { urlOrNull, urlError } from "../links/urls";

/* One press, podcast, interview or video entry. New at /admin/media/new,
   existing at /admin/media/:id. The link to the original is required: the
   press page promises every entry links straight out to it. */

export const KIND_LABEL: Record<MediaRow["kind"], string> = {
  press: "Press article",
  podcast: "Podcast",
  interview: "Interview",
  video: "Video",
};

const KIND_OPTIONS = (Object.keys(KIND_LABEL) as MediaRow["kind"][]).map((k) => ({ value: k, label: KIND_LABEL[k] }));

interface Draft {
  description: string;
  published_on: string;
  image: ImageValue | null;
  link: string;
  outlet: string;
  embed_url: string;
  title: string;
  kind: MediaRow["kind"];
}

const EMPTY: Draft = { title: "", outlet: "", kind: "press", published_on: "", description: "", link: "", embed_url: "", image: null };

function fromRow(m: MediaRow): Draft {
  return {
    title: m.title ?? "",
    outlet: m.outlet ?? "",
    kind: m.kind ?? "press",
    published_on: m.published_on ?? "",
    description: m.description ?? "",
    link: m.link ?? "",
    embed_url: m.embed_url ?? "",
    image: m.thumbnail ? { url: m.thumbnail, alt: m.thumbnail_alt ?? "" } : null,
  };
}

function toValues(d: Draft): Partial<MediaRow> {
  return {
    title: d.title.trim(),
    outlet: urlOrNull(d.outlet),
    kind: d.kind,
    published_on: d.published_on || null,
    description: urlOrNull(d.description),
    link: urlOrNull(d.link),
    embed_url: urlOrNull(d.embed_url),
    thumbnail: d.image?.url ?? null,
    thumbnail_alt: d.image ? d.image.alt.trim() : null,
  };
}

export function MediaForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const save = useSaveState();

  const loaded = useLoad(async () => (id ? getRow("media_items", id) : { data: null, error: null }), [id]);
  const [saved, setSaved] = useState<Draft>(EMPTY);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tried, setTried] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    const d = loaded.data ? fromRow(loaded.data) : EMPTY;
    setSaved(d);
    setDraft(d);
  }, [loaded.loading, loaded.error, loaded.data]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const titleErr = draft.title.trim() ? null : "A title is required.";
  const linkErr = draft.link.trim() ? urlError(draft.link, { allowHttp: true }) : "The link to the original is required.";
  const embedErr = urlError(draft.embed_url);
  const imgErr = imageError(draft.image);
  const firstError = titleErr ?? linkErr ?? embedErr ?? imgErr;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function onSave() {
    setTried(true);
    if (firstError) return save.fail(firstError);
    const values = toValues(draft);
    if (isNew) {
      const count = await countRows("media_items");
      values.sort_order = (count ?? 0) + 1;
    }
    let newId: string | null = null;
    const ok = await save.run(async () => {
      const r = isNew ? await insertRow("media_items", values) : await updateRow("media_items", id as string, values);
      if (r.error !== null) return { error: r.error };
      newId = r.data.id;
      return "Saved";
    });
    if (!ok) return;
    setSaved({ ...draft });
    if (isNew && newId) navigate(`/admin/media/${newId}`, { replace: true });
  }

  async function onDelete() {
    if (!id) return;
    const ok = await confirm({
      title: "Delete this entry?",
      body: `"${saved.title}" comes off the press page straight away. This cannot be undone.`,
      confirmLabel: "Delete entry",
    });
    if (!ok) return;
    setDeleting(true);
    const r = await deleteRow("media_items", id);
    setDeleting(false);
    if (r.error !== null) return toast(r.error, "error");
    toast("Deleted");
    navigate("/admin/media", { replace: true });
  }

  if (!isNew && !loaded.loading && loaded.error === null && !loaded.data) {
    return (
      <>
        <PageHeader title="Entry not found" back={{ to: "/admin/media", label: "Back to media and podcast" }} />
        <Notice tone="error">This entry no longer exists. It may have been deleted on another device.</Notice>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={isNew ? "Add an entry" : saved.title || "Edit entry"}
        intro={isNew ? "An article, podcast, interview or video the company appeared in." : undefined}
        back={{ to: "/admin/media", label: "Back to media and podcast" }}
        actions={
          !isNew && (
            <a href="/media" target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
              View the press page
            </a>
          )
        }
      />

      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}
      {loaded.loading && !isNew && <p className="adm-muted" role="status">Loading...</p>}

      <div className="adm-stack">
        <section className="adm-card" aria-labelledby="media-what-h">
          <h2 id="media-what-h" className="adm-h2">
            What it was
          </h2>
          <div className="adm-stack">
            <TextInput label="Title" value={draft.title} onChange={(v) => set("title", v)} error={tried ? titleErr : null} hint="As the article, episode or video is titled." disabled={loaded.loading} />
            {/* Each field in its own cell: the kit spaces adjacent fields
                vertically, which a grid does not want. */}
            <div className="adm-grid2">
              <div>
                <Select label="Type" value={draft.kind} onChange={(v) => set("kind", v as MediaRow["kind"])} options={KIND_OPTIONS} disabled={loaded.loading} />
              </div>
              <div>
                <TextInput label="Outlet" optional value={draft.outlet} onChange={(v) => set("outlet", v)} hint="The publication, show or channel." disabled={loaded.loading} />
              </div>
            </div>
            <TextInput label="Date" optional type="date" value={draft.published_on} onChange={(v) => set("published_on", v)} hint="The press page shows the month and year." disabled={loaded.loading} />
            <TextArea label="Description" optional rows={4} value={draft.description} onChange={(v) => set("description", v)} hint="One or two sentences under the title on the press page." disabled={loaded.loading} />
          </div>
        </section>

        <section className="adm-card" aria-labelledby="media-where-h">
          <h2 id="media-where-h" className="adm-h2">
            Where to find it
          </h2>
          <div className="adm-stack">
            <TextInput
              label="Link to the original"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://"
              value={draft.link}
              onChange={(v) => set("link", v)}
              error={tried || draft.link ? linkErr : null}
              hint="The press page links every entry straight out to it."
              disabled={loaded.loading}
            />
            <TextInput
              label="Player link"
              optional
              type="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://"
              value={draft.embed_url}
              onChange={(v) => set("embed_url", v)}
              error={embedErr}
              hint="A link that plays the episode or video itself, if the outlet gives one. Kept for later: the press page does not show players yet."
              disabled={loaded.loading}
            />
            <ImageUpload label="Picture" value={draft.image} onChange={(v) => set("image", v)} folder="media" hint="Optional. The outlet's logo or a frame from the piece. JPG, PNG, WebP or AVIF, up to 10 MB." />
          </div>
        </section>
      </div>

      <SaveBar status={save.status} dirty={dirty} onSave={onSave} disabled={loaded.loading || loaded.error !== null}>
        {!isNew && (
          <AdminButton variant="danger" onClick={onDelete} busy={deleting} busyLabel="Deleting">
            Delete
          </AdminButton>
        )}
      </SaveBar>
    </>
  );
}
