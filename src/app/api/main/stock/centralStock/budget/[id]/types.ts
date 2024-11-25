import { Prisma } from "@prisma/client";
export type UpdateBudgetData = {
  amount?: number;
};

export type BudgetResult = {
  Budget: Prisma.BudgetGetPayload<{}>;
};
