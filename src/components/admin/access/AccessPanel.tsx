import { type FormEvent, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { formatDate, useLoad, type Result } from "@/lib/admin";
import { useToast, Notice, Avatar, useConfirm, TextInput, Tag, AdminButton, PageHeader } from "@/components/admin/kit";
import "./access.css";

/* Access: who can sign in to this admin. Everyone listed has full access.
   Invites, fresh links and removals go through /api/admin-users, which holds
   the service key; the browser never can. */

interface Person {
  addedAt: string;
  id: string;
  active: boolean;
  lastSignIn: string | null;
  email: string;
  you: boolean;
}

async function call<T>(method: "POST" | "GET" | "DELETE", body?: unknown, query = ""): Promise<Result<T>> {
  try {
    const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
    const token = data.session?.access_token;
    if (!token) return { data: null, error: "Sign in again, then try once more." };
    const r = await fetch(`/api/admin-users${query}`, {
      method,
      headers: { authorization: `Bearer ${token}`, ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const j = (await r.json().catch(() => ({}))) as T & { error?: string };
    if (!r.ok) return { data: null, error: j.error ?? "Something went wrong. Try again." };
    return { data: j, error: null };
  } catch {
    return { data: null, error: "Could not reach the server. Check the connection and try again." };
  }
}

export function AccessPanel() {
  return (
    <Routes>
      <Route index element={<Access />} />
    </Routes>
  );
}

function Access() {
  const toast = useToast();
  const confirm = useConfirm();
  const list = useLoad(() => call<{ people: Person[] }>("GET"), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const people = list.data?.people ?? [];

  async function invite(e: FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError("Enter a full email address.");
    setError(null);
    setBusy("invite");
    const r = await call<{ sent: "password" | "invite" }>("POST", { email: v });
    setBusy(null);
    if (r.error !== null) return setError(r.error);
    setEmail("");
    toast(r.data.sent === "invite" ? `Invite sent to ${v}` : `${v} already had an account, so we sent them a link to set a new password`);
    list.reload();
  }

  async function resend(p: Person) {
    setBusy(p.id);
    const r = await call<{ sent: string }>("POST", { email: p.email });
    setBusy(null);
    if (r.error !== null) return toast(r.error, "error");
    toast(p.active ? `Password link sent to ${p.email}` : `New invite sent to ${p.email}`);
    list.reload();
  }

  async function remove(p: Person) {
    const ok = await confirm({
      title: `Remove ${p.email}?`,
      body: "They won't be able to sign in any more. You can invite them again later.",
      confirmLabel: "Remove access",
    });
    if (!ok) return;
    setBusy(p.id);
    const r = await call("DELETE", undefined, `?id=${encodeURIComponent(p.id)}`);
    setBusy(null);
    if (r.error !== null) return toast(r.error, "error");
    toast(`${p.email} removed`);
    list.reload();
  }

  return (
    <div className="ac">
      <PageHeader title="Access" />

      <form className="ac-card ac-invite" onSubmit={invite} noValidate>
        <h2>Invite someone</h2>
        <div className="ac-invite__row">
          <TextInput label="Their email address" type="email" autoComplete="off" value={email} onChange={setEmail} error={error} />
          <AdminButton type="submit" variant="primary" busy={busy === "invite"} busyLabel="Sending">
            Send invite
          </AdminButton>
        </div>
        <p className="ac-note">They get an email with a link to choose a password. Everyone here can change the whole site.</p>
      </form>

      <section className="ac-card" aria-labelledby="ac-people">
        <h2 id="ac-people">
          People with access <span className="ac-n">{list.data ? people.length : ""}</span>
        </h2>
        {list.error !== null && <Notice tone="error">{list.error}</Notice>}
        {list.loading && !list.data && <p className="adm-muted" role="status">Loading...</p>}
        <ul className="ac-list">
          {people.map((p) => (
            <li key={p.id} className="ac-row">
              <Avatar name={null} email={p.email} size={40} />
              <div className="ac-who">
                <b>{p.email}</b>
                <span>{p.active ? `Last signed in ${formatDate(p.lastSignIn)}` : `Invited ${formatDate(p.addedAt)}, not signed in yet`}</span>
              </div>
              <div className="ac-tags">
                {p.you && <Tag tone="info">You</Tag>}
                <Tag tone={p.active ? "ok" : "warn"}>{p.active ? "Active" : "Invite sent"}</Tag>
              </div>
              <div className="ac-act">
                <AdminButton size="sm" variant="quiet" onClick={() => resend(p)} busy={busy === p.id} busyLabel="Sending" disabled={busy !== null && busy !== p.id}>
                  {p.active ? "Send password link" : "Resend invite"}
                </AdminButton>
                {!p.you && (
                  <AdminButton size="sm" variant="danger" onClick={() => remove(p)} disabled={busy !== null}>
                    Remove
                  </AdminButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
