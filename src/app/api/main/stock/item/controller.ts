import prisma from "@/lib/prisma/prismaClient";
import { AddStockItemData, ItemResult, ItemsResult } from "./types";
import {
  ConflictError,
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
      await checkUserStockAccess(userId, data.stockId, userRole, prisma)
      const [hotel, category] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
            _count: {
              select: {
                stockItem: {
                  where: {
                    stockId: data.stockId,
                  },
                },
              },
            },
          },
        }),
        prisma.category.findUnique({
          where: { id: data.stockCategoryId, stockId: data.stockId },
        }),
      ]);

      if (!hotel) throw new NotFoundError("Hotel not trouvée");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
      if (!category) throw new NotFoundError("Stock category non trouvée");


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
    });

    return { Items: stockItems };
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
    };

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
  };
};