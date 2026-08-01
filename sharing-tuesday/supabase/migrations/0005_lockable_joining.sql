-- 0005: facilitator-controlled joining — new 'locked' room status.
--
-- 'locked' = joining manually closed by the facilitator, no draw yet.
-- Transitions (all facilitator-driven, server-side):
--   lobby  -> locked   (close joining)
--   locked -> lobby    (reopen joining)
--   drawing/revealed -> lobby (reopen after a draw; a redraw then includes
--                              the newcomers)
--   lobby|locked -> drawing (lock_room_for_draw, on Run selector)
--
-- join_room already requires status = 'lobby', so 'locked' rejects joins with
-- the existing room_not_joinable error. Idempotent.

begin;

-- Widen the status CHECK.
alter table public.rooms
  drop constraint if exists rooms_status_check;
alter table public.rooms
  add constraint rooms_status_check
  check (status in ('lobby', 'locked', 'drawing', 'revealed', 'closed'));

-- lock_room_for_draw: a draw can start from 'lobby' OR 'locked'.
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

  -- Lock-at-draw: first draw flips lobby/locked -> drawing. Redraw keeps
  -- drawing/revealed.
  if v_room.status in ('lobby', 'locked') then
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
  is 'Freezes the roster for a draw: flips lobby/locked->drawing under the join row lock and returns the committed participant set in join order.';

-- set_joining(room, open): facilitator door control, serialized on the same
-- row lock as join_room so a concurrent join can''t slip past a close.
create or replace function public.set_joining(p_room_id uuid, p_open boolean)
returns public.rooms
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.rooms;
begin
  select * into v_room from public.rooms where id = p_room_id for update;

  if not found then
    raise exception 'room_not_found: %', p_room_id using errcode = 'P0001';
  end if;
  if v_room.status = 'closed' then
    raise exception 'room_closed: a closed room cannot change joining' using errcode = 'P0001';
  end if;

  if p_open then
    -- Reopen from locked, or from a drawn state (newcomers join, then redraw).
    update public.rooms set status = 'lobby' where id = p_room_id
      returning * into v_room;
  else
    if v_room.status <> 'lobby' then
      raise exception 'room_not_lobby: joining can only be closed from lobby (got %)', v_room.status
        using errcode = 'P0001';
    end if;
    update public.rooms set status = 'locked' where id = p_room_id
      returning * into v_room;
  end if;

  return v_room;
end;
$$;

comment on function public.set_joining(uuid, boolean)
  is 'Facilitator door control: lobby<->locked, and reopen to lobby from drawing/revealed.';

revoke all on function public.set_joining(uuid, boolean) from public, anon, authenticated;
grant execute on function public.set_joining(uuid, boolean) to service_role;

commit;
