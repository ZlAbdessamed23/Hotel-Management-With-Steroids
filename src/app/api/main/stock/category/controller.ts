import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddStockCategoryData,
  CategoryResult,
  CategoriesResult,
} from "./types";
import {
  LimitExceededError,
  UnauthorizedError,
  NotFoundError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { PrismaClient, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addStockCategory(
  data: AddStockCategoryData,
  hotelId:string,
  
): Promise<CategoryResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      // Get hotel with subscription plan and counts
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

      const createdStockCategory = await prisma.category.create({
        data: { ...data,hotelId },
        select : {
          id : true,
          description : true,
          createdAt  : true,
          stockId : true,
          name : true,
          
        }
      });

      return { Category: createdStockCategory };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllStockCategories(
  stockId: string
): Promise<CategoriesResult> {
  try {
    const stockCategories = await prisma.category.findMany({
      where: { stockId: stockId },
      select : {
        id : true,
        description : true,
        createdAt  : true,
        stockId : true,
        name : true,
        
      }
    });

    return { Categories: stockCategories };
  } catch (error) {
    throwAppropriateError(error);
  }
}



