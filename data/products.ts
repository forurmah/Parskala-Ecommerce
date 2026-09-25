import type { Product } from "@/types/product";
export const products: Product[] = [
  {
    id: "electric-drill-01",
    name: "دریل برقی صنعتی",
    category: "power-tools",
    price: 3_850_000,
    image: "/images/products/electric-drill.jpeg",
    inStock: true,
  },
  {
    id: "angle-grinder-01",
    name: "مینی فرز حرفه‌ای",
    category: "power-tools",
    price: 2_950_000,
    image: "/images/products/angle-grinder.jpeg",
    inStock: true,
  },
  {
    id: "tool-set-01",
    name: "مجموعه ابزار دستی",
    category: "hand-tools",
    price: 4_200_000,
    image: "/images/products/tool-set.jpeg",
    inStock: false,
  },
  {
    id: 'safety-helmet-01',
    name: 'کلاه ایمنی صنعتی',
    category: 'safety-equipment',
    price: 480_000,
    image: '/images/products/safety-helmet.jpeg',
    inStock: true,
  },
];