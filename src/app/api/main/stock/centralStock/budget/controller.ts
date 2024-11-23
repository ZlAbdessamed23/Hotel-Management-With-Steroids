import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  AddMultipleBudgetsData,
  BudgetsResult2,
  BudgetsResult,
} from "@/app/api/main/stock/centralStock/budget/types";
import { ForbiddenError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

// Modified interface to handle multiple budgets

export async function addOrUpdateBudgets(
  data: AddMultipleBudgetsData,
  hotelId: string
): Promise<BudgetsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const results = [];

      for (const budgetItem of data.budgets) {
        // Try to find existing budget
        const existingBudget = await prisma.budget.findFirst({
          where: {
            hotelId,
            stockId: budgetItem.stockId,
          },
        });

        let budget;
        if (existingBudget) {
          // Update existing budget
          budget = await prisma.budget.update({
            where: {
              id: existingBudget.id,
            },
            data: {
              amount: budgetItem.amount,
            },
          });
        } else {
          // Create new budget
          budget = await prisma.budget.create({
            data: {
           stockId:budgetItem.stockId,
              amount: budgetItem.amount,
              

              hotelId,
            },
          });
        }
        results.push(budget);
      }

      return { budgets: results };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
////////////////////// get all not for employee ///////////////////
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
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new ForbiddenError("Sauf l'Administrateur peut faire cette action");
  }
}
