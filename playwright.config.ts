import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

loadEnvConfig(process.cwd());

const port = Number(process.env.PLAYWRIGHT_PORT ?? "3100");
const lifecycleEvent = process.env.npm_lifecycle_event ?? "playwright";
const artifactSuffix = lifecycleEvent.replace(/[^a-z0-9_-]+/gi, "-").replace(/-+/g, "-");
const outputDir = path.join("test-results", "playwright", artifactSuffix);
const reportDir = path.join("playwright-report", artifactSuffix);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: reportDir }],
  ],
  outputDir,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --hostname 127.0.0.1 --port ${port}`,
    port,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
