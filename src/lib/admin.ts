import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type {
  MediaItem,
  Category,
  Enquiry,
  Order,
  LinksSetting,
  ContentBlock,
  Person,
  Post,
  AppSetting,
  Product,
  SettingsMap,
  EnquiryRoute,
} from "@/lib/types";

/* ============================================================================
   The admin console's data layer. ADMIN CHUNK ONLY.

   This module imports the Supabase client statically, so it must never be
   imported by a public page (that would put supabase-js in front of every
   visitor). Public pages read through @/lib/content.

   RLS IS THE GATE, NOT THIS FILE. Every call here runs as the signed-in user
   with the anon key; the database refuses anything that user may not do. The
   wrappers exist to give the panels one shape of result and plain English
   errors, not to enforce anything.
   ========================================================================== */

import { invalidateSettings, invalidateBlocks } from "@/lib/content";
export { invalidateBlocks, useSetting, invalidateSettings } from "@/lib/content";

/** Every result from this module. `error` is a sentence Conor can read. */
export type Result<T> = { error: null; data: T } | { error: string; data: null };

/* ─── Rows, as the console sees them ─────────────────────────────────────── */

export type ProductRow = Product & { created_at: string; thumbnail_alt: string | null; sort_order: number; updated_at: string };
export type PostRow = Post & { created_at: string; updated_at: string };
export type PersonRow = Person & { asset_key: string | null; photo_alt: string | null; phases: number[] };
export type MediaRow = MediaItem & { kind: NonNullable<MediaItem["kind"]>; thumbnail_alt: string | null };
export type { Order, LinksSetting, Category, EnquiryRoute, AppSetting, Enquiry, ContentBlock };

/** Table name to row type. Only tables the console writes or reads. */
export interface Tables {
  enquiries: Enquiry;
  categories: Category;
  content_blocks: ContentBlock;
  orders: Order;
  products: ProductRow;
  people: PersonRow;
  posts: PostRow;
  media_items: MediaRow;
}
export type TableName = keyof Tables;

/* ─── Errors ─────────────────────────────────────────────────────────────── */

/** Turns a Supabase / Postgres / network error into one plain sentence. */
export function explainError(err: unknown): string {
  const e = (err ?? {}) as { status?: number; code?: string; statusCode?: string | number; message?: string };
  const msg = String(e.message ?? "");
  const code = String(e.code ?? "");
  if (code === "23505" || /duplicate key/i.test(msg)) {
    return /slug/i.test(msg)
      ? "That web address is already used by another item. Change the address and try again."
      : "Something with those details already exists.";
  }
  if (code === "23503") return "This is still linked to something else, so it cannot be removed yet.";
  if (code === "23502") return "A required field is empty.";
  if (code === "23514") return "One of the values is not allowed. Check the fields and try again.";
  if (code === "42501" || /row-level security|permission denied|not allowed/i.test(msg)) {
    return "This account is not allowed to do that. Sign out and sign in with the admin account.";
  }
  if (code === "PGRST301" || /JWT|expired/i.test(msg)) return "Your sign-in has expired. Sign in again.";
  if (/mime type|invalid_mime_type/i.test(msg)) return "That type of file is not allowed here.";
  if (/exceeded the maximum allowed size|Payload too large|413/i.test(msg) || e.statusCode === "413") {
    return "That file is too large.";
  }
  if (/Failed to fetch|NetworkError|network/i.test(msg)) {
    return "Could not reach the server. Check your connection and try again.";
  }
  return "Something went wrong and nothing was saved. Try again in a moment.";
}

function sb() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

async function run<T>(fn: () => PromiseLike<{ error: unknown; data: unknown }>): Promise<Result<T>> {
  try {
    const { data, error } = await fn();
    if (error) {
      /* A refusal (duplicate address, RLS, bad id) is shown to the admin as a
         sentence; the console keeps the detail as a warning, not an error. */
      console.warn("admin call refused", error);
      return { data: null, error: explainError(error) };
    }
    return { data: data as T, error: null };
  } catch (err) {
    console.error("admin call threw", err);
    return { data: null, error: explainError(err) };
  }
}

/* ─── CRUD ───────────────────────────────────────────────────────────────── */

export interface ListOptions<T> {
  /** Column list, default "*". */
  columns?: string;
  /** Order by these columns, in turn. */
  order?: { column: keyof T & string; ascending?: boolean }[];
  /** Equality filters. */
  eq?: Partial<Record<keyof T & string, string | number | boolean>>;
  /** Case-insensitive contains, on one column. */
  ilike?: { value: string; column: keyof T & string };
  limit?: number;
}

