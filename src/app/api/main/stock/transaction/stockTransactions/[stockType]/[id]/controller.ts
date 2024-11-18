import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { TransactionResult } from "./types";
export async function getStockTransactionById(
  transactionId: string,
  stockId:string,
  hotelId: string,
  userId : string,
  userRole:UserRole[]
): Promise<TransactionResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,stockId,userRole,prisma)
      const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId, hotelId: hotelId },
    });

    if (!existingTransaction || existingTransaction.hotelId !== hotelId) {
      throw new NotFoundError(
        `Stock Transaction with ID ${transactionId} not found in hotel ${hotelId}`
      );
    }

    return { Transaction: existingTransaction };})
    
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export async function deleteStockTransactionById(
  transactionId: string,
  stockId:string,
  hotelId: string,
  userId : string,
  userRole:UserRole[]
): Promise<TransactionResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,stockId,userRole,prisma)
      const deletedTransaction = await prisma.transaction.delete({
      where: { id: transactionId, hotelId: hotelId },
    });

    

    return { Transaction: deletedTransaction };})
    
  } catch (error) {
    throw throwAppropriateError(error);
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