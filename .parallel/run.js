// In-session Workflow orchestration template for a PARALLEL + MODEL-TIERED MTMN build.
// Fill FOUNDATION + SHARDS, set the model tiers + ISOLATION, then pass this whole file as the
// Workflow tool's `script`. JS only (no TS types).
//
// Two axes of savings:
//   PARALLEL - workers run at once            -> less wall-clock time
//   TIERED   - cheap model runs the shards,   -> less cost (quality held by the review gate)
//              strong model sets + guards quality
//
// Flow: foundation(STRONG, claims the run's files, freezes the contract + the shared checklist +
//       the mechanical lint) -> per shard [ wait-on-cross-run-dep -> build(CHEAP, lints itself to
//       exit 0) -> review(STRONG gate + COLD codex, + warm codex at depth 'both') -> repair(CHEAP,
//       one fix round) -> re-gate(STRONG) -> escalate-only-if-still-failing(STRONG) -> record the
//       verdict -> mark done ] -> integrate(STRONG, releases the claims).
//       Build->review->repair->escalate runs as a pipeline so each shard is gated the moment it
//       finishes, not after the slowest one.
//
// Three things keep the CHEAP tier viable (added 2026-09-08 after 7 runs measured ~100% escalation
// on existing-code work, and the cost axis therefore delivering nothing):
//   ONE CHECKLIST - the foundation writes the DONE list once; it is injected verbatim into build,
//     repair, escalate AND review, and the gate may fail a shard only on an item in it. Builder and
//     gate used to score different lists, which manufactures findings.
//   MECHANICAL LINT - `.parallel/shard-lint.sh`, greps for the findings that are literal strings
//     (em dashes, placeholders, slop colours, missing alt, missing reduced-motion, missing export).
//     The shard runs it to exit 0 before reporting; the gate re-runs it and does not re-litigate
//     what it passes. A cheap model can iterate a grep; it cannot iterate a taste judgement.
//   REPAIR ROUND - a failed shard gets ONE cheap fix round against the findings and is re-gated
//     before anything escalates. Most findings were mechanical and were being fixed by paying for a
//     full strong-model author.
//
// Two things beyond plain fan-out:
//   COLD REVIEW - the Codex co-reviewer gets NO brief on turn 1 and must infer what the code is
//     for, then re-triages on turn 2 once the spec is revealed. Conformance review structurally
//     cannot see an architectural misstep; this can. See reference/review-rubric.md.
//   MULTI-RUN   - pbuild claims file ownership, budgets memory, gates dispatch on live machine
//     pressure, and lets a shard wait on another RUN's shard. Two unbudgeted parallel runs do not
//     merge-conflict, they OOM the laptop. A supervisor pauses running workers before oomd starts
//     killing cgroups. See reference/multi-run.md.
//
// Invoking the mtmn-parallel skill is the user's opt-in to this orchestration.
//
// BEFORE RUNNING: `parallel-lint <this file>`. It evaluates only the declaration block above
// phase('Foundation'), so it dispatches no agent and costs nothing, and it fails on overlapping
// owns, convergence points owned by a shard, same-run dependsOn, leftover placeholders and bare
// tool paths. Exit 0 means it is safe to fan out.

export const meta = {
  name: 'mtmn-parallel-build',
  description: 'Build an MTMN project in parallel with model tiering: strong foundation, cheap shards, strong review gate, integrate',
  phases: [
    { title: 'Foundation', detail: 'strong model builds + freezes the contract', model: 'claude-opus-5-5' },
    { title: 'Build', detail: 'cheap model per page/route, disjoint files', model: 'claude-sonnet-5-5' },
    { title: 'Review', detail: 'strong model gates each shard, escalates failures', model: 'claude-opus-5-5' },
    { title: 'Integrate', detail: 'strong model wires convergence, runs the build', model: 'claude-opus-5-5' },
  ],
}

// ---- Model tiers ----------------------------------------------------------------
// STRONG sets + guards quality (foundation, review, integrate) - NEVER tier this down.
// CHEAP executes the bounded shards against the frozen contract.
//
// FULL MODEL IDS, NOT FAMILY ALIASES, and this is measured rather than assumed. On
// 2026-10-04 a 45-agent run was audited by reading the model recorded in each agent's own
// transcript (`grep -ho '"model":"claude[^"]*"' <workflow dir>/*.jsonl`):
//
//   model: 'opus'              ran as claude-opus-5       <- a minor version BEHIND
//   model: 'sonnet'            ran as claude-sonnet-5-5
//   model: 'claude-opus-5-5'   ran as claude-opus-5-5     <- the full id is honoured
//   model: 'claude-sonnet-5-5' ran as claude-sonnet-5-5
//
// So the whole strong tier of that run, the review gate and every escalation included, was
// on Opus 5 while Opus 5.5 was installed and was the session's own model. A family alias
// resolves to whatever the harness considers that family's default, which is not necessarily
// its newest release, and nothing in the run reports the difference.
//
// RE-MEASURE WHEN A NEW MODEL SHIPS, do not trust this comment: `node
// $HOME/.claude/skills/mtmn-parallel/reference/model-probe.mjs` prints the alias mapping from
// the last run it can find, and reference/model-probe.js is a three-agent workflow that
// measures it fresh. Pinning means no silent lag; it also means no silent upgrade.
const STRONG = 'claude-opus-5-5'
const CHEAP = 'claude-sonnet-5-5'

// Third tier: set a shard's model to 'codex' to run it on the local Codex CLI (gpt-5.x) instead.
// Different quota entirely (ChatGPT plan, zero Anthropic tokens) and its output never enters this
// context. Route only non-design shards there: data modules, SEO/JSON-LD, API routes, config,
// SQL, tests, utility pages. Never the foundation, integration, the gate, or design/copy shards.
// Gated identically by mtmn-review-gate. Not compatible with ISOLATION = true (codex-task runs
// against a fixed workdir, not a worktree). See reference/model-tiering.md.

// ---- Fill these in from the plan -------------------------------------------------
const PROJECT = `clients/cle-media - the CLÉ Family Media corporate site. Four existing pages are
being lifted to the house "lit room" render language that /contact and /team already ship. This is
an EDIT of an existing, working, fully audited codebase, not a new build: every page already
renders, passes WCAG AA on measured pixels and has zero horizontal overflow at 1440 and at 390.
The bar is "make this page carry the room language without breaking any of that".`
const REPO = '/home/david/Documents/GitHub/clients/cle-media'
const RUN_ID = '2026-10-09-cle-rooms'

// Absolute paths on purpose. `pbuild` resolves fine in an interactive shell but NOT in a stripped
// environment (verified: `env -i bash -lc 'command -v pbuild'` fails), and a claim that silently
// no-ops does not error - it leaves the run unguarded while reporting success, which destroys the
// one-file-one-owner guarantee. Removing that failure mode beats detecting it.
// ponytail: hardcoded paths, make it a lookup if a wrapper ever moves.
const PBUILD = '$HOME/.local/bin/pbuild'
const CODEX_COLD = '$HOME/.local/bin/codex-cold'
const CODEX_TASK = '$HOME/.local/bin/codex-task'
// Research shadow snapshots (personal/research/papers/programme.md). At review time each shard's
// owned files + spec are copied to ~/Documents/research-private/shadow, outside every repo, for a
// later batch of experimental reviews. Never blocks, fixes or fails a build. false = skip.
const SHADOW = true
const SHADOW_SNAP = '$HOME/.local/bin/shadow-snap'
const TIER = 'vite-react'            // 'static' | 'vite-react' | 'next'
const DIRECTION = `Warm-light editorial craft, already built and frozen. TYPE: Fraunces (hero only)
+ Calistoga (display, 40px and up only) + Hanken Grotesk (body) + Spline Sans Mono (labels,
figures). PALETTE: warm clay paper (paper-1/2/3), cream raised surfaces, ONE rationed accent
(the show's red #a32e32 / #8e2428), navy for the single deep band, warm umber .bench for the
mid-tone the palette lacked. LAYOUT: wide 1560px cap, section role decides container width, no
max-w-7xl on everything. MOTION: Settle (8px, 0.7s, 60ms stagger, once on entry) and nothing else;
no parallax, no pinning, no ambient loops. SIGNATURE: the lit room - objects stand on ledges under
one lamp whose azimuth is computed per column, so the shadows fan from a single point. Coded
CSS/SVG renders only, NEVER image generation.`

// Same folder (fresh build, workers only CREATE disjoint new files) -> false.
// NOTE: the inline review+escalate below assumes same-folder (the review/escalate agents read +
// overwrite files on disk). For worktree mode (existing repo / parallel installs) set true AND
// move review+escalate into the integrate agent after the merge - a worktree the main checkout
// can't see can't be reviewed mid-pipeline.
const ISOLATION = false

// ---- Review depth ---------------------------------------------------------------------------
// 'cold' (default) - the two-turn Codex pass: turn 1 reads the shard with NO brief, no contract and
//   no house docs and must reconstruct what the code is FOR; turn 2 reveals the spec and re-triages
//   its own findings. A reviewer told the intent can only grade conformance to it, which is exactly
//   why it never sees an architectural misstep. Turn 2 is the false-positive filter.
// 'both'  - adds the warm pass alongside (spec in hand, code-level logic). Two channels, opposite
//   inputs. Set it when a miss is expensive: 8+ shards, or complexity judged during PLANNING,
//   before this skill was invoked (existing codebase being edited; a shard touching auth, money,
//   migrations or concurrency; logic shards outnumbering presentational ones; no reference to
//   mirror). The orchestrator may raise 'cold' to 'both', never silently lower it.
let REVIEW_DEPTH = 'cold'   // 'cold' | 'both' - raise to 'both' here when planning judged it complex

// ---- Repair round ---------------------------------------------------------------------------
// A failed shard goes back to the SAME cheap agent with the findings for ONE fix round and is
// re-gated before anything escalates. Measured across seven runs, most findings were mechanical
// (a missing prefers-reduced-motion collapse, an alt, a token imported by value not by name) and
// the run was paying a full strong-model author to fix them, which is what destroyed the cost axis.
// One cheap fix + one re-gate costs less than one strong author. Set false to go straight to
// escalation (a run where the cheap tier has already proved hopeless).
const REPAIR_ROUND = true
// Above this many blocking findings the shard is not being fixed, it is being rewritten - skip
// straight to the strong model. ponytail: 12 is a guess with nothing behind it yet; `.parallel/
// reviews/` now records every verdict, so tune this from the tally rather than from taste.
const REPAIR_MAX_FINDINGS = 12

