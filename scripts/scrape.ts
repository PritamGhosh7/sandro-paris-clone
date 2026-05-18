import { chromium, type Browser, type Page } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const OUT_DIR = "src/data/seed";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36";

const HOME = "https://eu.sandro-paris.com/";
const LISTING = "https://eu.sandro-paris.com/en/midseason-sale-re/woman/";
const PDP_SAMPLE =
  "https://eu.sandro-paris.com/en/p/short-guipure-dress/SFPRO04842_11.html";

const EUR_TO_INR = 95;

type Hero = {
  audience: string;
  imageUrl: string | null;
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
};

type CategoryCard = {
  title: string;
  href: string;
  imageUrl: string | null;
};

type StoreCard = {
  city: string;
  address: string;
  imageUrl: string | null;
  href: string;
};

type Homepage = {
  announcement: string;
  heroes: Hero[];
  categoryCards: CategoryCard[];
  featuredBlocks: CategoryCard[];
  stores: StoreCard[];
};

type ProductListing = {
  sku: string;
  slug: string;
  name: string;
  href: string;
  imageUrl: string | null;
  hoverImageUrl: string | null;
  basePriceEUR: number | null;
  salePriceEUR: number | null;
  badges: string[];
  colorSwatches: { name: string; hex: string | null }[];
};

type ProductDetail = {
  sku: string;
  slug: string;
  name: string;
  breadcrumb: string[];
  basePriceEUR: number | null;
  salePriceEUR: number | null;
  colorName: string;
  description: string;
  bullets: string[];
  composition: string;
  care: string;
  modelNote: string;
  sizes: { label: string; stock: "in_stock" | "limited" | "out" }[];
  images: string[];
  recommendations: { name: string; href: string; imageUrl: string | null; priceEUR: number | null }[];
};

async function withBrowser<T>(fn: (b: Browser) => Promise<T>): Promise<T> {
  const browser = await chromium.launch({ headless: true });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

async function newPage(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({
    userAgent: UA,
    viewport: { width: 1440, height: 900 },
    locale: "en-GB",
  });
  // Suppress cookie banners / modals
  const page = await ctx.newPage();
  page.setDefaultTimeout(30_000);
  return page;
}

async function acceptCookies(page: Page) {
  for (const selector of [
    "#onetrust-accept-btn-handler",
    "button:has-text('Accept all')",
    "button:has-text('I accept')",
    "[aria-label='Close']",
  ]) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1500 })) {
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(400);
      }
    } catch {
      // ignore
    }
  }
}

async function scrapeHomepage(page: Page): Promise<Homepage> {
  await page.goto(HOME, { waitUntil: "domcontentloaded" });
  await acceptCookies(page);
  await page.waitForTimeout(800);

  return await page.evaluate(() => {
    const text = (el: Element | null) => (el?.textContent ?? "").trim().replace(/\s+/g, " ");
    const attr = (el: Element | null, name: string) => el?.getAttribute(name) ?? null;
    const firstImage = (el: Element | null) => {
      if (!el) return null;
      const img = el.querySelector("img");
      if (!img) return null;
      const srcset = img.getAttribute("srcset");
      if (srcset) {
        const last = srcset.split(",").pop()?.trim().split(" ")[0];
        if (last) return last;
      }
      return img.getAttribute("src");
    };

    const heroes: Hero[] = [];
    document.querySelectorAll(".experience-component, .hero, [class*='hero']").forEach((node) => {
      const img = firstImage(node);
      const headlineEl = node.querySelector("h1, h2, .title, [class*='title']");
      const ctaEl = node.querySelector("a");
      if (!img || !headlineEl || !ctaEl) return;
      heroes.push({
        audience: text(node.querySelector("[class*='audience']")) || (heroes.length === 0 ? "Women" : "Men"),
        imageUrl: img,
        headline: text(headlineEl),
        subline: text(node.querySelector("p, .subtitle, [class*='subtitle']")),
        ctaLabel: text(ctaEl),
        ctaHref: ctaEl.getAttribute("href") ?? "#",
      });
    });

    const categoryCards: CategoryCard[] = [];
    document
      .querySelectorAll(".experience-assets-categoryCard, [class*='category-card'], [class*='CategoryCard']")
      .forEach((node) => {
        const a = node.querySelector("a");
        const img = firstImage(node);
        if (!a || !img) return;
        categoryCards.push({
          title: text(node.querySelector("h2, h3, .title")) || text(a),
          href: a.getAttribute("href") ?? "#",
          imageUrl: img,
        });
      });

    const stores: StoreCard[] = [];
    document.querySelectorAll("[class*='store-card'], [class*='storeCard']").forEach((node) => {
      const a = node.querySelector("a");
      const img = firstImage(node);
      stores.push({
        city: text(node.querySelector("h3, h4, .title")),
        address: text(node.querySelector("p, .address")),
        imageUrl: img,
        href: a?.getAttribute("href") ?? "#",
      });
    });

    const announcement =
      text(document.querySelector(".header-promo, [class*='announcement'], [class*='top-banner']")) ||
      "Mid Season Sale — Up to 40% off Spring/Summer until 25/05 midnight";

    return {
      announcement,
      heroes,
      categoryCards,
      featuredBlocks: [],
      stores,
    } satisfies Homepage;

    type Hero = typeof heroes[number];
    type CategoryCard = typeof categoryCards[number];
    type StoreCard = typeof stores[number];
  });
}

