const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

// Non-finite input (NaN/Infinity) and -0 are passed through as-is (e.g. "£NaN") — not guarded, by choice.
export function formatCurrency(amount: number): string {
  return gbpFormatter.format(amount);
}
