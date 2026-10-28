import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { type Result, useLoad, insertRow, listRows, updateRow, type PostRow, deleteRow, getRow, formatDateTime } from "@/lib/admin";
import {
  TextArea,
  DateTimeInput,
  type ImageValue,
  useConfirm,
  StatusPill,
  ImageUpload,
  Wizard,
  useToast,
  slugError,
  imageError,
  PageHeader,
  Segmented,
  Notice,
  Select,
  useSaveState,
  TextInput,
  SaveBar,
  AdminButton,
  SlugField,
} from "@/components/admin/kit";
import { PostBody } from "@/components/journal/PostBody";
import { STATE_TONE, stateLabel, postState } from "./state";

/* ============================================================================
   Writing and publishing one post.

   WHAT THE BUTTONS WRITE. "Save draft" stores status 'draft'. "Publish"
   stores status 'published' with the chosen date, or now when none is
   chosen; a date still to come is how a piece is scheduled (see state.ts).
   "Unpublish" puts it back to 'draft'. A live piece simply has "Save", which
   keeps it live. Nothing here ever writes status 'scheduled'.

   THE BODY IS PLAIN TEXT. It renders on the site through PostBody, which
   turns a small Markdown subset into the site's type and never builds HTML
   from a string. The preview below uses the same component, so what Conor
   sees here is what a reader gets.
   ========================================================================== */

interface Form {
  published_at: string | null;
  category_id: string;
  author: string;
  body: string;
  image: ImageValue | null;
  slug: string;
  excerpt: string;
  title: string;
}

const EMPTY: Form = { title: "", slug: "", category_id: "", excerpt: "", body: "", author: "", image: null, published_at: null };

function fromRow(p: PostRow): Form {
  return {
    title: p.title,
    slug: p.slug,
    category_id: p.category_id ?? "",
    excerpt: p.excerpt ?? "",
    body: p.body ?? "",
    author: p.author ?? "",
    image: p.hero_image ? { url: p.hero_image, alt: p.hero_alt ?? "" } : null,
    published_at: p.published_at,
  };
}

function toValues(f: Form): Partial<PostRow> {
  return {
    title: f.title.trim(),
    slug: f.slug,
    category_id: f.category_id || null,
    excerpt: f.excerpt.trim() || null,
    body: f.body.trim() ? f.body : null,
    author: f.author.trim() || null,
    hero_image: f.image?.url ?? null,
    hero_alt: f.image ? f.image.alt.trim() : null,
    published_at: f.published_at,
    updated_at: new Date().toISOString(),
  };
}

