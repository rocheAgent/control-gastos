import type { Category } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-comida",
    name: "Comida",
    icon: "🍔",
    color: "#ef4444",
    subcategories: [],
    isDefault: true,
  },
  {
    id: "cat-despensa",
    name: "Despensa",
    icon: "🛒",
    color: "#f97316",
    subcategories: [],
    isDefault: true,
  },
  {
    id: "cat-transporte",
    name: "Transporte",
    icon: "🚗",
    color: "#3b82f6",
    subcategories: [],
    isDefault: true,
  },
  {
    id: "cat-entretenimiento",
    name: "Entretenimiento",
    icon: "🎬",
    color: "#8b5cf6",
    subcategories: [],
    isDefault: true,
  },
  {
    id: "cat-salud",
    name: "Salud",
    icon: "💊",
    color: "#22c55e",
    subcategories: [],
    isDefault: true,
  },
];

export const DEFAULT_SETTINGS = {
  theme: "light" as const,
  currency: "MXN" as const,
  exchangeRate: 17.5,
  budgetAlertThreshold: 0.8,
};
