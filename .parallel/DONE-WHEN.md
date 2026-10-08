# DONE WHEN

Injected verbatim into the build prompt, the repair prompt and the review
prompt. The gate may fail a shard only on an item in this list or on a
`shard-lint.sh` FAIL line. Anything else it notices is an `ADVISORY:` and moves
no score.

1. `npm run typecheck` exits 0 and `npm run build` exits 0.
2. `bash .parallel/shard-lint.sh <exportName> <exportPath> <owned files>` exits 0.
3. Every section's rhythm comes from `<Section pad=...>`. No `!py-*`, `!pt-*`
   or `!pb-*` anywhere in the owned files.
4. Every button is `<Button>` with `variant` of `primary` or `quiet`. No
   hand-rolled pill, no `className` colour override on a button.
5. No colour, radius or easing literal that restates an existing token.
6. Every image has a real `alt`, or `alt=""` if it is decoration.
7. Any motion collapses under `prefers-reduced-motion: reduce`.
8. Nothing outside the shard's Owns list is created or edited.
9. No em dash and no en dash, in code, comments or copy.
10. No invented fact. Copy either already existed on the site or restates
    something the site already says.
11. The page reads at 390px wide, not only at 1440px.
