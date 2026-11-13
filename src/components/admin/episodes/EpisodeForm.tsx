import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRow, listRows, getRow, type EpisodeRow, updateRow, insertRow, useLoad } from "@/lib/admin";
import {
  useConfirm,
  useToast,
  useSaveState,
  type ImageValue,
  TextArea,
  TextInput,
  imageError,
  SaveBar,
  Notice,
  PageHeader,
  ImageUpload,
  Checkbox,
  AdminButton,
  Wizard,
} from "@/components/admin/kit";
import { invalidateEpisodes } from "@/lib/useEpisodes";
import { urlOrNull, urlError } from "../links/urls";

/* One episode. New at /admin/episodes/new, existing at /admin/episodes/:id.
   The YouTube link is what makes an episode "released": without it the site
   shows the thumbnail with Coming soon and no link. */

interface Draft {
  number: string;
  runtime: string;
  title: string;
  youtube_url: string;
  image: ImageValue | null;
  synopsis: string;
  visible: boolean;
}

const EMPTY: Draft = { number: "", title: "", image: null, youtube_url: "", runtime: "", synopsis: "", visible: true };

function fromRow(e: EpisodeRow): Draft {
  return {
    number: String(e.number),
    title: e.title ?? "",
    image: e.thumbnail ? { url: e.thumbnail, alt: e.thumbnail_alt ?? "" } : null,
    youtube_url: e.youtube_url ?? "",
    runtime: e.runtime ?? "",
    synopsis: e.synopsis ?? "",
    visible: e.visible,
  };
}

function toValues(d: Draft): Partial<EpisodeRow> {
  return {
    number: Number(d.number),
    title: d.title.trim(),
    thumbnail: d.image?.url ?? null,
    thumbnail_alt: d.image ? d.image.alt.trim() : null,
    youtube_url: urlOrNull(d.youtube_url),
    runtime: urlOrNull(d.runtime),
    synopsis: urlOrNull(d.synopsis),
    visible: d.visible,
  };
}

