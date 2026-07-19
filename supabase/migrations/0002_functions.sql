-- 0002_functions.sql
-- Server-side RPCs. All are SECURITY DEFINER with a pinned search_path so they
-- run as the (RLS-bypassing) function owner and cannot be hijacked via a
-- mutable search_path. EXECUTE is granted to service_role only — there is no
-- anon write path anywhere (see 0003 for the grant/revoke hardening).
--
-- Concurrency contract (the whole point of join_room):
--   join_room takes `SELECT ... FOR UPDATE` on the single rooms row. Two
--   simultaneous joins to the same room therefore serialize on that row lock;
--   each computes max(join_number)+1 only while holding it, so numbers are
--   contiguous and unique. The UNIQUE(room_id, join_number) constraint is the
--   belt-and-braces backstop that would reject any duplicate if the lock were
--   ever bypassed.

begin;

-- ---------------------------------------------------------------------------
-- pick_unused_display_name(room) -> a random name not yet used in that room.
-- Raises if the curated pool is exhausted for the room.
-- ---------------------------------------------------------------------------
create or replace function public.pick_unused_display_name(p_room_id uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
begin
  select np.display_name
    into v_name
  from public.name_pool np
  where not exists (
    select 1
    from public.participants p
    where p.room_id = p_room_id
      and p.display_name = np.display_name
  )
  order by random()
  limit 1;

  if v_name is null then
    raise exception 'name_pool_exhausted: no unused display names remain for room %', p_room_id
      using errcode = 'P0001';
  end if;

  return v_name;
end;
$$;

comment on function public.pick_unused_display_name(uuid)
  is 'Random name_pool.display_name not yet used in the room; raises name_pool_exhausted if none left.';

-- ---------------------------------------------------------------------------
-- join_room(code, real_name) -> the inserted participants row.
-- Serializes concurrent joins via the room row lock (gap-free join_number).
-- ---------------------------------------------------------------------------
create or replace function public.join_room(p_room_code text, p_real_name text)
returns public.participants
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.rooms;
  v_real text;
  v_num  int;
  v_name text;
  r      public.participants;
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
  is 'Race-safe join: locks the room row, assigns gap-free join_number + a fun name, inserts, returns the participant.';

-- ---------------------------------------------------------------------------
-- lock_room_for_draw(room) -> participant ids over a frozen set.
-- Atomically flips lobby -> drawing (rejecting further joins) and returns the
-- current participant ids in join order. Redraws are allowed while the room is
-- already 'drawing' or 'revealed' (status is left unchanged in that case).
-- The app then computes Fisher-Yates in Node and calls record_draw().
-- ---------------------------------------------------------------------------
create or replace function public.lock_room_for_draw(p_room_id uuid)
returns table (participant_id uuid, join_number int)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.rooms;
begin
  -- Contend on the SAME row lock join_room uses, so an in-flight join either
  -- commits before us (and is included) or blocks until we flip to 'drawing'
  -- (and is then rejected). Either way the returned set is exactly the
  -- committed roster at the instant joining locked.
  select *
    into v_room
  from public.rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'room_not_found: %', p_room_id using errcode = 'P0001';
  end if;

  if v_room.status = 'closed' then
    raise exception 'room_closed: cannot draw on a closed room' using errcode = 'P0001';
  end if;

  -- Lock-at-draw: first draw flips lobby -> drawing. Redraw keeps drawing/revealed.
  if v_room.status = 'lobby' then
    update public.rooms set status = 'drawing' where id = p_room_id;
  end if;

  return query
    select p.id, p.join_number
    from public.participants p
    where p.room_id = p_room_id
    order by p.join_number;
end;
$$;

comment on function public.lock_room_for_draw(uuid)
  is 'Atomically flips lobby->drawing (locks joins) and returns the frozen participant set in join order.';

-- ---------------------------------------------------------------------------
-- record_draw(room, order, starter, seed) -> the inserted draws row.
-- Atomically persists a Fisher-Yates result and reveals it. Allowed only while
-- the room is 'drawing' or 'revealed' (supports redraw). One transaction so the
-- draws row and the rooms status/starter/seed can never diverge.
-- ---------------------------------------------------------------------------
create or replace function public.record_draw(
  p_room_id uuid,
  p_order   jsonb,
  p_starter uuid,
  p_seed    text
)
returns public.draws
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.rooms;
  d      public.draws;
begin
  select *
    into v_room
  from public.rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'room_not_found: %', p_room_id using errcode = 'P0001';
  end if;

  if v_room.status not in ('drawing', 'revealed') then
    raise exception 'room_not_drawing: draw can only be recorded while drawing/revealed (got %)', v_room.status
      using errcode = 'P0001';
  end if;

  insert into public.draws (room_id, "order", starter_participant_id, seed)
  values (p_room_id, p_order, p_starter, p_seed)
  returning * into d;

  update public.rooms
     set status                 = 'revealed',
         starter_participant_id = p_starter,
         draw_seed              = p_seed
   where id = p_room_id;

  return d;
end;
$$;

comment on function public.record_draw(uuid, jsonb, uuid, text)
  is 'Atomically persists a Fisher-Yates draw and flips the room to revealed. Supports redraw.';

-- ---------------------------------------------------------------------------
-- close_room(room) -> void. Closes the room and purges real names (privacy).
-- ---------------------------------------------------------------------------
create or replace function public.close_room(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.rooms
     set status    = 'closed',
         closed_at = now()
   where id = p_room_id;

  -- Privacy purge: real names must not survive a closed room.
  update public.participants
     set real_name = null
   where room_id = p_room_id;
end;
$$;

comment on function public.close_room(uuid)
  is 'Sets status=closed, closed_at=now(), and NULLs every real_name in the room (privacy purge).';

commit;
