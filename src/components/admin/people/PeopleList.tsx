import { useState } from "react";
import { Link } from "react-router-dom";
import { reorderRows, deleteRow, insertRow, type PersonRow, listRows, useLoad } from "@/lib/admin";
import {
  useToast,
  AdminLinkButton,
  PageHeader,
  MoveButtons,
  Tag,
  Avatar,
  moveId,
  Notice,
  AdminButton,
} from "@/components/admin/kit";
import { Figure } from "@/components/Figure";
import { ASSETS, type AssetKey } from "@/lib/brand";
import { TEAM, ADVISORS } from "@/components/team/people";
import "./team.css";
import { invalidateTeam } from "@/components/team/useTeam";
import { bundledRows, type PersonType } from "./shared";

/* The people, in the order the site shows them: the core team first, then
   the advisers, then the experts, each group in its own running order. Each
   person is a face card; opening one edits the person, and up and down
   buttons reorder within a group. */

interface Face {
  visible: boolean;
  website: string | null;
  name: string;
  id: string | null;
  photo: string | null;
  asset: AssetKey | null;
  alt: string;
  role: string;
}

function fromRow(p: PersonRow): Face {
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    photo: p.photo,
    alt: p.photo_alt || p.name,
    asset: p.asset_key && p.asset_key in ASSETS ? (p.asset_key as AssetKey) : null,
    visible: p.visible,
    website: p.website ?? null,
  };
}

const fromBundled = (m: (typeof TEAM)[number]): Face => ({
  id: null,
  name: m.name,
  role: m.role,
  photo: null,
  alt: m.name,
  asset: m.asset ?? null,
  visible: true,
  website: null,
});

function Picture({ f }: { f: Face }) {
  if (f.photo) return <img src={f.photo} alt={f.alt} loading="lazy" />;
  if (f.asset) return <Figure asset={f.asset} fill rounded="rounded-none" sizes="240px" position="center top" />;
  return <Avatar name={f.name} email={null} size={72} />;
}

function Faces({
  faces,
  label,
  busy,
  onMove,
}: {
  onMove?: (id: string, dir: -1 | 1) => void;
  busy?: boolean;
  label: string;
  faces: Face[];
}) {
  return (
    <ul className="team-grid" aria-label={label}>
      {faces.map((f, i) => (
        <li key={f.id ?? f.name} className="team-face" data-hidden={f.id && !f.visible ? "" : undefined} data-muted={f.id ? undefined : ""}>
          <div className="team-face__pic">
            <Picture f={f} />
            {f.id && (
              <span className="team-face__tag">
                <Tag tone={f.visible ? "ok" : "off"}>{f.visible ? "Shown" : "Hidden"}</Tag>
              </span>
            )}
          </div>
          <div className="team-face__body">
            {f.id ? (
              <Link to={`/admin/people/${f.id}`} className="team-face__name">
                {f.name}
              </Link>
            ) : (
              <span className="team-face__name">{f.name}</span>
            )}
            <span className="team-face__role">{f.role}</span>
          </div>
          {f.id && (
            <div className="team-face__foot">
              {f.website ? (
                <a href={f.website} target="_blank" rel="noopener noreferrer" className="team-face__web">
                  Website
                </a>
              ) : (
                <span />
              )}
              {onMove && (
                <MoveButtons
                  label={f.name}
                  first={i === 0}
                  last={i === faces.length - 1}
                  disabled={busy}
                  onUp={() => onMove(f.id as string, -1)}
                  onDown={() => onMove(f.id as string, 1)}
                />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function PeopleList() {
  const toast = useToast();
  const people = useLoad(
    () => listRows("people", { order: [{ column: "type", ascending: false }, { column: "sort_order" }, { column: "name" }] }),
    [],
  );
  const [busy, setBusy] = useState(false);

  const rows = people.data ?? [];
  const team = rows.filter((p) => p.type === "team");
  const advisors = rows.filter((p) => p.type === "advisor");
  const experts = rows.filter((p) => p.type === "expert");

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

  const addButton = (type: PersonType) => (
    <AdminLinkButton to={`/admin/people/new?type=${type}`} size="sm">
      {type === "team" ? "Add a team member" : type === "expert" ? "Add an expert" : "Add an adviser"}
    </AdminLinkButton>
  );

  /* Experts are added on their own, so "nobody" means no team or advisers:
     the site still shows the bundled team until it is imported. */
  const nobody = !people.loading && !people.error && team.length + advisors.length === 0;

  const shown = rows.filter((p) => p.visible).length;
  const hidden = rows.length - shown;

  const group = (title: string, label: string, list: PersonRow[], type: PersonType) => (
    <section className="team-card">
      <div className="team-ch">
        <h2>{title}</h2>
        <span className="team-ch__n">{list.length}</span>
        <span className="team-ch__act">{addButton(type)}</span>
      </div>
      {list.length > 0 ? (
        <Faces faces={list.map(fromRow)} label={label} busy={busy} onMove={(id, dir) => move(list, id, dir)} />
      ) : (
        <p className="team-empty">{`No ${title.toLowerCase()} yet`}</p>
      )}
    </section>
  );

  const preview = (title: string, list: typeof TEAM) => (
    <section className="team-card">
      <div className="team-ch">
        <h2>{title}</h2>
        <span className="team-ch__n">{list.length}</span>
      </div>
      <Faces faces={list.map(fromBundled)} label={`${title}, built-in list`} />
    </section>
  );

  return (
    <div className="team">
      <PageHeader
        title="Team"
        actions={<AdminLinkButton to="/admin/people/new" variant="primary">Add a person</AdminLinkButton>}
      />

      <div className="team-stack">
        <div className="team-tiles">
          <div className="team-tile" data-tone="green">
            <span className="team-tile__label">Shown</span>
            <span className="team-tile__fig">{people.data ? shown : "-"}</span>
          </div>
          <div className="team-tile">
            <span className="team-tile__label">Hidden</span>
            <span className="team-tile__fig">{people.data ? hidden : "-"}</span>
          </div>
          <div className="team-tile" data-tone="blue">
            <span className="team-tile__label">Experts</span>
            <span className="team-tile__fig">{people.data ? experts.length : "-"}</span>
          </div>
        </div>

        {people.error ? (
          <Notice tone="error">{people.error}</Notice>
        ) : people.loading ? (
          <div className="team-card" role="status" aria-label="Loading the team">
            <ul className="team-grid">
              {[0, 1, 2, 3].map((n) => (
                <li key={n} className="team-sk" />
              ))}
            </ul>
          </div>
        ) : nobody ? (
          <>
            <div className="team-banner">
              <p>The site shows the built-in team below until you import it. Then you can edit it here.</p>
              <div className="team-banner__act">
                <AdminButton onClick={importTeam} busy={busy} busyLabel="Importing">
                  Import the current team
                </AdminButton>
              </div>
            </div>
            {preview("Team", TEAM)}
            {preview("Advisers", ADVISORS)}
            {group("Experts", "Experts, in running order", experts, "expert")}
          </>
        ) : (
          <>
            {group("Team", "Team, in running order", team, "team")}
            {group("Advisers", "Advisers, in running order", advisors, "advisor")}
            {group("Experts", "Experts, in running order", experts, "expert")}
          </>
        )}
      </div>
    </div>
  );
}
