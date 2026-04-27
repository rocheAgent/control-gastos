import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Income } from "@/types";
import { generateId } from "@/utils/id";

interface IncomeStore {
  incomes: Income[];
  addIncome: (income: Omit<Income, "id">) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
}

export const useIncomeStore = create<IncomeStore>()(
  persist(
    (set) => ({
      incomes: [],
      addIncome: (income) =>
        set((state) => ({
          incomes: [{ ...income, id: generateId() }, ...state.incomes],
        })),
      updateIncome: (id, income) =>
        set((state) => ({
          incomes: state.incomes.map((i) =>
            i.id === id ? { ...i, ...income } : i
          ),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((i) => i.id !== id),
        })),
    }),
    { name: "gastos-income" }
  )
);
