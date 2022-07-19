import { test, expect, Page } from '@playwright/test';

const baseURL = "http://localhost:3000"

test('base URL',async ({ page }) => {
  await page.goto(baseURL);
});

// test.describe('base URL test suite', () => {
//   console.log("base URL loaded with no exceptions")
// });
