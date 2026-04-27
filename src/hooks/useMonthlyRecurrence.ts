import { useEffect } from "react";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { getNextDate, shouldGenerateExpense } from "@/lib/recurrence";
import { format } from "date-fns";

export function useMonthlyRecurrence() {
  const { recurringExpenses, addExpense, updateRecurringExpense } = useExpenseStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();

    recurringExpenses.forEach((recurring) => {
      if (!shouldGenerateExpense(recurring, currentDay)) return;

      const todayStr = format(today, "yyyy-MM-dd");
      if (recurring.nextDate > todayStr) return;

      addExpense({
        amount: recurring.amount,
        currency: recurring.currency,
        categoryId: recurring.categoryId,
        subcategoryId: recurring.subcategoryId,
        date: todayStr,
        description: `${recurring.name} (recurrente)`,
        isRecurring: true,
        recurringId: recurring.id,
      });

      const nextDate = getNextDate(recurring);
      updateRecurringExpense(recurring.id, { nextDate });
    });
  }, [recurringExpenses, addExpense, updateRecurringExpense, settings.currency]);
}
