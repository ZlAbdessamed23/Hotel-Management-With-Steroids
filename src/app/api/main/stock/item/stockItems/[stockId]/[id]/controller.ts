import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  ItemResult,
  UpdateStockItemData,
} from "@/app/api/main/stock/item/stockItems/[stockId]/[id]/types";
import { updateStockItemsStatistics } from "@/app/api/main/statistics/statistics";

export async function getStockItemById(
  itemId: string,
  stockId:string,
  hotelId: string,
  userId : string,
  userRole : UserRole[]
): Promise<ItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const existingItem = await prisma.item.findUnique({
      where: { id: itemId, hotelId: hotelId,stockId },
      select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
        categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}
    });

    if (!existingItem ) {
      throw new NotFoundError(`Stock item non trouvée`);
    }

    return { Item: existingItem };})
    
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteStockItem(
  itemId: string,
  
  hotelId: string,
 
): Promise<ItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      

      const deletedItem = await prisma.item.delete({
        where: { id: itemId, hotelId: hotelId },
        select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
          categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}
      });
      await updateStockItemsStatistics(hotelId, "remove", prisma);
      return { Item: deletedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateStockItem(
  itemId: string,
  stockId : string,
  hotelId: string,
  
  data: UpdateStockItemData
): Promise<ItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      

      const updateData: Prisma.ItemUpdateInput = {
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        sku: data.sku,
        unit: data.unit,
        minimumQuantity: data.minimumQuantity,
        supplierName: data.supplierName,
        supplierPhone: data.supplierPhone,
        supplierEmail: data.supplierEmail,
        supplierAddress: data.supplierAddress,
        category: data.stockCategoryId
          ? { connect: { id: data.stockCategoryId } }
          : undefined,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.ItemUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.ItemUpdateInput];
        }
      });

      const updatedItem = await prisma.item.update({
        where: { id: itemId,stockId,hotelId },
        data: updateData,
      });

      return { Item: updatedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  };
};


