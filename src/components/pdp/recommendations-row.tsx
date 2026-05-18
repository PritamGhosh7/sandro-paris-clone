import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/listing/product-card";

export function RecommendationsRow({
  heading,
  subheading,
  products,
}: {
  heading: string;
  subheading?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="heading-display text-2xl">{heading}</h2>
        {subheading && (
          <p className="text-sm text-[color:var(--color-ink-muted)] mt-1">
            {subheading}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-5">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
