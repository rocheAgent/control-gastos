import { useSettingsStore } from "@/stores/useSettingsStore";
import { convertCurrency } from "@/lib/currency";
import { formatCurrency } from "@/utils/formatters";
import type { Currency } from "@/types";

export function useCurrencyConversion() {
  const { settings } = useSettingsStore();

  function convert(amount: number, from: Currency): number {
    return convertCurrency(amount, from, settings.currency, settings.exchangeRate);
  }

  function format(amount: number, from: Currency): string {
    const converted = convert(amount, from);
    return formatCurrency(converted, settings.currency);
  }

  return { convert, format, currency: settings.currency };
}
