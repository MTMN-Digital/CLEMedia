# DONE-WHEN checklist, run 2026-10-27-admin

Shared by every builder and the review gate. The gate may fail a shard ONLY on an item below or on a
`shard-lint.sh` FAIL. Items marked (shard) name the shard they apply to; everything else applies to all.
Contract: `.parallel/admin/CONTRACT.md`.

## A. Contract

- A1. The registry export exists at the registry path, as a named function component with no props (media-app-links: `MediaPanel`, `AppPanel`, `LinksPanel`; cms-wiring: `Story` from `src/pages/Story.tsx`, default export kept).
- A2. Only files in the shard's owns list changed or were created (`git status --short`). No edit to a frozen file. No new migration. No new dependency.
- A3. Kit, helpers and registry are imported from `@/components/admin/kit`, `@/lib/admin`, `@/lib/content`, `@/lib/blocks`; nothing in them is copied, re-implemented or restyled.
- A4. Panel routes are nested and relative under `/admin/<key>/*`; internal links are absolute `/admin/...`; no ToastProvider / ConfirmProvider mounted in a panel.
- A5. Every text block in `blocksFor(page)` for a page the shard wires is in that page's `COPY` (at the path in CONTRACT 3d), keyed exactly, and rendered through `useBlock(page, key, COPY[key])` (with `emphasis()` for emphasis blocks and `splitParagraphs()` for multi blocks); every image block goes through `useImageBlock` into `override` on Figure or PageHero. (shop, media-app-links, cms-wiring)
- A6. `useTeam()` keeps its signature; bundled lists render first; DB rows override; empty table or failed request keeps the bundled lists; "Import the current team" exists when the table is empty. (people)

## B. Correctness

- B1. `npx tsc -p tsconfig.app.json --noEmit` exits 0.
- B2. The shard's task runs end to end on the LOCAL stack through the UI (Playwright via `.parallel/admin/pw.mjs`), with no console errors.
- B3. Public pages: with an empty `content_blocks` table (and empty `people` for people) every page the shard touches renders pixel-identical to before, apart from copy the task says to correct; `scripts/qa/audit.mjs` reports overflow 0 and contrast failures 0 at 1440 and 390.
- B4. Overrides work: a content_blocks row (or people / settings / media row) changes the public page, and test rows are removed afterwards (except the six packs and any proof post the task asks for).
- B5. Every save path shows its result in words (toast or SaveBar: "Saved", "Published", ...); failures show the `Result.error` sentence; loading never blanks a panel; lists show an EmptyState when empty.
- B6. Required fields are enforced before saving with a sentence next to the field (title, web address, price, product file before publishing, alt text for any image, non-empty required CMS blocks).
- B7. Slugs are validated with `slugError`; a duplicate web address returns the plain sentence from `explainError`, not a crash.
- B8. (shop) All six episode packs exist on the local stack, EUR 4.99 (499 cents), cover as thumbnail with alt text, zip in product-files, descriptions list exactly the zip's contents; `/shop` and `/shop/<slug>` render them; no product-facing copy still claims a single PDF.
- B9. (shop) Orders list newest first with search by email and "Give a fresh link" via `reissueDownload`, showing the full link.
- B10. (journal) Publish / schedule / unpublish follow CONTRACT (never status 'scheduled'); a post created in the panel appears on `/journal` and `/journal/<slug>`.
- B11. (media-app-links) `/app` and `/media` read the launch flag and store links through `useSetting("app", ...)` with today's values as the default.

## C. Security

- C1. No service-role key, `LOCAL_*` value, password or token in src/.
- C2. Product files only through `FileUpload` / `uploadProductFile` (private bucket); images only through `ImageUpload` / `uploadImage` (public bucket); no browser-side public or signed URL for a product file.
- C3. No `dangerouslySetInnerHTML`, `innerHTML` or HTML string rendering; journal bodies only through `PostBody`; enquiry messages as plain text.
- C4. Admin-typed URLs validated as http(s) before saving; external links use `rel="noreferrer"`.
- C5. Public pages never import `@/lib/admin` and never import `@/lib/supabase` statically.
- C6. Nothing relies on hiding UI for access control; RLS errors surface as the plain sentence.

## D. Accessibility

- D1. Every control has a visible label (kit fields do this); icon-only buttons have an `aria-label`.
- D2. Every image rendered has meaningful `alt` (or `alt=""` when decorative); uploads cannot be saved without alt text.
- D3. Headings in order: one `h1` per panel view (PageHeader), `h2` for groups.
- D4. Status changes are announced (toast / SaveBar already live regions); errors use `role="alert"`.
- D5. Everything works by keyboard; focus is visible; dialogs are the kit's ConfirmDialog.

## E. Phone use

- E1. At 390px wide: no horizontal scroll, nothing clipped, tap targets at least 40px, text at least 13px, inputs 16px or more.
- E2. Lists use `DataTable` (cards on a phone) or an equally readable stacked layout; the primary action is reachable with one thumb (SaveBar at the bottom).

## F. Design and copy

- F1. Zero em dashes and en dashes anywhere in the shard's files (lint DASH).
- F2. Irish English, plain words for a non-technical editor ("Web address", "Published / Hidden", "Describe the image"), confirmations in words, destructive actions confirmed with a verb on the button.
- F3. Uses the site's tokens and the kit: no new colours, no gradients, no shadows, no icon chips, no emoji, no fake numbers, no lorem, no placeholder copy left in a shipped file.
- F4. Brand spellings correct: CLÉ Family Media, The Pawsitive Pugs & Pals®, PupsPlayer™, Conor Sexton.
