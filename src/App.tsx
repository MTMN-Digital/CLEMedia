import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

import Home from "@/pages/Home";
import Story from "@/pages/Story";
import Team from "@/pages/Team";
import EthicalAi from "@/pages/EthicalAi";
import Journal from "@/pages/Journal";
import JournalPost from "@/pages/JournalPost";
import AppPage from "@/pages/AppPage";
import Media from "@/pages/Media";
import Shop from "@/pages/Shop";
import ShopProduct from "@/pages/ShopProduct";
import Contact from "@/pages/Contact";
import Download from "@/pages/Download";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import PreviewA from "@/pages/preview/PreviewA";
import PreviewB from "@/pages/preview/PreviewB";
import PreviewC from "@/pages/preview/PreviewC";
// Admin is lazy, it pulls in the Supabase client, which the public site
// should never have to download.
const Admin = lazy(() => import("@/pages/admin/Admin"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="story" element={<Story />} />
        <Route path="team" element={<Team />} />
        <Route path="ethical-ai" element={<EthicalAi />} />
        <Route path="journal" element={<Journal />} />
        <Route path="journal/:slug" element={<JournalPost />} />
        <Route path="app" element={<AppPage />} />
        <Route path="media" element={<Media />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:slug" element={<ShopProduct />} />
        <Route path="contact" element={<Contact />} />
        <Route path="download/:token" element={<Download />} />
        <Route path="privacy" element={<Legal doc="privacy" />} />
        <Route path="terms" element={<Legal doc="terms" />} />
        <Route path="cookies" element={<Legal doc="cookies" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Design directions for client review, noindex, outside the main shell */}
      <Route path="preview/a" element={<PreviewA />} />
      <Route path="preview/b" element={<PreviewB />} />
      <Route path="preview/c" element={<PreviewC />} />

      <Route
        path="admin/*"
        element={
          <Suspense fallback={<p className="p-8 font-body text-muted">Loading…</p>}>
            <Admin />
          </Suspense>
        }
      />
    </Routes>
  );
}
