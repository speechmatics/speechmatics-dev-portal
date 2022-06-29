import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test.describe('New Test Suite', () => {
  test('If the pages open with no errors', async ({ page }) => {
    //
  });
});
