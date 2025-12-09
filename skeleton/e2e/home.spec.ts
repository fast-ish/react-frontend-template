{%- if values.e2eTesting == "playwright" %}
import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/${{values.name}}/);
  });

  test('should have correct heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('/');
    // Basic accessibility check - no duplicate IDs
    const ids = await page.evaluate(() => {
      const elements = document.querySelectorAll('[id]');
      const idList = Array.from(elements).map((el) => el.id);
      return idList.filter((id, index) => idList.indexOf(id) !== index);
    });
    expect(ids).toHaveLength(0);
  });
});

test.describe('Health Check', () => {
  test('should return healthy status', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('healthy');
  });
});
{%- else %}
// Playwright not enabled
export {};
{%- endif %}
