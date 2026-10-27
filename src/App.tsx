import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

import Home from "@/pages/Home";
/* EVERY ROUTE BUT THE HOME PAGE IS LAZY, since 2026-10-26.

   One chunk held all fourteen routes: 494KB of JavaScript, 148KB over the
   wire, downloaded by a visitor who reads the home page and leaves. Home
   stays eager because it is the page the chunk is for; the rest arrive when
   a link is followed, which is also when the browser is otherwise idle.

   The fallback is deliberately blank rather than a spinner: on a local
   network the chunk lands in a frame or two, and a spinner that flashes is
   worse than nothing. Layout.tsx keeps the header and footer, so a route
   change never clears the page. */
const Story = lazy(() => import("@/pages/Story"));
const Team = lazy(() => import("@/pages/Team"));
const EthicalAi = lazy(() => import("@/pages/EthicalAi"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const Journal = lazy(() => import("@/pages/Journal"));
const JournalPost = lazy(() => import("@/pages/JournalPost"));
const AppPage = lazy(() => import("@/pages/AppPage"));
const Media = lazy(() => import("@/pages/Media"));
const Shop = lazy(() => import("@/pages/Shop"));
const ShopProduct = lazy(() => import("@/pages/ShopProduct"));
const Contact = lazy(() => import("@/pages/Contact"));
const Download = lazy(() => import("@/pages/Download"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PreviewA = lazy(() => import("@/pages/preview/PreviewA"));
const PreviewB = lazy(() => import("@/pages/preview/PreviewB"));
const PreviewC = lazy(() => import("@/pages/preview/PreviewC"));
const PreviewSections = lazy(() => import("@/pages/preview/PreviewSections"));

// Admin is lazy, it pulls in the Supabase client, which the public site
// should never have to download.
const Admin = lazy(() => import("@/pages/admin/Admin"));

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="story" element={<Story />} />
        <Route path="team" element={<Team />} />
        <Route path="ethical-ai" element={<EthicalAi />} />
        <Route path="case-study" element={<CaseStudy />} />
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
      <Route path="preview/sections" element={<PreviewSections />} />

      <Route
        path="admin/*"
        element={
          <Suspense fallback={<p className="p-8 font-body text-muted">Loading…</p>}>
            <Admin />
          </Suspense>
        }
      />
    </Routes>
    </Suspense>
  );
}
