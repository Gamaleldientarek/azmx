-- retention_purge.sql
-- Acceptance proof for migration 0006: a room left past the retention window
-- has every real_name NULL WITHOUT any human action.
--
-- Self-contained, deterministic, and safe: the whole file runs inside one
-- transaction and ends in ROLLBACK, so it leaves the database untouched. Run
-- it against a DB with migrations 0001–0006 applied:
--
--   psql "$DATABASE_URL" -f supabase/tests/retention_purge.sql
--
-- Note this exercises the PURGE FUNCTION, which is the part with logic worth
-- asserting. Whether pg_cron is actually calling it is a scheduling fact, not
-- a logic fact — check that separately with:
--
--   select jobname, schedule, active from cron.job
--    where jobname = 'purge-expired-real-names';

\set ON_ERROR_STOP on

begin;

-- ---------------------------------------------------------------------------
-- Fixtures: three rooms, back-dated to sit either side of the window.
-- ---------------------------------------------------------------------------
insert into public.rooms (code, name, status)
values ('TEST-RET-OLD', 'retention: expired', 'lobby')
on conflict (code) do update set status = 'lobby'
returning id \gset old_

insert into public.rooms (code, name, status)
values ('TEST-RET-NEW', 'retention: fresh', 'lobby')
on conflict (code) do update set status = 'lobby'
returning id \gset new_

insert into public.rooms (code, name, status)
values ('TEST-RET-EDGE', 'retention: just inside', 'lobby')
on conflict (code) do update set status = 'lobby'
returning id \gset edge_

delete from public.participants
 where room_id in (:'old_id', :'new_id', :'edge_id');

-- Populate through the real RPC so real_name lands exactly as it would live.
do $$
declare i int;
begin
  for i in 1..5 loop
    perform public.join_room('TEST-RET-OLD',  'Old Person ' || i::text);
    perform public.join_room('TEST-RET-NEW',  'New Person ' || i::text);
    perform public.join_room('TEST-RET-EDGE', 'Edge Person ' || i::text);
  end loop;
end
$$;

-- Age the rooms. This is the "facilitator shut the laptop" scenario: the room
-- is still in a live status, nobody ever clicked close.
update public.rooms
   set created_at = now() - interval '48 hours', status = 'revealed'
 where id = :'old_id';

-- Pin the fresh room to "now" so a re-run against a pre-existing row (the
-- ON CONFLICT path above) cannot inherit a stale created_at.
update public.rooms
   set created_at = now(), status = 'revealed'
 where id = :'new_id';

-- 23h old: INSIDE the 24h window, must be left alone.
update public.rooms
   set created_at = now() - interval '23 hours', status = 'revealed'
 where id = :'edge_id';

-- ---------------------------------------------------------------------------
-- Precondition: every room currently holds real names.
-- ---------------------------------------------------------------------------
do $$
declare v_n int;
begin
  select count(*) into v_n
  from public.participants
  where room_id in (
    select id from public.rooms
     where code in ('TEST-RET-OLD','TEST-RET-NEW','TEST-RET-EDGE')
  ) and real_name is not null;
  assert v_n = 15, format('setup failed: expected 15 real names, got %s', v_n);
  raise notice 'OK: 15 real names present before the purge.';
end
$$;

-- ---------------------------------------------------------------------------
-- THE ACT: no human, no click. Exactly what pg_cron invokes.
-- ---------------------------------------------------------------------------
do $$
declare v_purged int;
begin
  v_purged := public.purge_expired_real_names();
  assert v_purged = 1, format('expected 1 room purged, got %s', v_purged);
  raise notice 'OK: purge reported % room(s).', v_purged;
end
$$;

-- ---------------------------------------------------------------------------
-- Assertions
-- ---------------------------------------------------------------------------
do $$
declare
  v_old_names  int;
  v_new_names  int;
  v_edge_names int;
  v_old_status text;
  v_new_status text;
begin
  select count(*) into v_old_names
  from public.participants p join public.rooms r on r.id = p.room_id
  where r.code = 'TEST-RET-OLD' and p.real_name is not null;

  select count(*) into v_new_names
  from public.participants p join public.rooms r on r.id = p.room_id
  where r.code = 'TEST-RET-NEW' and p.real_name is not null;

  select count(*) into v_edge_names
  from public.participants p join public.rooms r on r.id = p.room_id
  where r.code = 'TEST-RET-EDGE' and p.real_name is not null;

  select status into v_old_status from public.rooms where code = 'TEST-RET-OLD';
  select status into v_new_status from public.rooms where code = 'TEST-RET-NEW';

  -- The point of the whole exercise.
  assert v_old_names = 0,
    format('EXPIRED room still holds %s real name(s)', v_old_names);

  -- Retention must not become deletion: live rooms are untouched.
  assert v_new_names = 5,
    format('fresh room lost names: %s of 5 remain', v_new_names);
  assert v_edge_names = 5,
    format('room INSIDE the window was purged: %s of 5 remain', v_edge_names);

  -- Lifecycle stays coherent: names gone => room closed.
  assert v_old_status = 'closed',
    format('expired room status is %s (want closed)', v_old_status);
  assert v_new_status = 'revealed',
    format('fresh room status changed to %s', v_new_status);

  raise notice 'OK: expired room purged + closed; in-window rooms untouched.';
end
$$;

-- ---------------------------------------------------------------------------
-- Idempotence: a second run finds nothing left to do.
-- ---------------------------------------------------------------------------
do $$
declare v_purged int;
begin
  v_purged := public.purge_expired_real_names();
  assert v_purged = 0, format('second run purged %s room(s), want 0', v_purged);
  raise notice 'OK: purge is idempotent.';
end
$$;

-- ---------------------------------------------------------------------------
-- The window is honoured as a parameter too (explicit retention override).
-- ---------------------------------------------------------------------------
do $$
declare v_purged int; v_edge int; v_new int;
begin
  -- With a 1-hour window the 23h "edge" room now expires. The fresh room was
  -- created moments ago, so it is still inside even a 1-hour window.
  v_purged := public.purge_expired_real_names(interval '1 hour');
  assert v_purged = 1, format('expected 1 room at 1h retention, got %s', v_purged);

  select count(*) into v_edge
  from public.participants p join public.rooms r on r.id = p.room_id
  where r.code = 'TEST-RET-EDGE' and p.real_name is not null;
  assert v_edge = 0, format('%s real name(s) survived the 1h window', v_edge);

  select count(*) into v_new
  from public.participants p join public.rooms r on r.id = p.room_id
  where r.code = 'TEST-RET-NEW' and p.real_name is not null;
  assert v_new = 5, format('fresh room wrongly purged: %s of 5 remain', v_new);

  raise notice 'OK: explicit retention interval honoured.';
end
$$;

do $$
begin
  raise notice 'PASS: retention purge behaves correctly with no human action.';
end
$$;

rollback;  -- leave the DB untouched.
