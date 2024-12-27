import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {  PrismaClient, UserRole } from "@prisma/client";
import { StockCategoriesResult } from "@/app/api/main/stock/category/stockCategories/[stockId]/types";
import prisma from "@/lib/prisma/prismaClient";
import {
  UnauthorizedError,
  
} from "@/lib/error_handler/customerErrors";

export async function getStockCategories(
  hotelId: string,
  stockId: string,
 
): Promise<StockCategoriesResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const stockCategories = await prisma.category.findMany({
      where: {
        hotelId: hotelId,
        stockId: stockId,
      },
      select : {
        id : true,
        description : true,
        createdAt  : true,
        
        name : true,
        
      }
    });

    return { Categories: stockCategories };})
    
  } catch (error) {
    throwAppropriateError(error);
  }
}

