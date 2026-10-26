import { type FormEvent, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const PANELS = [
  { key: "pages", label: "Pages and photos", blurb: "Headlines, body copy and every image, slot by slot" },
  { key: "journal", label: "Journal", blurb: "Write, schedule, publish and categorise posts" },
  { key: "people", label: "Team and advisors", blurb: "Profiles, photos, bios and running order" },
  { key: "media", label: "Media and podcast", blurb: "Press, interviews and embeds" },
  { key: "shop", label: "Shop", blurb: "Products, prices and the files behind them" },
  { key: "app", label: "App", blurb: "App page content and the launch switch" },
  { key: "links", label: "Links and settings", blurb: "Navigation, footer, social and store links" },
  { key: "enquiries", label: "Enquiries", blurb: "Messages from the contact page" },
];

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("That email and password did not match. Try again.");
    setBusy(false);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <div className="w-full">
        <p className="font-display text-[20px] text-ink">CLÉ Family Media</p>
        <h1 className="mt-1 font-display text-[28px] text-ink">Sign in</h1>

        {!isSupabaseConfigured && (
          <p className="glass-warm mt-6 rounded-[var(--radius-card)] p-4 text-[13.5px] text-ink">
            Supabase isn't configured in this environment yet, so sign-in is unavailable. Add
            <code className="mx-1">VITE_SUPABASE_URL</code> and
            <code className="mx-1">VITE_SUPABASE_ANON_KEY</code> to enable it.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-[13.5px] font-medium text-ink">Email</label>
            <input id="admin-email" type="email" required autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass mt-1.5 w-full rounded-[var(--radius-sm)] px-4 py-3 text-[16px] text-ink" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-[13.5px] font-medium text-ink">Password</label>
            <input id="admin-password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass mt-1.5 w-full rounded-[var(--radius-sm)] px-4 py-3 text-[16px] text-ink" />
          </div>
          {error && <p role="alert" className="text-[13.5px] text-red-deep">{error}</p>}
          <button type="submit" disabled={busy || !isSupabaseConfigured}
            className="w-full rounded-full bg-red px-6 py-3 text-[15px] font-semibold text-paper disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ email, onSignOut }: { onSignOut: () => void; email: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <header className="flex flex-wrap items-center gap-3 border-b border-hairline pb-5">
        <div>
          <p className="font-display text-[20px] text-ink">Site admin</p>
          <p className="text-[14px] text-deep">{email}</p>
        </div>
        <button onClick={onSignOut}
          className="glass ml-auto rounded-full px-4 py-2 text-[13.5px] text-slate">
          Sign out
        </button>
      </header>

      <ul className="mt-6 space-y-3">
        {PANELS.map((p) => (
          <li key={p.key}>
            <button className="glass flex w-full items-center gap-4 rounded-[var(--radius-card)] p-5 text-left transition-all hover:bg-white/95">
              <span className="min-w-0">
                <span className="block text-[16px] font-semibold text-ink">{p.label}</span>
                <span className="mt-0.5 block text-[13.5px] text-deep">{p.blurb}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" className="ml-auto shrink-0 text-deep" aria-hidden="true">
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[14px] text-deep">
        Each panel is built out in the admin run. Designed for a phone first.
      </p>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setSession({ email: data.session.user.email });
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user?.email ? { email: s.user.email } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin · CLÉ Family Media</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {!ready ? (
        <p className="p-8 text-deep">Loading…</p>
      ) : session ? (
        <Dashboard email={session.email} onSignOut={() => supabase?.auth.signOut()} />
      ) : (
        <Login />
      )}
    </>
  );
}
