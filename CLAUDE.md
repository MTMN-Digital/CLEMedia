# CLÉ Family Media, corporate website

Paid client build for MTMN Digital. Production work, not a demo.

## What this site is

The **company** site for CLÉ Family Media, the Irish company behind the
children's show *The Pawsitive Pugs & Pals®*.

`pawsitivepugs.com` is the **show** site, playful, character-led, for kids and
parents. **It stays live and unchanged. We are not migrating it.** The two sites
link clearly to each other in both directions.

This site's job is **credibility**. Audiences in priority order:
1. Investors and partners assessing CLÉ as a business
2. Advisors, broadcasters and distributors assessing credibility
3. Educators and schools assessing the research and pedagogy
4. Parents who want to know who is behind what their children watch

Someone with money or distribution power should land here and conclude this is a
serious, research-backed, human-led children's media company, not a YouTube
channel.

Positioning to carry through every page: **edutainment. Watch, Play, Learn.
Parents helping parents. Responsible, human-led use of AI. Research underpinning
the model.**

## Stack, non-negotiable

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage), CMS and product files
- Stripe Checkout via Vercel serverless functions in `/api`
- Vercel hosting, GitHub repo under `Alanb-21`
- `react-router-dom` routing, `react-helmet-async` per-page meta

No page builders, no WordPress, no third-party CMS. The admin panel is part of
this codebase. Don't over-engineer, build what the brief specifies, no more.

## Spelling, get these right everywhere

- The show: **The Pawsitive Pugs & Pals®**
- The player: **PupsPlayer™**
- The company: **CLÉ Family Media** (note the É)
- The founder: **Conor Sexton**

Use the registered symbols on first use per page.

## BRAND TOOL KIT protocol

The BRAND TOOL KIT folder is the single source of truth for assets, and where
new assets go. It lives on Alan's Mac. Top-level folders:

`CREDITS · EPISODE ONE STILLS · FONTS · FRAMES · GENERAL EPISODE STILLS ·
GRADIENTS · LOGOS + ICONS · MOCK-UPS / BRAND DESIGNS · OLDIES INTRO STILLS ·
OTHER IMAGES · PEOPLE · TITLE SLATES · TREATBOX`

**Relevant to this build:** `FONTS`, `LOGOS + ICONS`, `MOCK-UPS / BRAND DESIGNS`,
`PEOPLE`, and possibly `FRAMES` / `OTHER IMAGES` (garden photography) and
`CREDITS` (team names).

**Not relevant:** the episode stills folders and `TITLE SLATES` (show content, not
migrated) and `GRADIENTS` (the design rules rule gradients out).

**Reading from it:** every image, logo and font comes from this folder unless
told otherwise. Copy into the repo at `public/brand/` and `src/assets/`,
optimised, WebP and AVIF at 1x and 2x, compressed, metadata stripped.
Originals untouched. Never link to the folder directly from code.

**Writing back to it:** anything generated (optimised exports, favicon set, OG
images, watercolour treatments, cropped hero variants, updated palette sheet)
goes into `BRAND TOOL KIT/web-exports/YYYY-MM-DD/`. **Never overwrite, rename or
delete anything already in the folder.** Maintain
`BRAND TOOL KIT/web-exports/ASSET-LOG.md` listing every asset added, what it is,
where it is used, and its source file.

## Design direction

Corporate, polished and human, built from the show's existing palette and
typography. Sister brand to the show, not a new one.

- Raise the level: white space, strong type hierarchy, editorial grid,
  restrained motion. Annual report crossed with a design studio site.
- **People first.** Real photography of founders, team, advisors, process, faces, hands, workspaces, the garden.
- **Characters are supporting cast.** Finn, Fia and the rest appear as small
  accents, watermarks, section markers, or one dedicated module. They never lead
  a page on this site.
- Watercolour treatment as connective tissue is worth exploring, soft washes,
  torn edges, paper grain. Subtle. Craft, not a children's colouring page.
- The garden that inspired the show's world is a strong hero candidate.
- Reference: `m.ind.coach`, corporate but warm and nostalgic, type-led.

### Hard rules

- **Mobile first**, every section, every time. 320px to 2560px.
- No gradients. No drop shadows on everything. No bouncing animations. No
  auto-rotating carousels.
- Motion: one orchestrated entrance per page is expected, not one fade. A
  drawn line may draw itself, objects may assemble, a lamp may cross. What
  stays banned is anything that never stops: no ambient loops, no parallax
  backgrounds, no drifting, no auto-rotating carousels, no bouncy springs.
  Everything collapses under `prefers-reduced-motion`.
  REVISED 2026-10-09. The old rule read "motion limited to fades and short
  scroll reveals", and it was being followed: the whole site ran on a single
  8px fade-up used everywhere, which the client's verdict was that it still
  read as static. The restraint the brief is really asking for is about
  things that never settle, not about whether anything may move at all.
