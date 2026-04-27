import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { formatDate } from "@/utils/dates";
import { formatCurrency } from "@/utils/formatters";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { EmptyState } from "@/components/shared/EmptyState";

interface IncomeListProps {
  month: string;
}

const SOURCE_ICONS: Record<string, string> = {
  Salario: "💼",
  Freelance: "💻",
  Inversiones: "📈",
  Negocio: "🏪",
  Regalos: "🎁",
  Otro: "💰",
};

export function IncomeList({ month }: IncomeListProps) {
  const { incomes, deleteIncome } = useIncomeStore();
  const { convert } = useCurrencyConversion();
  const { settings } = useSettingsStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = incomes.filter((i) => i.date.startsWith(month));

  if (filtered.length === 0) {
    return (
      <EmptyState
        message="Sin ingresos"
        description="Registra tus ingresos con el botón +"
        icon="💰"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      {filtered.map((income) => (
        <div
          key={income.id}
          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            {SOURCE_ICONS[income.source] ?? "💰"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{income.source}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(income.date)}
              {income.description && ` · ${income.description}`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm text-green-600 dark:text-green-400">
              +{formatCurrency(convert(income.amount, income.currency), settings.currency)}
            </p>
          </div>
          {confirmDelete === income.id ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deleteIncome(income.id);
                  setConfirmDelete(null);
                }}
              >
                Sí
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>
                No
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 text-slate-400 hover:text-red-500"
              onClick={() => setConfirmDelete(income.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
