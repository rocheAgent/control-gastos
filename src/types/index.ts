export type Theme = "light" | "dark";
export type Currency = "MXN" | "USD";
export type DebtType = "credit_card" | "loan" | "personal";
export type PaymentType = "minimum" | "extra" | "full";

export interface UserSettings {
  theme: Theme;
  currency: Currency;
  exchangeRate: number;
  budgetAlertThreshold: number;
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
  isDefault: boolean;
}

export interface Income {
  id: string;
  amount: number;
  currency: Currency;
  source: string;
  date: string;
  isRecurring: boolean;
  recurrence?: string;
  description?: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  categoryId: string;
  subcategoryId?: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  recurringId?: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  categoryId: string;
  subcategoryId?: string;
  dayOfMonth: number;
  isActive: boolean;
  nextDate: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  type: PaymentType;
}

export interface Debt {
  id: string;
  type: DebtType;
  name: string;
  totalAmount: number;
  currency: Currency;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  payments: DebtPayment[];
  status: "active" | "paid";
}

export interface BudgetLimit {
  categoryId: string;
  monthlyLimit: number;
  currency: Currency;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  currency: Currency;
}
