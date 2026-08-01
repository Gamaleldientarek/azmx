/**
 * Facilitator gate — Next.js 16 proxy (the supported successor to
 * `middleware.ts`, which is deprecated in 16; proxy always runs on the
 * Node.js runtime).
 *
 * Protects /facilitator and /facilitator/[roomId] by verifying the signed
 * httpOnly session cookie. /facilitator/login stays public. Participant and
 * projection routes are untouched.
 */

import { NextResponse, type NextRequest } from "next/server";
import { BASE_PATH } from "@/lib/basePath";
import {
  FACILITATOR_COOKIE_NAME,
  verifyFacilitatorSessionToken,
} from "@/lib/facilitatorToken";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login screen must stay reachable without a session.
  if (pathname === "/facilitator/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(FACILITATOR_COOKIE_NAME)?.value;
  const valid = await verifyFacilitatorSessionToken(token);

  if (!valid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/facilitator/login";
    loginUrl.search = "";
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      // Expired/tampered cookie: clear it so the browser stops resending it.
      // Both paths — the cookie is now scoped to the basePath, but sessions
      // issued before that change live at "/" and would otherwise persist.
      response.cookies.delete({ name: FACILITATOR_COOKIE_NAME, path: BASE_PATH });
      response.cookies.delete({ name: FACILITATOR_COOKIE_NAME, path: "/" });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Only facilitator routes pass through the gate.
  matcher: ["/facilitator", "/facilitator/:path*"],
};
