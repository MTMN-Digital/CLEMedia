import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./styles/index.css";

// A standalone review build (VITE_ROUTER=hash) is served from an arbitrary
// sub-path with no server rewrites, so it routes on the hash instead.
// Production on Vercel always uses BrowserRouter.
const Router = import.meta.env.VITE_ROUTER === "hash" ? HashRouter : BrowserRouter;

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);

// Most pages arrive as prerendered HTML (scripts/prerender.mjs), which React
// takes over in place. Home, the admin and anything with a database slug come
// as the empty shell and are built from nothing.
//
// Hydration waits for the first paint. When this script was already
// downloaded by the time the HTML finished parsing, Chrome ran it before
// painting, and hydrating a long page held the first paint back by over a
// second: measured live, the same page scored 98 or 86 depending on which
// arrived first. A frame, then a task, puts the paint first every time.
const root = document.getElementById("root")!;
if (root.firstElementChild) requestAnimationFrame(() => setTimeout(() => ReactDOM.hydrateRoot(root, app)));
else ReactDOM.createRoot(root).render(app);
