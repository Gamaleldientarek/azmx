/**
 * Deterministic, seedable Fisher-Yates shuffle.
 *
 * Pure and side-effect free: the same (items, seed) pair always produces the
 * same order, which is what makes the persisted `seed` a real audit trail —
 * anyone can re-run the shuffle and verify the recorded result.
 *
 * PRNG: xoshiro128** seeded from the SHA-256 of the seed string.
 */

import { createHash } from "node:crypto";

/** Derive four 32-bit PRNG state words from an arbitrary seed string. */
function seedState(seed: string): [number, number, number, number] {
  const digest = createHash("sha256").update(seed, "utf8").digest();
  // 32 bytes -> 4x uint32 (first 16 bytes; SHA-256 bits are uniformly mixed).
  const s: [number, number, number, number] = [
    digest.readUInt32LE(0),
    digest.readUInt32LE(4),
    digest.readUInt32LE(8),
    digest.readUInt32LE(12),
  ];
  // xoshiro state must not be all-zero (probability ~2^-128, but be exact).
  if ((s[0] | s[1] | s[2] | s[3]) === 0) s[0] = 1;
  return s;
}

/** xoshiro128** — fast, high-quality 32-bit PRNG. Returns floats in [0, 1). */
function xoshiro128ss(seed: string): () => number {
  let [a, b, c, d] = seedState(seed);
  return () => {
    const t = b << 9;
    let r = b * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = (d << 11) | (d >>> 21);
    return (r >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle, deterministic for a given seed.
 * Does not mutate `items`; returns a new array.
 */
export function shuffle<T>(items: readonly T[], seed: string): T[] {
  const next = xoshiro128ss(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Fresh, unpredictable seed for a new draw: cryptographically random UUID
 * plus a timestamp (readability in the audit log).
 */
export function generateSeed(): string {
  return `${crypto.randomUUID()}-${Date.now()}`;
}
