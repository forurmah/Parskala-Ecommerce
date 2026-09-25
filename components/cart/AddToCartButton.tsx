"use client";

import type { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    if (!product.inStock) return;

    addToCart(product);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!product.inStock}
      aria-label={
        product.inStock
          ? `افزودن ${product.name} به سبد خرید`
          : `${product.name} ناموجود است`
      }
      className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
    >
      {product.inStock
        ? "افزودن به سبد خرید"
        : "فعلاً ناموجود"}
    </button>
  );
}