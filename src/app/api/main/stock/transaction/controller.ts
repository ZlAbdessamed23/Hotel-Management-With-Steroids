import prisma from "@/lib/prisma/prismaClient";
import {
  AddStockTransactionData,
  TransactionResult,
  TransactionsResult,
} from "@/app/api/main/stock/transaction/types";
import {
 
  ForbiddenError,
  
  NotFoundError,
  
} from "@/lib/error_handler/customerErrors";
import {TransactionOperationType, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateStockTransactionsStatistics } from "@/app/api/main/statistics/statistics";

const TRANSACTION_HISTORY_LIMIT = 30;

export async function addStockTransaction(
  data: AddStockTransactionData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<TransactionResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First get the total count of transactions
      const [item, transactionCount] = await Promise.all([
        prisma.item.findUnique({
          where: { id: data.stockItemId, stockId: data.stockId },
        }),
        prisma.transaction.count({
          where: { hotelId }
        })
      ]);

      if (!item) throw new NotFoundError("Stock item not trouvee");

      // Only delete if we're about to exceed the limit
      if (transactionCount >= TRANSACTION_HISTORY_LIMIT) {
        // Calculate how many records to delete
        const deleteCount = transactionCount - TRANSACTION_HISTORY_LIMIT + 1;
        
        // Get the oldest records that need to be deleted
        const recordsToDelete = await prisma.transaction.findMany({
          where: { hotelId },
          orderBy: { createdAt: 'asc' },
          take: deleteCount,
          select: { id: true },
        });

        // Delete the oldest records
        await prisma.transaction.deleteMany({
          where: {
            id: {
              in: recordsToDelete.map((record) => record.id),
            },
          },
        });
      }

      // Check if the transaction quantity is valid
      if (data.type === TransactionOperationType.transferer && data.quantity > item.quantity) {
        throw new ForbiddenError(
          "Transaction quantity exceeds available item quantity"
        );
      }

      // Calculate the new quantity
      const newQuantity =
        data.type === TransactionOperationType.acheter
          ? item.quantity + data.quantity
          : item.quantity - data.quantity;

      // Update the item quantity and check if it's below the minimum
      const updatedItem = await prisma.item.update({
        where: { id: data.stockItemId },
        data: {
          quantity: newQuantity,
          isNeeded: newQuantity < item.minimumQuantity,
        },
      });

      const { stockItemId, ...transactionData } = data;
      const transactionAmount = data.quantity * (item.unitPrice || 0);
      
      const createdStockTransaction = await prisma.transaction.create({
        data: {
          ...transactionData,
          ...(data.type == TransactionOperationType.acheter 
            ? { transactionAmount }
            : { transactionAmount: 0 }),
          hotelId,
          itemId: stockItemId,
        },
        select: {
          id: true,
          transactionAmount: true,
          type: true,
          quantity: true,
          createdAt: true,
          itemId: true,
          hotelId: true
        }
      });

      if (data.type === TransactionOperationType.acheter) {
        await updateStockTransactionsStatistics(
          hotelId,
          transactionAmount,
          prisma
        );
      }

      return {
        Transaction: createdStockTransaction,
      };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function getAllStockTransactions(
  hotelId: string
): Promise<TransactionsResult> {
  try {
    const stockTransactions = await prisma.transaction.findMany({
      where: { hotelId: hotelId },
      select:{
        id:true,
        transactionAmount:true,
        type:true,
        quantity:true,
        createdAt:true,
        itemId:true,
        hotelId:true
      }
    });

    return { Transactions: stockTransactions };
  } catch (error) {
    throwAppropriateError(error);
  }
}


