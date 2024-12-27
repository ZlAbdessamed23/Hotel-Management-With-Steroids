import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { StockDashboardResult, StockDashboardData } from "@/app/api/main/stock/centralStock/types";
import { UserRole } from "@prisma/client";
import { ForbiddenError } from "@/lib/error_handler/customerErrors";

export async function getStockData(
  hotelId: string
): Promise<StockDashboardResult> {
  try {
    

    const [items, transactions, budgets,stocks, categoryCount] = await Promise.all([
      prisma.item.findMany({
        where: { hotelId },
        select: {
          quantity: true,
          
          name: true,
          isNeeded: true,
          supplierAddress: true,
          supplierName: true,
          supplierPhone: true,
          stockId:true,
          category: { select: { name: true } },
        },
      }),
      prisma.transaction.findMany({
        where: { hotelId },
        select: { type: true, transactionAmount: true , createdAt : true,stockId:true },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.budget.findMany({
        where: { hotelId },
        select: { amount: true,stockId:true, id: true },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.stock.findMany({
        where: { hotelId },
        select: {id:true,name:true },
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
      stocks : stocks
    };

    

    return { data: dashboardData };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionManagerStockManagerAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)&&!roles.includes(UserRole.reception_Manager)&&!roles.includes(UserRole.stock_Manager)) {
    throw new ForbiddenError("Sauf l'Administrateur et reception manager et stock manager peut faire cette action");
  }
}
