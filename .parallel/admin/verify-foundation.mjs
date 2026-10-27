// Checks the foundation's security rules against the LOCAL stack.
//   node .parallel/admin/verify-foundation.mjs
// Exit 0 = every check passed. Leaves no rows or files behind.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("./local.env", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const URL_ = env.VITE_SUPABASE_URL;
if (!/127\.0\.0\.1|localhost/.test(URL_)) throw new Error("Refusing: not a local Supabase URL");

const opts = { auth: { persistSession: false } };
const anon = createClient(URL_, env.VITE_SUPABASE_ANON_KEY, opts);
const admin = createClient(URL_, env.VITE_SUPABASE_ANON_KEY, opts);
const service = createClient(URL_, env.LOCAL_SERVICE_ROLE_KEY, opts);

let failed = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failed++;
};

const { error: signErr } = await admin.auth.signInWithPassword({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD });
check("admin signs in", !signErr, signErr?.message);
const { data: isAdmin } = await admin.rpc("is_admin");
check("is_admin() true for the admin", isAdmin === true);
const { data: anonAdmin } = await anon.rpc("is_admin");
check("is_admin() false for anon", anonAdmin === false);

// A signed-in account that is NOT on the allowlist.
const strangerEmail = `stranger-${Date.now()}@cle-local.test`;
const { data: su } = await service.auth.admin.createUser({ email: strangerEmail, password: "stranger-pass-123", email_confirm: true });
const stranger = createClient(URL_, env.VITE_SUPABASE_ANON_KEY, opts);
await stranger.auth.signInWithPassword({ email: strangerEmail, password: "stranger-pass-123" });

const png = Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082", "hex");
const zip = Buffer.from("504b0506000000000000000000000000000000000000", "hex");

// public-media
const imgPath = `verify/check-${Date.now()}.png`;
const up1 = await admin.storage.from("public-media").upload(imgPath, png, { contentType: "image/png" });
check("admin uploads an image to public-media", !up1.error, up1.error?.message);
const svg = await admin.storage.from("public-media").upload(`verify/x-${Date.now()}.svg`, Buffer.from("<svg/>"), { contentType: "image/svg+xml" });
check("public-media refuses SVG", Boolean(svg.error), svg.error?.message);
const anonUp = await anon.storage.from("public-media").upload(`verify/anon-${Date.now()}.png`, png, { contentType: "image/png" });
check("anon cannot upload to public-media", Boolean(anonUp.error));
const strangerUp = await stranger.storage.from("public-media").upload(`verify/s-${Date.now()}.png`, png, { contentType: "image/png" });
check("non-admin account cannot upload to public-media", Boolean(strangerUp.error));
const pub = await fetch(`${URL_}/storage/v1/object/public/public-media/${imgPath}`);
check("public-media file is publicly readable", pub.ok, String(pub.status));

// product-files
const filePath = `verify-${Date.now()}.zip`;
const up2 = await admin.storage.from("product-files").upload(filePath, zip, { contentType: "application/zip" });
check("admin uploads a zip to product-files", !up2.error, up2.error?.message);
const exe = await admin.storage.from("product-files").upload(`v-${Date.now()}.exe`, zip, { contentType: "application/octet-stream" });
check("product-files refuses other types", Boolean(exe.error), exe.error?.message);
const anonDl = await anon.storage.from("product-files").download(filePath);
check("anon cannot read product-files", Boolean(anonDl.error));
const strangerDl = await stranger.storage.from("product-files").download(filePath);
check("non-admin account cannot read product-files", Boolean(strangerDl.error));
const pubDl = await fetch(`${URL_}/storage/v1/object/public/product-files/${filePath}`);
check("product-files has no public URL", !pubDl.ok, String(pubDl.status));
const signedAnon = await anon.storage.from("product-files").createSignedUrl(filePath, 60);
check("anon cannot mint a signed URL", Boolean(signedAnon.error));
const rm2 = await admin.storage.from("product-files").remove([filePath]);
check("admin removes a product file", !rm2.error && rm2.data?.length === 1, rm2.error?.message ?? `removed ${rm2.data?.length}`);
const rm1 = await admin.storage.from("public-media").remove([imgPath]);
check("admin removes an image", !rm1.error && rm1.data?.length === 1);

// tables
const blk = await admin.from("content_blocks").upsert({ page: "verify", section_key: "x", type: "text", value: { text: "hi" } }, { onConflict: "page,section_key" }).select().single();
check("admin writes content_blocks", !blk.error, blk.error?.message);
const strangerBlk = await stranger.from("content_blocks").upsert({ page: "verify", section_key: "y", type: "text", value: { text: "no" } });
check("non-admin cannot write content_blocks", Boolean(strangerBlk.error));
await admin.from("content_blocks").delete().eq("page", "verify");

const set = await admin.from("settings").select("value").eq("key", "app").single();
check("settings app has store link keys", set.data && "app_store_url" in set.data.value, JSON.stringify(set.data?.value));

const strangerEnq = await stranger.from("enquiries").select("id");
check("non-admin reads no enquiries", !strangerEnq.error && strangerEnq.data.length === 0);
const anonOrders = await anon.from("orders").select("id");
check("anon reads no orders", (anonOrders.data ?? []).length === 0);

// reissue a download link
const { data: prod } = await service.from("products").insert({ title: "Verify", slug: `verify-${Date.now()}`, price_cents: 100, file_path: "x.zip", active: false }).select().single();
const { data: ord } = await service.from("orders").insert({ stripe_session_id: `cs_verify_${Date.now()}`, product_id: prod.id, download_token: `tok-${Date.now()}`, expires_at: new Date(Date.now() - 3600e3).toISOString(), download_count: 5 }).select().single();
const re = await admin.rpc("admin_reissue_download", { p_order: ord.id });
check("admin reissues a download link", !re.error && re.data?.[0]?.download_count === 0 && new Date(re.data[0].expires_at) > new Date(), re.error?.message);
const reS = await stranger.rpc("admin_reissue_download", { p_order: ord.id });
check("non-admin cannot reissue", Boolean(reS.error));
const reA = await anon.rpc("admin_reissue_download", { p_order: ord.id });
check("anon cannot reissue", Boolean(reA.error));
await service.from("orders").delete().eq("id", ord.id);
await service.from("products").delete().eq("id", prod.id);
if (su?.user) await service.auth.admin.deleteUser(su.user.id);

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
