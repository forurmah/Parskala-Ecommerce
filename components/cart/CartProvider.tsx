"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";

type CartLine = { product: Product; quantity: number };
type CartContextValue = {
  items: CartLine[];
  addToCart: (product: Product) => void;
  totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  function addToCart(product: Product) {
    if (!product.inStock) return;

    setItems((current) => {
      const exists = current.some((item) => item.product.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }
  const totalCount = items.reduce((sum, line) => sum + line.quantity, 0);


  return (
    <CartContext.Provider value={{ items, addToCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}