import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";

import { getCurrentUser } from "@/auth/session";
import { getOrderWithItems } from "@/db/orders";
import { formatPrice } from "@/data/products";
import {
  formatOrderNumber,
  orderDateFormatter,
} from "@/components/orders/format";

export const metadata: Metadata = {
  title: "جزئیات سفارش | پارس‌کالا",
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const order = await getOrderWithItems(id);
  if (!order) notFound();

  // Orders placed while logged in are private to that account. Answer
  // 404 rather than 403 so we don't confirm the order exists.
  if (order.userId) {
    const user = await getCurrentUser();
    if (user?.id !== order.userId) notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <div className="text-center">
            <CircleCheck
              size={56}
              className="mx-auto text-green-600"
              aria-hidden="true"
            />
            <h1 className="mt-4 text-2xl font-bold">سفارش شما ثبت شد</h1>
            <p className="mt-2 text-slate-600">
              شماره سفارش:{" "}
              <span dir="ltr" className="font-bold text-slate-900">
                {formatOrderNumber(order.id)}
              </span>
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {orderDateFormatter.format(order.createdAt)}
            </p>
          </div>

          <h2 className="mt-8 font-bold">کالاها</h2>
          <ul className="mt-3 divide-y divide-slate-200 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-2">
                <span>
                  {item.productName} × {item.quantity.toLocaleString("fa-IR")}
                </span>
                <span className="shrink-0">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 rounded-xl bg-slate-50 p-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">گیرنده</dt>
              <dd>{order.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-slate-600">نشانی</dt>
              <dd>
                {order.city}، {order.address}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">هزینه ارسال</dt>
              <dd>
                {order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 font-bold">
              <dt>مبلغ (پرداخت در محل)</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>

          <p className="mt-6 text-center text-xs text-slate-500">
            این نسخه آزمایشی فروشگاه است و سفارش واقعاً ارسال نمی‌شود.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/products"
              className="inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-700"
            >
              ادامه خرید
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
