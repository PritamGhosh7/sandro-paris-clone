import Image from "next/image";
import Link from "next/link";
import type { HeroBlock } from "@/lib/types";

export function HeroSplit({ heroes }: { heroes: HeroBlock[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {heroes.map((hero) => (
        <Link
          key={hero.audience}
          href={hero.ctaHref}
          className="relative group block aspect-[3/4] md:aspect-[16/11] overflow-hidden"
        >
          <Image
            src={hero.imageUrl}
            alt={`${hero.eyebrow} ${hero.headline} — ${hero.audience}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 text-[color:var(--color-paper)] text-center">
            <p className="nav-link mb-3 opacity-90">{hero.eyebrow}</p>
            <h2 className="heading-display text-3xl md:text-4xl mb-4">
              {hero.headline}
            </h2>
            <span className="nav-link border-b border-[color:var(--color-paper)] pb-1">
              {hero.ctaLabel}
            </span>
            <p className="text-[10px] uppercase tracking-wider mt-6 opacity-80 max-w-md px-4">
              {hero.disclaimer}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
