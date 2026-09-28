import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-section not-found">
      <h1>محصول پیدا نشد</h1>
      <p>آدرس محصول را بررسی کنید یا به فهرست محصولات برگردید.</p>
      <Link href="/">بازگشت به محصولات</Link>
    </section>
  );
}