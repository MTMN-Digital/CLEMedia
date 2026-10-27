import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDateTime, listRows, useLoad } from "@/lib/admin";
import { StatusPill, PageHeader, Segmented, AdminLinkButton, DataTable } from "@/components/admin/kit";
import { type PostState, stateLabel, postState, STATE_TONE } from "./state";

type Filter = "all" | PostState;

const EMPTY_TITLE: Record<Filter, string> = {
  all: "No posts yet",
  draft: "No drafts",
  scheduled: "Nothing scheduled",
  published: "Nothing published yet",
};

/** Every post, most recently worked on first, with its state in words. */
export function PostList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const posts = useLoad(() => listRows("posts", { order: [{ column: "updated_at", ascending: false }] }), []);
  const strands = useLoad(() => listRows("categories", { order: [{ column: "sort_order" }, { column: "name" }] }), []);

  const strandName = (id: string | null) => strands.data?.find((c) => c.id === id)?.name ?? "No strand";
  const rows = posts.data ? posts.data.filter((p) => filter === "all" || postState(p) === filter) : null;
  const newPost = (
    <AdminLinkButton to="/admin/journal/new" variant="primary">
      New post
    </AdminLinkButton>
  );

  return (
    <>
      <PageHeader
        title="Journal"
        intro="A draft stays private. A published piece with a date still to come goes live on the site by itself at that time."
        actions={
          <>
            <AdminLinkButton to="/admin/journal/strands">Strands</AdminLinkButton>
            {newPost}
          </>
        }
      />
      {posts.data && posts.data.length > 0 && (
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
      )}
      <DataTable
        rows={rows}
        loading={posts.loading}
        error={posts.error}
        rowKey={(p) => p.id}
        onRowClick={(p) => navigate(`/admin/journal/${p.id}`)}
        caption="Journal posts"
        columns={[
          {
            key: "title",
            label: "Title",
            primary: true,
            render: (p) => (
              <Link to={`/admin/journal/${p.id}`} className="adm-linkbtn">
                {p.title}
              </Link>
            ),
          },
          { key: "state", label: "Status", render: (p) => <StatusPill tone={STATE_TONE[postState(p)]}>{stateLabel(p)}</StatusPill> },
          { key: "strand", label: "Strand", render: (p) => strandName(p.category_id) },
          { key: "date", label: "Date", numeric: true, hideOnPhone: true, render: (p) => (p.published_at ? formatDateTime(p.published_at) : "") },
        ]}
        empty={
          filter === "all"
            ? { title: EMPTY_TITLE.all, body: "Write the first piece. It stays a draft until you publish it.", action: newPost }
            : { title: EMPTY_TITLE[filter], body: "Choose All to see every post." }
        }
      />
    </>
  );
}
