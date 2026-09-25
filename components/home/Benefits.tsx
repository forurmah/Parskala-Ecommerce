import {
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

const benefits = [
  {
    id: "delivery",
    title: "ارسال سریع",
    description: "ارسال مطمئن سفارش‌ها به سراسر کشور",
    icon: Truck,
  },
  {
    id: "guarantee",
    title: "ضمانت اصالت",
    description: "تضمین اصالت و کیفیت محصولات",
    icon: ShieldCheck,
  },
  {
    id: "support",
    title: "پشتیبانی خرید",
    description: "راهنمایی و پاسخ‌گویی پیش از خرید",
    icon: Headphones,
  },
];

export default function Benefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="border-b border-slate-200 bg-white px-4 py-10"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="benefits-heading" className="sr-only">
          مزایای خرید از پارس‌کالا
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.id}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5"
              >
                <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                  <Icon aria-hidden="true" size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}