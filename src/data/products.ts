import { cache } from "react";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  Badge,
  Gender,
  Product,
  ProductColor,
  ProductSize,
  StockStatus,
} from "@/lib/types";

interface ProductRow {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  gender: Gender;
  category_slug: string;
  base_price_paise: number;
  sale_price_paise: number;
  badges: string[] | null;
  model_note: string | null;
  is_sustainable: boolean;
  product_images: { cdn_url: string; position: number; alt: string | null }[];
  product_colors: { name: string; swatch_hex: string; primary_image_url: string | null }[];
  product_sizes: { label: string; stock_status: StockStatus; position: number }[];
}

const SELECT =
  "id, sku, slug, name, description, gender, category_slug, base_price_paise, sale_price_paise, badges, model_note, is_sustainable, product_images(cdn_url, position, alt), product_colors(name, swatch_hex, primary_image_url), product_sizes(label, stock_status, position)";

function rowToProduct(r: ProductRow): Product {
  const sortedImages = [...r.product_images].sort((a, b) => a.position - b.position);
  const sortedSizes = [...r.product_sizes].sort((a, b) => a.position - b.position);
  const colors: ProductColor[] = r.product_colors.map((c) => ({
    name: c.name,
    swatchHex: c.swatch_hex,
    imageUrl: c.primary_image_url ?? undefined,
  }));
  const sizes: ProductSize[] = sortedSizes.map((s) => ({
    label: s.label,
    stock: s.stock_status,
  }));
  return {
    id: r.id,
    sku: r.sku,
    slug: r.slug,
    name: r.name,
    gender: r.gender,
    categorySlug: r.category_slug,
    basePricePaise: r.base_price_paise,
    salePricePaise: r.sale_price_paise,
    primaryImage: sortedImages[0]?.cdn_url ?? "",
    hoverImage: sortedImages[1]?.cdn_url ?? sortedImages[0]?.cdn_url ?? "",
    gallery: sortedImages.map((i) => i.cdn_url),
    colors,
    sizes,
    badges: (r.badges ?? []) as Badge[],
    description: r.description ?? "",
    bullets: [],
    composition: [],
    careInstructions: [],
    modelNote: r.model_note ?? "",
    isSustainable: r.is_sustainable,
  };
}

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const sb = getSupabaseServer();
  if (!sb) return [];
  const { data, error } = await sb.from("products").select(SELECT);
  if (error) {
    console.error("getAllProducts:", error);
    return [];
  }
  return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
});

export const getProductsByCategory = cache(
  async (slug: string): Promise<Product[]> => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const { data, error } = await sb
      .from("products")
      .select(SELECT)
      .eq("category_slug", slug);
    if (error) {
      console.error("getProductsByCategory:", error);
      return [];
    }
    return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
  },
);

export const getProductsByGender = cache(
  async (gender: Gender): Promise<Product[]> => {
    const sb = getSupabaseServer();
    if (!sb) return [];
    const { data, error } = await sb
      .from("products")
      .select(SELECT)
      .eq("gender", gender);
    if (error) {
      console.error("getProductsByGender:", error);
      return [];
    }
    return ((data ?? []) as unknown as ProductRow[]).map(rowToProduct);
  },
);

export const getSaleProducts = cache(
  async (gender?: Gender): Promise<Product[]> => {
    const all = await getAllProducts();
    return all.filter(
      (p) =>
        p.salePricePaise < p.basePricePaise &&
        (!gender || p.gender === gender),
    );
  },
);

export const getProductBySku = cache(
  async (sku: string): Promise<Product | null> => {
    const sb = getSupabaseServer();
    if (!sb) return null;
    const { data, error } = await sb
      .from("products")
      .select(SELECT)
      .eq("sku", sku)
      .maybeSingle();
    if (error) {
      console.error("getProductBySku:", error);
      return null;
    }
    if (!data) return null;
    return rowToProduct(data as unknown as ProductRow);
  },
);
