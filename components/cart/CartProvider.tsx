"use client";
import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProductById } from "@/data/products";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  writeCart,
} from "@/components/cart/cartStorage";

export const MAX_QUANTITY = 10;

type CartContextValue = {
  // False during server render and hydration, before the saved cart is read.
  hydrated: boolean;
  items: CartItem[];
  addToCart: (product: Product) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const storedLines = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // Join saved IDs with the catalog; drop products that no longer exist.
  const items = useMemo(
    () =>
      storedLines.flatMap((line): CartItem[] => {
        const product = getProductById(line.productId);
        return product ? [{ product, quantity: line.quantity }] : [];
      }),
    [storedLines],
  );

  function addToCart(product: Product) {
    if (!product.inStock) return;

    const lines = getSnapshot();
    const exists = lines.some((line) => line.productId === product.id);

    writeCart(
      exists
        ? lines.map((line) =>
            line.productId === product.id
              ? { ...line, quantity: Math.min(line.quantity + 1, MAX_QUANTITY) }
              : line,
          )
        : [...lines, { productId: product.id, quantity: 1 }],
    );
  }

  function setQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    writeCart(
      getSnapshot().map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(quantity, MAX_QUANTITY) }
          : line,
      ),
    );
  }

  function removeFromCart(productId: string) {
    writeCart(getSnapshot().filter((line) => line.productId !== productId));
  }

  function clearCart() {
    writeCart([]);
  }

  const totalCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = items.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        hydrated,
        items,
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