export function EpisodeForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const save = useSaveState();

  const loaded = useLoad(async () => (id ? getRow("episodes", id) : { data: null, error: null }), [id]);
  const [saved, setSaved] = useState<Draft>(EMPTY);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [tried, setTried] = useState(false);
  const [deleting, setDeleting] = useState(false);
  /* The six seeded episodes carry a built-in slate, so a thumbnail is optional
     for them. A new episode has nothing to show without one. */
  const hasSlate = !!loaded.data?.asset_key;

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    if (loaded.data) {
      const d = fromRow(loaded.data);
      setSaved(d);
      setDraft(d);
      return;
    }
    /* A new episode starts at the next number. */
    listRows("episodes", { order: [{ column: "number", ascending: false }] }).then((r) => {
      const next = r.error === null && r.data.length ? r.data[0].number + 1 : 1;
      const d = { ...EMPTY, number: String(next) };
      setSaved(d);
      setDraft(d);
    });
  }, [loaded.loading, loaded.error, loaded.data]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const numErr = /^\d{1,4}$/.test(draft.number.trim()) && Number(draft.number) > 0 ? null : "Enter the episode number, for example 7.";
  const titleErr = draft.title.trim() ? null : "A title is required.";
  const linkErr = urlError(draft.youtube_url, { allowHttp: true });
  const imgErr = imageError(draft.image, !hasSlate);
  const firstError = numErr ?? titleErr ?? imgErr ?? linkErr;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function onSave() {
    setTried(true);
    if (firstError) return save.fail(firstError);
    const values = toValues(draft);
    if (isNew) values.sort_order = values.number;
    let newId: string | null = null;
    const ok = await save.run(async () => {
      const r = isNew ? await insertRow("episodes", values) : await updateRow("episodes", id as string, values);
      if (r.error !== null) return { error: r.error };
      newId = r.data.id;
      return "Saved";
    });
    if (!ok) return;
    invalidateEpisodes();
    setSaved({ ...draft });
    if (isNew && newId) navigate(`/admin/episodes/${newId}`, { replace: true });
  }

  async function onDelete() {
    if (!id) return;
    const ok = await confirm({
      title: "Delete this episode?",
      body: `"${saved.title}" comes off the site straight away. To take it off for now and keep it here, untick "Show on the site" instead.`,
      confirmLabel: "Delete episode",
    });
    if (!ok) return;
    setDeleting(true);
    const r = await deleteRow("episodes", id);
    setDeleting(false);
    if (r.error !== null) return toast(r.error, "error");
    invalidateEpisodes();
    toast("Deleted");
    navigate("/admin/episodes", { replace: true });
  }

  if (!isNew && !loaded.loading && loaded.error === null && !loaded.data) {
    return (
      <>
        <PageHeader title="Episode not found" back={{ to: "/admin/episodes", label: "Back to episodes" }} />
        <Notice tone="error">This episode no longer exists. It may have been deleted on another device.</Notice>
      </>
    );
  }

  const what = (
    <>
      <div className="adm-grid2">
        <div>
          <TextInput label="Episode number" inputMode="numeric" value={draft.number} onChange={(v) => set("number", v)} error={tried ? numErr : null} disabled={loaded.loading} />
        </div>
        <div>
          <TextInput label="Running time" optional value={draft.runtime} onChange={(v) => set("runtime", v)} hint="Minutes and seconds, for example 9:58." disabled={loaded.loading} />
        </div>
      </div>
      <TextInput label="Title" value={draft.title} onChange={(v) => set("title", v)} error={tried ? titleErr : null} disabled={loaded.loading} />
      <TextArea label="Short description" optional rows={3} value={draft.synopsis} onChange={(v) => set("synopsis", v)} hint="One sentence about the episode." disabled={loaded.loading} />
    </>
  );
  const where = (
    <>
      <ImageUpload
        label="Thumbnail"
        value={draft.image}
        onChange={(v) => set("image", v)}
        folder="episodes"
        hint={hasSlate ? "Optional. Replaces the built-in title slate. Landscape works best." : "The episode's title card or a frame from it. Landscape works best. JPG, PNG, WebP or AVIF, up to 10 MB."}
      />
      {tried && imgErr && <Notice tone="error">{imgErr}</Notice>}
      <TextInput
        label="YouTube link"
        optional
        type="url"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="https://www.youtube.com/watch?v="
        value={draft.youtube_url}
        onChange={(v) => set("youtube_url", v)}
        error={draft.youtube_url ? linkErr : null}
        hint="Leave empty until the episode is out. Without a link the site shows Coming soon."
        disabled={loaded.loading}
      />
      <Checkbox label="Show on the site" checked={draft.visible} onChange={(v) => set("visible", v)} disabled={loaded.loading} />
    </>
  );

  if (isNew) {
    return (
      <>
        <PageHeader title="Add an episode" intro="Three short steps." back={{ to: "/admin/episodes", label: "Back to episodes" }} />
        <Wizard
          status={save.status}
          onShowErrors={setTried}
          onFinish={onSave}
          finishLabel={draft.visible ? "Add to the site" : "Add, not shown yet"}
          finishingLabel="Adding"
          steps={[
            { title: "The episode", answer: draft.title && `${draft.number}, ${draft.title}`, error: numErr ?? titleErr, body: what },
            { title: "Thumbnail and link", answer: draft.youtube_url || (draft.image ? "Coming soon" : ""), error: imgErr ?? linkErr, body: where },
            {
              title: "Check and add",
              body: (
                <dl className="adm-review">
                  <dt>Episode</dt>
                  <dd>{draft.number}</dd>
                  <dt>Title</dt>
                  <dd>{draft.title}</dd>
                  <dt>Thumbnail</dt>
                  <dd>{draft.image ? "Added" : "None"}</dd>
                  <dt>Shows as</dt>
                  <dd>{draft.youtube_url ? "Watch on YouTube" : "Coming soon"}</dd>
                </dl>
              ),
            },
          ]}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={saved.title || "Edit episode"}
        back={{ to: "/admin/episodes", label: "Back to episodes" }}
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
            View the home page
          </a>
        }
      />
      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}
      {loaded.loading && <p className="adm-muted" role="status">Loading...</p>}
      <div className="adm-stack">
        <section className="adm-card" aria-labelledby="ep-what-h">
          <h2 id="ep-what-h" className="adm-h2">The episode</h2>
          <div className="adm-stack">{what}</div>
        </section>
        <section className="adm-card" aria-labelledby="ep-where-h">
          <h2 id="ep-where-h" className="adm-h2">Thumbnail and link</h2>
          <div className="adm-stack">{where}</div>
        </section>
      </div>
      <SaveBar status={save.status} dirty={dirty} onSave={onSave} disabled={loaded.loading || loaded.error !== null}>
        <AdminButton variant="danger" onClick={onDelete} busy={deleting} busyLabel="Deleting">
          Delete
        </AdminButton>
      </SaveBar>
    </>
  );
}
