import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  assertNotProduction,
  productionRefs,
  projectRef,
} from "../helpers/liveEnv";

/**
 * Task 7 — the live suites must never run against the production project.
 *
 * These are unit tests (no network, no DB) over the guard itself, so the
 * protection is regression-checked on every `npm test` rather than only when
 * somebody remembers to try the destructive command.
 */
describe("projectRef", () => {
  it("extracts the Supabase project ref from a project URL", () => {
    expect(projectRef("https://abcdefghij.supabase.co")).toBe("abcdefghij");
    expect(projectRef("https://abcdefghij.supabase.co/rest/v1")).toBe(
      "abcdefghij"
    );
  });

  it("returns null for junk", () => {
    expect(projectRef(undefined)).toBeNull();
    expect(projectRef("")).toBeNull();
    expect(projectRef("not a url")).toBeNull();
  });
});

describe("production guard", () => {
  const saved = process.env.TEST_SUPABASE_URL;

  beforeEach(() => {
    delete process.env.TEST_SUPABASE_URL;
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.TEST_SUPABASE_URL;
    else process.env.TEST_SUPABASE_URL = saved;
  });

  it("throws when TEST_SUPABASE_URL is unset", () => {
    expect(() => assertNotProduction()).toThrow(/not a valid Supabase/i);
  });

  it("throws when TEST_SUPABASE_URL is not a URL", () => {
    process.env.TEST_SUPABASE_URL = "oops";
    expect(() => assertNotProduction()).toThrow(/not a valid Supabase/i);
  });

  it("REFUSES every ref it can prove is production", () => {
    const refs = productionRefs();
    // On a machine with no .env.local and no linked project there is nothing
    // to protect; the guard is then vacuously satisfied.
    if (refs.length === 0) {
      expect(refs).toEqual([]);
      return;
    }
    for (const ref of refs) {
      process.env.TEST_SUPABASE_URL = `https://${ref}.supabase.co`;
      expect(() => assertNotProduction(), `ref ${ref} must be refused`).toThrow(
        /REFUSING TO RUN/
      );
    }
  });

  it("allows a project ref that is not production", () => {
    process.env.TEST_SUPABASE_URL =
      "https://definitelyatestproject.supabase.co";
    expect(productionRefs()).not.toContain("definitelyatestproject");
    expect(() => assertNotProduction()).not.toThrow();
  });
});
