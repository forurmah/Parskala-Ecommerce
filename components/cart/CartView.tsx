"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { MAX_QUANTITY, useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/data/products";

// Matches the banner in the header.
const FREE_SHIPPING_THRESHOLD = 2_000_000;

export default function CartView() {
  const { items, setQuantity, removeFromCart, clearCart, totalCount, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <ShoppingCart size={48} className="text-slate-300" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold">سبد خرید شما خالی است</p>
        <p className="mt-2 text-slate-600">
          برای شروع خرید، محصولات فروشگاه را ببینید.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-700"
        >
          مشاهده محصولات
        </Link>
      </section>
    );
  }

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
      <section aria-label="کالاهای سبد خرید" className="lg:col-span-2">
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 p-4 sm:p-5">
              <Link
                href={`/products/${product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold leading-7 hover:text-orange-600"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatPrice(product.price)}
                  </p>
                  {!product.inStock && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                      این کالا دیگر موجود نیست
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      disabled={quantity >= MAX_QUANTITY || !product.inStock}
                      aria-label={`افزایش تعداد ${product.name}`}
                      className="p-2 text-slate-700 transition hover:text-orange-600 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      <Plus size={18} aria-hidden="true" />
                    </button>
                    <span
                      aria-live="polite"
                      aria-label={`تعداد ${product.name}`}
                      className="min-w-8 text-center font-bold"
                    >
                      {quantity.toLocaleString("fa-IR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      aria-label={`کاهش تعداد ${product.name}`}
                      className="p-2 text-slate-700 transition hover:text-orange-600"
                    >
                      <Minus size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`حذف ${product.name} از سبد خرید`}
                    className="rounded-xl p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clearCart}
          className="mt-4 text-sm text-slate-500 transition hover:text-red-600"
        >
          خالی کردن سبد خرید
        </button>
      </section>

      <aside
        aria-label="خلاصه سفارش"
        className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-6"
      >
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">تعداد کالاها</dt>
            <dd>{totalCount.toLocaleString("fa-IR")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">هزینه ارسال</dt>
            <dd>
              {remainingForFreeShipping <= 0 ? "رایگان" : "محاسبه در مرحله بعد"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
            <dt>جمع کل</dt>
            <dd>{formatPrice(totalPrice)}</dd>
          </div>
        </dl>

        {remainingForFreeShipping > 0 && (
          <p className="mt-4 rounded-xl bg-orange-50 p-3 text-sm leading-6 text-orange-800">
            با {formatPrice(remainingForFreeShipping)} خرید بیشتر، ارسال رایگان
            می‌شود.
          </p>
        )}

        <button
          type="button"
          disabled
          className="mt-5 w-full rounded-xl bg-orange-600 px-5 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          ادامه فرایند خرید (به‌زودی)
        </button>
      </aside>
    </div>
  );
}
