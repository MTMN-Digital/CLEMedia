/// <reference types="node" />
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";

export { seedContent } from "./lib/content";

/** Renders one route to HTML at build time (scripts/prerender.mjs). Waits for
 *  every lazy route chunk, so the page's own content is in the markup. */
export function render(url: string): Promise<{ head: string; html: string }> {
  const ctx: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    const out = new PassThrough();
    let html = "";
    out.on("data", (c: Buffer) => (html += c));
    out.on("end", () => {
      const h = ctx.helmet;
      const head = h ? [h.title, h.meta, h.link, h.script].map((x) => x.toString()).join("") : "";
      resolve({ html, head });
    });
    const s = renderToPipeableStream(
      <HelmetProvider context={ctx}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady: () => s.pipe(out),
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
