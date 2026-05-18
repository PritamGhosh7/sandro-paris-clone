"use client";

import Image from "next/image";
import Link from "next/link";
import type { StoreCard } from "@/lib/types";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function StoreSpotlight({ stores }: { stores: StoreCard[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <section className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-20 md:mt-28">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="nav-link text-[color:var(--color-ink-muted)] mb-2">
            Discover
          </p>
          <h2 className="heading-display text-2xl md:text-3xl">Our Stores</h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            className="h-10 w-10 border border-[color:var(--color-ink)] flex items-center justify-center hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            className="h-10 w-10 border border-[color:var(--color-ink)] flex items-center justify-center hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {stores.map((store) => (
            <Link
              key={store.city}
              href={store.href}
              className="flex-[0_0_75%] md:flex-[0_0_28%] group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
                <Image
                  src={store.imageUrl}
                  alt={store.city}
                  fill
                  sizes="(min-width: 768px) 30vw, 75vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4">
                <h3 className="nav-link mb-1">{store.city}</h3>
                <p className="text-sm text-[color:var(--color-ink-muted)]">
                  {store.address}
                </p>
                <p className="nav-link mt-3 border-b border-[color:var(--color-ink)] inline-block pb-0.5">
                  View Store
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
