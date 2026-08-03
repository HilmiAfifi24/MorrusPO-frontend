import { expect, test } from "@playwright/test";
import {
  mockCategories,
  mockOutlets,
  mockProducts,
  ownerSession,
  seedAuthSession,
} from "./fixtures/morrus";

test.describe("Owner products flow", () => {
  test("owner harus memilih outlet sebelum listing produk dimuat", async ({ page }) => {
    await seedAuthSession(page, ownerSession);
    await mockOutlets(page);
    await mockCategories(page);
    await mockProducts(page);

    await page.goto("/products");

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByText("Pilih outlet terlebih dahulu")).toBeVisible();

    await page.selectOption("select", {
      label: "Outlet Utama",
    });

    await expect(page.getByText("Nasi Goreng")).toBeVisible();
    await expect(page.getByText("SKU-001")).toBeVisible();
    await expect(page.getByText("porsi")).toBeVisible();
  });
});
