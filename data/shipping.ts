// Keep in sync with the free-shipping banner in the header.
export const FREE_SHIPPING_THRESHOLD = 2_000_000;
// Flat fee for orders below the threshold (placeholder amount).
export const SHIPPING_FEE = 150_000;

export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
