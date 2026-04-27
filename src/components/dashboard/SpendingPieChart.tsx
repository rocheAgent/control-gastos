import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { getStartOfMonth, getEndOfMonth, isDateInRange } from "@/utils/dates";
import { formatCurrency } from "@/utils/formatters";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function SpendingPieChart() {
  const { expenses, categories } = useExpenseStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();

  const now = new Date();
  const start = getStartOfMonth(now);
  const end = getEndOfMonth(now);

  const monthlyExpenses = expenses.filter((e) =>
    isDateInRange(new Date(e.date + "T00:00:00"), start, end)
  );

  const byCategory = categories
    .map((cat) => {
      const total = monthlyExpenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + convert(e.amount, e.currency), 0);
      return { name: `${cat.icon} ${cat.name}`, value: total, color: cat.color };
    })
    .filter((d) => d.value > 0);

  if (byCategory.length === 0) return null;

  return (
    <Card className="mx-4 mt-3">
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={byCategory}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {byCategory.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                formatCurrency(value, settings.currency)
              }
            />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
