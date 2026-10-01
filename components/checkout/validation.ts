// Plain functions (no React), so a server action can reuse them later.
import type { CheckoutDetails, CheckoutErrors } from "@/types/checkout";

// Turn Persian (۰-۹) and Arabic (٠-٩) digits into 0-9 and drop spaces/dashes,
// so "۰۹۱۲ ۳۴۵ ۶۷۸۹" is accepted as a phone number.
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\s-]/g, "");
}

export function readCheckoutForm(formData: FormData): CheckoutDetails {
  const text = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    fullName: text("fullName"),
    phone: normalizeDigits(text("phone")),
    city: text("city"),
    address: text("address"),
    postalCode: normalizeDigits(text("postalCode")),
    notes: text("notes"),
  };
}

export function validateCheckout(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (details.fullName.length < 3) {
    errors.fullName = "نام و نام خانوادگی را کامل وارد کنید.";
  }
  if (!/^09\d{9}$/.test(details.phone)) {
    errors.phone = "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.";
  }
  if (details.city.length < 2) {
    errors.city = "شهر را وارد کنید.";
  }
  if (details.address.length < 10) {
    errors.address = "نشانی را دقیق‌تر وارد کنید (حداقل ۱۰ حرف).";
  }
  if (!/^\d{10}$/.test(details.postalCode)) {
    errors.postalCode = "کد پستی باید ۱۰ رقم باشد.";
  }

  return errors;
}