const FOUNDATION_PROMPT = `THERE IS NOTHING TO BUILD IN THIS PHASE. ${PROJECT}

The foundation already exists, shipped, and is frozen. Your job is to WRITE IT DOWN accurately
enough that a cheaper model can edit one page blind without touching it, and to set up the two
gate artefacts. Do not create or restyle any component. Do not edit any page. If you find
something you think is wrong in the foundation, note it in the contract and leave it alone.

READ THESE FIRST, in this order, and base the contract on what they actually contain:
  ${REPO}/CLAUDE.md                              the client brief and the hard rules
  ${REPO}/src/styles/index.css                   @theme tokens, utilities, surfaces, type scale
  ${REPO}/src/components/render/render.css       THE RENDER KIT: .rk-studio, .rk-rake, .rk-head,
                                                 .rk-bench, .rk-item, .rk-plate, .rk-mat, .rk-pic,
                                                 .rk-light, .rk-tag, .rk-ledge, .rk-board,
                                                 .rk-slip, .rk-corr, .rk-room, .rk-hang, .rk-relief
  ${REPO}/src/components/render/Stage.tsx        the lit-object primitive and its props
  ${REPO}/src/components/render/Relief.tsx       the felted mark lit off its 16-bit height map
  ${REPO}/src/components/render/StudioWall.tsx   a worked example of a bench of plates + useRoomEntry
  ${REPO}/src/components/ui.tsx                  Container/Section/Card/Button/TextLink/Kicker/Lead
  ${REPO}/src/components/Settle.tsx              the ONLY motion primitive
  ${REPO}/src/components/Figure.tsx              every image goes through this
  ${REPO}/src/lib/brand.ts                       the AssetKey union: the ONLY images that exist
  ${REPO}/src/pages/Contact.tsx                  REFERENCE A: the correspondence room
  ${REPO}/src/components/team/StageSequence.tsx  REFERENCE B: the review board, slips on shelves
  ${REPO}/src/pages/Team.tsx                     how a page frames a room

THE CONTRACT MUST CARRY, by name and with exact import paths:
  - every colour/type/radius token in @theme, and the rule that nothing inlines a magic colour
  - the full render-kit class list above with one line each on what it is for and what it needs
    around it (e.g. .rk-item must be inside .rk-bench inside .rk-studio; .rk-head needs ink, never
    muted, because it prints on the wall's own gradient)
  - the Stage props with their meanings and sane ranges, and the azimuth-per-column pattern
    (the lamp is ONE lamp: compute each column's light angle from its position, never give two
    neighbouring objects the same azimuth and never light a row in parallel)
  - useRoomEntry: what it returns, and that .rk-studio needs is-armed/is-in from it
  - ui.tsx primitives with their props, and the Section pad contract (no inline !py-*)
  - the AssetKey union VERBATIM. A shard must not invent an image key. There is no image
    generation and no stock photography on this project.
  - the four contrast traps this codebase has already been bitten by, stated as rules:
      (a) NEVER dim a text colour with opacity. Use the token at full strength. Four separate
          failures so far, all of them opacity on ink or muted.
      (b) --color-muted is the floor and only on PAPER. On the render kit's wall, text is
          --color-ink at full strength or it goes on a cream mount.
      (c) a caption on a lit wall belongs INSIDE the .rk-mat on cream, not on the wall.
      (d) the wall gradient darkens down the panel; a TALL room needs .rk-room, which raises
          the floor. The .grain overlay multiplies on top, so painted pixels are ~10% darker
          than the CSS colour says.

THE REGISTRY: four routes, listed in SHARDS below, each already existing with a default export.

TWO ARTEFACTS TO CREATE:
1. ${REPO}/.parallel/shard-lint.sh - copy $HOME/.claude/skills/mtmn-parallel/reference/shard-lint.sh
   and chmod +x. TUNE it for this project: this site legitimately ships a token named
   --color-slate (a deprecated alias for --color-body) and class names like text-slate with NO
   numeric suffix, so confirm SLOP_DEFAULT does not fire on those; it greps for slate-<digits>,
   which this project never uses. Prove it exits 0 unchanged against all four shard targets:
     bash .parallel/shard-lint.sh Shop src/pages/Shop.tsx src/pages/Shop.tsx src/pages/ShopProduct.tsx 'src/components/shop/*'
     bash .parallel/shard-lint.sh Media src/pages/Media.tsx src/pages/Media.tsx
     bash .parallel/shard-lint.sh AppPage src/pages/AppPage.tsx src/pages/AppPage.tsx 'src/components/app/*'
     bash .parallel/shard-lint.sh Home src/pages/Home.tsx src/pages/Home.tsx 'src/components/home/*'
   All four exit 0 on the CURRENT code. If your tuning breaks that, your tuning is wrong.
2. ${REPO}/.parallel/CHECKLIST.md, also returned as \`checklist\`. This is the ONLY list the gate
   may fail a shard on, so it must contain everything that matters and nothing that does not.
   It MUST include at least:
   - the page still compiles: npx tsc --noEmit -p tsconfig.app.json exits 0. That is the ONLY
     build command a shard may run. The shards run concurrently in ONE checkout against one
     node_modules and one dist/, so no shard runs npm install, npm run build, or a dev server;
     integration runs the real build. tsconfig.app.json is not incremental, so concurrent
     typechecks are safe.
   - no new npm dependency was added, and package.json is untouched
   - no file outside the shard's Owns list is modified
   - every colour comes from a token; no inline hex, no opacity on a text colour
   - every image goes through Figure with a key from the AssetKey union; no new image files
   - no claim, statistic, testimonial, logo, award or user number that is not already in the repo
   - the Irish register and spellings: CLÉ Family Media, The Pawsitive Pugs & Pals(R),
     PupsPlayer(TM), Conor Sexton, EUR prices
   - zero em dashes and zero en dashes anywhere, code comments included
   - motion is Settle or useRoomEntry only; no new animation library, no infinite loop, no
     parallax, no scroll pinning
   - reduced motion collapses to the finished state
   - works at 390px with no horizontal overflow
   - every text/background pair meets WCAG AA on the PAINTED pixel, measured not assumed
   - the page keeps a single h1 and its heading order does not skip a level
   DO NOT put subjective items ("looks premium") in it. The gate scores against this list.

Return contractMarkdown, registry, checklist. Write the contract to ${REPO}/.parallel/CONTRACT.md
as well, so integration and any later run can read it.`

// One entry per shard. `owns` lists MUST NOT overlap (that's the whole guarantee). `model`
// defaults to CHEAP; promote a make-or-break signature shard to STRONG, or drop a trivial one to
// 'haiku'. `reference` = an existing component the shard should mirror (cheap models copy a
// concrete example far better than they follow abstract principles).
//
// `agentType` = the role-specialist subagent that builds the shard, so the persona's craft + house
// guardrails ride along. It composes with `model` (the specialist still runs on the shard's tier).
// ROUTE EVERY SHARD BY ITS TYPE - don't leave it to chance:
//   page / route / feature build     -> 'mtmn-shard-frontend'
//   design-heavy / signature section -> 'mtmn-shard-design'
//   copy-led / text pass             -> 'mtmn-shard-copy'
//   metadata / Open Graph / JSON-LD  -> 'mtmn-shard-seo'
// Omitting it is NOT a generic fallback: the build dispatch below defaults it to
// 'mtmn-shard-frontend', so the floor is always a house-bound specialist, never a bare worker.
const SHARDS = [
  {
    label: 'shop',
    route: '/shop',
    exportName: 'Shop',
    exportPath: 'src/pages/Shop.tsx',
    owns: ['src/pages/Shop.tsx', 'src/pages/ShopProduct.tsx', 'src/components/shop/*'],
    model: CHEAP,
    agentType: 'mtmn-shard-design',
    weight: '2G',
    reference: 'src/pages/Contact.tsx (the correspondence room) and src/components/team/StageSequence.tsx (the review board)',
    task: `/shop is the thinnest page on the site and the client has called the site flat three
times. Measured: every ground on this page sits between 0.94 and 0.57 relative luminance, so the
page reads as one tone however many objects are put on it. It currently goes pale band, pale band,
pale band, three empty cream rectangles, pale band, navy close.

WHAT IT SELLS: downloadable PDFs around EUR 3 to 4, colouring books, puzzle packs and activity
sheets. Real printed things a parent puts on a kitchen table.

DO THIS:
1. "On the shelf" is the page's job and it is currently three empty rectangles with a line of
   text under each. Rebuild it as a LIT SHELF: the products standing as objects on a ledge in a
   .rk-studio room, exactly the way src/components/team/StageSequence.tsx stands its six slips on
   two shelves and src/components/render/StudioWall.tsx stands its plates on a bench. Use Stage
   with seated + a per-column light azimuth, .rk-mat / .rk-pic for the mount, and the existing
   PrintedSheet render (src/components/shop/PrintedSheet.tsx) as the object standing on the shelf
   where a product has no thumbnail of its own.
2. THE EMPTY STATE IS THE STATE YOU WILL SEE. The Supabase products table is empty, so
   useProducts() returns 'empty' and src/components/shop/EmptyShelf.tsx renders. That empty shelf
   must look deliberate and good, because it is what the client opens: a real shelf, lit, with
   nothing on it yet, and an honest line. It must NOT look like three skeleton boxes. Keep the
   existing three states exactly as they are in logic (loading / ready / empty / failed are
   distinguished on purpose - 'failed' must never say "nothing on sale").
3. Give the page the mid-tone it has none of. One .bench or one .rk-studio band, not two, and
   keep the single navy .deep band the page already closes on.
4. Leave the terms/"what this shop does not ask you for" content intact as facts; you may
   re-lay it out. Do not invent a product, a price, a count or a delivery promise.

PRICES COME FROM THE DATABASE, never from the client, and never hardcode one.`,
  },
  {
    label: 'media',
    route: '/media',
    exportName: 'Media',
    exportPath: 'src/pages/Media.tsx',
    owns: ['src/pages/Media.tsx'],
    model: CHEAP,
    agentType: 'mtmn-shard-design',
    weight: '2G',
    reference: 'src/pages/Contact.tsx (the correspondence room) and the StudioWall band already mounted on this same page',
    task: `/media already carries the one genuinely good band on the page: the StudioWall, four
episode title slates standing as lit plates on a bench. Everything around it is pale rows of text.

DO THIS:
1. "The index" is the press-and-appearances list and it is currently hairline rows on paper with
   a lot of empty middle. It is a LIST OF ARTEFACTS (a booked podcast appearance, the app launch).
   Give it a shape that is not a stack of rows: look at how src/pages/Contact.tsx lays its people
   on a wall and how StageSequence lays its slips on shelves, and pick ONE of those readings.
2. "Notes to editors" is a facts table in a card. It is the single most useful block on the page
   for a journalist. Make it read as a press sheet standing in the room rather than a card on
   clay, using .rk-corr__sheet's treatment as the model (a flat lit sheet, NOT a Stage: nothing
   with selectable text or a control goes inside a 3D transform).
3. The page carries a large type statement ("No logo strip of publications that have not written
   about us, and no quote nobody said"). Keep it. It is the best line on the page. Give it room.
4. DO NOT re-add the "No AI-generated imagery is used on this site" sentence anywhere. It was
   pulled on the client's instruction and is blocked on the founder confirming what is true. It
   is logged in CONTENT-NEEDED.md.
5. Invent nothing: no publication logos, no quotes, no coverage that is not already in the file.`,
  },
  {
    label: 'app',
    route: '/app',
    exportName: 'AppPage',
    exportPath: 'src/pages/AppPage.tsx',
    owns: ['src/pages/AppPage.tsx', 'src/components/app/*'],
    model: CHEAP,
    agentType: 'mtmn-shard-frontend',
    weight: '2G',
    reference: 'src/pages/Contact.tsx (the correspondence room) and src/components/team/StageSequence.tsx (the review board)',
    task: `/app is the PupsPlayer(TM) page. It has a device mock with three switchable screens, a
full-bleed character still, a big type statement, and then three flat Watch / Play / Learn blocks
and a "checked by the people" row.

DO THIS:
1. The three Watch / Play / Learn blocks are the product's whole argument and they are currently
   a heading and two paragraphs each on bare paper. Give them the room treatment: three objects
   standing on a shelf under one lamp, the way StageSequence stands its six slips. Three across,
   each carrying its own short account. Keep the three names and the existing copy's claims.
2. The "checked by the people who check the episodes" row shows three portraits flat on paper
   and is the fourth copy of those faces on the site. Mount them the way /contact does: inside
   .rk-mat with the caption printed ON the mount, not under it on the ground.
3. CAREFUL WITH THE DEVICE MOCK. src/components/app/PupsPlayerWalkthrough.tsx switches three
   screens with opacity-0. DO NOT force them visible and DO NOT change that mechanism: the QA
   contrast sweep deliberately does not override opacity here, because stacking all three screens
   reports contrast failures for text nobody can see. Leave the switching alone.
4. The app is PRE-LAUNCH. Do not add a store badge, a download link, a launch date or a waitlist
   count. The launch state is a compile-time constant and is not yours to change.`,
  },
  {
    label: 'home',
    route: '/',
    exportName: 'Home',
    exportPath: 'src/pages/Home.tsx',
    owns: ['src/pages/Home.tsx', 'src/components/home/*'],
    model: STRONG,
    agentType: 'mtmn-shard-design',
    weight: '2G',
    reference: 'src/pages/Contact.tsx (the correspondence room) and src/components/team/StageSequence.tsx (the review board)',
    task: `POLISH ONLY. The client has signed this page off and has explicitly limited this shard
to two blocks. This is the one shard on the run that can do damage by being ambitious, which is
why it is on the strong model.

DO NOT TOUCH, AT ALL: the HeroFilm band and its headline, the bluebell full-bleed image, the
"One episode, three stages" panels, the .bench band with the felted wordmark and the FilmStrip,
the section order, or which sections exist.

CHANGE EXACTLY TWO THINGS:
1. "A named person at every stage" (CallSheet, src/components/home/CallSheet.tsx) is a six-row
   vertical list of the same six faces that /team shows twice and /contact shows once. It is the
   third copy on the site and it reads as a directory. Either give it the room treatment the way
   src/components/team/StageSequence.tsx does, or cut it down so it stops being a face directory
   and starts being an argument. It must still name the people and still link to /team.
2. The Responsible AI band ("AI is a production tool. People remain responsible for the work.")
   is a heading beside a plain card of bullets. It is the site's single most important trust
   claim and it is the quietest block on the page. Give it weight. Do not add a statistic, a
   logo, a badge or a certification: there are none and inventing one on the page that argues
   about honesty is the worst place on this site to be caught out.

Nothing else on this page changes. If you believe a third block needs work, write it in your
result as an assumption; do not edit it.`,
  },
]

