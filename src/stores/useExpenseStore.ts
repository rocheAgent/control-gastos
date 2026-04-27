import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Expense, RecurringExpense } from "@/types";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { generateId } from "@/utils/id";

interface ExpenseStore {
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
  categories: Category[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  addRecurringExpense: (recurring: Omit<RecurringExpense, "id">) => void;
  updateRecurringExpense: (id: string, data: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      recurringExpenses: [],
      categories: DEFAULT_CATEGORIES,
      addExpense: (expense) =>
        set((state) => ({
          expenses: [{ ...expense, id: generateId() }, ...state.expenses],
        })),
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense } : e
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: generateId() },
          ],
        })),
      addRecurringExpense: (recurring) =>
        set((state) => ({
          recurringExpenses: [
            ...state.recurringExpenses,
            { ...recurring, id: generateId() },
          ],
        })),
      updateRecurringExpense: (id, data) =>
        set((state) => ({
          recurringExpenses: state.recurringExpenses.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteRecurringExpense: (id) =>
        set((state) => ({
          recurringExpenses: state.recurringExpenses.filter((r) => r.id !== id),
        })),
    }),
    { name: "gastos-expenses" }
  )
);
