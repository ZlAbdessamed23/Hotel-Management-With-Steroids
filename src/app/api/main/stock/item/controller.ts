import prisma from "@/lib/prisma/prismaClient";
import { AddStockItemData, ItemResult, ItemsResult } from "@/app/api/main/stock/item/types";
import {
  
  LimitExceededError,
  NotFoundError,
  SubscriptionError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { PrismaClient, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateStockItemsStatistics } from "@/app/api/main/statistics/statistics";

export async function addStockItem(
  data: AddStockItemData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<ItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
          _count: {
            select: {
              stockItem: true,
              
            },
          },
        },
      });
        

      if (!hotel) throw new NotFoundError("Hotel not trouvée");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
      


      const itemCount = hotel._count.stockItem;

      if (itemCount >= hotel.subscription.plan.maxStockItem) {
        throw new LimitExceededError(
          "Le nombre Maximum des stock items pour ce plan est déja atteint"
        );
      }
      const { stockCategoryId, ...itemData } = data;
      const createdStockItem = await prisma.item.create({
        data: {
          ...itemData,
          hotelId,
          categoryId: stockCategoryId,
        },
        select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
          categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}
      });
      await updateStockItemsStatistics(hotelId, "add", prisma);
      return { Item: createdStockItem };
    });
  } catch (error) {
    throwAppropriateError(error);
  };
}

export async function getAllStockItems(hotelId: string): Promise<ItemsResult> {
  try {
    const stockItems = await prisma.item.findMany({
      where: { hotelId: hotelId },
      select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
        categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}
    });

    return { Items: stockItems };
  } catch (error) {
    throwAppropriateError(error);
  }
}


