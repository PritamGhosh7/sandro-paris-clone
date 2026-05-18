"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";

const PRIMARY_LINKS = [
  { label: "Women", href: "/women", gender: "women" as const },
  { label: "Men", href: "/men", gender: "men" as const },
  { label: "Sandro's World", href: "#", gender: null },
  { label: "Second Hand", href: "#", gender: null },
  { label: "Stores", href: "#", gender: null },
];

export function TopNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-[color:var(--color-line)]">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-6">
        <button
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav
          className="hidden lg:flex items-center gap-7"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {PRIMARY_LINKS.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(link.gender ? link.label : null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "nav-link py-5 inline-block border-b-2 border-transparent",
                  openMenu === link.label && "border-[color:var(--color-ink)]",
                )}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        <Link
          href="/"
          aria-label="Sandro Paris home"
          className="absolute left-1/2 -translate-x-1/2 select-none"
        >
          <span className="font-display text-2xl tracking-[0.4em] uppercase">
            Sandro
          </span>
        </Link>

        <div className="flex items-center gap-4 ml-auto">
          <button aria-label="Search" type="button" className="p-1">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <Link href="#" aria-label="Account" className="p-1 hidden sm:inline-flex">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="Wishlist" className="p-1 hidden sm:inline-flex">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="Shopping bag" className="p-1 relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 text-[10px] bg-[color:var(--color-ink)] text-[color:var(--color-paper)] rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>

      {openMenu &&
        ["Women", "Men"].includes(openMenu) && (
          <MegaMenu
            gender={openMenu === "Women" ? "women" : "men"}
            onClose={() => setOpenMenu(null)}
          />
        )}
    </header>
  );
}

function MegaMenu({
  gender,
  onClose,
}: {
  gender: "women" | "men";
  onClose: () => void;
}) {
  const rtw = categories.filter(
    (c) => c.gender === gender && c.group === "ready-to-wear",
  );
  const bags = categories.filter((c) => c.gender === gender && c.group === "bags");
  const shoes = categories.filter((c) => c.gender === gender && c.group === "shoes");
  const accessories = categories.filter(
    (c) => c.gender === gender && c.group === "accessories",
  );

  return (
    <div
      className="absolute top-full left-0 right-0 bg-paper border-t border-[color:var(--color-line)] shadow-lg"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1600px] mx-auto px-8 py-10 grid grid-cols-12 gap-8">
        <div className="col-span-2">
          <p className="nav-link mb-4 text-[color:var(--color-ink-muted)]">Highlights</p>
          <ul className="space-y-2">
            <li>
              <Link
                href={`/midseason-sale/${gender}`}
                className="text-sm hover:underline"
              >
                Mid Season Sale
              </Link>
            </li>
            <li>
              <Link href={`/${gender}`} className="text-sm hover:underline">
                SS26 Collection
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline">
                Second Hand
              </Link>
            </li>
          </ul>
        </div>
        <NavColumn title="Ready-to-wear" items={rtw} />
        <NavColumn title="Bags" items={bags} />
        <NavColumn title="Shoes" items={shoes} />
        <NavColumn title="Accessories" items={accessories} />
      </div>
    </div>
  );
}

function NavColumn({
  title,
  items,
}: {
  title: string;
  items: { slug: string; name: string; gender: "women" | "men" }[];
}) {
  if (items.length === 0) return <div className="col-span-2" />;
  return (
    <div className="col-span-2">
      <p className="nav-link mb-4 text-[color:var(--color-ink-muted)]">{title}</p>
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={`${c.gender}-${c.slug}`}>
            <Link
              href={`/${c.gender}/${c.slug}`}
              className="text-sm hover:underline"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
