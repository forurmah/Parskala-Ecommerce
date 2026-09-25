import Link from "next/link";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import {Navbar} from "@/components/layout/Navbar";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="bg-zinc-900 px-4 py-2 text-center text-xs text-white sm:text-sm">
        ارسال رایگان برای سفارش‌های بیشتر از ۲ میلیون تومان
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-rose-600"
          >
            پارس‌کالا
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label="ورود به حساب کاربری"
              className="rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <UserRound size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="مشاهده سبد خرید"
              className="relative rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <ShoppingCart size={20} aria-hidden="true" />

              <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs text-white">
                ۰
              </span>
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          <label htmlFor="site-search" className="sr-only">
            جستجو در محصولات
          </label>

          <input
            id="site-search"
            name="search"
            type="search"
            placeholder="جستجو در میان محصولات..."
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-100 pr-4 pl-12 text-sm outline-none transition placeholder:text-zinc-500 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-100"
          />

          <button
            type="button"
            aria-label="جستجو"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition hover:bg-white hover:text-rose-600"
          >
            <Search size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-12 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <UserRound size={20} aria-hidden="true" />
            ورود | ثبت‌نام
          </button>

          <button
            type="button"
            aria-label="مشاهده سبد خرید"
            className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white transition hover:bg-rose-700"
          >
            <ShoppingCart size={21} aria-hidden="true" />

            <span className="absolute -left-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs text-white">
              ۰
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}