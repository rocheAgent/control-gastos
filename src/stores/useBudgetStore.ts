import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetLimit, SavingsGoal } from "@/types";
import { generateId } from "@/utils/id";

interface BudgetStore {
  budgetLimits: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  addBudgetLimit: (limit: BudgetLimit) => void;
  updateBudgetLimit: (categoryId: string, limit: Partial<BudgetLimit>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id">) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  addSavingsToGoal: (id: string, amount: number) => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      budgetLimits: [],
      savingsGoals: [],
      addBudgetLimit: (limit) =>
        set((state) => {
          const exists = state.budgetLimits.find(
            (l) => l.categoryId === limit.categoryId
          );
          if (exists) {
            return {
              budgetLimits: state.budgetLimits.map((l) =>
                l.categoryId === limit.categoryId ? limit : l
              ),
            };
          }
          return { budgetLimits: [...state.budgetLimits, limit] };
        }),
      updateBudgetLimit: (categoryId, limit) =>
        set((state) => ({
          budgetLimits: state.budgetLimits.map((l) =>
            l.categoryId === categoryId ? { ...l, ...limit } : l
          ),
        })),
      addSavingsGoal: (goal) =>
        set((state) => ({
          savingsGoals: [
            ...state.savingsGoals,
            { ...goal, id: generateId() },
          ],
        })),
      updateSavingsGoal: (id, goal) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        })),
      addSavingsToGoal: (id, amount) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id
              ? { ...g, currentAmount: g.currentAmount + amount }
              : g
          ),
        })),
    }),
    { name: "gastos-budget" }
  )
);
