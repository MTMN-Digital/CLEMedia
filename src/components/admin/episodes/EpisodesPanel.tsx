import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { reorderRows, useLoad, type EpisodeRow, listRows } from "@/lib/admin";
import { moveId, PageHeader, Notice, AdminLinkButton, Tag, EmptyState, useToast, MoveButtons } from "@/components/admin/kit";
import { ASSETS, type AssetKey } from "@/lib/brand";
import { Figure } from "@/components/Figure";
import { invalidateEpisodes } from "@/lib/useEpisodes";
import { EpisodeForm } from "./EpisodeForm";
import "./episodes.css";

/* Episodes: the `episodes` table (0010). The site lists them in this running
   order on the home page, /app and the PupsPlayer walkthrough. */

export function EpisodesPanel() {
  return (
    <Routes>
      <Route index element={<EpisodeList />} />
      <Route path="new" element={<EpisodeForm />} />
      <Route path=":id" element={<EpisodeForm />} />
    </Routes>
  );
}

const num = (n: number) => String(n).padStart(3, "0");

function Picture({ e }: { e: EpisodeRow }) {
  if (e.thumbnail) {
    return <img src={e.thumbnail} alt={e.thumbnail_alt || `${e.title} thumbnail`} width={640} height={360} loading="lazy" decoding="async" />;
  }
  if (e.asset_key && e.asset_key in ASSETS) {
    return <Figure asset={e.asset_key as AssetKey} rounded="" fill sizes="(min-width: 960px) 25vw, (min-width: 600px) 50vw, 100vw" />;
  }
  return <span className="ep-pic__blank" role="img" aria-label={`${e.title}, no picture yet`}>{num(e.number)}</span>;
}

function EpisodeList() {
  const toast = useToast();
  const [moving, setMoving] = useState(false);
  const list = useLoad(() => listRows("episodes", { order: [{ column: "sort_order" }, { column: "number" }] }), []);

  async function move(id: string, dir: -1 | 1) {
    if (!list.data) return;
    setMoving(true);
    const r = await reorderRows("episodes", moveId(list.data.map((e) => e.id), id, dir));
    setMoving(false);
    if (r.error !== null) return toast(r.error, "error");
    invalidateEpisodes();
    toast("Moved");
    list.reload();
  }

  const rows = list.data;
  const released = rows ? rows.filter((e) => e.visible && e.youtube_url).length : 0;
  const soon = rows ? rows.filter((e) => e.visible && !e.youtube_url).length : 0;
  const hidden = rows ? rows.filter((e) => !e.visible).length : 0;
  const add = <AdminLinkButton to="/admin/episodes/new" variant="primary">Add an episode</AdminLinkButton>;

  return (
    <div className="ep">
      <PageHeader title="Episodes" actions={add} />
      {list.error ? (
        <Notice tone="error">{list.error}</Notice>
      ) : list.loading && !rows ? (
        <ul className="ep-grid" aria-busy="true" aria-label="Loading episodes">
          {[0, 1, 2].map((i) => (
            <li key={i}><span className="ep-sk" /></li>
          ))}
        </ul>
      ) : !rows || rows.length === 0 ? (
        <EmptyState title="No episodes yet" body="The site shows its built-in list of six until the first one is added here." action={add} />
      ) : (
        <>
          <div className="ep-tiles" role="group" aria-label="Episode counts">
            <div className="ep-tile" data-tone="green"><span className="ep-tile__label">Released</span><span className="ep-tile__fig">{released}</span></div>
            <div className="ep-tile" data-tone="amber"><span className="ep-tile__label">Coming soon</span><span className="ep-tile__fig">{soon}</span></div>
            <div className="ep-tile"><span className="ep-tile__label">Hidden</span><span className="ep-tile__fig">{hidden}</span></div>
          </div>
          <ul className="ep-grid">
            {rows.map((e, i) => (
              <li key={e.id}>
                <article className="ep-card" data-hidden={e.visible ? undefined : ""}>
                  <Link to={`/admin/episodes/${e.id}`} className="ep-pic" aria-label={`Edit ${e.title}`}>
                    <Picture e={e} />
                    <span className="ep-badge">EP {num(e.number)}</span>
                  </Link>
                  <div className="ep-body">
                    <Link to={`/admin/episodes/${e.id}`} className="ep-card__title">{e.title}</Link>
                    <div className="ep-tags">
                      {!e.visible && <Tag tone="off">Hidden</Tag>}
                      {e.visible && !e.youtube_url && <Tag tone="warn">Coming soon</Tag>}
                      {e.visible && e.youtube_url && <Tag tone="ok">Released</Tag>}
                      {e.runtime && <Tag>{e.runtime}</Tag>}
                    </div>
                    <div className="ep-acts">
                      <Link to={`/admin/episodes/${e.id}`} className="ep-btn">Edit</Link>
                      {e.youtube_url && (
                        <a href={e.youtube_url} target="_blank" rel="noopener noreferrer" className="ep-btn ep-btn--go" aria-label={`Watch ${e.title} on YouTube (opens in a new tab)`}>
                          Watch on YouTube
                        </a>
                      )}
                      <span className="ep-move">
                        <MoveButtons label={e.title} first={i === 0} last={i === rows.length - 1} disabled={moving} onUp={() => move(e.id, -1)} onDown={() => move(e.id, 1)} />
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
