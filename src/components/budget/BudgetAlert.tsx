import { AlertTriangle } from "lucide-react";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { formatCurrency } from "@/utils/formatters";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { cn } from "@/lib/utils";

export function BudgetAlert() {
  const alerts = useBudgetAlerts();
  const { settings } = useSettingsStore();

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 mt-3">
      {alerts.map((alert) => {
        const isOver = alert.percentage >= 1;
        return (
          <div
            key={alert.categoryId}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border",
              isOver
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
            )}
          >
            <AlertTriangle
              className={cn(
                "h-5 w-5 shrink-0",
                isOver ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {alert.categoryName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isOver
                  ? `Excedido: ${formatCurrency(alert.spent, settings.currency)} de ${formatCurrency(alert.limit, settings.currency)}`
                  : `Has usado el ${(alert.percentage * 100).toFixed(0)}% de tu presupuesto`}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-bold",
                  isOver ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
                )}
              >
                {(alert.percentage * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
