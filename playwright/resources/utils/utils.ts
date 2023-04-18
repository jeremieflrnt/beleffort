import { Page, TestInfo } from '@playwright/test';

export async function captureScreen(page: Page, testInfo: TestInfo): Promise<void> {
  const pathScreenshot = 'out/screenshots/' + testInfo.title.split('/').join('_') + '-' + new Date().valueOf() + '.png';
  await page.screenshot({ path: pathScreenshot, fullPage: true });
  testInfo.attachments.push({
    name: 'screenshot',
    path: pathScreenshot,
    contentType: 'image/png',
  });
}
