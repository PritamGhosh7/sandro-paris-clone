import { notFound } from "next/navigation";
import { FacetSidebar } from "@/components/listing/facet-sidebar";
import { ListingHeader } from "@/components/listing/listing-header";
import { ProductGrid } from "@/components/listing/product-grid";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

const VALID = ["women", "men"] as const;
type Gender = (typeof VALID)[number];

export default async function CategoryListingPage({
  params,
}: {
  params: Promise<{ gender: string; category: string }>;
}) {
  const { gender, category } = await params;
  if (!VALID.includes(gender as Gender)) notFound();
  const cat = categories.find((c) => c.gender === gender && c.slug === category);
  if (!cat) notFound();

  const products = getProductsByCategory(category);
  const genderLabel = gender === "women" ? "Women" : "Men";

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-8">
      <ListingHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: genderLabel, href: `/${gender}` },
          { label: cat.name },
        ]}
        title={cat.name}
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
