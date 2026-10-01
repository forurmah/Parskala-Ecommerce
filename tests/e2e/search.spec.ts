import { expect, test } from "@playwright/test";
import { cartLink } from "./helpers";

const productNames = (page: import("@playwright/test").Page) =>
  page.locator("main article h3");

test("header search shows matching products without a full reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "افزودن کلاه ایمنی صنعتی به سبد خرید" }).click();

  await page.getByRole("searchbox").fill("فرز");
  await page.getByRole("searchbox").press("Enter");

  await expect(page).toHaveURL(/\/products\?q=/);
  await expect(productNames(page)).toHaveText(["مینی فرز حرفه‌ای"]);
  await expect(page).toHaveTitle("محصولات | پارس‌کالا");
  await expect(cartLink(page)).toHaveText("۱");
});

test("category chips keep the search, and the search can be cleared", async ({ page }) => {
  await page.goto("/products?q=" + encodeURIComponent("ابزار"));
  await expect(productNames(page)).toHaveCount(3);

  await page
    .getByRole("navigation", { name: "دسته‌بندی محصولات" })
    .getByRole("link", { name: "ابزار دستی" })
    .click();
  await expect(page).toHaveURL(/q=.+&category=hand-tools/);
  await expect(productNames(page)).toHaveText(["مجموعه ابزار دستی"]);

  await page.getByRole("link", { name: /حذف عبارت جستجو/ }).click();
  await expect(page).toHaveURL("/products?category=hand-tools");
});

test("navbar category links filter products", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "دسته‌بندی‌ها" })
    .getByRole("link", { name: "ابزار برقی" })
    .click();
  await expect(productNames(page)).toHaveText(["دریل برقی صنعتی", "مینی فرز حرفه‌ای"]);
  await expect(page).toHaveTitle("محصولات | پارس‌کالا");
});

test("a search with no results offers a way back", async ({ page }) => {
  await page.goto("/products?q=xyz");
  await expect(page.getByText("محصولی پیدا نشد")).toBeVisible();
  await page.getByRole("link", { name: "مشاهده همه محصولات" }).click();
  await expect(productNames(page)).toHaveCount(4);
});

test("old product URLs redirect and unknown ones 404", async ({ page }) => {
  await page.goto("/products/electric-drill1");
  await expect(page).toHaveURL("/products/electric-drill");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("دریل برقی صنعتی");

  const response = await page.goto("/products/does-not-exist");
  expect(response?.status()).toBe(404);
});
