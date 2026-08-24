import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174/docs/',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && ./node_modules/.bin/vitepress preview docs --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174/docs/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
