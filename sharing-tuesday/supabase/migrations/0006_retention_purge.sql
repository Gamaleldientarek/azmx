-- 0006_retention_purge.sql
-- AUTOMATIC retention purge for real names.
--
-- THE PROBLEM
-- The purge itself already worked (close_room in 0002 NULLs every real_name),
-- but it ONLY ever ran when a human clicked "Close room & purge names". There
-- was no pg_cron job, no scheduled task, no TTL, and nothing tied to closed_at
-- or to draw completion — grep the supabase/ tree at 0005 and you find none.
--
-- So the ordinary, adversary-free path leaked: the workshop ends, the
-- facilitator shuts the laptop, the room stays in 'revealed', and every real
-- name — joined to fun name, join number and joined_at — persists forever.
-- Worse, /facilitator lists only the 30 most recent rooms, so after ~30
-- sessions those rooms scroll off the ONLY UI that could close them. The data
-- becomes simultaneously invisible and retained.
--
-- This matters because the app makes an explicit promise at the moment of
-- collection ("Shown only to the facilitator", "Real names are purged when
-- the room closes"). That promise depended on a click nothing enforced.
--
-- THE FIX
-- A retention window enforced by the database, not by anyone's memory:
-- purge_expired_real_names() NULLs real_name and closes any room older than
-- the window, and pg_cron runs it hourly.
--
-- Idempotent: safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- The retention window. Single source of truth, so the SQL, the cron job and
-- the participant-facing copy cannot drift apart.
--
-- Stated to participants in src/app/join/[code]/JoinForm.tsx — if you change
-- this, change that copy in the same commit.
-- ---------------------------------------------------------------------------
create or replace function public.real_name_retention()
returns interval
language sql
immutable
as $$ select interval '24 hours' $$;

comment on function public.real_name_retention()
  is 'Retention window for participants.real_name. Mirrored in the participant-facing copy on the join form.';

-- ---------------------------------------------------------------------------
-- purge_expired_real_names(retention) -> number of rooms purged.
--
-- Close-room-equivalent, applied automatically:
--   * NULLs real_name for every participant of an expired room,
--   * marks the room closed so its lifecycle state matches reality (a room
--     whose names are gone must not keep accepting joins).
--
-- Age is measured from rooms.created_at: a session that was never closed is
-- exactly the case this exists for, so closed_at cannot be relied upon.
-- ---------------------------------------------------------------------------
create or replace function public.purge_expired_real_names(
  p_retention interval default null
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_retention interval := coalesce(p_retention, public.real_name_retention());
  v_cutoff    timestamptz := now() - v_retention;
  v_rooms     uuid[];
  v_count     integer;
begin
  -- Expired rooms that still hold at least one real name. Rooms already fully
  -- purged are skipped, so repeated runs are cheap and the count is honest.
  select coalesce(array_agg(r.id), '{}')
    into v_rooms
  from public.rooms r
  where r.created_at < v_cutoff
    and exists (
      select 1
      from public.participants p
      where p.room_id = r.id
        and p.real_name is not null
    );

  v_count := coalesce(array_length(v_rooms, 1), 0);
  if v_count = 0 then
    return 0;
  end if;

  update public.participants
     set real_name = null
   where room_id = any(v_rooms)
     and real_name is not null;

  -- Keep the lifecycle coherent: names gone => room closed.
  update public.rooms
     set status    = 'closed',
         closed_at = coalesce(closed_at, now())
   where id = any(v_rooms)
     and status <> 'closed';

  raise notice 'purge_expired_real_names: purged % room(s) older than %',
    v_count, v_retention;

  return v_count;
end;
$$;

comment on function public.purge_expired_real_names(interval)
  is 'Retention enforcement: NULLs real_name and closes every room older than the retention window. Returns the number of rooms purged.';

-- Server-side only. No anon/authenticated execute path anywhere.
revoke all on function public.purge_expired_real_names(interval)
  from public, anon, authenticated;
grant execute on function public.purge_expired_real_names(interval)
  to service_role;

revoke all on function public.real_name_retention() from public, anon, authenticated;
grant execute on function public.real_name_retention() to service_role;

commit;

-- ---------------------------------------------------------------------------
-- Schedule it. Separate from the transaction above: cron.schedule cannot run
-- inside an explicit transaction block on some configurations, and a missing
-- pg_cron must not roll back the function definitions — they are still useful
-- (and testable) on their own.
--
-- If pg_cron is unavailable on this plan, this emits a LOUD WARNING rather
-- than failing the migration. Read the output of `supabase db push`: if you
-- see that warning, the purge exists but NOTHING IS CALLING IT, and you must
-- schedule public.purge_expired_real_names() another way (e.g. a Supabase
-- Edge Function on a schedule, or an external cron hitting an RPC).
-- ---------------------------------------------------------------------------
do $$
declare
  v_has_cron boolean;
begin
  select exists (select 1 from pg_available_extensions where name = 'pg_cron')
    into v_has_cron;

  if not v_has_cron then
    raise warning E'\n\n*** pg_cron IS NOT AVAILABLE ON THIS PROJECT ***\n'
      'public.purge_expired_real_names() was created but is NOT scheduled.\n'
      'Real names will NOT be purged automatically until you schedule it.\n';
    return;
  end if;

  create extension if not exists pg_cron;

  -- Idempotent reschedule: drop any previous definition first.
  perform cron.unschedule(jobid)
    from cron.job
   where jobname = 'purge-expired-real-names';

  perform cron.schedule(
    'purge-expired-real-names',
    '17 * * * *',                       -- hourly, off the hour
    $cron$ select public.purge_expired_real_names(); $cron$
  );

  raise notice 'Scheduled pg_cron job "purge-expired-real-names" (hourly).';
exception
  when insufficient_privilege then
    raise warning E'\n\n*** COULD NOT SCHEDULE pg_cron JOB (insufficient privilege) ***\n'
      'public.purge_expired_real_names() exists but is NOT scheduled.\n'
      'Enable pg_cron in the Supabase dashboard (Database -> Extensions),\n'
      'then re-run this migration.\n';
end;
$$;
