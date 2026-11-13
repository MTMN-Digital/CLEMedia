import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLoad, saveSetting, getSetting } from "@/lib/admin";
import type { QuotesSetting } from "@/lib/types";
import { PageHeader, TextInput, MoveButtons, AdminButton, SaveBar, useSaveState, Notice, TextArea } from "@/components/admin/kit";

/* Quotes: the `quotes` settings row, shown on the home page under "In their
   own words, with their permission." Until the first one is saved the page
   shows its two held-open panels (parents and educators, Banteer workshop). */

type Item = QuotesSetting["items"][number];

export function QuotesPanel() {
  return (
    <Routes>
      <Route index element={<QuotesEditor />} />
    </Routes>
  );
}

function QuotesEditor() {
  const loaded = useLoad(() => getSetting("quotes"), []);
  const [saved, setSaved] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [tried, setTried] = useState(false);
  const save = useSaveState();

  useEffect(() => {
    if (loaded.loading || loaded.error !== null) return;
    const list = loaded.data?.items ?? [];
    setSaved(list);
    setItems(list);
  }, [loaded.loading, loaded.error, loaded.data]);

  const set = (i: number, patch: Partial<Item>) => setItems((l) => l.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const move = (i: number, dir: -1 | 1) =>
    setItems((l) => {
      const next = [...l];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });

  const errors = items.map((q) => (!q.words.trim() ? "The quotation is required." : !q.from.trim() ? "Add who said it, as they agreed to be named." : null));
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);

  async function onSave() {
    setTried(true);
    const i = errors.findIndex(Boolean);
    if (i >= 0) return save.fail(`Quote ${i + 1}: ${errors[i]}`);
    const clean = items.map((q) => ({ words: q.words.trim(), from: q.from.trim() }));
    const ok = await save.run(async () => {
      const r = await saveSetting("quotes", { items: clean });
      return r.error !== null ? { error: r.error } : "Saved";
    });
    if (ok) setSaved(clean);
  }

  return (
    <>
      <PageHeader
        title="Quotes"
        intro="Quotations from parents, educators and schools, on the home page. Use each person's exact wording and the name they agreed to, and only with their permission."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-quiet btn-sm">
            View the home page
          </a>
        }
      />
      {loaded.error !== null && <Notice tone="error">{loaded.error}</Notice>}
      {!loaded.loading && items.length === 0 && (
        <Notice>No quotes yet. The home page shows two "being gathered" panels until the first one is saved.</Notice>
      )}

      <div className="adm-stack">
        {items.map((q, i) => (
          <section key={i} className="adm-card" aria-labelledby={`quote-${i}-h`}>
            <div className="flex items-center justify-between gap-3">
              <h2 id={`quote-${i}-h`} className="adm-h2">
                Quote {i + 1}
              </h2>
              <MoveButtons label={`Quote ${i + 1}`} first={i === 0} last={i === items.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
            </div>
            <div className="adm-stack mt-3">
              <TextArea label="Quotation" rows={4} value={q.words} onChange={(v) => set(i, { words: v })} error={tried && !q.words.trim() ? errors[i] : null} />
              <TextInput
                label="Who said it"
                value={q.from}
                onChange={(v) => set(i, { from: v })}
                hint='As they agreed to be named, for example "Parent, Co. Cork" or "Banteer National School".'
                error={tried && q.words.trim() && !q.from.trim() ? errors[i] : null}
              />
              <div>
                <AdminButton variant="danger" size="sm" onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>
                  Remove
                </AdminButton>
              </div>
            </div>
          </section>
        ))}
        <div>
          <AdminButton variant="quiet" onClick={() => setItems((l) => [...l, { words: "", from: "" }])} disabled={loaded.loading}>
            Add a quote
          </AdminButton>
        </div>
      </div>

      <SaveBar status={save.status} dirty={dirty} onSave={onSave} disabled={loaded.loading || loaded.error !== null} />
    </>
  );
}