// Claim this run's file ownership before anything is written, so a second parallel run against the
// same project cannot collide with it. Appended to the foundation prompt rather than baked into
// FOUNDATION_PROMPT because SHARDS is declared after it. The foundation agent has Bash; the shard
// specialists do not.
const CLAIM_BLOCK = `

FIRST, before writing any file, claim this run's file ownership:
${SHARDS.map((x) => `  ${PBUILD} claim --repo ${REPO} --run ${RUN_ID} --shard ${x.label} ${x.owns.join(' ')}`).join('\n')}
A REFUSED claim means another live run already owns that path. STOP and report it - do not fan out
into a known collision. Then build the foundation.`

// Size floor, applied after SHARDS is known. Complexity judged at plan time can raise the depth
// earlier by setting REVIEW_DEPTH = 'both' above; nothing lowers it.
if (SHARDS.length >= 8) REVIEW_DEPTH = 'both'
// ---------------------------------------------------------------------------------

const CONTRACT_MARKDOWN = `# CONTRACT: CLÉ Family Media site pass

Frozen at \`6307ee9\`. No shard may edit anything in the convergence points list.
If you think you need to, that is a contract gap: report it, do not edit.

## Reference to mirror

**\`src/pages/Story.tsx\`.** Every shard matches its pattern language, not an
abstract idea of good. What it does, and what to copy:

- A left heading column and a right body column, repeated down the page, so the
  eye has one consistent place to find "what is this section".
- Surfaces travel through the VALUE RANGE, they do not alternate within a
  sliver of it. See "The surfaces" below: this rule used to read "paper, then
  \`.wall\`, then paper, closing on one \`deep\` band", and following it produced
  nine pages that measured as one tone.
- One full-bleed image moment, captioned.
- One pull-quote moment at display size.
- One card moment, a table or a panel set into the column.
- Sections vary in width. Not every section is the same container.

## Convergence points: integration only

\`src/App.tsx\` · \`src/components/Layout.tsx\` · \`src/styles/index.css\` ·
\`src/components/ui.tsx\` · \`src/lib/*\` · \`src/components/Seo.tsx\`

## The spacing contract

\`<Section pad="...">\` is the ONLY way to set section rhythm. There are no
\`!py-*\` escapes left in the codebase and no shard may add one.

| Step | Desktop | Use |
|---|---|---|
| \`tight\` | 80px | a section that leans on its neighbour |
| \`normal\` | 112px | the default |
| \`open\` | 160px | a section that needs air around it |
| \`none\` | 0 | a section that butts against the next |

Asymmetric: \`pad={["tight", "none"]}\` is top then bottom.

## Buttons

\`<Button variant="primary" | "quiet" size="normal" | "large">\`. Two variants,
because there are two treatments. There used to be five names and three of them
silently rendered as \`quiet\`. \`size="large"\` is for a page whose whole job is
one action, the download and the buy button, and nothing else.

Do not restyle a button with \`className\`. \`.deep .btn-quiet\` already handles a
quiet button on the navy band.

## Type and tokens

- Headings \`t-display\` / \`t-h2\` / \`t-h3\`, body \`t-body\`, small \`t-sm\`.
- \`.eyebrow\` for section labels, \`.eyebrow eyebrow-sm\` for a role line.
- Colour, radius and easing come from \`var(--color-*)\`, \`var(--radius-*)\`,
  \`var(--ease-out)\`. No literal that restates a token.
- Prefer the Tailwind utility over the long form: \`border-rule\` not
  \`border-[var(--color-rule)]\`, \`ease-out\` not \`ease-[var(--ease-out)]\`.
- \`--color-slate\`, \`--color-deep\`, \`--color-clay\`, \`--color-cream\` and
  \`--color-hairline\` are DEPRECATED aliases. Nothing new uses them.

## Shared primitives, use before building

\`Container\` (\`width="wide" | "text"\`) · \`Section\` · \`Button\` · \`TextLink\` ·
\`Card\` · \`Kicker\` · \`Lead\` · \`Note\` · \`Figure\` · \`Settle\` · \`Wipe\` ·
\`DisclosurePanel\` · \`NotifyForm\`

Eight chassis primitives were deleted at integration: \`SectionHeading\`, \`Tile\`,
\`Well\`, \`Panel\`, \`ArchCard\`, \`Rail\`, \`EmptyState\` and \`Capsule\`. None had a
consumer, two were aliases of \`Card\`, and \`ArchCard\` drew a circular portrait,
which this contract forbids. \`.tile\`, \`.well\` and \`.hairline\` remain as classes
and are used directly.

## Non-negotiables

- NEVER an em dash or an en dash. Anywhere. Comma, colon, parentheses or two
  sentences.
- No AI-generated imagery. No stock photography of families or children.
- Do not invent claims, statistics, testimonials, logos or awards. A missing
  fact goes in \`CONTENT-NEEDED.md\`, not into the page.
- WCAG 2.1 AA on every text element, measured not assumed.
- The Pawsitive Pugs & Pals®, PupsPlayer™, CLÉ Family Media, Conor Sexton.
- Mobile first: 390px must work, not just 1440px.

## Run sitepass-w2 additions

**Portraits are rounded squares, never circles.** \`rounded-[var(--radius-md)]\`
with \`aspect-square\`, as \`src/components/team/PeopleStrip.tsx\` does it. \`/contact\`
currently uses circles for the same six faces, which is the same people rendered
two ways on one site. Wave 1 showed two shards independently reaching for the
same image because nothing said which; this says it.

**Three image slots on this entire site are filled**: \`home.hero\`,
\`home.characters\` and \`story.garden\`. They are FRAMES FROM THE ANIMATED SHOW,
not photographs, and \`src/lib/brand.ts\` says so at the top of the file. Never
caption one as a photograph. This contract said "three real photographs" for
two waves, which was wrong, and a cold review caught it by reading brand.ts.
Everything else in \`src/lib/brand.ts\` with \`base: null\` is an unfilled
placeholder. Do NOT add a full-bleed image moment
unless you can name which of those three it is and no other page already uses it
that way. \`story.garden\` belongs to \`/story\`, \`home.characters\` to \`/app\`,
\`home.hero\` to \`/\`. A page without an image finds its change of pace in a card,
a quote, or a change of surface instead.


## The surfaces, and the flatness this fixes (2026-10-08)

Measured across the palette: every ground the site used for a section sat
between **0.94 and 0.57** relative luminance, and then jumped to navy at
**0.033**. The whole middle of the range was empty. A page went light, a
shade less light, a shade less light, then one dark band at the end, which is
why adding objects to pages kept failing to make them less flat. The objects
were cream on tan, so they had nowhere to stand out from.

| Surface | Luminance | What it is for |
|---|---|---|
| \`card-stock\` / \`.card\` | 0.94 | an object ON a ground, never a ground itself |
| paper (default) | 0.84 | reading |
| \`.wall\` | 0.64 to 0.57 | a change of room, still light |
| **\`.bench\`** | **0.11** | **where a page WORKS: objects lit against dark** |
| \`.deep\` | 0.03 | where a page ENDS, cool and final |

**A page may carry one \`.bench\` and one \`.deep\`.** They are not two dark bands
doing the same job: the bench is warm and lit from the same lamp as every
staged object, the close is cool and flat. Put the page's objects on the bench,
because that is the only ground on this site they can be lit against.

**A light surface inside a dark band keeps its own ink.** \`.bench h3\` and
\`.deep h3\` are descendant selectors, so a card on the bench had cream headings
on cream paper and its titles vanished. \`index.css\` carries explicit
\`.bench .card-stock h3\` style rules to put the ink back; they use real classes
rather than \`:where()\` so they outrank the inverted rule instead of tying with
it and losing on source order.

**Cream on the bench is 5.3:1 and the margin is thin.** Do not dim it with
\`opacity\`, and do not brighten the bench's lamp: at a 17% cream radial the
brightest corner measured 4.29:1, which is a fail, and the lift is largest
exactly where a heading sits.
## Run 2026-10-09-cle-rooms additions: THE LIT ROOM

Everything above still holds. This section adds the one thing the earlier
contract predates: the render kit, and the reading of it that \`/contact\` and
\`/team\` now ship. Those two pages are the reference for this run. Open them
before writing anything.

### Why this exists

The client's verdict on the site, four times in one session, was that it was
flat, and then, after a correct but generic rebuild of \`/contact\`, that it
"isn't unique in any way and it doesn't relate to CLÉ". The answer both times
is the same: the company makes needle-felted objects by hand, photographs them
and hangs them up, so its site shows objects standing in a lit room rather than
content sitting in boxes on a page. A card with a hairline and a soft shadow is
a sheet on a page. An object reads as present when it has a position in a
space, a light falling on it from somewhere in particular, a shadow that
belongs to that light, and a surface it stands on. The kit supplies those four
things and nothing else.

### The two references, and what each is for

**\`src/pages/Contact.tsx\` plus \`.rk-corr\` in render.css: THE ROOM.** One
\`.rk-studio\` panel holding a two-column scene. Five people mounted on the wall
on their own ledges, and the sheet you write on standing in front of them. Copy
this when a page has a few important objects and one block of content that has
to stay perfectly readable.

**\`src/components/team/StageSequence.tsx\` plus \`.rk-board\` / \`.rk-slip\`: THE
SHELF.** Six numbered slips standing on two shelves under one lamp, read left
to right, three across and two down, aligned by their FEET so they stand at
their own heights. Copy this when a page has a set of peer items that belong in
an order.

Mirror whichever is closer. Do not invent a third reading of the kit.

### The classes, and what each needs around it

| Class | What it is | Needs |
|---|---|---|
| \`.rk-studio\` | the room: wall panel, radius, padding, \`container-name: studio\` | \`is-armed\` / \`is-in\` from \`useRoomEntry()\` |
| \`.rk-room\` | modifier on \`.rk-studio\` that raises the wall's dark floor | a TALL room only. See the gradient trap below |
| \`.rk-rake\` | the raking light across the wall | first child of \`.rk-studio\`, \`aria-hidden\` |
| \`.rk-head\` | the picture rail: a functional shelf label, never a strapline | inside \`.rk-studio\`; pairs with \`.rk-head-rule\` + \`.rk-head-meta\` |
| \`.rk-bench\` | the grid of objects: 1 / 2 / 4 across by container width | direct children are \`.rk-item\` |
| \`.rk-board .rk-bench\` | the same grid at 3 across, with one ledge per row of three | the \`.rk-board\` modifier on \`.rk-studio\` |
| \`.rk-item\` | one cell; owns the shelf under its row via \`::after\` | \`--i\` set inline for the entry stagger |
| \`.rk-plate\` | the object's own box; margin-bottom equals the ledge height | wraps a \`Stage\` |
| \`.rk-mat\` | the cream mount a print sits on | holds \`.rk-pic\`, and the caption if there is one |
| \`.rk-pic\` | the clipped picture window inside the mount | holds \`Figure\` plus \`.rk-light\` |
| \`.rk-light\` | the light falling across the face of the picture | inside \`.rk-pic\`, \`aria-hidden\` |
| \`.rk-tag\` | a small cream label card standing at the object's foot | positioned against \`.rk-plate\` |
| \`.rk-corr__sheet\` | a FLAT lit sheet, not on a Stage | anything with text fields or controls |

\`Stage\` is the lit-object primitive: \`seated\`, \`ground="ledge"\`, \`light\`
(azimuth in degrees, 0 overhead, negative from the left), \`tilt\`, \`turn\`,
\`roll\`, \`depth\` 0 to 1, \`backdrop\`, \`rake\`, \`lift\`, \`radius\`. A board on a
ledge is \`tilt\` 5 to 8. Hand-place every pose so no two objects match: three
objects with identical poses is a shop display, not a studio.

### One lamp, not N lamps

There is ONE light in the room and every object's azimuth is the angle from
that light to that object. Compute it from the object's COLUMN, not its index,
so a second row is lit the same way as the first (the lamp is above them both).
\`StageSequence.tsx\` and \`StudioWall.tsx\` both show the two-line version of
this. A row of objects each lit by its own identical sweep reads as a row of
separate lights, which is the single tell that separates a rendered scene from
a row of cards with drop shadows.

### The sheet does not lean

Every object in this kit sits on a few degrees of 3D rotation. **Anything
holding a form field, a control, or a long block of reading does not.** A
rotated ancestor blurs text in every field and moves the caret and the native
autofill panel off the control they belong to. The room supplies the light and
the shadow; the thing the visitor has to use stays square and flat. Use
\`.rk-corr__sheet\`, which is lit by the room without being posed by it.

### The four contrast traps this codebase has already paid for

1. **Never dim a text colour with \`opacity\`.** Four separate AA failures so
   far, every one of them \`opacity\` on ink or on muted. Hierarchy comes from
   size, face and tracking. Use the token at full strength.
2. **\`--color-muted\` is the floor, and only on PAPER.** On the render kit's
   wall, text is \`--color-ink\` at full strength or it does not go on the wall.
3. **A caption on a lit wall belongs INSIDE the \`.rk-mat\`, on cream.** That is
   how a framed print carries one, and it is the only place its contrast stops
   depending on how deep the room is.
4. **The wall gradient darkens down the panel, and \`.grain\` multiplies on top.**
   A painted pixel is roughly 10% darker than the CSS colour says. A room
   tuned over 600px fails at 1200px: that is what \`.rk-room\` is for.

### Motion

\`Settle\` and \`useRoomEntry\` only. Both reveal once on entry and both collapse
under \`prefers-reduced-motion\`. No animation library, no \`@keyframes\`, no
infinite loop, no parallax, no scroll pinning. \`Relief\` (the scroll-driven
lamp) and \`HangingMarks\` (\`.rk-hang\`, which drifts forever) are mounted by the
footer and by \`/contact\` and are NOT for a shard to add: the brief puts the
characters in the supporting cast and allows one dedicated module, which is
already spent.

### Images

\`src/lib/brand.ts\` is the whole universe. Every image goes through \`Figure\`
with a key from the \`AssetKey\` union. There is no image generation on this
project and no stock photography. A key whose \`base\` is \`null\` is an unfilled
placeholder and renders a labelled block: that is correct behaviour, not
something to work around.

### Typecheck, and the one command a shard may run

\`npx tsc --noEmit -p tsconfig.app.json\`

That is the only build command. Four shards run concurrently in ONE checkout
against one \`node_modules\` and one \`dist/\`, so no shard runs \`npm install\`,
\`npm run build\` or a dev server. \`tsconfig.app.json\` is not incremental, so
concurrent typechecks are safe. Integration runs the real build. This overrides
item 1 of the earlier \`DONE-WHEN.md\`.
`

