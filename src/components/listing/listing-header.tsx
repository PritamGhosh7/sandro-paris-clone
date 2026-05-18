import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SortDropdown } from "./sort-dropdown";

export function ListingHeader({
  breadcrumb,
  title,
  count,
  announcement,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  count: number;
  announcement?: string;
}) {
  return (
    <div className="border-b border-[color:var(--color-line)] pb-6">
      <nav className="flex items-center text-xs text-[color:var(--color-ink-muted)] gap-1.5">
        {breadcrumb.map((b, i) => (
          <span key={b.label} className="inline-flex items-center gap-1.5">
            {b.href ? (
              <Link href={b.href} className="hover:underline">
                {b.label}
              </Link>
            ) : (
              <span>{b.label}</span>
            )}
            {i < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
          </span>
        ))}
      </nav>

      {announcement && (
        <div className="mt-6 mb-4 text-center">
          <p className="nav-link text-[color:var(--color-sale)]">{announcement}</p>
        </div>
      )}

      <div className="mt-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl">{title}</h1>
          <p className="text-sm text-[color:var(--color-ink-muted)] mt-1">
            ({count}) products
          </p>
        </div>
        <SortDropdown />
      </div>
    </div>
  );
}
