import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: process.env.BASE_URL ? undefined : {command:"node scripts/static-server.mjs dist 5191",url:"http://127.0.0.1:5191",reuseExistingServer:!process.env.CI},
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:5191",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
});
