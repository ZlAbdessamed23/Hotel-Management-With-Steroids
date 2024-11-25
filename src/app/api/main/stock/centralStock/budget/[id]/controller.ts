import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  BudgetResult,
  UpdateBudgetData,
} from "@/app/api/main/stock/centralStock/budget/[id]/types";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { ForbiddenError } from "@/lib/error_handler/customerErrors";

export async function updateBudget(
  budgetId: string,

  hotelId: string,
  data: UpdateBudgetData
): Promise<BudgetResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.BudgetUpdateInput = {
        amount: data.amount,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.BudgetUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.BudgetUpdateInput];
        }
      });

      const updatedBudget = await prisma.budget.update({
        where: {
          id: budgetId,
          hotelId,
        },
        data: updateData,
      });

      return { Budget: updatedBudget };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new ForbiddenError("Sauf l'Administrateur peut faire cette action");
  }
}
