import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLoad, saveSetting, getSetting } from "@/lib/admin";
import type { LinksSetting, CompanySetting, SocialNetwork } from "@/lib/types";
import { COMPANY_DEFAULT, SITE } from "@/lib/site";
import { TextInput, useSaveState, PageHeader, SaveBar, Notice } from "@/components/admin/kit";
import { urlOrNull, urlError } from "./urls";

/* Links and settings: the `links` settings row. The social accounts are kept
   here so the site can carry them the moment the footer does; the show site
   address is shown but not editable, because it is fixed in src/lib/site.ts
   on purpose and must never go blank. */

const NETWORKS: { label: string; example: string; key: SocialNetwork }[] = [
  { key: "instagram", label: "Instagram", example: "https://www.instagram.com/..." },
  { key: "facebook", label: "Facebook", example: "https://www.facebook.com/..." },
  { key: "tiktok", label: "TikTok", example: "https://www.tiktok.com/@..." },
  { key: "youtube", label: "YouTube", example: "https://www.youtube.com/@..." },
  { key: "linkedin", label: "LinkedIn", example: "https://www.linkedin.com/company/..." },
];

type Social = Record<SocialNetwork, string>;
type Draft = Social & { email: string } & CompanySetting;

const EMPTY: Draft = { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "", email: "", ...COMPANY_DEFAULT };

function fromRows(links: Partial<LinksSetting> | null, company: Partial<CompanySetting> | null): Draft {
  const out = { ...EMPTY, ...COMPANY_DEFAULT, ...(company ?? {}), email: links?.email ?? "" };
  for (const n of NETWORKS) out[n.key] = links?.social?.[n.key] ?? "";
  return out;
}

const emailError = (v: string) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Enter a full email address, for example hello@example.ie.");

export function LinksPanel() {
  return (
    <Routes>
      <Route index element={<LinksEditor />} />
    </Routes>
  );
}

function LinksEditor() {
  const loaded = useLoad(async () => {
    const [links, company] = await Promise.all([getSetting("links"), getSetting("company")]);
    if (links.error !== null) return links;
    if (company.error !== null) return company;
    return { data: { links: links.data, company: company.data }, error: null };
  }, []);
  const [saved, setSaved] = useState<Draft>(EMPTY);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const save = useSaveState();

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    const s = fromRows(loaded.data?.links ?? null, loaded.data?.company ?? null);
    setSaved(s);
    setDraft(s);
  }, [loaded.loading, loaded.error, loaded.data]);

  const errors = Object.fromEntries(NETWORKS.map((n) => [n.key, urlError(draft[n.key])])) as Record<SocialNetwork, string | null>;
  const emailErr = emailError(draft.email);
  const companyErr = !draft.legal.trim() || !draft.cro.trim() || !draft.office.trim() ? "The company name, number and registered office are all required." : null;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function onSave() {
    const bad = NETWORKS.find((n) => errors[n.key]);
    if (bad) return save.fail(`${bad.label}: ${errors[bad.key]}`);
    if (emailErr) return save.fail(emailErr);
    if (companyErr) return save.fail(companyErr);
    const social: LinksSetting["social"] = {};
    for (const n of NETWORKS) {
      const v = urlOrNull(draft[n.key]);
      if (v) social[n.key] = v;
    }
    const ok = await save.run(async () => {
      const r = await saveSetting("links", { show_site: loaded.data?.links?.show_site || SITE.showUrl, social, email: draft.email.trim() || null });
      if (r.error !== null) return { error: r.error };
      const c = await saveSetting("company", { legal: draft.legal.trim(), cro: draft.cro.trim(), office: draft.office.trim() });
      return c.error !== null ? { error: c.error } : "Saved";
    });
    if (ok) setSaved({ ...draft });
  }

  return (
    <>
      <PageHeader title="Links and settings" intro="Your contact email, social accounts and company details." />

      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}

      <div className="adm-stack">
        <section className="adm-card" aria-labelledby="links-email-h">
          <h2 id="links-email-h" className="adm-h2">
            Public email address
          </h2>
          <TextInput
            label="Email"
            optional
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={draft.email}
            onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
            error={emailErr}
            hint="Shown in the footer of every page and on the contact page. Leave empty to show none."
            disabled={loaded.loading}
          />
        </section>

        <section className="adm-card" aria-labelledby="links-show-h">
          <h2 id="links-show-h" className="adm-h2">
            The show's own site
          </h2>
          <p className="adm-muted">
            The header and footer link to{" "}
            <a href={SITE.showUrl} target="_blank" rel="noreferrer" className="underline">
              {SITE.showUrl}
            </a>
            . This address is fixed in the site itself, so it can never go blank by accident. Ask MTMN if it ever has to change.
          </p>
        </section>

        <section className="adm-card" aria-labelledby="links-social-h">
          <h2 id="links-social-h" className="adm-h2">
            Social accounts
          </h2>
          <p className="adm-muted">Shown in the footer of every page. Leave a box empty for an account the company does not have.</p>
          {/* Each field in its own cell: the kit spaces adjacent fields
              vertically, which a grid does not want. */}
          <div className="adm-grid2 mt-4">
            {NETWORKS.map((n) => (
              <div key={n.key}>
                <TextInput
                  label={n.label}
                  optional
                  type="url"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={n.example}
                  value={draft[n.key]}
                  onChange={(v) => setDraft((d) => ({ ...d, [n.key]: v }))}
                  error={errors[n.key]}
                  disabled={loaded.loading}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card" aria-labelledby="links-company-h">
          <h2 id="links-company-h" className="adm-h2">
            Company details
          </h2>
          <p className="adm-muted">Shown on the privacy, terms and cookie pages, the press kit and the contact page. Not in the footer.</p>
          <div className="adm-stack mt-4">
            <TextInput label="Registered company name" value={draft.legal} onChange={(v) => setDraft((d) => ({ ...d, legal: v }))} disabled={loaded.loading} />
            <TextInput label="Company number" value={draft.cro} onChange={(v) => setDraft((d) => ({ ...d, cro: v }))} disabled={loaded.loading} />
            <TextInput label="Registered office" value={draft.office} onChange={(v) => setDraft((d) => ({ ...d, office: v }))} error={companyErr} disabled={loaded.loading} />
          </div>
        </section>
      </div>

      <SaveBar status={save.status} dirty={dirty} onSave={onSave} disabled={loaded.loading || loaded.error !== null} />
    </>
  );
}
