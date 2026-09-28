import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsSection() {
  return (
    <section
      aria-labelledby="products-heading"
      className="bg-slate-50 py-12 sm:py-16"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2
            id="products-heading"
            className="text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            محصولات پیشنهادی
          </h2>

          <p className="mt-2 text-slate-600">
            مجموعه‌ای از ابزارها و تجهیزات پرکاربرد
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}