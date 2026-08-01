"use client";

import { useEffect, useState } from "react";

/**
 * Live session stopwatch — elapsed time since the room was created.
 *
 * Clock-skew safe: the server passes both `createdAt` and its own `serverNow`,
 * so the offset between the viewer's device clock and the server is measured
 * once at mount. Everyone in the room therefore sees the same elapsed time
 * even if a phone's clock is minutes off.
 *
 * Freezes at `closedAt` once the session ends, so the final reading is the
 * total session length rather than a clock that keeps running forever.
 *
 * Renders a stable placeholder until mounted (no hydration mismatch — the
 * server cannot know the client's tick).
 */
export interface RoomClockProps {
  /** ISO timestamp: when the room was created. */
  createdAt: string;
  /** ISO timestamp of the server's "now" at render — used to correct skew. */
  serverNow: string;
  /** ISO timestamp when the room closed; freezes the clock when present. */
  closedAt?: string | null;
  className?: string;
}

/** mm:ss, or h:mm:ss past an hour. Never negative. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function RoomClock({
  createdAt,
  serverNow,
  closedAt,
  className = "",
}: RoomClockProps) {
  const createdMs = Date.parse(createdAt);
  const closedMs = closedAt ? Date.parse(closedAt) : null;

  // Frozen total for a closed room — no ticking needed, and it is identical
  // on the server and the client, so it can render immediately.
  const frozen =
    closedMs !== null && Number.isFinite(closedMs)
      ? formatElapsed(closedMs - createdMs)
      : null;

  const [elapsed, setElapsed] = useState<string | null>(null);

  useEffect(() => {
    if (frozen !== null || !Number.isFinite(createdMs)) return;

    // Offset measured once: how far this device's clock sits from the
    // server's. Applied to every subsequent tick.
    const skew = Date.parse(serverNow) - Date.now();
    const tick = () => setElapsed(formatElapsed(Date.now() + skew - createdMs));

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [createdMs, serverNow, frozen]);

  const value = frozen ?? elapsed;

  return (
    <span
      className={`tabular-nums ${className}`.trim()}
      // Announce the total once at the end; a per-second live region would
      // be unusable with a screen reader.
      aria-live={frozen !== null ? "polite" : "off"}
    >
      {value ?? "--:--"}
    </span>
  );
}

export default RoomClock;
