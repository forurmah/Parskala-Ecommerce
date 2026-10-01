export type CheckoutDetails = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;
