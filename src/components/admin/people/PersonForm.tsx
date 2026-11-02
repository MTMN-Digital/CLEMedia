import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  insertRow,
  updateRow,
  type PersonRow,
  deleteRow,
  getRow,
  countRows,
  removeFile,
  pathFromPublicUrl,
  IMAGE_BUCKET,
  useLoad,
} from "@/lib/admin";
import { ASSETS, type AssetKey } from "@/lib/brand";
import {
  Segmented,
  PageHeader,
  Checkbox,
  AdminButton,
  TextArea,
  imageError,
  Wizard,
  SaveBar,
  Notice,
  useSaveState,
  type ImageValue,
  ImageUpload,
  TextInput,
  useConfirm,
} from "@/components/admin/kit";
import { invalidateTeam } from "@/components/team/useTeam";
import { TYPE_OPTIONS, type PersonType, PHASE_OPTIONS } from "./shared";

/* One person: a blank form at /admin/people/new, or the row at /admin/people/:id.
   The SaveBar at the foot says what state the form is in; Delete sits beside
   Save on an existing person and confirms first. */

interface Form {
  photo: ImageValue | null;
  visible: boolean;
  phases: number[];
  role: string;
  type: PersonType;
  website: string;
  name: string;
  bio: string;
}

function fromRow(row: PersonRow): Form {
  return {
    name: row.name,
    role: row.role,
    bio: row.bio ?? "",
    type: row.type,
    website: row.website ?? "",
    phases: row.phases ?? [],
    visible: row.visible,
    photo: row.photo ? { url: row.photo, alt: row.photo_alt ?? "" } : null,
  };
}

/** Same rule as the people_website_http check in 0009: http(s) only, since
 *  the Team page renders it as a link. Only experts carry a website. */
function websiteError(f: Form): string | null {
  const w = f.website.trim();
  if (f.type !== "expert" || !w) return null;
  return /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(w) ? null : "Paste the full address, starting with https://";
}

function blank(type: PersonType): Form {
  return { name: "", role: "", bio: "", type, website: "", phases: [], visible: true, photo: null };
}

/** The bundled portrait a row still shows while no photo has been uploaded. */
function bundledPreview(assetKey: string | null | undefined): { src: string; alt: string } | undefined {
  if (!assetKey || !(assetKey in ASSETS)) return undefined;
  const a = ASSETS[assetKey as AssetKey];
  if (!a.base) return undefined;
  return { src: `${a.base}.${a.fallback ?? "jpg"}`, alt: a.alt };
}

/** Tidy the uploaded file an old photo pointed at, once it is no longer used.
 *  Best effort: a leftover object in storage is not worth an error message. */
async function dropPhoto(url: string | null | undefined) {
  const path = url ? pathFromPublicUrl(url) : null;
  if (path) await removeFile(IMAGE_BUCKET, path);
}

