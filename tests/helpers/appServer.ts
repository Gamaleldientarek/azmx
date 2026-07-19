/**
 * Spawn the BUILT Next.js app (`next start`) for integration tests and stop
 * it afterwards. Requires `next build` to have run first — the `test:live`
 * runner script takes care of that.
 *
 * The app serves under basePath /random-selector (next.config.ts), so
 * `baseUrl` already includes it.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { PROJECT_ROOT } from "./liveEnv";

export interface RunningApp {
  baseUrl: string; // http://127.0.0.1:<port>/random-selector
  stop: () => Promise<void>;
}

const BASE_PATH = "/random-selector";

export async function startApp(port: number): Promise<RunningApp> {
  const child: ChildProcess = spawn(
    process.execPath,
    [join(PROJECT_ROOT, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)],
    {
      cwd: PROJECT_ROOT,
      env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let output = "";
  child.stdout?.on("data", (d) => (output += d));
  child.stderr?.on("data", (d) => (output += d));

  const baseUrl = `http://127.0.0.1:${port}${BASE_PATH}`;

  // Poll readiness (the login page is a cheap static route).
  const deadline = Date.now() + 60_000;
  for (;;) {
    if (child.exitCode !== null) {
      throw new Error(
        `next start exited early (code ${child.exitCode}):\n${output}`
      );
    }
    try {
      const res = await fetch(`${baseUrl}/facilitator/login`, {
        redirect: "manual",
      });
      if (res.status === 200) break;
    } catch {
      // not up yet
    }
    if (Date.now() > deadline) {
      throw new Error(`next start not ready within 60s:\n${output}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  return {
    baseUrl,
    stop: () =>
      new Promise<void>((resolve) => {
        if (child.exitCode !== null) return resolve();
        child.once("exit", () => resolve());
        child.kill("SIGTERM");
        setTimeout(() => {
          if (child.exitCode === null) child.kill("SIGKILL");
        }, 3000).unref();
      }),
  };
}