const GUIDE = (
  <>
    Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading, <code>### </code> for a smaller one,{" "}
    <code>&gt; </code> for a pull quote, <code>- </code> for a bullet, <code>1. </code> for a numbered list, or <code>---</code> on its own
    for a rule. In a sentence, <code>**bold**</code>, <code>*italic*</code> and <code>[words](https://...)</code> for a link. A picture is{" "}
    <code>![caption](image address)</code>, or use "Add a picture" below.
  </>
);

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const save = useSaveState();

  const strands = useLoad(() => listRows("categories", { order: [{ column: "sort_order" }, { column: "name" }] }), []);
  const loaded = useLoad<PostRow | null>(() => (id ? getRow("posts", id) : Promise.resolve<Result<PostRow | null>>({ data: null, error: null })), [id]);

  const [row, setRow] = useState<PostRow | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [snapshot, setSnapshot] = useState<Form>(EMPTY);
  const [view, setView] = useState<"preview" | "write">("write");
  const [tried, setTried] = useState(false);
  const [slugTaken, setSlugTaken] = useState<string | null>(null);
  const [picture, setPicture] = useState<ImageValue | null>(null);
  const [when, setWhen] = useState<"live" | "draft">("live");

  useEffect(() => {
    if (!loaded.data) return;
    const f = fromRow(loaded.data);
    setRow(loaded.data);
    setForm(f);
    setSnapshot(f);
  }, [loaded.data]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const live = row?.status === "published";
  const dirty = JSON.stringify(form) !== JSON.stringify(snapshot);
  const titleError = form.title.trim() ? null : "A title is required.";
  const firstError = titleError ?? slugTaken ?? slugError(form.slug) ?? imageError(form.image);

  /** Marks the form as attempted and says the first problem, if any. */
  function check(): boolean {
    setTried(true);
    if (firstError) {
      save.fail(firstError);
      return false;
    }
    return true;
  }

  async function persist(values: Partial<PostRow>, done: string) {
    await save.run(async () => {
      const r = row ? await updateRow("posts", row.id, values) : await insertRow("posts", values);
      if (r.error !== null) {
        if (/web address/i.test(r.error)) setSlugTaken(r.error);
        return { error: r.error };
      }
      const f = fromRow(r.data);
      setRow(r.data);
      setForm(f);
      setSnapshot(f);
      if (!row) navigate(`/admin/journal/${r.data.id}`, { replace: true });
      return done;
    });
  }

  async function onSave() {
    if (!check()) return;
    if (live) {
      /* A live piece must keep a date, or the public policy would hide it. */
      const when = form.published_at ?? row?.published_at ?? new Date().toISOString();
      await persist({ ...toValues(form), status: "published", published_at: when }, "Saved");
    } else {
      await persist({ ...toValues(form), status: "draft" }, "Draft saved");
    }
  }

  async function onPublish() {
    if (!check()) return;
    if (!form.body.trim()) return save.fail("Write the piece before publishing it.");
    const when = form.published_at ?? new Date().toISOString();
    const future = new Date(when).getTime() > Date.now();
    await persist({ ...toValues(form), status: "published", published_at: when }, future ? `Scheduled for ${formatDateTime(when)}` : "Published");
  }

  async function onUnpublish() {
    if (!row) return;
    const ok = await confirm({
      title: "Take this piece off the journal?",
      body: "It leaves the site straight away and becomes a draft. You can publish it again later.",
      confirmLabel: "Unpublish",
    });
    if (!ok) return;
    /* Taking a piece down never waits on a half-finished edit: with a field
       that would not save, only the status changes and the saved text stays. */
    await persist(check() ? { ...toValues(form), status: "draft" } : { status: "draft" }, "Moved to drafts");
  }

  async function onDelete() {
    if (!row) return;
    const ok = await confirm({
      title: `Delete "${row.title}"?`,
      body: "This cannot be undone. The piece is removed from the journal and from this list.",
      confirmLabel: "Delete post",
    });
    if (!ok) return;
    const r = await deleteRow("posts", row.id);
    if (r.error !== null) return toast(r.error, "error");
    toast("Deleted");
    navigate("/admin/journal");
  }

  function addPicture() {
    if (!picture || imageError(picture)) return;
    const caption = picture.alt.trim().replace(/[[\]]/g, "");
    set("body", `${form.body.replace(/\s+$/, "")}\n\n![${caption}](${picture.url})\n`);
    setPicture(null);
    toast("Picture added at the end of the piece");
  }

  const back = { to: "/admin/journal", label: "Journal" };

  if (id && loaded.error) {
    return (
      <>
        <PageHeader back={back} title="Post" />
        <Notice tone="error">{loaded.error}</Notice>
      </>
    );
  }
  if (id && !loaded.loading && !loaded.data) {
    return (
      <>
        <PageHeader back={back} title="Post" />
        <Notice>
          That post could not be found. <Link to="/admin/journal" className="adm-linkbtn">Back to the journal</Link>
        </Notice>
      </>
    );
  }
  if (id && !row) {
    return (
      <>
        <PageHeader back={back} title="Post" />
        <p className="adm-muted" role="status">Loading...</p>
      </>
    );
  }

  const strandOptions = [{ value: "", label: "No strand" }, ...(strands.data ?? []).map((c) => ({ value: c.id, label: c.name }))];

  const piece = (
    <>
          <TextInput label="Title" value={form.title} onChange={(v) => set("title", v)} error={tried ? titleError : null} />
          <SlugField
            value={form.slug}
            onChange={(v) => {
              setSlugTaken(null);
              set("slug", v);
            }}
            source={form.title}
            prefix="/journal/"
            error={slugTaken}
          />
          <Select
            label="Strand"
            value={form.category_id}
            onChange={(v) => set("category_id", v)}
            options={strandOptions}
            hint={
              strands.data && strands.data.length === 0 ? (
                <>
                  No strands saved yet. <Link to="/admin/journal/strands" className="adm-linkbtn">Add strands</Link>
                </>
              ) : undefined
            }
          />
          <TextArea label="Standfirst" optional value={form.excerpt} onChange={(v) => set("excerpt", v)} rows={3} hint="One or two sentences under the title, and the line shown on the journal index." />
          <TextInput label="Written by" optional value={form.author} onChange={(v) => set("author", v)} hint="Left empty, no name is shown." autoComplete="off" />
    </>
  );
  const text = (
    <>
          <Segmented<"preview" | "write">
            label="View"
            hideLabel
            value={view}
            onChange={setView}
            options={[
              { value: "write", label: "Write" },
              { value: "preview", label: "Preview" },
            ]}
          />
          {view === "write" ? (
            <>
              <TextArea label="Text" value={form.body} onChange={(v) => set("body", v)} rows={16} hint={GUIDE} spellCheck />
              <div className="mt-2 border-t-2 border-[var(--color-rule-soft)] pt-4">
                <ImageUpload label="Add a picture" value={picture} onChange={setPicture} folder="posts" hint="Goes in at the end of the text. Move the line it makes to where you want it." />
                {picture?.url && (
                  <AdminButton variant="quiet" size="sm" onClick={addPicture} disabled={Boolean(imageError(picture))}>
                    Add to the piece
                  </AdminButton>
                )}
              </div>
            </>
          ) : (
            <div className="mt-2">
              <h3 className="font-display text-[28px] leading-[1.1] text-ink">{form.title.trim() || "Untitled"}</h3>
              {form.excerpt.trim() && <p className="mt-3 text-[17px] leading-[1.5] text-body">{form.excerpt}</p>}
              {form.image?.url && <img src={form.image.url} alt={form.image.alt} className="mt-5 w-full rounded-[var(--radius-md)]" />}
              {form.body.trim() ? (
                <PostBody body={form.body} className="mt-6" />
              ) : (
                <p className="adm-muted mt-4">Nothing written yet.</p>
              )}
            </div>
          )}
    </>
  );
  const cover = (
    <>
          <ImageUpload label="Cover image" value={form.image} onChange={(v) => set("image", v)} folder="posts" hint="Optional. Shown at the top of the piece. JPG, PNG, WebP or AVIF, up to 10 MB." />
    </>
  );
  const publishing = (
    <>
          <DateTimeInput
            label="Publish date"
            optional
            value={form.published_at}
            onChange={(v) => set("published_at", v)}
            hint="Leave it empty to publish straight away. A date still to come schedules the piece: it goes live on the site by itself at that time."
          />
          {row && postState(row) === "published" && (
            <p className="adm-muted">
              <a href={`/journal/${row.slug}`} target="_blank" rel="noreferrer" className="adm-linkbtn">
                View on the site
              </a>
            </p>
          )}
          {row && postState(row) === "scheduled" && <p className="adm-muted">Goes live on {formatDateTime(row.published_at)}. Unpublish to hold it.</p>}
    </>
  );

  if (!id) {
    const now = form.published_at === null || new Date(form.published_at).getTime() <= Date.now();
    const goLive = when === "live";
    return (
      <>
        <PageHeader back={back} title="Write a journal post" intro="Four short steps. Nothing goes on the journal until the last one." />
        <Wizard
          status={save.status}
          onShowErrors={setTried}
          onFinish={() => void (goLive ? onPublish() : onSave())}
          finishLabel={goLive ? (now ? "Publish now" : "Schedule it") : "Save as a draft"}
          finishingLabel={goLive ? "Publishing" : "Saving"}
          steps={[
            { title: "The piece", answer: form.title, error: titleError ?? slugTaken ?? slugError(form.slug), body: piece },
            { title: "Write it", answer: form.body.trim() ? `${form.body.trim().split(/\s+/).length} words` : "Not yet", body: text },
            { title: "Cover picture", answer: form.image ? "Added" : "None", error: imageError(form.image), body: cover },
            {
              title: "Publish",
              error: goLive && !form.body.trim() ? "Write the piece before publishing it, or save it as a draft." : null,
              body: (
                <>
                  <Segmented<"live" | "draft">
                    label="When it is finished"
                    value={when}
                    onChange={setWhen}
                    options={[
                      { value: "live", label: "Put it on the journal" },
                      { value: "draft", label: "Keep it as a draft" },
                    ]}
                  />
                  {goLive && publishing}
                </>
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
        back={back}
        title={row ? row.title : "New post"}
        actions={row && <StatusPill tone={STATE_TONE[postState(row)]}>{stateLabel(row)}</StatusPill>}
      />

      <div className="adm-stack">
        <section className="adm-card">
          <h2 className="adm-h2">The piece</h2>
          {piece}
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Body</h2>
          {text}
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Cover image</h2>
          {cover}
        </section>

        <section className="adm-card">
          <h2 className="adm-h2">Publishing</h2>
          {publishing}
        </section>
      </div>

      <SaveBar status={save.status} dirty={dirty} onSave={onSave} saveLabel={live ? "Save" : "Save draft"}>
        {row && (
          <AdminButton variant="danger" onClick={onDelete}>
            Delete
          </AdminButton>
        )}
        {live ? (
          <AdminButton variant="quiet" onClick={onUnpublish}>
            Unpublish
          </AdminButton>
        ) : (
          <AdminButton variant="primary" onClick={onPublish} busy={save.saving} busyLabel="Publishing">
            Publish
          </AdminButton>
        )}
      </SaveBar>
    </>
  );
}