export function PersonForm() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const save = useSaveState();

  const row = useLoad(async () => (id ? getRow("people", id) : { data: null, error: null }), [id]);
  const [initial, setInitial] = useState<Form | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<{ website?: string; role?: string; name?: string }>({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (row.loading || row.error) return;
    const start = row.data ? fromRow(row.data) : blank(((t) => (t === "advisor" || t === "expert" ? t : "team"))(params.get("type")));
    setInitial(start);
    setForm(start);
    setErrors({});
    save.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.data, row.loading, row.error]);

  const missing = Boolean(id) && !row.loading && !row.error && !row.data;
  const dirty = Boolean(form && initial && JSON.stringify(form) !== JSON.stringify(initial));

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  function togglePhase(n: number, on: boolean) {
    setForm((f) => {
      if (!f) return f;
      const phases = on ? [...f.phases.filter((p) => p !== n), n].sort((a, b) => a - b) : f.phases.filter((p) => p !== n);
      return { ...f, phases };
    });
  }

  async function onSave() {
    if (!form) return;
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "A name is required.";
    if (!form.role.trim()) next.role = "A role is required, for example Founder and CEO.";
    const website = form.type === "expert" ? form.website.trim() : "";
    const siteErr = websiteError(form);
    if (siteErr) next.website = siteErr;
    setErrors(next);
    const photoProblem = imageError(form.photo);
    const first = next.name ?? next.role ?? next.website ?? photoProblem;
    if (first) return save.fail(first);

    const values: Partial<PersonRow> = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim() || null,
      type: form.type,
      website: website || null,
      phases: form.phases,
      visible: form.visible,
      photo: form.photo?.url ?? null,
      photo_alt: form.photo ? form.photo.alt.trim() : null,
    };

    const ok = await save.run(async () => {
      if (id) {
        const r = await updateRow("people", id, values);
        if (r.error !== null) return { error: r.error };
        if (initial?.photo?.url && initial.photo.url !== r.data.photo) await dropPhoto(initial.photo.url);
        const saved = fromRow(r.data);
        setInitial(saved);
        setForm(saved);
        return "Saved";
      }
      const existing = (await countRows("people", { type: form.type })) ?? 0;
      const r = await insertRow("people", { ...values, sort_order: existing + 1, unconfirmed: false });
      if (r.error !== null) return { error: r.error };
      return "Added";
    });
    if (ok) {
      invalidateTeam();
      if (!id) navigate("/admin/people");
    }
  }

  async function onDelete() {
    if (!id || !form) return;
    const yes = await confirm({
      title: `Delete ${form.name || "this person"}?`,
      body: "They will come off the Team page straight away. This cannot be undone.",
      confirmLabel: "Delete person",
    });
    if (!yes) return;
    setDeleting(true);
    const r = await deleteRow("people", id);
    setDeleting(false);
    if (r.error !== null) return save.fail(r.error);
    await dropPhoto(initial?.photo?.url);
    invalidateTeam();
    await save.run(async () => "Deleted");
    navigate("/admin/people");
  }

  const who = form && (
    <>
            <TextInput label="Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="off" />
            <TextInput
              label="Role"
              value={form.role}
              onChange={(v) => set("role", v)}
              error={errors.role}
              hint="As it should read under their name, for example Chief Education Advisor."
              autoComplete="off"
            />
            <Segmented label="Listed as" value={form.type} onChange={(v) => set("type", v)} options={TYPE_OPTIONS} />
            {form.type === "expert" && (
              <TextInput
                label="Their website"
                value={form.website}
                onChange={(v) => set("website", v)}
                error={errors.website}
                hint="Their name on the Team page links here. Paste the full address, for example https://example.ie"
                inputMode="url"
                autoComplete="off"
              />
            )}
    </>
  );
  const bio = form && (
    <>
            <TextArea
              label="Biography"
              optional
              value={form.bio}
              onChange={(v) => set("bio", v)}
              rows={10}
              hint="Leave a blank line between paragraphs. The first paragraph is what this person does at CLÉ Family Media and is always shown; the rest opens under a More button."
            />
    </>
  );
  const photo = form && (
    <>
            <ImageUpload
              label="Portrait"
              value={form.photo}
              onChange={(v) => set("photo", v)}
              folder="people"
              hint={form.type === "expert" ? "Optional: their headshot or practice logo, shown small beside their name. A square crop works best." : "A square crop works best. JPG, PNG, WebP or AVIF, up to 10 MB."}
              defaultPreview={bundledPreview(row.data?.asset_key)}
            />
    </>
  );
  const phases = form && (
    <>
            <p className="adm-muted">
              Tick the phases this person takes part in. Leave them all unticked for someone outside the script and episode reviews.
            </p>
            <div>
              {PHASE_OPTIONS.map((p) => (
                <Checkbox key={p.n} label={`${p.n}. ${p.label}`} checked={form.phases.includes(p.n)} onChange={(on) => togglePhase(p.n, on)} />
              ))}
            </div>
    </>
  );
  const site = form && (
    <>
            <Checkbox
              label="Shown on the Team page"
              checked={form.visible}
              onChange={(v) => set("visible", v)}
              hint="Untick to take this person off the site without deleting them."
            />
    </>
  );

  if (!id && form) {
    const nameErr = form.name.trim() ? null : "A name is required.";
    const roleErr = form.role.trim() ? null : "A role is required, for example Founder and CEO.";
    const siteErr = websiteError(form);
    return (
      <>
        <PageHeader title="Add a person" intro="Four short steps. They appear on the Team page once you finish." back={{ to: "/admin/people", label: "Back to the team" }} />
        <Wizard
          status={save.status}
          onShowErrors={(show) => setErrors(show ? { name: nameErr ?? undefined, role: roleErr ?? undefined, website: siteErr ?? undefined } : {})}
          onFinish={onSave}
          finishLabel={form.visible ? "Add to the Team page" : "Add, not shown yet"}
          finishingLabel="Adding"
          steps={[
            { title: "Who they are", answer: form.name && `${form.name}, ${form.role}`, error: nameErr ?? roleErr ?? siteErr, body: who },
            { title: "Biography", answer: form.bio.trim() ? "Written" : "None yet", body: bio },
            { title: "Photo", answer: form.photo ? "Added" : "None yet", error: imageError(form.photo), body: photo },
            {
              title: form.type === "expert" ? "Check" : "Phases and check",
              body: (
                <>
                  {form.type !== "expert" && phases}
                  {site}
                </>
              ),
            },
          ]}
        />
      </>
    );
  }

  const title = id ? (form?.name.trim() || "Edit person") : "Add a person";

  return (
    <>
      <PageHeader title={title} back={{ to: "/admin/people", label: "Back to the team" }} />

      {row.error && <Notice tone="error">{row.error}</Notice>}
      {missing && <Notice tone="error">That person could not be found. They may have been deleted.</Notice>}
      {row.loading && !form && <p className="adm-muted" role="status">Loading...</p>}

      {form && !missing && (
        <form
          className="adm-stack"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="adm-card adm-stack">
            <h2 className="adm-h2">About</h2>
            {who}
            {bio}
          </div>

          <div className="adm-card adm-stack">
            <h2 className="adm-h2">Photo</h2>
            {photo}
          </div>

          {form.type !== "expert" && (
            <div className="adm-card adm-stack">
              <h2 className="adm-h2">Production phases</h2>
              {phases}
            </div>
          )}

          <div className="adm-card adm-stack">
            <h2 className="adm-h2">On the site</h2>
            {site}
          </div>

          <SaveBar status={save.status} dirty={dirty} onSave={onSave} saveLabel={id ? "Save" : "Add person"} savingLabel={id ? "Saving" : "Adding"}>
            {id && (
              <AdminButton variant="danger" onClick={onDelete} busy={deleting} busyLabel="Deleting">
                Delete
              </AdminButton>
            )}
          </SaveBar>
        </form>
      )}
    </>
  );
}
