/**
 * The house motion language — one easing family, three durations, one tick
 * schedule. Every animated surface (projection wheel, facilitator panel,
 * participant phone) derives its timing from here so the three read as the
 * same family rather than three separate ideas.
 *
 * Personality: PREMIUM. Decelerating entrances, zero overshoot, nothing
 * bouncy. Restraint is the luxury.
 *
 * Durations live in CSS as --az-dur-* (globals.css); the JS constants below
 * are only for choreography that has to be scheduled, not styled.
 */

/** Signature curve — expo-out. Entrances, settles, landings (80% of motion). */
export const AZ_EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
/** On-screen moves that start and end in place: FLIP reorders, travelling bands. */
export const AZ_EASE_INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Duration palette. Anything outside these three needs a reason. */
export const AZ_DUR_QUICK = 180;
export const AZ_DUR_BASE = 420;
export const AZ_DUR_SLOW = 620;

/* ---------------------------------------------------------------------------
 * The tick schedule — the spinner deceleration shared by the projection wheel
 * and the phone's place ticker. Interval grows on a power curve, so the
 * cycling visibly slows into its landing instead of stopping dead.
 * ------------------------------------------------------------------------ */
export const TICK_COUNT = 24;
export const TICK_BASE_MS = 55;
export const TICK_GROWTH_MS = 330;
export const TICK_EXP = 2.2;

/** Held beat after the last tick, before the result is acknowledged. */
export const SETTLE_PAUSE_MS = 220;
/** Projection only: how long the starter holds the stage before the cascade. */
export const STARTER_HOLD_MS = 1500;

/** Cumulative offsets (ms from start) for each tick. */
export function tickSchedule(): number[] {
  const out: number[] = [];
  let at = 0;
  for (let i = 0; i < TICK_COUNT; i++) {
    at += TICK_BASE_MS + TICK_GROWTH_MS * Math.pow(i / (TICK_COUNT - 1), TICK_EXP);
    out.push(at);
  }
  return out;
}

/** Total spin time, last tick inclusive (~3.8s). */
export const WHEEL_SPIN_MS = Math.round(tickSchedule()[TICK_COUNT - 1]);

/**
 * The shared landing instant (~4.0s after the draw arrives). The projection
 * settles on the starter here; the facilitator's roster resolves here; the
 * participant's place locks here. All three surfaces receive the same
 * realtime INSERT within a few ms of each other, so scheduling from arrival
 * keeps the room in sync — and critically stops the phone from spoiling the
 * big screen (it used to reveal 2.2s early).
 */
export const WHEEL_LAND_MS = WHEEL_SPIN_MS + SETTLE_PAUSE_MS;

/** Phone: how long the place holds alone before the full order cascades in. */
export const PLACE_HOLD_MS = 900;
/** Phone: going first earns a materially longer beat than going seventh. */
export const FIRST_HOLD_MS = 1600;

/**
 * A draw arriving within this window of mount is a late page load (refresh,
 * someone opening their phone after the fact), not a live event — those jump
 * straight to the settled state instead of replaying a reveal they missed.
 */
export const LATE_LOAD_GRACE_MS = 1800;

/** SSR-safe reduced-motion check. Call at event/effect time, never in render. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
