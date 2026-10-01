import { expect, test } from "@playwright/test";
import { fillValidForm, seedCart, signUp } from "./helpers";

async function placeOrder(page: import("@playwright/test").Page) {
  await seedCart(page, [{ productId: "electric-drill-01", quantity: 1 }], "/checkout");
  await fillValidForm(page);
  await page.getByRole("button", { name: "ثبت سفارش" }).click();
  await expect(page).toHaveURL(/\/orders\/[0-9a-f-]{36}$/);
  return page.url();
}

test("checkout pre-fills the name of a logged-in user", async ({ page }) => {
  await signUp(page, "نگار احمدی");
  await seedCart(page, [{ productId: "electric-drill-01", quantity: 1 }], "/checkout");
  await expect(page.getByLabel("نام و نام خانوادگی")).toHaveValue("نگار احمدی");
  await expect(page.getByRole("link", { name: "وارد شوید" })).toHaveCount(0);
});

test("guests are invited to log in at checkout", async ({ page }) => {
  await seedCart(page, [{ productId: "electric-drill-01", quantity: 1 }], "/checkout");
  await expect(page.getByRole("link", { name: "وارد شوید" })).toHaveAttribute(
    "href",
    "/login?next=/checkout",
  );
});

test("an account's orders are private to that account", async ({ page, browser }) => {
  await signUp(page);
  const orderUrl = await placeOrder(page);

  // The owner can open it again later.
  await page.goto(orderUrl);
  await expect(page.getByRole("heading", { name: "سفارش شما ثبت شد" })).toBeVisible();

  // A logged-out visitor with the link gets a 404.
  const guest = await browser.newPage();
  expect((await guest.goto(orderUrl))?.status()).toBe(404);

  // So does a different account.
  await signUp(guest, "کاربر دیگر");
  expect((await guest.goto(orderUrl))?.status()).toBe(404);
  await guest.close();
});

test("guest orders stay reachable by their link", async ({ page, browser }) => {
  const orderUrl = await placeOrder(page);
  const other = await browser.newPage();
  expect((await other.goto(orderUrl))?.status()).toBe(200);
  await other.close();
});

test("order history lists the account's orders, newest first", async ({ page }) => {
  await signUp(page);
  await page.goto("/account/orders");
  await expect(page.getByText("هنوز سفارشی ثبت نکرده‌اید")).toBeVisible();

  const first = await placeOrder(page);
  const second = await placeOrder(page);

  await page.goto("/account");
  await page.getByRole("link", { name: "سفارش‌های من" }).click();
  const links = page.getByRole("main").getByRole("link", { name: /سفارش/ });
  await expect(links).toHaveCount(2);
  await expect(links.first()).toHaveAttribute("href", new URL(second).pathname);
  await expect(links.last()).toHaveAttribute("href", new URL(first).pathname);

  await links.first().click();
  await expect(page.getByRole("heading", { name: "سفارش شما ثبت شد" })).toBeVisible();
});

test("order history requires login", async ({ page }) => {
  await page.goto("/account/orders");
  await expect(page).toHaveURL("/login?next=/account/orders");
});
