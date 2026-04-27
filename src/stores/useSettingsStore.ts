import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface SettingsStore {
  settings: UserSettings;
  toggleTheme: () => void;
  toggleCurrency: () => void;
  setExchangeRate: (rate: number) => void;
  setBudgetAlertThreshold: (threshold: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      toggleTheme: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === "light" ? "dark" : "light",
          },
        })),
      toggleCurrency: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            currency: state.settings.currency === "MXN" ? "USD" : "MXN",
          },
        })),
      setExchangeRate: (rate) =>
        set((state) => ({
          settings: { ...state.settings, exchangeRate: rate },
        })),
      setBudgetAlertThreshold: (threshold) =>
        set((state) => ({
          settings: { ...state.settings, budgetAlertThreshold: threshold },
        })),
    }),
    { name: "gastos-settings" }
  )
);
