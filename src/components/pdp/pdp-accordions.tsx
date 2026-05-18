"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export function PdpAccordions({ product }: { product: Product }) {
  const sections = [
    {
      title: "Description",
      body: (
        <>
          {product.description && (
            <p className="text-sm leading-relaxed">{product.description}</p>
          )}
          {product.bullets.length > 0 && (
            <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1 mt-3">
              {product.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </>
      ),
      defaultOpen: true,
    },
    {
      title: "Composition & Care",
      body: (
        <div className="text-sm leading-relaxed space-y-2">
          {product.composition.length > 0 ? (
            <ul className="space-y-1">
              {product.composition.map((c) => (
                <li key={c.material}>
                  {c.material}: {c.pct}%
                </li>
              ))}
            </ul>
          ) : (
            <p>Composition details available in-store.</p>
          )}
          {product.careInstructions.length > 0 && (
            <ul className="list-disc pl-5">
              {product.careInstructions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      title: "Environmental Characteristics",
      body: (
        <p className="text-sm leading-relaxed">
          {product.isSustainable
            ? "This piece is part of our RSE-certified range, using organic cotton and recycled fibers where possible."
            : "Discover our commitment to responsible sourcing across the Sandro collection."}
        </p>
      ),
    },
    {
      title: "Delivery, Exchanges & Returns",
      body: (
        <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1">
          <li>Free standard delivery on orders over ₹10,000.</li>
          <li>Free in-store returns within 30 days.</li>
          <li>Free exchanges by mail or in-store.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="border-t border-[color:var(--color-line)]">
      {sections.map((s) => (
        <AccordionItem key={s.title} title={s.title} defaultOpen={s.defaultOpen}>
          {s.body}
        </AccordionItem>
      ))}
    </div>
  );
}

function AccordionItem({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-[color:var(--color-line)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 nav-link"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}
