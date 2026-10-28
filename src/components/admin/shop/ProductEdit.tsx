import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  pathFromPublicUrl,
  getRow,
  FILE_BUCKET,
  insertRow,
  type ProductRow,
  countRows,
  removeFile,
  IMAGE_BUCKET,
  updateRow,
  deleteRow,
} from "@/lib/admin";
import {
  slugError,
  Notice,
  type ImageValue,
  AdminButton,
  useToast,
  TextArea,
  FileUpload,
  PriceField,
  TextInput,
  imageError,
  SlugField,
  SaveBar,
  useConfirm,
  PageHeader,
  Wizard,
  ImageUpload,
  useSaveState,
  Segmented,
} from "@/components/admin/kit";

/* ============================================================================
   One product: made at /admin/shop/new, edited at /admin/shop/:id.

   The form holds what the row holds, in the editor's words: a title, the web
   address under /shop/, what is in the file, the price in euro, the cover
   with its description, the file buyers get, and whether it is on the shop.
   Nothing is saved until the bar at the bottom says so; the two uploads are
   the exception, because a preview that is not the stored file is a lie.

   Publishing needs a file. A product can be saved hidden with no file while
   the zip is being finished, but it cannot be put on the shop with nothing
   behind the Buy button, and the field says so before the save is tried.
   ========================================================================== */

type Shelf = "hidden" | "published";

interface Form {
  cents: number | null;
  title: string;
  image: ImageValue | null;
  filePath: string;
  slug: string;
  shelf: Shelf;
  description: string;
}

const EMPTY: Form = { title: "", slug: "", description: "", cents: null, image: null, filePath: "", shelf: "hidden" };

function fromRow(p: ProductRow): Form {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description ?? "",
    cents: p.price_cents,
    image: p.thumbnail ? { url: p.thumbnail, alt: p.thumbnail_alt ?? "" } : null,
    filePath: p.file_path,
    shelf: p.active ? "published" : "hidden",
  };
}

/* Each sentence sits by its field. The first one found is also what the save
   bar says, so a phone user whose field is off screen still learns why. */
function problems(f: Form) {
  return {
    title: f.title.trim() ? null : "A title is required.",
    slug: slugError(f.slug),
    price: f.cents == null ? "A price is required, for example 4.99." : null,
    image: imageError(f.image),
    file:
      f.shelf === "published" && !f.filePath
        ? "Upload the file before publishing, or keep the product hidden for now."
        : null,
  };
}

