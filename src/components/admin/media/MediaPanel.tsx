import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useLoad, type MediaRow, reorderRows, formatDate, listRows } from "@/lib/admin";
import { EmptyState, useToast, Notice, moveId, MoveButtons, PageHeader, AdminLinkButton } from "@/components/admin/kit";
import { MediaForm, KIND_LABEL } from "./MediaForm";
import "../journal/journal.css";

/* Media and podcast: the `media_items` table, which /media lists newest
   first. The list here follows the running order, which decides the order
   of entries that share a date on the site. */

export function MediaPanel() {
  return (
    <Routes>
      <Route index element={<MediaList />} />
      <Route path="new" element={<MediaForm />} />
      <Route path=":id" element={<MediaForm />} />
    </Routes>
  );
}

const KINDS = Object.keys(KIND_LABEL) as MediaRow["kind"][];
const initials = (m: MediaRow) =>
  (m.outlet || m.title)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function MediaList() {
  const toast = useToast();
  const [moving, setMoving] = useState(false);
  const list = useLoad(
    () =>
      listRows("media_items", {
        order: [
          { column: "published_on", ascending: false },
          { column: "sort_order" },
        ],
      }),
    [],
  );

  async function move(id: string, dir: -1 | 1) {
    if (!list.data) return;
    setMoving(true);
    const r = await reorderRows("media_items", moveId(list.data.map((m) => m.id), id, dir));
    setMoving(false);
    if (r.error !== null) return toast(r.error, "error");
    toast("Moved");
    list.reload();
  }

  const rows = list.data;
  const add = <AdminLinkButton to="/admin/media/new" variant="primary">Add an entry</AdminLinkButton>;

  return (
    <div className="jr-page">
      <PageHeader title="Media and podcast" actions={add} />
      {list.error && <Notice tone="error">{list.error}</Notice>}
      {list.loading && (
        <ul className="jr-grid" aria-busy="true" aria-label="Loading entries">
          {[0, 1, 2].map((i) => (
            <li key={i} className="jr-sk" />
          ))}
        </ul>
      )}
      {rows && rows.length === 0 && (
        <div className="jr-empty">
          <EmptyState title="Nothing listed yet" body="The press page shows its standing entries until the first one is added here." action={add} />
        </div>
      )}
      {rows && rows.length > 0 && (
        <>
          <div className="jr-tiles">
            {KINDS.map((k) => (
              <div key={k} className="jr-tile" data-tone={k === "press" ? "blue" : k === "podcast" ? "green" : undefined}>
                <span className="jr-tile__label">{KIND_LABEL[k]}s</span>
                <span className="jr-tile__fig">{rows.filter((m) => m.kind === k).length}</span>
              </div>
            ))}
            <div className="jr-tile">
              <span className="jr-tile__label">Total</span>
              <span className="jr-tile__fig">{rows.length}</span>
            </div>
          </div>
          <ul className="jr-grid" aria-label="Press and podcast entries">
            {rows.map((m, i) => (
              <li key={m.id} className="jr-card">
                <div className="jr-cover">
                  {m.thumbnail ? (
                    <img src={m.thumbnail} alt={m.thumbnail_alt || ""} loading="lazy" />
                  ) : (
                    <span className="jr-cover__mark" aria-hidden="true">{initials(m)}</span>
                  )}
                </div>
                <div className="jr-body">
                  <Link to={`/admin/media/${m.id}`} className="jr-title">
                    {m.title}
                  </Link>
                  <div className="jr-meta">
                    <span className="adm-pill adm-pill--off">{KIND_LABEL[m.kind] ?? m.kind}</span>
                    <span>{m.outlet || "No outlet"}</span>
                    <span>{m.published_on ? formatDate(m.published_on) : "Undated"}</span>
                  </div>
                </div>
                <div className="md-foot">
                  {m.link ? (
                    <a className="md-link" href={m.link} target="_blank" rel="noreferrer">
                      Open link<span className="sr-only"> for {m.title}</span>
                    </a>
                  ) : (
                    <span />
                  )}
                  <MoveButtons label={m.title} first={i === 0} last={i === rows.length - 1} disabled={moving} onUp={() => move(m.id, -1)} onDown={() => move(m.id, 1)} />
                </div>
              </li>
            ))}
          </ul>
          {rows.length > 1 && <p className="adm-muted">The site sorts by date first, so Up and Down only reorder entries that share a date.</p>}
        </>
      )}
    </div>
  );
}
