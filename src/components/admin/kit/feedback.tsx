import { useState, createContext, useCallback, useRef, useContext, type ReactNode, useEffect } from "react";
import { AdminButton } from "./basics";

/* Saying what happened, in words: the toast ("Saved", "Published"), the save
   bar, and the confirm dialog every destructive action goes through. */

/* ─── Toast ──────────────────────────────────────────────────────────────── */

interface Toast {
  text: string;
  id: number;
  tone: "error" | "ok";
}

const ToastCtx = createContext<(text: string, tone?: "error" | "ok") => void>(() => {});

/** Mounted once by the admin shell. Panels never mount it. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const show = useCallback((text: string, tone: "error" | "ok" = "ok") => {
    const id = next.current++;
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 7000 : 3500);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast ${t.tone === "error" ? "adm-toast--error" : ""}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/**
 * `const toast = useToast(); toast("Published");  toast("Could not delete.", "error");`
 * Short past-tense words for success. Errors are a full sentence.
 */
export function useToast() {
  return useContext(ToastCtx);
}

/* ─── Save state ─────────────────────────────────────────────────────────── */

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { message?: string; kind: "saved" }
  | { message: string; kind: "error" };

/**
 * Pairs with SaveBar. Wraps a save so the bar says "Saving", then "Saved"
 * (or your message), or the error in red.
 *
 *   const save = useSaveState();
 *   await save.run(async () => { const r = await updateRow(...); return r.error ?? "Saved"; });
 *
 * The function returns null or a success message on success, or throws /
 * returns `{ error }` on failure. Simplest: return `r.error ? { error: r.error } : "Saved"`.
 */
export function useSaveState() {
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const toast = useToast();
  const run = useCallback(
    async (fn: () => Promise<string | null | { error: string }>) => {
      setStatus({ kind: "saving" });
      try {
        const r = await fn();
        if (r && typeof r === "object" && "error" in r) {
          setStatus({ kind: "error", message: r.error });
          return false;
        }
        const message = typeof r === "string" ? r : "Saved";
        setStatus({ kind: "saved", message });
        toast(message);
        return true;
      } catch (err) {
        console.error(err);
        setStatus({ kind: "error", message: "Something went wrong and nothing was saved. Try again in a moment." });
        return false;
      }
    },
    [toast],
  );
  const reset = useCallback(() => setStatus({ kind: "idle" }), []);
  /** Mark an error the editor must fix before saving (e.g. a missing title). */
  const fail = useCallback((message: string) => setStatus({ kind: "error", message }), []);
  return { status, run, reset, fail, saving: status.kind === "saving" };
}

/**
 * Pinned to the bottom of the screen on every edit view. Says in words what
 * state the form is in. `dirty` makes it read "Unsaved changes".
 */
export function SaveBar({
  status,
  dirty,
  onSave,
  saveLabel = "Save",
  savingLabel = "Saving",
  disabled,
  children,
}: {
  status: SaveStatus;
  dirty?: boolean;
  onSave: () => void;
  saveLabel?: string;
  savingLabel?: string;
  disabled?: boolean;
  /** Extra buttons, e.g. Publish or Delete, placed before Save. */
  children?: ReactNode;
}) {
  let tone: "idle" | "error" | "ok" = "idle";
  let text = dirty ? "Unsaved changes" : "No changes yet";
  if (status.kind === "saving") text = `${savingLabel}...`;
  if (status.kind === "saved" && !dirty) {
    tone = "ok";
    text = status.message ?? "Saved";
  }
  if (status.kind === "error") {
    tone = "error";
    text = status.message;
  }
  return (
    <div className="adm-savebar">
      <p className="adm-savebar__status" data-tone={tone} role={tone === "error" ? "alert" : "status"} aria-live="polite">
        {text}
      </p>
      <div className="adm-savebar__actions">
        {children}
        <AdminButton onClick={onSave} busy={status.kind === "saving"} busyLabel={savingLabel} disabled={disabled}>
          {saveLabel}
        </AdminButton>
      </div>
    </div>
  );
}

/* ─── Confirm ────────────────────────────────────────────────────────────── */

export interface ConfirmOptions {
  title: string;
  body?: ReactNode;
  /** The verb on the button: "Delete product", "Unpublish". Never "OK". */
  confirmLabel: string;
  cancelLabel?: string;
  /** Red button. Default true: confirmations are for things that cannot be undone. */
  destructive?: boolean;
}

/** A native <dialog>: focus is trapped and Escape cancels, for free. */
export function ConfirmDialog({ open, onConfirm, onCancel, title, body, confirmLabel, cancelLabel = "Cancel", destructive = true }: ConfirmOptions & { onCancel: () => void; onConfirm: () => void; open: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="adm-dialog" onCancel={(e) => { e.preventDefault(); onCancel(); }} aria-labelledby="adm-confirm-title">
      <h2 id="adm-confirm-title">{title}</h2>
      {body && <p>{body}</p>}
      <div className="adm-dialog__actions">
        <AdminButton variant="quiet" onClick={onCancel} autoFocus>
          {cancelLabel}
        </AdminButton>
        <AdminButton variant={destructive ? "danger-solid" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </AdminButton>
      </div>
    </dialog>
  );
}

const ConfirmCtx = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

/** Mounted once by the admin shell. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const ask = useCallback((o: ConfirmOptions) => {
    setOpts(o);
    return new Promise<boolean>((res) => {
      resolver.current = res;
    });
  }, []);
  const done = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setOpts(null);
  };
  return (
    <ConfirmCtx.Provider value={ask}>
      {children}
      <ConfirmDialog
        open={Boolean(opts)}
        title={opts?.title ?? ""}
        body={opts?.body}
        confirmLabel={opts?.confirmLabel ?? "Confirm"}
        cancelLabel={opts?.cancelLabel}
        destructive={opts?.destructive ?? true}
        onConfirm={() => done(true)}
        onCancel={() => done(false)}
      />
    </ConfirmCtx.Provider>
  );
}

/**
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: "Delete this product?", body: "...", confirmLabel: "Delete product" }))) return;
 */
export function useConfirm() {
  return useContext(ConfirmCtx);
}
