"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function PdpGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <div className="flex flex-col gap-2 max-h-[800px] overflow-y-auto">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[3/4] overflow-hidden bg-[color:var(--color-cream)] outline-none",
              active === i
                ? "ring-1 ring-[color:var(--color-ink)] ring-offset-2 ring-offset-[color:var(--color-paper)]"
                : "opacity-70 hover:opacity-100",
            )}
          >
            <Image
              src={img}
              alt={`${productName} view ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-[3/4] bg-[color:var(--color-cream)] overflow-hidden">
        <Image
          src={images[active]}
          alt={productName}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
