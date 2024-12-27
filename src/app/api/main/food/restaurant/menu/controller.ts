import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddRestaurantMenuData,
  RestaurantMenuResult,
  RestaurantMenusResult,
} from "@/app/api/main/food/restaurant/menu/types";
import {
  LimitExceededError,
  UnauthorizedError,
  NotFoundError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { PrismaClient, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addRestaurantMenu(
  data: AddRestaurantMenuData,
  hotelId: string,
  userId : string,
  userRole : UserRole[]
): Promise<RestaurantMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const [hotel, restaurantMenuCount] = await Promise.all([
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
        prisma.restaurantMenu.count({ where: { hotelId } }),
      ]);

      if (!hotel) throw new NotFoundError("Hotel non trouvée");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");

      if (restaurantMenuCount >= hotel.subscription.plan.maxRestaurantMenu) {
        throw new LimitExceededError(
          "Le nombre Maximum des employées pour ce plan est déja atteint"
        );
      }

      const createdRestaurantMenu = await prisma.restaurantMenu.create({
        data: { ...data, hotelId },
        select : {
          id : true,
          name  :true,
          createdAt : true,
          description : true,
          lunchStartTime : true,
           lunchEndTime : true,
           dinnerStartTime : true,
           dinnerEndTime : true,
           restaurantId : true,
        
            
      
        }
      });

      return { RestaurantMenu: createdRestaurantMenu };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllRestaurantMenus(
  hotelId: string
): Promise<RestaurantMenusResult> {
  try {
    const restaurantMenus = await prisma.restaurantMenu.findMany({
      where: { hotelId: hotelId },select : {
        id : true,
        name  :true,
        createdAt : true,
        description : true,
        lunchStartTime : true,
         lunchEndTime : true,
         dinnerStartTime : true,
         dinnerEndTime : true,
         restaurantId : true,
      
          
    
      }
    });

    return { RestaurantMenus: restaurantMenus };
  } catch (error) {
    throwAppropriateError(error);
  }
}


