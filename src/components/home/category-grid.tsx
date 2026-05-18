import Image from "next/image";
import Link from "next/link";
import type { CategoryCard } from "@/lib/types";

export function CategoryGrid({ cards }: { cards: CategoryCard[] }) {
  return (
    <section className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-20 md:mt-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {cards.map((card) => (
          <Link
            key={`${card.title}-${card.subtitle}`}
            href={card.href}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--color-cream)]">
              <Image
                src={card.imageUrl}
                alt={`${card.subtitle} — ${card.title}`}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-[color:var(--color-paper)] text-center bg-gradient-to-t from-black/35 via-transparent to-transparent">
                <p className="nav-link opacity-90">{card.subtitle}</p>
                <h3 className="heading-display text-xl mt-1">{card.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
