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
     
      const stockTransactions = await prisma.transaction.findMany({
      where: {
        hotelId: hotelId,
        stockId
      },
    });
  console.log(stockTransactions)
    return { Transactions: stockTransactions };})
    
  } catch (error) {
    throwAppropriateError(error);
  }
}


