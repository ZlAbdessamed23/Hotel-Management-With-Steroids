import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient,  UserRole } from "@prisma/client";
import { StockTransactionsResult } from "@/app/api/main/stock/transaction/stockTransactions/[stockType]/types";
import prisma from "@/lib/prisma/prismaClient";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function getStockTransactions(
  stockId:string,
  hotelId: string,
  userId:string,
  userRole:UserRole[]
  
): Promise<StockTransactionsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,stockId,userRole,prisma)
      const stockTransactions = await prisma.transaction.findMany({
      where: {
        hotelId: hotelId,
        stockId
      },
    });

    return { Transactions: stockTransactions };})
    
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function checkUserStockAccess(
  userId: string,
  stockId: string,
  userRole: UserRole[],
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<void> {
  try {
   
    if (userRole.includes(UserRole.admin)) {
      return;
    }

    const stockEmployee = await prisma.stockEmployee.findUnique({
      where: {
        stockId_employeeId: {
          stockId,
          employeeId: userId,
        },
      },
    });

    
    if (!stockEmployee) {
      throw new UnauthorizedError(
        "L'utilisateur n'est pas autorisé à accéder à ce stock"
      );
    }
  } catch (error) {
    throwAppropriateError(error);
  }
}
