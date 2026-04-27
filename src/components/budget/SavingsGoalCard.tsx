import { useState } from "react";
import { Target, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBudgetStore } from "@/stores/useBudgetStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";

interface SavingsGoalCardProps {
  compact?: boolean;
}

export function SavingsGoalCard({ compact = false }: SavingsGoalCardProps) {
  const { savingsGoals, addSavingsToGoal, addSavingsGoal } = useBudgetStore();
  const { settings } = useSettingsStore();
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({});
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  });

  function handleAddAmount(goalId: string) {
    const amount = parseFloat(addAmounts[goalId] ?? "");
    if (!amount) return;
    addSavingsToGoal(goalId, amount);
    setAddAmounts((prev) => ({ ...prev, [goalId]: "" }));
  }

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    const target = parseFloat(newGoal.targetAmount);
    if (!target || !newGoal.name) return;

    addSavingsGoal({
      name: newGoal.name,
      targetAmount: target,
      currentAmount: 0,
      deadline: newGoal.deadline,
      currency: settings.currency,
    });

    setNewGoal({
      name: "",
      targetAmount: "",
      deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    });
    setShowAddGoal(false);
  }

  if (compact) {
    if (savingsGoals.length === 0) return null;
    const totalProgress =
      savingsGoals.reduce((sum, g) => sum + g.currentAmount / g.targetAmount, 0) /
      savingsGoals.length;

    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Metas de ahorro
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, totalProgress * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {(totalProgress * 100).toFixed(0)}% promedio · {savingsGoals.length} meta(s)
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 mt-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Metas de ahorro
        </h3>
        <Button size="sm" onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nueva meta
        </Button>
      </div>

      {savingsGoals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Target className="h-10 w-10 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Crea tu primera meta de ahorro
            </p>
          </CardContent>
        </Card>
      ) : (
        savingsGoals.map((goal) => {
          const progress = Math.min(1, goal.currentAmount / goal.targetAmount);
          return (
            <Card key={goal.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{goal.name}</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(goal.deadline + "T00:00:00"), "dd/MM/yyyy")}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{formatCurrency(goal.currentAmount, goal.currency)}</span>
                  <span>{formatCurrency(goal.targetAmount, goal.currency)}</span>
                </div>

                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Agregar..."
                    value={addAmounts[goal.id] ?? ""}
                    onChange={(e) =>
                      setAddAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))
                    }
                    className="h-8 text-sm"
                  />
                  <Button size="sm" onClick={() => handleAddAmount(goal.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {(progress * 100).toFixed(0)}% completado
                </p>
              </CardContent>
            </Card>
          );
        })
      )}

      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva meta de ahorro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="goal-name">Nombre</Label>
              <Input
                id="goal-name"
                placeholder="Ej: Fondo de emergencia"
                value={newGoal.name}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goal-target">Monto objetivo</Label>
              <Input
                id="goal-target"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newGoal.targetAmount}
                onChange={(e) =>
                  setNewGoal((prev) => ({ ...prev, targetAmount: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goal-deadline">Fecha límite</Label>
              <Input
                id="goal-deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddGoal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Crear meta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
