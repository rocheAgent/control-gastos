import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Debt, DebtPayment } from "@/types";
import { generateId } from "@/utils/id";

interface DebtStore {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, "id" | "payments">) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addDebtPayment: (payment: Omit<DebtPayment, "id">) => void;
}

export const useDebtStore = create<DebtStore>()(
  persist(
    (set) => ({
      debts: [],
      addDebt: (debt) =>
        set((state) => ({
          debts: [{ ...debt, id: generateId(), payments: [] }, ...state.debts],
        })),
      updateDebt: (id, debt) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? { ...d, ...debt } : d
          ),
        })),
      deleteDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id),
        })),
      addDebtPayment: (payment) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === payment.debtId
              ? {
                  ...d,
                  payments: [...d.payments, { ...payment, id: generateId() }],
                }
              : d
          ),
        })),
    }),
    { name: "gastos-debts" }
  )
);
