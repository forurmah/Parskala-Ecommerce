// A short, readable order number derived from the random order ID.
export function formatOrderNumber(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export const orderDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "long",
  timeStyle: "short",
});
