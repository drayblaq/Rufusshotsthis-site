import { defineConfig } from "@playwright/test";

/**
 * Responsive audit (tests/responsive.spec.ts). Run with: npm run test:responsive
 * Uses the Chrome installed on the machine (channel "chrome"), so no browser download.
 * Runs against the production build on port 3100, or BASE_URL if set.
 */
export default defineConfig({
  testDir: "tests",
  outputDir: "test-results",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3100",
    channel: "chrome",
    headless: true,
  },
  // Local build by default; set BASE_URL to audit a deployed site instead, e.g.
  // BASE_URL=https://rufusshotthis.vercel.app npx playwright test
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start -- -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
