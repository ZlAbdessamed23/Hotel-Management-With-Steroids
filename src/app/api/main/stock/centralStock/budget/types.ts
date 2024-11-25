// types.ts
import { Prisma } from "@prisma/client";

export type BudgetItem = {
  budgetId: string;
  amount: number;
};

export type AddMultipleBudgetsData = {
  budgets: BudgetItem[];
};

// Modified to match the Prisma Budget model structure
export type BudgetResult = {
  budgetId: string;
  amount: number;
};

export type BudgetsResult = {
  budgets: BudgetResult[];
};

export type BudgetsResult2 = {
  budget: Prisma.BudgetGetPayload<{}>[];
};

// controller.ts
