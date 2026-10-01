import type { Page } from "@playwright/test";

// The header has separate mobile and desktop cart links; use the visible one.
export function cartLink(page: Page) {
  return page.locator('header a[href="/cart"]:visible');
}

// Put items straight into the saved cart, then load `path`.
export async function seedCart(
  page: Page,
  lines: { productId: string; quantity: number }[],
  path = "/cart",
) {
  await page.goto("/");
  await page.evaluate(
    (value) => localStorage.setItem("parskala-cart", value),
    JSON.stringify(lines),
  );
  await page.goto(path);
}

// A unique email per call, since tests run in parallel against one database.
export function uniqueEmail() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.dev`;
}

export const TEST_PASSWORD = "parskala-123";

// Sign up through the real form; ends on the page `next` points to.
export async function signUp(page: Page, name = "سارا محمدی", next?: string) {
  const email = uniqueEmail();
  await page.goto(next ? `/signup?next=${encodeURIComponent(next)}` : "/signup");
  await page.getByLabel("نام").fill(name);
  await page.getByLabel("ایمیل").fill(email);
  await page.getByLabel("رمز عبور").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "ثبت‌نام" }).click();
  return email;
}

export function accountLink(page: Page) {
  return page.locator('header a[href="/account"]:visible, header a[href="/login"]:visible');
}
