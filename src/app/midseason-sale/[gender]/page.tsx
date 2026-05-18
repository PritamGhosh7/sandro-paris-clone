import { notFound } from "next/navigation";
import { FacetSidebar } from "@/components/listing/facet-sidebar";
import { ListingHeader } from "@/components/listing/listing-header";
import { ProductGrid } from "@/components/listing/product-grid";
import { getSaleProducts } from "@/data/products";

const VALID = ["women", "men"] as const;
type Gender = (typeof VALID)[number];

export default async function MidseasonSalePage({
  params,
}: {
  params: Promise<{ gender: string }>;
}) {
  const { gender } = await params;
  if (!VALID.includes(gender as Gender)) notFound();
  const g = gender as Gender;

  const products = getSaleProducts(g);
  const title = `Mid Season Sale — ${g === "women" ? "Women" : "Men"}`;

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-8">
      <ListingHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: g === "women" ? "Women" : "Men", href: `/${g}` },
          { label: "Mid Season Sale" },
        ]}
        title={title}
        count={products.length}
        announcement="MID SEASON SALE — Up to 40% off the Spring/Summer collection until 25/05 midnight"
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
