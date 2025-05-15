import { test, expect } from '@playwright/test';

test('main page loads and shows Docker Buster UI', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Docker Buster/i);
  await expect(page.getByText('DOCKER BUSTER')).toBeVisible();
  await expect(page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first()).toBeVisible();
});

test('submits a scan and shows progress', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  await expect(page.getByText(/Analyzing Container|Scanning for vulnerabilities|Generating report/i)).toBeVisible({ timeout: 15000 });
});

test('shows report data after scan', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  // Wait for the Executive Summary tab and Security Risk Assessment heading
  await expect(page.getByRole('tab', { name: /Executive Summary/i })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('heading', { name: /Security Risk Assessment/i })).toBeVisible({ timeout: 20000 });
});

test('downloads PDF and JSON reports', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  // Wait for the Executive Summary tab and Security Risk Assessment heading
  await expect(page.getByRole('tab', { name: /Executive Summary/i })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('heading', { name: /Security Risk Assessment/i })).toBeVisible({ timeout: 20000 });
  // Attempt to download PDF
  const [pdfDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download PDF/i }).click()
  ]);
  expect(pdfDownload.suggestedFilename()).toMatch(/docker-buster-report/i);
  // Attempt to download JSON
  const [jsonDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Download JSON/i }).click()
  ]);
  expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/i);
});

test('shows error for invalid image', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: /docker image name/i }).fill('nonexistent-image:latest');
  await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  // Wait for a unique error heading
  await expect(page.getByRole('heading', { name: /scan failed/i })).toBeVisible({ timeout: 15000 });
});
