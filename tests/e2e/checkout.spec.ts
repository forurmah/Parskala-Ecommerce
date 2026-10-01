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

async function fillValidForm(page: import("@playwright/test").Page) {
  await page.getByLabel("نام و نام خانوادگی").fill("سارا محمدی");
  await page.getByLabel("شماره موبایل").fill("۰۹۱۲ ۳۴۵ ۶۷۸۹"); // Persian digits
  await page.getByLabel("شهر").fill("اصفهان");
  await page.getByLabel("کد پستی").fill("۸۱۳۶۷۴۵۶۹۱");
  await page.getByLabel("نشانی کامل").fill("خیابان چهارباغ، کوچه ۱۲، پلاک ۵");
}

test("a valid order is saved, confirmed and the cart is emptied", async ({ page }) => {
  await seedCart(page, [{ productId: "safety-helmet-01", quantity: 2 }], "/cart");
  await page.getByRole("link", { name: "ادامه فرایند خرید" }).click();
  await expect(page).toHaveURL("/checkout");

  await fillValidForm(page);
  await page.getByRole("button", { name: "ثبت سفارش" }).click();

  await expect(page).toHaveURL(/\/orders\/[0-9a-f-]{36}$/);
  await expect(page.getByRole("heading", { name: "سفارش شما ثبت شد" })).toBeVisible();
  await expect(page.getByText("کلاه ایمنی صنعتی × ۲")).toBeVisible();
  // 2 × 480,000 + 150,000 shipping
  await expect(page.getByText("۱٬۱۱۰٬۰۰۰ تومان")).toBeVisible();
  await expect(cartLink(page)).toHaveText("۰");

  // The order comes from the database, so it survives a reload.
  await page.reload();
  await expect(page.getByText("سارا محمدی")).toBeVisible();
});

test("the server rejects a tampered cart", async ({ page }) => {
  // The UI caps quantities at 10; skip it by editing storage directly.
  await seedCart(page, [{ productId: "safety-helmet-01", quantity: 99 }], "/checkout");
  await fillValidForm(page);
  await page.getByRole("button", { name: "ثبت سفارش" }).click();

  await expect(page.getByRole("main").getByRole("alert")).toHaveText("سبد خرید نامعتبر است.");
  await expect(page).toHaveURL("/checkout");
});

test("unknown orders return 404", async ({ page }) => {
  const missing = await page.goto("/orders/00000000-0000-4000-8000-000000000000");
  expect(missing?.status()).toBe(404);
  const malformed = await page.goto("/orders/not-an-id");
  expect(malformed?.status()).toBe(404);
});

test("out-of-stock items block checkout", async ({ page }) => {
  await seedCart(page, [{ productId: "tool-set-01", quantity: 1 }]);
  await expect(page.getByRole("link", { name: "ادامه فرایند خرید" })).toHaveCount(0);

  await page.goto("/checkout");
  await expect(page.getByRole("button", { name: "ثبت سفارش" })).toBeDisabled();
});
