# Test info

- Name: shows error for invalid image
- Location: C:\Users\OrEo2\Desktop\DevOps\1. Projects\docker-buster\frontend\tests\example.spec.ts:47:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at C:\Users\OrEo2\Desktop\DevOps\1. Projects\docker-buster\frontend\tests\example.spec.ts:48:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('main page loads and shows Docker Buster UI', async ({ page }) => {
   4 |   await page.goto('http://localhost:3000');
   5 |   await expect(page).toHaveTitle(/Docker Buster/i);
   6 |   await expect(page.getByText('DOCKER BUSTER')).toBeVisible();
   7 |   await expect(page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first()).toBeVisible();
   8 | });
   9 |
  10 | test('submits a scan and shows progress', async ({ page }) => {
  11 |   await page.goto('http://localhost:3000');
  12 |   await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  13 |   await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  14 |   await expect(page.getByText(/Analyzing Container|Scanning for vulnerabilities|Generating report/i)).toBeVisible({ timeout: 15000 });
  15 | });
  16 |
  17 | test('shows report data after scan', async ({ page }) => {
  18 |   await page.goto('http://localhost:3000');
  19 |   await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  20 |   await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  21 |   // Wait for the Executive Summary tab and Security Risk Assessment heading
  22 |   await expect(page.getByRole('tab', { name: /Executive Summary/i })).toBeVisible({ timeout: 20000 });
  23 |   await expect(page.getByRole('heading', { name: /Security Risk Assessment/i })).toBeVisible({ timeout: 20000 });
  24 | });
  25 |
  26 | test('downloads PDF and JSON reports', async ({ page }) => {
  27 |   await page.goto('http://localhost:3000');
  28 |   await page.getByRole('textbox', { name: /docker image name/i }).fill('alpine:latest');
  29 |   await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  30 |   // Wait for the Executive Summary tab and Security Risk Assessment heading
  31 |   await expect(page.getByRole('tab', { name: /Executive Summary/i })).toBeVisible({ timeout: 20000 });
  32 |   await expect(page.getByRole('heading', { name: /Security Risk Assessment/i })).toBeVisible({ timeout: 20000 });
  33 |   // Attempt to download PDF
  34 |   const [pdfDownload] = await Promise.all([
  35 |     page.waitForEvent('download'),
  36 |     page.getByRole('button', { name: /Download PDF/i }).click()
  37 |   ]);
  38 |   expect(pdfDownload.suggestedFilename()).toMatch(/docker-buster-report/i);
  39 |   // Attempt to download JSON
  40 |   const [jsonDownload] = await Promise.all([
  41 |     page.waitForEvent('download'),
  42 |     page.getByRole('button', { name: /Download JSON/i }).click()
  43 |   ]);
  44 |   expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/i);
  45 | });
  46 |
  47 | test('shows error for invalid image', async ({ page }) => {
> 48 |   await page.goto('http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  49 |   await page.getByRole('textbox', { name: /docker image name/i }).fill('nonexistent-image:latest');
  50 |   await page.getByRole('button', { name: /Bust Container|Run Demo Scan/i }).first().click();
  51 |   // Wait for a unique error heading
  52 |   await expect(page.getByRole('heading', { name: /scan failed/i })).toBeVisible({ timeout: 15000 });
  53 | });
  54 |
```