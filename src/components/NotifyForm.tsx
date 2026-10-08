import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui";

/* ============================================================================
   The one email sign-up on the site.

   It was written twice, on the home page and on /app, against the same
   endpoint, and the two copies had already drifted: different success copy,
   different placeholder alpha, one answering in `t-sm` and the other in
   `t-body`. The wording differs by page and should, so that is a prop; nothing
   else is.

   It lives on a deep band both times, which is why the field is styled against
   white rather than against paper.
   ========================================================================== */

export function NotifyForm({ cta, icon, done }: { cta: string; icon: ReactNode; done: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "notify", email }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d.error ?? "Could not sign you up. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not sign you up. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p role="status" className="t-body mt-6">
        {done}
      </p>
    );
  }

  return (
    <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
      <div className="flex-1">
        <label htmlFor="notify-email" className="sr-only">
          Email address
        </label>
        <input
          id="notify-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-[16px] text-white placeholder:text-white/60"
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Signing up" : cta}
        {icon}
      </Button>
      {error && (
        <p role="alert" className="t-sm sm:basis-full">
          {error}
        </p>
      )}
    </form>
  );
}
