import { expect, test } from "@playwright/test";

test.describe("Auth guard", () => {
  test("guest diarahkan ke signin saat membuka dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/signin$/);
    await expect(
      page.getByRole("heading", { name: "Login operator" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk ke MorrusPOS" })).toBeVisible();
  });
});