export function listRows<K extends TableName>(table: K, opts: ListOptions<Tables[K]> = {}): Promise<Result<Tables[K][]>> {
  return run(() => {
    let q = sb().from(table).select(opts.columns ?? "*");
    for (const [col, val] of Object.entries(opts.eq ?? {})) q = q.eq(col, val as string);
    if (opts.ilike && opts.ilike.value.trim()) {
      const v = opts.ilike.value.trim().replace(/[%_]/g, (m) => `\\${m}`);
      q = q.ilike(opts.ilike.column, `%${v}%`);
    }
    for (const o of opts.order ?? []) q = q.order(o.column, { ascending: o.ascending ?? true });
    if (opts.limit) q = q.limit(opts.limit);
    return q;
  });
}

export function getRow<K extends TableName>(table: K, id: string): Promise<Result<Tables[K] | null>> {
  return run(() => sb().from(table).select("*").eq("id", id).maybeSingle());
}

export function insertRow<K extends TableName>(table: K, values: Partial<Tables[K]>): Promise<Result<Tables[K]>> {
  return run(() => sb().from(table).insert(values as never).select("*").single());
}

export function updateRow<K extends TableName>(table: K, id: string, values: Partial<Tables[K]>): Promise<Result<Tables[K]>> {
  return run(() => sb().from(table).update(values as never).eq("id", id).select("*").single());
}

export function deleteRow(table: TableName, id: string): Promise<Result<null>> {
  return run(() => sb().from(table).delete().eq("id", id));
}

/** Rows matching, without fetching them. Head-only, cheap. */
export async function countRows<K extends TableName>(
  table: K,
  eq: Partial<Record<keyof Tables[K] & string, string | number | boolean>> = {},
): Promise<number | null> {
  try {
    let q = sb().from(table).select("id", { count: "exact", head: true });
    for (const [col, val] of Object.entries(eq)) q = q.eq(col, val as string);
    const { count, error } = await q;
    return error ? null : (count ?? 0);
  } catch {
    return null;
  }
}

/**
 * Writes sort_order = 1..n in the order of `ids`. Used by the up and down
 * buttons on products, people and media items.
 */
export async function reorderRows(table: "products" | "categories" | "people" | "media_items", ids: string[]): Promise<Result<null>> {
  for (let i = 0; i < ids.length; i++) {
    const r = await run(() => sb().from(table).update({ sort_order: i + 1 } as never).eq("id", ids[i]));
    if (r.error !== null) return { data: null, error: r.error };
  }
  return { data: null, error: null };
}

/* ─── Content blocks ─────────────────────────────────────────────────────── */

/* The public pages are prerendered with the saved wording baked in, so a save
   asks for a rebuild (api/rebuild.ts). Several saves in a row (Save changes
   writes one block at a time) collapse into one build. Failure is silent on
   purpose: the pages already fetch the new wording in the browser, the
   rebuild only makes the first paint and search engines match it.
   ponytail: a tab closed inside the 2s window skips the rebuild; the next save
   catches it up. Move to a database trigger if that ever matters. */
let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
function requestRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(async () => {
    const { data } = await sb().auth.getSession();
    const token = data.session?.access_token;
    if (token) fetch("/api/rebuild", { method: "POST", headers: { authorization: `Bearer ${token}` }, keepalive: true }).catch(() => {});
  }, 2000);
}

/** Every stored block for one page (the overrides; absent keys use the page source). */
export function listBlocks(page: string): Promise<Result<ContentBlock[]>> {
  return run(() => sb().from("content_blocks").select("*").eq("page", page));
}

/** Store one block. Text blocks: `{ text }`. Image blocks: `{ url, alt }`. */
export async function saveBlock(
  page: string,
  key: string,
  type: "text" | "image",
  value: { text: string } | { url: string; alt: string },
): Promise<Result<ContentBlock>> {
  const r = await run<ContentBlock>(() =>
    sb()
      .from("content_blocks")
      .upsert(
        { page, section_key: key, type, value, updated_at: new Date().toISOString() } as never,
        { onConflict: "page,section_key" },
      )
      .select("*")
      .single(),
  );
  if (r.error === null) {
    invalidateBlocks(page);
    requestRebuild();
  }
  return r;
}

