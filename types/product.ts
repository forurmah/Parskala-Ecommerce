export type ProductCategory =
  | 'power-tools'
  | 'hand-tools'
  | 'safety-equipment';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  inStock: boolean;
};