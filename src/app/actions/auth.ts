"use server";

import { redirect } from "next/navigation";
import {
  createFacilitatorSession,
  destroyFacilitatorSession,
  verifyFacilitatorPassword,
} from "@/lib/facilitatorSession";
import type { LoginResult } from "@/lib/types";

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
    return {
      ok: false,
      error: "invalid_password",
      message: "That password is not correct.",
    };
  }

  await createFacilitatorSession();
  redirect("/facilitator");
}

/** Clear the facilitator session and return to the login screen. */
export async function logoutFacilitator(): Promise<void> {
  await destroyFacilitatorSession();
  redirect("/facilitator/login");
}
