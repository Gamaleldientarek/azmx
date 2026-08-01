-- concurrency_join.sql
-- Self-contained concurrency proof for join_room, runnable in a single psql
-- session against a DB that already has migrations 0001–0004 applied.
--
-- It fires N join_room() calls "in parallel" from within one transaction is NOT
-- a valid concurrency test (single backend = serial). Real parallelism must
-- come from multiple client connections — see run_concurrency_test.sh for that.
--
-- What THIS file does is a fast, deterministic *correctness* check you can run
-- anywhere: it drives many sequential joins and asserts the invariants that the
-- parallel harness also checks (contiguous 1..N, unique numbers, unique names).
-- Handy as a smoke test even without a parallel runner.

\set ON_ERROR_STOP on

begin;

-- Fresh test room.
insert into public.rooms (code, name, status)
values ('TEST-CONC', 'concurrency smoke test', 'lobby')
on conflict (code) do update set status = 'lobby'
returning id \gset room_

-- Clean any prior participants for a repeatable run.
delete from public.participants where room_id = :'room_id';

-- 25 sequential joins (typical max room size).
do $$
declare
  i int;
begin
  for i in 1..25 loop
    perform public.join_room('TEST-CONC', 'Real Person ' || i::text);
  end loop;
end
$$;

-- ---- Assertions -----------------------------------------------------------
do $$
declare
  v_count      int;
  v_distinct   int;
  v_min        int;
  v_max        int;
  v_dupe_names int;
  v_room       uuid;
begin
  select id into v_room from public.rooms where code = 'TEST-CONC';

  select count(*), count(distinct join_number), min(join_number), max(join_number)
    into v_count, v_distinct, v_min, v_max
  from public.participants where room_id = v_room;

  select count(*) into v_dupe_names from (
    select display_name from public.participants
    where room_id = v_room
    group by display_name having count(*) > 1
  ) d;

  assert v_count = 25,            format('expected 25 participants, got %s', v_count);
  assert v_distinct = 25,         format('join_number not unique: %s distinct of %s', v_distinct, v_count);
  assert v_min = 1,               format('join_number should start at 1, got %s', v_min);
  assert v_max = 25,              format('join_number should end at 25 (gap-free), got %s', v_max);
  assert v_dupe_names = 0,        format('display_name not unique: %s duplicated', v_dupe_names);

  raise notice 'OK: 25 participants, contiguous 1..25, unique numbers + unique names.';
end
$$;

-- Late-join lock check: flip to drawing, then a join must be rejected.
do $$
declare
  v_room uuid;
begin
  select id into v_room from public.rooms where code = 'TEST-CONC';
  perform public.lock_room_for_draw(v_room);
  begin
    perform public.join_room('TEST-CONC', 'Too Late');
    raise exception 'FAILED: join succeeded after draw lock';
  exception when others then
    if sqlerrm like 'room_not_joinable%' then
      raise notice 'OK: join rejected after draw lock (%).', sqlerrm;
    else
      raise;
    end if;
  end;
end
$$;

-- Privacy purge check.
do $$
declare
  v_room       uuid;
  v_with_name  int;
begin
  select id into v_room from public.rooms where code = 'TEST-CONC';
  perform public.close_room(v_room);
  select count(*) into v_with_name
  from public.participants where room_id = v_room and real_name is not null;
  assert v_with_name = 0, format('real_name not purged: %s rows still set', v_with_name);
  raise notice 'OK: real_name purged on close.';
end
$$;

rollback;  -- leave the DB untouched.
