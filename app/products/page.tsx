import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, X } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import {
  categoryLabels,
  filterProducts,
  isProductCategory,
} from "@/data/products";
import type { ProductCategory } from "@/types/product";

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Ignore repeated params (?q=a&q=b) and unknown categories.
async function readFilters(searchParams: ProductsPageProps["searchParams"]) {
  const { q, category } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return {
    query,
    category: isProductCategory(category) ? category : undefined,
  };
}

function productsUrl(query: string, category?: ProductCategory) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);

  const search = params.toString();
  return search ? `/products?${search}` : "/products";
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { query, category } = await readFilters(searchParams);
  const heading = category ? categoryLabels[category] : "همه محصولات";

  return {
    title: query
      ? `جستجوی «${query}» | پارس‌کالا`
      : `${heading} | پارس‌کالا`,
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { query, category } = await readFilters(searchParams);
  const results = filterProducts({ query, category });
  const categories = Object.keys(categoryLabels) as ProductCategory[];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {category ? categoryLabels[category] : "همه محصولات"}
        </h1>

        <nav aria-label="دسته‌بندی محصولات" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {[undefined, ...categories].map((item) => {
              const isActive = item === category;

              return (
                <li key={item ?? "all"}>
                  <Link
                    href={productsUrl(query, item)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {item ? categoryLabels[item] : "همه"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <p aria-live="polite">
            {results.length.toLocaleString("fa-IR")} محصول
          </p>

          {query && (
            <Link
              href={productsUrl("", category)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-300"
            >
              جستجو: «{query}»
              <X size={14} aria-hidden="true" />
              <span className="sr-only">حذف عبارت جستجو</span>
            </Link>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <section className="mt-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <SearchX size={48} className="text-slate-300" aria-hidden="true" />
            <p className="mt-4 text-lg font-bold">محصولی پیدا نشد</p>
            <p className="mt-2 text-slate-600">
              عبارت دیگری را امتحان کنید یا همه محصولات را ببینید.
            </p>
            <Link
              href="/products"
              className="mt-6 rounded-xl bg-orange-600 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-700"
            >
              مشاهده همه محصولات
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
