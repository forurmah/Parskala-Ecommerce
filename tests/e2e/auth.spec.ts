import { expect, test } from "@playwright/test";
import { TEST_PASSWORD, accountLink, signUp, uniqueEmail } from "./helpers";

test("sign up, stay logged in, then log out", async ({ page, context }) => {
  const email = await signUp(page, "سارا محمدی");

  await expect(page).toHaveURL("/account");
  await expect(page.getByText(email)).toBeVisible();
  await expect(accountLink(page)).toHaveAttribute("href", "/account");

  // The session cookie can't be read by page JavaScript.
  const session = (await context.cookies()).find((c) => c.name === "session");
  expect(session?.httpOnly).toBe(true);

  await page.reload();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("button", { name: "خروج از حساب" }).click();
  await expect(page).toHaveURL("/");
  await expect(accountLink(page)).toHaveAttribute("href", "/login");

  await page.goto("/account");
  await expect(page).toHaveURL("/login?next=/account");
});

test("desktop header shows the first name when logged in", async ({ page, isMobile }) => {
  test.skip(isMobile, "the mobile header only shows an icon");
  await signUp(page, "سارا محمدی");
  await expect(accountLink(page)).toHaveText("سارا");
});

test("sign-up shows validation errors and keeps what was typed", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("نام").fill("سارا");
  await page.getByLabel("ایمیل").fill("not-an-email");
  await page.getByLabel("رمز عبور").fill("short");
  await page.getByRole("button", { name: "ثبت‌نام" }).click();

  await expect(page.getByText("ایمیل معتبر وارد کنید.")).toBeVisible();
  await expect(page.getByText("رمز عبور باید حداقل ۸ کاراکتر باشد.")).toBeVisible();
  await expect(page.getByLabel("نام")).toHaveValue("سارا");
  await expect(page.getByLabel("ایمیل")).toHaveValue("not-an-email");
  await expect(page.getByLabel("رمز عبور")).toHaveValue("");
});

test("an email can only be registered once (case-insensitive)", async ({ page, context }) => {
  const email = await signUp(page);
  await context.clearCookies();

  await page.goto("/signup");
  await page.getByLabel("نام").fill("کاربر دیگر");
  await page.getByLabel("ایمیل").fill(email.toUpperCase());
  await page.getByLabel("رمز عبور").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "ثبت‌نام" }).click();

  await expect(page.getByText("با این ایمیل قبلاً ثبت‌نام شده است.")).toBeVisible();
});

test("login works, and a wrong password gets a generic error", async ({ page, context }) => {
  const email = await signUp(page);
  await context.clearCookies();

  await page.goto("/login");
  await page.getByLabel("ایمیل").fill(email);
  await page.getByLabel("رمز عبور").fill("wrong-password");
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "ایمیل یا رمز عبور اشتباه است.",
  );
  await expect(page.getByLabel("ایمیل")).toHaveValue(email);

  await page.getByLabel("رمز عبور").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page).toHaveURL("/account");
});

test("an unknown email gets the same generic error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("ایمیل").fill(uniqueEmail());
  await page.getByLabel("رمز عبور").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "ورود" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(
    "ایمیل یا رمز عبور اشتباه است.",
  );
});

test("after login you return to the page you came from, never off-site", async ({ page }) => {
  await signUp(page, "سارا", "/checkout");
  await expect(page).toHaveURL("/checkout");

  await page.goto("/login?next=//evil.example");
  // Already logged in, so it redirects straight away, to a safe page.
  await expect(page).toHaveURL("/account");
});
