// Plain functions, shared by the auth server actions and unit tests.

export type AuthFields = { name: string; email: string; password: string };
export type AuthErrors = Partial<Record<keyof AuthFields, string>>;

export const PASSWORD_MIN_LENGTH = 8;

export function readAuthForm(formData: FormData): AuthFields {
  const text = (name: string) => String(formData.get(name) ?? "");
  return {
    name: text("name").trim(),
    email: text("email").trim().toLowerCase(),
    // Passwords are used exactly as typed (no trimming).
    password: text("password"),
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup({ name, email, password }: AuthFields): AuthErrors {
  const errors: AuthErrors = {};

  if (name.length < 2) errors.name = "نام خود را وارد کنید.";
  if (!EMAIL.test(email)) errors.email = "ایمیل معتبر وارد کنید.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  } else if (password.length > 128) {
    errors.password = "رمز عبور حداکثر ۱۲۸ کاراکتر است.";
  }

  return errors;
}

export function validateLogin({ email, password }: AuthFields): AuthErrors {
  const errors: AuthErrors = {};
  if (!EMAIL.test(email)) errors.email = "ایمیل معتبر وارد کنید.";
  if (!password) errors.password = "رمز عبور را وارد کنید.";
  return errors;
}

// Only allow redirects to paths on this site, never to another domain
// (e.g. "//evil.com" or "https://evil.com").
export function safeRedirectPath(value: unknown, fallback = "/account"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
