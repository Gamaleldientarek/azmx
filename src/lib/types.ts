/**
 * Shared TypeScript types for the Sharing Tuesday data layer.
 *
 * These mirror the Postgres schema in `supabase/migrations/0001_schema.sql`
 * and the sanitized `participants_public` view from `0003_rls.sql`.
 */

/** Lifecycle of a room: lobby -> drawing -> revealed -> closed. */
export type RoomStatus =
  | "lobby"
  | "locked"
  | "drawing"
  | "revealed"
  | "closed";

/** Row of `public.rooms`. */
export interface Room {
  id: string;
  code: string;
  name: string | null;
  status: RoomStatus;
  draw_seed: string | null;
  starter_participant_id: string | null;
  created_at: string;
  closed_at: string | null;
}

/**
 * Full row of `public.participants`. Only ever visible server-side
 * (service role). `real_name` is null after the room closes (privacy purge).
 */
export interface Participant {
  id: string;
  room_id: string;
  real_name: string | null;
  display_name: string;
  join_number: number;
  joined_at: string;
}

/**
 * Sanitized participant as exposed to clients via the
 * `participants_public` view / column-granted reads. Never contains
 * `real_name`.
 */
export interface ParticipantPublic {
  id: string;
  room_id: string;
  display_name: string;
  join_number: number;
  joined_at: string;
}

/** Row of `public.draws`. `order` is the ordered array of participant ids. */
export interface Draw {
  id: string;
  room_id: string;
  order: string[];
  starter_participant_id: string;
  seed: string;
  created_at: string;
}

/** Row returned by the `lock_room_for_draw` RPC (frozen draw set). */
export interface DrawSetEntry {
  participant_id: string;
  join_number: number;
}

/* ----------------------------------------------------------------------- */
/* Discriminated-union results for server actions                          */
/* ----------------------------------------------------------------------- */

export type ActionError<E extends string> = {
  ok: false;
  /** Stable machine-readable error code. */
  error: E;
  /** Human-friendly message safe to render in the UI. */
  message: string;
};

export type JoinRoomErrorCode =
  | "invalid_name"
  | "invalid_code"
  | "room_not_joinable"
  | "room_full"
  | "server_error";

export type JoinRoomResult =
  | {
      ok: true;
      /**
       * Deliberately WITHOUT `real_name`. The result of a join is reachable
       * via the cookie-recovery branch, where the seat belongs to the browser
       * rather than to the submitter — so returning a real name there would
       * hand it to whoever holds a shared phone next. Omitting it from the
       * type makes that a compile error rather than a convention.
       */
      participant: {
        id: string;
        display_name: string;
        join_number: number;
      };
      roomId: string;
      /** Scoped Supabase JWT for reads + Realtime on this room only. */
      roomToken: string;
    }
  | ActionError<JoinRoomErrorCode>;

export type CreateRoomErrorCode = "unauthorized" | "server_error";

export type CreateRoomResult =
  | {
      ok: true;
      room: {
        id: string;
        code: string;
        joinUrl: string;
      };
    }
  | ActionError<CreateRoomErrorCode>;

export type CloseRoomErrorCode = "unauthorized" | "server_error";

export type CloseRoomResult = { ok: true } | ActionError<CloseRoomErrorCode>;

export type RunDrawErrorCode =
  | "unauthorized"
  | "room_not_found"
  | "room_closed"
  | "no_participants"
  | "server_error";

export type RunDrawResult =
  | {
      ok: true;
      /** Participant ids in final speaking order. `order[0]` is the starter. */
      order: string[];
      starterParticipantId: string;
      seed: string;
      drawId: string;
    }
  | ActionError<RunDrawErrorCode>;

export type LoginResult =
  | { ok: true }
  | ActionError<"invalid_password" | "rate_limited" | "server_error">;
