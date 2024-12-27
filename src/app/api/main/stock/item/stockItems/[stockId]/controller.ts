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
      
      const stockItems = await prisma.item.findMany({
      where: {
        hotelId: hotelId,
        stockId
        
      },
      select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
        categoryId : true,isNeeded : true,quantity : true,description : true ,unit : true,unitPrice : true}
    });

    return { Items: stockItems };})
    
  } catch (error) {
    throwAppropriateError(error);
  }
}
