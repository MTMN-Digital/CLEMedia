import { Fragment, useState, Suspense, useEffect, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, Routes, NavLink, Route, Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { PANELS, type PanelCount } from "@/components/admin/registry";
import { ToastProvider, AdminButton, ConfirmProvider, Notice, StatusPill } from "@/components/admin/kit";
import "@/components/admin/kit/admin.css";

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
      <h1 className="mt-1 font-display text-[32px] leading-[1.1] text-ink">Sign in to edit the site</h1>

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

const GROUP: Record<string, string> = { pages: "The site", shop: "Selling", links: "Running it" };

const START = [
  { to: "/admin/journal/new", title: "Write a journal post", body: "Title, words, a picture, then publish or keep it as a draft" },
  { to: "/admin/shop/new", title: "Add a product", body: "What it is, the price, the cover and the file" },
  { to: "/admin/people/new", title: "Add a person", body: "Name, role, photo and bio for the team page" },
  { to: "/admin/media/new", title: "Add a press entry", body: "An article, podcast, interview or video" },
];

function greeting(now = new Date()) {
  const h = now.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
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

function Home() {
  const counts = useCounts();
  return (
    <>
      <header className="adm-head">
        <div>
          <h1 className="adm-hello">{greeting()}</h1>
          <p>Everything you save goes live on the site straight away, unless it is a draft or hidden.</p>
        </div>
      </header>
      <h2 className="adm-h2">Start something</h2>
      <ul className="adm-start">
        {START.map((s) => (
          <li key={s.to}>
            <Link to={s.to}>
              <strong>{s.title}</strong>
              <span>{s.body}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="adm-h2">Everything on the site</h2>
      <ul className="adm-tiles">
        {PANELS.map((p) => {
          const c = counts[p.key];
          return (
            <li key={p.key}>
              <Link to={p.path} className="adm-tile">
                <span className="min-w-0">
                  <strong>{p.label}</strong>
                  <span>{p.blurb}</span>
                  {c && <StatusPill tone={c.tone}>{c.text}</StatusPill>}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Nav() {
  const { enquiries } = useCounts();
  const unread = enquiries?.tone === "alert" ? parseInt(enquiries.text, 10) : 0;
  /* On a phone the sections sit behind one button; choosing one closes it. */
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  const here = PANELS.find((p) => pathname.startsWith(p.path))?.label ?? "Home";
  return (
    <>
    <button type="button" className="adm-menu" aria-expanded={open} aria-controls="adm-sections" onClick={() => setOpen((o) => !o)}>
      <span>{here}</span>
      {unread > 0 && <span className="adm-nav__count">{unread} new</span>}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d={open ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    <nav id="adm-sections" className="adm-nav" data-open={open} aria-label="Sections">
      <NavLink to="/admin" end>Home</NavLink>
      {PANELS.map((p) => (
        <Fragment key={p.key}>
          {GROUP[p.key] && <span className="adm-nav__group">{GROUP[p.key]}</span>}
          <NavLink to={p.path}>
            {p.label}
            {p.key === "enquiries" && unread > 0 && <span className="adm-nav__count" aria-label={`${unread} new`}>{unread}</span>}
          </NavLink>
        </Fragment>
      ))}
    </nav>
    </>
  );
}

function Console({ email }: { email: string }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="adm-top">
          <div className="adm-top__row">
            <Link to="/admin" className="adm-brand">
              <small>Site editor</small>
              CL&Eacute; Family Media
            </Link>
            <div className="adm-who">
              <a href="/" target="_blank" rel="noreferrer" className="adm-linkbtn" style={{ fontSize: 14 }}>
                View site
              </a>
              <span className="adm-who__email" title={email}>{email}</span>
              <AdminButton variant="quiet" size="sm" onClick={() => supabase?.auth.signOut()}>Sign out</AdminButton>
            </div>
          </div>
        </div>
        <div className="adm-shell">
        <Nav />
        <main className="adm-main">
          <Suspense fallback={<p className="adm-muted" role="status">Loading...</p>}>
            <Routes>
              <Route index element={<Home />} />
              {PANELS.map((p) => (
                <Route key={p.key} path={`${p.key}/*`} element={<p.Component />} />
              ))}
              <Route
                path="*"
                element={<Notice>That part of the editor does not exist. <Link to="/admin" className="adm-linkbtn">Back to the start</Link></Notice>}
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
        <title>Site editor · CLÉ Family Media</title>
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
