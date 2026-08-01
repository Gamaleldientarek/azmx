import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Motivation is clickjacking, not XSS: /facilitator/[roomId] renders one-click
 * destructive controls — "Run selector", "Close room" (purges every real
 * name), and deleteRoom (hard delete, FK cascade). SameSite=Lax does NOT
 * prevent framing, and the room UUID an attacker needs is visible on any
 * projection URL. A transparent iframe over a decoy gets a logged-in
 * facilitator to click through a deletion or a mid-session purge.
 *
 * Directive notes:
 *  - style-src 'unsafe-inline': Tailwind 4 and Next both emit inline styles.
 *  - img-src data:: the join QR is rendered as a data: URL (`lib/qr.ts`).
 *  - connect-src *.supabase.co + wss://*.supabase.co: phones talk to Supabase
 *    DIRECTLY for PostgREST reads and Realtime — the Worker does not proxy
 *    them. Get this wrong and Realtime dies silently, which presents as "the
 *    room just stopped updating", not as an error.
 *  - frame-ancestors 'none' + X-Frame-Options: DENY: the actual fix.
 */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

/**
 * REPORT-ONLY for now — deliberate, do not flip without checking.
 *
 * Enforcing this policy as written WILL break the app: it has no `script-src`,
 * so `default-src 'self'` applies to scripts, and the Next App Router serves
 * its hydration payload through INLINE <script> tags (`self.__next_f.push`).
 * Those are blocked by 'self' alone, and the result is a page that renders and
 * then never becomes interactive.
 *
 * Report-only first therefore does two jobs: it confirms the Supabase
 * connect-src is right (Realtime keeps working), and it surfaces the inline
 * script violations so the fix is chosen with evidence rather than guessed.
 *
 * To enforce later, do BOTH:
 *   1. Add a script-src that permits Next's inline bootstrap. Either
 *      `script-src 'self' 'unsafe-inline'` (simple, weaker), or a per-request
 *      nonce injected via `src/proxy.ts` with `'strict-dynamic'` (correct,
 *      more moving parts — note the proxy matcher currently covers only
 *      /facilitator and would have to widen to every route).
 *   2. Flip CSP_HEADER to "Content-Security-Policy".
 *
 * The clickjacking protection does NOT wait for that: X-Frame-Options: DENY
 * below is enforced immediately and closes the framing attack on its own.
 */
const CSP_ENFORCED = false;
const CSP_HEADER = CSP_ENFORCED
  ? "Content-Security-Policy"
  : "Content-Security-Policy-Report-Only";

const nextConfig: NextConfig = {
  // Public URL contract: games.gamaleldien.com/random-selector
  // The Cloudflare Worker redirects the bare domain into this basePath.
  basePath: "/random-selector",

  // Don't advertise the framework version.
  poweredByHeader: false,

  experimental: {
    serverActions: {
      // The app is served through the Cloudflare Worker proxy: browsers POST
      // with Origin=games.gamaleldien.com while Vercel sees its own host.
      // Without this, Next's CSRF check aborts every server action ("Invalid
      // Server Actions request").
      allowedOrigins: ["games.gamaleldien.com"],
    },
  },

  async headers() {
    return [
      {
        // Sources are basePath-relative, so this covers every app route.
        source: "/:path*",
        headers: [
          { key: CSP_HEADER, value: CSP },
          {
            // Two years, and eligible for the preload list. The host is
            // HTTPS-only through the Cloudflare Worker.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Enforced now — this is the clickjacking fix, and unlike the CSP
          // it cannot break anything: the app is never legitimately framed.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
