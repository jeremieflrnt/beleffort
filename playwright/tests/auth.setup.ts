import { test as setup } from '@playwright/test';
import { PW_AUTH_FILE } from '../playwright.config';

setup('authenticate', async ({ page }) => {
  const nameCookie =
    process.env.ENVIRONMENT === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
  const domain = process.env.ENVIRONMENT === 'production' ? 'beleffort.app' : 'localhost';
  // Addding the cookie for a specific user for e2e tests
  await page
    .context()
    .addCookies([
      { name: nameCookie, value: '8a1ea62a-6b76-11ee-b962-0242ac120002', domain: domain, path: '/', secure: true },
    ]);
  console.log('Cookies', await page.context().cookies());
  console.log('Storage', await page.context().storageState());
  await page.context().storageState({ path: PW_AUTH_FILE });
});
