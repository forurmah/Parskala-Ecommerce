import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const priceFormatter = new Intl.NumberFormat("fa-IR");

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // The URL contains the slug, not the product ID.
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-slate-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر صفحه"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-orange-600">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product information: right column in RTL */}
          <section>
            <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8 border-y border-slate-200 py-6">
              <p className="text-3xl font-bold text-slate-900">
                {priceFormatter.format(product.price)}
                <span className="mr-2 text-base font-normal text-slate-600">
                  تومان
                </span>
              </p>

              <p
                className={`mt-3 text-sm font-medium ${
                  product.inStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {product.inStock ? "موجود در انبار" : "ناموجود"}
              </p>
            </div>

            <div className="mt-6 max-w-md">
              <AddToCartButton product={product} />
            </div>
          </section>

          {/* Product image: left column in RTL */}
          <section aria-label={`تصویر ${product.name}`}>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
              />
            </div>
          </section>
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold">توضیحات محصول</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            {product.description}
          </p>
        </section>
      </div>
    </main>
  );
}