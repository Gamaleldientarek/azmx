"use client";

import { useEffect, useState } from "react";
import { BrandNumeral, Chevron, Eyebrow } from "@/components/brand";
import {
  SETTLE_PAUSE_MS,
  STARTER_HOLD_MS,
  TICK_COUNT,
  prefersReducedMotion,
  tickSchedule,
} from "@/components/motion/timing";

/**
 * WheelReveal — the animated reveal on the projection (the deck's one
 * centered composition). `data-slot="wheel-stage"`.
 *
 * Animation contract (driven by room status + draws broadcast):
 *  1. WHEEL — cycle across participant fun names for ~3.5s with ease-out
 *     deceleration (spinner settling), landing on the STARTER.
 *  2. STARTER — held spotlight beat (~1.5s).
 *  3. RESOLVED — the remaining order cascades in with staggered az-rise
 *     entrances.
 *
 * `prefers-reduced-motion` skips straight to the settled order (the az-rise
 * keyframe is also disabled globally in globals.css).
 *
 * Props are the already-computed server-side Fisher-Yates result. This
 * component performs NO shuffling and NO data fetching. Parents re-run the
 * reveal for a redraw by remounting with `key={draw.id}`.
 */
export interface RevealParticipant {
  id: string;
  displayName: string;
  joinNumber: number;
}

export interface WheelRevealProps {
  /** Final running order; `order[0]` is the starter. */
  order: RevealParticipant[];
  /** Skip the animation and show the settled layout (already-revealed load). */
  resolved?: boolean;
}

type Phase = "wheel" | "starter" | "resolved";

/**
 * Tick schedule, settle pause and starter hold now come from the shared
 * motion language (src/components/motion/timing.ts) — the facilitator panel
 * and the participant phone schedule against the same landing instant, so the
 * three surfaces resolve together instead of racing each other.
 */

/** True when the reveal should skip the animation entirely. */
function skipAnimation(resolved: boolean, orderLength: number): boolean {
  return resolved || orderLength < 2 || prefersReducedMotion();
}

export function WheelReveal({ order, resolved = false }: WheelRevealProps) {
  // Decided once, lazily: animated reveals only ever mount client-side (a
  // live draw arriving over Realtime), so matchMedia is available here.
  const [phase, setPhase] = useState<Phase>(() =>
    skipAnimation(resolved, order.length) ? "resolved" : "wheel"
  );
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    if (skipAnimation(resolved, order.length)) return;

    const timeouts: number[] = [];
    // Interval grows on a power curve — the spinner visibly slows down.
    const schedule = tickSchedule();
    schedule.forEach((at, i) => {
      const idx = (i + 1) % order.length;
      timeouts.push(window.setTimeout(() => setCycleIndex(idx), at));
    });
    const at = schedule[TICK_COUNT - 1];
    timeouts.push(
      window.setTimeout(() => setPhase("starter"), at + SETTLE_PAUSE_MS)
    );
    timeouts.push(
      window.setTimeout(
        () => setPhase("resolved"),
        at + SETTLE_PAUSE_MS + STARTER_HOLD_MS
      )
    );
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [resolved, order]);

  const starter = order[0];
  const rest = order.slice(1);
  const spinning = phase === "wheel";
  const shownName = spinning
    ? order[cycleIndex % order.length].displayName
    : starter.displayName;

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center px-[5vw] py-[4vh] text-center"
      data-slot="wheel-stage"
    >
      <Eyebrow surface="dark" tick>
        {spinning ? "Drawing the order" : "The order is set"}
      </Eyebrow>

      {/* Starter spotlight — cycles fun names, then settles on the starter. */}
      <div className="mt-[2vh] flex flex-col items-center">
        <span className="az-proj-label text-blue-200">Goes first</span>
        <div
          className={`mt-[1.4vh] flex items-center gap-[1.6vw] ${
            spinning ? "" : "az-rise"
          }`}
        >
          {/* White on the gradient — Light Blue fails contrast near the Electric end. */}
          <BrandNumeral value={1} pad={2} color="white" scale="md" />
          <Chevron
            variant="filled"
            color="white"
            size={52}
            direction="right"
          />
          <h2
            className={`font-display text-[clamp(2.5rem,6.5vw,7.5rem)] leading-[0.95] text-white ${
              spinning ? "opacity-80" : ""
            }`}
          >
            {shownName}
          </h2>
        </div>
      </div>

      {/* Announce only the settled result to assistive tech (no spam). */}
      <p className="sr-only" aria-live="polite">
        {spinning
          ? "Drawing the order"
          : `${starter.displayName} goes first`}
      </p>

      {/* The full order — settles under the starter after the held beat. */}
      {phase === "resolved" && (
        <ol className="mt-[4vh] grid w-full max-w-[76vw] grid-cols-2 gap-x-[3vw] gap-y-[1.4vh] text-start sm:grid-cols-3">
          {rest.map((p, i) => (
            <li
              key={p.id}
              className="az-rise flex items-baseline gap-[1vw] border-t border-hairline-dark pt-[1vh]"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <BrandNumeral
                value={i + 2}
                pad={2}
                color="white"
                scale="sm"
                className="shrink-0"
              />
              <span className="font-display text-[clamp(1.1rem,1.9vw,2.1rem)] leading-tight text-white">
                {p.displayName}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default WheelReveal;
