const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(paise: number): string {
  return inrFormatter.format(paise / 100);
}

export function percentOff(base: number, sale: number): number {
  if (!base || sale >= base) return 0;
  return Math.round(((base - sale) / base) * 100);
}
