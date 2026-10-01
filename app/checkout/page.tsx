import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/auth/session";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "تکمیل خرید | پارس‌کالا",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold sm:text-3xl">تکمیل خرید</h1>
        {!user && (
          <p className="mb-6 rounded-xl bg-white p-4 text-sm text-slate-600 ring-1 ring-slate-200">
            برای دیدن سفارش‌ها در حساب کاربری خود،{" "}
            <Link
              href="/login?next=/checkout"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              وارد شوید
            </Link>
            . خرید بدون ورود هم ممکن است.
          </p>
        )}
        <CheckoutForm defaultName={user?.name ?? ""} />
      </div>
    </main>
  );
}
