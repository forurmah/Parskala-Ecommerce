import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import AddToCartButton from "@/components/cart/AddToCartButton";

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-slate-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </Link>

      <div className="space-y-4 p-5">
        <h3 className="text-lg font-bold text-slate-900">
          <Link
            href={`/products/${product.slug}`}
            className="transition hover:text-blue-700"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center justify-between gap-4">
          <p className="font-bold text-blue-700">
            {formatPrice(product.price)} تومان
          </p>

          <span
            className={
              product.inStock
                ? "text-sm font-medium text-green-700"
                : "text-sm font-medium text-red-600"
            }
          >
            {product.inStock ? "موجود" : "ناموجود"}
          </span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-center font-medium text-slate-900 transition hover:border-blue-700 hover:text-blue-700"
        >
          مشاهده محصول
        </Link>

        <AddToCartButton product={product} />
      </div>
    </article>
  );
}