import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";

import { getCurrentUser } from "@/auth/session";
import { getOrdersForUser } from "@/db/orders";
import { formatPrice } from "@/data/products";
import {
  formatOrderNumber,
  orderDateFormatter,
} from "@/components/orders/format";

export const metadata: Metadata = {
  title: "سفارش‌های من | پارس‌کالا",
};

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");

  const orders = await getOrdersForUser(user.id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">سفارش‌های من</h1>

        {orders.length === 0 ? (
          <section className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Package size={48} className="text-slate-300" aria-hidden="true" />
            <p className="mt-4 text-lg font-bold">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link
              href="/products"
              className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-700"
            >
              مشاهده محصولات
            </Link>
          </section>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {orders.map((order) => {
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );

              return (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50 sm:p-5"
                  >
                    <div>
                      <p className="font-bold">
                        سفارش <span dir="ltr">{formatOrderNumber(order.id)}</span>
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {orderDateFormatter.format(order.createdAt)} ·{" "}
                        {itemCount.toLocaleString("fa-IR")} کالا
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{formatPrice(order.total)}</span>
                      <ChevronLeft size={18} className="text-slate-400" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
