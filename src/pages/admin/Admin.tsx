import { useState, Suspense, useEffect, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Routes, NavLink, Route, Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { PANELS, type PanelCount } from "@/components/admin/registry";
import { AdminButton, ToastProvider, Notice, ConfirmProvider } from "@/components/admin/kit";
import "@/components/admin/kit/admin.css";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";

/* ============================================================================
   The admin console frame: sign in, check the account is on the admins
   allowlist, then the section nav and one panel at a time.

   THE ALLOWLIST CHECK IS FOR THE MESSAGE, NOT THE LOCK. Row level security
   (migration 0005, is_admin()) refuses every write and every private read for
   an account that is not on the list, whatever this screen shows. Asking
   is_admin() up front only means such an account is told so in words instead
   of meeting a console where nothing saves.
   ========================================================================== */

type AuthState =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "not-admin"; email: string }
  | { kind: "admin"; email: string };

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  /* "Forgot your password?" sends Supabase's reset email, whose link lands
     back on /admin where SetPassword takes over. The reply never says whether
     the address has an account. */
  async function onForgot() {
    if (!supabase || !email.trim()) {
      setError("Enter your email address first, then choose Forgot your password.");
      return;
    }
    setBusy(true);
    setError(null);
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    setBusy(false);
    setSent(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(
        /fetch|network/i.test(error.message)
          ? "Could not reach the server. Check your connection and try again."
          : "That email and password did not match. Try again.",
      );
    }
    setBusy(false);
  }

  return (
    <main className="adm-main adm-narrow" style={{ paddingTop: "12vh" }}>
      <p className="adm-label">CL&Eacute; Family Media</p>
      <h1 className="mt-1 font-display text-[32px] leading-[1.1] text-ink">Sign in</h1>

      {!isSupabaseConfigured && (
        <div className="mt-6">
          <Notice tone="error">
            Sign-in is not set up in this copy of the site yet. It needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </Notice>
        </div>
      )}

      <form onSubmit={onSubmit} className="adm-card mt-6" noValidate>
        <div className="adm-field">
          <label htmlFor="admin-email" className="field-label">Email</label>
          <input id="admin-email" type="email" required autoComplete="username" inputMode="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </div>
        <div className="adm-field">
          <label htmlFor="admin-password" className="field-label">Password</label>
          <input id="admin-password" type="password" required autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="field-input" />
        </div>
        {error && <p role="alert" className="adm-error">{error}</p>}
        {sent && (
          <p role="status" className="adm-muted mt-4">
            If that address has an account, an email with a link to set a new password is on its way.
          </p>
        )}
        <AdminButton type="submit" className="mt-5 w-full" busy={busy} busyLabel="Signing in" disabled={!isSupabaseConfigured || !email || !password}>
          Sign in
        </AdminButton>
        <button type="button" onClick={onForgot} className="adm-linkbtn mt-4 min-h-[44px]" disabled={busy || !isSupabaseConfigured}>
          Forgot your password?
        </button>
      </form>
    </main>
  );
}

function NotAdmin({ email }: { email: string }) {
  return (
    <main className="adm-main adm-narrow" style={{ paddingTop: "12vh" }}>
      <h1 className="font-display text-[28px] leading-[1.1] text-ink">This account cannot edit the site</h1>
      <p className="mt-3 text-[16px] text-body">
        You are signed in as <strong>{email}</strong>, which is not on the list of people who can edit the site.
        Sign out and sign in with the admin account, or ask MTMN Digital to add this one.
      </p>
      <AdminButton className="mt-6" variant="quiet" onClick={() => supabase?.auth.signOut()}>Sign out</AdminButton>
    </main>
  );
}

/* ─── Areas: the rail. Each area lists its panels in the sidebar. ─────────
   Keys that are not registered yet are skipped, so a panel can be added to an
   area before its code lands. `enquiries` is reachable by URL but lives in
   the Inbox now, so it is in no area. */
