import { Card, CardContent } from "@/components/ui/card";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useDebtStore } from "@/stores/useDebtStore";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { formatCurrency } from "@/utils/formatters";
import { getStartOfMonth, getEndOfMonth, isDateInRange } from "@/utils/dates";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function QuickStats() {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const { debts } = useDebtStore();
  const { savingsGoals } = useBudgetStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();

  const now = new Date();
  const start = getStartOfMonth(now);
  const end = getEndOfMonth(now);

  const monthExpenses = expenses
    .filter((e) => isDateInRange(new Date(e.date + "T00:00:00"), start, end))
    .reduce((sum, e) => sum + convert(e.amount, e.currency), 0);

  const monthIncome = incomes
    .filter((i) => isDateInRange(new Date(i.date + "T00:00:00"), start, end))
    .reduce((sum, i) => sum + convert(i.amount, i.currency), 0);

  const activeDebts = debts.filter((d) => d.status === "active").length;

  const savingsProgress =
    savingsGoals.length > 0
      ? savingsGoals.reduce((sum, g) => sum + g.currentAmount / g.targetAmount, 0) /
        savingsGoals.length
      : 0;

  const stats = [
    { label: "Gastos mes", value: formatCurrency(monthExpenses, settings.currency), color: "text-red-600 dark:text-red-400" },
    { label: "Ingresos mes", value: formatCurrency(monthIncome, settings.currency), color: "text-green-600 dark:text-green-400" },
    { label: "Deudas activas", value: activeDebts.toString(), color: "text-orange-600 dark:text-orange-400" },
    { label: "Ahorro avg", value: `${(savingsProgress * 100).toFixed(0)}%`, color: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-4 mt-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
