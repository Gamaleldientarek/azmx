import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for both suites:
 *
 *   npm test           -> tests/unit  (pure, no network, fast)
 *   npm run test:live  -> tests/live  (live Supabase + built Next app)
 *
 * The suite is selected by the include pattern passed on the CLI (see
 * package.json scripts); this config only supplies shared plumbing.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Mirror tsconfig "@/*": ["./src/*"] so tests can import app code.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws when imported outside a React Server Component.
      // Tests run in plain Node, which is exactly as "server" as it gets, so
      // stub it out for anything that transitively pulls it in.
      "server-only": fileURLToPath(
        new URL("./tests/helpers/server-only-stub.ts", import.meta.url)
      ),
    },
  },
  test: {
    environment: "node",
    // Live tests are stateful against a shared DB + one spawned server:
    // run files sequentially. Unit tests are so fast this costs nothing.
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 300_000,
  },
});
