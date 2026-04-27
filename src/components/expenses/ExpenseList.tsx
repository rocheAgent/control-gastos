import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { formatDate } from "@/utils/dates";
import { formatCurrency } from "@/utils/formatters";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { format } from "date-fns";

interface ExpenseListProps {
  month: string; // "yyyy-MM"
  search: string;
}

export function ExpenseList({ month, search }: ExpenseListProps) {
  const { expenses, categories, deleteExpense } = useExpenseStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = expenses.filter((e) => {
    const matchesMonth = e.date.startsWith(month);
    const cat = categories.find((c) => c.id === e.categoryId);
    const matchesSearch =
      !search ||
      (cat?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  if (filtered.length === 0) {
    return (
      <EmptyState
        message="Sin gastos"
        description="Agrega tu primer gasto con el botón +"
        icon="💸"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {filtered.map((expense) => {
        const cat = categories.find((c) => c.id === expense.categoryId);
        return (
          <div
            key={expense.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <span
              className="text-2xl w-10 h-10 flex items-center justify-center rounded-full"
              style={{ backgroundColor: cat?.color + "22" }}
            >
              {cat?.icon ?? "💰"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                {expense.description || cat?.name || "Gasto"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(expense.date)} · {cat?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-red-600 dark:text-red-400">
                -{formatCurrency(convert(expense.amount, expense.currency), settings.currency)}
              </p>
              {expense.currency !== settings.currency && (
                <p className="text-xs text-slate-400">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
              )}
            </div>
            {confirmDelete === expense.id ? (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    deleteExpense(expense.id);
                    setConfirmDelete(null);
                  }}
                >
                  Sí
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmDelete(null)}
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 text-slate-400 hover:text-red-500"
                onClick={() => setConfirmDelete(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function currentMonthStr() {
  return format(new Date(), "yyyy-MM");
}
