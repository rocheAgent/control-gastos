import type { Currency } from "@/types";

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rate: number
): number {
  if (from === to) return amount;
  if (from === "MXN" && to === "USD") return amount / rate;
  if (from === "USD" && to === "MXN") return amount * rate;
  return amount;
}

export function formatWithConversion(
  amount: number,
  from: Currency,
  to: Currency,
  rate: number
): string {
  const converted = convertCurrency(amount, from, to, rate);
  const symbol = to === "MXN" ? "$" : "USD ";
  return `${symbol}${converted.toFixed(2)}`;
}
