import type { RecurringExpense } from "@/types";
import { addMonths, setDate } from "date-fns";

export function shouldGenerateExpense(
  recurring: RecurringExpense,
  currentDay: number
): boolean {
  return recurring.isActive && recurring.dayOfMonth === currentDay;
}

export function getNextDate(recurring: RecurringExpense): string {
  const today = new Date();
  let next = setDate(today, recurring.dayOfMonth);
  if (next <= today) {
    next = addMonths(next, 1);
  }
  return next.toISOString().slice(0, 10);
}
