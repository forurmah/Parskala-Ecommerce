import { expect, test } from "@playwright/test";
import {
  safeRedirectPath,
  validateLogin,
  validateSignup,
} from "@/auth/validation";

const valid = { name: "سارا", email: "sara@example.com", password: "12345678" };

test("accepts a valid sign-up", () => {
  expect(validateSignup(valid)).toEqual({});
});

test("rejects short names, bad emails and short passwords", () => {
  expect(
    Object.keys(validateSignup({ name: "س", email: "nope", password: "1234567" })).sort(),
  ).toEqual(["email", "name", "password"]);
});

test("login only needs an email and a password", () => {
  expect(validateLogin({ ...valid, name: "" })).toEqual({});
  expect(validateLogin({ ...valid, password: "" })).toHaveProperty("password");
});

test("only same-site redirect paths are allowed", () => {
  expect(safeRedirectPath("/account/orders")).toBe("/account/orders");
  expect(safeRedirectPath("/checkout?step=2")).toBe("/checkout?step=2");
  for (const unsafe of ["//evil.com", "/\\evil.com", "https://evil.com", "", null]) {
    expect(safeRedirectPath(unsafe)).toBe("/account");
  }
});
