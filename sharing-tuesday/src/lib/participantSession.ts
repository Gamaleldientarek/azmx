"use client";

/**
 * Participant identity persistence — sessionStorage, keyed by roomId, so a
 * refresh of /room/[roomId] survives on the same phone/tab. Client only.
 *
 * Stores the scoped room JWT (`roomToken`) plus the participant's fun
 * identity. Never the real name — that stays server-side.
 */

import { useSyncExternalStore } from "react";

export interface StoredParticipant {
  id: string;
  display_name: string;
  join_number: number;
}

export interface ParticipantSession {
  roomId: string;
  /** Human room code, kept so a "rejoin" prompt can link back to /join. */
  roomCode: string;
  /** Scoped Supabase JWT for RLS reads + Realtime on this room only. */
  roomToken: string;
  participant: StoredParticipant;
}

const storageKey = (roomId: string) => `st:participant:${roomId}`;

/** True when the JWT's `exp` claim is in the past (or unreadable). */
function tokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function saveParticipantSession(session: ParticipantSession): void {
  try {
    // Never persist the real name: the seat cookie belongs to the browser,
    // not the person, so a shared phone would surface the previous joiner's
    // real name to whoever holds it next.
    const { id, display_name, join_number } = session.participant;
    const safe: ParticipantSession = {
      ...session,
      participant: { id, display_name, join_number },
    };
    sessionStorage.setItem(storageKey(session.roomId), JSON.stringify(safe));
  } catch {
    // Storage unavailable (private mode edge cases) — the page still works
    // for this navigation; only refresh-survival is lost.
  }
}

/**
 * Load the stored session for a room. Returns null when missing, malformed,
 * or when the scoped token has expired (the caller shows a rejoin prompt).
 */
export function loadParticipantSession(
  roomId: string
): ParticipantSession | null {
  try {
    const raw = sessionStorage.getItem(storageKey(roomId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ParticipantSession>;
    if (
      typeof parsed.roomToken !== "string" ||
      typeof parsed.roomId !== "string" ||
      typeof parsed.roomCode !== "string" ||
      typeof parsed.participant?.id !== "string" ||
      typeof parsed.participant?.display_name !== "string" ||
      typeof parsed.participant?.join_number !== "number"
    ) {
      return null;
    }
    if (tokenExpired(parsed.roomToken)) return null;
    return parsed as ParticipantSession;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------------ */
/* React hook — hydration-safe sessionStorage read                          */
/* ------------------------------------------------------------------------ */

const NOOP_SUBSCRIBE = () => () => {};

/**
 * Module-level snapshot cache so `getSnapshot` returns a referentially
 * stable value for an unchanged raw string (useSyncExternalStore requires
 * this to avoid render loops).
 */
const snapshotCache = new Map<
  string,
  { raw: string | null; parsed: ParticipantSession | null }
>();

/**
 * Read the participant session for a room.
 *
 * - `undefined` during SSR/hydration (render a quiet shell — no flash of the
 *   wrong state and no hydration mismatch),
 * - `null` when there is no valid, unexpired session on this phone,
 * - the session otherwise.
 */
export function useParticipantSession(
  roomId: string
): ParticipantSession | null | undefined {
  return useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => {
      let raw: string | null = null;
      try {
        raw = sessionStorage.getItem(storageKey(roomId));
      } catch {
        raw = null;
      }
      const cached = snapshotCache.get(roomId);
      if (!cached || cached.raw !== raw) {
        snapshotCache.set(roomId, {
          raw,
          parsed: loadParticipantSession(roomId),
        });
      }
      return snapshotCache.get(roomId)!.parsed;
    },
    () => undefined
  );
}
