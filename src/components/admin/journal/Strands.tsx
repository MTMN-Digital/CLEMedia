import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { type Category, type Result, countRows, reorderRows, deleteRow, updateRow, slugify, insertRow, useLoad, getRow, listRows } from "@/lib/admin";
import {
  EmptyState,
  SaveBar,
  useConfirm,
  AdminButton,
  DataTable,
  Notice,
  useSaveState,
  slugError,
  AdminLinkButton,
  MoveButtons,
  PageHeader,
  TextInput,
  moveId,
  useToast,
  TextArea,
} from "@/components/admin/kit";
import { STRANDS } from "@/components/journal/data";

/* ============================================================================
   The journal's strands (the `categories` table).

   The journal index always shows four written strands, bundled in
   src/components/journal/data.ts, even when this table is empty. A row with
   the same matching name takes over that strand's name and description; any
   other row is a strand of Conor's own, listed after the four. So the first
   useful thing this view offers is to add the four as rows, which is what
   makes renaming one possible.
   ========================================================================== */

const ORDER = { order: [{ column: "sort_order" as const }, { column: "name" as const }] };

export function StrandList() {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const strands = useLoad(() => listRows("categories", ORDER), []);
  const [busy, setBusy] = useState(false);
  const rows = strands.data;

  async function move(id: string, dir: -1 | 1) {
    if (!rows) return;
    setBusy(true);
    const r = await reorderRows("categories", moveId(rows.map((c) => c.id), id, dir));
    setBusy(false);
    if (r.error !== null) return toast(r.error, "error");
    toast("Order saved");
    strands.reload();
  }

  async function addWritten() {
    setBusy(true);
    for (const [i, s] of STRANDS.entries()) {
      const r = await insertRow("categories", { name: s.name, slug: s.slug, description: s.blurb, sort_order: i + 1 });
      if (r.error !== null) {
        setBusy(false);
        return toast(r.error, "error");
      }
    }
    setBusy(false);
    toast("Four strands added");
    strands.reload();
  }

  async function remove(c: Category) {
    const ok = await confirm({
      title: `Delete "${c.name}"?`,
      body: "Posts in it keep their words and lose the strand. One of the four written strands goes back to its original name on the site; a strand of your own disappears from the index.",
      confirmLabel: "Delete strand",
    });
    if (!ok) return;
    const r = await deleteRow("categories", c.id);
    if (r.error !== null) return toast(r.error, "error");
    toast("Deleted");
    strands.reload();
  }

  const written = STRANDS.map((s) => s.name).join(", ");

  return (
    <>
      <PageHeader
        back={{ to: "/admin/journal", label: "Journal" }}
        title="Strands"
        intro={`The journal index shows four written strands (${written}) even with none listed here. Add them to rename or describe one, or add a strand of your own.`}
        actions={<AdminLinkButton to="/admin/journal/strands/new" variant="primary">New strand</AdminLinkButton>}
      />
      <DataTable
        rows={rows}
        loading={strands.loading}
        error={strands.error}
        rowKey={(c) => c.id}
        onRowClick={(c) => navigate(`/admin/journal/strands/${c.id}`)}
        caption="Journal strands in running order"
        columns={[
          {
            key: "name",
            label: "Strand",
            primary: true,
            render: (c) => (
              <Link to={`/admin/journal/strands/${c.id}`} className="adm-linkbtn">
                {c.name}
              </Link>
            ),
          },
          { key: "slug", label: "Matching name", render: (c) => <span className="font-mono text-[14px]">{c.slug}</span> },
          { key: "description", label: "Description", hideOnPhone: true, render: (c) => c.description ?? "" },
          {
            key: "actions",
            label: "Order",
            render: (c) => (
              <span className="flex items-center gap-3 whitespace-nowrap">
                <MoveButtons
                  label={c.name}
                  first={rows?.[0]?.id === c.id}
                  last={rows?.[rows.length - 1]?.id === c.id}
                  disabled={busy}
                  onUp={() => move(c.id, -1)}
                  onDown={() => move(c.id, 1)}
                />
                <AdminButton variant="danger" size="sm" onClick={() => remove(c)}>
                  Delete
                </AdminButton>
              </span>
            ),
          },
        ]}
        empty={{
          title: "No strands saved yet",
          body: "The journal shows its four written strands anyway. Add them here to rename or describe one, or add your own.",
          action: (
            <span className="flex flex-wrap gap-3">
              <AdminButton onClick={addWritten} busy={busy} busyLabel="Adding">
                Add the four written strands
              </AdminButton>
              <AdminLinkButton to="/admin/journal/strands/new">New strand</AdminLinkButton>
            </span>
          ),
        }}
      />
    </>
  );
}

