import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { CheckoutDetails } from "@/types/checkout";

type NewOrder = {
  userId: string | null;
  details: CheckoutDetails;
  items: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
};

export async function createOrder(order: NewOrder): Promise<string> {
  return db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(orders)
      .values({
        userId: order.userId,
        ...order.details,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
      })
      .returning({ id: orders.id });

    await tx
      .insert(orderItems)
      .values(order.items.map((item) => ({ ...item, orderId: id })));

    return id;
  });
}

export async function getOrderWithItems(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true },
  });
}

// Newest first. Callers must pass the logged-in user's own ID.
export async function getOrdersForUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: [desc(orders.createdAt)],
    columns: { id: true, total: true, createdAt: true },
    with: { items: { columns: { quantity: true } } },
  });
}
