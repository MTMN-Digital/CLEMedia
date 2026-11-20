import { useState } from "react";
import { Link } from "react-router-dom";
import { type PostRow, formatDate, listRows, useLoad } from "@/lib/admin";
import { Segmented, PageHeader, Notice, AdminLinkButton, StatusPill, EmptyState } from "@/components/admin/kit";
import { type PostState, stateLabel, postState, STATE_TONE } from "./state";
import "./journal.css";

type Filter = "all" | PostState;

const EMPTY_TITLE: Record<Filter, string> = {
  all: "No posts yet",
  draft: "No drafts",
  scheduled: "Nothing scheduled",
  published: "Nothing published yet",
};

const DAY = 864e5;

/** Every post as a card, most recently worked on first, with its state and figures on top. */
export function PostList() {
  const [filter, setFilter] = useState<Filter>("all");
  const posts = useLoad(() => listRows("posts", { order: [{ column: "updated_at", ascending: false }] }), []);
  const strands = useLoad(() => listRows("categories", { order: [{ column: "sort_order" }, { column: "name" }] }), []);

  const strandName = (id: string | null) => strands.data?.find((c) => c.id === id)?.name ?? "No strand";
  const all = posts.data;
  const rows = all ? all.filter((p) => filter === "all" || postState(p) === filter) : null;
  const newPost = (
    <AdminLinkButton to="/admin/journal/new" variant="primary">
      New post
    </AdminLinkButton>
  );

  const now = Date.now();
  const by = (s: PostState) => (all ?? []).filter((p) => postState(p, now) === s);
  const published = by("published");
  const scheduled = by("scheduled");
  const drafts = by("draft");
  const lastPub = published.reduce<number | null>((m, p) => {
    const t = p.published_at ? new Date(p.published_at).getTime() : 0;
    return m === null || t > m ? t : m;
  }, null);
  const since = lastPub === null ? null : Math.max(0, Math.floor((now - lastPub) / DAY));
  const nextSched = scheduled.reduce<string | null>(
    (m, p) => (p.published_at && (m === null || new Date(p.published_at) < new Date(m)) ? p.published_at : m),
    null,
  );

  return (
    <div className="jr-page">
      <PageHeader
        title="Journal"
        actions={
          <>
            <AdminLinkButton to="/admin/journal/strands">Strands</AdminLinkButton>
            {newPost}
          </>
        }
      />

      {posts.error && <Notice tone="error">{posts.error}</Notice>}

      {all && all.length > 0 && (
        <>
          <div className="jr-tiles jr-tiles--5">
            <div className="jr-tile" data-tone="green">
              <span className="jr-tile__label">Published</span>
              <span className="jr-tile__fig">{published.length}</span>
            </div>
            <div className="jr-tile" data-tone="amber">
              <span className="jr-tile__label">Scheduled</span>
              <span className="jr-tile__fig">{scheduled.length}</span>
            </div>
            <div className="jr-tile">
              <span className="jr-tile__label">Drafts</span>
              <span className="jr-tile__fig">{drafts.length}</span>
            </div>
            <div className="jr-tile" data-tone="blue">
              <span className="jr-tile__label">Since last post</span>
              <span className="jr-tile__fig">
                {since === null ? "None" : since}
                {since !== null && <small>{since === 1 ? "day" : "days"}</small>}
              </span>
            </div>
            <div className="jr-tile">
              <span className="jr-tile__label">Next scheduled</span>
              <span className="jr-tile__fig" style={{ fontSize: nextSched ? 20 : undefined }}>
                {nextSched ? formatDate(nextSched) : "None"}
              </span>
            </div>
          </div>
          <Segmented<Filter>
            label="Show"
            hideLabel
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "draft", label: "Drafts" },
              { value: "scheduled", label: "Scheduled" },
              { value: "published", label: "Published" },
            ]}
          />
        </>
      )}

      {posts.loading && (
        <ul className="jr-grid" aria-busy="true" aria-label="Loading posts">
          {[0, 1, 2].map((i) => (
            <li key={i} className="jr-sk" />
          ))}
        </ul>
      )}

      {rows && rows.length === 0 && (
        <div className="jr-empty">
          {filter === "all" ? (
            <EmptyState title={EMPTY_TITLE.all} body="Write the first piece. It stays a draft until you publish it." action={newPost} />
          ) : (
            <EmptyState title={EMPTY_TITLE[filter]} body="Choose All to see every post." />
          )}
        </div>
      )}

      {rows && rows.length > 0 && (
        <ul className="jr-grid" aria-label="Journal posts">
          {rows.map((p) => (
            <PostCard key={p.id} p={p} strand={strandName(p.category_id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PostCard({ p, strand }: { p: PostRow; strand: string }) {
  const state = postState(p);
  const initial = (p.title.trim()[0] ?? "J").toUpperCase();
  return (
    <li className="jr-card" data-dim={state === "draft" ? "" : undefined}>
      <div className="jr-cover">
        {p.hero_image ? <img src={p.hero_image} alt={p.hero_alt || ""} loading="lazy" /> : <span className="jr-cover__mark" aria-hidden="true">{initial}</span>}
      </div>
      <div className="jr-body">
        <Link to={`/admin/journal/${p.id}`} className="jr-title">
          {p.title || "Untitled post"}
        </Link>
        <div className="jr-meta">
          <StatusPill tone={STATE_TONE[state]}>{stateLabel(p)}</StatusPill>
          <span>{strand}</span>
          {p.published_at && state === "published" && <span>{formatDate(p.published_at)}</span>}
        </div>
      </div>
    </li>
  );
}
