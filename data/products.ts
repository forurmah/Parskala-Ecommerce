import type { Product } from "@/types/product";
export const products: Product[] = [
  {
    id:"electric-drill-01",
    slug: "electric-drill1",
    name: "دریل برقی صنعتی",
    description:"دریل خوش دست" ,
    category: "power-tools",
    price: 3_850_000,
    image: "/images/products/electric-drill1.jpeg",
    inStock: true,
  },
  {
    id:"angle-grinder-01",
    slug: "angle-grinder1",
    name: "مینی فرز حرفه‌ای",
    description:"مینی فرز خوش‌دست برای برش و پرداخت قطعات فلزی در کارگاه و خانه." ,
    category: "power-tools",
    price: 2_950_000,
    image: "/images/products/angle-grinder1.jpeg",
    inStock: true,
  },
  {
    id:"tool-set-01",
    slug: "tool-set1",
    name: "مجموعه ابزار دستی",
    description:"مجموعه ابزار کاربردی برای تعمیرات روزمره و نگهداری خانه." ,
    category: "hand-tools",
    price: 4_200_000,
    image: "/images/products/tool-set1.jpeg",
    inStock: false,
  },
  {
    id:'safety-helmet-01',
    slug: 'safety-helmet1',
    name: 'کلاه ایمنی صنعتی',
    description:"کلاه ایمن مستحکم" ,
    category: 'safety-equipment',
    price: 480_000,
    image: '/images/products/safety-helmet1.jpeg',
    inStock: true,
  },
];
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug=== slug);
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}