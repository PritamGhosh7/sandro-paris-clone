import { notFound } from "next/navigation";
import { FacetSidebar } from "@/components/listing/facet-sidebar";
import { ListingHeader } from "@/components/listing/listing-header";
import { ProductGrid } from "@/components/listing/product-grid";
import { products as allProducts } from "@/data/products";

const VALID = ["women", "men"] as const;
type Gender = (typeof VALID)[number];

export default async function GenderIndex({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!VALID.includes(gender as Gender)) notFound();
  const genderLabel = gender === "women" ? "Women" : "Men";

  // For MVP, women shows scraped products; men shows empty until we scrape men's catalog.
  const products = gender === "women" ? allProducts : [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-8">
      <ListingHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: genderLabel },
        ]}
        title={`Spring / Summer 26 — ${genderLabel}`}
        count={products.length}
      />

      <div className="flex gap-10 mt-8">
        <FacetSidebar />
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
