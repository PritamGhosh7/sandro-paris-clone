"use client";

import { useState } from "react";
import { ChevronDown, Heart, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, percentOff } from "@/lib/formatters";
import { cn } from "@/lib/cn";
import { VtoDialog } from "@/components/vto/vto-dialog";

export function PdpInfoPanel({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [vtoOpen, setVtoOpen] = useState(false);
  const onSale = product.salePricePaise < product.basePricePaise;
  const pct = percentOff(product.basePricePaise, product.salePricePaise);

  const selectedSize = product.sizes.find((s) => s.label === size);

  return (
    <div className="lg:sticky lg:top-28 self-start space-y-5">
      <div>
        <h1 className="heading-display text-2xl">{product.name}</h1>
        <p className="text-xs text-[color:var(--color-ink-muted)] mt-1">
          Ref. {product.sku}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-xl font-medium">
          {formatINR(product.salePricePaise)}
        </span>
        {onSale && (
          <>
            <span className="text-sm text-[color:var(--color-ink-muted)] line-through">
              {formatINR(product.basePricePaise)}
            </span>
            <span className="nav-link text-[color:var(--color-sale)]">
              -{pct}%
            </span>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="nav-link">Color: {product.colors[0]?.name}</p>
        </div>
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              type="button"
              title={color.name}
              className="h-9 w-9 rounded-full border border-[color:var(--color-line)] ring-1 ring-offset-2 ring-[color:var(--color-ink)] ring-offset-[color:var(--color-paper)]"
              style={{ background: color.swatchHex }}
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setSizeOpen((v) => !v)}
          className="w-full flex items-center justify-between border border-[color:var(--color-ink)] px-4 py-3 nav-link"
        >
          <span>{size ? `Size: ${size}` : "Select your size"}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", sizeOpen && "rotate-180")}
          />
        </button>
        {sizeOpen && (
          <ul className="absolute left-0 right-0 top-full mt-1 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] shadow-md z-10 max-h-72 overflow-y-auto">
            {product.sizes.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  disabled={s.stock === "out"}
                  onClick={() => {
                    setSize(s.label);
                    setSizeOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[color:var(--color-cream)]",
                    s.stock === "out" &&
                      "text-[color:var(--color-ink-muted)] line-through cursor-not-allowed",
                  )}
                >
                  <span>{s.label}</span>
                  {s.stock === "limited" && (
                    <span className="text-xs text-[color:var(--color-sale)]">
                      Limited stock
                    </span>
                  )}
                  {s.stock === "out" && (
                    <span className="text-xs">Out of stock</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="text-xs underline text-[color:var(--color-ink-muted)] mt-2"
        >
          Size guide
        </button>
      </div>

      <p className="text-xs text-[color:var(--color-ink-muted)]">
        {product.modelNote}
      </p>

      <div className="text-xs text-[color:var(--color-ink-muted)] border-y border-[color:var(--color-line)] py-3">
        <p>
          <span className="font-medium text-[color:var(--color-ink)]">Delivery:</span>{" "}
          21 May — 22 May
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <button
          type="button"
          className="btn-primary w-full"
          disabled={!size || selectedSize?.stock === "out"}
        >
          Add to bag
        </button>

        <button
          type="button"
          onClick={() => setVtoOpen(true)}
          className="btn-ghost w-full inline-flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Try on with AI
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="border border-[color:var(--color-line)] px-4 py-3 nav-link hover:bg-[color:var(--color-cream)]"
          >
            Reserve in store
          </button>
          <button
            type="button"
            className="border border-[color:var(--color-line)] px-4 py-3 nav-link inline-flex items-center justify-center gap-2 hover:bg-[color:var(--color-cream)]"
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            Wishlist
          </button>
        </div>
      </div>

      <VtoDialog
        open={vtoOpen}
        onClose={() => setVtoOpen(false)}
        product={product}
      />
    </div>
  );
}
