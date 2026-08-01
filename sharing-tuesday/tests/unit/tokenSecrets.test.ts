import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  FACILITATOR_AUDIENCE,
  PARTICIPANT_AUDIENCE,
  TOKEN_ISSUER,
  facilitatorSecrets,
  facilitatorSessionVersion,
  participantSecrets,
} from "@/lib/tokenSecrets";
import { verifyWithClaims } from "@/lib/tokenVerify";

/**
 * D3 — one secret used to sign two token types, and rotating it silently
 * broke every participant seat cookie (roster doubled, no operational
 * signal). These tests pin the replacement model:
 *
 *   - the two token types use SEPARATE secrets and SEPARATE audiences,
 *   - a `_PREVIOUS` secret keeps live sessions valid across a rotation,
 *   - the legacy `SESSION_SECRET` still works so deploying this is not
 *     itself a breaking rotation,
 *   - a token that verifies against NO secret is reported as a signature
 *     failure rather than being indistinguishable from "no cookie".
 */

const KEYS = [
  "SESSION_SECRET",
  "FACILITATOR_SESSION_SECRET",
  "FACILITATOR_SESSION_SECRET_PREVIOUS",
  "PARTICIPANT_COOKIE_SECRET",
  "PARTICIPANT_COOKIE_SECRET_PREVIOUS",
  "FACILITATOR_PASSWORD",
  "FACILITATOR_SESSION_VERSION",
] as const;

const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

const enc = (s: string) => new TextEncoder().encode(s);

/** Mint a token the way the app does, with claims. */
async function mint(secret: string, audience: string, claims: object) {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(enc(secret));
}

/** Mint a LEGACY token — no iss, no aud, as the old code produced. */
async function mintLegacy(secret: string, claims: object) {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(enc(secret));
}

describe("secret resolution", () => {
  it("throws when nothing is configured", () => {
    expect(() => facilitatorSecrets()).toThrow(/FACILITATOR_SESSION_SECRET/);
    expect(() => participantSecrets()).toThrow(/PARTICIPANT_COOKIE_SECRET/);
  });

  it("falls back to the legacy SESSION_SECRET (deployed env keeps working)", () => {
    process.env.SESSION_SECRET = "legacy-secret";
    expect(facilitatorSecrets().migrated).toBe(false);
    expect(participantSecrets().migrated).toBe(false);
    expect(facilitatorSecrets().verification).toHaveLength(1);
  });

  it("prefers the dedicated secret and keeps legacy as verify-only", () => {
    process.env.SESSION_SECRET = "legacy-secret";
    process.env.FACILITATOR_SESSION_SECRET = "new-facilitator";
    const s = facilitatorSecrets();
    expect(s.migrated).toBe(true);
    expect(s.signing).toEqual(enc("new-facilitator"));
    // signing + legacy fallback
    expect(s.verification).toHaveLength(2);
    expect(s.verification[0]).toEqual(enc("new-facilitator"));
  });

  it("gives the two token types DIFFERENT signing keys", () => {
    process.env.FACILITATOR_SESSION_SECRET = "facilitator-key";
    process.env.PARTICIPANT_COOKIE_SECRET = "participant-key";
    expect(facilitatorSecrets().signing).not.toEqual(
      participantSecrets().signing
    );
  });

  it("does not duplicate a secret that appears twice", () => {
    process.env.SESSION_SECRET = "same";
    process.env.FACILITATOR_SESSION_SECRET = "same";
    expect(facilitatorSecrets().verification).toHaveLength(1);
  });
});

describe("cross-type confusion", () => {
  it("rejects a facilitator token presented as a seat cookie", async () => {
    process.env.FACILITATOR_SESSION_SECRET = "shared-by-accident";
    process.env.PARTICIPANT_COOKIE_SECRET = "shared-by-accident";
    const facToken = await mint("shared-by-accident", FACILITATOR_AUDIENCE, {
      role: "facilitator",
    });
    // Even with IDENTICAL secrets, the audience keeps them apart.
    const out = await verifyWithClaims(
      facToken,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.payload).toBeNull();
  });

  it("rejects a seat cookie presented as a facilitator session", async () => {
    process.env.FACILITATOR_SESSION_SECRET = "shared-by-accident";
    process.env.PARTICIPANT_COOKIE_SECRET = "shared-by-accident";
    const seat = await mint("shared-by-accident", PARTICIPANT_AUDIENCE, {
      room_id: "r1",
      participant_id: "p1",
    });
    const out = await verifyWithClaims(
      seat,
      facilitatorSecrets(),
      FACILITATOR_AUDIENCE
    );
    expect(out.payload).toBeNull();
  });
});

