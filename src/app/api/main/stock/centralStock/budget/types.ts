import { Prisma } from "@prisma/client";

export type BudgetItem = {
  
  amount: number;
  stockId : string
};

export type AddMultipleBudgetsData = {
  budgets: BudgetItem[];
};
export type BudgetsResult = {
  budgets: BudgetItem[];
};
export type BudgetsResult2 = {
  budget: Prisma.BudgetGetPayload<{}>[];
};
