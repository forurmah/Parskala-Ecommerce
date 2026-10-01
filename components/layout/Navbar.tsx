import Link from "next/link";
import { categoryLabels } from "@/data/products";
import type { ProductCategory } from "@/types/product";

const categories = Object.keys(categoryLabels) as ProductCategory[];

export function Navbar() {
  return (
    <nav aria-label="دسته‌بندی‌ها" className="w-full border-b border-zinc-200 bg-white">
      <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 text-sm font-medium text-zinc-700">
        <li className="shrink-0">
          <Link href="/products" className="transition hover:text-rose-600">
            همه محصولات
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category} className="shrink-0">
            <Link
              href={`/products?category=${category}`}
              className="transition hover:text-rose-600"
            >
              {categoryLabels[category]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
