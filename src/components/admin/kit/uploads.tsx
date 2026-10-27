import { useRef, useState, useId } from "react";
import {
  IMAGE_RULES,
  validateProductFile,
  formatBytes,
  validateImage,
  uploadImage,
  uploadProductFile,
  FILE_RULES,
} from "@/lib/admin";
import { AdminButton } from "./basics";

/* Uploads. Images go to the PUBLIC bucket and come back as a URL; product
   files go to the PRIVATE bucket and come back as a storage path only. Both
   validate type and size before a byte is sent, and Storage enforces the same
   rules again (migration 0008). */

export interface ImageValue {
  url: string;
  alt: string;
}

/**
 * Pick, preview and upload one image, with its alt text.
 *
 * The upload happens as soon as a file is chosen (so the preview is the real
 * stored image); `onChange` then receives `{ url, alt }`. The row is not
 * saved until the panel saves it. Alt text is required by the brief: use
 * `imageError(value)` before saving, and the field shows the same message.
 *
 * `folder` is the storage folder in public-media: "products", "people",
 * "posts", "media", or "pages/<page>".
 */
export function ImageUpload({
  label,
  value,
  onChange,
  folder,
  hint,
  required,
  error,
  defaultPreview,
}: {
  label: string;
  value: ImageValue | null;
  onChange: (v: ImageValue | null) => void;
  folder: string;
  hint?: string;
  /** An image must be present. Alt text is always required once there is one. */
  required?: boolean;
  error?: string | null;
  /** What shows when there is no upload, e.g. the bundled photo, labelled "Original". */
  defaultPreview?: { src: string; alt: string };
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) return setProblem(invalid);
    setProblem(null);
    setBusy(true);
    const r = await uploadImage(file, folder);
    setBusy(false);
    if (input.current) input.current.value = "";
    if (r.error !== null) return setProblem(r.error);
    onChange({ url: r.data.url, alt: value?.alt ?? "" });
  }

  const shownError = problem ?? error ?? (value ? imageError(value, required) : null);
  const preview = value?.url ? { src: value.url, alt: value.alt } : defaultPreview;

  return (
    <div className="adm-field">
      <p className="field-label" id={`${id}-l`}>{label}</p>
      <div className="adm-upload" aria-labelledby={`${id}-l`} role="group">
        <div className="adm-upload__row">
          {preview ? (
            <img className="adm-upload__preview" src={preview.src} alt={preview.alt || ""} />
          ) : (
            <span className="adm-upload__preview" aria-hidden="true" />
          )}
          <div className="adm-upload__meta">
            <strong>{value?.url ? "Uploaded image" : defaultPreview ? "Original image" : "No image yet"}</strong>
            <span className="adm-muted">{hint ?? IMAGE_RULES.label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="quiet" size="sm" onClick={() => input.current?.click()} busy={busy} busyLabel="Uploading">
              {value?.url ? "Replace image" : "Choose image"}
            </AdminButton>
            {value?.url && !required && (
              <AdminButton variant="quiet" size="sm" onClick={() => onChange(null)}>
                Remove
              </AdminButton>
            )}
          </div>
          <input ref={input} type="file" accept={IMAGE_RULES.accept} className="adm-sr" tabIndex={-1} aria-hidden="true" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {value?.url && (
          <div className="adm-field mt-3">
            <label className="field-label" htmlFor={`${id}-alt`}>
              Describe the image
            </label>
            <input
              id={`${id}-alt`}
              className={`field-input ${value && !value.alt.trim() ? "is-error" : ""}`}
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              aria-describedby={`${id}-alt-hint`}
            />
            <p id={`${id}-alt-hint`} className="adm-hint">
              One sentence for people who cannot see it, for example "Conor Sexton in the garden".
            </p>
          </div>
        )}
      </div>
      {shownError && <p className="adm-error" role="alert">{shownError}</p>}
    </div>
  );
}

/** Null when the image value can be saved. */
export function imageError(v: ImageValue | null, required?: boolean): string | null {
  if (!v || !v.url) return required ? "An image is required." : null;
  if (!v.alt.trim()) return "Describe the image before saving. It is read aloud to people who cannot see it.";
  return null;
}

/**
 * Upload the file a product sells, to the PRIVATE product-files bucket, with a
 * progress bar. `onChange` receives the storage path (store it in
 * products.file_path) and the file's name and size for display.
 *
 * `stem` names the stored file (use the product slug).
 */
export function FileUpload({
  label = "The file buyers download",
  path,
  onChange,
  stem,
  error,
}: {
  label?: string;
  /** Current products.file_path, or "" for none. */
  path: string;
  onChange: (v: { name: string; path: string; size: number }) => void;
  stem: string;
  error?: string | null;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ size: number; name: string } | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    const invalid = validateProductFile(file);
    if (invalid) return setProblem(invalid);
    setProblem(null);
    setProgress(0);
    const r = await uploadProductFile(file, stem || "product", setProgress);
    if (input.current) input.current.value = "";
    setProgress(null);
    if (r.error !== null) return setProblem(r.error);
    setPicked({ name: file.name, size: file.size });
    onChange({ path: r.data.path, name: file.name, size: file.size });
  }

  const pct = progress == null ? null : Math.round(progress * 100);

  return (
    <div className="adm-field">
      <p className="field-label" id={`${id}-l`}>{label}</p>
      <div className="adm-upload" role="group" aria-labelledby={`${id}-l`}>
        <div className="adm-upload__row">
          <div className="adm-upload__meta">
            <strong>{picked ? picked.name : path ? path : "No file yet"}</strong>
            <span className="adm-muted">
              {picked ? `${formatBytes(picked.size)}, uploaded. Private: only buyers get a link.` : path ? "Stored privately. Only buyers get a link." : FILE_RULES.label}
            </span>
          </div>
          <AdminButton variant="quiet" size="sm" onClick={() => input.current?.click()} busy={pct != null} busyLabel={`Uploading ${pct ?? 0}%`}>
            {path ? "Replace file" : "Choose file"}
          </AdminButton>
          <input ref={input} type="file" accept={FILE_RULES.accept} className="adm-sr" tabIndex={-1} aria-hidden="true" onChange={(e) => pick(e.target.files?.[0])} />
        </div>
        {pct != null && (
          <div className="adm-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Upload progress">
            <span style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {(problem ?? error) && <p className="adm-error" role="alert">{problem ?? error}</p>}
    </div>
  );
}
