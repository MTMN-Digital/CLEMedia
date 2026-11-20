import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type ProductRow, listRows, reorderRows, useLoad, formatEuro } from "@/lib/admin";
import { Tiles } from "./Tiles";
import "./shop.css";
import {
  EmptyState,
  useToast,
  Notice,
  moveId,
  MoveButtons,
  PageHeader,
  AdminLinkButton,
} from "@/components/admin/kit";

/* The shelf as the console sees it: every product, published or hidden, in
   the running order the public shelf uses. Up and down write sort_order for
   the whole list through reorderRows, so the order on the site is the order
   on this screen. */
export function ProductList() {
  const toast = useToast();
  const load = useLoad(
    () => listRows("products", { order: [{ column: "sort_order" }, { column: "created_at" }] }),
    [],
  );
  const sales = useLoad(() => listRows("orders", { columns: "id, product_id, amount_cents, created_at" }), []);
  const stats = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const per = new Map<string, { cents: number; n: number }>();
    let all = 0;
    let month = 0;
    let monthN = 0;
    for (const o of sales.data ?? []) {
      const c = o.amount_cents ?? 0;
      all += c;
      if (new Date(o.created_at) >= monthStart) {
        month += c;
        monthN += 1;
      }
      const cur = per.get(o.product_id) ?? { n: 0, cents: 0 };
      per.set(o.product_id, { n: cur.n + 1, cents: cur.cents + c });
    }
    return { per, all, month, monthN };
  }, [sales.data]);
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

  const onSale = (rows ?? []).filter((p) => p.active).length;
  const hidden = (rows ?? []).length - onSale;

  return (
    <div className="shop">
      <PageHeader
        title="Shop"
        actions={
          <>
            <AdminLinkButton to="/admin/shop/orders">Orders</AdminLinkButton>
            <AdminLinkButton to="/admin/shop/new" variant="primary">
              Add a product
            </AdminLinkButton>
          </>
        }
      />

      {load.error !== null && <Notice tone="error">{load.error}</Notice>}
      {sales.error !== null && <Notice tone="error">We could not read the sales figures. {sales.error}</Notice>}

      {rows && (
        <Tiles
          label="Shop figures"
          items={[
            { label: "This month", value: formatEuro(stats.month) || "\u20ac0.00", meta: `${stats.monthN} ${stats.monthN === 1 ? "order" : "orders"}`, tone: "green" },
            { label: "All time", value: formatEuro(stats.all) || "\u20ac0.00", meta: `${sales.data?.length ?? 0} orders`, tone: "blue" },
            { label: "On sale", value: onSale, meta: "products", tone: "plain" },
            { label: "Hidden", value: hidden, meta: "products", tone: hidden ? "amber" : "plain" },
          ]}
        />
      )}

      {load.loading && !rows && <p className="adm-muted" role="status">Loading the shelf</p>}

      {rows && rows.length === 0 && (
        <EmptyState
          title="Nothing on the shelf yet"
          body="Add the first product and it appears on the shop as soon as it is published."
          action={
            <AdminLinkButton to="/admin/shop/new" variant="primary">
              Add a product
            </AdminLinkButton>
          }
        />
      )}

      {rows && rows.length > 0 && (
        <ul className="shop-grid" aria-label="Products, in the order the shop shows them">
          {rows.map((p, i) => {
            const s = stats.per.get(p.id) ?? { n: 0, cents: 0 };
            return (
              <li key={p.id}>
                <article className="shop-card" data-off={p.active ? undefined : ""}>
                  <Link to={`/admin/shop/${p.id}`} className="shop-card__pic" aria-label={`Edit ${p.title}`}>
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.thumbnail_alt ?? ""} loading="lazy" />
                    ) : (
                      <span className="shop-card__blank">{p.title}</span>
                    )}
                    <span className="shop-card__state">
                      {p.active ? <span className="shop-pill">On sale</span> : <span className="shop-pill" data-off="">Hidden</span>}
                    </span>
                  </Link>
                  <div className="shop-card__body">
                    <div className="shop-card__top">
                      <Link to={`/admin/shop/${p.id}`} className="shop-card__title">
                        {p.title}
                      </Link>
                      <span className="shop-card__price">{formatEuro(p.price_cents)}</span>
                    </div>
                    <div className="shop-card__figs">
                      <div>
                        <b>{s.n}</b>
                        <span>{s.n === 1 ? "sale" : "sales"}</span>
                      </div>
                      <div>
                        <b>{formatEuro(s.cents) || "\u20ac0.00"}</b>
                        <span>revenue</span>
                      </div>
                    </div>
                    <div className="shop-card__foot">
                      <AdminLinkButton to={`/admin/shop/${p.id}`}>Edit</AdminLinkButton>
                      {!p.file_path && <span className="shop-pill" data-warn="">No file yet</span>}
                      <MoveButtons
                        label={p.title}
                        first={i === 0}
                        last={i === rows.length - 1}
                        disabled={moving}
                        onUp={() => void move(p.id, -1)}
                        onDown={() => void move(p.id, 1)}
                      />
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
