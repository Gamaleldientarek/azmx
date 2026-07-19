-- 0001_schema.sql
-- Sharing Tuesday — Random Selector: core schema.
-- Idempotent and re-runnable (IF NOT EXISTS everywhere).
--
-- Design notes:
--   * All PKs are uuid with gen_random_uuid() (pgcrypto / built-in in PG13+).
--   * room_id FKs cascade so purging a room removes its participants + draws.
--   * rooms.starter_participant_id references participants(id); because that
--     table is created after rooms we add the FK afterwards in a guarded DO
--     block (ON DELETE SET NULL — losing a participant must not delete a room).
--   * Writes only ever happen server-side (service role) or through the
--     SECURITY DEFINER functions in 0002. RLS + grants (0003) block anon writes.

begin;

-- gen_random_uuid() is built in on modern Postgres; pgcrypto guarantees it on
-- older instances. Safe to request either way.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- rooms
-- ---------------------------------------------------------------------------
create table if not exists public.rooms (
  id                     uuid        primary key default gen_random_uuid(),
  code                   text        not null unique,
  name                   text,
  status                 text        not null default 'lobby'
                                     check (status in ('lobby','drawing','revealed','closed')),
  draw_seed              text,
  starter_participant_id uuid,
  created_at             timestamptz not null default now(),
  closed_at              timestamptz
);

comment on table  public.rooms is 'One row per weekly Sharing Tuesday session.';
comment on column public.rooms.id     is 'Unguessable id used in /room/[id] and /screen/[id] URLs.';
comment on column public.rooms.code   is 'Short human code shown on the projection screen, e.g. TUES-4821.';
comment on column public.rooms.status is 'Lifecycle: lobby -> drawing -> revealed -> closed.';

-- ---------------------------------------------------------------------------
-- participants
-- ---------------------------------------------------------------------------
create table if not exists public.participants (
  id           uuid        primary key default gen_random_uuid(),
  room_id      uuid        not null references public.rooms(id) on delete cascade,
  real_name    text        check (real_name is null or btrim(real_name) <> ''),
  display_name text        not null,
  join_number  int         not null,
  joined_at    timestamptz not null default now(),
  constraint participants_room_join_number_key unique (room_id, join_number),
  constraint participants_room_display_name_key unique (room_id, display_name)
);

comment on table  public.participants is 'People who joined a room. real_name is private and purged on close.';
comment on column public.participants.real_name    is 'PRIVATE. Never exposed to non-facilitator reads. NULLed on room close.';
comment on column public.participants.display_name is 'Curated fun name from name_pool, unique within the room.';
comment on column public.participants.join_number  is 'Gap-free 1..N order joined (assigned under a room row lock).';

-- ---------------------------------------------------------------------------
-- draws  (one row per selector run; latest by created_at is the current order)
-- ---------------------------------------------------------------------------
create table if not exists public.draws (
  id                     uuid        primary key default gen_random_uuid(),
  room_id                uuid        not null references public.rooms(id) on delete cascade,
  "order"                jsonb       not null,
  starter_participant_id uuid,
  seed                   text,
  created_at             timestamptz not null default now()
);

comment on table  public.draws is 'Fisher-Yates results. Redraws append new rows; latest row = current order.';
comment on column public.draws."order" is 'Ordered JSON array of participant ids, e.g. ["uuid","uuid",...].';

-- ---------------------------------------------------------------------------
-- name_pool  (curated fun names; seeded in 0004)
-- ---------------------------------------------------------------------------
create table if not exists public.name_pool (
  id           uuid primary key default gen_random_uuid(),
  display_name text not null unique
);

comment on table public.name_pool is 'Curated halal-friendly fun names. Pool (40) > max room (~25) so names stay unique.';

-- ---------------------------------------------------------------------------
-- rooms.starter_participant_id FK (added after participants exists)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rooms_starter_participant_fk'
  ) then
    alter table public.rooms
      add constraint rooms_starter_participant_fk
      foreign key (starter_participant_id)
      references public.participants(id)
      on delete set null;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Indexes
--   * participants(room_id): roster lookups + Realtime row filtering.
--     (The UNIQUE(room_id, join_number) index already covers a room_id prefix,
--      but an explicit index keeps intent clear and helps roster reads.)
--   * draws(room_id, created_at desc): fetch the latest draw for a room fast.
-- ---------------------------------------------------------------------------
create index if not exists participants_room_id_idx
  on public.participants (room_id);

create index if not exists draws_room_id_created_at_idx
  on public.draws (room_id, created_at desc);

commit;
