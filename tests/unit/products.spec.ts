import { expect, test } from "@playwright/test";
import { filterProducts } from "@/data/products";

const names = (query?: string, category?: Parameters<typeof filterProducts>[0]["category"]) =>
  filterProducts({ query, category }).map((product) => product.name);

test("no filters returns every product", () => {
  expect(names()).toHaveLength(4);
});

test("filters by category", () => {
  expect(names(undefined, "power-tools")).toEqual([
    "دریل برقی صنعتی",
    "مینی فرز حرفه‌ای",
  ]);
});

test("matches Arabic ي and ك against Persian ی and ک", () => {
  expect(names("دريل")).toEqual(["دریل برقی صنعتی"]);
  expect(names("كلاه")).toEqual(["کلاه ایمنی صنعتی"]);
});

test("treats a half-space and a normal space the same", () => {
  expect(names("حرفه ای")).toEqual(["مینی فرز حرفه‌ای"]);
});

test("every word must match, in any order", () => {
  expect(names("صنعتی کلاه")).toEqual(["کلاه ایمنی صنعتی"]);
  expect(names("کلاه دریل")).toEqual([]);
});

test("combines search and category", () => {
  expect(names("ابزار", "hand-tools")).toEqual(["مجموعه ابزار دستی"]);
});
