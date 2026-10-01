import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "سبد خرید | پارس‌کالا",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold sm:text-3xl">سبد خرید</h1>
        <CartView />
      </div>
    </main>
  );
}
