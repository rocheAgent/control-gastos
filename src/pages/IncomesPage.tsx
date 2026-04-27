import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeForm } from "@/components/income/IncomeForm";
import { SavingsGoalCard } from "@/components/budget/SavingsGoalCard";
import { format } from "date-fns";

export function IncomesPage() {
  const [showForm, setShowForm] = useState(false);
  const month = format(new Date(), "yyyy-MM");

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Ingresos
        </h2>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo ingreso
        </Button>
      </div>

      <IncomeList month={month} />

      <div className="px-4 mt-4">
        <SavingsGoalCard />
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar ingreso</DialogTitle>
          </DialogHeader>
          <IncomeForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
