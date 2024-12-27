import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddCafeteriaMenuData,
  CafeteriaMenuResult,
  CafeteriaMenusResult,
} from "@/app/api/main/food/cafeteria/menu/types";
import {
  LimitExceededError,
  UnauthorizedError,
  NotFoundError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { PrismaClient, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateCafeteriaMenuStatistics } from "@/app/api/main/statistics/statistics";

export async function addCafeteriaMenu(
  data: AddCafeteriaMenuData,
  hotelId: string,
  userId : string,
  userRole : UserRole[]
): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const [hotel, cafeteriaMenuCount] = await Promise.all([
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
        prisma.cafeteriaMenu.count({ where: { hotelId } }),
        
      ]);

      if (!hotel) throw new NotFoundError("Hotel non Trouvee");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");

      if (cafeteriaMenuCount >= hotel.subscription.plan.maxCafeteriaMenu) {
        throw new LimitExceededError(
          "Le nombre Maximum des cafeteria menues pour ce plan est déja atteint"
        );
      }
      

      const createdCafeteriaMenu = await prisma.cafeteriaMenu.create({
        data: { ...data, hotelId },
        select : {
          id : true,
          endTime : true,
          startTime : true,
          name : true,
          createdAt : true,
          cafeteriaId : true,
          description : true,
    
        }
        
      });
      await updateCafeteriaMenuStatistics(hotelId, "add", prisma);

      return { CafeteriaMenu: createdCafeteriaMenu };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllCafeteriaMenus(
  hotelId: string
): Promise<CafeteriaMenusResult> {
  try {
    const cafeteriaMenus = await prisma.cafeteriaMenu.findMany({
      where: { hotelId: hotelId },
      select : {
        id : true,
        endTime : true,
        startTime : true,
        name : true,
        createdAt : true,
        cafeteriaId : true,
        description : true,
  
      }
    });

    return { CafeteriaMenus: cafeteriaMenus };
  } catch (error) {
    throwAppropriateError(error);
  }
}