const CHECKLIST = [
  `\`npx tsc --noEmit -p tsconfig.app.json\` exits 0. That is the ONLY build command a shard may run: four shards share one checkout, one node_modules and one dist/, so no \`npm install\`, no \`npm run build\`, no dev server.`,
  `\`bash .parallel/shard-lint.sh <ExportName> <path/to/Page.tsx> <every owned file>\` exits 0. Pass FILES, never a directory: a directory in the second argument makes the export check fail open.`,
  `Nothing outside the shard's Owns list is created, edited or deleted. \`package.json\` is untouched and no npm dependency was added.`,
  `The page still exports its component under the same name from the same path, and registers no route and no nav link of its own.`,
  `Section rhythm comes from \`<Section pad=...>\`. No \`!py-*\`, \`!pt-*\`, \`!pb-*\` or any other Tailwind \`!important\` escape in the owned files.`,
  `Every button is \`<Button>\` with \`variant\` of \`primary\` or \`quiet\`, with no className colour override.`,
  `No colour, radius or easing literal that restates an existing token, and no \`opacity\` applied to a text colour anywhere.`,
  `Every image goes through \`Figure\` with a key that already exists in the \`AssetKey\` union in \`src/lib/brand.ts\`. No new image file, no new key, no generated imagery, no stock photography.`,
  `Every text and background pair meets WCAG 2.1 AA on the PAINTED pixel. On the render kit's wall that means \`--color-ink\` at full strength or a caption on a cream mount; \`--color-muted\` is the floor and only on paper.`,
  `Any motion is \`Settle\` or \`useRoomEntry\` and collapses under \`prefers-reduced-motion: reduce\`. No animation library, no \`@keyframes\`, no infinite loop, no parallax, no scroll pinning, and no \`Relief\` or \`HangingMarks\` mounted by a shard.`,
  `Anything holding a form field, a control, or a long block of reading is FLAT: never inside a \`Stage\` or any other 3D-rotated ancestor.`,
  `Where the shard stands objects in a room, there is ONE lamp: each object's light azimuth is computed from its COLUMN, and no two neighbouring objects share a pose.`,
  `No invented fact. Every claim, statistic, testimonial, logo, award, price, user number, date or coverage item either already existed in the repo or restates something the site already says. A missing fact goes to \`CONTENT-NEEDED.md\`, not onto the page.`,
  `Irish register and exact spellings: CLÉ Family Media, The Pawsitive Pugs & Pals(R), PupsPlayer(TM), Conor Sexton, EUR prices.`,
  `Zero em dashes and zero en dashes, in copy, code and comments.`,
  `The page reads at 390px wide with no horizontal overflow, and still reads at 1440px.`,
  `One \`h1\` per page, and the heading order does not skip a level.`,
  `The page carries at most one \`.bench\` and at most one \`.deep\` band, and does not add a second dark band beside an existing one.`,
]

