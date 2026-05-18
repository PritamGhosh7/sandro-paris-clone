import type { Category } from "@/lib/types";

export const categories: Category[] = [
  // Women — ready-to-wear
  { slug: "dresses", name: "Dresses", gender: "women", group: "ready-to-wear" },
  { slug: "tops", name: "Tops & Shirts", gender: "women", group: "ready-to-wear" },
  { slug: "sweaters", name: "Sweaters & Cardigans", gender: "women", group: "ready-to-wear" },
  { slug: "blazers", name: "Blazers & Jackets", gender: "women", group: "ready-to-wear" },
  { slug: "coats", name: "Coats", gender: "women", group: "ready-to-wear" },
  { slug: "pants", name: "Pants & Jeans", gender: "women", group: "ready-to-wear" },
  { slug: "skirts", name: "Skirts & Shorts", gender: "women", group: "ready-to-wear" },
  { slug: "leather", name: "Leather Jackets", gender: "women", group: "ready-to-wear" },
  { slug: "tshirts", name: "T-Shirts", gender: "women", group: "ready-to-wear" },
  { slug: "bags", name: "Bags", gender: "women", group: "bags" },
  { slug: "shoes", name: "Shoes", gender: "women", group: "shoes" },
  { slug: "accessories", name: "Accessories", gender: "women", group: "accessories" },

  // Men
  { slug: "jackets", name: "Jackets", gender: "men", group: "ready-to-wear" },
  { slug: "tshirts", name: "T-Shirts", gender: "men", group: "ready-to-wear" },
  { slug: "coats", name: "Coats", gender: "men", group: "ready-to-wear" },
  { slug: "suits", name: "Suits & Tuxedos", gender: "men", group: "ready-to-wear" },
  { slug: "shirts", name: "Shirts", gender: "men", group: "ready-to-wear" },
  { slug: "pants", name: "Pants", gender: "men", group: "ready-to-wear" },
  { slug: "leather-goods", name: "Leather Goods", gender: "men", group: "bags" },
  { slug: "shoes", name: "Shoes", gender: "men", group: "shoes" },
];

const SLUG_TO_KEYWORDS: Record<string, string[]> = {
  dresses: ["dress", "robe"],
  tops: ["top", "blouse", "shirt"],
  sweaters: ["cardigan", "sweater", "knit", "jumper", "pull"],
  blazers: ["blazer", "jacket"],
  coats: ["coat", "manteau"],
  pants: ["pant", "trouser", "jean"],
  skirts: ["skirt", "short"],
  leather: ["leather jacket"],
  tshirts: ["t-shirt", "tshirt", "tee"],
  bags: ["bag", "tote", "clutch"],
  shoes: ["shoe", "boot", "sandal", "sneaker", "mule"],
  accessories: ["scarf", "belt", "hat", "jewelry", "earring", "necklace"],
  jackets: ["jacket", "blazer"],
  suits: ["suit", "tuxedo"],
  shirts: ["shirt"],
  "leather-goods": ["wallet", "card holder", "belt"],
};

export function categorySlugForName(name: string): string {
  const lower = name.toLowerCase();
  for (const [slug, keywords] of Object.entries(SLUG_TO_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return slug;
  }
  return "ready-to-wear";
}
