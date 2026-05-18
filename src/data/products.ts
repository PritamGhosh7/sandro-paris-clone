import type { Badge, Product, ProductColor, ProductSize } from "@/lib/types";
import { categorySlugForName } from "./categories";
import listingSeed from "./seed/listing.json" with { type: "json" };
import pdpSeed from "./seed/pdp-sample.json" with { type: "json" };

const EUR_TO_PAISE = 95 * 100;

interface SeedListingProduct {
  sku: string;
  slug: string;
  href: string;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  basePriceEUR: number | null;
  salePriceEUR: number | null;
  badges: string[];
  colorSwatches: { name: string; hex: string | null }[];
}

const COLOR_HEX_BY_NAME: Record<string, string> = {
  black: "#1a1a1a",
  ecru: "#efe6d2",
  ivory: "#f1ebdd",
  beige: "#d8c5a6",
  brown: "#5a3825",
  camel: "#b58655",
  navy: "#101a3a",
  blue: "#1c3a7b",
  white: "#ffffff",
  red: "#a01717",
  pink: "#d39db0",
  silver: "#bdbdbd",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  green: "#324d2e",
  yellow: "#dfc04b",
  orange: "#c46a2b",
  purple: "#553b6f",
  denim: "#3c5b87",
  default: "#cccccc",
};

const COMMON_SIZES: ProductSize[] = [
  { label: "0 / XS / 34", stock: "in_stock" },
  { label: "1 / S / 36", stock: "in_stock" },
  { label: "2 / M / 38", stock: "in_stock" },
  { label: "3 / L / 40", stock: "limited" },
  { label: "4 / XL / 42", stock: "in_stock" },
  { label: "5 / XXL / 44", stock: "out" },
];

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((s) => (s.length > 2 ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

function colorFromSwatchName(raw: string): { productName: string; color: string } {
  const parts = raw.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    return { productName: parts[0], color: parts[parts.length - 1] };
  }
  return { productName: raw, color: "" };
}

function hexForColor(name: string): string {
  const key = name.toLowerCase().trim();
  for (const k of Object.keys(COLOR_HEX_BY_NAME)) {
    if (key.includes(k)) return COLOR_HEX_BY_NAME[k];
  }
  return COLOR_HEX_BY_NAME.default;
}

function badgesFromSeed(seed: string[]): Badge[] {
  const out: Badge[] = [];
  for (const b of seed) {
    const k = b.toLowerCase();
    if (k.includes("essentials")) out.push("essentials");
    if (k.includes("new")) out.push("new");
    if (k.includes("rse") || k.includes("sustain")) out.push("rse");
  }
  return Array.from(new Set(out));
}

function eurToPaise(eur: number | null): number {
  return Math.round((eur ?? 0) * EUR_TO_PAISE);
}

function buildProduct(seed: SeedListingProduct, idx: number): Product {
  const swatchName = seed.colorSwatches[0]?.name ?? "";
  const { productName, color } = colorFromSwatchName(swatchName);
  const name = productName || slugToName(seed.slug);
  const categorySlug = categorySlugForName(name);

  const colorName = color || "Ecru";
  const colors: ProductColor[] = [
    {
      name: colorName,
      swatchHex: hexForColor(colorName),
      imageUrl: seed.imageUrl ?? undefined,
    },
  ];

  const badges = badgesFromSeed(seed.badges);
  if (
    seed.basePriceEUR &&
    seed.salePriceEUR &&
    seed.salePriceEUR < seed.basePriceEUR
  ) {
    badges.push("sale");
  }

  const base = seed.basePriceEUR ?? seed.salePriceEUR ?? 0;
  const sale = seed.salePriceEUR ?? seed.basePriceEUR ?? 0;

  return {
    id: `p_${idx + 1}`,
    sku: seed.sku,
    slug: seed.slug,
    name,
    gender: "women",
    categorySlug,
    basePricePaise: eurToPaise(base),
    salePricePaise: eurToPaise(sale),
    primaryImage: seed.imageUrl ?? "",
    hoverImage: seed.hoverImageUrl ?? seed.imageUrl ?? "",
    gallery: [seed.imageUrl, seed.hoverImageUrl].filter((u): u is string => !!u),
    colors,
    sizes: COMMON_SIZES,
    badges,
    description: `${name} — part of Sandro's Spring/Summer collection.`,
    bullets: [],
    composition: [],
    careInstructions: [],
    modelNote: "The model is 179 cm / 5'9 and wears a size 36 FR.",
    isSustainable: badges.includes("rse"),
  };
}

export const products: Product[] = (listingSeed.products as SeedListingProduct[])
  .filter((p) => p.imageUrl && p.salePriceEUR)
  .map(buildProduct);

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getProductsByGender(gender: "women" | "men"): Product[] {
  return products.filter((p) => p.gender === gender);
}

export function getSaleProducts(gender?: "women" | "men"): Product[] {
  return products.filter(
    (p) => p.salePricePaise < p.basePricePaise && (!gender || p.gender === gender),
  );
}

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// Hydrate a single product with PDP-level detail (gallery, bullets, composition, etc.)
// Used for the SAMPLE PDP route; falls back to listing-derived data for others.
export function hydratePdp(product: Product): Product {
  if (product.sku !== pdpSeed.sku) return product;

  const galleryFromSeed = (pdpSeed.images as string[]).filter(Boolean);
  const seenBaseUrl = new Set<string>();
  const gallery = galleryFromSeed.filter((url) => {
    const base = url.split("?")[0];
    if (seenBaseUrl.has(base)) return false;
    seenBaseUrl.add(base);
    return true;
  });

  return {
    ...product,
    name: pdpSeed.name || product.name,
    gallery: gallery.length ? gallery : product.gallery,
    description:
      pdpSeed.description?.replace(/DESCRIPTION.*?(\.svg-wrapper.*?})/g, "").trim() ||
      product.description,
    bullets: pdpSeed.bullets ?? product.bullets,
    composition: product.composition,
    careInstructions: product.careInstructions,
    modelNote: pdpSeed.modelNote || product.modelNote,
    isSustainable: true,
    sizes: COMMON_SIZES,
  };
}
