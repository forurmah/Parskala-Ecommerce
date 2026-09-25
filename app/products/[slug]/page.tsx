import { notFound } from "next/navigation";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.id === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">
        {product.name}
      </h1>

      <p className="mt-4 text-xl font-bold text-blue-700">
        {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
      </p>

      <p className="mt-4">
        {product.inStock ? "موجود" : "ناموجود"}
      </p>
    </main>
  );
}