/** Delete the override, so the page's original wording shows again. */
export async function resetBlock(page: string, key: string): Promise<Result<null>> {
  const r = await run<null>(() => sb().from("content_blocks").delete().eq("page", page).eq("section_key", key));
  if (r.error === null) {
    invalidateBlocks(page);
    requestRebuild();
  }
  return r;
}

/* ─── Settings ───────────────────────────────────────────────────────────── */

export async function getSetting<K extends keyof SettingsMap>(key: K): Promise<Result<Partial<SettingsMap[K]> | null>> {
  const r = await run<{ value: Partial<SettingsMap[K]> } | null>(() =>
    sb().from("settings").select("value").eq("key", key).maybeSingle(),
  );
  return r.error ? r : { data: r.data?.value ?? null, error: null };
}

/** Replaces the whole value of one settings row. Read it, change it, save it. */
export async function saveSetting<K extends keyof SettingsMap>(key: K, value: SettingsMap[K]): Promise<Result<null>> {
  const r = await run<null>(() => sb().from("settings").upsert({ key, value } as never, { onConflict: "key" }));
  if (r.error === null) {
    invalidateSettings();
    requestRebuild();
  }
  return r;
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */

/** The buyer's download page, for a token. Relative to the site root. */
export function downloadPath(token: string): string {
  return `/download/${encodeURIComponent(token)}`;
}

/**
 * Gives a lost order a fresh 24 hours and five downloads on the same link.
 * Runs `admin_reissue_download` (migration 0008), which checks is_admin()
 * itself. Returns the link to hand the buyer.
 */
export async function reissueDownload(orderId: string): Promise<Result<{ path: string; token: string; expiresAt: string }>> {
  const r = await run<{ download_token: string; expires_at: string }[]>(() =>
    sb().rpc("admin_reissue_download", { p_order: orderId }),
  );
  if (r.error !== null) return r;
  const row = r.data?.[0];
  if (!row) return { data: null, error: "That order could not be found." };
  return { data: { token: row.download_token, expiresAt: row.expires_at, path: downloadPath(row.download_token) }, error: null };
}

/* ─── Storage ────────────────────────────────────────────────────────────── */

export const IMAGE_BUCKET = "public-media";
export const FILE_BUCKET = "product-files";

/** Mirrors migration 0008's bucket rules, so the UI can refuse first, kindly. */
export const IMAGE_RULES = {
  types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>,
  maxBytes: 10 * 1024 * 1024,
  accept: "image/jpeg,image/png,image/webp,image/avif",
  label: "JPG, PNG, WebP or AVIF, up to 10 MB",
};
export const FILE_RULES = {
  types: { "application/zip": "zip", "application/pdf": "pdf" } as Record<string, string>,
  maxBytes: 50 * 1024 * 1024,
  accept: ".zip,.pdf,application/zip,application/pdf",
  label: "ZIP or PDF, up to 50 MB",
};

export function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** The file's real type from its extension when the browser gives none or a
 *  vague one (Windows reports zips as application/x-zip-compressed, iOS often
 *  reports nothing). Returns the canonical type or null. */
function canonicalType(file: File, rules: { types: Record<string, string> }): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const byExt = Object.entries(rules.types).find(([, e]) => e === ext || (e === "jpg" && ext === "jpeg"))?.[0];
  if (file.type && rules.types[file.type]) return file.type;
  if (file.type === "application/x-zip-compressed" && ext === "zip") return "application/zip";
  return byExt ?? null;
}

/** Null when the image is acceptable, otherwise the reason in a sentence. */
export function validateImage(file: File): string | null {
  if (!canonicalType(file, IMAGE_RULES)) return "That is not an image this site can use. Choose a JPG, PNG, WebP or AVIF file.";
  if (file.size > IMAGE_RULES.maxBytes) return `That image is ${formatBytes(file.size)}. The limit is 10 MB.`;
  return null;
}

/** Null when the product file is acceptable, otherwise the reason. */
export function validateProductFile(file: File): string | null {
  if (!canonicalType(file, FILE_RULES)) return "Products must be a ZIP or a PDF file.";
  if (file.size > FILE_RULES.maxBytes) return `That file is ${formatBytes(file.size)}. The limit is 50 MB.`;
  return null;
}

/** A storage-safe file name: lower case, hyphens, the right extension, and a
 *  short random suffix so a replacement never collides with a cached copy. */
