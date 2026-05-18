import Link from "next/link";

const SOCIALS = ["Instagram", "TikTok", "Pinterest", "Facebook"];

const COLUMNS = [
  {
    title: "Services",
    links: [
      ["FAQs", "#"],
      ["Contact", "#"],
      ["Order Tracking", "#"],
      ["Shipping & Returns", "#"],
      ["Size Guide", "#"],
      ["Gift Cards", "#"],
      ["E-Reservation", "#"],
    ],
  },
  {
    title: "About Us",
    links: [
      ["Store Locator", "#"],
      ["Second Hand", "#"],
      ["Artistic Direction", "#"],
      ["Brand Story", "#"],
      ["Careers", "#"],
      ["Commitments", "#"],
    ],
  },
  {
    title: "Women",
    links: [
      ["SS26 Collection", "/women"],
      ["Mid Season Sale", "/midseason-sale/women"],
      ["Dresses", "/women/dresses"],
      ["Tops & Shirts", "/women/tops"],
      ["Coats", "/women/coats"],
      ["Bags", "/women/bags"],
      ["Shoes", "/women/shoes"],
    ],
  },
  {
    title: "Men",
    links: [
      ["SS26 Collection", "/men"],
      ["Mid Season Sale", "/midseason-sale/men"],
      ["Jackets", "/men/jackets"],
      ["T-Shirts", "/men/tshirts"],
      ["Coats", "/men/coats"],
      ["Leather Goods", "/men/leather-goods"],
      ["Shoes", "/men/shoes"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-cream)] mt-24 border-t border-[color:var(--color-line)]">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="nav-link mb-4 text-[color:var(--color-ink-muted)]">
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[color:var(--color-line)]">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="heading-display text-lg mb-3">Newsletter</h3>
            <p className="text-sm text-[color:var(--color-ink-muted)] mb-4 max-w-md">
              Subscribe to receive 10% off your first order, plus access to new
              arrivals and private sales.
            </p>
            <form className="flex border-b border-[color:var(--color-ink)] max-w-md">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-[color:var(--color-ink-muted)]"
              />
              <button
                type="submit"
                className="nav-link uppercase px-4"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="md:justify-self-end">
            <h3 className="nav-link mb-4 text-[color:var(--color-ink-muted)]">
              Follow Us
            </h3>
            <div className="flex gap-5">
              {SOCIALS.map((s) => (
                <Link
                  key={s}
                  href="#"
                  aria-label={s}
                  className="nav-link border-b border-transparent hover:border-[color:var(--color-ink)] pb-0.5"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-line)]">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[color:var(--color-ink-muted)]">
          <p>© 2026 Sandro Paris — Clone for portfolio purposes. Not affiliated with SMCP.</p>
          <div className="flex gap-5">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Cookies</Link>
            <Link href="#">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
