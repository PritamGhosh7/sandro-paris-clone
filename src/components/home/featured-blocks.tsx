import Image from "next/image";
import Link from "next/link";
import type { FeaturedBlock } from "@/lib/types";

export function FeaturedBlocks({ blocks }: { blocks: FeaturedBlock[] }) {
  return (
    <section className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2">
      {blocks.map((block) => (
        <Link
          key={`${block.audience}-${block.headline}`}
          href={block.ctaHref}
          className="relative group block aspect-[3/4] md:aspect-[5/6] overflow-hidden"
        >
          <Image
            src={block.imageUrl}
            alt={`${block.eyebrow} ${block.headline}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-[color:var(--color-paper)] text-center bg-gradient-to-t from-black/35 via-transparent to-transparent">
            <p className="nav-link mb-2 opacity-90">{block.eyebrow}</p>
            <h3 className="heading-display text-2xl md:text-3xl mb-4">{block.headline}</h3>
            <span className="nav-link border-b border-[color:var(--color-paper)] pb-1">
              {block.ctaLabel}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
