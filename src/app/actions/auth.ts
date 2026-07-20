"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createFacilitatorSession,
  destroyFacilitatorSession,
  verifyFacilitatorPassword,
} from "@/lib/facilitatorSession";
import {
  checkLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/loginRateLimit";
import type { LoginResult } from "@/lib/types";

/**
 * Client IP for rate-limiting. `cf-connecting-ip` is set by Cloudflare and
 * cannot be spoofed by the client; the `x-forwarded-for` fallbacks can be, so
 * they are a last resort for non-Cloudflare paths (e.g. the Vercel origin hit
 * directly). A spoofed key only ever splits an attacker's OWN bucket — it can
 * never lock out a third party, because the key is not attacker-chosen for
 * anyone else.
 */
async function clientKey(): Promise<string> {
  const h = await headers();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

function waitMessage(seconds: number): string {
  if (seconds < 60) {
    return `Too many attempts. Try again in ${seconds} seconds.`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `Too many attempts. Try again in ${minutes} minute${
    minutes === 1 ? "" : "s"
  }.`;
}

/**
 * Facilitator login. `useActionState`-compatible:
 *
 *   const [state, formAction] = useActionState(loginFacilitator, undefined);
 *   <form action={formAction}> <input name="password" type="password" /> ...
 *
 * Verifies the shared password server-side against `FACILITATOR_PASSWORD`
 * (constant-time), sets the signed httpOnly session cookie, then redirects
 * to /facilitator. On bad password it returns a typed error for the form.
 */
export async function loginFacilitator(
  _prevState: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  const password = formData.get("password");

  // Rate-limit BEFORE touching the password, so a locked-out caller cannot
  // keep exercising the comparison.
  const key = await clientKey();
  const gate = checkLoginAllowed(key);
  if (!gate.allowed) {
    return {
      ok: false,
      error: "rate_limited",
      message: waitMessage(gate.retryAfterSeconds),
    };
  }

  if (typeof password !== "string" || password.length === 0) {
    return {
      ok: false,
      error: "invalid_password",
      message: "Please enter the facilitator password.",
    };
  }

  let valid = false;
  try {
    valid = verifyFacilitatorPassword(password);
  } catch (err) {
    console.error("loginFacilitator failed:", err);
    return {
      ok: false,
      error: "server_error",
      message: "Login is not available right now. Please try again.",
    };
  }

  if (!valid) {
    const limited = recordLoginFailure(key);
    if (!limited.allowed) {
      return {
        ok: false,
        error: "rate_limited",
        message: waitMessage(limited.retryAfterSeconds),
      };
    }
    return {
      ok: false,
      error: "invalid_password",
      message: "That password is not correct.",
    };
  }

  clearLoginFailures(key);
  await createFacilitatorSession();
  // redirect() throws a control-flow signal — it MUST stay outside try/catch.
  redirect("/facilitator");
}

/** Clear the facilitator session and return to the login screen. */
export async function logoutFacilitator(): Promise<void> {
  await destroyFacilitatorSession();
  redirect("/facilitator/login");
}
