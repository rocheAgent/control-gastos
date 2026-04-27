import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { BudgetAlert } from "@/components/budget/BudgetAlert";
import { SavingsGoalCard } from "@/components/budget/SavingsGoalCard";
import { useMonthlyRecurrence } from "@/hooks/useMonthlyRecurrence";

export function DashboardPage() {
  useMonthlyRecurrence();

  return (
    <div className="py-2">
      <BalanceCard />
      <QuickStats />
      <BudgetAlert />
      <SpendingPieChart />
      <WeeklyBarChart />
      <div className="px-4 mt-3">
        <SavingsGoalCard compact />
      </div>
    </div>
  );
}
