import { test, expect } from '@playwright/test';

test('main page loads and shows Docker Buster UI', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Docker Buster/i);
  await expect(page.getByText('DOCKER BUSTER')).toBeVisible();
  await expect(page.getByRole('button', { name: /Bust Container|Run Demo Scan/i })).toBeVisible();
}); 