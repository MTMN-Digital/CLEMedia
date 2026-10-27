import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { reorderRows, deleteRow, insertRow, type PersonRow, listRows, useLoad } from "@/lib/admin";
import {
  PageHeader,
  AdminButton,
  MoveButtons,
  useToast,
  EmptyState,
  StatusPill,
  type Column,
  DataTable,
  AdminLinkButton,
  moveId,
} from "@/components/admin/kit";
import { invalidateTeam } from "@/components/team/useTeam";
import { bundledRows, type PersonType } from "./shared";

/* The people, in the order the site shows them: the core team first, then
   the advisers, each group in its own running order. Up and down buttons
   reorder within a group; opening a row edits the person. */

export function PeopleList() {
  const navigate = useNavigate();
  const toast = useToast();
  const people = useLoad(
    () => listRows("people", { order: [{ column: "type", ascending: false }, { column: "sort_order" }, { column: "name" }] }),
    [],
  );
  const [busy, setBusy] = useState(false);

  const rows = people.data ?? [];
  const team = rows.filter((p) => p.type === "team");
  const advisors = rows.filter((p) => p.type === "advisor");

  async function move(group: PersonRow[], id: string, dir: -1 | 1) {
    const ids = moveId(
      group.map((p) => p.id),
      id,
      dir,
    );
    setBusy(true);
    const r = await reorderRows("people", ids);
    setBusy(false);
    if (r.error !== null) return toast(r.error, "error");
    invalidateTeam();
    people.reload();
    toast("Order saved");
  }

  async function importTeam() {
    setBusy(true);
    const ids: string[] = [];
    let problem: string | null = null;
    for (const row of bundledRows()) {
      const r = await insertRow("people", row);
      if (r.error !== null) {
        problem = r.error;
        break;
      }
      ids.push(r.data.id);
    }
    /* All or nothing: a half-imported team would hide the import button and
       replace the site's full team with part of it. */
    if (problem) for (const id of ids) await deleteRow("people", id);
    const added = ids.length;
    setBusy(false);
    invalidateTeam();
    people.reload();
    if (problem) return toast(problem, "error");
    toast(`Imported ${added} ${added === 1 ? "person" : "people"}`);
  }

  const columns = (group: PersonRow[]): Column<PersonRow>[] => [
    {
      key: "name",
      label: "Name",
      primary: true,
      render: (p) => (
        <Link to={`/admin/people/${p.id}`} className="adm-linkbtn">
          {p.name}
        </Link>
      ),
    },
    { key: "role", label: "Role", render: (p) => p.role },
    {
      key: "photo",
      label: "Photo",
      hideOnPhone: true,
      render: (p) => (p.photo ? "Uploaded" : p.asset_key ? "From the site" : "None"),
    },
    {
      key: "visible",
      label: "On the site",
      render: (p) => (p.visible ? <StatusPill tone="ok">Shown</StatusPill> : <StatusPill tone="off">Hidden</StatusPill>),
    },
    {
      key: "order",
      label: "Order",
      render: (p) => {
        const i = group.findIndex((g) => g.id === p.id);
        return (
          <MoveButtons
            label={p.name}
            first={i === 0}
            last={i === group.length - 1}
            disabled={busy}
            onUp={() => move(group, p.id, -1)}
            onDown={() => move(group, p.id, 1)}
          />
        );
      },
    },
  ];

  const addButton = (type: PersonType) => (
    <AdminLinkButton to={`/admin/people/new?type=${type}`} size="sm">
      {type === "team" ? "Add a team member" : "Add an adviser"}
    </AdminLinkButton>
  );

  const nobody = !people.loading && !people.error && rows.length === 0;

  return (
    <>
      <PageHeader
        title="Team and advisers"
        intro="Who appears on the Team page, and in what order. The first paragraph of each biography is always shown; the rest opens under a More button."
        actions={<AdminLinkButton to="/admin/people/new" variant="primary">Add a person</AdminLinkButton>}
      />

      {nobody ? (
        <EmptyState
          title="No one is listed yet"
          body="The site is still showing the team written into it. Import that list to start editing it here, or add people one at a time."
          action={
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <AdminButton onClick={importTeam} busy={busy} busyLabel="Importing">
                Import the current team
              </AdminButton>
              <AdminLinkButton to="/admin/people/new">Add a person</AdminLinkButton>
            </div>
          }
        />
      ) : (
        <div className="adm-stack">
          <section>
            <h2 className="adm-h2">Core team</h2>
            <DataTable
              rows={people.data ? team : null}
              columns={columns(team)}
              rowKey={(p) => p.id}
              onRowClick={(p) => navigate(`/admin/people/${p.id}`)}
              loading={people.loading}
              error={people.error}
              empty={{ title: "No core team members yet", action: <div className="mt-3">{addButton("team")}</div> }}
              caption="Core team, in running order"
            />
          </section>
          <section>
            <h2 className="adm-h2">Advisers</h2>
            <DataTable
              rows={people.data ? advisors : null}
              columns={columns(advisors)}
              rowKey={(p) => p.id}
              onRowClick={(p) => navigate(`/admin/people/${p.id}`)}
              loading={people.loading}
              error={people.error}
              empty={{ title: "No advisers yet", action: <div className="mt-3">{addButton("advisor")}</div> }}
              caption="Advisers, in running order"
            />
          </section>
        </div>
      )}
    </>
  );
}
