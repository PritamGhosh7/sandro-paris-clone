import { announcement } from "@/data/homepage";

export function AnnouncementBar() {
  return (
    <div className="w-full bg-[color:var(--color-ink)] text-[color:var(--color-paper)] py-2 text-center">
      <p className="nav-link tracking-[0.18em]">{announcement}</p>
    </div>
  );
}
