export type ProductCategory =
  | 'power-tools'
  | 'hand-tools'
  | 'safety-equipment';

export type Product = {
  id: string;
  slug:string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  image: string;
  inStock: boolean;
};