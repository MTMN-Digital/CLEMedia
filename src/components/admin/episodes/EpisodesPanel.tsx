import { useState } from "react";
import { useNavigate, Routes, Link, Route } from "react-router-dom";
import { reorderRows, useLoad, type EpisodeRow, listRows } from "@/lib/admin";
import { useToast, moveId, StatusPill, type Column, MoveButtons, AdminLinkButton, PageHeader, DataTable } from "@/components/admin/kit";
import { invalidateEpisodes } from "@/lib/useEpisodes";
import { EpisodeForm } from "./EpisodeForm";

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

function EpisodeList() {
  const navigate = useNavigate();
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
  const columns: Column<EpisodeRow>[] = [
    { key: "number", label: "Episode", numeric: true, render: (e) => num(e.number) },
    {
      key: "title",
      label: "Title",
      primary: true,
      render: (e) => (
        <Link to={`/admin/episodes/${e.id}`} className="font-semibold text-ink underline-offset-2 hover:underline">
          {e.title}
        </Link>
      ),
    },
    {
      key: "status",
      label: "On the site",
      render: (e) =>
        !e.visible ? <StatusPill tone="off">Hidden</StatusPill> : e.youtube_url ? <StatusPill tone="ok">Watch on YouTube</StatusPill> : <StatusPill tone="warn">Coming soon</StatusPill>,
    },
    {
      key: "order",
      label: "Running order",
      render: (e) => {
        const i = rows ? rows.findIndex((x) => x.id === e.id) : 0;
        return <MoveButtons label={e.title} first={i === 0} last={!rows || i === rows.length - 1} disabled={moving} onUp={() => move(e.id, -1)} onDown={() => move(e.id, 1)} />;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Episodes"
        intro="The episodes shown on the home page and the app page. An episode with a YouTube link shows as Watch on YouTube; without one it shows as Coming soon."
        actions={<AdminLinkButton to="/admin/episodes/new" variant="primary">Add an episode</AdminLinkButton>}
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(e) => e.id}
        onRowClick={(e) => navigate(`/admin/episodes/${e.id}`)}
        loading={list.loading}
        error={list.error}
        caption="Episodes"
        empty={{
          title: "No episodes yet",
          body: "The site shows its built-in list of six until the first one is added here.",
          action: <AdminLinkButton to="/admin/episodes/new" variant="primary">Add an episode</AdminLinkButton>,
        }}
      />
    </>
  );
}
