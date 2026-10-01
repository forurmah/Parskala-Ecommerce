import { expect, test } from "@playwright/test";
import { cartLink, seedCart } from "./helpers";

test("checkout with an empty cart points back to the shop", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.getByText("سبد خرید شما خالی است")).toBeVisible();
});

test("an empty form shows every error and focuses the first field", async ({ page }) => {
  await seedCart(page, [{ productId: "safety-helmet-01", quantity: 1 }], "/checkout");
  await page.getByRole("button", { name: "ثبت سفارش" }).click();

  await expect(page.locator("[aria-invalid=true]")).toHaveCount(5);
  await expect(page.getByLabel("نام و نام خانوادگی")).toBeFocused();

  // Editing a field clears its error.
  await page.getByLabel("نام و نام خانوادگی").fill("سارا محمدی");
  await expect(page.locator("[aria-invalid=true]")).toHaveCount(4);
});

test("a valid order is confirmed and the cart is emptied", async ({ page }) => {
  await seedCart(page, [{ productId: "safety-helmet-01", quantity: 1 }], "/cart");
  await page.getByRole("link", { name: "ادامه فرایند خرید" }).click();
  await expect(page).toHaveURL("/checkout");

  await page.getByLabel("نام و نام خانوادگی").fill("سارا محمدی");
  await page.getByLabel("شماره موبایل").fill("۰۹۱۲ ۳۴۵ ۶۷۸۹"); // Persian digits
  await page.getByLabel("شهر").fill("اصفهان");
  await page.getByLabel("کد پستی").fill("۸۱۳۶۷۴۵۶۹۱");
  await page.getByLabel("نشانی کامل").fill("خیابان چهارباغ، کوچه ۱۲، پلاک ۵");
  await page.getByRole("button", { name: "ثبت سفارش" }).click();

  await expect(page.getByRole("heading", { name: "سفارش شما ثبت شد" })).toBeVisible();
  // 480,000 + 150,000 shipping
  await expect(page.getByText("۶۳۰٬۰۰۰ تومان")).toBeVisible();
  await expect(cartLink(page)).toHaveText("۰");
});

test("out-of-stock items block checkout", async ({ page }) => {
  await seedCart(page, [{ productId: "tool-set-01", quantity: 1 }]);
  await expect(page.getByRole("link", { name: "ادامه فرایند خرید" })).toHaveCount(0);

  await page.goto("/checkout");
  await expect(page.getByRole("button", { name: "ثبت سفارش" })).toBeDisabled();
});
