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
  userId:string,
  userRole:UserRole[]
): Promise<CategoryResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserStockAccess(userId,data.stockId,userRole,prisma)
      const stock = await prisma.stock.findUnique({
        where: { id: data.stockId },
        include: {
          hotel: {
            select: {
              subscription: {
                include: {
                  plan: true,
                },
              },
              _count: {
                select: {
                  stockCategory: {
                    where: {
                      stockId: data.stockId,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!stock || !stock.hotel) throw new NotFoundError("Stock or Hotel not found");
      if (!stock.hotel.subscription?.plan)
        throw new SubscriptionError("Hotel doesn't have an active subscription");

      const stockCategoryCount = stock.hotel._count.stockCategory;
      if (stockCategoryCount >= stock.hotel.subscription.plan.maxStockCategory) {
        throw new LimitExceededError(
          "The maximum number of stock categories for this plan has been reached"
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