const CONTRACT_SCHEMA = {
  type: 'object',
  required: ['contractMarkdown', 'registry', 'checklist'],
  properties: {
    contractMarkdown: { type: 'string', description: 'the full CONTRACT.md text' },
    // ONE done-list, written once, injected verbatim into build, repair, escalate AND review.
    // Builder and gate used to score different lists (the build prompt asked for content-visibility
    // and tabular-nums, the gate never checked them; the gate failed em dashes the build prompt
    // never mentioned). Asymmetric checklists manufacture findings. This is the symmetry.
    checklist: {
      type: 'array',
      description: 'the shared DONE list for this run - every item objectively checkable by reading one shard, ordered contract items first. The gate may fail a shard ONLY on an item in this list or a lint FAIL.',
      items: { type: 'string' },
    },
    registry: {
      type: 'array',
      items: {
        type: 'object',
        required: ['route', 'exportName', 'exportPath'],
        properties: {
          route: { type: 'string' },
          exportName: { type: 'string' },
          exportPath: { type: 'string' },
          navLabel: { type: 'string' },
        },
      },
    },
  },
}

const SHARD_RESULT_SCHEMA = {
  type: 'object',
  required: ['filesCreated', 'contractGaps'],
  properties: {
    filesCreated: { type: 'array', items: { type: 'string' } },
    contractGaps: {
      type: 'array',
      description: 'missing fields/tokens/components the worker needed but could not add',
      items: { type: 'string' },
    },
  },
}

// Scored rubric (reference/review-rubric.md): three weighted dimensions + a numeric threshold,
// instead of a prose pass/fail. Adapted from local-deep-research + dexter (extract-then-compare
// grading, weighted score, pass threshold). Contract weighted highest - a breach is what collides.
const REVIEW_SCHEMA = {
  type: 'object',
  required: ['passed', 'contract', 'correctness', 'fidelity', 'overall', 'findings'],
  properties: {
    contract: { type: 'number', description: 'contract-adherence score 0.0-1.0 (weight 0.60)' },
    correctness: { type: 'number', description: 'correctness score 0.0-1.0 (weight 0.25)' },
    fidelity: { type: 'number', description: 'house-DNA fidelity score 0.0-1.0 (weight 0.15)' },
    overall: { type: 'number', description: '0.60*contract + 0.25*correctness + 0.15*fidelity' },
    passed: { type: 'boolean', description: 'true iff overall >= 0.90 AND contract >= 0.85 AND correctness >= 0.85' },
    findings: {
      type: 'array',
      description: 'specific actionable fixes when passed=false (file:line + problem + fix); empty when passed',
      items: { type: 'string' },
    },
  },
}

const INTEGRATE_SCHEMA = {
  type: 'object',
  required: ['buildPassed', 'report'],
  properties: {
    buildPassed: { type: 'boolean' },
    gapsResolved: { type: 'array', items: { type: 'string' } },
    spotCheck: { type: 'array', items: { type: 'string' }, description: 'manual checks for the user' },
    report: { type: 'string' },
  },
}

// 1. Foundation - ALREADY DONE, ON DISK, BY HAND.
//
// The first attempt at this run dispatched a foundation agent, which claimed the run's files and
// tuned .parallel/shard-lint.sh and then died 25 minutes in on "SSL certificate hostname mismatch",
// a transient network fault, before it could return a contract. Re-running it would have paid
// another ~165k tokens for an agent to re-read files the orchestrator had already read in this
// same session.
//
// So the contract was written by hand instead, which is what the foundation phase is FOR on an
// edit run: there is nothing to build, only something to write down. .parallel/CONTRACT.md extends
// the previous run's frozen contract with a new `## Run 2026-10-09-cle-rooms` section (the
// multi-run rule: extend, never rewrite, because an earlier run's shards were built against the
// version they were handed). .parallel/CHECKLIST.md is this run's DONE-WHEN list. Both are read
// from disk at dispatch time by the orchestrator and inlined below.
//
// The pbuild claims from the failed attempt are still held by this RUN_ID, so file ownership did
// not need re-claiming.
// ponytail: inlined strings rather than a file read, because the workflow runtime evaluates this
// script without a filesystem. Re-paste if either file changes.
//
// The phase() call stays even though it dispatches nothing: it is the marker parallel-lint cuts
// the pure-config block at, and the phase is still real work, it was just done by hand.
phase('Foundation')
const contract = {
  contractMarkdown: CONTRACT_MARKDOWN,
  checklist: CHECKLIST,
  registry: SHARDS.map((x) => ({ route: x.route, exportName: x.exportName, exportPath: x.exportPath })),
}
log(`Contract frozen: ${contract.registry.length} routes. Shards on ${CHEAP}, gate on ${STRONG}.`)

// ---- Prompt builders (defined after the contract exists) ------------------------
// Cheap-model hardening, folded into every build/escalate prompt. Adapted from the Karpathy
// CLAUDE.md rules (multica-ai/andrej-karpathy-skills, MIT): surgical + simple + state-assumptions +
// goal-driven, retuned for autonomous fanout (no stop-and-ask; report gaps instead).
const HARDENING = `SHARD DISCIPLINE (keep the diff clean and reviewable): touch only your Owns files
- every changed line traces to the task, no drive-by edits to adjacent code or the foundation.
Minimum code that mirrors the reference - no speculative abstraction, no config for a constant, no
error handling for impossible cases. State any assumption in your result rather than guessing
silently (you cannot stop to ask mid-fanout). Self-check against your DONE-WHEN list before reporting done.`

// Injected verbatim into build, repair, escalate and review. The gate scores against exactly this
// list and nothing else, so the shard is graded on the list it was handed.
const CHECKLIST_BLOCK = `

DONE-WHEN CHECKLIST (the review gate scores against THIS list and nothing else):
- ${(contract.checklist || []).join('\n- ') || '(none returned - the gate falls back to the rubric)'}`

// Deterministic half of the gate, runnable by the shard. Everything it catches is a finding the
// reviewer never has to write, and a cheap model can iterate a grep to exit 0 where it cannot
// iterate a taste judgement.
const lintCmd = (s) => `bash .parallel/shard-lint.sh ${s.exportName} ${s.exportPath} ${s.owns.join(' ')}`

const LINT_BLOCK = (s) => `

MECHANICAL LINT - run from ${REPO}, fix, re-run, until it exits 0:
  ${lintCmd(s)}
It catches em dashes, leftover placeholders, slop colours, gradient-filled headings, missing alt
text, a missing prefers-reduced-motion collapse and a missing export. Every FAIL line it prints is
a finding the gate will otherwise fail you on. Do not report done while it exits non-zero; if a
FAIL is in a file you do not own, leave it and report it as a contract gap.`

const buildPrompt = (s) => `You are building ONE part of ${PROJECT} in parallel with other
workers. You share NOTHING with them at runtime. Your only shared reference is this frozen
contract (do NOT edit it):\n\n${contract.contractMarkdown}\n\n
YOUR TASK: ${s.task}
BUILD EXACTLY THIS - mirror ${s.reference}; match its section rhythm + component usage; do not
invent structure.
YOU OWN (create/edit only these): ${s.owns.join(', ')}
DO NOT TOUCH: any foundation file (index.css, lib/*, chrome, data module), src/App.tsx, the Nav
array, Footer, or another page's folder.
Import tokens/motion/data/chrome from the contract BY NAME (never redefine). Export a component
named ${s.exportName} from ${s.exportPath} (route ${s.route}). Do NOT register your own route or
nav link - integration does that.
HOUSE DNA (inline - do not rely on reading another doc): no purple/indigo or indigo->blue
gradients, no gradient-filled headings, no centered-hero + three-identical-icon-cards, no bare
shadcn/zinc/slate defaults, no rounded-2xl+shadow-lg on everything. One rationed accent, committed
warm surface, the type triad already in the tokens. Responsive at 480/900/1100/1280,
prefers-reduced-motion collapse, real copy (no lorem/placeholder).
${HARDENING}
If you need a field/token/component not in the contract: STOP. Do not edit a foundation file or
invent a parallel version - report it as a contract gap.
${CHECKLIST_BLOCK}${LINT_BLOCK(s)}`

// Codex shards: a Workflow script can only spawn Claude subagents, so a thin dispatcher agent
// shells out to the Codex CLI and reports back in the normal shard schema. It writes no project
// code itself, so it runs on haiku. agentType must be 'general-purpose' - the mtmn-shard-*
// specialists have no Bash tool.
const codexDispatchPrompt = (s) => `You are a DISPATCHER. You write NO project code yourself.

1. Write the text between the markers below, verbatim and unedited, to
   ~/.codex/tasks/staging/${s.label}.md (create the directory if needed).
---8<--- BEGIN SHARD PROMPT
${buildPrompt(s)}
---8<--- END SHARD PROMPT

2. Dispatch it in the BACKGROUND, with Bash(run_in_background: true), redirecting to a known file:
     ${PBUILD} run --weight ${s.weight || '10G'} --label shard-${s.label} -- ${CODEX_TASK} shard ${REPO} ~/.codex/tasks/staging/${s.label}.md ${s.label} > <scratch>/shard-${s.label}.out 2>&1
   **Never run this in the foreground.** Measured on real repos a cold review takes 7 to 64
   minutes and the Bash tool's hard ceiling is 10 minutes, so a foreground call is KILLED
   mid-review. \`pbuild run\` then never reaches its release, the admission is orphaned, and this
   step reports "no findings" for a review that never finished - a silently vacuous gate.

3. Wait for it to finish, also with Bash(run_in_background: true), and do not proceed until it exits:
     until [ -s <scratch>/shard-${s.label}.out ] && grep -qE 'verdict=|TURN 1 FAILED|exit=' <scratch>/shard-${s.label}.out; do sleep 60; done
   If it has not finished after 90 minutes, treat the review as failed rather than as clean.
   pbuild blocks until the machine can afford the weight. A repo-heavy Codex shard peaks 9-10G;
   unbudgeted concurrent shards OOM this laptop rather than merely running slowly. The out file
   carries "exit=N result=<path> log=<path> changed=<path>".

4. Read the changed file and the result file. changed.txt is git status --porcelain for the repo:
   that is the REAL list of what Codex touched. last.txt is Codex's own structured summary.

5. Return filesCreated from changed.txt (the real paths, not what last.txt claims), and
   contractGaps from last.txt (gaps, blockers, assumptions it reported).

If exit is non-zero, or result is empty, or changed.txt shows edits to files outside
${s.owns.join(', ')}: return filesCreated: [] and put the reason plus the tail of log.txt in
contractGaps. Do not try to fix it yourself - the review gate will fail it and escalate.`