describe("rotation is non-breaking", () => {
  it("accepts a token signed with the PREVIOUS secret", async () => {
    const old = await mint("old-key", PARTICIPANT_AUDIENCE, {
      room_id: "r1",
      participant_id: "p1",
    });
    process.env.PARTICIPANT_COOKIE_SECRET = "new-key";
    process.env.PARTICIPANT_COOKIE_SECRET_PREVIOUS = "old-key";

    const out = await verifyWithClaims(
      old,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.signatureFailed).toBe(false);
    expect(out.payload?.participant_id).toBe("p1");
  });

  it("REPRODUCES the incident when _PREVIOUS is not set", async () => {
    const old = await mint("old-key", PARTICIPANT_AUDIENCE, {
      room_id: "r1",
      participant_id: "p1",
    });
    process.env.PARTICIPANT_COOKIE_SECRET = "new-key";
    // No _PREVIOUS — this is the rotation that doubled the roster.
    const out = await verifyWithClaims(
      old,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.payload).toBeNull();
    // ...but it is now REPORTED rather than silent.
    expect(out.signatureFailed).toBe(true);
  });

  it("accepts a LEGACY claim-less token signed with SESSION_SECRET", async () => {
    // The migration case: cookies issued before iss/aud existed.
    const legacy = await mintLegacy("legacy-secret", {
      room_id: "r1",
      participant_id: "p1",
    });
    process.env.SESSION_SECRET = "legacy-secret";
    process.env.PARTICIPANT_COOKIE_SECRET = "brand-new-key";

    const out = await verifyWithClaims(
      legacy,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.signatureFailed).toBe(false);
    expect(out.payload?.participant_id).toBe("p1");
  });
});

describe("session version — revocable facilitator sessions (Task 5)", () => {
  it("is stable for unchanged inputs", () => {
    process.env.FACILITATOR_PASSWORD = "hunter2";
    expect(facilitatorSessionVersion()).toBe(facilitatorSessionVersion());
  });

  it("CHANGES when the password is rotated (rotation revokes sessions)", () => {
    process.env.FACILITATOR_PASSWORD = "old-password";
    const before = facilitatorSessionVersion();
    process.env.FACILITATOR_PASSWORD = "new-password";
    expect(facilitatorSessionVersion()).not.toBe(before);
  });

  it("changes when FACILITATOR_SESSION_VERSION is bumped manually", () => {
    process.env.FACILITATOR_PASSWORD = "same-password";
    const before = facilitatorSessionVersion();
    process.env.FACILITATOR_SESSION_VERSION = "2";
    expect(facilitatorSessionVersion()).not.toBe(before);
  });

  it("does not leak the password (fixed-length hex digest)", () => {
    process.env.FACILITATOR_PASSWORD = "a-very-distinctive-password";
    const v = facilitatorSessionVersion();
    expect(v).toMatch(/^[0-9a-f]{16}$/);
    expect(v).not.toContain("distinctive");
  });
});

describe("signature failure reporting", () => {
  it("reports absent tokens as NOT a signature failure", async () => {
    process.env.PARTICIPANT_COOKIE_SECRET = "k";
    const out = await verifyWithClaims(
      undefined,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.payload).toBeNull();
    expect(out.signatureFailed).toBe(false);
  });

  it("reports a tampered token as a signature failure", async () => {
    process.env.PARTICIPANT_COOKIE_SECRET = "k";
    const out = await verifyWithClaims(
      "not.a.jwt",
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.signatureFailed).toBe(true);
  });

  it("rejects an expired token", async () => {
    process.env.PARTICIPANT_COOKIE_SECRET = "k";
    const expired = await new SignJWT({ room_id: "r1", participant_id: "p1" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(TOKEN_ISSUER)
      .setAudience(PARTICIPANT_AUDIENCE)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(enc("k"));
    const out = await verifyWithClaims(
      expired,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.payload).toBeNull();
  });

  it("rejects an alg=none token (algorithm confusion stays shut)", async () => {
    process.env.PARTICIPANT_COOKIE_SECRET = "k";
    const header = Buffer.from(
      JSON.stringify({ alg: "none", typ: "JWT" })
    ).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({
        room_id: "r1",
        participant_id: "p1",
        aud: PARTICIPANT_AUDIENCE,
        iss: TOKEN_ISSUER,
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString("base64url");
    const out = await verifyWithClaims(
      `${header}.${body}.`,
      participantSecrets(),
      PARTICIPANT_AUDIENCE
    );
    expect(out.payload).toBeNull();
  });
});
