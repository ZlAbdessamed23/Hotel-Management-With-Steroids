import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {  PrismaClient, UserRole } from "@prisma/client";
import { StockCategoriesResult } from "@/app/api/main/stock/category/stockCategories/[stockId]/types";
import prisma from "@/lib/prisma/prismaClient";
import {
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";

export async function getStockCategories(
  hotelId: string,
  stockId: string,
  userId:string,
  userRole:UserRole[]
): Promise<StockCategoriesResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,stockId,userRole,prisma)
      const stockCategories = await prisma.category.findMany({
      where: {
        hotelId: hotelId,
        stockId: stockId,
      },
      select : {
        id : true,
        description : true,
        createdAt  : true,
        stockId : true,
        name : true,
        
      }
    });

    return { Categories: stockCategories };})
    
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