// Seed Supabase with scraped Sandro data.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
//        node --experimental-strip-types scripts/seed-supabase.ts

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const EUR_TO_PAISE = 95 * 100;

const CATEGORIES_W = [
  { slug: "dresses", name: "Dresses" },
  { slug: "tops", name: "Tops & Shirts" },
  { slug: "sweaters", name: "Sweaters & Cardigans" },
  { slug: "blazers", name: "Blazers & Jackets" },
  { slug: "coats", name: "Coats" },
  { slug: "pants", name: "Pants & Jeans" },
  { slug: "skirts", name: "Skirts & Shorts" },
  { slug: "leather", name: "Leather Jackets" },
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "bags", name: "Bags" },
  { slug: "shoes", name: "Shoes" },
  { slug: "accessories", name: "Accessories" },
];

const SLUG_TO_KEYWORDS: Record<string, string[]> = {
  dresses: ["dress", "robe"],
  tops: ["top", "blouse", "shirt"],
  sweaters: ["cardigan", "sweater", "knit", "jumper"],
  blazers: ["blazer", "jacket"],
  coats: ["coat", "manteau"],
  pants: ["pant", "trouser", "jean"],
  skirts: ["skirt", "short"],
  leather: ["leather jacket"],
  tshirts: ["t-shirt", "tshirt", "tee"],
  bags: ["bag", "tote", "clutch"],
  shoes: ["shoe", "boot", "sandal", "sneaker", "mule"],
  accessories: ["scarf", "belt", "hat"],
};

function classifyCategory(name: string): string {
  const n = name.toLowerCase();
  for (const [slug, kws] of Object.entries(SLUG_TO_KEYWORDS)) {
    if (kws.some((k) => n.includes(k))) return slug;
  }
  return "dresses";
}

const HEX: Record<string, string> = {
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
};

function hexFor(colorName: string): string {
  const k = colorName.toLowerCase();
  for (const c of Object.keys(HEX)) {
    if (k.includes(c)) return HEX[c];
  }
  return "#cccccc";
}

interface SeedListingProduct {
  sku: string;
  slug: string;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  basePriceEUR: number | null;
  salePriceEUR: number | null;
  badges: string[];
  colorSwatches: { name: string; hex: string | null }[];
}

interface SeedPdp {
  sku: string;
  name: string;
  description: string;
  images: string[];
  modelNote: string;
  bullets: string[];
}

const COMMON_SIZES = [
  { label: "0 / XS / 34", stock_status: "in_stock" },
  { label: "1 / S / 36", stock_status: "in_stock" },
  { label: "2 / M / 38", stock_status: "in_stock" },
  { label: "3 / L / 40", stock_status: "limited" },
  { label: "4 / XL / 42", stock_status: "in_stock" },
  { label: "5 / XXL / 44", stock_status: "out" },
];

async function main() {
  console.log("🌱 Seeding Supabase...");

  // ---- Wipe existing rows in correct order (FK-aware) ----
  console.log("→ Wiping existing rows");
  for (const tbl of [
    "product_sizes",
    "product_colors",
    "product_images",
    "products",
    "categories",
  ]) {
    const { error } = await sb.from(tbl).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.warn(`  ! ${tbl}: ${error.message}`);
  }

  // ---- Categories ----
  console.log("→ Categories");
  const catRows = CATEGORIES_W.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    gender: "women",
    position: i,
  }));
  const { error: catErr } = await sb.from("categories").insert(catRows);
  if (catErr) throw catErr;
  console.log(`  ✓ ${catRows.length} categories`);

  // ---- Products + Images + Colors + Sizes ----
  const listingRaw = JSON.parse(await readFile("src/data/seed/listing.json", "utf-8"));
  const pdpRaw: SeedPdp = JSON.parse(await readFile("src/data/seed/pdp-sample.json", "utf-8"));
  const seedProducts = (listingRaw.products as SeedListingProduct[]).filter(
    (p) => p.imageUrl && p.salePriceEUR,
  );

  console.log(`→ ${seedProducts.length} products`);
  let productsInserted = 0;

  for (const sp of seedProducts) {
    const swatchName = sp.colorSwatches[0]?.name ?? "";
    const parts = swatchName.split(",").map((s) => s.trim());
    const productName = parts[0] || sp.slug.replace(/-/g, " ");
    const colorName = parts.length > 1 ? parts[parts.length - 1] : "Ecru";
    const categorySlug = classifyCategory(productName);

    const base = sp.basePriceEUR ?? sp.salePriceEUR ?? 0;
    const sale = sp.salePriceEUR ?? base;

    const badges: string[] = sp.badges
      .map((b) => b.toLowerCase())
      .filter((b) => /essentials|new|rse|sustain/.test(b))
      .map((b) => (b.includes("rse") || b.includes("sustain") ? "rse" : b));
    if (sale < base) badges.push("sale");

    const isSample = sp.sku === pdpRaw.sku;
    const galleryFromPdp = isSample
      ? Array.from(new Set((pdpRaw.images ?? []).filter(Boolean).map((u) => u.split("?")[0])))
      : [];
    const gallery = galleryFromPdp.length
      ? galleryFromPdp
      : [sp.imageUrl, sp.hoverImageUrl].filter((u): u is string => !!u);

    // Insert product
    const { data: product, error: pErr } = await sb
      .from("products")
      .insert({
        sku: sp.sku,
        slug: sp.slug,
        name: productName,
        description: isSample
          ? pdpRaw.description?.replace(/DESCRIPTION.*?\}/g, "").trim().slice(0, 800) ||
            `${productName} — part of Sandro's collection.`
          : `${productName} — part of Sandro's Spring/Summer collection.`,
        gender: "women",
        category_slug: categorySlug,
        base_price_paise: Math.round(base * EUR_TO_PAISE),
        sale_price_paise: Math.round(sale * EUR_TO_PAISE),
        currency: "INR",
        composition: [],
        care: [],
        model_note: isSample
          ? pdpRaw.modelNote || "The model is 179 cm and wears a size 36 FR."
          : "The model is 179 cm and wears a size 36 FR.",
        badges: Array.from(new Set(badges)),
        is_sustainable: badges.includes("rse"),
      })
      .select("id")
      .single();

    if (pErr) {
      console.warn(`  ! product ${sp.sku}: ${pErr.message}`);
      continue;
    }
    if (!product) continue;
    const productId = product.id;

    // Images
    if (gallery.length) {
      await sb.from("product_images").insert(
        gallery.map((url, position) => ({
          product_id: productId,
          cdn_url: url,
          position,
          alt: productName,
        })),
      );
    }

    // Colors
    await sb.from("product_colors").insert({
      product_id: productId,
      name: colorName,
      swatch_hex: hexFor(colorName),
      primary_image_url: sp.imageUrl,
    });

    // Sizes
    await sb.from("product_sizes").insert(
      COMMON_SIZES.map((s, position) => ({
        product_id: productId,
        label: s.label,
        stock_status: s.stock_status,
        position,
      })),
    );

    productsInserted++;
  }

  console.log(`  ✓ ${productsInserted} products inserted`);

  const { count: cnt } = await sb.from("products").select("*", { count: "exact", head: true });
  console.log(`📊 Total products in DB: ${cnt}`);
  console.log("✅ Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
