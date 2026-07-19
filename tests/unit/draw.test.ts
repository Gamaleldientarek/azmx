/**
 * Unit tests for the deterministic seeded Fisher-Yates draw (src/lib/draw.ts).
 *
 * Covers:
 *  - determinism: same (items, seed) -> identical permutation, every time
 *  - validity: the result is a true permutation of the input
 *  - purity: the input array is never mutated
 *  - fairness: chi-square goodness-of-fit over 10,000 seeded shuffles of
 *    5 items — each position's distribution must be uniform within
 *    statistical tolerance (p > 0.001), and every element must be able to
 *    land in every position.
 *  - generateSeed(): unique, crypto-random seeds.
 */

import { describe, expect, it } from "vitest";
import { generateSeed, shuffle } from "@/lib/draw";

const ITEMS = ["alpha", "bravo", "charlie", "delta", "echo"] as const;

describe("shuffle — determinism", () => {
  it("returns the identical permutation for the same (items, seed) pair", () => {
    const seed = "sharing-tuesday-fixed-seed";
    const first = shuffle(ITEMS, seed);
    for (let i = 0; i < 25; i++) {
      expect(shuffle(ITEMS, seed)).toEqual(first);
    }
  });

  it("is deterministic across differently-typed but equal inputs", () => {
    const a = shuffle(["1", "2", "3", "4"], "seed-x");
    const b = shuffle(["1", "2", "3", "4"], "seed-x");
    expect(a).toEqual(b);
  });

  it("produces different permutations for different seeds (sanity)", () => {
    // With 10 items (10! orderings) two distinct seeds colliding is ~3e-7;
    // check a handful of seeds and require at least one difference.
    const items = Array.from({ length: 10 }, (_, i) => `p${i}`);
    const base = shuffle(items, "seed-A");
    const anyDifferent = ["seed-B", "seed-C", "seed-D"].some(
      (s) => JSON.stringify(shuffle(items, s)) !== JSON.stringify(base)
    );
    expect(anyDifferent).toBe(true);
  });

  it("audit-trail property: a recorded seed reproduces the recorded order", () => {
    // Simulate the app: fresh seed, persist (order, seed), later re-verify.
    const seed = generateSeed();
    const recorded = shuffle(ITEMS, seed);
    expect(shuffle(ITEMS, seed)).toEqual(recorded);
  });
});

describe("shuffle — validity (true permutation)", () => {
  it("returns a permutation: same length, same multiset, no loss/duplication", () => {
    for (let n = 0; n <= 12; n++) {
      const items = Array.from({ length: n }, (_, i) => `item-${i}`);
      const out = shuffle(items, `perm-seed-${n}`);
      expect(out).toHaveLength(n);
      expect([...out].sort()).toEqual([...items].sort());
      expect(new Set(out).size).toBe(n);
    }
  });

  it("preserves duplicate elements as a multiset", () => {
    const items = ["x", "x", "y", "y", "y", "z"];
    const out = shuffle(items, "dupes");
    expect([...out].sort()).toEqual([...items].sort());
  });

  it("handles the degenerate cases: empty and single-element arrays", () => {
    expect(shuffle([], "s")).toEqual([]);
    expect(shuffle(["only"], "s")).toEqual(["only"]);
  });

  it("shuffles object references without cloning them", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const out = shuffle(items, "refs");
    for (const o of out) {
      expect(items.includes(o)).toBe(true); // same references, just reordered
    }
  });
});

describe("shuffle — non-mutation", () => {
  it("does not mutate the input array", () => {
    const items = ["a", "b", "c", "d", "e", "f", "g"];
    const snapshot = [...items];
    const out = shuffle(items, "mutation-check");
    expect(items).toEqual(snapshot);
    expect(out).not.toBe(items); // a new array, not the same reference
  });

  it("accepts a frozen (readonly) array without throwing", () => {
    const frozen = Object.freeze(["a", "b", "c"]);
    expect(() => shuffle(frozen, "frozen")).not.toThrow();
    expect(frozen).toEqual(["a", "b", "c"]);
  });
});

describe("shuffle — fairness (chi-square, 10k shuffles of 5 items)", () => {
  const N = 5;
  const TRIALS = 10_000;
  // Critical value of chi-square with df = 4 at p = 0.001 is 18.467:
  // a statistic below this means we cannot reject uniformity at p > 0.001.
  const CHI2_CRIT_DF4_P001 = 18.467;

  // counts[pos][elem] = how often element `elem` landed at position `pos`.
  const counts: number[][] = Array.from({ length: N }, () =>
    new Array(N).fill(0)
  );
  const items = Array.from({ length: N }, (_, i) => i);
  for (let t = 0; t < TRIALS; t++) {
    const out = shuffle(items, `fairness-trial-${t}`);
    for (let pos = 0; pos < N; pos++) counts[pos][out[pos]]++;
  }
  const expected = TRIALS / N; // 2000 per cell under uniformity

  it.each(Array.from({ length: N }, (_, pos) => pos))(
    "position %i: element distribution is uniform (chi-square, p > 0.001)",
    (pos) => {
      let chi2 = 0;
      for (let elem = 0; elem < N; elem++) {
        const diff = counts[pos][elem] - expected;
        chi2 += (diff * diff) / expected;
      }
      expect(
        chi2,
        `chi-square at position ${pos} was ${chi2.toFixed(3)} ` +
          `(crit ${CHI2_CRIT_DF4_P001}); counts=${JSON.stringify(counts[pos])}`
      ).toBeLessThan(CHI2_CRIT_DF4_P001);
    }
  );

  it("per-element view: each element's landing positions are uniform too", () => {
    for (let elem = 0; elem < N; elem++) {
      let chi2 = 0;
      for (let pos = 0; pos < N; pos++) {
        const diff = counts[pos][elem] - expected;
        chi2 += (diff * diff) / expected;
      }
      expect(
        chi2,
        `chi-square for element ${elem} was ${chi2.toFixed(3)}`
      ).toBeLessThan(CHI2_CRIT_DF4_P001);
    }
  });

  it("every element can land in every position (no structural dead zones)", () => {
    for (let pos = 0; pos < N; pos++) {
      for (let elem = 0; elem < N; elem++) {
        expect(
          counts[pos][elem],
          `element ${elem} never landed at position ${pos} in ${TRIALS} trials`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("all 120 permutations of 5 items occur across the 10k trials", () => {
    // Stronger structural check: with 10k trials and 120 equally likely
    // permutations, the chance any one is missing is < 120 * (119/120)^10000
    // ~ 5e-35. A missing permutation means real bias.
    const seen = new Set<string>();
    for (let t = 0; t < TRIALS; t++) {
      seen.add(shuffle(items, `fairness-trial-${t}`).join(","));
    }
    expect(seen.size).toBe(120);
  });
});

describe("generateSeed", () => {
  it("produces unique, non-empty seeds (uuid + timestamp shape)", () => {
    const seeds = new Set(Array.from({ length: 1000 }, () => generateSeed()));
    expect(seeds.size).toBe(1000);
    for (const s of seeds) {
      expect(s).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-\d{13,}$/
      );
      break; // shape-check one; uniqueness already asserted for all
    }
  });
});
