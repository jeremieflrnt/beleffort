import { test, expect } from '@playwright/test';

test.describe('Tests', () => {
  test('First test', async ({ page }) => {
    await page.goto('/');
    console.log('[test] Cookies', await page.context().cookies());
    console.log('[test] Storage', await page.context().storageState());
    await expect(
      page.getByText(
        'Track Your Gains, Set New PRs! Record and Save Your Best Performances for Multiple Weightlifting Movements with Ease.',
      ),
    ).toBeVisible();
    await expect(page.getByAltText('avatar')).toHaveAttribute('src', 'https://playwright.dev/img/playwright-logo.svg');
  });
});