function storageName(file: File, rules: { types: Record<string, string> }, stem?: string): string {
  const type = canonicalType(file, rules) ?? "";
  const ext = rules.types[type] ?? "bin";
  const base = slugify(stem || file.name.replace(/\.[^.]+$/, "")) || "file";
  return `${base}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

/** Public URL for a path in public-media. */
export function publicUrl(path: string): string {
  return sb().storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Uploads an image to public-media under `folder` (e.g. "products",
 * "people", "posts", "pages/home"). Validates first. Returns the storage
 * path and the public URL; store the URL on the row.
 */
export async function uploadImage(file: File, folder: string): Promise<Result<{ path: string; url: string }>> {
  const invalid = validateImage(file);
  if (invalid) return { data: null, error: invalid };
  const path = `${folder.replace(/^\/+|\/+$/g, "")}/${storageName(file, IMAGE_RULES)}`;
  const contentType = canonicalType(file, IMAGE_RULES)!;
  const r = await run(() => sb().storage.from(IMAGE_BUCKET).upload(path, file, { contentType, upsert: false, cacheControl: "31536000" }));
  if (r.error !== null) return { data: null, error: r.error };
  return { data: { path, url: publicUrl(path) }, error: null };
}

/**
 * Uploads a sellable file to the PRIVATE product-files bucket, reporting
 * progress (0 to 1). Returns the storage path to store in products.file_path.
 * The file is never given a public URL; buyers reach it only through
 * api/download.ts, which signs a short-lived link.
 *
 * XMLHttpRequest rather than supabase-js, because fetch cannot report upload
 * progress and a 20 MB zip on a phone needs a bar.
 */
export async function uploadProductFile(
  file: File,
  stem: string,
  onProgress?: (fraction: number) => void,
): Promise<Result<{ path: string }>> {
  const invalid = validateProductFile(file);
  if (invalid) return { data: null, error: invalid };
  const client = sb();
  const { data: s } = await client.auth.getSession();
  const token = s.session?.access_token;
  if (!token) return { data: null, error: "Your sign-in has expired. Sign in again." };
  const path = storageName(file, FILE_RULES, stem);
  const contentType = canonicalType(file, FILE_RULES)!;
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${base}/storage/v1/object/${FILE_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", anon);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1);
        resolve({ data: { path }, error: null });
      } else {
        let body: { message?: string; statusCode?: string; error?: string } = {};
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          /* not JSON */
        }
        console.error("product file upload failed", xhr.status, body);
        resolve({ data: null, error: explainError({ message: `${body.error ?? ""} ${body.message ?? ""}`, statusCode: body.statusCode ?? String(xhr.status) }) });
      }
    };
    xhr.onerror = () => resolve({ data: null, error: explainError({ message: "Failed to fetch" }) });
    xhr.send(file);
  });
}

/** Removes a stored file. Used when an upload is replaced or a row deleted. */
export function removeFile(bucket: typeof IMAGE_BUCKET | typeof FILE_BUCKET, path: string): Promise<Result<unknown>> {
  return run(() => sb().storage.from(bucket).remove([path]));
}

/** The storage path inside public-media for a public URL we issued, or null. */
export function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

/* ─── Formatting ─────────────────────────────────────────────────────────── */

/** "The Feather: episode pack" to "the-feather-episode-pack". Strips accents. */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** 499 to "€4.99". */
export function formatEuro(cents: number | null | undefined): string {
  if (cents == null) return "";
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

/** "4.99", "4,99", "€4.99", "5" to cents. Null when it is not a price. */
export function parseEuro(input: string): number | null {
  const s = input.replace(/[€\s]/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const cents = Math.round(parseFloat(s) * 100);
  return cents > 0 ? cents : null;
}

/** "27 October 2026, 21:04", Irish time, for timestamps in tables. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Dublin",
  });
}

/** "27 October 2026". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Dublin" });
}

/* ─── Loading hook ───────────────────────────────────────────────────────── */

export interface Loaded<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  /** Fetch again, e.g. after a save or delete. */
  reload: () => void;
}

/**
 * Runs a Result-returning loader on mount and whenever `deps` change.
 *
 *   const products = useLoad(() => listRows("products", { order: [{ column: "sort_order" }] }), []);
 */
export function useLoad<T>(loader: () => Promise<Result<T>>, deps: unknown[]): Loaded<T> {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({
    data: null,
    error: null,
    loading: true,
  });
  const [tick, setTick] = useState(0);
  const fn = useRef(loader);
  fn.current = loader;

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true }));
    fn.current().then((r) => {
      if (!live) return;
      setState({ data: r.data, error: r.error, loading: false });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
