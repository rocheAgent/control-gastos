import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { getWeekDays } from "@/utils/dates";
import { formatDateShort, formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function WeeklyBarChart() {
  const { expenses } = useExpenseStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();

  const days = getWeekDays(new Date());

  const data = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const total = expenses
      .filter((e) => e.date === dayStr)
      .reduce((sum, e) => sum + convert(e.amount, e.currency), 0);
    return { day: formatDateShort(day), total };
  });

  const hasData = data.some((d) => d.total > 0);
  if (!hasData) return null;

  return (
    <Card className="mx-4 mt-3">
      <CardHeader>
        <CardTitle>Gasto semanal</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) =>
                formatCurrency(value, settings.currency)
              }
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
