import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Task 9 — `resolveBaseUrl` feeds the QR code rendered on the projection
 * screen. A forged `x-forwarded-host` would therefore project a QR pointing
 * at an attacker's clone of the join form, harvesting real names.
 *
 * The header fallback must be dev-only, and allow-listed in production.
 */

const headerStore = { map: new Map<string, string>() };

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (k: string) => headerStore.map.get(k.toLowerCase()) ?? null,
  }),
}));

function setHeaders(h: Record<string, string>) {
  headerStore.map = new Map(
    Object.entries(h).map(([k, v]) => [k.toLowerCase(), v])
  );
}

async function resolve() {
  const mod = await import("@/lib/baseUrl");
  return mod.resolveBaseUrl();
}

const savedNodeEnv = process.env.NODE_ENV;
const savedAppUrl = process.env.NEXT_PUBLIC_APP_URL;

function setNodeEnv(value: string) {
  // NODE_ENV is readonly in the Node types; tests legitimately need to drive it.
  (process.env as Record<string, string>).NODE_ENV = value;
}

beforeEach(() => {
  vi.resetModules();
  setHeaders({});
  delete process.env.NEXT_PUBLIC_APP_URL;
});

afterEach(() => {
  setNodeEnv(savedNodeEnv as string);
  if (savedAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = savedAppUrl;
});

describe("resolveBaseUrl — explicit configuration wins", () => {
  it("uses NEXT_PUBLIC_APP_URL and ignores the headers entirely", async () => {
    setNodeEnv("production");
    process.env.NEXT_PUBLIC_APP_URL =
      "https://games.gamaleldien.com/random-selector";
    setHeaders({ "x-forwarded-host": "evil.example.com" });
    expect(await resolve()).toBe("https://games.gamaleldien.com/random-selector");
  });

  it("strips a trailing slash", async () => {
    setNodeEnv("production");
    process.env.NEXT_PUBLIC_APP_URL =
      "https://games.gamaleldien.com/random-selector/";
    expect(await resolve()).toBe("https://games.gamaleldien.com/random-selector");
  });
});

describe("resolveBaseUrl — production host allow-list", () => {
  beforeEach(() => setNodeEnv("production"));

  it("REFUSES a forged host rather than emitting an attacker URL", async () => {
    setHeaders({ "x-forwarded-host": "evil.example.com" });
    await expect(resolve()).rejects.toThrow(/untrusted host/i);
  });

  it("refuses a forged host even when it merely contains the real one", async () => {
    setHeaders({ "x-forwarded-host": "games.gamaleldien.com.evil.example" });
    await expect(resolve()).rejects.toThrow(/untrusted host/i);
  });

  it("refuses when no host header is present at all", async () => {
    setHeaders({});
    await expect(resolve()).rejects.toThrow(/untrusted host/i);
  });

  it("refuses localhost in production", async () => {
    setHeaders({ host: "localhost:3000" });
    await expect(resolve()).rejects.toThrow(/untrusted host/i);
  });

  it("accepts the real public host", async () => {
    setHeaders({ "x-forwarded-host": "games.gamaleldien.com" });
    expect(await resolve()).toBe("https://games.gamaleldien.com/random-selector");
  });

  it("accepts a Vercel deployment host", async () => {
    setHeaders({ "x-forwarded-host": "sharing-tuesday-abc123.vercel.app" });
    expect(await resolve()).toBe(
      "https://sharing-tuesday-abc123.vercel.app/random-selector"
    );
  });
});

describe("resolveBaseUrl — development fallback", () => {
  beforeEach(() => setNodeEnv("development"));

  it("falls back to localhost with http", async () => {
    setHeaders({});
    expect(await resolve()).toBe("http://localhost:3000/random-selector");
  });

  it("honours whatever host dev is served on", async () => {
    setHeaders({ host: "127.0.0.1:3999" });
    expect(await resolve()).toBe("http://127.0.0.1:3999/random-selector");
  });
});
