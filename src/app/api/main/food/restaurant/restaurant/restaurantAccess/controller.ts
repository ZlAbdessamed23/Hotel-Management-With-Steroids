import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { RestaurantsResult } from "@/app/api/main/food/restaurant/restaurant/restaurantAccess/types";

export async function getAccessRestaurants(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<RestaurantsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      if(userRole.includes(UserRole.admin)){
        const Restaurants = await prisma.restaurant.findMany({
          where: {
            hotel: { id: hotelId },
          },
          select: { id: true, name: true, description: true },
        });
  
        return { Restaurants: Restaurants };
      }
      const Restaurants = await prisma.restaurant.findMany({
        where: {
          hotel: { id: hotelId },
          restaurantEmployee: {
            some: {
              employeeId:userId
            },
          },
        },
        select: { id: true, name: true, description: true },
      });

      return { Restaurants: Restaurants };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