interface Form {
  description: string;
  slug: string;
  name: string;
}

const EMPTY: Form = { name: "", slug: "", description: "" };

export function StrandEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const save = useSaveState();
  const loaded = useLoad<Category | null>(() => (id ? getRow("categories", id) : Promise.resolve<Result<Category | null>>({ data: null, error: null })), [id]);

  const [row, setRow] = useState<Category | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [snapshot, setSnapshot] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [tried, setTried] = useState(false);
  const [slugTaken, setSlugTaken] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded.data) return;
    const f = { name: loaded.data.name, slug: loaded.data.slug, description: loaded.data.description ?? "" };
    setRow(loaded.data);
    setForm(f);
    setSnapshot(f);
    setSlugTouched(true);
  }, [loaded.data]);

  const slug = slugTouched ? form.slug : slugify(form.name);
  const dirty = JSON.stringify({ ...form, slug }) !== JSON.stringify(snapshot);
  const nameError = form.name.trim() ? null : "A name is required.";
  const slugProblem = slugTaken ?? slugError(slug);
  const back = { to: "/admin/journal/strands", label: "Strands" };

  async function onSave() {
    setTried(true);
    const first = nameError ?? slugProblem;
    if (first) return save.fail(first);
    await save.run(async () => {
      const values: Partial<Category> = { name: form.name.trim(), slug, description: form.description.trim() || null };
      if (!row) values.sort_order = ((await countRows("categories")) ?? 0) + 1;
      const r = row ? await updateRow("categories", row.id, values) : await insertRow("categories", values);
      if (r.error !== null) {
        if (/web address|already/i.test(r.error)) setSlugTaken("That matching name is already used by another strand. Change it and try again.");
        return { error: r.error };
      }
      const f = { name: r.data.name, slug: r.data.slug, description: r.data.description ?? "" };
      setRow(r.data);
      setForm(f);
      setSnapshot(f);
      if (!row) navigate(`/admin/journal/strands/${r.data.id}`, { replace: true });
      return "Saved";
    });
  }

  if (id && loaded.error) {
    return (
      <>
        <PageHeader back={back} title="Strand" />
        <Notice tone="error">{loaded.error}</Notice>
      </>
    );
  }
  if (id && !loaded.loading && !loaded.data) {
    return (
      <>
        <PageHeader back={back} title="Strand" />
        <EmptyState title="That strand could not be found" action={<AdminLinkButton to="/admin/journal/strands">Back to strands</AdminLinkButton>} />
      </>
    );
  }
  if (id && !row) {
    return (
      <>
        <PageHeader back={back} title="Strand" />
        <p className="adm-muted" role="status">Loading...</p>
      </>
    );
  }

  const writtenMatch = STRANDS.find((s) => s.slug === slug);

  return (
    <>
      <PageHeader back={back} title={row ? row.name : "New strand"} />
      <div className="adm-stack">
        <section className="adm-card">
          <TextInput label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} error={tried ? nameError : null} />
          <TextInput
            label="Matching name"
            value={slug}
            onChange={(v) => {
              setSlugTouched(true);
              setSlugTaken(null);
              setForm((f) => ({ ...f, slug: v.toLowerCase().replace(/\s+/g, "-") }));
            }}
            error={slugTaken ?? (slug ? slugError(slug) : null)}
            hint={
              writtenMatch
                ? `Matches the written strand "${writtenMatch.name}", so this row renames it on the site.`
                : "Lower case letters, numbers and hyphens. The four written strands match on research, process, parents and company."
            }
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <TextArea label="Description" optional value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} rows={3} hint="One or two sentences on the journal index." />
        </section>
      </div>
      <SaveBar status={save.status} dirty={dirty} onSave={onSave} />
    </>
  );
}
