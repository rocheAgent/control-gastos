import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ToastContextProvider } from "@/components/ui/toast";
import { DashboardPage } from "@/pages/DashboardPage";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { AddExpensePage } from "@/pages/AddExpensePage";
import { IncomesPage } from "@/pages/IncomesPage";
import { DebtsPage } from "@/pages/DebtsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { BudgetPage } from "@/pages/BudgetPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { MorePage } from "@/pages/MorePage";

export default function App() {
  return (
    <ToastContextProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/gastos" element={<ExpensesPage />} />
            <Route path="/gastos/nuevo" element={<AddExpensePage />} />
            <Route path="/ingresos" element={<IncomesPage />} />
            <Route path="/deudas" element={<DebtsPage />} />
            <Route path="/mas" element={<MorePage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/presupuesto" element={<BudgetPage />} />
            <Route path="/configuracion" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ToastContextProvider>
  );
}
