"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR, percentOff } from "@/lib/formatters";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const onSale = product.salePricePaise < product.basePricePaise;
  const pct = percentOff(product.basePricePaise, product.salePricePaise);

  return (
    <Link
      href={`/p/${product.slug}/${product.sku}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--color-cream)]">
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover transition-opacity duration-300 ${
            hovered && product.hoverImage !== product.primaryImage
              ? "opacity-0"
              : "opacity-100"
          }`}
        />
        {product.hoverImage !== product.primaryImage && (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {product.badges.includes("essentials") && (
          <span className="absolute top-3 left-3 nav-link bg-[color:var(--color-paper)] text-[color:var(--color-ink)] px-2 py-1">
            Essentials
          </span>
        )}
        {product.isSustainable && (
          <span className="absolute bottom-3 left-3 nav-link bg-[color:var(--color-cream)] text-[color:var(--color-ink)] px-2 py-1">
            RSE
          </span>
        )}
        {onSale && (
          <span className="absolute top-3 right-3 nav-link bg-[color:var(--color-sale)] text-[color:var(--color-paper)] px-2 py-1">
            -{pct}%
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-3 w-3 rounded-full border border-[color:var(--color-line)]"
              style={{ background: color.swatchHex }}
            />
          ))}
        </div>
        <h3 className="text-sm leading-snug">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">
            {formatINR(product.salePricePaise)}
          </span>
          {onSale && (
            <>
              <span className="text-xs text-[color:var(--color-ink-muted)] line-through">
                {formatINR(product.basePricePaise)}
              </span>
              <span className="text-xs text-[color:var(--color-sale)]">
                -{pct}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
