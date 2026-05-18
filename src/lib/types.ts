export type Gender = "women" | "men";

export type StockStatus = "in_stock" | "limited" | "out";

export type Badge = "rse" | "essentials" | "new" | "sale" | "limited";

export interface Category {
  slug: string;
  name: string;
  gender: Gender;
  group?: "ready-to-wear" | "bags" | "shoes" | "accessories" | "sale";
}

export interface ProductColor {
  name: string;
  swatchHex: string;
  imageUrl?: string;
}

export interface ProductSize {
  label: string;
  stock: StockStatus;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  gender: Gender;
  categorySlug: string;
  basePricePaise: number;
  salePricePaise: number;
  primaryImage: string;
  hoverImage: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  badges: Badge[];
  description: string;
  bullets: string[];
  composition: { material: string; pct: number }[];
  careInstructions: string[];
  modelNote: string;
  isSustainable: boolean;
}

export interface HeroBlock {
  audience: Gender;
  imageUrl: string;
  eyebrow: string;
  headline: string;
  disclaimer: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface CategoryCard {
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
}

export interface FeaturedBlock {
  audience: Gender;
  eyebrow: string;
  headline: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
}

export interface StoreCard {
  city: string;
  address: string;
  imageUrl: string;
  href: string;
}
