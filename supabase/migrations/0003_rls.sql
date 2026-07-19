-- 0003_rls.sql
-- Row-Level Security + grant hardening. RLS Option A (scoped JWT):
--   The server mints a short-lived Supabase JWT per client after they join,
--   carrying `role: "anon"` and a custom claim `room_id`. Read policies below
--   only expose rows whose room_id matches that claim, so a client can never
--   read another room. The service_role key (server) has BYPASSRLS and keeps
--   full access for every mutation.
--
-- Write path: there is NONE for anon/authenticated. We REVOKE all table
-- privileges from them and grant back only column-scoped SELECT. All mutations
-- go through the service role or the SECURITY DEFINER functions in 0002.
--
-- real_name protection is defense-in-depth:
--   1. anon is granted SELECT only on safe COLUMNS of participants
--      (real_name is excluded) — this also strips real_name from Realtime
--      payloads, since Supabase Realtime honors column-level privileges.
--   2. participants_public is a security_invoker view exposing only safe
--      columns, for the projection screen to read/subscribe conveniently.

begin;

-- ---------------------------------------------------------------------------
-- Enable RLS (idempotent — re-enabling is a no-op)
-- ---------------------------------------------------------------------------
alter table public.rooms        enable row level security;
alter table public.participants enable row level security;
alter table public.draws        enable row level security;
alter table public.name_pool    enable row level security;

-- Force RLS even for the table owner, so nothing accidentally bypasses it
-- except roles that explicitly have BYPASSRLS (service_role).
alter table public.rooms        force row level security;
alter table public.participants force row level security;
alter table public.draws        force row level security;
alter table public.name_pool    force row level security;

-- ---------------------------------------------------------------------------
-- Grants: strip everything from anon/authenticated, then hand back only the
-- minimum SELECT surface. No INSERT/UPDATE/DELETE for either role anywhere.
-- ---------------------------------------------------------------------------
revoke all on public.rooms        from anon, authenticated;
revoke all on public.participants from anon, authenticated;
revoke all on public.draws        from anon, authenticated;
revoke all on public.name_pool    from anon, authenticated;

-- rooms: read your own room only (RLS narrows further to the JWT room_id).
grant select on public.rooms to anon, authenticated;

-- participants: COLUMN-scoped SELECT — real_name is deliberately omitted.
-- Even with a permissive RLS row match, anon has no privilege to read
-- real_name at all (and it is therefore absent from Realtime change payloads).
grant select (id, room_id, display_name, join_number, joined_at)
  on public.participants to anon, authenticated;

-- draws: read the order for your room.
grant select on public.draws to anon, authenticated;

-- name_pool stays server-only (no anon/authenticated grant, RLS on, no policy).

-- service_role keeps full access (it also has BYPASSRLS in Supabase). Make the
-- grants explicit and idempotent so a fresh/altered instance is never locked out.
grant all on public.rooms        to service_role;
grant all on public.participants to service_role;
grant all on public.draws        to service_role;
grant all on public.name_pool    to service_role;

-- ---------------------------------------------------------------------------
-- Policies (scoped JWT). nullif(...,'') avoids a cast error when the claim is
-- absent, in which case the comparison is NULL -> no rows, i.e. deny by default.
-- Drop-then-create keeps this migration re-runnable.
-- ---------------------------------------------------------------------------
drop policy if exists read_own_room on public.rooms;
create policy read_own_room on public.rooms
  for select to anon, authenticated
  using (id = nullif(auth.jwt() ->> 'room_id', '')::uuid);

drop policy if exists read_participants on public.participants;
create policy read_participants on public.participants
  for select to anon, authenticated
  using (room_id = nullif(auth.jwt() ->> 'room_id', '')::uuid);

drop policy if exists read_draws on public.draws;
create policy read_draws on public.draws
  for select to anon, authenticated
  using (room_id = nullif(auth.jwt() ->> 'room_id', '')::uuid);

-- name_pool: RLS enabled with NO policy => anon/authenticated see zero rows.
-- (service_role bypasses RLS.) No policy statement needed.

-- ---------------------------------------------------------------------------
-- Sanitized projection read path.
-- security_invoker=true => the view runs with the CALLER's privileges, so the
-- participants RLS policy AND the anon column grants both apply. The view can
-- physically only surface safe columns; real_name can never leak through it.
-- ---------------------------------------------------------------------------
create or replace view public.participants_public
  with (security_invoker = true) as
  select id, room_id, display_name, join_number, joined_at
  from public.participants;

comment on view public.participants_public
  is 'Sanitized roster for the projection screen. security_invoker view; never exposes real_name.';

grant select on public.participants_public to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Realtime. Add the tables to the supabase_realtime publication so clients can
-- subscribe. RLS policies above gate which rows each subscriber receives, and
-- the participants column grant strips real_name from every payload. Wrapped so
-- re-running (or a missing publication on non-Supabase Postgres) never fails.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'participants'
    ) then
      alter publication supabase_realtime add table public.participants;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'draws'
    ) then
      alter publication supabase_realtime add table public.draws;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'rooms'
    ) then
      alter publication supabase_realtime add table public.rooms;
    end if;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Function EXECUTE hardening: only the server (service_role) may call the
-- mutating RPCs. This is what makes "no anon write path" airtight even though
-- the functions are SECURITY DEFINER.
-- ---------------------------------------------------------------------------
revoke all on function public.pick_unused_display_name(uuid) from public, anon, authenticated;
revoke all on function public.join_room(text, text)          from public, anon, authenticated;
revoke all on function public.lock_room_for_draw(uuid)       from public, anon, authenticated;
revoke all on function public.record_draw(uuid, jsonb, uuid, text) from public, anon, authenticated;
revoke all on function public.close_room(uuid)               from public, anon, authenticated;

grant execute on function public.join_room(text, text)          to service_role;
grant execute on function public.lock_room_for_draw(uuid)       to service_role;
grant execute on function public.record_draw(uuid, jsonb, uuid, text) to service_role;
grant execute on function public.close_room(uuid)              to service_role;
-- pick_unused_display_name is only ever called internally by join_room (which
-- runs as the definer/owner), so it needs no direct EXECUTE grant.

commit;
