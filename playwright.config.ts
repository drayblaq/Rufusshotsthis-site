import { defineConfig } from "@playwright/test";

/**
 * Responsive audit (tests/responsive.spec.ts). Run with: npm run test:responsive
 * Uses the Chrome installed on the machine (channel "chrome"), so no browser download.
 * Runs against the production build on port 3100.
 */
export default defineConfig({
  testDir: "tests",
  outputDir: "test-results",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3100", channel: "chrome", headless: true },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
