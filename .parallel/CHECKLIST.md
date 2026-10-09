# DONE WHEN, run 2026-10-09-cle-rooms

Injected verbatim into the build, repair, escalate and review prompts. The gate
may fail a shard only on an item in this list or on a `shard-lint.sh` FAIL
line. Anything else it notices is an `ADVISORY:` and moves no score.

1. `npx tsc --noEmit -p tsconfig.app.json` exits 0. That is the ONLY build
   command a shard may run: four shards share one checkout, one node_modules
   and one dist/, so no `npm install`, no `npm run build`, no dev server.
2. `bash .parallel/shard-lint.sh <ExportName> <path/to/Page.tsx> <every owned file>`
   exits 0. Pass FILES, never a directory: a directory in the second argument
   makes the export check fail open.
3. Nothing outside the shard's Owns list is created, edited or deleted.
   `package.json` is untouched and no npm dependency was added.
4. The page still exports its component under the same name from the same path,
   and registers no route and no nav link of its own.
5. Section rhythm comes from `<Section pad=...>`. No `!py-*`, `!pt-*`, `!pb-*`
   or any other Tailwind `!important` escape in the owned files.
6. Every button is `<Button>` with `variant` of `primary` or `quiet`, with no
   className colour override.
7. No colour, radius or easing literal that restates an existing token, and no
   `opacity` applied to a text colour anywhere.
8. Every image goes through `Figure` with a key that already exists in the
   `AssetKey` union in `src/lib/brand.ts`. No new image file, no new key, no
   generated imagery, no stock photography.
9. Every text and background pair meets WCAG 2.1 AA on the PAINTED pixel. On
   the render kit's wall that means `--color-ink` at full strength or a caption
   on a cream mount; `--color-muted` is the floor and only on paper.
10. Any motion is `Settle` or `useRoomEntry` and collapses under
    `prefers-reduced-motion: reduce`. No animation library, no `@keyframes`,
    no infinite loop, no parallax, no scroll pinning, and no `Relief` or
    `HangingMarks` mounted by a shard.
11. Anything holding a form field, a control, or a long block of reading is
    FLAT: never inside a `Stage` or any other 3D-rotated ancestor.
12. Where the shard stands objects in a room, there is ONE lamp: each object's
    light azimuth is computed from its COLUMN, and no two neighbouring objects
    share a pose.
13. No invented fact. Every claim, statistic, testimonial, logo, award, price,
    user number, date or coverage item either already existed in the repo or
    restates something the site already says. A missing fact goes to
    `CONTENT-NEEDED.md`, not onto the page.
14. Irish register and exact spellings: CLÉ Family Media, The Pawsitive Pugs &
    Pals(R), PupsPlayer(TM), Conor Sexton, EUR prices.
15. Zero em dashes and zero en dashes, in copy, code and comments.
16. The page reads at 390px wide with no horizontal overflow, and still reads
    at 1440px.
17. One `h1` per page, and the heading order does not skip a level.
18. The page carries at most one `.bench` and at most one `.deep` band, and
    does not add a second dark band beside an existing one.