- Proper type scale. Max two typefaces plus one optional accent.
- **WCAG 2.1 AA contrast minimum on every text and UI element. Check it, do not
  assume.**

## Sitemap

`/` · `/story` · `/team` · `/ethical-ai` · `/journal` · `/journal/:slug` ·
`/app` · `/media` · `/shop` · `/shop/:slug` · `/contact` · `/download/:token` ·
`/privacy` · `/terms` · `/cookies` · `/admin` · 404

Global: sticky header with a clear link out to the show site; footer with company
details, email, social, both-site cross-links, copyright.

`/ethical-ai` is the most important trust page for investors and educators.
Position (AI as a production tool in a human-led process, never the author of
children's content), the process step by step, and the safeguards and red lines.
Build it as a proper explainer with a process diagram or numbered stages, not
three paragraphs.

## CMS

Admin panel at `/admin`, Supabase Auth (email + password, single admin role,
extensible). Conor must be able to change any photo, paragraph or link, publish a
journal post, add a podcast entry, add a product, and flip the app live, **on his own, from his phone, without training.**

Tables: `content_blocks` · `posts` · `categories` · `people` · `media_items` ·
`products` · `orders` · `enquiries` · `settings`

Buckets: `public-media` (public, images) and `product-files` (private, sellable
PDFs, short-lived signed URLs only).

**RLS on every table.** Public read only on what is genuinely public. Writes only
through the authenticated admin. The private bucket is never publicly readable.

## Shop

Downloadable PDFs around €3-4. Product page → `/api/create-checkout-session`
(**price from the database, never the client**) → Stripe → `/api/stripe-webhook`
verifies signature, creates `orders` row and single-use download token →
`/download/:token` serves a signed URL. Token valid 24 hours, capped at five
downloads. "Save this file now" message.

No account, no email gate, no signup. Stripe collects email for its own receipt;
we don't require it and never add anyone to a mailing list from a purchase.

Test keys until the client provides live keys. **Keys in env vars only, never in
the repo.** VAT on digital goods is for the client and their accountant, do not
guess the treatment.

## Guardrails

- Do not migrate episode pages, colouring resources or show content. Link to it.
- Do not let characters take over. This site sells the company.
- **Do not write claims the client has not given you**, no invented statistics,
  fake testimonials, "trusted by" logos, awards, user numbers or research
  findings. A credibility block with no supplied claim stays empty and gets
  listed in `CONTENT-NEEDED.md`.
- Do not invent team bios.
- **No AI-generated imagery anywhere on this site.** The Ethical AI page makes
  that a credibility risk.
- **No stock photography of families or children.** Real assets only.
- Never fabricate a photo of a real person.
- Do not touch the live show site.
- Do not restructure the approved layout shell without flagging it first.
- No secrets in the repo. Environment variables only.

Missing asset → clearly marked placeholder (flat brand-colour block, required
dimensions, visible label), add it to `CONTENT-NEEDED.md`, keep moving.

## Ask, do not invent

Keep `QUESTIONS.md` current. Add to it rather than guessing.

## Build order, stop at each gate

1. Asset audit and design tokens, **gate: client approves tokens**
2. Scaffold, Supabase schema + RLS, deploy pipeline, blank shell on Vercel
3. Three home directions at `/preview/a`, `/preview/b`, `/preview/c`, **gate: client picks a direction**
4. Design system and global layout locked
5. Home, final
6. Founder story, Team and advisors, Ethical AI
7. Journal: index, post template, categories, CMS wiring
8. App page + pre-launch state + launch toggle. Media and podcast page
9. Shop and Stripe end to end, **gate: purchase-to-download test with client**
10. Contact, utility pages, 404
11. Admin panel polish + walkthrough video for Conor
12. SEO, performance, accessibility pass. Cross-linking with the show site
13. Launch checklist, DNS, live Stripe keys, handover docs

The three preview directions must be **genuinely different**, not three skins of
one layout: A. Garden Light (photography led) · B. Watercolour Studio
(illustrative, crafted) · C. Corporate Warm (closest to `m.ind.coach`).

## Targets

Lighthouse 95+ on performance, accessibility, best practices and SEO on mobile.
WCAG 2.1 AA verified. Four weeks of build, joint launch with the app mid-October
2026. Weekly check-in Fridays around 3pm.

## Current state

Stage 0. `QUESTIONS.md` and `CONTENT-NEEDED.md` exist. No application code yet, the token gate is not passed because the brand kit has not been read.
