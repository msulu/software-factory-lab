const { test, expect } = require('@playwright/test');

test('intake receives requirements without execution and reload clears orders', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const input = page.getByRole('textbox', { name: 'Business requirement', exact: true });
  const submit = page.getByRole('button', { name: 'Submit order', exact: true });
  const receipts = page.locator('#orders > li');
  const disclosure = page.locator('#intake-disclosure');
  const disclosureText = 'Orders are received only in the current browser session in this tab. Reloading or closing this page clears them. Planning and execution have NOT started.';

  async function expectReceipt(index, id, requirement) {
    await expect(receipts.nth(index)).toBeVisible();
    await expect(receipts.nth(index).getByRole('heading')).toHaveText(`${id} · Received`);
    // textContent preserves internal whitespace, unlike normalized text assertions.
    await expect(receipts.nth(index).locator('.requirement')).toHaveJSProperty('textContent', requirement);
  }

  await test.step('initial empty state and permanent disclosure', async () => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Software Factory');
    await expect(page.getByRole('heading', { name: 'Software Factory', exact: true })).toBeVisible();
    await expect(input).toBeVisible();
    await expect(input).toBeEmpty();
    await expect(input).not.toHaveAttribute('maxlength');
    await expect(submit).toBeEnabled();
    await expect(page.locator('#status')).toHaveText('Ready to receive an order.');
    await expect(page.locator('#empty-orders')).toBeVisible();
    await expect(receipts).toHaveCount(0);
    await expect(disclosure).toBeVisible();
    await expect(disclosure).toHaveText(disclosureText);
  });

  await test.step('empty and whitespace requirements do not create orders', async () => {
    for (const invalid of ['', ' \n\t ']) {
      await input.fill(invalid);
      await submit.click();
      await expect(page.getByRole('alert')).toHaveText('Enter a business requirement.');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toBeFocused();
      await expect(input).toHaveValue(invalid);
      await expect(receipts).toHaveCount(0);
    }
  });

  const first = 'Let customers choose a delivery date.\nKeep their  preferred time.';
  await test.step('first valid requirement is trimmed and received', async () => {
    await input.fill(`  ${first} \n`);
    await submit.click();
    await expect(receipts).toHaveCount(1);
    await expectReceipt(0, 'ORD-1', first);
    await expect(input).toBeEmpty();
    await expect(input).toBeFocused();
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(page.getByRole('alert')).toBeEmpty();
    await expect(page.locator('#empty-orders')).toBeHidden();
    await expect(page.locator('#status')).toHaveText('Order ORD-1 received. Planning and execution have NOT started.');
  });

  const second = '<img src=x onerror="throw new Error(\'unsafe HTML\')">\n<b>Show this literally</b>';
  await test.step('keyboard submission preserves earlier receipts and literal multiline text', async () => {
    await input.fill(second.split('\n')[0]);
    await input.press('End');
    await input.press('Enter');
    await input.pressSequentially(second.split('\n')[1]);
    await expect(input).toHaveValue(second);
    await expect(receipts).toHaveCount(1);
    await input.press('Tab');
    await expect(submit).toBeFocused();
    await submit.press('Enter');
    await expect(receipts).toHaveCount(2);
    await expectReceipt(0, 'ORD-1', first);
    await expectReceipt(1, 'ORD-2', second);
    await expect(receipts.locator('img, b')).toHaveCount(0);
    await expect(input).toBeFocused();
    await expect(disclosure).toBeVisible();
    await expect(disclosure).toHaveText(disclosureText);
  });

  await test.step('resubmission without new text creates no order', async () => {
    await submit.click();
    await expect(page.getByRole('alert')).toHaveText('Enter a business requirement.');
    await expect(receipts).toHaveCount(2);
    await expectReceipt(0, 'ORD-1', first);
    await expectReceipt(1, 'ORD-2', second);
  });

  await test.step('long requirements have no arbitrary length limit', async () => {
    const longRequirement = 'Business outcome '.repeat(400).trim();
    await input.fill(longRequirement);
    await submit.click();
    await expect(receipts).toHaveCount(3);
    await expectReceipt(2, 'ORD-3', longRequirement);
  });

  await test.step('reload clears receipts and draft in the same browser context', async () => {
    await input.fill('An unsubmitted draft');
    await page.reload();
    await expect(receipts).toHaveCount(0);
    await expect(page.locator('#empty-orders')).toBeVisible();
    await expect(page.locator('#status')).toHaveText('Ready to receive an order.');
    await expect(page.getByRole('alert')).toBeEmpty();
    await expect(input).toBeEmpty();
    await expect(disclosure).toHaveText(disclosureText);
    await input.fill('A new session requirement');
    await submit.click();
    await expect(receipts).toHaveCount(1);
    await expectReceipt(0, 'ORD-1', 'A new session requirement');
  });

  expect(pageErrors, 'No uncaught page JavaScript errors').toEqual([]);
});
