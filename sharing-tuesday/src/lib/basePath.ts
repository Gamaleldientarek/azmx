/**
 * The app's mount point. MUST match `basePath` in `next.config.ts`.
 *
 * Single source of truth because three separate concerns depend on it:
 *  - absolute URL construction (`baseUrl.ts`),
 *  - the facilitator session cookie's `path` (`facilitatorSession.ts`),
 *  - the per-room seat cookie's `path` (`participantCookie.ts`).
 *
 * Cookie scoping is the reason this is not just cosmetic. The Cloudflare
 * Worker states the intent directly ("future games can mount other paths"):
 * with `path: "/"`, the day a second game mounts on this host, every request
 * to it would carry the facilitator session JWT and every per-room seat JWT.
 * Scoping to the basePath keeps those cookies with the app that issued them.
 *
 * Note: `__Host-` cookie prefixes are deliberately NOT used — that prefix
 * requires `path=/` and is mutually exclusive with this scoping.
 *
 * Kept free of `server-only` so `facilitatorToken.ts` (shared with
 * `src/proxy.ts`) can import it without pulling in a server-only boundary.
 */
export const BASE_PATH = "/random-selector";
