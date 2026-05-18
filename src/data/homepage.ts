import type { CategoryCard, FeaturedBlock, HeroBlock, StoreCard } from "@/lib/types";

const CDN = "https://eu.sandro-paris.com/dw/image/v2/BCMW_PRD/on/demandware.static/-/Library-Sites-Sandro-Shared/default";

export const announcement =
  "MID SEASON SALE — Up to 40% off Spring/Summer for Women and Men until 25/05 midnight";

export const heroes: HeroBlock[] = [
  {
    audience: "women",
    imageUrl: `${CDN}/dwba19d322/Homepage/2026/MSSMAI/HP_MSS_SLIDER-DESK_F.jpg?sw=2000&sh=1053`,
    eyebrow: "Mid Season Sale",
    headline: "Up to 40% off*",
    disclaimer: "*Discount applies to specific marked items",
    ctaLabel: "Shop Women",
    ctaHref: "/midseason-sale/women",
  },
  {
    audience: "men",
    imageUrl: `${CDN}/dwb935b61e/Homepage/2026/MSSMAI/HP_MSS_SLIDER-DESK_H.jpg?sw=2000&sh=1053`,
    eyebrow: "Mid Season Sale",
    headline: "Up to 40% off*",
    disclaimer: "*Discount applies to specific marked items",
    ctaLabel: "Shop Men",
    ctaHref: "/midseason-sale/men",
  },
];

export const categoryCards: CategoryCard[] = [
  {
    title: "Dresses",
    subtitle: "Women",
    href: "/women/dresses",
    imageUrl: `${CDN}/dwb2ce2314/Homepage/2026/MSSMAI/HP_SUMMER_CG_F.jpg?sw=640&sh=917`,
  },
  {
    title: "Cardigans",
    subtitle: "Women",
    href: "/women/sweaters",
    imageUrl: `${CDN}/dw5140d0e6/Homepage/2026/MSSMAI/HP_SUMMER_CG_F2.jpg?sw=640&sh=917`,
  },
  {
    title: "Jackets",
    subtitle: "Men",
    href: "/men/jackets",
    imageUrl: `${CDN}/dwe189f85f/Homepage/2026/MSSMAI/HP_SUMMER_CG_H.jpg?sw=640&sh=917`,
  },
  {
    title: "T-Shirts",
    subtitle: "Men",
    href: "/men/tshirts",
    imageUrl: `${CDN}/dwf499526a/Homepage/2026/MSSMAI/HP_SUMMER_CG_H2.jpg?sw=640&sh=917`,
  },
];

export const featuredBlocks: FeaturedBlock[] = [
  {
    audience: "women",
    eyebrow: "Women",
    headline: "Shoes",
    ctaLabel: "Discover",
    ctaHref: "/women/shoes",
    imageUrl: `${CDN}/dwa813865e/Homepage/2026/MSSMAI/HP_MSS_BLOC-DESK-F.jpg?sw=1280&sh=1346`,
  },
  {
    audience: "men",
    eyebrow: "Men",
    headline: "Bags & Leather Goods",
    ctaLabel: "Discover",
    ctaHref: "/men/leather-goods",
    imageUrl: `${CDN}/dwd022fc54/Homepage/2026/MSSMAI/HP_MSS_BLOC-DESK-H.jpg?sw=1280&sh=1346`,
  },
];

export const stores: StoreCard[] = [
  {
    city: "Champs Élysées",
    address: "91 Avenue des Champs-Élysées, Paris",
    imageUrl: `${CDN}/dw5e471db1/HP/assets/sandro-stores/desk/store_02.jpg?sw=672&sh=840`,
    href: "#",
  },
  {
    city: "Covent Garden",
    address: "35 King Street, London",
    imageUrl: `${CDN}/dwa8705442/HP/assets/sandro-stores/desk/store_03.jpg?sw=672&sh=840`,
    href: "#",
  },
  {
    city: "Bloomingdale's",
    address: "1000 Third Avenue, New York",
    imageUrl: `${CDN}/dw3fe4f895/HP/assets/sandro-stores/desk/store_04.jpg?sw=672&sh=840`,
    href: "#",
  },
  {
    city: "Consell de Cent",
    address: "Calle Consell de Cent 349, Barcelona",
    imageUrl: `${CDN}/dw5e471db1/HP/assets/sandro-stores/desk/store_02.jpg?sw=672&sh=840`,
    href: "#",
  },
];
