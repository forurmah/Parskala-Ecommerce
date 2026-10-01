import { expect, test } from "@playwright/test";
import {
  normalizeDigits,
  validateCheckout,
} from "@/components/checkout/validation";
import type { CheckoutDetails } from "@/types/checkout";

const valid: CheckoutDetails = {
  fullName: "سارا محمدی",
  phone: "09123456789",
  city: "اصفهان",
  address: "خیابان چهارباغ، کوچه ۱۲، پلاک ۵",
  postalCode: "8136745691",
  notes: "",
};

test("normalizes Persian and Arabic digits, spaces and dashes", () => {
  expect(normalizeDigits("۰۹۱۲ ۳۴۵-۶۷۸۹")).toBe("09123456789");
  expect(normalizeDigits("٠٩١٢٣٤٥٦٧٨٩")).toBe("09123456789");
});

test("accepts a complete form", () => {
  expect(validateCheckout(valid)).toEqual({});
});

test("notes are optional", () => {
  expect(validateCheckout({ ...valid, notes: "" })).toEqual({});
});

test("rejects bad phone numbers", () => {
  for (const phone of ["0912345678", "9123456789", "08123456789", "abc"]) {
    expect(validateCheckout({ ...valid, phone })).toHaveProperty("phone");
  }
});

test("rejects postal codes that are not 10 digits", () => {
  for (const postalCode of ["12345", "12345678901", "12345abcde"]) {
    expect(validateCheckout({ ...valid, postalCode })).toHaveProperty(
      "postalCode",
    );
  }
});

test("reports every missing required field", () => {
  const empty = { ...valid, fullName: "", phone: "", city: "", address: "", postalCode: "" };
  expect(Object.keys(validateCheckout(empty)).sort()).toEqual(
    ["address", "city", "fullName", "phone", "postalCode"],
  );
});
