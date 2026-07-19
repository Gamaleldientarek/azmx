import "server-only";

/**
 * Lazy server-side env access.
 *
 * Values are read at CALL time, never at module top level, so the app builds
 * with no live Supabase project / no `.env` present. Missing values only throw
 * when a code path actually needs them at runtime.
 */

export type ServerEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_JWT_SECRET"
  | "FACILITATOR_PASSWORD"
  | "SESSION_SECRET";

export function requireEnv(key: ServerEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `See .env.example for the full list.`
    );
  }
  return value;
}

/** Optional base URL for absolute links (falls back to request headers). */
export function appUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_URL || undefined;
}
