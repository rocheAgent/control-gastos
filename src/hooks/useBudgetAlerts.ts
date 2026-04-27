import { useExpenseStore } from "@/stores/useExpenseStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { convertCurrency } from "@/lib/currency";
import { getStartOfMonth, getEndOfMonth, isDateInRange } from "@/utils/dates";

export interface BudgetAlert {
  categoryId: string;
  categoryName: string;
  spent: number;
  limit: number;
  percentage: number;
}

export function useBudgetAlerts(): BudgetAlert[] {
  const { expenses, categories } = useExpenseStore();
  const { budgetLimits } = useBudgetStore();
  const { settings } = useSettingsStore();

  const now = new Date();
  const start = getStartOfMonth(now);
  const end = getEndOfMonth(now);

  return budgetLimits
    .map((limit) => {
      const category = categories.find((c) => c.id === limit.categoryId);
      if (!category) return null;

      const spent = expenses
        .filter((e) => {
          const date = new Date(e.date + "T00:00:00");
          return e.categoryId === limit.categoryId && isDateInRange(date, start, end);
        })
        .reduce(
          (sum, e) =>
            sum +
            convertCurrency(
              e.amount,
              e.currency,
              limit.currency,
              settings.exchangeRate
            ),
          0
        );

      const percentage = spent / limit.monthlyLimit;

      if (percentage < settings.budgetAlertThreshold) return null;

      return {
        categoryId: limit.categoryId,
        categoryName: category.name,
        spent,
        limit: limit.monthlyLimit,
        percentage,
      };
    })
    .filter((a): a is BudgetAlert => a !== null);
}
