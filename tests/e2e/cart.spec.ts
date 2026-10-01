import { expect, test } from "@playwright/test";
import { cartLink, seedCart } from "./helpers";

test("adding products updates the badge and survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(cartLink(page)).toHaveText("۰");

  await page.getByRole("button", { name: "افزودن دریل برقی صنعتی به سبد خرید" }).click();
  await page.getByRole("button", { name: /دریل برقی صنعتی/ }).click();
  await page.getByRole("button", { name: "افزودن مینی فرز حرفه‌ای به سبد خرید" }).click();
  await expect(cartLink(page)).toHaveText("۳");

  await page.reload();
  await expect(cartLink(page)).toHaveText("۳");
});

test("out-of-stock products cannot be added", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /مجموعه ابزار دستی ناموجود/ })).toBeDisabled();
});

test("cart page changes quantities, removes items and updates totals", async ({ page }) => {
  await seedCart(page, [
    { productId: "electric-drill-01", quantity: 1 },
    { productId: "safety-helmet-01", quantity: 1 },
  ]);
  const total = page.getByRole("complementary").locator("dd").last();
  // 3,850,000 + 480,000, free shipping
  await expect(total).toHaveText("۴٬۳۳۰٬۰۰۰ تومان");

  await page.getByRole("button", { name: "افزایش تعداد کلاه ایمنی صنعتی" }).click();
  await expect(page.getByLabel("تعداد کلاه ایمنی صنعتی", { exact: true })).toHaveText("۲");
  await expect(total).toHaveText("۴٬۸۱۰٬۰۰۰ تومان");

  await page.getByRole("button", { name: "حذف دریل برقی صنعتی از سبد خرید" }).click();
  // 960,000 + 150,000 shipping
  await expect(total).toHaveText("۱٬۱۱۰٬۰۰۰ تومان");
  await expect(cartLink(page)).toHaveText("۲");

  await page.getByRole("button", { name: "کاهش تعداد کلاه ایمنی صنعتی" }).click();
  await page.getByRole("button", { name: "کاهش تعداد کلاه ایمنی صنعتی" }).click();
  await expect(page.getByText("سبد خرید شما خالی است")).toBeVisible();
});

test("cart stays in sync across tabs", async ({ page, context }) => {
  await seedCart(page, [{ productId: "angle-grinder-01", quantity: 1 }]);

  const otherTab = await context.newPage();
  await otherTab.goto("/cart");
  await otherTab.getByRole("button", { name: "حذف مینی فرز حرفه‌ای از سبد خرید" }).click();

  await expect(page.getByText("سبد خرید شما خالی است")).toBeVisible();
});

test("a corrupted saved cart falls back to empty", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("parskala-cart", "{not json"));
  await page.goto("/cart");
  await expect(page.getByText("سبد خرید شما خالی است")).toBeVisible();
});
