import { HeroSplit } from "@/components/home/hero-split";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedBlocks } from "@/components/home/featured-blocks";
import { StoreSpotlight } from "@/components/home/store-spotlight";
import {
  heroes,
  categoryCards,
  featuredBlocks,
  stores,
} from "@/data/homepage";

export default function HomePage() {
  return (
    <>
      <HeroSplit heroes={heroes} />
      <CategoryGrid cards={categoryCards} />
      <FeaturedBlocks blocks={featuredBlocks} />
      <StoreSpotlight stores={stores} />
    </>
  );
}