type AreaKey = "site" | "home" | "shop" | "settings" | "inbox";
const AREAS: { panels: string[]; label: string; key: AreaKey; icon: string }[] = [
  { key: "home", label: "Home", panels: [], icon: "M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1z" },
  { key: "inbox", label: "Inbox", panels: ["inbox", "contacts"], icon: "M3 11.5 5.2 5a1 1 0 0 1 .95-.7h7.7a1 1 0 0 1 .95.7L17 11.5V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 11.5h4l1 2h4l1-2h4" },
  { key: "site", label: "Website", panels: ["pages", "journal", "people", "episodes", "quotes", "media", "app"], icon: "M3 5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 8h14M6 6h.01M8 6h.01" },
  { key: "shop", label: "Shop", panels: ["shop"], icon: "M4 7h12l-1 9H5zM7 7V6a3 3 0 0 1 6 0v1" },
  { key: "settings", label: "Settings", panels: ["links"], icon: "M10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" },
];

function panelsOf(area: (typeof AREAS)[number]) {
  return area.panels.map((k) => PANELS.find((p) => p.key === k)).filter((p): p is (typeof PANELS)[number] => !!p);
}
function areaPath(area: (typeof AREAS)[number]) {
  return area.key === "home" ? "/admin" : (panelsOf(area)[0]?.path ?? "/admin");
}
function areaOf(pathname: string) {
  const panel = PANELS.find((p) => pathname === p.path || pathname.startsWith(`${p.path}/`));
  return AREAS.find((a) => panel && a.panels.includes(panel.key)) ?? AREAS[0];
}

