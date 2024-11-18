import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {  PrismaClient, UserRole } from "@prisma/client";
import { StockItemsResult } from "@/app/api/main/stock/item/stockItems/[stockId]/types";
import prisma from "@/lib/prisma/prismaClient";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function getStockItems(
  stockId:string,
  hotelId: string,
  userId:string,
  userRole : UserRole[]
  
): Promise<StockItemsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,stockId,userRole,prisma)
      const stockItems = await prisma.item.findMany({
      where: {
        hotelId: hotelId,
        stockId
        
      },
    });

    return { Items: stockItems };})
    
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