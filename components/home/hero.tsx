import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-slate-950 px-4 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-semibold text-rose-400">
          فروشگاه اینترنتی پارس‌کالا
        </p>

        <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          خرید ابزار و تجهیزات با انتخابی مطمئن
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-slate-300">
          محصولات موردنیاز خود را بررسی کنید و با اطلاعات
          دقیق‌تر تصمیم بگیرید.
        </p>

        <Link
          href="#products"
          className="mt-8 inline-block rounded-xl bg-rose-600 px-6 py-3 font-bold text-white transition hover:bg-rose-700"
        >
          مشاهده محصولات
        </Link>
      </div>
    </section>
  );
}