function Icon({ d, size = 20 }: { size?: number; d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function useCounts() {
  const [counts, setCounts] = useState<Record<string, PanelCount | null>>({});
  useEffect(() => {
    let live = true;
    for (const p of PANELS) {
      p.count?.().then((c) => live && setCounts((s) => ({ ...s, [p.key]: c })));
    }
    return () => {
      live = false;
    };
  }, []);
  return counts;
}

function Rail({ email, unread }: { unread: number; email: string }) {
  const { pathname } = useLocation();
  const here = areaOf(pathname);
  return (
    <nav className="cp-rail" aria-label="Areas">
      <Link to="/admin" className="cp-rail__mark" aria-label="CLÉ Family Media, home">
        CL&Eacute;
      </Link>
      <ul className="cp-rail__list">
        {AREAS.map((a) => (
          <li key={a.key}>
            <Link to={areaPath(a)} className="cp-rail__item" aria-current={a.key === here.key ? "page" : undefined}>
              <Icon d={a.icon} />
              <span>{a.label}</span>
              {a.key === "inbox" && unread > 0 && <b className="cp-count" aria-label={`${unread} new`}>{unread}</b>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="cp-rail__foot">
        <a href="/" target="_blank" rel="noreferrer" className="cp-rail__item" title="View the website">
          <Icon d="M11 4h5v5M16 4l-7 7M14 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
          <span>Site</span>
        </a>
        <button type="button" className="cp-rail__item" onClick={() => supabase?.auth.signOut()} title={`Signed in as ${email}. Sign out`}>
          <Icon d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M12 13l3-3-3-3M15 10H8" />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  );
}

function Sidebar({ counts }: { counts: Record<string, PanelCount | null> }) {
  const { pathname } = useLocation();
  const area = areaOf(pathname);
  const panels = panelsOf(area);
  if (area.key === "home" || panels.length < 2) return null;
  return (
    <nav className="cp-side" aria-label={area.label}>
      <p className="cp-side__title">{area.label}</p>
      <ul>
        {panels.map((p) => {
          const c = counts[p.key];
          return (
            <li key={p.key}>
              <NavLink to={p.path} className="cp-side__item">
                <span>{p.label}</span>
                {c && c.tone === "alert" && <b className="cp-count">{parseInt(c.text, 10) || ""}</b>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Console({ email }: { email: string }) {
  const counts = useCounts();
  const unread = counts.inbox?.tone === "alert" ? parseInt(counts.inbox.text, 10) || 0 : 0;
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="cp">
          <Rail email={email} unread={unread} />
          <Sidebar counts={counts} />
          <main className="adm-main cp-main">
            <Suspense fallback={<p className="adm-muted" role="status">Loading...</p>}>
              <Routes>
                <Route index element={<Dashboard />} />
                {PANELS.map((p) => (
                  <Route key={p.key} path={`${p.key}/*`} element={<p.Component />} />
                ))}
                <Route
                  path="*"
                  element={<Notice>That part of the admin does not exist. <Link to="/admin" className="adm-linkbtn">Back to the start</Link></Notice>}
                />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}

/* Shown after an invite or a password-reset link signs someone in: the link
   gives a session but no password, so the first thing they do is choose one. */
function SetPassword({ invited, onDone }: { invited: boolean; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 10) return setError("Use at least 10 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError("That did not save. Try again, or ask for a new link if this one has expired.");
    window.history.replaceState(null, "", window.location.pathname);
    onDone();
  }

  return (
    <main className="adm-main adm-narrow" style={{ paddingTop: "12vh" }}>
      <p className="adm-label">CL&Eacute; Family Media</p>
      <h1 className="mt-1 font-display text-[32px] leading-[1.1] text-ink">
        {invited ? "Choose a password" : "Set a new password"}
      </h1>
      <form onSubmit={onSubmit} className="adm-card mt-6" noValidate>
        <div className="adm-field">
          <label htmlFor="admin-new-password" className="field-label">New password</label>
          <input id="admin-new-password" type="password" required autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="field-input" />
        </div>
        <div className="adm-field">
          <label htmlFor="admin-confirm-password" className="field-label">Type it again</label>
          <input id="admin-confirm-password" type="password" required autoComplete="new-password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} className="field-input" />
        </div>
        {error && <p role="alert" className="adm-error">{error}</p>}
        <AdminButton type="submit" className="mt-5 w-full" busy={busy} busyLabel="Saving" disabled={!password || !confirm}>
          Save password
        </AdminButton>
      </form>
    </main>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState<AuthState>(isSupabaseConfigured ? { kind: "loading" } : { kind: "signed-out" });
  /* Read before supabase-js consumes the link's hash. */
  const [linkType, setLinkType] = useState<null | "recovery" | "invite">(() => {
    const m = window.location.hash.match(/type=(invite|recovery)/);
    return m ? (m[1] as "invite" | "recovery") : null;
  });

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let live = true;

    async function resolve(email: string | undefined | null) {
      if (!email) return live && setAuth({ kind: "signed-out" });
      const { data, error } = await client.rpc("is_admin");
      if (!live) return;
      setAuth(error || data !== true ? { kind: "not-admin", email } : { kind: "admin", email });
    }

    client.auth.getSession().then(({ data }) => resolve(data.session?.user?.email));
    const { data: sub } = client.auth.onAuthStateChange((event, s) => {
      // A token refresh is the same person; re-checking would flash the console.
      if (event === "TOKEN_REFRESHED") return;
      if (event === "PASSWORD_RECOVERY") setLinkType("recovery");
      // Deferred: calling the client inside this callback can deadlock on
      // supabase-js's auth lock.
      const email = s?.user?.email;
      window.setTimeout(() => resolve(email), 0);
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="adm">
      <Helmet>
        <title>Admin · CLÉ Family Media</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {auth.kind === "loading" && <p className="adm-main adm-muted" role="status">Loading...</p>}
      {auth.kind === "signed-out" && <Login />}
      {linkType && (auth.kind === "admin" || auth.kind === "not-admin") && (
        <SetPassword invited={linkType === "invite"} onDone={() => setLinkType(null)} />
      )}
      {!linkType && auth.kind === "not-admin" && <NotAdmin email={auth.email} />}
      {!linkType && auth.kind === "admin" && <Console email={auth.email} />}
    </div>
  );
}
