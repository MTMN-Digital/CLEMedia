import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useLoad, saveSetting, getSetting } from "@/lib/admin";
import type { AppSetting } from "@/lib/types";
import { APP_LAUNCHED } from "@/lib/site";
import { useSaveState, Notice, SaveBar, Segmented, StatusPill, TextInput, useConfirm, PageHeader } from "@/components/admin/kit";
import { urlOrNull, urlError } from "../links/urls";

/* The App panel: the `app` settings row. One switch, one target window and
   two store links. /app and /media read the row through useSetting and fall
   back to APP_LAUNCHED in src/lib/site.ts until it arrives, so the default
   shown here is the same value the site is built with. */

type Draft = { target_window: string; app_store_url: string; play_store_url: string; launched: boolean };

const DEFAULT: Draft = { launched: APP_LAUNCHED, target_window: "", app_store_url: "", play_store_url: "" };

function fromRow(row: Partial<AppSetting> | null): Draft {
  return {
    launched: row?.launched ?? DEFAULT.launched,
    target_window: row?.target_window ?? "",
    app_store_url: row?.app_store_url ?? "",
    play_store_url: row?.play_store_url ?? "",
  };
}

export function AppPanel() {
  return (
    <Routes>
      <Route index element={<AppEditor />} />
    </Routes>
  );
}

function AppEditor() {
  const loaded = useLoad(() => getSetting("app"), []);
  const [saved, setSaved] = useState<Draft>(DEFAULT);
  const [draft, setDraft] = useState<Draft>(DEFAULT);
  const save = useSaveState();
  const confirm = useConfirm();

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    const s = fromRow(loaded.data);
    setSaved(s);
    setDraft(s);
  }, [loaded.loading, loaded.error, loaded.data]);

  const appErr = urlError(draft.app_store_url);
  const playErr = urlError(draft.play_store_url);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const hasStore = Boolean(urlOrNull(draft.app_store_url) || urlOrNull(draft.play_store_url));

  async function onSave() {
    if (appErr) return save.fail(`App Store: ${appErr}`);
    if (playErr) return save.fail(`Google Play: ${playErr}`);
    if (draft.launched && !saved.launched) {
      const ok = await confirm({
        title: "Launch the app?",
        body: hasStore
          ? "The app page and the press page will say PupsPlayer™ is available now, and the store links will show on the app page."
          : "The app page and the press page will say PupsPlayer™ is available now. No store link has been entered, so the page will say the stores are not yet listed.",
        confirmLabel: "Launch the app",
        destructive: false,
      });
      if (!ok) return;
    }
    const ok = await save.run(async () => {
      const r = await saveSetting("app", {
        launched: draft.launched,
        target_window: urlOrNull(draft.target_window),
        app_store_url: urlOrNull(draft.app_store_url),
        play_store_url: urlOrNull(draft.play_store_url),
      });
      if (r.error !== null) return { error: r.error };
      return draft.launched && !saved.launched ? "Launched" : !draft.launched && saved.launched ? "Back in development" : "Saved";
    });
    if (ok) setSaved({ ...draft });
  }

  return (
    <>
      <PageHeader
        title="App"
        intro="The launch switch and the store links for PupsPlayer™."
        actions={<StatusPill tone={saved.launched ? "ok" : "off"}>{saved.launched ? "Launched" : "In development"}</StatusPill>}
      />

      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}

      <div className="adm-stack">
        <section className="adm-card" aria-labelledby="app-state-h">
          <h2 id="app-state-h" className="adm-h2">
            Where it stands
          </h2>
          <p className="adm-muted mb-4">
            Changes what the{" "}
            <Link to="/app" target="_blank" rel="noreferrer" className="underline">
              app page
            </Link>{" "}
            and the{" "}
            <Link to="/media" target="_blank" rel="noreferrer" className="underline">
              press page
            </Link>{" "}
            say about the player. Nothing changes on the site until you save.
          </p>
          <Segmented
            label="Status"
            value={draft.launched ? "launched" : "development"}
            onChange={(v) => setDraft((d) => ({ ...d, launched: v === "launched" }))}
            options={[
              { value: "development", label: "In development" },
              { value: "launched", label: "Launched" },
            ]}
          />
          <TextInput
            label="Target window"
            optional
            value={draft.target_window}
            onChange={(v) => setDraft((d) => ({ ...d, target_window: v }))}
            hint="For your own record, for example a month. The app page does not show a date until one is confirmed."
            disabled={loaded.loading}
          />
        </section>

        <section className="adm-card" aria-labelledby="app-stores-h">
          <h2 id="app-stores-h" className="adm-h2">
            Store links
          </h2>
          <p className="adm-muted mb-4">Shown on the app page once the app is launched. An empty box shows nothing, so there are never placeholder badges.</p>
          {/* Each field in its own cell: the kit spaces adjacent fields
              vertically, which a grid does not want. */}
          <div className="adm-grid2">
            <div>
              <TextInput
                label="App Store"
                optional
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="https://apps.apple.com/..."
                value={draft.app_store_url}
                onChange={(v) => setDraft((d) => ({ ...d, app_store_url: v }))}
                error={appErr}
                disabled={loaded.loading}
              />
            </div>
            <div>
              <TextInput
                label="Google Play"
                optional
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="https://play.google.com/store/apps/..."
                value={draft.play_store_url}
                onChange={(v) => setDraft((d) => ({ ...d, play_store_url: v }))}
                error={playErr}
                disabled={loaded.loading}
              />
            </div>
          </div>
        </section>
      </div>

      <SaveBar
        status={save.status}
        dirty={dirty}
        onSave={onSave}
        saveLabel={draft.launched && !saved.launched ? "Save and launch" : "Save"}
        disabled={loaded.loading || loaded.error !== null}
      />
    </>
  );
}
