import prisma from "@/lib/prisma/prismaClient";
import {
  AddStockTransactionData,
  TransactionResult,
  TransactionsResult,
} from "./types";
import {
  ConflictError,
  ForbiddenError,
  LimitExceededError,
  NotFoundError,
  SubscriptionError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { PrismaClient, TransactionOperationType, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateStockTransactionsStatistics } from "../../statistics/statistics";

export async function addStockTransaction(
  data: AddStockTransactionData,
 
  hotelId: string,
  userId:string,
  userRole:UserRole[]
): Promise<TransactionResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,data.stockId,userRole,prisma)
      const [hotel, item] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.item.findUnique({
          where: { id: data.stockItemId ,stockId:data.stockId},
        }),
      ]);

      if (!hotel) throw new NotFoundError("Hotel not trouvee");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel has no active subscription plan");
      if (!item) throw new NotFoundError("Stock item not trouvee");
      

      // Check if the transaction quantity is greater than the item quantity
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
      const transactionAmount = data.quantity * (item.unitPrice  || 0);
      const createdStockTransaction = await prisma.transaction.create({
        data: {
          ...transactionData,
          ...(data.type == TransactionOperationType.acheter ? {transactionAmount : transactionAmount}:{transactionAmount:0}),
          hotelId,
          itemId: stockItemId, // Use ItemId instead of stockItemId
        },
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
    throwAppropriateError(error);
  }
}

export async function getAllStockTransactions(
  hotelId: string
): Promise<TransactionsResult> {
  try {
    const stockTransactions = await prisma.transaction.findMany({
      where: { hotelId: hotelId },
    });

    return { Transactions: stockTransactions };
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
