import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
  resetLoginRateLimit,
} from "@/lib/loginRateLimit";

/**
 * Task 5 — `loginFacilitator` accepted unlimited unauthenticated password
 * attempts against a single shared credential that unlocks every room.
 */
beforeEach(() => {
  resetLoginRateLimit();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("login rate limiting", () => {
  it("allows an unknown key", () => {
    expect(checkLoginAllowed("1.1.1.1").allowed).toBe(true);
  });

  it("tolerates a few honest typos before locking", () => {
    for (let i = 0; i < 3; i++) {
      expect(recordLoginFailure("1.1.1.1").allowed, `attempt ${i + 1}`).toBe(
        true
      );
    }
    // The 4th failure trips it.
    expect(recordLoginFailure("1.1.1.1").allowed).toBe(false);
  });

  it("backs off exponentially", () => {
    const ip = "2.2.2.2";
    for (let i = 0; i < 3; i++) recordLoginFailure(ip);

    const first = recordLoginFailure(ip).retryAfterSeconds;
    const second = recordLoginFailure(ip).retryAfterSeconds;
    const third = recordLoginFailure(ip).retryAfterSeconds;

    expect(first).toBeGreaterThan(0);
    expect(second).toBeGreaterThan(first);
    expect(third).toBeGreaterThan(second);
  });

  it("caps the lockout so a user is never permanently locked out", () => {
    const ip = "3.3.3.3";
    for (let i = 0; i < 40; i++) recordLoginFailure(ip);
    expect(checkLoginAllowed(ip).retryAfterSeconds).toBeLessThanOrEqual(
      15 * 60
    );
  });

  it("recovers once the lockout elapses", () => {
    const ip = "4.4.4.4";
    for (let i = 0; i < 4; i++) recordLoginFailure(ip);
    const state = checkLoginAllowed(ip);
    expect(state.allowed).toBe(false);

    vi.advanceTimersByTime((state.retryAfterSeconds + 1) * 1000);
    expect(checkLoginAllowed(ip).allowed).toBe(true);
  });

  it("isolates keys — one attacker cannot lock out everybody", () => {
    for (let i = 0; i < 10; i++) recordLoginFailure("attacker");
    expect(checkLoginAllowed("attacker").allowed).toBe(false);
    expect(checkLoginAllowed("innocent-facilitator").allowed).toBe(true);
  });

  it("clears history on a successful login", () => {
    const ip = "5.5.5.5";
    for (let i = 0; i < 4; i++) recordLoginFailure(ip);
    expect(checkLoginAllowed(ip).allowed).toBe(false);

    clearLoginFailures(ip);
    expect(checkLoginAllowed(ip).allowed).toBe(true);
  });
});
