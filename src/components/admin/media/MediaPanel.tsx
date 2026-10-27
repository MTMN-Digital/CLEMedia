import { useState } from "react";
import { useNavigate, Routes, Link, Route } from "react-router-dom";
import { useLoad, type MediaRow, reorderRows, formatDate, listRows } from "@/lib/admin";
import { useToast, PageHeader, DataTable, moveId, type Column, AdminLinkButton, MoveButtons } from "@/components/admin/kit";
import { MediaForm, KIND_LABEL } from "./MediaForm";

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

function MediaList() {
  const navigate = useNavigate();
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
  const columns: Column<MediaRow>[] = [
    {
      key: "title",
      label: "Title",
      primary: true,
      render: (m) => (
        <Link to={`/admin/media/${m.id}`} className="font-semibold text-ink underline-offset-2 hover:underline">
          {m.title}
        </Link>
      ),
    },
    { key: "outlet", label: "Outlet", render: (m) => m.outlet || <span className="adm-muted">Not given</span> },
    { key: "kind", label: "Type", render: (m) => KIND_LABEL[m.kind] ?? m.kind },
    { key: "when", label: "Date", numeric: true, render: (m) => (m.published_on ? formatDate(m.published_on) : "Undated") },
    {
      key: "order",
      label: "Running order",
      render: (m) => {
        const i = rows ? rows.findIndex((x) => x.id === m.id) : 0;
        return <MoveButtons label={m.title} first={i === 0} last={!rows || i === rows.length - 1} disabled={moving} onUp={() => move(m.id, -1)} onDown={() => move(m.id, 1)} />;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Media and podcast"
        intro="Every press article, podcast, interview and video the company has appeared in. The press page lists them newest first."
        actions={<AdminLinkButton to="/admin/media/new" variant="primary">Add an entry</AdminLinkButton>}
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(m) => m.id}
        onRowClick={(m) => navigate(`/admin/media/${m.id}`)}
        loading={list.loading}
        error={list.error}
        caption="Press and podcast entries"
        empty={{
          title: "Nothing listed yet",
          body: "The press page shows its standing entries until the first one is added here.",
          action: <AdminLinkButton to="/admin/media/new" variant="primary">Add an entry</AdminLinkButton>,
        }}
      />
      {rows && rows.length > 1 && (
        <p className="adm-muted mt-4">The site sorts by date first, so moving an entry up or down only changes the order of entries that share a date.</p>
      )}
    </>
  );
}
