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
