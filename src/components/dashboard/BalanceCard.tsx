import { Card, CardContent } from "@/components/ui/card";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { formatCurrency } from "@/utils/formatters";
import { getStartOfMonth, getEndOfMonth, isDateInRange } from "@/utils/dates";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function BalanceCard() {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();

  const now = new Date();
  const start = getStartOfMonth(now);
  const end = getEndOfMonth(now);

  const monthlyIncome = incomes
    .filter((i) => isDateInRange(new Date(i.date + "T00:00:00"), start, end))
    .reduce((sum, i) => sum + convert(i.amount, i.currency), 0);

  const monthlyExpenses = expenses
    .filter((e) => isDateInRange(new Date(e.date + "T00:00:00"), start, end))
    .reduce((sum, e) => sum + convert(e.amount, e.currency), 0);

  const balance = monthlyIncome - monthlyExpenses;

  return (
    <Card className="mx-4 mt-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-1 opacity-90">
          <Wallet className="h-4 w-4" />
          <span className="text-sm">Balance del mes</span>
        </div>
        <p className="text-3xl font-bold mb-4">
          {formatCurrency(balance, settings.currency)}
        </p>
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-300" />
            <div>
              <p className="text-xs opacity-75">Ingresos</p>
              <p className="text-sm font-semibold">
                {formatCurrency(monthlyIncome, settings.currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-red-300" />
            <div>
              <p className="text-xs opacity-75">Gastos</p>
              <p className="text-sm font-semibold">
                {formatCurrency(monthlyExpenses, settings.currency)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
