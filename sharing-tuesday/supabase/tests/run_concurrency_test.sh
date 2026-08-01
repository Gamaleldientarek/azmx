#!/usr/bin/env bash
# run_concurrency_test.sh
# TRUE parallel stampede test for join_room: fires N concurrent client
# connections at the same lobby room, then asserts join_numbers are
# contiguous 1..N with no gaps/dupes and display_names are all unique.
#
# Requires: psql on PATH and a reachable database with migrations 0001–0004
# already applied.
#
# Usage:
#   DATABASE_URL="postgres://user:pass@host:5432/db" \
#     supabase/tests/run_concurrency_test.sh [N]
#
# N defaults to 25 (typical max room). The name pool has 40 names, so keep
# N <= 40 or pick_unused_display_name will (correctly) raise pool_exhausted.

set -euo pipefail

N="${1:-25}"
: "${DATABASE_URL:?Set DATABASE_URL to your Postgres connection string}"
CODE="STAMPEDE-$$"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found on PATH" >&2
  exit 127
fi

echo ">> Preparing lobby room ${CODE} (N=${N})"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q <<SQL
insert into public.rooms (code, name, status)
values ('${CODE}', 'stampede ${N}', 'lobby')
on conflict (code) do update set status = 'lobby';
delete from public.participants
  where room_id = (select id from public.rooms where code = '${CODE}');
SQL

echo ">> Firing ${N} concurrent join_room() calls"
pids=()
for i in $(seq 1 "$N"); do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q \
    -c "select public.join_room('${CODE}', 'Real Person ${i}');" \
    >/dev/null 2>&1 &
  pids+=("$!")
done

fail=0
for pid in "${pids[@]}"; do
  wait "$pid" || fail=$((fail + 1))
done
echo ">> ${fail} join call(s) failed (expect 0 for N <= pool size)"

echo ">> Verifying invariants"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q <<SQL
do \$\$
declare
  v_room     uuid;
  v_count    int;
  v_distinct int;
  v_min      int;
  v_max      int;
  v_dupe     int;
begin
  select id into v_room from public.rooms where code = '${CODE}';
  select count(*), count(distinct join_number), min(join_number), max(join_number)
    into v_count, v_distinct, v_min, v_max
  from public.participants where room_id = v_room;
  select count(*) into v_dupe from (
    select display_name from public.participants
    where room_id = v_room group by display_name having count(*) > 1
  ) d;

  assert v_count = ${N},    format('expected ${N} rows, got %s', v_count);
  assert v_distinct = v_count, format('duplicate join_numbers: %s distinct of %s', v_distinct, v_count);
  assert v_min = 1,         format('min join_number %s (want 1)', v_min);
  assert v_max = ${N},      format('max join_number %s (want ${N}, i.e. gap-free)', v_max);
  assert v_dupe = 0,        format('duplicate display_names: %s', v_dupe);

  raise notice 'PASS: % concurrent joins -> contiguous 1..%, unique numbers + names.', v_count, v_max;
end
\$\$;
SQL

echo ">> Cleanup"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q \
  -c "delete from public.rooms where code = '${CODE}';"

echo ">> DONE"
