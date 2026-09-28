import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { formatPrice } from "@/data/products";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/products/${product.slug}`;

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
      dir="rtl"
    >


    <Link href={`/products/${product.slug}`} className="block">
       <div className="relative h-72 w-full overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>


      <div className="flex flex-1 flex-col p-5">
        <Link href={productUrl}>
          <h3 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-slate-900 transition-colors hover:text-blue-700">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="mt-auto pt-5">
          <p
            className={
              product.inStock
                ? "mb-2 text-sm font-medium text-emerald-700"
                : "mb-2 text-sm font-medium text-red-600"
            }
          >
            {product.inStock ? "موجود در انبار" : "ناموجود"}
          </p>

          <p className="mb-4 text-xl font-bold text-slate-900">
            {formatPrice(product.price)}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}