async function scrapeListing(page: Page): Promise<{ title: string; count: number; products: ProductListing[] }> {
  await page.goto(LISTING, { waitUntil: "domcontentloaded" });
  await acceptCookies(page);
  await page.waitForSelector("[data-pid], .product-tile", { timeout: 20_000 });
  await page.waitForTimeout(1200);

  const data = await page.evaluate(() => {
    const text = (el: Element | null) => (el?.textContent ?? "").trim().replace(/\s+/g, " ");
    const firstImage = (el: Element | null) => {
      if (!el) return null;
      const img = el.querySelector("img");
      if (!img) return null;
      const srcset = img.getAttribute("srcset");
      if (srcset) return srcset.split(",")[0].trim().split(" ")[0];
      return img.getAttribute("src");
    };

    const parsePrice = (s: string | null | undefined): number | null => {
      if (!s) return null;
      const m = s.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)/);
      if (!m) return null;
      return parseFloat(m[1].replace(",", "."));
    };

    const tiles = Array.from(document.querySelectorAll("[data-pid], .product-tile"));
    const seen = new Set<string>();
    const products: ProductListing[] = [];

    for (const tile of tiles) {
      const sku = tile.getAttribute("data-pid") || "";
      if (!sku || seen.has(sku)) continue;
      seen.add(sku);

      const link = tile.querySelector("a.tile-link, a.image-container, .image-container a, a[href*='/p/']") as HTMLAnchorElement | null;
      const nameEl = tile.querySelector(".product-name, .product-title, [class*='product-name'], .pdp-link a, .name a");
      const imgs = tile.querySelectorAll("img");
      const baseImg = imgs[0]?.getAttribute("srcset")?.split(",")[0].trim().split(" ")[0] || imgs[0]?.getAttribute("src") || null;
      const hoverImg = imgs[1]?.getAttribute("srcset")?.split(",")[0].trim().split(" ")[0] || imgs[1]?.getAttribute("src") || null;

      const priceContainer = tile.querySelector(".prices, .price, [class*='price']");
      const saleEl = priceContainer?.querySelector(".sales, .price-sales, .sale-price, .reduced");
      const baseEl = priceContainer?.querySelector(".strike-through, .original, .list, .price-standard");

      const colorEls = tile.querySelectorAll(".swatch, .color-swatch, [class*='swatch']");
      const swatches: { name: string; hex: string | null }[] = [];
      colorEls.forEach((c) => {
        const style = (c as HTMLElement).getAttribute("style") || "";
        const hex = style.match(/#([0-9a-fA-F]{6})/)?.[0] ?? null;
        const bg = style.match(/background(?:-color)?\s*:\s*([^;]+)/)?.[1] ?? null;
        const name = c.getAttribute("aria-label") || c.getAttribute("data-color") || "";
        if (name || hex || bg) swatches.push({ name, hex: hex ?? bg });
      });

      const badges: string[] = [];
      tile.querySelectorAll(".badge, [class*='badge'], .product-tile__badge").forEach((b) => {
        const t = text(b);
        if (t) badges.push(t.toLowerCase());
      });

      const href = link?.getAttribute("href") ?? "#";
      const slug = href.split("/p/")[1]?.split("/")[0] ?? sku.toLowerCase();

      products.push({
        sku,
        slug,
        name: text(nameEl) || "",
        href: href.startsWith("http") ? href : `https://eu.sandro-paris.com${href}`,
        imageUrl: baseImg,
        hoverImageUrl: hoverImg,
        basePriceEUR: parsePrice(text(baseEl) || ""),
        salePriceEUR: parsePrice(text(saleEl) || text(priceContainer)),
        badges,
        colorSwatches: swatches,
      });
    }

    const title = text(document.querySelector("h1, .page-title")) || "Mid Season Sale";
    const countMatch = (document.body.textContent || "").match(/\((\d+)\)\s*products?/i);
    return { title, count: countMatch ? parseInt(countMatch[1], 10) : products.length, products };
  });

  return data;
}

