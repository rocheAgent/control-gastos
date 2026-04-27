import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import type { Expense, Category } from "@/types";
import { isDateInRange } from "@/utils/dates";
import type { DateRange } from "@/hooks/useDateRange";

interface ReportChartsProps {
  expenses: Expense[];
  categories: Category[];
  range: DateRange;
  currency: "MXN" | "USD";
}

export function ReportCharts({ expenses, categories, range, currency }: ReportChartsProps) {
  const filtered = expenses.filter((e) =>
    isDateInRange(new Date(e.date + "T00:00:00"), range.start, range.end)
  );

  const byCategory = categories
    .map((cat) => {
      const total = filtered
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: `${cat.icon} ${cat.name}`, value: total, color: cat.color };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const byMonth = (() => {
    const months: Record<string, number> = {};
    filtered.forEach((e) => {
      const key = e.date.slice(0, 7);
      months[key] = (months[key] ?? 0) + e.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({
        month: month.slice(5),
        total,
      }));
  })();

  const hasPieData = byCategory.length > 0;
  const hasBarData = byMonth.length > 0;

  if (!hasPieData && !hasBarData) {
    return (
      <Card className="mx-4 mt-3">
        <CardContent className="py-8 text-center text-slate-500 dark:text-slate-400">
          No hay datos en el rango seleccionado
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {hasBarData && (
        <Card className="mx-4 mt-3">
          <CardHeader>
            <CardTitle>Gastos por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {hasPieData && (
        <Card className="mx-4 mt-3">
          <CardHeader>
            <CardTitle>Distribución por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
