import { Truck, Shield, Repeat2, Package } from "lucide-react";

const ITEMS = [
  { icon: Truck, label: "Free delivery", sub: "On orders over ₹10,000" },
  { icon: Shield, label: "Secure payment", sub: "PCI-compliant" },
  { icon: Repeat2, label: "Free exchange", sub: "By mail or in-store" },
  { icon: Package, label: "Order tracking", sub: "Real-time updates" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-[color:var(--color-line)] py-10 mt-20">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-7 w-7" strokeWidth={1.25} />
            <div>
              <p className="nav-link">{label}</p>
              <p className="text-xs text-[color:var(--color-ink-muted)] mt-0.5">
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
