"use client";
import { useCart } from "@/components/cart/CartProvider";

export default function CartStatus() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <span aria-live="polite">سبد خرید: {count.toLocaleString("fa-IR")}</span>;
}