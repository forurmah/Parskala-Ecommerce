"use client";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { placeOrder } from "@/actions/orders";

import { useCart } from "@/components/cart/CartProvider";
import {
  readCheckoutForm,
  validateCheckout,
} from "@/components/checkout/validation";
import { formatPrice } from "@/data/products";
import { getShippingCost } from "@/data/shipping";
import type { CheckoutDetails, CheckoutErrors } from "@/types/checkout";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 aria-invalid:border-red-500 aria-invalid:focus:ring-red-100";

type FieldProps = {
  name: keyof CheckoutDetails;
  label: string;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
    className: string;
  }) => ReactNode;
};

function Field({ name, label, error, hint, children }: FieldProps) {
  const id = `checkout-${name}`;
  const messageId = `${id}-message`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? messageId : undefined,
        className: inputClass,
      })}
      {error ? (
        <p id={messageId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function focusFirstInvalid(form: HTMLFormElement, errors: CheckoutErrors) {
  const firstInvalid = Object.keys(errors)[0];
  if (!firstInvalid) return false;

  const field = form.elements.namedItem(firstInvalid);
  if (field instanceof HTMLElement) field.focus();
  return true;
}

export default function CheckoutForm() {
  const { hydrated, items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [redirecting, setRedirecting] = useState(false);

  // Shown between a successful order and the confirmation page loading,
  // so the emptied cart doesn't flash the "empty cart" message.
  if (redirecting) {
    return (
      <p aria-live="polite" className="py-16 text-center text-slate-600">
        سفارش ثبت شد؛ در حال انتقال…
      </p>
    );
  }

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="در حال بارگذاری"
        className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white"
      />
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <ShoppingCart size={48} className="text-slate-300" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold">سبد خرید شما خالی است</p>
        <Link
          href="/products"
          className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-700"
        >
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  const shipping = getShippingCost(totalPrice);
  const total = totalPrice + shipping;
  const hasUnavailable = items.some((item) => !item.product.inStock);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasUnavailable || isPending) return;

    const form = event.currentTarget;
    const details = readCheckoutForm(new FormData(form));
    const nextErrors = validateCheckout(details);
    setErrors(nextErrors);
    setServerMessage(null);

    if (focusFirstInvalid(form, nextErrors)) return;

    const lines = items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    }));

    startTransition(async () => {
      // The server re-checks everything and computes the real total.
      const result = await placeOrder(details, lines);

      if (result.ok) {
        setRedirecting(true);
        clearCart();
        router.push(`/orders/${result.orderId}`);
        return;
      }

      setErrors(result.errors ?? {});
      setServerMessage(result.message ?? null);
      if (result.errors) focusFirstInvalid(form, result.errors);
    });
  }

  // Clear a field's error as soon as the user edits it.
  function handleChange(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as keyof CheckoutDetails;
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="grid gap-6 lg:grid-cols-3 lg:items-start"
    >
      <section
        aria-labelledby="shipping-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2"
      >
        <h2 id="shipping-heading" className="mb-5 text-lg font-bold">
          اطلاعات ارسال
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="fullName" label="نام و نام خانوادگی" error={errors.fullName}>
            {(props) => <input {...props} type="text" autoComplete="name" />}
          </Field>

          <Field
            name="phone"
            label="شماره موبایل"
            error={errors.phone}
            hint="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          >
            {(props) => (
              <input
                {...props}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                dir="ltr"
                className={`${props.className} text-right`}
              />
            )}
          </Field>

          <Field name="city" label="شهر" error={errors.city}>
            {(props) => (
              <input {...props} type="text" autoComplete="address-level2" />
            )}
          </Field>

          <Field
            name="postalCode"
            label="کد پستی"
            error={errors.postalCode}
            hint="۱۰ رقم، بدون خط تیره"
          >
            {(props) => (
              <input
                {...props}
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                dir="ltr"
                className={`${props.className} text-right`}
              />
            )}
          </Field>

          <div className="sm:col-span-2">
            <Field name="address" label="نشانی کامل" error={errors.address}>
              {(props) => (
                <textarea {...props} rows={3} autoComplete="street-address" />
              )}
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field name="notes" label="توضیحات (اختیاری)">
              {(props) => <textarea {...props} rows={2} />}
            </Field>
          </div>
        </div>
      </section>

      <aside
        aria-labelledby="summary-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-6"
      >
        <h2 id="summary-heading" className="mb-4 text-lg font-bold">
          خلاصه سفارش
        </h2>

        <ul className="space-y-2 border-b border-slate-200 pb-4 text-sm">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between gap-3">
              <span>
                {product.name} × {quantity.toLocaleString("fa-IR")}
              </span>
              <span className="shrink-0">
                {formatPrice(product.price * quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">جمع کالاها</dt>
            <dd>{formatPrice(totalPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">هزینه ارسال</dt>
            <dd>{shipping === 0 ? "رایگان" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">روش پرداخت</dt>
            <dd>پرداخت در محل</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
            <dt>مبلغ قابل پرداخت</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

        {hasUnavailable && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
            بعضی کالاهای سبد شما ناموجود شده‌اند.{" "}
            <Link href="/cart" className="font-bold underline">
              ویرایش سبد خرید
            </Link>
          </p>
        )}

        {serverMessage && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {serverMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={hasUnavailable || isPending}
          className="mt-5 w-full rounded-xl bg-orange-600 px-5 py-3.5 font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "در حال ثبت سفارش…" : "ثبت سفارش"}
        </button>
      </aside>
    </form>
  );
}
