import { useState, Suspense, useEffect, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Routes, NavLink, Route, Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { PANELS, type PanelCount } from "@/components/admin/registry";
import { AdminButton, ToastProvider, Notice, ConfirmProvider } from "@/components/admin/kit";
import "@/components/admin/kit/admin.css";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";
import navMark from "@/assets/brand/cle-nav.webp";

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

/* ─── The shell: Iacchus layout in CLÉ colours ─────────────────────────────
   A dark CLÉ-navy frame on the left holds a floating white rail of areas and
   the full list of sections, grouped. The rail jumps to an area's first
   section; the list shows every section so nothing is two clicks deep. Under
   1100px the frame becomes a drawer behind a menu button, and on a phone the
   areas also sit in a bottom bar. Keys that are not registered are skipped. */
type AreaKey = "site" | "home" | "shop" | "settings" | "inbox";
const AREAS: { panels: string[]; label: string; key: AreaKey; icon: string }[] = [
  { key: "home", label: "Home", panels: [], icon: "M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1z" },
  { key: "inbox", label: "Inbox", panels: ["inbox", "contacts"], icon: "M3 11.5 5.2 5a1 1 0 0 1 .95-.7h7.7a1 1 0 0 1 .95.7L17 11.5V15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 11.5h4l1 2h4l1-2h4" },
  { key: "site", label: "Website", panels: ["pages", "journal", "people", "episodes", "quotes", "media", "app"], icon: "M3 5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 8h14M6 6h.01M8 6h.01" },
  { key: "shop", label: "Shop", panels: ["shop"], icon: "M4 7h12l-1 9H5zM7 7V6a3 3 0 0 1 6 0v1" },
  { key: "settings", label: "Settings", panels: ["links"], icon: "M10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" },
];

/** One glyph per section, drawn on a 20px grid. */
const GLYPH: Record<string, string> = {
  inbox: AREAS[1].icon,
  contacts: "M7.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 16c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5M13 4.3a2.5 2.5 0 0 1 0 4.4M14.5 11.7c1.8.5 3 2 3 4.3",
  pages: "M5 3h7l3 3v11H5zM12 3v3h3M8 10h4M8 13h4",
  journal: "M4 4h9a3 3 0 0 1 3 3v9H7a3 3 0 0 1-3-3zM7 8h6M7 11h4",
  people: "M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5",
  episodes: "M3 5h14v10H3zM8.5 8v4l3.5-2z",
  quotes: "M5 12c0-3 1.5-5 4-6M5 12h3v3H5zM12 12c0-3 1.5-5 4-6M12 12h3v3h-3z",
  media: "M10 3a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0v-4A2.5 2.5 0 0 0 10 3zM5 9.5a5 5 0 0 0 10 0M10 14.5V17",
  app: "M6.5 2.5h7a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1zM9 15h2",
  shop: AREAS[3].icon,
  links: "M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.8.8M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.8-.8",
};



const panel = (k: string) => PANELS.find((p) => p.key === k);
function areaPath(area: (typeof AREAS)[number]) {
  return area.key === "home" ? "/admin" : (area.panels.map(panel).find(Boolean)?.path ?? "/admin");
}
function areaOf(pathname: string) {
  const p = PANELS.find((x) => pathname === x.path || pathname.startsWith(`${x.path}/`));
  return AREAS.find((a) => p && a.panels.includes(p.key)) ?? AREAS[0];
}

function Icon({ d, size = 20 }: { size?: number; d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

const countOf = (c: PanelCount | null | undefined) => (c && c.tone === "alert" ? parseInt(c.text, 10) || 0 : 0);
const initials = (email: string) => email.split("@")[0].split(/[._-]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase() || "?";

function Rail({ unread, email }: { unread: number; email: string }) {
  const { pathname } = useLocation();
  const here = areaOf(pathname);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <nav className="cp-rail" aria-label="Areas">
      <Link to="/admin" className="cp-rail__logo" aria-label="CLÉ Family Media admin, home">
        <img src={navMark} alt="" width="330" height="138" />
      </Link>
      <div className="cp-rail__areas">
        {AREAS.map((a) => (
          <Link key={a.key} to={areaPath(a)} className="cp-area" aria-current={a.key === here.key ? "page" : undefined}>
            <Icon d={a.icon} size={21} />
            <span>{a.label}</span>
            {a.key === "inbox" && unread > 0 && <i aria-label={`${unread} new`}>{unread}</i>}
          </Link>
        ))}
      </div>
      <div className="cp-rail__foot">
        <a href="/" target="_blank" rel="noreferrer" className="cp-area" aria-label="View the website (opens in a new tab)">
          <Icon d="M11 4h5v5M16 4l-7 7M14 11v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" size={20} />
          <span>Site</span>
        </a>
        <div className="cp-me">
          <button type="button" className="cp-me__btn" aria-expanded={open} onClick={() => setOpen((o) => !o)} aria-label={`Account, ${email}`}>
            {initials(email)}
          </button>
          {open && (
            <div className="cp-me__menu">
              <p className="cp-me__email" title={email}>{email}</p>
              <button type="button" className="cp-me__item" onClick={() => supabase?.auth.signOut()}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/** The second layer: the current area's sections as a pill bar above the page. */
function Tabs({ counts }: { counts: Record<string, PanelCount | null> }) {
  const { pathname } = useLocation();
  const area = areaOf(pathname);
  const items = area.panels.map(panel).filter((p): p is (typeof PANELS)[number] => !!p);
  if (items.length < 2) return null;
  return (
    <nav className="cp-tabs" aria-label={`${area.label} sections`}>
      {items.map((p) => {
        const n = countOf(counts[p.key]);
        return (
          <NavLink key={p.key} to={p.path} className="cp-tab">
            <Icon d={GLYPH[p.key] ?? AREAS[2].icon} size={17} />
            {p.label}
            {n > 0 && <b>{n}</b>}
          </NavLink>
        );
      })}
    </nav>
  );
}

function Console({ email }: { email: string }) {
  const counts = useCounts();
  const unread = countOf(counts.inbox);
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="cp">
          <Rail unread={unread} email={email} />
          <main className="adm-main cp-main">
            <Tabs counts={counts} />
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
