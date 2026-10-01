"use server";
// Server actions are public endpoints: never trust prices, totals or
// stock from the browser. Only product IDs and quantities are accepted,
// and everything else is recomputed from the catalog here.
import { createOrder } from "@/db/orders";
import { MAX_QUANTITY } from "@/data/cart";
import { getProductById } from "@/data/products";
import { getShippingCost } from "@/data/shipping";
import {
  normalizeDigits,
  validateCheckout,
} from "@/components/checkout/validation";
import type { CheckoutDetails, CheckoutErrors } from "@/types/checkout";

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; errors?: CheckoutErrors; message?: string };

type CartLineInput = { productId: string; quantity: number };

function readDetails(input: unknown): CheckoutDetails {
  const value = (input ?? {}) as Record<string, unknown>;
  const text = (key: string) =>
    typeof value[key] === "string" ? (value[key] as string).trim() : "";

  return {
    fullName: text("fullName"),
    phone: normalizeDigits(text("phone")),
    city: text("city"),
    address: text("address"),
    postalCode: normalizeDigits(text("postalCode")),
    notes: text("notes").slice(0, 500),
  };
}

function readLines(input: unknown): CartLineInput[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 50) {
    return null;
  }

  const lines: CartLineInput[] = [];
  for (const line of input) {
    if (
      typeof line?.productId !== "string" ||
      !Number.isInteger(line?.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_QUANTITY ||
      lines.some((existing) => existing.productId === line.productId)
    ) {
      return null;
    }
    lines.push({ productId: line.productId, quantity: line.quantity });
  }
  return lines;
}

export async function placeOrder(
  detailsInput: unknown,
  linesInput: unknown,
): Promise<PlaceOrderResult> {
  const details = readDetails(detailsInput);
  const errors = validateCheckout(details);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const lines = readLines(linesInput);
  if (!lines) {
    return { ok: false, message: "سبد خرید نامعتبر است." };
  }

  const items = [];
  for (const line of lines) {
    const product = getProductById(line.productId);
    if (!product) {
      return { ok: false, message: "یکی از کالاهای سبد دیگر موجود نیست." };
    }
    if (!product.inStock) {
      return { ok: false, message: `«${product.name}» ناموجود شده است.` };
    }
    items.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: line.quantity,
    });
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const shipping = getShippingCost(subtotal);

  try {
    const orderId = await createOrder({
      userId: null,
      details,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
    });
    return { ok: true, orderId };
  } catch (error) {
    console.error("placeOrder failed", error);
    return { ok: false, message: "ثبت سفارش انجام نشد. دوباره تلاش کنید." };
  }
}