const reviewPrompt = (s, built, priorFindings) => `You are the QUALITY GATE for the "${s.label}" shard of
${PROJECT}. A cheaper model built it; hold it to the strong-model bar. Inspect ONLY these files on
disk: ${s.owns.join(', ')}. Frozen contract:\n\n${contract.contractMarkdown}\n\n
Files it reported creating: ${((built && built.filesCreated) || []).join(', ') || '(none reported)'}.
FIRST extract what the shard ACTUALLY did: read its owned files and list the sections it rendered,
imports it used, copy it shipped. Grade THAT against the spec, not an imagined ideal (grading
against a perfect mental shard inflates failures). Run a typecheck/build first if you can - a shard
that doesn't compile fails on correctness regardless of looks.
Then run the mechanical lint - it is the deterministic half of your own rubric, already run by the
shard, and re-running it is free:
  ${lintCmd(s)}
Anything it PASSES is settled: do not re-litigate em dashes, placeholders, slop colours, alt text or
the reduced-motion collapse by eye. Anything it FAILS is a finding, quoted from its output.
Score three weighted dimensions, each 0.0-1.0:
1. CONTRACT ADHERENCE (0.60) - imported tokens/motion/data/chrome BY NAME; touched only its owned
   files; created nothing in foundation/other shards; exported ${s.exportName} from ${s.exportPath};
   registered no route/nav itself.
2. CORRECTNESS (0.25) - compiles; bugs, unhandled edge cases, missing a11y, missing
   prefers-reduced-motion collapse, broken responsive (480/900/1100/1280), leftover lorem/placeholder,
   em dashes in shipping copy.
3. HOUSE-DNA FIDELITY (0.15) vs ${s.reference} - no AI-slop tells (purple/indigo gradients,
   gradient-filled headings, centered-hero + three-icon-cards, bare shadcn/zinc defaults), one
   rationed accent, committed warm surface.
overall = 0.60*contract + 0.25*correctness + 0.15*fidelity. Set passed=true iff overall >= 0.90 AND
contract >= 0.85 AND correctness >= 0.85, else passed=false with a specific, actionable findings
list (file:line + what's wrong + the fix). Both floors are hard and independent of the overall.
Return all three sub-scores + overall. Do NOT rewrite the shard yourself - that's the repair step.
Don't nitpick style that doesn't change meaning or violate the DNA. A Codex run reviews the
same shard's code-level logic in parallel; ignore it and score independently.
${CHECKLIST_BLOCK}
You may fail this shard ONLY on a checklist item above or a lint FAIL line. An observation that is
neither goes in \`findings\` prefixed \`ADVISORY:\` and must NOT move a score - integration reads
those. A gate that invents its own bar rebuilds correct work on the strong model, which is the exact
cost this run exists to avoid.${(priorFindings && priorFindings.length) ? `

THIS IS THE SECOND PASS. The shard was handed these findings and told to fix them; confirm each one
is actually resolved and say so per finding. A finding still open is still a fail:
- ${priorFindings.join('\n- ')}` : ''}`

// Second reviewer: COLD, two turns, different model family, ChatGPT-plan quota. Turn 1 sees no
// brief, no contract and no house docs (isolated CODEX_HOME with no AGENTS.md) and must infer what
// the code is for. Turn 2 resumes that session, reveals the spec, and re-triages. Incompatible with
// ISOLATION = true (the wrapper runs against a fixed workdir, not a worktree).
const CODEX_COLD_SCHEMA = {
  type: 'object',
  required: ['coldStatus', 'inferredPurpose', 'real', 'explained', 'uncertain', 'intentMismatch', 'misrepresents', 'misrepresentsEvidence'],
  properties: {
    coldStatus: { type: 'string', description: '"returned" ONLY if a verdict.json was read; "absent" if the run produced none. Absent is a hold, not a pass.' },
    inferredPurpose: { type: 'string', description: "turn 1's reading of what the code is for, verbatim" },
    real: {
      type: 'array',
      description: 'turn-1 defects turn 2 kept as real after seeing the spec (file:line + problem + fix), each naming the concrete failure it causes. These FAIL the shard.',
      items: { type: 'string' },
    },
    explained: {
      type: 'array',
      description: 'turn-1 defects the revealed context explains away, each with the reason. Kept for the record, never a failure.',
      items: { type: 'string' },
    },
    uncertain: {
      type: 'array',
      description: 'turn-1 defects turn 2 could not settle. Passed to integration as notes, never a failure on their own.',
      items: { type: 'string' },
    },
    intentMismatch: { type: 'string', description: 'where the inferred purpose disagreed with the real task; empty string if they agree' },
    misrepresents: { type: 'boolean', description: 'true ONLY when a quotable code artefact states something false - this FAILS the shard. A gap in the reviewer own reading is never misrepresentation.' },
    misrepresentsEvidence: { type: 'string', description: 'file:line plus the exact name/comment/signature that states something false; empty string when misrepresents is false' },
  },
}

// Warm pass, only when REVIEW_DEPTH === 'both'. Spec in hand, judges code-level logic.
const CODEX_WARM_SCHEMA = {
  type: 'object',
  required: ['blocking', 'notes'],
  properties: {
    blocking: {
      type: 'array',
      description: 'defects that must be fixed before this shard ships (file:line + problem + fix); empty if none',
      items: { type: 'string' },
    },
    notes: {
      type: 'array',
      description: 'advisory observations passed to integration, never a failure on their own',
      items: { type: 'string' },
    },
  },
}

const codexColdPrompt = (s) => `You are a DISPATCHER. You write NO project code, you review
nothing yourself, and you edit nothing. You run a two-turn COLD review and report what it found.

1. Write these two prompt files to the scratchpad.

COLD PROMPT (turn 1 - it must contain NO task description, NO contract, and NO house rules):
---8<--- BEGIN COLD
Before anything else, answer this in one line: does your context include an AGENTS.md, a CLAUDE.md,
or any other user-supplied project or house instructions file? Answer exactly "none", or name the
files. Your own built-in Codex system prompt does NOT count and must not be mentioned.

Then: read this repository. You have been given no description of it and no task brief.

1. INFERRED PURPOSE. State what the code in these files is for, what contract it appears to offer
   its callers, and what invariants it is evidently trying to hold. Write it as you would brief a
   new engineer. Read the wider repo freely for context, but report only on: ${s.owns.join(', ')}
2. DEFECTS. List every real defect in those files, judged only against the intent you just
   inferred. Format each as \`file:line - problem - fix\`. Rank them, worst first.

Do not edit anything.
---8<--- END COLD

REVEAL PROMPT (turn 2):
---8<--- BEGIN REVEAL
Now here is the real specification you were not given:

TASK: ${s.task}
EXPORTS: ${s.exportName} from ${s.exportPath}${s.route ? ` (route ${s.route})` : ''}
OWNS: ${s.owns.join(', ')}
CONTRACT EXTRACT:
${contract.contractMarkdown}

Do two things:
1. TRIAGE. Take EVERY defect from your previous message, in order, and reclassify each as one of
   \`real\` / \`explained-by-context\` / \`uncertain\`, with one line of reason. You may not delete a
   finding.
   - \`real\` requires a CONCRETE FAILURE: the inputs or state that trigger it, and the wrong
     outcome that results. If you cannot name one, it is \`uncertain\`, not \`real\`.
   - \`explained-by-context\` when the revealed context resolves it. Say which part resolves it.
   - Do not downgrade a genuine defect just because the surrounding design was deliberate, and do
     not keep one the context plainly resolves. Both are failures.
2. INTENT MISMATCH. Compare the purpose you inferred against the real specification. Report every
   place they disagree.
   \`misrepresents\` is true ONLY if a specific artefact in the code actively states something
   false: a name, a comment, a type, a signature or a documented contract that a competent
   engineer would act on and be wrong. Quote that artefact with file:line in
   \`misrepresentsEvidence\`. If you cannot quote one, \`misrepresents\` is FALSE.
   These are NOT misrepresentation: your own turn-1 reading was incomplete or partly wrong; the
   specification adds detail the code does not contradict; the code is unfinished but honest
   about it. A gap in what you happened to read is your gap, not the code lying.

END your message with a fenced json block, as the very last thing, with exactly these keys:
{"inferredPurpose": "<your turn-1 reading, one paragraph>",
 "real": ["file:line - problem - fix", ...],
 "explained": ["the finding - which part of the spec explains it", ...],
 "uncertain": ["the finding - what you could not settle", ...],
 "intentMismatch": "<where inferred and real purpose disagree, or empty string>",
 "misrepresents": <true ONLY with a quotable artefact, per the rule above>,
 "misrepresentsEvidence": "<file:line plus the exact name/comment/signature that states something false, or empty string>"}
---8<--- END REVEAL

2. Dispatch it in the BACKGROUND, with Bash(run_in_background: true), redirecting to a known file:
     setsid timeout 5700 ${PBUILD} run --weight 1G --label cold-${s.label} -- ${CODEX_COLD} ${REPO} <cold file> <reveal file> ${s.label} > <scratch>/cold-${s.label}.out 2>&1
   **Never run this in the foreground.** Measured on real repos a cold review takes 7 to 64
   minutes and the Bash tool's hard ceiling is 10 minutes, so a foreground call is KILLED
   mid-review. \`pbuild run\` then never reaches its release, the admission is orphaned, and this
   step reports "no findings" for a review that never finished - a silently vacuous gate.

3. Wait for it to finish, also with Bash(run_in_background: true), and do not proceed until it exits.
   Poll for the ARTEFACT, not for the out file, because the out file is written last and a run that
   is still producing turn 2 looks identical to one that died:
     for i in $(seq 1 95); do ls ~/.codex/tasks/*-cold-${s.label}/verdict.json 2>/dev/null && break; grep -q 'TURN 1 FAILED' <scratch>/cold-${s.label}.out 2>/dev/null && break; sleep 60; done
   Set \`coldStatus\` to "returned" ONLY when you have read a verdict.json. If the bound expires with
   no verdict, set coldStatus "absent" and real: [] - and say so in uncertain. Measured on the
   Iacchus M8 wave, five of five dispatchers mis-reported this step: two runs were killed with their
   dispatcher and three COMPLETED and wrote a verdict that the dispatcher had already given up on,
   so 69 real findings were recorded as zero and three shards were scored clean by a channel that
   had in fact failed them. An absent cold channel is a HOLD, never a pass.
   The out file carries "exit=N session=... cold=<turn1> triage=<turn2> verdict=<path> changed=<path>".

4. Read verdict.json, turn1.txt's first line, and changed.txt. Do NOT re-derive the buckets by
   reading turn2.txt prose: the real/explained split is the verdict, and re-reading the narrative
   is how a genuine defect quietly becomes "explained by context".
   - verdict.json empty or missing means turn 2 emitted no parseable block. That is a FAILED run:
     return real: [] with the reason in uncertain. Do not hand-parse turn2.txt.
   - turn1's FIRST LINE answers the isolation probe. It fails ONLY if it names a project
     instructions file (AGENTS.md, CLAUDE.md or similar). A model describing its own built-in
     system prompt is NOT a failure - that phrasing varies run to run and the house doc is still
     absent. On a genuine failure return real: [] with "cold isolation failed" in uncertain; its
     findings are void, do not report them as real.
   - changed.txt must be empty. A read-only reviewer that wrote files is itself a real finding.

5. Return the seven fields of verdict.json unchanged. Copy them; do not re-judge, re-word, merge
   or drop any entry.

If codex-cold exits non-zero or turn2 is missing, return real: [] with the failure in uncertain -
a broken reviewer must not fail a good shard.`

