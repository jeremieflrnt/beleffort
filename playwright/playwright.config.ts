import { ReporterDescription, defineConfig, devices } from '@playwright/test';
import fs from 'fs';

export const PW_AUTH_FILE = '.auth/user.json';

const getBaseUrl = (): string => {
  return process.env.ENVIRONMENT === 'production' ? 'https://beleffort.app' : 'http://localhost:3000';
};

const getReportersList = (): ReporterDescription[] => {
  const reportFolderPathName = process.env.REPORTNAME ? `out/${process.env.REPORTNAME}` : 'out/report';
  if (process.env.CI)
    return [
      ['html', { outputFolder: reportFolderPathName, open: 'never' }],
      ['junit', { outputFile: `${reportFolderPathName}/report.xml` }],
      ['json', { outputFile: `${reportFolderPathName}/report.json` }],
    ];
  else return [['line'], ['html', { outputFolder: reportFolderPathName, open: 'never' }]];
};

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: getReportersList(),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  expect: {
    timeout: 20_000,
  },
  maxFailures: 20,

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chrome', // https://yesviz.com/devices/macbookpro-16-2019/
      use: {
        ...devices['Desktop Chrome'],
        // screen: { width: 3072, height: 1920 },
        viewport: { width: 1536, height: 960 },
        deviceScaleFactor: 2,
        storageState: PW_AUTH_FILE,
      },
      dependencies: !fs.existsSync(PW_AUTH_FILE) ? ['setup'] : [],
    },
    {
      name: 'chrome small screen',
      use: {
        ...devices['Desktop Chrome'],
        storageState: PW_AUTH_FILE,
        // viewport default for device 'Desktop x': 1280x720. See https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json
      },
      dependencies: !fs.existsSync(PW_AUTH_FILE) ? ['setup'] : [],
    },
    {
      name: 'firefox', // https://yesviz.com/devices/macbookpro-16-2019/
      use: {
        ...devices['Desktop Firefox'],
        // screen: { width: 3072, height: 1920 },
        viewport: { width: 1536, height: 960 },
        deviceScaleFactor: 2,
        storageState: PW_AUTH_FILE,
      },
      dependencies: !fs.existsSync(PW_AUTH_FILE) ? ['setup'] : [],
    },
    {
      name: 'safari', // https://yesviz.com/devices/macbookpro-16-2019/
      use: {
        ...devices['Desktop Safari'],
        // screen: { width: 3072, height: 1920 },
        viewport: { width: 1536, height: 960 },
        deviceScaleFactor: 2,
        storageState: PW_AUTH_FILE,
      },
      // dependencies: !fs.existsSync(PW_AUTH_FILE) ? ['setup'] : [],
    },
    {
      name: 'iPhone 13 Pro',
      use: {
        ...devices['iPhone 13 Pro'],
        storageState: PW_AUTH_FILE,
      },
      dependencies: !fs.existsSync(PW_AUTH_FILE) ? ['setup'] : [],
    },
  ],
});