export function ProductEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const save = useSaveState();

  const [form, setForm] = useState<Form | null>(isNew ? EMPTY : null);
  const [stored, setStored] = useState<Form | null>(isNew ? EMPTY : null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let live = true;
    getRow("products", id).then((r) => {
      if (!live) return;
      if (r.error !== null) return setLoadError(r.error);
      if (!r.data) return setLoadError("That product could not be found. It may have been deleted.");
      const f = fromRow(r.data);
      setForm(f);
      setStored(f);
    });
    return () => {
      live = false;
    };
  }, [id]);

  const set = (patch: Partial<Form>) => setForm((f) => (f ? { ...f, ...patch } : f));
  const dirty = form !== null && stored !== null && JSON.stringify(form) !== JSON.stringify(stored);
  const errs = form ? problems(form) : null;
  const wasPublished = stored?.shelf === "published";
  const publishing = form?.shelf === "published" && !wasPublished;

  async function onSave() {
    if (!form || !errs) return;
    setTried(true);
    const first = Object.values(errs).find((e) => e !== null);
    if (first) {
      save.fail(first);
      return;
    }
    const values: Partial<ProductRow> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description.trim() || null,
      price_cents: form.cents as number,
      currency: "eur",
      thumbnail: form.image?.url ?? null,
      thumbnail_alt: form.image?.alt.trim() ?? null,
      file_path: form.filePath,
      active: form.shelf === "published",
    };
    const oldPath = stored?.filePath ?? "";
    await save.run(async () => {
      const r = isNew ? await insertRow("products", values) : await updateRow("products", id as string, values);
      if (r.error !== null) return { error: r.error };
      /* The file this product used to sell is no longer reachable through
         it, so it is tidied away. Best effort: a leftover object costs
         nothing a buyer can see. */
      if (oldPath && oldPath !== r.data.file_path) void removeFile(FILE_BUCKET, oldPath);
      const f = fromRow(r.data);
      setForm(f);
      setStored(f);
      if (isNew) navigate(`/admin/shop/${r.data.id}`, { replace: true });
      if (publishing) return "Published";
      if (wasPublished && !values.active) return "Hidden from the shop";
      return "Saved";
    });
  }

  async function onDelete() {
    if (!id || !form) return;
    setDeleting(true);
    const orders = await countRows("orders", { product_id: id });
    if (orders == null) {
      setDeleting(false);
      toast("Could not check this product's orders. Try again in a moment.", "error");
      return;
    }
    if (orders > 0) {
      setDeleting(false);
      toast(
        `This product has ${orders} ${orders === 1 ? "order" : "orders"} against it, so it cannot be deleted. Hide it from the shop instead.`,
        "error",
      );
      return;
    }
    const ok = await confirm({
      title: `Delete ${form.title || "this product"}?`,
      body: "It comes off the shop for good, and the file behind it is removed. This cannot be undone.",
      confirmLabel: "Delete product",
    });
    if (!ok) {
      setDeleting(false);
      return;
    }
    const r = await deleteRow("products", id);
    setDeleting(false);
    if (r.error !== null) {
      toast(r.error, "error");
      return;
    }
    if (stored?.filePath) void removeFile(FILE_BUCKET, stored.filePath);
    const cover = stored?.image?.url ? pathFromPublicUrl(stored.image.url) : null;
    if (cover) void removeFile(IMAGE_BUCKET, cover);
    toast("Deleted");
    navigate("/admin/shop");
  }

  const header = (
    <PageHeader
      back={{ to: "/admin/shop", label: "Back to the shop" }}
      title={isNew ? "Add a product" : stored?.title || "Edit product"}
      intro={
        isNew
          ? "Four short steps. Nothing goes on the shop until the last one."
          : wasPublished
            ? "On the shop now. Changes show on the site as soon as they are saved."
            : "Hidden from the shop. Buyers cannot see it until it is published."
      }
      actions={
        wasPublished && stored ? (
          <a href={`/shop/${stored.slug}`} target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
            View on the site
          </a>
        ) : undefined
      }
    />
  );

  if (loadError) {
    return (
      <>
        {header}
        <Notice tone="error">{loadError}</Notice>
      </>
    );
  }
  if (!form || !errs) {
    return (
      <>
        {header}
        <p className="adm-muted" role="status">
          Loading...
        </p>
      </>
    );
  }

  const fields = {
    what: (
      <>
        <TextInput
          label="Title"
          value={form.title}
          onChange={(v) => set({ title: v })}
          error={tried ? errs.title : null}
          hint='For example "The Feather: episode pack".'
          autoComplete="off"
        />
        <SlugField
          value={form.slug}
          onChange={(v) => set({ slug: v })}
          source={form.title}
          prefix="/shop/"
          error={tried ? errs.slug : null}
        />
        <TextArea
          label="What is in it"
          value={form.description}
          onChange={(v) => set({ description: v })}
          rows={5}
          optional
          hint="List exactly what the buyer gets. Leave a blank line between paragraphs."
        />
      </>
    ),
    price: <PriceField cents={form.cents} onChange={(v) => set({ cents: v })} error={tried ? errs.price : null} />,
    files: (
      <>
        <ImageUpload
          label="Cover picture"
          value={form.image}
          onChange={(v) => set({ image: v })}
          folder="products"
          hint="The artwork shown on the shelf and on the product's page. JPG, PNG, WebP or AVIF, up to 10 MB."
        />
        <FileUpload
          path={form.filePath}
          stem={form.slug || "product"}
          onChange={(v) => set({ filePath: v.path })}
          error={tried ? errs.file : null}
        />
      </>
    ),
    shelf: (
      <>
        <Segmented<Shelf>
          label="Shown to buyers"
          value={form.shelf}
          onChange={(v) => set({ shelf: v })}
          options={[
            { value: "published", label: "Published" },
            { value: "hidden", label: "Hidden" },
          ]}
        />
        <p className="adm-muted">
          Published products appear on the shop with their price. A hidden product is kept here, and
          anyone who already bought it can still use their download link.
        </p>
      </>
    ),
  };

  if (isNew) {
    const price = form.cents == null ? null : euro(form.cents);
    return (
      <>
        {header}
        <Wizard
          status={save.status}
          onShowErrors={setTried}
          onFinish={() => void onSave()}
          finishLabel={form.shelf === "published" ? "Publish product" : "Save, hidden"}
          finishingLabel={form.shelf === "published" ? "Publishing" : "Saving"}
          steps={[
            { title: "What it is", answer: form.title, error: errs.title ?? errs.slug, body: fields.what },
            { title: "Price", answer: price, error: errs.price, body: fields.price },
            {
              title: "Cover and file",
              answer: [form.image && "Cover", form.filePath && "file"].filter(Boolean).join(" and ") || "Nothing yet",
              error: errs.image,
              body: fields.files,
            },
            {
              title: "Check and publish",
              error: errs.file,
              body: (
                <>
                  <dl className="adm-review">
                    <dt>Title</dt>
                    <dd>{form.title}</dd>
                    <dt>Web address</dt>
                    <dd>/shop/{form.slug}</dd>
                    <dt>Price</dt>
                    <dd>{price}</dd>
                    <dt>Cover</dt>
                    <dd>{form.image ? form.image.alt || "Uploaded" : "None yet"}</dd>
                    <dt>File</dt>
                    <dd>{form.filePath ? form.filePath.split("/").pop() : "None yet, so it can only be saved hidden"}</dd>
                  </dl>
                  {fields.shelf}
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
      {header}
      <form
        className="adm-stack"
        onSubmit={(e) => {
          e.preventDefault();
          void onSave();
        }}
      >
        <section className="adm-card adm-stack">
          <h2 className="adm-h2">The product</h2>
          {fields.what}
          {fields.price}
        </section>

        <section className="adm-card adm-stack">
          <h2 className="adm-h2">Cover and file</h2>
          {fields.files}
        </section>

        <section className="adm-card adm-stack">
          <h2 className="adm-h2">On the shop</h2>
          {fields.shelf}
        </section>

        <SaveBar
          status={save.status}
          dirty={dirty}
          onSave={() => void onSave()}
          saveLabel={publishing ? "Publish" : "Save"}
          savingLabel={publishing ? "Publishing" : "Saving"}
        >
          <AdminButton variant="danger" onClick={() => void onDelete()} busy={deleting} busyLabel="Checking">
            Delete
          </AdminButton>
        </SaveBar>
      </form>
    </>
  );
}

const euro = (cents: number) => `€${(cents / 100).toFixed(2)}`;
