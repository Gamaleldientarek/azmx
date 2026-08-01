/**
 * games.gamaleldien.com — thin reverse proxy to the Vercel origin.
 *
 * Why a Worker: the Cloudflare credential in use (wrangler OAuth) can deploy
 * Workers with custom domains (which auto-provision DNS) but cannot edit DNS
 * records directly. The Worker forwards everything to Vercel and rewrites the
 * Host header so Vercel serves the app.
 *
 * Routing contract:
 *   /                    → 307 to /random-selector (the app's basePath)
 *   /random-selector/**  → proxied to the Vercel origin as-is
 *   everything else      → proxied as-is (future games can mount other paths)
 *
 * Supabase Realtime is NOT proxied — phones talk to *.supabase.co directly.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Landing convenience: bare domain → the game.
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect(`${url.origin}/random-selector`, 307);
    }

    const origin = env.ORIGIN_HOST;
    const upstream = new URL(url.pathname + url.search, `https://${origin}`);

    const headers = new Headers(request.headers);
    headers.set("Host", origin);
    // Preserve the public host so the app derives correct absolute URLs (QR/join links).
    headers.set("X-Forwarded-Host", url.hostname);
    headers.set("X-Forwarded-Proto", "https");

    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    // Rewrite redirects the origin issues: absolute ones back to the public
    // host, and no-JS server-action redirects that miss the basePath (Next
    // quirk: MPA 303s return e.g. "/facilitator" without "/random-selector").
    const location = response.headers.get("Location");
    if (location) {
      let fixed = location.replaceAll(origin, url.hostname);
      if (fixed.startsWith("/") && !fixed.startsWith("/random-selector")) {
        fixed = `/random-selector${fixed}`;
      }
      if (fixed !== location) {
        const headers2 = new Headers(response.headers);
        headers2.set("Location", fixed);
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers2,
        });
      }
    }

    return response;
  },
};