// Warm pass, only when REVIEW_DEPTH === 'both'. Spec in hand, code-level logic, second channel.
const codexWarmPrompt = (s) => `Dispatch a WARM Codex code review for the "${s.label}" shard of
${PROJECT} and report what it found. Do NOT review the code yourself and do NOT edit anything.
1. Write a prompt file to the scratchpad containing exactly this brief:
   "Review ONLY these files: ${s.owns.join(', ')}. The task they implement: ${s.task}
    Judge the CODE, not the visual design and not any project convention you cannot see:
    the logic it chose, the methods and algorithms, correctness of edge cases, error handling,
    resource and lifecycle handling, and whether the approach taken was the right one for the task.
    Report each real defect as 'file:line - problem - fix'. Separate defects that MUST be fixed
    before shipping from advisory observations. Do not report style preferences. Do not edit files."
2. Dispatch it in the BACKGROUND, with Bash(run_in_background: true), redirecting to a known file:
     ${PBUILD} run --weight 1G --label warm-${s.label} -- ${CODEX_TASK} review ${REPO} <that prompt file> warm-${s.label} > <scratch>/warm-${s.label}.out 2>&1
   **Never run this in the foreground.** Measured on real repos a cold review takes 7 to 64
   minutes and the Bash tool's hard ceiling is 10 minutes, so a foreground call is KILLED
   mid-review. \`pbuild run\` then never reaches its release, the admission is orphaned, and this
   step reports "no findings" for a review that never finished - a silently vacuous gate.

3. Wait for it to finish, also with Bash(run_in_background: true), and do not proceed until it exits:
     until [ -s <scratch>/warm-${s.label}.out ] && grep -qE 'verdict=|TURN 1 FAILED|exit=' <scratch>/warm-${s.label}.out; do sleep 60; done
   If it has not finished after 90 minutes, treat the review as failed rather than as clean.
4. Read the last.txt path named in the out file, and also read its changed.txt: if changed.txt is
   non-empty the review wrote files it should not have, and that is itself a blocking finding.
5. Return the must-fix defects in blocking and the advisory ones in notes, verbatim enough to act
   on blind. If codex-task exits non-zero, return blocking: [] and put the failure in notes.`

// Preflight for one shard: hold dispatch while the machine is under pressure, then hold again if
// this shard depends on another RUN's shard. Both are waits, so they share one agent.
//
// The pressure gate is why a session under load stalls instead of dying. It deliberately holds at
// the DISPATCH boundary and never touches the session process: SIGSTOPping a Claude session times
// out its in-flight API calls and looks identical to a hang, so the session keeps running and
// simply launches nothing new. A Codex shard dispatched through `pbuild run` is gated the same way
// from inside; this covers the in-process shards, which never touch pbuild otherwise.
//
// dependsOn is allowed BETWEEN runs only. Two shards inside one run that depend on each other are
// not parallel.
// A shard counts as strong-tier however it was spelled. Pinning STRONG to a full model id turned
// a shard written `model: 'opus'` into a cheap one, which then went to a CHEAP repair round: a
// downgrade dressed as a fix. reference/gate-flow.test.mjs caught it the moment the pin landed,
// which is the whole reason that file exists.
const onStrongTier = (model) => model === STRONG || model === 'opus' || String(model).startsWith('claude-opus')

const preflightPrompt = (s) => `Run these in order and report each exit code, nothing else. Do not
read or edit any project file.

1. ${PBUILD} gate --timeout 1800
   Holds until the machine can take more work. Exit 0 proceed. Exit 2 timed out: say so and stop.
${s.dependsOn ? `
2. ${PBUILD} wait --repo ${REPO} --run ${RUN_ID} ${s.dependsOn} --timeout 3600
   Exit 0 the dependency finished, proceed. Exit 1 it FAILED, say so and stop. Exit 2 timed out,
   say so and stop.` : ''}`

// A Workflow script has no filesystem access of its own, so one tiny Bash-capable agent records
// each shard's final state for any OTHER run waiting on it. `pbuild claim` already wrote `pending`,
// and a waiter only cares about done/failed, so there is no `running` mark to keep in sync.
// Every verdict, on disk. Seven measurements of this pipeline exist and all seven were hand-tallied
// out of session transcripts, because nothing persisted a score. Without the tally there is no way
// to know which dimension is actually failing shards, so every fix to this file is a guess.
// One line per shard, appended by the same haiku+Bash trick as `mark`. JSON.stringify emits a
// single line with newlines escaped, so the quoted heredoc is safe against anything a finding says.
// Freeze the shard as the gate sees it, before any repair touches it. Result ignored on purpose.
const snapshot = (s) =>
  agent(
    `Run exactly this and report nothing else:\n${SHADOW_SNAP} ${REPO} ${RUN_ID} ${s.label} ${s.model || CHEAP} ${s.owns.map((o) => `'${o}'`).join(' ')} <<'MTMNSPEC'\nTASK: ${s.task}\nREFERENCE: ${s.reference || '-'}\nOWNS: ${s.owns.join(', ')}\n${CHECKLIST_BLOCK}\n\nCONTRACT:\n${contract.contractMarkdown}\nMTMNSPEC`,
    { label: `snap:${s.label}`, phase: 'Review', model: 'haiku', agentType: 'general-purpose' })

const record = (d) => {
  const g1 = d.review1 || d.review
  const g2 = d.review2
  const row = JSON.stringify({
    run: RUN_ID,
    shard: d.shard.label,
    tier: d.shard.model || CHEAP,
    agentType: d.shard.agentType || 'mtmn-shard-frontend',
    depth: REVIEW_DEPTH,
    gate1: g1 ? { passed: g1.passed, contract: g1.contract, correctness: g1.correctness, fidelity: g1.fidelity, overall: g1.overall } : null,
    gate2: g2 ? { passed: g2.passed, contract: g2.contract, correctness: g2.correctness, fidelity: g2.fidelity, overall: g2.overall } : null,
    coldReal: ((d.cold && d.cold.real) || []).length,
    coldStatus: (d.cold && d.cold.coldStatus) || 'absent',
    warmBlocking: ((d.warm && d.warm.blocking) || []).length,
    repaired: Boolean(d.repaired),
    escalated: Boolean(d.escalated),
    outcome: d.escalated ? 'escalated' : d.repaired ? 'repaired' : d.passed ? 'clean' : 'unresolved',
    findings: (d.findings || []).slice(0, 40),
  })
  return agent(
    `Run exactly this and report nothing else:\nmkdir -p ${REPO}/.parallel/reviews && printf '*\\n' > ${REPO}/.parallel/reviews/.gitignore && cat > ${REPO}/.parallel/reviews/${RUN_ID}.${d.shard.label}.json <<'MTMNVERDICT'\n${row}\nMTMNVERDICT`,
    { label: `record:${d.shard.label}`, phase: 'Review', model: 'haiku', agentType: 'general-purpose' })
}

const mark = (s, state) =>
  agent(`Run exactly this and report nothing else: ${PBUILD} status --run ${RUN_ID} --shard ${s.label} ${state}`,
        { label: `mark:${s.label}`, phase: 'Review', model: 'haiku', agentType: 'general-purpose' })

// Middle rung between a failed gate and a full strong-model author. Most findings measured across
// seven runs were mechanical (a missing collapse, an alt, a token imported by value instead of by
// name), and paying Opus to re-author a whole page for those is what killed the cost axis. One
// cheap fix round + one re-gate is cheaper than one Opus author, and it keeps the shard's own
// context. Escalation still exists for what a fix round cannot save.
const repairPrompt = (s, findings) => `FIX the "${s.label}" shard of ${PROJECT} you just built. It
FAILED the quality gate. Do NOT rebuild it from scratch - the work on disk is mostly right. Apply
every finding below in place, then re-run the lint until it exits 0, then re-run the typecheck.
Frozen contract:\n\n${contract.contractMarkdown}\n\n
YOU OWN (only these): ${s.owns.join(', ')}. Same rules as the build: import by name, export
${s.exportName} from ${s.exportPath}, touch no foundation file, register no route or nav.
FINDINGS TO FIX (ignore any line prefixed ADVISORY: - those are notes for integration, not failures):
- ${(findings || []).join('\n- ') || '(none returned)'}
${CHECKLIST_BLOCK}${LINT_BLOCK(s)}
If a finding cannot be fixed inside your owned files, say so explicitly in contractGaps with the
reason. Do not touch a file you do not own to make a finding go away.`

const escalatePrompt = (s, findings) => `Re-do the "${s.label}" shard of ${PROJECT} on the STRONG
model. The cheaper attempt FAILED the quality gate. Frozen contract:\n\n${contract.contractMarkdown}\n\n
YOUR TASK: ${s.task}  Mirror ${s.reference}.
YOU OWN (only these): ${s.owns.join(', ')}. Same rules: import by name, export ${s.exportName} from
${s.exportPath}, don't touch foundation or other shards, don't register your own route/nav.
APPLY EVERY REVIEW FINDING (fix in place or rebuild as needed). A cheap fix round already tried and
did not clear the gate, so read these as the second attempt's brief, not the first:
- ${(findings || []).join('\n- ') || '(no specifics returned - rebuild to the house bar)'}
${CHECKLIST_BLOCK}${LINT_BLOCK(s)}`

