import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { StockDashboardResult, StockDashboardData } from "./types";
import { UserRole } from "@prisma/client";
import { ForbiddenError } from "@/lib/error_handler/customerErrors";

export async function getStockData(
  hotelId: string
): Promise<StockDashboardResult> {
  try {
    

    const [items, transactions, budgets, categoryCount] = await Promise.all([
      prisma.item.findMany({
        where: { hotelId },
        select: {
          quantity: true,
          stockType: true,
          name: true,
          isNeeded: true,
          supplierAddress: true,
          supplierName: true,
          supplierPhone: true,
          category: { select: { name: true } },
        },
      }),
      prisma.transaction.findMany({
        where: { hotelId },
        select: { type: true, transactionAmount: true, stockType: true , createdAt : true },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.budget.findMany({
        where: { hotelId },
        select: { amount: true, stockType: true, id: true },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({
        where: { hotelId },
      }),
    ]);

    // Process items

    const dashboardData: StockDashboardData = {
      categoryCount,
      items: items,
      transactions: transactions,
      budgets: budgets,
    };

    console.log("Stock dashboard data fetched:", dashboardData);

    return { data: dashboardData };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new ForbiddenError("Sauf l'Administrateur peut faire cette action");
  }
}
