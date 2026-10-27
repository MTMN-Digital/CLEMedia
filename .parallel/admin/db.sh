#!/usr/bin/env bash
# Local Supabase helper for the 2026-10-27-admin run. LOCAL STACK ONLY.
#
#   .parallel/admin/db.sh status          ports, applied migrations, admin row
#   .parallel/admin/db.sh psql [args]     psql inside the local db container
#   .parallel/admin/db.sh sql "<query>"   run one statement
#   .parallel/admin/db.sh up              apply pending migrations, never 0007
#   .parallel/admin/db.sh reset           wipe and rebuild, never 0007, recreate the admin
#
# Migration 0007 must not be applied anywhere (HANDOVER.md). The Supabase CLI
# applies every file in supabase/migrations, so `up` and `reset` move 0007
# aside for the duration and put it back, byte for byte, even on failure.
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO" || exit 1
ENV_FILE="$REPO/.parallel/admin/local.env"
DB_CONTAINER=supabase_db_cle-media
M7="supabase/migrations/0007_study_responses.sql"
ASIDE="$REPO/.parallel/admin/.0007.aside"

# shellcheck disable=SC1090
[ -f "$ENV_FILE" ] && set -a && . "$ENV_FILE" && set +a

aside()   { [ -f "$M7" ] && mv "$M7" "$ASIDE"; }
restore() { [ -f "$ASIDE" ] && mv "$ASIDE" "$M7"; }
trap restore EXIT

psql_() { docker exec -i "$DB_CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 "$@"; }

make_admin() {
  local srk="${LOCAL_SERVICE_ROLE_KEY:?local.env missing}" em="${ADMIN_EMAIL:?}" pw="${ADMIN_PASSWORD:?}"
  curl -s -o /dev/null -X POST http://127.0.0.1:54431/auth/v1/admin/users \
    -H "apikey: $srk" -H "Authorization: Bearer $srk" -H 'content-type: application/json' \
    -d "{\"email\":\"$em\",\"password\":\"$pw\",\"email_confirm\":true}"
  psql_ -c "insert into public.admins (user_id, email, note)
            select id, email, 'Local test admin' from auth.users where email = '$em'
            on conflict (user_id) do nothing;"
}

case "${1:-status}" in
  status)
    docker ps --filter name=cle-media --format '{{.Names}}  {{.Status}}'
    psql_ -c "select version from supabase_migrations.schema_migrations order by 1;" \
          -c "select to_regclass('public.study_responses') as must_be_empty;" \
          -c "select email from public.admins;"
    ;;
  psql) shift; psql_ "$@" ;;
  sql)  shift; psql_ -c "$1" ;;
  up)
    aside
    npx -y supabase migration up --local
    ;;
  reset)
    aside
    npx -y supabase db reset --local
    restore
    make_admin
    ;;
  *) echo "unknown command: $1"; exit 2 ;;
esac
