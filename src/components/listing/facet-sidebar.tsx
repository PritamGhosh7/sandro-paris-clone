"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Facet {
  title: string;
  options: { label: string; count?: number }[];
}

const FACETS: Facet[] = [
  {
    title: "Category",
    options: [
      { label: "Dresses" },
      { label: "Coats" },
      { label: "Blazers & Jackets" },
      { label: "Tops & Shirts" },
      { label: "Pants & Jeans" },
      { label: "Leather jackets" },
      { label: "T-shirts" },
      { label: "Skirts & Shorts" },
      { label: "Sweaters & Cardigans" },
      { label: "Bags" },
      { label: "Shoes" },
      { label: "Accessories" },
    ],
  },
  {
    title: "Color",
    options: [
      { label: "Black / Gray" },
      { label: "Blue" },
      { label: "Pink" },
      { label: "Brown" },
      { label: "Denim" },
      { label: "Green" },
      { label: "White" },
      { label: "Red" },
    ],
  },
  {
    title: "Size",
    options: [
      { label: "0 / XS / 34" },
      { label: "1 / S / 36" },
      { label: "2 / M / 38" },
      { label: "3 / L / 40" },
      { label: "4 / XL / 42" },
      { label: "5 / XXL / 44" },
    ],
  },
  {
    title: "Composition",
    options: [
      { label: "Cashmere" },
      { label: "Cotton" },
      { label: "Linen" },
      { label: "Silk" },
      { label: "Virgin wool" },
      { label: "Viscose" },
    ],
  },
  {
    title: "Discount",
    options: [
      { label: "40% off" },
      { label: "30% off" },
      { label: "20% off" },
    ],
  },
];

export function FacetSidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 space-y-1">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[color:var(--color-line)]">
          <h2 className="nav-link">Filters</h2>
          <button className="text-xs underline text-[color:var(--color-ink-muted)]">
            Clear
          </button>
        </div>
        {FACETS.map((facet) => (
          <FacetSection key={facet.title} facet={facet} />
        ))}
      </div>
    </aside>
  );
}

function FacetSection({ facet }: { facet: Facet }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <div className="border-b border-[color:var(--color-line)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 nav-link text-left"
      >
        <span>{facet.title}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul className="pb-3 space-y-2">
          {facet.options.map((opt) => {
            const isSelected = selected.has(opt.label);
            return (
              <li key={opt.label}>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      const next = new Set(selected);
                      if (isSelected) next.delete(opt.label);
                      else next.add(opt.label);
                      setSelected(next);
                    }}
                    className="accent-[color:var(--color-ink)]"
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
