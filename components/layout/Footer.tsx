import Link from "next/link";

const customerLinks = [
  "نحوه ثبت سفارش",
  "روش‌های پرداخت",
  "رویه ارسال سفارش",
  "شرایط بازگشت کالا",
];

const companyLinks = [
  "درباره ما",
  "تماس با ما",
  "فرصت‌های شغلی",
  "پرسش‌های متداول",
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-rose-600"
          >
            پارس‌کالا
          </Link>

          <p className="mt-4 max-w-xl text-sm leading-8 text-zinc-600">
            فروشگاه اینترنتی پارس‌کالا برای بررسی، انتخاب و خرید آنلاین
            محصولات مورد نیاز شما.
          </p>

          <p className="mt-4 text-sm text-zinc-500">
            تلفن پشتیبانی: ۰۶۱-۵۳۵-۱۰۲۲۵
          </p>
        </div>

        <FooterColumn title="راهنمای خرید" links={customerLinks} />
        <FooterColumn title="پارس‌کالا" links={companyLinks} />
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-zinc-500">
          © ۱۴۰۵ پارس‌کالا — تمام حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="font-bold text-zinc-900">{title}</h2>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <span className="text-sm text-zinc-600">{link}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}