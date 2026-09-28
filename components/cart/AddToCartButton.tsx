"use client";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function handleAddToCart() {
    if (!product.inStock) return;

    addToCart(product);
    setJustAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);

    resetTimer.current = setTimeout(() => {
      setJustAdded(false);
      resetTimer.current = null;
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!product.inStock}
      aria-label={
        product.inStock
          ? justAdded
            ? `${product.name} به سبد خرید اضافه شد؛ برای افزودن دوباره کلیک کنید`
            : `افزودن ${product.name} به سبد خرید`
          : `${product.name} ناموجود است`
      }
      className={`w-full rounded-xl px-5 py-3.5 font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 ${
        justAdded
          ? "bg-green-700 hover:bg-green-800"
          : "bg-orange-600 hover:bg-orange-700"
      }`}
    >
      {product.inStock
        ? justAdded
          ? "✓ به سبد اضافه شد"
          : "افزودن به سبد خرید"
        : "ناموجود"}
    </button>
  );
}