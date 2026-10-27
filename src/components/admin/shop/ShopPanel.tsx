import { Routes, Route } from "react-router-dom";
import { ProductList } from "./ProductList";
import { ProductEdit } from "./ProductEdit";
import { Orders } from "./Orders";

/* ============================================================================
   The shop section of the console, mounted by the shell at /admin/shop/*.

   Three views. The products list is the index; one product is edited at
   /admin/shop/:id (or made at /admin/shop/new); the orders Stripe has
   written sit at /admin/shop/orders, read only apart from "Give a fresh
   link". Paths here are relative, links inside the views are absolute.
   ========================================================================== */
export function ShopPanel() {
  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path="new" element={<ProductEdit />} />
      <Route path="orders" element={<Orders />} />
      <Route path=":id" element={<ProductEdit />} />
    </Routes>
  );
}
