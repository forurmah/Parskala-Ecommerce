import type { Product, ProductCategory } from "@/types/product";

export const products: Product[] = [
  {
    id: "electric-drill-01",
    slug: "electric-drill",
    name: "دریل برقی صنعتی",
    description:
      "دریل خوش‌دست برای سوراخ‌کاری چوب، فلز و دیوار؛ مناسب کارهای روزمره خانه و کارگاه.",
    category: "power-tools",
    price: 3_850_000,
    image: "/images/products/electric-drill1.jpeg",
    inStock: true,
  },
  {
    id: "angle-grinder-01",
    slug: "angle-grinder",
    name: "مینی فرز حرفه‌ای",
    description:
      "مینی فرز خوش‌دست برای برش و پرداخت قطعات فلزی در کارگاه و خانه.",
    category: "power-tools",
    price: 2_950_000,
    image: "/images/products/angle-grinder1.jpeg",
    inStock: true,
  },
  {
    id: "tool-set-01",
    slug: "tool-set",
    name: "مجموعه ابزار دستی",
    description:
      "مجموعه ابزار کاربردی برای تعمیرات روزمره و نگهداری خانه.",
    category: "hand-tools",
    price: 4_200_000,
    image: "/images/products/tool-set1.jpeg",
    inStock: false,
  },
  {
    id: "safety-helmet-01",
    slug: "safety-helmet",
    name: "کلاه ایمنی صنعتی",
    description:
      "کلاه ایمنی مستحکم برای محافظت از سر در کارگاه‌ها و محیط‌های ساختمانی.",
    category: "safety-equipment",
    price: 480_000,
    image: "/images/products/safety-helmet1.jpeg",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

export const categoryLabels: Record<ProductCategory, string> = {
  "power-tools": "ابزار برقی",
  "hand-tools": "ابزار دستی",
  "safety-equipment": "تجهیزات ایمنی",
};

export function isProductCategory(value: unknown): value is ProductCategory {
  return typeof value === "string" && Object.hasOwn(categoryLabels, value);
}

// Make Persian search forgiving: Arabic ي/ك vs Persian ی/ک, half-spaces
// (ZWNJ) vs normal spaces, extra whitespace and letter case.
function normalizeSearchText(text: string): string {
  return text
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

type ProductFilters = {
  query?: string;
  category?: ProductCategory;
};

export function filterProducts({ query, category }: ProductFilters): Product[] {
  const words = normalizeSearchText(query ?? "")
    .split(" ")
    .filter(Boolean);

  return products.filter((product) => {
    if (category && product.category !== category) return false;

    const haystack = normalizeSearchText(
      `${product.name} ${product.description} ${categoryLabels[product.category]}`,
    );
    return words.every((word) => haystack.includes(word));
  });
}
