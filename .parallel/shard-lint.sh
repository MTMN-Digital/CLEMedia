#!/usr/bin/env bash
# Mechanical shard lint - the deterministic half of the review gate, runnable by the shard itself.
#
# The gate scores in 0.05 steps against a 0.90 threshold, so ONE named finding fails a shard. Most
# findings historically were mechanical (a stray em dash, a missing alt, an indigo class, a leftover
# TODO). Those are greps. A cheap model can iterate a grep to exit 0; it cannot iterate a taste
# judgement. Everything this script catches is a finding the gate never has to write.
#
# Usage:  shard-lint.sh <exportName> <exportPath> <owned-path-or-glob>...
#   run from the repo root. Exit 0 = clean. Exit 1 = findings on stdout, one per line.
#
# The foundation COPIES this into <repo>/.parallel/shard-lint.sh and tunes the project-specific
# lists below (a build that legitimately ships slate, or bans a different accent, edits SLOP_COLOR).
#
# ponytail: single-line greps. A tag split across lines (an <img> whose alt sits on the next line)
# is missed - the gate still reads the file, this only removes the cheap findings from its plate.
# ponytail: no git/contract check on purpose. In same-folder mode `git status` shows every OTHER
# shard's in-flight work too, so a stray-file check here would fail innocent shards. The gate owns
# contract adherence; this script owns content.

set -uo pipefail
EXPORT_NAME="${1:?usage: shard-lint.sh <exportName> <exportPath> <owned paths...>}"
EXPORT_PATH="${2:?}"
shift 2

# --- project-tunable lists ---------------------------------------------------------------------
SLOP_COLOR='(indigo|violet|purple|fuchsia)-[0-9]{2,3}|from-(indigo|violet|purple)|to-(indigo|violet|purple)'
SLOP_DEFAULT='(zinc|slate)-[0-9]{2,3}'
PLACEHOLDER='[Ll]orem ipsum|TODO|FIXME|XXX:|dicebear|via\.placeholder|placehold\.co|aspect-video bg-muted'
BRACKET_COPY='\[(Client|Company|Name|Business|City|Address|Phone|Email)[a-zA-Z ]*\]'
# ----------------------------------------------------------------------------------------------

# Text sources only. A shard that owns `public/img/*` would otherwise feed JPEGs to `grep -a`, and
# a byte sequence inside a photo matches the em-dash pattern perfectly well.
SRC_EXT='tsx?|jsx?|mjs|cjs|css|scss|html?|md|json|svg|txt|ya?ml'
FILES=()
for pat in "$@"; do
  for f in $pat; do
    [ -f "$f" ] || continue
    [[ "$f" =~ \.($SRC_EXT)$ ]] && FILES+=("$f")
  done
done
[ ${#FILES[@]} -eq 0 ] && { echo "FAIL SETUP - no lintable source files found for: $*"; exit 1; }

fails=0
# -a forces text mode: grep silently SKIPS a file it decides is binary, and a single stray NUL byte
# is enough to make it decide that, which turns a sweep into a false all-clear.
hit() {  # hit <label> <regex> [matcher-flag, default -E]
  local label="$1" rx="$2" flag="${3:--E}"
  local out rc
  # stderr is kept, not discarded: a grep that ERRORS (a bad pattern, conflicting matchers) exits 2
  # and would otherwise read as "no findings" - a silently vacuous check is worse than a noisy one.
  out=$(grep -aInH "$flag" -- "$rx" "${FILES[@]}" 2>&1); rc=$?
  if [ $rc -gt 1 ]; then echo "FAIL LINT-ERROR $label - grep exited $rc: $out"; fails=1; return; fi
  [ $rc -eq 1 ] && return 0
  while IFS= read -r line; do echo "FAIL $label - $line"; done <<< "$out"
  fails=1
}

# 1. export contract: the registry name must actually leave the registry path.
#    Static builds have no modules - the registry path is a .html page there, so the file existing
#    IS the whole contract. Pass '-' as the export name to skip the symbol check outright.
if [ ! -f "$EXPORT_PATH" ]; then
  echo "FAIL EXPORT - ${EXPORT_PATH} does not exist"; fails=1
elif [ "$EXPORT_NAME" != '-' ] && [[ "$EXPORT_PATH" =~ \.(tsx?|jsx?|mjs|cjs)$ ]]; then
  grep -aqE "export (default )?(function |const |class )?${EXPORT_NAME}\b|export \{[^}]*\b${EXPORT_NAME}\b|export default ${EXPORT_NAME}" "$EXPORT_PATH" \
    || { echo "FAIL EXPORT - ${EXPORT_PATH} does not export ${EXPORT_NAME}"; fails=1; }
fi

# 2. house hard rule: zero em dashes (U+2014) and zero en dashes (U+2013) anywhere, code included
hit DASH '—|–'

# 3. nothing unfinished ships
hit PLACEHOLDER "$PLACEHOLDER"
hit PLACEHOLDER "$BRACKET_COPY"

# 4. AI-slop tells that are literal strings
hit SLOP-COLOR "$SLOP_COLOR"
hit SLOP-DEFAULT "$SLOP_DEFAULT"
hit SLOP-GRADIENT-HEADING '<h[1-4][^>]*(bg-clip-text|text-transparent)'
hit SLOP-ROUNDED 'rounded-2xl[^"]*shadow-lg|shadow-lg[^"]*rounded-2xl'
hit SLOP-EYEBROW '>[[:space:]]*0[0-9] */ *[A-Z]|="0[0-9] */ *[A-Z]'          # retired numbered mono eyebrow (2026-09-03)

# 5. a11y floor
# requires a real src: a bare `<img>` inside a comment or a JSDoc line is prose, not a tag.
hit A11Y-ALT '<img(?=[^>]*\bsrc(Set)?=)(?![^>]*\balt=)[^>]*>' -P

# 6. motion without a reduced-motion escape, per file
for f in "${FILES[@]}"; do
  # trigger on a real animation, not the words: a comment naming framer-motion is not motion.
  grep -aqE "from ['\"]framer-motion|whileInView=|animate=|@keyframes" "$f" || continue
  # the house collapses reduced-motion centrally in lib/animations, so importing it is the escape.
  grep -aqE 'useReducedMotion|prefers-reduced-motion|motion-safe:|motion-reduce:|from .@?/?lib/animations' "$f" && continue
  echo "FAIL MOTION-REDUCED - $f: animates with no prefers-reduced-motion collapse"
  fails=1
done

# --- house: Tailwind !important escapes ------------------------------------
# DONE-WHEN items 3 and 5: rhythm comes from <Section pad>, and no literal may
# restate a token. Both were being broken by `!py-*`, `!text-[11px]` and the
# like, and the gate only caught them when a human read the diff.
for f in "$@"; do
  [ -f "$f" ] || continue
  if grep -nE '!(py|pt|pb|px|text|border|tracking)-' "$f" >/dev/null 2>&1; then
    grep -nE '!(py|pt|pb|px|text|border|tracking)-' "$f" \
      | sed "s|^|FAIL $f: Tailwind !important escape, use the contract instead: |"
    fails=1
  fi
done

[ $fails -eq 0 ] && echo "shard-lint: clean (${#FILES[@]} files)"

exit $fails
