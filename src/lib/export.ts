import type { Expense, Income } from "@/types";
import Papa from "papaparse";

export function exportToCSV(expenses: Expense[], incomes: Income[]) {
  const expenseRows = expenses.map((e) => ({
    type: "expense",
    amount: e.amount,
    currency: e.currency,
    category: e.categoryId,
    date: e.date,
    description: e.description ?? "",
  }));

  const incomeRows = incomes.map((i) => ({
    type: "income",
    amount: i.amount,
    currency: i.currency,
    category: i.source,
    date: i.date,
    description: i.description ?? "",
  }));

  const csv = Papa.unparse([...incomeRows, ...expenseRows]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `control-gastos-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToPDF(elementId: string) {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`control-gastos-${new Date().toISOString().slice(0, 10)}.pdf`);
}
