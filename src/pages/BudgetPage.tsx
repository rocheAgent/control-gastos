import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BudgetAlert } from "@/components/budget/BudgetAlert";
import { SavingsGoalCard } from "@/components/budget/SavingsGoalCard";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { formatCurrency } from "@/utils/formatters";
import { getStartOfMonth, getEndOfMonth, isDateInRange } from "@/utils/dates";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BudgetPage() {
  const { budgetLimits, addBudgetLimit } = useBudgetStore();
  const { expenses, categories } = useExpenseStore();
  const { settings } = useSettingsStore();
  const { convert } = useCurrencyConversion();
  const { toast } = useToast();

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limitAmount, setLimitAmount] = useState("");

  const now = new Date();
  const start = getStartOfMonth(now);
  const end = getEndOfMonth(now);

  function handleAddBudget(e: React.FormEvent) {
    e.preventDefault();
    const limit = parseFloat(limitAmount);
    if (!limit || !selectedCategory) return;

    addBudgetLimit({
      categoryId: selectedCategory,
      monthlyLimit: limit,
      currency: settings.currency,
    });

    toast("Presupuesto agregado", "success");
    setShowAddBudget(false);
    setSelectedCategory("");
    setLimitAmount("");
  }

  function getCategorySpending(categoryId: string): number {
    return expenses
      .filter((e) => {
        const date = new Date(e.date + "T00:00:00");
        return e.categoryId === categoryId && isDateInRange(date, start, end);
      })
      .reduce((sum, e) => sum + convert(e.amount, e.currency), 0);
  }

  const categoriesWithoutBudget = categories.filter(
    (c) => !budgetLimits.find((l) => l.categoryId === c.id)
  );

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Presupuestos
        </h2>
        <Button size="sm" onClick={() => setShowAddBudget(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo presupuesto
        </Button>
      </div>

      <BudgetAlert />

      <div className="px-4 mt-4">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Límites por categoría
        </h3>

        {budgetLimits.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay presupuestos configurados
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Agrega un presupuesto para controlar tus gastos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {budgetLimits.map((limit) => {
              const cat = categories.find((c) => c.id === limit.categoryId);
              if (!cat) return null;

              const spent = getCategorySpending(limit.categoryId);
              const percentage = spent / limit.monthlyLimit;
              const isOver = percentage >= 1;
              const isWarning = percentage >= settings.budgetAlertThreshold && !isOver;

              return (
                <Card key={limit.categoryId}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {cat.name}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          isOver
                            ? "text-red-600 dark:text-red-400"
                            : isWarning
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-green-600 dark:text-green-400"
                        )}
                      >
                        {(percentage * 100).toFixed(0)}%
                      </p>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Gastado: {formatCurrency(spent, settings.currency)}</span>
                      <span>Límite: {formatCurrency(limit.monthlyLimit, settings.currency)}</span>
                    </div>

                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isOver
                            ? "bg-red-500"
                            : isWarning
                            ? "bg-orange-500"
                            : "bg-green-500"
                        )}
                        style={{ width: `${Math.min(100, percentage * 100)}%` }}
                      />
                    </div>

                    {isOver && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Excedido por {formatCurrency(spent - limit.monthlyLimit, settings.currency)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        <SavingsGoalCard />
      </div>

      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo presupuesto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBudget} className="flex flex-col gap-4">
            <div>
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar categoría..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget-limit">Límite mensual</Label>
              <Input
                id="budget-limit"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddBudget(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!selectedCategory || categoriesWithoutBudget.length === 0}
              >
                Agregar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
