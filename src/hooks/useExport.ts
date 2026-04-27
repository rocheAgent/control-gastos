import { useExpenseStore } from "@/stores/useExpenseStore";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { exportToCSV, exportToPDF } from "@/lib/export";

export function useExport() {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();

  return {
    exportToCSV: () => exportToCSV(expenses, incomes),
    exportToPDF: (elementId: string) => exportToPDF(elementId),
  };
}
