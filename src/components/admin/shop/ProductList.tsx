import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type ProductRow, listRows, reorderRows, useLoad, formatEuro } from "@/lib/admin";
import {
  StatusPill,
  MoveButtons,
  useToast,
  DataTable,
  PageHeader,
  AdminLinkButton,
  moveId,
} from "@/components/admin/kit";

/* The shelf as the console sees it: every product, published or hidden, in
   the running order the public shelf uses. Up and down write sort_order for
   the whole list through reorderRows, so the order on the site is the order
   on this screen. */
export function ProductList() {
  const navigate = useNavigate();
  const toast = useToast();
  const load = useLoad(
    () => listRows("products", { order: [{ column: "sort_order" }, { column: "created_at" }] }),
    [],
  );
  /* A local copy, so a move shows at once and is put back if the save fails. */
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    if (load.data) setRows(load.data);
  }, [load.data]);

  async function move(id: string, dir: -1 | 1) {
    if (!rows) return;
    const ids = moveId(
      rows.map((r) => r.id),
      id,
      dir,
    );
    const byId = new Map(rows.map((r) => [r.id, r]));
    setRows(ids.map((i) => byId.get(i) as ProductRow));
    setMoving(true);
    const r = await reorderRows("products", ids);
    setMoving(false);
    if (r.error !== null) {
      toast(r.error, "error");
      load.reload();
      return;
    }
    toast("Running order saved");
  }

  return (
    <>
      <PageHeader
        title="Shop"
        intro="Everything on the shelf, in the order the shop shows it. A hidden product is kept but cannot be bought."
        actions={
          <>
            <AdminLinkButton to="/admin/shop/orders">Orders</AdminLinkButton>
            <AdminLinkButton to="/admin/shop/new" variant="primary">
              Add a product
            </AdminLinkButton>
          </>
        }
      />
      <DataTable
        rows={rows}
        loading={load.loading}
        error={load.error}
        rowKey={(p) => p.id}
        onRowClick={(p) => navigate(`/admin/shop/${p.id}`)}
        caption="Products, in the order the shop shows them"
        empty={{
          title: "Nothing on the shelf yet",
          body: "Add the first product and it appears on the shop as soon as it is published.",
          action: (
            <AdminLinkButton to="/admin/shop/new" variant="primary">
              Add a product
            </AdminLinkButton>
          ),
        }}
        columns={[
          {
            key: "title",
            label: "Product",
            primary: true,
            render: (p) => (
              <Link to={`/admin/shop/${p.id}`} className="adm-linkbtn">
                {p.title}
              </Link>
            ),
          },
          { key: "price", label: "Price", numeric: true, render: (p) => formatEuro(p.price_cents) },
          {
            key: "state",
            label: "On the shop",
            render: (p) =>
              p.active ? (
                <StatusPill tone="ok">Published</StatusPill>
              ) : (
                <StatusPill tone="off">Hidden</StatusPill>
              ),
          },
          {
            key: "file",
            label: "File",
            hideOnPhone: true,
            render: (p) => (p.file_path ? "Uploaded" : <StatusPill tone="warn">No file yet</StatusPill>),
          },
          {
            key: "order",
            label: "Running order",
            render: (p) => (
              <MoveButtons
                label={p.title}
                first={rows?.[0]?.id === p.id}
                last={rows?.[rows.length - 1]?.id === p.id}
                disabled={moving}
                onUp={() => void move(p.id, -1)}
                onDown={() => void move(p.id, 1)}
              />
            ),
          },
        ]}
      />
    </>
  );
}
