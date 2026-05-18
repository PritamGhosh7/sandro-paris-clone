import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getProductBySku,
  hydratePdp,
  products as allProducts,
} from "@/data/products";
import { PdpGallery } from "@/components/pdp/pdp-gallery";
import { PdpInfoPanel } from "@/components/pdp/pdp-info-panel";
import { PdpAccordions } from "@/components/pdp/pdp-accordions";
import { RecommendationsRow } from "@/components/pdp/recommendations-row";
import { TrustBadges } from "@/components/pdp/trust-badges";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; sku: string }>;
}) {
  const { slug, sku } = await params;
  const raw = getProductBySku(sku);
  if (!raw || raw.slug !== slug) notFound();
  const product = hydratePdp(raw);

  const recommendations = allProducts
    .filter(
      (p) => p.sku !== product.sku && p.categorySlug === product.categorySlug,
    )
    .slice(0, 4);

  const recently = allProducts
    .filter((p) => p.sku !== product.sku)
    .slice(0, 4);

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-6">
        <nav className="flex items-center text-xs text-[color:var(--color-ink-muted)] gap-1.5 mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${product.gender}`} className="hover:underline capitalize">
            {product.gender}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/${product.gender}/${product.categorySlug}`}
            className="hover:underline"
          >
            Ready-to-wear
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[color:var(--color-ink)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
          <PdpGallery images={product.gallery} productName={product.name} />
          <PdpInfoPanel product={product} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 mt-12">
          <div className="max-w-2xl">
            <PdpAccordions product={product} />
          </div>
          <div />
        </div>

        <RecommendationsRow
          heading="You may also like"
          subheading="Similar style"
          products={recommendations}
        />
        <RecommendationsRow heading="Recently viewed" products={recently} />
      </div>

      <TrustBadges />
    </>
  );
}
