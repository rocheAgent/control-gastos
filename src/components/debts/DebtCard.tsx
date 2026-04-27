import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Debt } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard, Landmark, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  credit_card: CreditCard,
  loan: Landmark,
  personal: Users,
};

const TYPE_LABELS = {
  credit_card: "Tarjeta de crédito",
  loan: "Préstamo",
  personal: "Personal",
};

interface DebtCardProps {
  debt: Debt;
  onAddPayment: (debtId: string) => void;
}

export function DebtCard({ debt, onAddPayment }: DebtCardProps) {
  const paidTotal = debt.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, debt.totalAmount - paidTotal);
  const progress = Math.min(1, paidTotal / debt.totalAmount);
  const Icon = TYPE_ICONS[debt.type];

  return (
    <Card className={cn(debt.status === "paid" && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {debt.name}
              </p>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  debt.status === "active"
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                )}
              >
                {debt.status === "active" ? "Activa" : "Pagada"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {TYPE_LABELS[debt.type]} · {debt.interestRate}% anual
            </p>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Restante: {formatCurrency(remaining, debt.currency)}</span>
                <span>{(progress * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span>Pago mín: </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatCurrency(debt.minimumPayment, debt.currency)}
                </span>
                <span className="ml-2">Vence día {debt.dueDate}</span>
              </div>
              {debt.status === "active" && (
                <Button size="sm" onClick={() => onAddPayment(debt.id)}>
                  Pagar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
