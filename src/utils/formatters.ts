import type { Currency } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatCurrency(amount: number, currency: Currency): string {
  if (currency === "MXN") {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  return format(d, "dd/MM", { locale: es });
}
