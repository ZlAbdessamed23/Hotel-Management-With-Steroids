import { Prisma, StockType } from "@prisma/client";

export type BudgetItem = {
  stockType: StockType;
  amount: number;
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
