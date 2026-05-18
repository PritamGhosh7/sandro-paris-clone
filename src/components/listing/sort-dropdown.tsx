"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const OPTIONS = [
  "Product",
  "New",
  "Ascending price",
  "Descending price",
  "Most coveted",
];

export function SortDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Product");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nav-link inline-flex items-center gap-2 border border-[color:var(--color-ink)] px-4 py-2.5"
      >
        Sort: {value}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <ul className="absolute right-0 top-full mt-1 w-56 bg-[color:var(--color-paper)] border border-[color:var(--color-line)] shadow-md z-10">
          {OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  setValue(opt);
                  setOpen(false);
                }}
                className="w-full text-left text-sm px-4 py-2 hover:bg-[color:var(--color-cream)]"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
