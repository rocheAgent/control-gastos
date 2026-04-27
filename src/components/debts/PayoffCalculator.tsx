import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDebtStore } from "@/stores/useDebtStore";
import { calculateAvalanche, calculateSnowball } from "@/lib/debt-payoff";
import { formatCurrency } from "@/utils/formatters";

export function PayoffCalculator() {
  const { debts } = useDebtStore();
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");

  const sorted =
    strategy === "avalanche" ? calculateAvalanche(debts) : calculateSnowball(debts);

  if (sorted.length === 0) return null;

  return (
    <Card className="mx-4 mt-4">
      <CardHeader>
        <CardTitle>Calculadora de pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={strategy === "avalanche" ? "default" : "outline"}
            onClick={() => setStrategy("avalanche")}
          >
            Avalancha
          </Button>
          <Button
            size="sm"
            variant={strategy === "snowball" ? "default" : "outline"}
            onClick={() => setStrategy("snowball")}
          >
            Bola de nieve
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {strategy === "avalanche"
            ? "Paga primero la deuda con mayor tasa de interés (ahorra más dinero)"
            : "Paga primero la deuda con menor saldo (motivación rápida)"}
        </p>

        <div className="flex flex-col gap-2">
          {sorted.map((debt, i) => {
            const paid = debt.payments.reduce((s, p) => s + p.amount, 0);
            const remaining = Math.max(0, debt.totalAmount - paid);
            return (
              <div
                key={debt.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900"
              >
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {debt.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatCurrency(remaining, debt.currency)} · {debt.interestRate}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
