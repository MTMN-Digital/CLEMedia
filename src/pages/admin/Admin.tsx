import { useState, Suspense, useEffect, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Route, Routes, Link, NavLink } from "react-router-dom";
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
        <AdminButton type="submit" className="mt-5 w-full" busy={busy} busyLabel="Signing in" disabled={!isSupabaseConfigured || !email || !password}>
          Sign in
        </AdminButton>
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

function Home() {
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

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Edit the site</h1>
          <p>Choose what to change. Everything you save goes live on the site straight away, unless it is a draft.</p>
        </div>
      </header>
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
          <nav className="adm-nav" aria-label="Sections">
            <NavLink to="/admin" end>Home</NavLink>
            {PANELS.map((p) => (
              <NavLink key={p.key} to={p.path}>{p.label}</NavLink>
            ))}
          </nav>
        </div>
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
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState<AuthState>(isSupabaseConfigured ? { kind: "loading" } : { kind: "signed-out" });

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
      {auth.kind === "not-admin" && <NotAdmin email={auth.email} />}
      {auth.kind === "admin" && <Console email={auth.email} />}
    </div>
  );
}