async function scrapePdp(page: Page, url: string): Promise<ProductDetail> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await acceptCookies(page);
  await page.waitForTimeout(800);

  return await page.evaluate((pdpUrl) => {
    const text = (el: Element | null) => (el?.textContent ?? "").trim().replace(/\s+/g, " ");
    const parsePrice = (s: string | null | undefined): number | null => {
      if (!s) return null;
      const m = s.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)/);
      return m ? parseFloat(m[1].replace(",", ".")) : null;
    };

    const sku = pdpUrl.match(/\/([A-Z0-9_]+)\.html/)?.[1] ?? "";
    const slug = pdpUrl.match(/\/p\/([^/]+)\//)?.[1] ?? "";

    const name = text(document.querySelector("h1, .product-name"));
    const breadcrumbItems = Array.from(document.querySelectorAll(".breadcrumb a, .breadcrumb li")).map((el) => text(el));
    const saleEl = document.querySelector(".prices .sales, .sale-price, .price .reduced");
    const baseEl = document.querySelector(".prices .list, .strike-through, .price-standard");
    const colorName = text(document.querySelector(".color-name, .selected-color, [class*='color-display']")) || "Ecru";
    const description = text(document.querySelector(".product-description, .pdp-description, [class*='description']"));
    const bullets = Array.from(document.querySelectorAll(".product-description li, .pdp-description li")).map(text).filter(Boolean);
    const composition = text(document.querySelector("[class*='composition'], [class*='Composition']"));
    const care = text(document.querySelector("[class*='care'], [class*='Care']"));
    const modelNote = text(document.querySelector("[class*='model-info'], [class*='ModelInfo']")) || "The model is 179 cm / 5'9 tall and wears a size 36 FR";

    const sizeEls = Array.from(document.querySelectorAll(".size-select option, .size-button, [class*='size-attribute'] button"));
    const sizes = sizeEls
      .map((el) => {
        const t = text(el);
        if (!t || t.toLowerCase().includes("select")) return null;
        const disabled = el.hasAttribute("disabled") || (el as HTMLElement).className.includes("disabled");
        const limited = (el as HTMLElement).className.toLowerCase().includes("limited") || t.toLowerCase().includes("limited");
        return { label: t.replace(/\s*\(.+\)$/, ""), stock: disabled ? ("out" as const) : limited ? ("limited" as const) : ("in_stock" as const) };
      })
      .filter((x): x is { label: string; stock: "in_stock" | "limited" | "out" } => x !== null);

    const galleryImgs = Array.from(document.querySelectorAll(".primary-images img, .product-images img, .pdp-gallery img"))
      .map((img) => {
        const srcset = img.getAttribute("srcset");
        if (srcset) return srcset.split(",").pop()?.trim().split(" ")[0] ?? img.getAttribute("src");
        return img.getAttribute("src");
      })
      .filter((u): u is string => !!u && u.includes("hi-res"));

    const recs = Array.from(document.querySelectorAll(".recommendations .product-tile, [class*='recommend'] .product-tile")).slice(0, 6).map((tile) => {
      const a = tile.querySelector("a") as HTMLAnchorElement | null;
      const img = tile.querySelector("img");
      const src = img?.getAttribute("srcset")?.split(",")[0].trim().split(" ")[0] || img?.getAttribute("src") || null;
      return {
        name: text(tile.querySelector(".product-name, .product-title, .pdp-link a")),
        href: a?.getAttribute("href") ?? "#",
        imageUrl: src,
        priceEUR: parsePrice(text(tile.querySelector(".sales, .price"))),
      };
    });

    return {
      sku,
      slug,
      name,
      breadcrumb: breadcrumbItems,
      basePriceEUR: parsePrice(text(baseEl)),
      salePriceEUR: parsePrice(text(saleEl)),
      colorName,
      description,
      bullets,
      composition,
      care,
      modelNote,
      sizes,
      images: galleryImgs,
      recommendations: recs,
    } satisfies ProductDetail;
  }, url);
}

async function writeJson(file: string, data: unknown) {
  const path = `${OUT_DIR}/${file}`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2));
  console.log(`✓ wrote ${path}`);
}

async function main() {
  console.log("🚀 Sandro scraper starting...");
  await withBrowser(async (browser) => {
    const page = await newPage(browser);

    console.log("→ Homepage");
    const home = await scrapeHomepage(page);
    await writeJson("homepage.json", home);

    console.log("→ Listing (women midseason)");
    const listing = await scrapeListing(page);
    console.log(`   ${listing.products.length} products`);
    await writeJson("listing.json", listing);

    console.log("→ PDP (guipure dress)");
    const pdp = await scrapePdp(page, PDP_SAMPLE);
    await writeJson("pdp-sample.json", pdp);

    console.log(`💱 1 EUR ≈ ₹${EUR_TO_INR}`);
    console.log("✅ done");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
