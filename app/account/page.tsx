import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package } from "lucide-react";

import { logout } from "@/actions/auth";
import { getCurrentUser } from "@/auth/session";

export const metadata: Metadata = {
  title: "حساب کاربری | پارس‌کالا",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">حساب کاربری</h1>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">نام</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">ایمیل</dt>
              <dd dir="ltr" className="font-medium">
                {user.email}
              </dd>
            </div>
          </dl>

          <Link
            href="/account/orders"
            className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-4 font-medium transition hover:bg-orange-50 hover:text-orange-700"
          >
            <Package size={20} aria-hidden="true" />
            سفارش‌های من
          </Link>

          <form action={logout} className="mt-6 border-t border-slate-200 pt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} aria-hidden="true" />
              خروج از حساب
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
