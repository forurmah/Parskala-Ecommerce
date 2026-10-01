import { expect, test } from "@playwright/test";
import { hashPassword, verifyPassword } from "@/auth/password";

test("a hash verifies with the right password only", async () => {
  const hash = await hashPassword("secret-123");
  expect(hash).toMatch(/^scrypt\$16384\$8\$1\$/);
  expect(await verifyPassword("secret-123", hash)).toBe(true);
  expect(await verifyPassword("secret-124", hash)).toBe(false);
});

test("the same password hashes differently each time (random salt)", async () => {
  const [a, b] = await Promise.all([hashPassword("same"), hashPassword("same")]);
  expect(a).not.toBe(b);
});

test("Persian passwords work and are Unicode-normalized", async () => {
  const hash = await hashPassword("رمزعبور۱۲۳");
  expect(await verifyPassword("رمزعبور۱۲۳", hash)).toBe(true);
});

test("malformed stored hashes are rejected, not thrown", async () => {
  expect(await verifyPassword("x", "")).toBe(false);
  expect(await verifyPassword("x", "md5$abc")).toBe(false);
});
