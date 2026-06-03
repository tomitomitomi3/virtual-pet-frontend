import { test, expect } from '@playwright/test';

test('debe cargar la página principal', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Virtual Pet — Tienda para mascotas/i);
});
