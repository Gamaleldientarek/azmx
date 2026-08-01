-- 0007_room_capacity.sql
-- Per-room participant cap, enforced inside join_room under the room lock.
--
-- THE PROBLEM
-- joinRoom is the one un-gated mutating action: no rate limit, no captcha, no
-- cap. The name pool holds exactly 40 rows (0004_seed_names.sql), so 40
-- cookie-less joins against a known room code exhaust it. Every subsequent
-- REAL participant then gets "This room is full — no fun names are left", and
-- there is no facilitator remedy in the UI short of deleting the room. Cost to
-- the attacker: 40 HTTP requests.
--
-- WHAT THIS FIXES, AND WHAT IT DOES NOT
-- A cap does not by itself stop a flood — that needs rate limiting at the edge
-- (see cloudflare-worker/RATE_LIMITING.md). What it fixes is the DIAGNOSIS.
-- Today a legitimately full room and a pool-exhaustion failure produce the
-- identical message, so the facilitator cannot tell "we're full" from
-- "something is wrong". After this:
--
--   room_at_capacity   -> the room hit its own limit. Expected, actionable:
--                         raise max_participants, or start a second room.
--   name_pool_exhausted -> should now be UNREACHABLE via the normal path,
--                         because the cap trips first. If it ever fires it
--                         means the pool is smaller than the cap (names
--                         deleted, or a cap raised past the pool) — a real
--                         operational signal rather than routine noise.
--
-- Checked while holding the same row lock join_room already takes, so the cap
-- cannot be raced past by concurrent joins.
--
-- Idempotent: safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- rooms.max_participants — per room, so one big session can be raised without
-- loosening every other room. Defaults to the name pool size.
-- ---------------------------------------------------------------------------
alter table public.rooms
  add column if not exists max_participants integer not null default 40;

do $$
begin
  alter table public.rooms
    add constraint rooms_max_participants_check
    check (max_participants > 0 and max_participants <= 500);
exception
  when duplicate_object then null;  -- already applied
end
$$;

comment on column public.rooms.max_participants
  is 'Per-room join cap, enforced in join_room under the room row lock. Defaults to the 40-name pool size.';

-- ---------------------------------------------------------------------------
-- join_room: identical contract to 0002, plus the capacity gate.
-- ---------------------------------------------------------------------------
create or replace function public.join_room(p_room_code text, p_real_name text)
returns public.participants
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room  public.rooms;
  v_real  text;
  v_num   int;
  v_name  text;
  v_count int;
  r       public.participants;
begin
  -- Validate / normalize the real name up front.
  v_real := btrim(coalesce(p_real_name, ''));
  if v_real = '' then
    raise exception 'invalid_real_name: real name must not be empty'
      using errcode = 'P0001';
  end if;

  -- Lock the room row. Only a room still in 'lobby' accepts joins; this same
  -- lock is what serializes concurrent joins AND what makes the draw's set
  -- "frozen" (lock_room_for_draw contends on the identical row).
  select *
    into v_room
  from public.rooms
  where code = p_room_code
    and status = 'lobby'
  for update;

  if not found then
    raise exception 'room_not_joinable: no lobby room with code %', p_room_code
      using errcode = 'P0001';
  end if;

  -- Capacity gate, under the lock and BEFORE the name pool is touched, so a
  -- full room reports itself as full rather than as a pool failure.
  select count(*)
    into v_count
  from public.participants
  where room_id = v_room.id;

  if v_count >= v_room.max_participants then
    raise exception
      'room_at_capacity: room % holds %/% participants',
      p_room_code, v_count, v_room.max_participants
      using errcode = 'P0001';
  end if;

  -- Gap-free next number, computed while holding the room lock.
  select coalesce(max(join_number), 0) + 1
    into v_num
  from public.participants
  where room_id = v_room.id;

  v_name := public.pick_unused_display_name(v_room.id);

  insert into public.participants (room_id, real_name, display_name, join_number)
  values (v_room.id, v_real, v_name, v_num)
  returning * into r;

  return r;
end;
$$;

comment on function public.join_room(text, text)
  is 'Race-safe join: locks the room row, enforces max_participants, assigns gap-free join_number + a fun name, inserts, returns the participant.';

commit;
