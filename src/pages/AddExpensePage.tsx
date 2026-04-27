import { useNavigate } from "react-router-dom";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

export function AddExpensePage() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Nuevo gasto
      </h2>
      <ExpenseForm onClose={() => navigate("/gastos")} />
    </div>
  );
}
