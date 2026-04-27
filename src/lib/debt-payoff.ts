import type { Debt } from "@/types";

function getRemainingBalance(debt: Debt): number {
  const paid = debt.payments.reduce((sum, p) => sum + p.amount, 0);
  return Math.max(0, debt.totalAmount - paid);
}

export function calculateAvalanche(debts: Debt[]): Debt[] {
  return [...debts]
    .filter((d) => d.status === "active")
    .sort((a, b) => b.interestRate - a.interestRate);
}

export function calculateSnowball(debts: Debt[]): Debt[] {
  return [...debts]
    .filter((d) => d.status === "active")
    .sort((a, b) => getRemainingBalance(a) - getRemainingBalance(b));
}
