const { test, expect } = require('@playwright/test');

test('factory activations increment exactly and reload resets state', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const button = page.getByRole('button', { name: 'Run Factory', exact: true });
  const status = page.locator('#status');
  const counter = page.locator('#order-count');

  async function expectState(message, count) {
    await expect(status).toBeVisible();
    await expect(status).toHaveText(message);
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText(`Orders processed: ${count}`);
    expect(pageErrors, 'No uncaught page JavaScript errors').toEqual([]);
  }

  await test.step('expected initial state', async () => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Software Factory');
    await expect(page.getByRole('heading', { name: 'Software Factory', exact: true })).toBeVisible();
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await expectState('Factory is running', 0);
  });

  await test.step('first activation', async () => {
    await button.click();
    await expectState('Order received!', 1);
  });

  await test.step('repeated activation increments exactly once', async () => {
    await button.click();
    await expectState('Order received!', 2);
  });

  await test.step('keyboard activation', async () => {
    await button.focus();
    await expect(button).toBeFocused();
    await page.keyboard.press('Enter');
    await expectState('Order received!', 3);
  });

  await test.step('reload resets state in the same browser context', async () => {
    await page.reload();
    await expectState('Factory is running', 0);
  });

  await test.step('activation works again after reload', async () => {
    await button.click();
    await expectState('Order received!', 1);
  });
});