// 2-3. Per shard: build (CHEAP) -> review (STRONG) -> escalate-on-fail (STRONG). Pipelined, so a
// fast shard is reviewed while a slow one is still building. Phases set per-agent (race-safe in
// pipeline). A null/failed cheap build flows into review, fails, and auto-escalates to STRONG.
const finished = await pipeline(
  SHARDS,
  (s) =>
    // Preflight: pressure gate, plus a cross-run dependency wait if this shard declared one.
    agent(preflightPrompt(s), {
      label: `preflight:${s.label}`, phase: 'Build', model: 'haiku', agentType: 'general-purpose',
    }).then(() =>
    (s.model === 'codex'
      ? agent(codexDispatchPrompt(s), {
          label: `codex:${s.label}`,
          phase: 'Build',
          model: 'haiku',                   // dispatcher only - the real work runs in the Codex CLI
          agentType: 'general-purpose',     // needs Bash; the shard specialists do not have it
          schema: SHARD_RESULT_SCHEMA,
        })
      : agent(buildPrompt(s), {
          label: `build:${s.label}`,
          phase: 'Build',
          model: s.model || CHEAP,
          schema: SHARD_RESULT_SCHEMA,
          agentType: s.agentType || 'mtmn-shard-frontend',   // never a generic worker - specialist is the floor
          ...(ISOLATION ? { isolation: 'worktree' } : {}),
        })
    )).then((built) => ({ shard: s, built })),
  // Reviewers, concurrently. The Opus gate scores the shard AGAINST the spec. The cold Codex pass
  // is given no spec at all on turn 1 and must infer intent from the code, then re-triages on turn
  // 2 once the spec is revealed - that is the channel that can see an architectural misstep, which
  // conformance review structurally cannot. At depth 'both' a warm Codex pass runs as a third
  // channel. Codex costs no Anthropic tokens and never enters this context.
  (prev) =>
    parallel([
      () =>
        agent(reviewPrompt(prev.shard, prev.built), {
          label: `review:${prev.shard.label}`,
          phase: 'Review',
          model: STRONG,
          agentType: 'mtmn-review-gate',
          schema: REVIEW_SCHEMA,
        }),
      () =>
        ISOLATION
          ? Promise.resolve(null)          // worktree mode: co-review moves to integration
          : agent(codexColdPrompt(prev.shard), {
              label: `cold:${prev.shard.label}`,
              phase: 'Review',
              model: 'haiku',              // dispatcher only - the real review runs in the Codex CLI
              agentType: 'general-purpose', // needs Bash
              schema: CODEX_COLD_SCHEMA,
            }),
      () =>
        ISOLATION || REVIEW_DEPTH !== 'both'
          ? Promise.resolve(null)
          : agent(codexWarmPrompt(prev.shard), {
              label: `warm:${prev.shard.label}`,
              phase: 'Review',
              model: 'haiku',
              agentType: 'general-purpose',
              schema: CODEX_WARM_SCHEMA,
            }),
      () => (SHADOW && !ISOLATION ? snapshot(prev.shard) : Promise.resolve(null)),
    ]).then(([review, cold, warm]) => {
      const coldReal = (cold && cold.real) || []
      const warmBlocking = (warm && warm.blocking) || []
      // A cold reader that reconstructed a purpose the spec contradicts means the code
      // misrepresents itself, which fails the shard on its own with no defect list needed. But it
      // only counts WITH the quoted artefact: measured 2026-09-01 this fired true purely because
      // the reviewer had read a module as read-only where the spec said read-write, which is the
      // reviewer's gap, not the code lying. Requiring evidence here as well as in the prompt means
      // an unevidenced flag cannot fail a shard even if a future model ignores the instruction.
      const misrepresents = Boolean(cold && cold.misrepresents && (cold.misrepresentsEvidence || '').trim())
      return {
        ...prev,
        review,
        cold,
        warm,
        // An absent cold channel is not a clean one. A run that never returned tells you nothing,
        // and reading it as a pass is how 69 findings went unrecorded on the Iacchus M8 wave.
        coldAbsent: !ISOLATION && !(cold && cold.coldStatus === 'returned'),
        passed: Boolean(review && review.passed) && !coldReal.length && !warmBlocking.length && !misrepresents &&
          (ISOLATION || Boolean(cold && cold.coldStatus === 'returned')),
        findings: [
          ...((review && review.findings) || []),
          ...coldReal,
          ...warmBlocking,
          ...(misrepresents ? [`INTENT MISMATCH at ${cold.misrepresentsEvidence} - the code does not read as what it is for: ${cold.intentMismatch}`] : []),
        ],
        // never a failure on their own, but integration should see them
        notes: [...((cold && cold.uncertain) || []), ...((warm && warm.notes) || [])],
      }
    }),
  (prev) => {
    const s = prev.shard
    const blocking = (prev.findings || []).filter((f) => !/^ADVISORY:/.test(f))
    // Worth a cheap fix round only when a cheap author can plausibly close the gap: the shard
    // actually produced something, it was NOT already built on the strong tier (repairing that on
    // the cheap tier is a downgrade), and the list reads as fixes rather than a rewrite.
    const repairable = !prev.passed && REPAIR_ROUND && prev.built &&
      !onStrongTier(s.model) && s.model !== 'codex' && blocking.length <= REPAIR_MAX_FINDINGS

    // The Codex channels do NOT re-run: a cold review costs 7-64 minutes and its round-1 findings
    // were already handed to the fix round. The re-gate is told they existed and must confirm each.
    const afterRepair = repairable
      ? agent(repairPrompt(s, prev.findings), {
          label: `repair:${s.label}`,
          phase: 'Review',
          model: s.model || CHEAP,
          agentType: s.agentType || 'mtmn-shard-frontend',
          schema: SHARD_RESULT_SCHEMA,
        }).then((built) =>
          agent(reviewPrompt(s, built || prev.built, blocking), {
            label: `regate:${s.label}`,
            phase: 'Review',
            model: STRONG,
            agentType: 'mtmn-review-gate',
            schema: REVIEW_SCHEMA,
          }).then((r2) => ({
            ...prev,
            built: built || prev.built,
            review1: prev.review,
            review2: r2,
            repaired: true,
            passed: Boolean(r2 && r2.passed),
            findings: (r2 && r2.findings) || [],
          })))
      : Promise.resolve(prev)

    return afterRepair
      .then((fixed) =>
        fixed.passed
          ? fixed
          : agent(escalatePrompt(s, fixed.findings), {
              label: `escalate:${s.label}`,
              phase: 'Review',
              model: STRONG,
              agentType: s.agentType || 'mtmn-shard-frontend',   // keep the persona on the strong-model rebuild
              schema: SHARD_RESULT_SCHEMA,
            }).then((built) => ({ ...fixed, built, escalated: true })))
      .then((done) =>
        // Terminal state, so a shard in ANOTHER run that declared `dependsOn` on this one unblocks
        // (or fails fast) instead of sitting out its timeout. The verdict lands on disk first.
        record(done).then(() => mark(done.shard, done.built ? 'done' : 'failed')).then(() => done))
  },
)

const built = finished.filter(Boolean)
const escalated = built.filter((b) => b.escalated).map((b) => b.shard.label)
const repaired = built.filter((b) => b.repaired && !b.escalated).map((b) => b.shard.label)
const cleanFirstPass = built.filter((b) => !b.repaired && !b.escalated).map((b) => b.shard.label)
log(`Gate outcome: ${cleanFirstPass.length} clean on ${CHEAP}, ${repaired.length} saved by the cheap repair round, ${escalated.length} escalated to ${STRONG}. Verdicts in .parallel/reviews/.`)
if (repaired.length) log(`Repaired on ${CHEAP} and re-gated clean: ${repaired.join(', ')}`)
if (escalated.length) log(`Escalated to ${STRONG} after failed review: ${escalated.join(', ')}`)
const gaps = built.flatMap((b) => (((b.built && b.built.contractGaps) || []).map((g) => `${b.shard.label}: ${g}`)))
if (gaps.length) log(`Contract gaps to resolve in integration:\n- ${gaps.join('\n- ')}`)
const notes = built.flatMap((b) => ((b.notes || []).map((n) => `${b.shard.label}: ${n}`)))
if (notes.length) log(`Reviewer notes (advisory, not failures):\n- ${notes.join('\n- ')}`)

// 4. Integrate - STRONG, owns the convergence points, runs the real build.
phase('Integrate')
const integration = await agent(
  `Integrate ${PROJECT}. All four page shards exist on disk (some may have been rebuilt by the
strong model after failing review).

THERE IS NO ROUTING TO WIRE. This is an EDIT of a live site: every route in the registry
${JSON.stringify(contract.registry)} already exists in src/App.tsx with that exact component name
and path, and every one already has its nav entry. Do NOT add a <Route>, do NOT touch the NAV
array, and do NOT create a duplicate import. Verify each registry entry still resolves and that
each page still default-exports what App.tsx imports; that is the whole routing job.

${ISOLATION ? 'Merge the disjoint task branches into main (conflict-free, paths do not overlap), then review each merged shard and re-do any failures on the strong model. ' : 'Stage + commit everything once, as DavidW1107, with a single short imperative subject line and no body and no co-author trailer. '}
Resolve these contract gaps in the correct foundation file, once each:
${gaps.length ? '- ' + gaps.join('\n- ') : '(none reported)'}
Advisory reviewer notes to weigh (not failures, do not chase them all):
${notes.length ? '- ' + notes.join('\n- ') : '(none)'}
Then run the real build, through the memory budget so it cannot collide with anything still running:
  ${PBUILD} run --weight 6G --label integrate-build -- ${TIER === 'static' ? 'echo link/load check' : TIER === 'next' ? 'npm run build' : 'npm run build'}
Fix seam/type mismatches and do a house-DNA consistency pass.

THEN RUN THIS PROJECT'S OWN ACCEPTANCE TEST, which is the thing that actually decides whether the
run shipped or broke the site. It needs a built preview, so run it AFTER the build above:
  npx vite preview --port 4318 --strictPort &   (background it, give it 4 seconds)
  node scripts/qa/audit.mjs --port 4318 --out /tmp/cle-rooms/desktop
  node scripts/qa/audit.mjs --port 4318 --out /tmp/cle-rooms/m390 --width 390 --height 844
  node scripts/qa/hero.mjs --port 4318
  node scripts/qa/hero-resume.mjs --port 4318
The baseline before this run was 0 overflow and 0 contrast failures on BOTH sweeps, hero clean
over 8 frames and hero-resume PASS. Anything worse than that baseline is a regression this run
caused: fix it before reporting, and name it in the report. Read scripts/qa/audit.mjs's header
comment first: failures print AFTER their page's 'h=' line, which has been misread before.
Kill the preview server when you are done. Return a manual spot-check list.

Then run ONE whole-repo cold review of the integrated build - this is where architecture actually
becomes visible, since a shard in isolation carries almost none. Write a cold prompt (no brief, no
contract: "read this repository, state what it is for and its invariants, then list every real
defect worst first") and a reveal prompt (the plan + CONTRACT.md, then "triage every finding you
just made as real / explained-by-context / uncertain, you may not delete one; then report where
your inferred purpose disagrees with the real one"), and run:
  ${PBUILD} run --weight 1G --label cold-integration -- ${CODEX_COLD} ${REPO} <cold file> <reveal file> integration
Triage its \`real\` findings here before the spot-check list goes out.

FINALLY, release this run's file claims so a later run can own those paths:
  ${PBUILD} release --repo ${REPO} --run ${RUN_ID}`,
  { label: 'integrate', phase: 'Integrate', model: STRONG, schema: INTEGRATE_SCHEMA },
)

return {
  routes: contract.registry.length,
  shardsBuilt: built.length,
  cleanOnCheap: cleanFirstPass,
  repaired,
  escalated,
  gapsReported: gaps,
  buildPassed: (integration && integration.buildPassed) || false,
  report: (integration && integration.report) || 'integration agent returned nothing',
  spotCheck: (integration && integration.spotCheck) || [],
}
