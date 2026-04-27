import { useState, useRef } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { CategoryFilter } from "@/components/reports/CategoryFilter";
import { ReportCharts } from "@/components/reports/ReportCharts";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useDateRange } from "@/hooks/useDateRange";
import { useExport } from "@/hooks/useExport";
import { formatCurrency } from "@/utils/formatters";
import { isDateInRange } from "@/utils/dates";

export function ReportsPage() {
  const { expenses, categories } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const { settings } = useSettingsStore();
  const { range, preset, setPreset, customRange, setCustomRange } = useDateRange();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { exportToCSV, exportToPDF } = useExport();
  const reportRef = useRef<HTMLDivElement>(null);

  const filtered = expenses.filter((e) => {
    const inRange = isDateInRange(new Date(e.date + "T00:00:00"), range.start, range.end);
    const inCategories =
      selectedCategories.length === 0 || selectedCategories.includes(e.categoryId);
    return inRange && inCategories;
  });

  const totalExpenses = filtered.reduce((sum, e) => sum + e.amount, 0);

  const filteredIncomes = incomes.filter((i) =>
    isDateInRange(new Date(i.date + "T00:00:00"), range.start, range.end)
  );
  const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Reportes
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportToPDF("report-content")}
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <DateRangePicker
          preset={preset}
          onPresetChange={setPreset}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />

        <CategoryFilter
          categories={categories}
          selectedIds={selectedCategories}
          onToggle={toggleCategory}
          onClear={() => setSelectedCategories([])}
        />
      </div>

      <div id="report-content" ref={reportRef} className="mt-4">
        <div className="grid grid-cols-2 gap-3 px-4 mb-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total gastos</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses, settings.currency)}
              </p>
              <p className="text-xs text-slate-400">{filtered.length} transacciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total ingresos</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome, settings.currency)}
              </p>
              <p className="text-xs text-slate-400">{filteredIncomes.length} transacciones</p>
            </CardContent>
          </Card>
        </div>

        <ReportCharts
          expenses={expenses}
          categories={categories}
          range={range}
          currency={settings.currency}
        />
      </div>
    </div>
  );
}
