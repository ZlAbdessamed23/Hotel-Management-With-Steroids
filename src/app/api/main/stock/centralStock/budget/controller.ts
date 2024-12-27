

import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  AddMultipleBudgetsData,
  BudgetsResult2,
  BudgetsResult,
  BudgetResult
} from "@/app/api/main/stock/centralStock/budget/types";

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function addOrUpdateBudgets(
  data: AddMultipleBudgetsData,
  hotelId: string
): Promise<BudgetsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const results: BudgetResult[] = [];

      for (const budgetItem of data.budgets) {
        const budget = await prisma.budget.update({
          where: {
            id: budgetItem.budgetId,
          },
          data: {
            amount: budgetItem.amount,
          },
        });

        // Transform the Prisma result to match BudgetResult type
        results.push({
          budgetId: budget.id,
          amount: budget.amount,
        });
      }

      return { budgets: results };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllBudgets(
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<BudgetsResult2> {
  try {
    const Budgets = await prisma.budget.findMany({
      where: {
        hotelId: hotelId,
      },
    });

    return { budget: Budgets };
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////// check admin role ///////////////
export function checkAdminReceptionManagerStockManagerRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)&&!roles.includes(UserRole.reception_Manager)&&!roles.includes(UserRole.stock_Manager)) {
    throw new UnauthorizedError("Sauf l'Administrateur et reception manager et stock manager peut faire cette action");
  }
}
