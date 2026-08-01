"use client";

import { useEffect, useState } from "react";
import { BrandNumeral } from "@/components/brand";
import { TICK_COUNT, prefersReducedMotion, tickSchedule } from "./timing";

/**
 * The phone's version of the projection wheel: a single serif numeral cycling
 * through candidate places, decelerating on the same tick schedule, landing
 * on the participant's real place.
 *
 * It cycles POSITIONS rather than names because the question the phone is
 * actually asking is "which number am I" — so the tension and the payoff are
 * the same object.
 *
 * Nothing here is fabricated: the component only mounts once the
 * server-authoritative draw has arrived, and `landOn` is that result. The
 * cycling is pacing, not suspense theatre over an unknown.
 *
 * Reduced motion: renders the landed value immediately, no timers.
 */
export function PlaceTicker({
  total,
  landOn,
  scale = "lg",
}: {
  /** How many people are in the order (the range being cycled). */
  total: number;
  /** The true, already-known place this ticker must land on. */
  landOn: number;
  scale?: "md" | "lg" | "xl";
}) {
  const animate = total > 1 && !prefersReducedMotion();
  const [shown, setShown] = useState(() => (animate ? 1 : landOn));

  useEffect(() => {
    if (!animate) return;
    const schedule = tickSchedule();
    const timeouts = schedule.map((at, i) => {
      // Deterministic stride — a visible shuffle without Math.random, and the
      // final tick is always the true value so the landing is seamless.
      const value = i === TICK_COUNT - 1 ? landOn : ((i * 7 + 3) % total) + 1;
      return window.setTimeout(() => setShown(value), at);
    });
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [animate, total, landOn]);

  return (
    <BrandNumeral value={shown} pad={2} color="accent" scale={scale} />
  );
}

export default PlaceTicker;
