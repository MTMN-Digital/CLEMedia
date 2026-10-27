import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLoad, saveSetting, getSetting } from "@/lib/admin";
import type { SocialNetwork, LinksSetting } from "@/lib/types";
import { SITE } from "@/lib/site";
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

const EMPTY: Social = { instagram: "", facebook: "", tiktok: "", youtube: "", linkedin: "" };

function fromRow(row: Partial<LinksSetting> | null): Social {
  const out = { ...EMPTY };
  for (const n of NETWORKS) out[n.key] = row?.social?.[n.key] ?? "";
  return out;
}

export function LinksPanel() {
  return (
    <Routes>
      <Route index element={<LinksEditor />} />
    </Routes>
  );
}

function LinksEditor() {
  const loaded = useLoad(() => getSetting("links"), []);
  const [saved, setSaved] = useState<Social>(EMPTY);
  const [draft, setDraft] = useState<Social>(EMPTY);
  const save = useSaveState();

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    const s = fromRow(loaded.data);
    setSaved(s);
    setDraft(s);
  }, [loaded.loading, loaded.error, loaded.data]);

  const errors = Object.fromEntries(NETWORKS.map((n) => [n.key, urlError(draft[n.key])])) as Record<SocialNetwork, string | null>;
  const dirty = NETWORKS.some((n) => draft[n.key] !== saved[n.key]);

  async function onSave() {
    const bad = NETWORKS.find((n) => errors[n.key]);
    if (bad) return save.fail(`${bad.label}: ${errors[bad.key]}`);
    const social: LinksSetting["social"] = {};
    for (const n of NETWORKS) {
      const v = urlOrNull(draft[n.key]);
      if (v) social[n.key] = v;
    }
    const ok = await save.run(async () => {
      const r = await saveSetting("links", { show_site: loaded.data?.show_site || SITE.showUrl, social });
      return r.error !== null ? { error: r.error } : "Saved";
    });
    if (ok) setSaved({ ...draft });
  }

  return (
    <>
      <PageHeader title="Links and settings" intro="The addresses the site links out to." />

      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}

      <div className="adm-stack">
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
          <Notice>Kept here ready. Shown on the site once the footer carries social links. Leave a box empty for an account the company does not have.</Notice>
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
      </div>

      <SaveBar status={save.status} dirty={dirty} onSave={onSave} disabled={loaded.loading || loaded.error !== null} />
    </>
  );
}
