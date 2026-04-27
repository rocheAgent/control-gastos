import { useExpenseStore } from "@/stores/useExpenseStore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { EmptyState } from "@/components/shared/EmptyState";

export function RecurringManager() {
  const { recurringExpenses, categories, updateRecurringExpense, deleteRecurringExpense } =
    useExpenseStore();

  if (recurringExpenses.length === 0) {
    return (
      <EmptyState
        message="Sin gastos recurrentes"
        description="Los gastos marcados como recurrentes aparecerán aquí"
        icon="🔄"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {recurringExpenses.map((r) => {
        const cat = categories.find((c) => c.id === r.categoryId);
        return (
          <div
            key={r.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <span className="text-xl">{cat?.icon ?? "🔄"}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Día {r.dayOfMonth} · {formatCurrency(r.amount, r.currency)}
              </p>
            </div>
            <Switch
              checked={r.isActive}
              onCheckedChange={(v) =>
                updateRecurringExpense(r.id, { isActive: v })
              }
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-slate-400 hover:text-red-500"
              onClick={() => deleteRecurringExpense(r.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
