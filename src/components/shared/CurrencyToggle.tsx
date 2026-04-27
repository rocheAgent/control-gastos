import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function CurrencyToggle() {
  const { settings, toggleCurrency } = useSettingsStore();
  return (
    <Button variant="outline" size="sm" onClick={toggleCurrency}>
      {settings.currency === "MXN" ? "MXN $" : "USD $"}
    </Button>
  );
}
